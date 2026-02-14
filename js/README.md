# MonOCR (JavaScript SDK)

The professional JavaScript SDK for Mon language OCR, powered by ONNX Runtime. Designed for high-performance server-side and desktop Node.js applications.

## Installation

```bash
npm install monocr
```

## Features

- **Unified API**: Synchronized with Python and Go equivalents.
- **Auto-Model Management**: Leverages [MonDevHub/monocr](https://huggingface.co/janakhpon/monocr) for automated model delivery.
- **PDF Support**: Intelligent document segmentation and multi-page processing.
- **Zero Dependencies**: Core OCR logic is lean and optimized.

## API Reference

### `read_image(imagePath, [options])`

Recognizes text from a single image.

- `imagePath`: String path to the image file.
- `options`: Optional overrides for model/charset paths.
- **Returns**: `Promise<string>`

### `read_images(imagePaths, [options])`

Recognizes text from multiple images.

- **Returns**: `Promise<string[]>`

### `read_pdf(pdfPath, [options])`

Converts and recognizes text from all pages of a PDF.

- **Returns**: `Promise<string[]>` (Array of strings per page)

### `read_image_with_accuracy(imagePath, groundTruth, [options])`

Performs OCR and calculates Levenshtein accuracy.

- **Returns**: `Promise<{text: string, accuracy: number}>`

## Usage Example

```javascript
const { read_image } = require("monocr");

async function main() {
  const text = await read_image("scanned_text.png");
  console.log(text);
}

main();
```

## CLI Interface

```bash
# Global installation for CLI usage
npm install -g monocr

# Process an image
monocr image input.jpg

# Process a PDF
monocr pdf document.pdf
```

## Maintenance

Maintained by [MonDevHub](https://github.com/MonDevHub).

## License

MIT
