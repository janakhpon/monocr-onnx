# MonOCR (Python SDK)

Universal MonOCR package with ONNX bindings.

## Installation

```bash
pip install monocr-onnx
```

## Usage

### Simple Image OCR

```python
from monocr_onnx import read_image

text = read_image("image.jpg")
print(text)
```

### PDF OCR

```python
from monocr_onnx import read_pdf

pages = read_pdf("document.pdf")
for page_text in pages:
    print(page_text)
```

## CLI

```bash
monocr image input.jpg
monocr pdf input.pdf
monocr batch ./images_dir
monocr download  # Manual download of model
```

## Prerequisites

- **Python 3.9+**
- **poppler-utils** (for PDF support via `pdf2image`)
