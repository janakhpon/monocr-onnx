# monocr

Mon language (mnw) OCR for Node.js.

## Installation

```bash
npm install monocr
```

## Quick Start

```javascript
const { read_image } = require("monocr");

// Automatically downloads model on first run
const text = await read_image("image.jpg");
console.log(text);
```

## API

### `read_image(imagePath, [modelPath], [charsetPath])`

Recognizes text from an image file.

- `imagePath` (string): Path to image file.
- `modelPath` (string, optional): Path to ONNX model. Defaults to `~/.monocr/models/monocr.onnx`.
- `charsetPath` (string, optional): Path to charset file. Defaults to bundled charset.

Returns: `Promise<string>`

### `read_pdf(pdfPath, [modelPath], [charsetPath])`

Recognizes text from a PDF file.

- `pdfPath` (string): Path to PDF file.
- `modelPath` (string, optional): As above.
- `charsetPath` (string, optional): As above.

Returns: `Promise<string[]>` (Array of text per page)

### `read_image_with_accuracy(imagePath, groundTruth, [modelPath], [charsetPath])`

Recognizes text and calculates accuracy against ground truth.

- `imagePath` (string): Path to image file.
- `groundTruth` (string): Expected text.

Returns: `Promise<{text: string, accuracy: number}>`

## CLI Usage

The package includes a `monocr` command-line tool.

```bash
# Download model to cache (optional, happens automatically on first use)
monocr download

# Recognize single image
monocr image input.jpg

# Recognize PDF
monocr pdf document.pdf

# Batch process directory
monocr batch ./images -o results.json
```

## Model Files

The ONNX model (`monocr.onnx`) is downloaded automatically to `~/.monocr/models/` on first use. The charset file is bundled with the package.

To use a custom model, provide the `modelPath` argument to the API functions or CLI.

## License

MIT
