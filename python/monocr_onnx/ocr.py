from pathlib import Path
from PIL import Image
from pdf2image import convert_from_path
from .predictor import MonOCR
from .utils import calculate_accuracy

def read_image(image_path, model_path=None, charset_path=None):
    """
    Recognize text from an image file.
    
    Args:
        image_path (str or Path): Path to the image file.
        model_path (str, optional): Path to the ONNX model. If None, uses auto-downloaded model.
        charset_path (str, optional): Path to the charset file. If None, uses bundled charset.
        
    Returns:
        str: Recognized text.
    """
    ocr = MonOCR(model_path, charset_path)
    return ocr.predict(image_path)

def read_pdf(pdf_path, model_path=None, charset_path=None):
    """
    Recognize text from a PDF file.
    
    Args:
        pdf_path (str or Path): Path to the PDF file.
        model_path (str, optional): Path to model.
        charset_path (str, optional): Path to charset.
        
    Returns:
        list[str]: list of recognized text per page.
    """
    try:
        images = convert_from_path(str(pdf_path), dpi=300)
    except Exception as e:
        raise RuntimeError(f"Failed to convert PDF. Ensure poppler-utils is installed. Error: {e}")
    
    ocr = MonOCR(model_path, charset_path)
    results = []
    
    for img in images:
        text = ocr.predict(img)
        results.append(text)
        
    return results

def read_image_with_accuracy(image_path, ground_truth, model_path=None, charset_path=None):
    """
    Recognize text and calculate accuracy against ground truth.
    
    Returns:
        tuple: (recognized_text, accuracy_percentage)
    """
    text = read_image(image_path, model_path, charset_path)
    accuracy = calculate_accuracy(text, ground_truth)
    return text, accuracy
