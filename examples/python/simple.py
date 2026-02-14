import sys
from pathlib import Path
from monocr_onnx import read_image

# Path to test image
project_root = Path(__file__).resolve().parent.parent.parent
image_path = project_root / "data/images/test_0005_h71.png"

print(f"Reading image: {image_path}")
text = read_image(image_path)

print("Recognized Text:")
print(text)
