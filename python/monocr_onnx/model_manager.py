import os
import requests
from pathlib import Path
from tqdm import tqdm

class ModelManager:
    MODEL_FILENAME = "monocr.onnx"
    MODEL_URL = "https://huggingface.co/janakh/monocr/resolve/main/monocr.onnx"
    
    def __init__(self):
        self.cache_dir = Path.home() / ".monocr" / "models"
        
    def get_model_path(self):
        model_path = self.cache_dir / self.MODEL_FILENAME
        
        if not model_path.exists():
            print(f"Model not found at {model_path}. Downloading...")
            self.download_model()
            
        return model_path
        
    def download_model(self):
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        dest_path = self.cache_dir / self.MODEL_FILENAME
        
        try:
            response = requests.get(self.MODEL_URL, stream=True, allow_redirects=True)
            response.raise_for_status()
            
            total_size = int(response.headers.get('content-length', 0))
            
            with open(dest_path, "wb") as f, tqdm(
                desc=self.MODEL_FILENAME,
                total=total_size,
                unit='iB',
                unit_scale=True,
                unit_divisor=1024,
            ) as bar:
                for chunk in response.iter_content(chunk_size=8192):
                    size = f.write(chunk)
                    bar.update(size)
                    
            print(f"Model downloaded successfully to {dest_path}")
            
        except Exception as e:
            if dest_path.exists():
                dest_path.unlink() # Clean up partial download
            raise RuntimeError(f"Failed to download model: {e}")
