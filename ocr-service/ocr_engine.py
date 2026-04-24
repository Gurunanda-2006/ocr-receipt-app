import cv2
import numpy as np
import easyocr
from PIL import Image
import io

reader = easyocr.Reader(['en'], gpu=False)

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Deskew, denoise, threshold the receipt image for best OCR accuracy."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Resize if too small
    h, w = img.shape[:2]
    if w < 800:
        scale = 800 / w
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_CUBIC)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Denoise
    gray = cv2.fastNlMeansDenoising(gray, h=10, templateWindowSize=7, searchWindowSize=21)

    # Deskew
    gray = deskew(gray)

    # Adaptive threshold for better text contrast
    processed = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY,
        31, 11
    )

    return processed


def deskew(gray: np.ndarray) -> np.ndarray:
    """Detect and correct skew angle."""
    coords = np.column_stack(np.where(gray < 128))
    if len(coords) == 0:
        return gray
    angle = cv2.minAreaRect(coords)[-1]
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
    if abs(angle) < 0.5:
        return gray
    (h, w) = gray.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(gray, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    return rotated


def run_ocr(image_bytes: bytes) -> list:
    """
    Run EasyOCR on preprocessed image.
    Returns list of dicts: {text, confidence, bbox}
    """
    processed = preprocess_image(image_bytes)

    # Convert back to bytes for EasyOCR
    _, buf = cv2.imencode('.png', processed)
    processed_bytes = buf.tobytes()

    results = reader.readtext(processed_bytes, detail=1, paragraph=False)

    extracted = []
    for (bbox, text, conf) in results:
        text = text.strip()
        if text:
            extracted.append({
                "text": text,
                "confidence": round(float(conf), 4),
                "bbox": [list(map(int, pt)) for pt in bbox]
            })

    return extracted
