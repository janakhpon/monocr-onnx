# MonOCR (Python SDK)

The official Python SDK for Mon language OCR, powered by ONNX Runtime. Optimized for high-throughput batch processing and production server environments.

## Installation

```bash
pip install monocr-onnx
```

## Features

- **Parallel Processing**: Native support for multithreaded batch OCR.
- **Auto-Model Discovery**: Automated caching of model weights from [MonDevHub/monocr](https://huggingface.co/janakhpon/monocr).
- **Comprehensive API**: Unified methods for images, PDFs, and accuracy benchmarking.
- **Production CLI**: Feature-rich command-line interface for rapid deployment.

## Quick Start

```python
from monocr_onnx import read_image, read_images

# Recognize single image
text = read_image("document.png")

# Parallel batch recognition
results = read_images(["img1.jpg", "img2.jpg"], workers=8)
```

## API Reference

### `read_image(image_path, [options])` -> `str`

Recognize text from a single image file.

### `read_images(image_paths, [workers=4])` -> `list[str]`

Recognize text from a list of images in parallel.

### `read_pdf(pdf_path)` -> `list[str]`

Extract text from all pages of a PDF document.

### `read_image_with_accuracy(image_path, ground_truth)` -> `dict`

Performance benchmarking with Levenshtein-based accuracy metrics.

## CLI Usage

```bash
# Recognize an image
monocr image input.jpg

# High-performance PDF conversion
monocr pdf document.pdf

# Batch directory processing
monocr batch ./input -o results.json
```

## Maintenance

Maintained by [MonDevHub](https://github.com/MonDevHub).

## License

MIT

- **Python 3.9+**
- **poppler-utils** (for PDF support via `pdf2image`)
