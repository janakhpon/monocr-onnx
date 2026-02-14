# MonOCR Examples

This directory contains standalone examples demonstrating how to use the MonOCR SDKs in various languages.

## Directory Structure

- **[`js/`](js/)**: Node.js examples using the `monocr` npm package.
- **[`python/`](python/)**: Python examples using the `monocr-onnx` PyPI package.
- **[`go/`](go/)**: Go examples using the `github.com/MonDevHub/monocr-onnx/go` module.

## Prerequisites

Ensure you have installed the respective SDKs:

- **JS**: `npm install monocr`
- **Python**: `pip install monocr-onnx`
- **Go**: `go get github.com/MonDevHub/monocr-onnx/go`

## Running Examples

### JavaScript

```bash
cd js
npm install
npm run image      # Single image recognition
npm run batch      # Batch image processing
npm run pdf        # PDF recognition
npm run accuracy   # Accuracy benchmark
```

### Python

```bash
cd python
# Setup environment (optional, uv run will auto-setup)
uv sync

# Run examples
uv run python simple.py    # Basic usage
uv run python pdf.py       # PDF usage
uv run python accuracy.py  # Accuracy check
```

### Go

```bash
cd go/simple
go run main.go

cd ../pdf
go run main.go
```

## Data

The examples use sample data from the `../../data` directory at the repository root.
