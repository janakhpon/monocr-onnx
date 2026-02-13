# MonOCR npm Package Examples

Standalone examples showing how to use the published `monocr` package from npm.

## Setup

```bash
# Install dependencies with pnpm
pnpm install

# Or with npm
npm install

# Or with yarn
yarn install
```

## Prerequisites

1. **Test Images**: Place test images in `../../preview_monocr/data/images/` or modify the paths in the examples.

2. **PDF Processing** (for PDF example): Install GraphicsMagick:

   ```bash
   # Ubuntu/Debian
   sudo apt-get install graphicsmagick

   # macOS
   brew install graphicsmagick
   ```

## Examples

### Image OCR

```bash
npm run image
# or
pnpm image
```

This demonstrates text recognition from a single image file.

### PDF OCR

```bash
npm run pdf
# or
pnpm pdf
```

This demonstrates text recognition from a PDF file (processes all pages).

You can also provide a custom PDF path:

```bash
node pdf-example.js /path/to/your/document.pdf
```

## Code Usage

### Basic Image Recognition

```javascript
import { read_image } from "monocr";

// Model auto-downloads on first use
const text = await read_image("image.jpg");
console.log(text);
```

### PDF Recognition

```javascript
import { read_pdf } from "monocr";

const pages = await read_pdf("document.pdf");

pages.forEach((pageText, i) => {
  console.log(`Page ${i + 1}:`, pageText);
});
```

### With Accuracy Measurement

```javascript
import { read_image_with_accuracy } from "monocr";

const result = await read_image_with_accuracy(
  "image.jpg",
  "expected text content",
  "model/monocr.onnx",
  "model/charset.txt",
);

console.log("Text:", result.text);
console.log("Accuracy:", result.accuracy + "%");
```

## Package Installation

This example uses the published npm package:

```bash
pnpm add monocr
# or
npm install monocr
```

Published package: https://www.npmjs.com/package/monocr
