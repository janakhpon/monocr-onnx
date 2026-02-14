from pathlib import Path
from monocr_onnx import read_image_with_accuracy

project_root = Path(__file__).resolve().parent.parent.parent
image_path = project_root / "data/images/test_0005_h71.png"

# Dummy ground truth for testing flow
ground_truth = "ဂကောံမန်နာနာတံထံက်ပၚ်သြန်ကုသ္ိကၟိန်ညးဒးဒုၚ်ပန်ပ္ဍဲကွာန်ပါၚ်မၚ်ဂၠန်(၂)တၠ"

print(f"Reading image: {image_path}")
text, accuracy = read_image_with_accuracy(image_path, ground_truth)

print("Recognized Text:")
print(text)
print("-" * 20)
print(f"Accuracy: {accuracy:.2f}%")
