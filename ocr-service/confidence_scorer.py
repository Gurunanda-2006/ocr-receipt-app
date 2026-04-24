import cv2
import numpy as np
import re


def image_quality_score(image_bytes: bytes) -> float:
    """Blur + contrast metric → 0.0 to 1.0"""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return 0.3

    # Blur score via Laplacian variance
    blur_score = cv2.Laplacian(img, cv2.CV_64F).var()
    blur_norm = min(blur_score / 500.0, 1.0)

    # Contrast score
    contrast = img.std() / 128.0
    contrast_norm = min(contrast, 1.0)

    return round((blur_norm * 0.6 + contrast_norm * 0.4), 4)


def field_confidence(field_name: str, value, ocr_results: list[dict], image_quality: float) -> float:
    """
    Composite confidence for a single extracted field.
    Factors: image quality + OCR word confidence + format validation
    """
    if value is None:
        return 0.0

    # Base from image quality
    base = image_quality * 0.4

    # OCR confidence of words that contributed to this field
    val_str = str(value).lower()
    matching_confs = [
        r["confidence"] for r in ocr_results
        if r["text"].lower() in val_str or val_str in r["text"].lower()
    ]
    ocr_conf = (sum(matching_confs) / len(matching_confs)) if matching_confs else 0.5
    base += ocr_conf * 0.4

    # Format validation bonus
    format_bonus = _format_validation(field_name, value)
    base += format_bonus * 0.2

    return round(min(base, 1.0), 4)


def _format_validation(field_name: str, value) -> float:
    """Returns 0.0 – 1.0 based on whether value matches expected format."""
    if field_name == "date":
        if value and re.match(r'\d{4}-\d{2}-\d{2}', str(value)):
            return 1.0
        return 0.3

    if field_name == "totalAmount":
        if value and re.match(r'[\d]+\.?\d{0,2}', str(value)):
            return 1.0
        return 0.4

    if field_name == "taxAmount":
        if value and re.match(r'[\d]+\.?\d{0,2}', str(value)):
            return 0.9
        return 0.3

    if field_name == "invoiceNumber":
        if value and re.match(r'[A-Z0-9\-]{4,20}', str(value)):
            return 0.9
        return 0.4

    if field_name == "vendorName":
        if value and len(str(value)) > 3:
            return 0.8
        return 0.3

    if field_name == "receiptType":
        return 0.85  # classifier is rule-based, reasonably reliable

    return 0.5


def build_confidence_scores(fields: dict, ocr_results: list[dict], image_bytes: bytes) -> dict:
    iq = image_quality_score(image_bytes)
    scores = {}
    for field_name, value in fields.items():
        if field_name in ("lineItems", "rawText"):
            continue
        scores[field_name] = field_confidence(field_name, value, ocr_results, iq)
    scores["imageQuality"] = iq
    return scores
