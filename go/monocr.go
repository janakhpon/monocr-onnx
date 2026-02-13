package main

import (
	"fmt"
	"image"
	"image/color"
	_ "image/jpeg"
	_ "image/png"
	"io/ioutil"
	"log"
	"math"
	"os"
	"path/filepath"

	"github.com/yalue/onnxruntime_go"
)

type MonOCR struct {
	session *onnxruntime_go.DynamicAdvancedSession
	charset string
}

func NewMonOCR(modelPath, charsetPath string) (*MonOCR, error) {
	// Initialize ONNX Runtime
	onnxruntime_go.SetSharedLibraryPath("libonnxruntime.so") // This might need explicit path handling depending on OS
	err := onnxruntime_go.InitializeEnvironment()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize onnxruntime: %v", err)
	}

	session, err := onnxruntime_go.NewDynamicAdvancedSession(
		modelPath,
		[]string{"input"},
		[]string{"output"},
		nil,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %v", err)
	}

	charsetBytes, err := ioutil.ReadFile(charsetPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read charset: %v", err)
	}
	charset := string(charsetBytes)

	return &MonOCR{
		session: session,
		charset: charset,
	}, nil
}

func (m *MonOCR) Preprocess(img image.Image) ([]float32, int64, int64) {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	targetHeight := 64
	aspectRatio := float64(width) / float64(height)
	targetWidth := int(math.Round(float64(targetHeight) * aspectRatio))

	// Resize and convert to grayscale manually or use library
	// For simplicity, let's assume input is handling resizing or rely on basic Go image manipulation
	// In a real package, use "golang.org/x/image/draw" for high-quality resizing.
	
	// Create tensor data (Simulated resize for structural correctness)
	inputData := make([]float32, 1*1*targetHeight*targetWidth)
	
	for y := 0; y < targetHeight; y++ {
		for x := 0; x < targetWidth; x++ {
			// Nearest neighbor interpolation from original image (very naive)
			srcX := int(float64(x) * float64(width) / float64(targetWidth))
			srcY := int(float64(y) * float64(height) / float64(targetHeight))
			
			r, g, b, _ := img.At(srcX, srcY).RGBA()
			// Convert to grayscale: 0.299*R + 0.587*G + 0.114*B
			gray := 0.299*float64(r) + 0.587*float64(g) + 0.114*float64(b)
			// Normalize to 0-1
			inputData[y*targetWidth+x] = float32(gray / 65535.0) 
		}
	}
	
	return inputData, int64(targetHeight), int64(targetWidth)
}

func (m *MonOCR) Decode(preds []float32) string {
	decodedText := ""
	prevIdx := -1
	
	numClasses := len(m.charset) + 1
	seqLen := len(preds) / numClasses
	
	for t := 0; t < seqLen; t++ {
		maxVal := float32(-math.MaxFloat32)
		maxIdx := 0
		
		for c := 0; c < numClasses; c++ {
			val := preds[t*numClasses+c]
			if val > maxVal {
				maxVal = val
				maxIdx = c
			}
		}
		
		if maxIdx != 0 && maxIdx != prevIdx {
			// +1 because charset is 0-indexed string, but index 0 is blank
			// In our charset string, char at index i corresponds to class i+1
			if maxIdx-1 < len(m.charset) {
				decodedText += string(m.charset[maxIdx-1])
			}
		}
		prevIdx = maxIdx
	}
	
	return decodedText
}

func (m *MonOCR) Predict(imagePath string) (string, error) {
	f, err := os.Open(imagePath)
	if err != nil {
		return "", err
	}
	defer f.Close()
	
	img, _, err := image.Decode(f)
	if err != nil {
		return "", err
	}
	
	inputData, h, w := m.Preprocess(img)
	inputTensor, err := onnxruntime_go.NewTensor(inputData, []int64{1, 1, h, w})
	if err != nil {
		return "", err
	}
	defer inputTensor.Destroy()
	
	outputInfo, err := m.session.Run([]*onnxruntime_go.Tensor[float32]{inputTensor}, []string{"output"})
	if err != nil {
		return "", err
	}
	
	// Assuming output[0] is the logits
	outputTensor := outputInfo[0]
	defer outputTensor.Destroy()
	
	preds := outputTensor.GetData()
	return m.Decode(preds), nil
}

func main() {
	// Example usage
	if len(os.Args) < 2 {
		fmt.Println("Usage: monocr <image_path>")
		return
	}
	
	ocr, err := NewMonOCR("../model/monocr.onnx", "../model/charset.txt")
	if err != nil {
		log.Fatalf("Failed to init MonOCR: %v", err)
	}
	
	text, err := ocr.Predict(os.Args[1])
	if err != nil {
		log.Fatalf("Prediction failed: %v", err)
	}
	
	fmt.Printf("OCR Result: %s\n", text)
}
