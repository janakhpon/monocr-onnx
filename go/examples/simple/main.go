package main

import (
	"fmt"
	"log"
	"path/filepath"
	"runtime"

	"github.com/janakh/monocr-onnx/go"
)

func main() {
	// Get path to test image
	_, filename, _, _ := runtime.Caller(0)
	projectRoot := filepath.Join(filepath.Dir(filename), "../../..")
	imagePath := filepath.Join(projectRoot, "data/images/test_0005.jpg")

	fmt.Printf("Reading image: %s\n", imagePath)
	fmt.Println("Model: Auto-downloading/cached")
	fmt.Println()

	text, err := monocr.ReadImage(imagePath)
	if err != nil {
		log.Fatalf("Error: %v", err)
	}

	fmt.Println("Recognized Text:")
	fmt.Println("================")
	fmt.Println(text)
	fmt.Println("================")
}
