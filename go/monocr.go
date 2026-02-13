package monocr

import (
	_ "embed"
	"fmt"
	"image"
	_ "image/jpeg"
	"image/png"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/janakh/monocr-onnx/go/pkg/model"
	"github.com/janakh/monocr-onnx/go/pkg/predictor"
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

// ReadImageWithModel allows specifying custom model and charset paths.
func ReadImageWithModel(imagePath, modelPath, charset string) (string, error) {
	pred, err := predictor.NewPredictor(modelPath, charset)
	if err != nil {
		return "", err
	}
	defer pred.Close()

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

	var results []string
	pred, err := predictor.NewPredictor(modelPath, embeddedCharset)
	if err != nil {
		return nil, err
	}
	defer pred.Close()

	for _, file := range files {
		if strings.HasSuffix(file.Name(), ".png") {
			imgPath := filepath.Join(tempDir, file.Name())
			
			f, err := os.Open(imgPath)
			if err != nil {
				continue
			}
			
			img, err := png.Decode(f)
			f.Close()
			if err != nil {
				continue
			}

			text, err := pred.Predict(img)
			if err != nil {
				continue
			}
			results = append(results, text)
		}
	}

	return results, nil
}
