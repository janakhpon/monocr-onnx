# monocr (Go SDK)

Mon language OCR library for Go, using ONNX Runtime.

## Installation

```bash
go get github.com/janakh/monocr-onnx/go
```

### Prerequisites

You must have the ONNX Runtime shared library installed on your system:

- **Linux**: `libonnxruntime.so`
- **macOS**: `libonnxruntime.dylib`
- **Windows**: `onnxruntime.dll`

Download it from the [ONNX Runtime Releases](https://github.com/microsoft/onnxruntime/releases).

For PDF support, you need `poppler-utils` installed (functions via `pdftoppm`).

## Usage

### Simple Image OCR

```go
package main

import (
	"fmt"
	"log"

	"github.com/janakh/monocr-onnx/go"
)

func main() {
	// Auto-downloads model on first use
	text, err := monocr.ReadImage("image.jpg")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(text)
}
```

### PDF OCR

```go
pages, err := monocr.ReadPDF("document.pdf")
if err != nil {
	log.Fatal(err)
}

for i, text := range pages {
	fmt.Printf("Page %d: %s\n", i+1, text)
}
```

## CLI

You can build the CLI tool:

```bash
cd cmd/monocr
go build -o monocr
./monocr image input.jpg
```

## Model Files

The model `monocr.onnx` is automatically downloaded to `~/.monocr/models/`.
The `charset.txt` is embedded in the binary.
