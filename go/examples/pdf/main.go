package main

import (
	"fmt"
	"log"
	"path/filepath"
	"runtime"

	"github.com/janakh/monocr-onnx/go"
)

func main() {
	// Get path to test PDF
	_, filename, _, _ := runtime.Caller(0)
	projectRoot := filepath.Join(filepath.Dir(filename), "../../..")
	pdfPath := filepath.Join(projectRoot, "data/pdfs/Mon_E_library.pdf")

	fmt.Printf("Reading PDF: %s\n", pdfPath)
	fmt.Println("Model: Auto-downloading/cached")
	fmt.Println()

	pages, err := monocr.ReadPDF(pdfPath)
	if err != nil {
		log.Fatalf("Error: %v\nmake sure poppler-utils (pdftoppm) is installed.", err)
	}

	for i, page := range pages {
		fmt.Printf("--- Page %d ---\n", i+1)
		fmt.Println(page)
		fmt.Println()
	}
}
