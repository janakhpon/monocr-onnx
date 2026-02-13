# MonOCR ONNX: Universal OCR Package

**Production-ready OCR for the Mon (mnw) language, now available everywhere.**

This repository provides universal bindings for the MonOCR model using **ONNX Runtime**, allowing you to run high-performance OCR in Go, JavaScript (Node.js/Web), Python, and Rust.

## What's Included

The `model/` directory contains everything you need:

- **`monocr.onnx`** (56 MB): The core ONNX model, supporting dynamic input widths.
- **`monocr.tflite`** (14 MB): Quantized TFLite model, optimized for mobile/edge.
- **`charset.txt`** (224 chars): The character mapping used by the model.

## Getting Started

Choose your language:

| Language       | Directory            | Library            | Status |
| :------------- | :------------------- | :----------------- | :----- |
| **Python**     | [`python/`](python/) | `onnxruntime`      | Ready  |
| **JavaScript** | [`js/`](js/)         | `onnxruntime-node` | Ready  |
| **Go**         | [`go/`](go/)         | `onnxruntime_go`   | Ready  |
| **Rust**       | [`rust/`](rust/)     | `ort`              | Ready  |

---

### Python

#### Installation

```bash
cd python
pip install .
```

#### Usage

```python
from monocr_onnx import MonOCR

# Initialize
ocr = MonOCR("../model/monocr.onnx", "../model/charset.txt")

# Run Inference
text = ocr.predict("path/to/image.jpg")
print(f"Recognized: {text}")
```

---

### JavaScript (Node.js)

#### Installation

```bash
cd js
npm install
```

#### Usage

```javascript
const MonOCR = require("./index");

async function run() {
  // Initialize
  const ocr = new MonOCR("../model/monocr.onnx", "../model/charset.txt");

  // Run Inference
  const text = await ocr.predict("path/to/image.jpg");
  console.log(`Recognized: ${text}`);
}

run();
```

---

### Go

#### Setup

```bash
cd go
go mod tidy
```

#### Usage

```go
package main

import (
	"fmt"
	"log"
)

func main() {
	// Initialize
	ocr, err := NewMonOCR("../model/monocr.onnx", "../model/charset.txt")
	if err != nil {
		log.Fatal(err)
	}

	// Run Inference
	text, err := ocr.Predict("path/to/image.jpg")
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Recognized: %s\n", text)
}
```

---

### Rust

#### Setup

```bash
cd rust
cargo build --release
```

#### Usage

```rust
use std::path::Path;
use anyhow::Result;

fn main() -> Result<()> {
    // Initialize
    let ocr = MonOCR::new("../model/monocr.onnx", "../model/charset.txt")?;

    // Run Inference
    let text = ocr.predict(Path::new("path/to/image.jpg"))?;

    println!("Recognized: {}", text);
    Ok(())
}
```

## Requirements

- **ONNX Runtime**: Most bindings require the shared library or handle it automatically.
- **Models**: Ensure `model/` is accessible relative to your execution path.
- **Images**: Input images are automatically resized to height=64, preserving aspect ratio, converted to grayscale, and normalized.

## License

MIT License. See [LICENSE](LICENSE) for details.
