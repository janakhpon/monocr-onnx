package monocr

import (
	_ "embed"
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/MonDevHub/monocr-onnx/go/pkg/model"
	"github.com/MonDevHub/monocr-onnx/go/pkg/predictor"
)

//go:embed charset.txt
var embeddedCharset string

// ReadImage recognizes text from an image file.
// It automatically downloads the model if not present.
func ReadImage(imagePath string) (string, error) {
	manager, err := model.NewManager()
	if err != nil {
		return "", err
	}

	modelPath, err := manager.GetModelPath()
	if err != nil {
		return "", err
	}

	return ReadImageWithModel(imagePath, modelPath, embeddedCharset)
}

// ReadImages recognizes text from multiple image files.
func ReadImages(imagePaths []string) ([]string, error) {
	manager, err := model.NewManager()
	if err != nil {
		return nil, err
	}

	modelPath, err := manager.GetModelPath()
	if err != nil {
		return nil, err
	}

	pred, err := predictor.NewPredictor(modelPath, embeddedCharset)
	if err != nil {
		return nil, err
	}
	defer pred.Close()

	var results []string
	for _, path := range imagePaths {
		text, err := predictFile(pred, path)
		if err != nil {
			return nil, err
		}
		results = append(results, text)
	}
	return results, nil
}

// ReadImageWithAccuracy recognizes text and calculates accuracy against ground truth.
func ReadImageWithAccuracy(imagePath, groundTruth string) (string, float64, error) {
	text, err := ReadImage(imagePath)
	if err != nil {
		return "", 0, err
	}
	accuracy := calculateAccuracy(text, groundTruth)
	return text, accuracy, nil
}

// ReadImageWithModel allows specifying custom model and charset paths.
func ReadImageWithModel(imagePath, modelPath, charset string) (string, error) {
	pred, err := predictor.NewPredictor(modelPath, charset)
	if err != nil {
		return "", err
	}
	defer pred.Close()

	return predictFile(pred, imagePath)
}

func predictFile(pred *predictor.Predictor, imagePath string) (string, error) {
	f, err := os.Open(imagePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	img, _, err := image.Decode(f)
	if err != nil {
		return "", fmt.Errorf("failed to decode image: %v", err)
	}

	return pred.Predict(img)
}

// ReadPDF recognizes text from a PDF file (requires pdftoppm/poppler-utils).
func ReadPDF(pdfPath string) ([]string, error) {
	// Check for pdftoppm
	_, err := exec.LookPath("pdftoppm")
	if err != nil {
		return nil, fmt.Errorf("pdftoppm not found: please install poppler-utils")
	}

	manager, err := model.NewManager()
	if err != nil {
		return nil, err
	}

	modelPath, err := manager.GetModelPath()
	if err != nil {
		return nil, err
	}

	return readPDFWithModel(pdfPath, modelPath, embeddedCharset)
}

// ReadPDFs recognizes text from multiple PDF files.
func ReadPDFs(pdfPaths []string) ([][]string, error) {
	// Check for pdftoppm
	_, err := exec.LookPath("pdftoppm")
	if err != nil {
		return nil, fmt.Errorf("pdftoppm not found: please install poppler-utils")
	}

	manager, err := model.NewManager()
	if err != nil {
		return nil, err
	}

	modelPath, err := manager.GetModelPath()
	if err != nil {
		return nil, err
	}

	var results [][]string
	for _, path := range pdfPaths {
		pages, err := readPDFWithModel(path, modelPath, embeddedCharset)
		if err != nil {
			return nil, err
		}
		results = append(results, pages)
	}
	return results, nil
}

func readPDFWithModel(pdfPath, modelPath, charset string) ([]string, error) {
	// Create temp dir
	tempDir, err := os.MkdirTemp("", "monocr-go-")
	if err != nil {
		return nil, err
	}
	defer os.RemoveAll(tempDir)

	// Convert PDF to images
	cmd := exec.Command("pdftoppm", "-png", "-r", "300", pdfPath, filepath.Join(tempDir, "page"))
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("failed to convert PDF: %v", err)
	}

	// Read all generated images
	files, err := os.ReadDir(tempDir)
	if err != nil {
		return nil, err
	}

	pred, err := predictor.NewPredictor(modelPath, charset)
	if err != nil {
		return nil, err
	}
	defer pred.Close()

	var results []string
	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".png") {
			imgPath := filepath.Join(tempDir, file.Name())
			text, err := predictFile(pred, imgPath)
			if err != nil {
				continue
			}
			results = append(results, text)
		}
	}

	return results, nil
}

// Levenshtein distance calculation
func levenshtein(s1, s2 []rune) int {
	len1, len2 := len(s1), len(s2)
	column := make([]int, len1+1)

	for y := 1; y <= len1; y++ {
		column[y] = y
	}

	for x := 1; x <= len2; x++ {
		column[0] = x
		lastDiag := x - 1
		for y := 1; y <= len1; y++ {
			oldDiag := column[y]
			cost := 0
			if s1[y-1] != s2[x-1] {
				cost = 1
			}
			column[y] = min(column[y]+1, min(column[y-1]+1, lastDiag+cost))
			lastDiag = oldDiag
		}
	}
	return column[len1]
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

func calculateAccuracy(pred, truth string) float64 {
	p := []rune(pred)
	t := []rune(truth)
	
	if len(t) == 0 {
		if len(p) == 0 {
			return 100.0
		}
		return 0.0
	}
	
	dist := levenshtein(p, t)
	maxLen := len(p)
	if len(t) > maxLen {
		maxLen = len(t)
	}
	
	if maxLen == 0 {
		return 100.0
	}
	
	return (1.0 - float64(dist)/float64(maxLen)) * 100.0
}
