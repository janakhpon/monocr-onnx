import numpy as np
from PIL import Image

class LineSegmenter:
    def __init__(self, min_line_h=10, smooth_window=3):
        self.min_line_h = min_line_h
        self.smooth_window = smooth_window

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

        height, width = img_arr.shape

        # 1. Binarize / Thresholding for Projection
        # Text is dark (< 128). We want pixel count of text.
        # binary = 1 where text, 0 where background.
        binary = (img_arr < 128).astype(np.int32)
        
        # 2. Horizontal Projection Profile
        hist = np.sum(binary, axis=1) # Sum along width (axis 1) -> shape (height,)

        # 3. Smoothing
        if self.smooth_window > 1:
            kernel = np.ones(self.smooth_window) / self.smooth_window
            # mode='same' returns output of same length as input
            smoothed_hist = np.convolve(hist, kernel, mode='same')
        else:
            smoothed_hist = hist

        # 4. Gap Detection
        non_zero_vals = smoothed_hist[smoothed_hist > 0]
        if len(non_zero_vals) == 0:
            return []

        mean_density = np.mean(non_zero_vals)
        gap_threshold = mean_density * 0.05
        
        results = []
        start = None
        
        for y in range(height):
            is_text = smoothed_hist[y] > gap_threshold
            
            if is_text and start is None:
                start = y
            elif not is_text and start is not None:
                end = y
                if (end - start) >= self.min_line_h:
                    self._extract_line(img_pil, img_arr, width, height, start, end, results)
                start = None
                
        if start is not None and (height - start) >= self.min_line_h:
            self._extract_line(img_pil, img_arr, width, height, start, height, results)
            
        return results

    def _extract_line(self, img_pil, img_arr, width, height, r_start, r_end, results):
        # Find horizontal bounds within strip
        # strip is img_arr[r_start:r_end, :]
        strip = img_arr[r_start:r_end, :]
        
        # Find x where col sum > 0 (checking binary text pixels)
        strip_binary = (strip < 128)
        col_sum = np.sum(strip_binary, axis=0) # shape (width,)
        
        non_empty_cols = np.where(col_sum > 0)[0]
        
        if len(non_empty_cols) == 0:
            return
            
        x_min = non_empty_cols[0]
        x_max = non_empty_cols[-1]
        
        # Add padding
        pad = 4
        y1 = max(0, r_start - pad)
        y2 = min(height, r_end + pad)
        x1 = max(0, x_min - pad)
        x2 = min(width, x_max + pad)
        
        w = x2 - x1
        h = y2 - y1
        
        crop = img_pil.crop((x1, y1, x2, y2))
        
        results.append({
            'img': crop,
            'bbox': (int(x1), int(y1), int(w), int(h))
        })
