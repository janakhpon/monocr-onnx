#!/bin/bash
set -e

DEST=${1:-"model"}
BASE_URL="https://huggingface.co/janakh/monocr/resolve/main"

echo "Downloading MonOCR models to $DEST..."
mkdir -p "$DEST"

for file in "monocr.onnx" "monocr.tflite" "charset.txt"; do
    echo "Downloading $file..."
    curl -L "$BASE_URL/$file" -o "$DEST/$file"
done

echo "Done. Models saved to $DEST"
