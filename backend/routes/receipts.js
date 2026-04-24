const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const receiptController = require('../controllers/receiptController');

// POST /api/receipts/upload — Upload image and process via OCR
router.post('/upload', upload.single('image'), receiptController.uploadAndProcess);

// GET /api/receipts — List all processed receipts
router.get('/', receiptController.getAllReceipts);

// GET /api/receipts/:id — Get single receipt by ID
router.get('/:id', receiptController.getReceiptById);

// DELETE /api/receipts/:id — Delete a receipt
router.delete('/:id', receiptController.deleteReceipt);

module.exports = router;
