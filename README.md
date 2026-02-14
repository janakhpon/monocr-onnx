# MonOCR (Universal SDK)

MonOCR is a high-performance, cross-platform Optical Character Recognition (OCR) engine for the Mon language (mnw). Powered by **ONNX Runtime**, it provides a unified API for image and PDF text recognition across multiple programming environments.

This repository is the central hub for the MonOCR SDKs, maintained by the [MonDevHub](https://github.com/MonDevHub) organization.

## Supported Platforms

| SDK                    | Directory            | Registry                                                   | Status        |
| :--------------------- | :------------------- | :--------------------------------------------------------- | :------------ |
| **JavaScript/Node.js** | [`js/`](js/)         | [npm: monocr](https://www.npmjs.com/package/monocr)        | ✅ Production |
| **Python**             | [`python/`](python/) | [PyPI: monocr-onnx](https://pypi.org/project/monocr-onnx/) | ✅ Production |
| **Go**                 | [`go/`](go/)         | `github.com/MonDevHub/monocr-onnx/go`                      | ✅ Production |
| **Rust**               | [`rust/`](rust/)     | -                                                          | 🚧 Planned    |

## Core Features

- **Unified API**: Identical `read_image` and `read_pdf` patterns across all languages.
- **Zero-Config Model Management**: Automatically fetches and caches the 56MB ONNX model from Hugging Face on first use.
- **Layout Awareness**: Built-in line segmentation for full-page document processing.
- **Optimized Performance**: Leverages modern SIMD/GPU acceleration via ONNX Runtime.

## Quick Installation

### JavaScript (npm)

```bash
npm install monocr || pnpm add monocr
```

### Python (pip or uv)

```bash
pip install monocr-onnx || uv add monocr-onnx
```

### Go (modules)

```bash
go get github.com/MonDevHub/monocr-onnx/go
```

## Quick Start Example (Python)

```python
from monocr_onnx import read_image

# Model is automatically downloaded and cached at ~/.monocr/models/
text = read_image("scanned_document.jpg")
print(text)
```

## Documentation

Each SDK contains its own detailed documentation and examples:

- [JavaScript Documentation](js/README.md)
- [Python Documentation](python/README.md)
- [Go Documentation](go/README.md)
- [Publishing & Deployment Guide](docs/publishing.md)

## Model Hub

The underlying weights and multi-format exports (ONNX, TFLite, PyTorch) are hosted on Hugging Face:
[MonDevHub/monocr](https://huggingface.co/janakhpon/monocr)

## License

MIT License. See [LICENSE](LICENSE) for details.
