import cv2
import numpy as np
from PIL import Image

class LineSegmenter:
    """
    Robust line segmenter using Horizontal Projection Profiles with Smoothing.
    Handles noisy documents and touching lines by finding valleys in the projection.
    """
    def __init__(self, smooth_kernel=5, threshold_ratio=0.02):
        self.smooth_kernel = smooth_kernel
        self.threshold_ratio = threshold_ratio

    def segment(self, image):
        """
        Segment a document image into text lines.
        Args:
            image (PIL.Image or np.ndarray): Input image.
        Returns:
            list: List of dicts with keys 'img' (PIL.Image) and 'bbox' (x, y, w, h).
        """
        if isinstance(image, Image.Image):
            img_pil = image
            if img_pil.mode != 'L':
                img_pil = img_pil.convert('L')
            img_arr = np.array(img_pil)
        else:
            img_arr = image
            img_pil = Image.fromarray(img_arr)
            if img_pil.mode != 'L':
                img_pil = img_pil.convert('L')
                img_arr = np.array(img_pil)

        # 1. Binarize (Adaptive Thresholding)
        # Invert so text is white, background black
        binary = cv2.adaptiveThreshold(
            img_arr, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY_INV, 25, 10
        )
        
        # 2. Horizontal Projection Profile
        hist = np.sum(binary, axis=1) # Sum along width (axis 1) -> shape (height,)

        # 3. Smoothing
        if self.smooth_kernel > 1:
            kernel = np.ones(self.smooth_kernel) / self.smooth_kernel
            # mode='same' returns output of same length as input
            smoothed_hist = np.convolve(hist, kernel, mode='same')
        else:
            smoothed_hist = hist

        # 4. Gap Detection
        non_zero_vals = smoothed_hist[smoothed_hist > 0]
        if len(non_zero_vals) == 0:
            return []

        # Find max density 
        max_val = np.max(smoothed_hist)
        threshold = max_val * self.threshold_ratio # e.g. 2% of max density is a gap
        
        results = []
        start = None
        height, width = img_arr.shape
        
        for y in range(height):
            is_text = smoothed_hist[y] > threshold
            
            if is_text and start is None:
                start = y
            elif not is_text and start is not None:
                end = y
                if (end - start) > 8: # Minimal line height check
                    # Add generous padding
                    pad = 4
                    y1 = max(0, start - pad)
                    y2 = min(height, end + pad)
                    
                    # Crop full width
                    crop = img_pil.crop((0, y1, width, y2))
                    
                    results.append({
                        'img': crop,
                        'bbox': (0, int(y1), int(width), int(y2 - y1))
                    })
                start = None
                
        # Handle last segment
        if start is not None and (height - start) > 8:
            pad = 4
            y1 = max(0, start - pad)
            y2 = min(height, height)
            crop = img_pil.crop((0, y1, width, y2))
            
            results.append({
                'img': crop,
                'bbox': (0, int(y1), int(width), int(y2 - y1))
            })
            
        return results
