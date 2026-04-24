import re
import dateparser
from typing import Optional


# ── Receipt type classifier ───────────────────────────────────────────────────
RECEIPT_KEYWORDS = {
    "restaurant": ["restaurant", "cafe", "hotel", "dine", "food", "meal", "menu",
                   "waiter", "table", "zomato", "swiggy", "upi"],
    "electricity": ["electricity", "ebill", "kwh", "unit", "meter", "watt",
                    "bescom", "tneb", "energy", "power", "bill no"],
    "bank": ["bank", "atm", "debit", "credit", "transaction", "account",
             "ifsc", "utr", "neft", "imps", "balance", "transfer", "deposit"],
    "grocery": ["grocery", "supermarket", "mart", "store", "retail",
                "vegetables", "fruits", "items", "qty", "mrp"],
    "medical": ["pharmacy", "hospital", "clinic", "medicine", "rx",
                "patient", "doctor", "prescription", "tablet", "capsule"],
}


def classify_receipt(text_lines: list[str]) -> str:
    full_text = " ".join(text_lines).lower()
    scores = {rtype: 0 for rtype in RECEIPT_KEYWORDS}
    for rtype, keywords in RECEIPT_KEYWORDS.items():
        for kw in keywords:
            if kw in full_text:
                scores[rtype] += 1
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "general"


# ── Individual field extractors ───────────────────────────────────────────────
def extract_date(text_lines: list[str]) -> Optional[str]:
    date_pattern = re.compile(
        r'\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2}|'
        r'\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{2,4})\b',
        re.IGNORECASE
    )
    for line in text_lines:
        m = date_pattern.search(line)
        if m:
            parsed = dateparser.parse(m.group(), settings={"PREFER_DAY_OF_MONTH": "first"})
            if parsed:
                return parsed.strftime("%Y-%m-%d")
    return None


def extract_total(text_lines: list[str]) -> Optional[str]:
    total_pattern = re.compile(
        r'(?:total|grand\s*total|amount\s*due|net\s*payable|payable)[^\d]*([₹$]?\s*[\d,]+\.?\d{0,2})',
        re.IGNORECASE
    )
    for line in text_lines:
        m = total_pattern.search(line)
        if m:
            return m.group(1).replace(",", "").strip()

    # Fallback: largest currency amount on the receipt
    amounts = re.findall(r'[₹$]?\s*(\d[\d,]*\.\d{2})', " ".join(text_lines))
    if amounts:
        values = [float(a.replace(",", "")) for a in amounts]
        return str(max(values))
    return None


def extract_tax(text_lines: list[str]) -> Optional[str]:
    tax_pattern = re.compile(
        r'(?:gst|cgst|sgst|igst|vat|tax)[^\d]*([₹$]?\s*[\d,]+\.?\d{0,2})',
        re.IGNORECASE
    )
    taxes = []
    for line in text_lines:
        m = tax_pattern.search(line)
        if m:
            val = m.group(1).replace(",", "").strip()
            try:
                taxes.append(float(re.sub(r'[₹$\s]', '', val)))
            except ValueError:
                pass
    if taxes:
        return str(round(sum(taxes), 2))
    return None


def extract_vendor(text_lines: list[str]) -> Optional[str]:
    """First 3 non-empty lines usually contain vendor name."""
    candidates = [l.strip() for l in text_lines[:5] if len(l.strip()) > 3]
    # Skip lines that are purely numeric or look like addresses
    for c in candidates:
        if not re.match(r'^[\d\s\-\+\(\)]+$', c):
            return c
    return candidates[0] if candidates else None


def extract_invoice_number(text_lines: list[str]) -> Optional[str]:
    inv_pattern = re.compile(
        r'(?:invoice|bill|receipt|ref|order|txn)[^\w]*[#:\s]*([A-Z0-9\-]{4,20})',
        re.IGNORECASE
    )
    for line in text_lines:
        m = inv_pattern.search(line)
        if m:
            return m.group(1).strip()
    return None


def extract_line_items(text_lines: list[str]) -> list[dict]:
    """Extract item name + amount pairs."""
    item_pattern = re.compile(
        r'^(.{3,30}?)\s{2,}([₹$]?\s*\d[\d,]*\.?\d{0,2})\s*$'
    )
    items = []
    for line in text_lines:
        m = item_pattern.match(line.strip())
        if m:
            items.append({
                "name": m.group(1).strip(),
                "amount": m.group(2).strip()
            })
    return items


# ── Main extractor ────────────────────────────────────────────────────────────
def extract_fields(ocr_results: list[dict]) -> dict:
    text_lines = [r["text"] for r in ocr_results]

    return {
        "receiptType":     classify_receipt(text_lines),
        "vendorName":      extract_vendor(text_lines),
        "date":            extract_date(text_lines),
        "totalAmount":     extract_total(text_lines),
        "taxAmount":       extract_tax(text_lines),
        "invoiceNumber":   extract_invoice_number(text_lines),
        "lineItems":       extract_line_items(text_lines),
        "rawText":         "\n".join(text_lines),
    }
