# MonOCR (Multi-Language SDK)

Universal OCR package for the Mon (mnw) language, powered by ONNX Runtime.

This repository contains SDKs for multiple languages, providing a unified API for high-performance OCR on images and PDFs.

## Supported Languages

| Language       | Directory            | Package                            | Status     |
| :------------- | :------------------- | :--------------------------------- | :--------- |
| **JavaScript** | [`js/`](js/)         | `monocr` (npm)                     | ✅ Ready   |
| **Python**     | [`python/`](python/) | `monocr-onnx` (PyPI)               | ✅ Ready   |
| **Go**         | [`go/`](go/)         | `github.com/janakh/monocr-onnx/go` | ✅ Ready   |
| **Rust**       | [`rust/`](rust/)     | `monocr` (crates.io)               | 🚧 Planned |

## Features

- **Unified API**: Consistent `read_image` and `read_pdf` functions across all languages.
- **Auto-Download**: Automatically fetches the 56MB `monocr.onnx` model from HuggingFace on first use.
- **Full Page Support**: Built-in layout analysis to handle multi-line documents.
- **High Performance**: Optimized ONNX Runtime inference with connectionist temporal classification (CTC) decoding.

## Quick Start

### JavaScript

```bash
npm install monocr
```

```js
const { read_image } = require("monocr");
console.log(await read_image("doc.jpg"));
```

### Python

```bash
pip install monocr-onnx
```

```python
from monocr_onnx import read_image
print(read_image("doc.jpg"))
```

### Go

```bash
go get github.com/janakh/monocr-onnx/go
```

```go
text, _ := monocr.ReadImage("doc.jpg")
fmt.Println(text)
```

## Model Info

The model is hosted on HuggingFace: [janakh/monocr](https://huggingface.co/janakh/monocr).
It is automatically cached to `~/.monocr/models/`.

## License

MIT
