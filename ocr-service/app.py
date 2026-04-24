from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ocr_engine import run_ocr
from field_extractor import extract_fields
from confidence_scorer import build_confidence_scores
import uvicorn

app = FastAPI(title="OCR Receipt Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health():
    return {"status": "OCR service running"}


@app.post("/ocr/process")
async def process_receipt(file: UploadFile = File(...)):
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/tiff"]
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload JPEG, PNG, WEBP or TIFF.")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")

    # Step 1: OCR
    ocr_results = run_ocr(image_bytes)
    if not ocr_results:
        raise HTTPException(status_code=422, detail="No text detected in image.")

    # Step 2: Extract structured fields
    fields = extract_fields(ocr_results)

    # Step 3: Confidence scores
    confidence_scores = build_confidence_scores(fields, ocr_results, image_bytes)

    return {
        "success": True,
        "fields": fields,
        "confidenceScores": confidence_scores,
        "ocrWordCount": len(ocr_results),
    }


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=False)
