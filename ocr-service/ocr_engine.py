import cv2
import numpy as np
import pytesseract
from PIL import Image
import io

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Deskew, denoise, threshold the receipt image for best OCR accuracy."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Resize if too small
    h, w = img.shape[:2]
    if w < 1000:
        scale = 1000 / w
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    gray = cv2.fastNlMeansDenoising(gray, h=10, templateWindowSize=7, searchWindowSize=21)

    # Adaptive threshold for better text contrast
    processed = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 11
    )

    return processed

def run_ocr(image_bytes: bytes) -> list:
    """
    Run Tesseract on preprocessed image.
    Returns list of dicts: {text, confidence, bbox}
    """
    processed = preprocess_image(image_bytes)
    
    # Convert back to PIL for pytesseract
    pil_img = Image.fromarray(processed)
    
    # Get detailed data including bboxes and confidence
    data = pytesseract.image_to_data(pil_img, output_type=pytesseract.Output.DICT)
    
    extracted = []
    n_boxes = len(data['text'])
    for i in range(n_boxes):
        text = data['text'][i].strip()
        conf = float(data['conf'][i])
        
        # Filter out empty text and low-confidence symbols (Tesseract uses -1 for layout blocks)
        if text and conf > 0:
            x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
            extracted.append({
                "text": text,
                "confidence": round(conf / 100.0, 4),
                "bbox": [
                    [x, y],
                    [x + w, y],
                    [x + w, y + h],
                    [x, y + h]
                ]
            })

    return extracted
