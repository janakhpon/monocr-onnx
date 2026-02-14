# monocr (Go SDK)

Mon language OCR library for Go, using ONNX Runtime.

## Installation

```bash
go get github.com/MonDevHub/monocr-onnx/go
```

## Features

- **Static Assets**: Bundled charset for zero-config deployments.
- **Auto-Caching**: Intelligent model download and management.
- **Native Efficiency**: Direct bindings to ONNX Runtime via CGO.
- **Unified API**: Synchronized logic with JS and Python SDKs.

## Quick Start

```go
package main

import (
    "fmt"
    "github.com/MonDevHub/monocr-onnx/go"
)

func main() {
    text, err := monocr.ReadImage("document.jpg")
    if err != nil {
        panic(err)
    }
    fmt.Println(text)
}
```

## API Documentation

### `monocr.ReadImage(path string)`

Primary entry point for image-based OCR.

### `monocr.ReadPDF(path string)`

Full-page PDF recognition with automatic segmentation.

### `monocr.ReadImages(paths []string)`

Batch processing for image sequences.

---

## Prerequisites

The Go SDK requires the ONNX Runtime shared library (`libonnxruntime.so` or equivalent) to be present in the system's library path. See our [Installation Guide](docs/INSTALL.md) for platform-specific details.

## Maintenance

Maintained by [MonDevHub](https://github.com/MonDevHub).

## License

MIT

The model `monocr.onnx` is automatically downloaded to `~/.monocr/models/`.
The `charset.txt` is embedded in the binary.
