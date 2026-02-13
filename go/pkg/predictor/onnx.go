package predictor

import (
	"fmt"
	"image"
	_ "image/jpeg"
	_ "image/png"
	"math"

	"github.com/yalue/onnxruntime_go"
	"golang.org/x/image/draw"
)

type Predictor struct {
	session *onnxruntime_go.DynamicAdvancedSession
	charset string
}

func NewPredictor(modelPath, charset string) (*Predictor, error) {
	// Initialize ONNX Runtime environment if not already initialized
	// Note: SetSharedLibraryPath might be needed depending on system
    // For now we assume the default or system library is available
    if !onnxruntime_go.IsInitialized() {
        if err := onnxruntime_go.InitializeEnvironment(); err != nil {
            // Check if we can find the library from JS SDK node_modules as a fallback
             return nil, fmt.Errorf("failed to initialize ONNX Runtime: %v. Make sure libonnxruntime.so is in your library path", err)
        }
    }

	options, err := onnxruntime_go.NewSessionOptions()
    if err != nil {
        return nil, fmt.Errorf("failed to create session options: %v", err)
    }
	defer options.Destroy()

	inputs := []string{"input"}
	outputs := []string{"output"}
	
	session, err := onnxruntime_go.NewDynamicAdvancedSession(
		modelPath,
		inputs,
		outputs,
		options,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %v", err)
	}

	return &Predictor{
		session: session,
		charset: charset,
	}, nil
}

func (p *Predictor) Close() error {
	if p.session != nil {
		return p.session.Destroy()
	}
	return nil
}

func (p *Predictor) Predict(img image.Image) (string, error) {
	inputData, h, w, err := p.preprocess(img)
	if err != nil {
		return "", err
	}

    // Correct usage of NewTensor based on original code and common usage
    // It seems NewTensor takes shape []int64, then data
	shape := []int64{1, 1, int64(h), int64(w)}
	inputTensor, err := onnxruntime_go.NewTensor(shape, inputData)
	if err != nil {
		return "", fmt.Errorf("failed to create input tensor: %v", err)
	}
	defer inputTensor.Destroy()

    // Run expects []Value, so we need to copy inputTensor into a []Value slice
    inputValues := []onnxruntime_go.Value{inputTensor}
    outputValues := make([]onnxruntime_go.Value, 1)

	err = p.session.Run(inputValues, outputValues)
	if err != nil {
		return "", fmt.Errorf("inference failed: %v", err)
	}
	
	outputTensor := outputValues[0]
    if outputTensor == nil {
         return "", fmt.Errorf("output tensor is nil")
    }
    // outputTensor is a Value, we need to assert it to Tensor to GetData
	defer outputTensor.Destroy()

    // Assuming output is float32 tensor
    // We need to type assert or use GetData() on the specific tensor type if generic
    // Let's assume output[0] is *Tensor[float32] which implements Value?
    // Actually NewDynamicAdvancedSession.Run returns []Value.
    // We might need to cast output[0] via interface check or assume it's Tensor[float32]
    
    // In original code: outputTensor := outputInfo[0]; preds := outputTensor.GetData()
    // But that was checking return of Run?
    
    // Let's check the type assertion
    outTensorFloat, ok := outputTensor.(*onnxruntime_go.Tensor[float32])
    if !ok {
        return "", fmt.Errorf("unexpected output tensor type")
    }

	return p.decode(outTensorFloat.GetData()), nil
}

func (p *Predictor) preprocess(img image.Image) ([]float32, int, int, error) {
	bounds := img.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	targetHeight := 64
	aspectRatio := float64(width) / float64(height)
	targetWidth := int(math.Round(float64(targetHeight) * aspectRatio))

	// Resize using high quality resampling
	dst := image.NewGray(image.Rect(0, 0, targetWidth, targetHeight))
	draw.CatmullRom.Scale(dst, dst.Bounds(), img, img.Bounds(), draw.Over, nil)

	// Normalize
	inputData := make([]float32, targetWidth*targetHeight)
	for i, v := range dst.Pix {
		// 0-255 -> 0.0-1.0
		inputData[i] = float32(v) / 255.0
	}

	return inputData, targetHeight, targetWidth, nil
}

func (p *Predictor) decode(preds []float32) string {
	decodedText := ""
	prevIdx := -1
	
	// numClasses = charset + blank
	numClasses := len(p.charset) + 1
	seqLen := len(preds) / numClasses
	
	// Charset array for lookup (runes)
	charsetRunes := []rune(p.charset)

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
			// maxIdx 0 is blank
			// maxIdx 1..N maps to charset[0..N-1]
			charIdx := maxIdx - 1
			if charIdx < len(charsetRunes) {
				decodedText += string(charsetRunes[charIdx])
			}
		}
		prevIdx = maxIdx
	}
	
	return decodedText
}
