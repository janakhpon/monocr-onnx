import numpy as np
import onnxruntime as ort
from PIL import Image
from pathlib import Path

class MonOCR:
    def __init__(self, model_path, charset_path=None):
        self.session = ort.InferenceSession(str(model_path))
        if charset_path:
            with open(charset_path, 'r', encoding='utf-8') as f:
                self.charset = f.read().strip()
        else:
            self.charset = ""

    def preprocess(self, img):
        if img.mode != 'L':
            img = img.convert('L')
        
        target_height = 64
        aspect_ratio = img.width / img.height
        target_width = int(target_height * aspect_ratio)
        img = img.resize((target_width, target_height), Image.Resampling.BILINEAR)
        
        img_arr = np.array(img).astype(np.float32) / 255.0
        img_arr = np.expand_dims(img_arr, axis=0) # Add channel dim
        img_arr = np.expand_dims(img_arr, axis=0) # Add batch dim
        return img_arr

    def decode(self, preds):
        idx2char = {i + 1: c for i, c in enumerate(self.charset)}
        decoded_text = []
        prev_idx = -1
        
        # Simple Greedy Decoding
        for idx in preds:
            if idx != 0 and idx != prev_idx:
                decoded_text.append(idx2char.get(idx, ""))
            prev_idx = idx
            
        return "".join(decoded_text)

    def predict(self, img_path):
        img = Image.open(img_path)
        input_data = self.preprocess(img)
        
        input_name = self.session.get_inputs()[0].name
        output_name = self.session.get_outputs()[0].name
        
        outputs = self.session.run([output_name], {input_name: input_data})
        preds = np.argmax(outputs[0], axis=2)[0] # Batch size 1
        
        return self.decode(preds)
