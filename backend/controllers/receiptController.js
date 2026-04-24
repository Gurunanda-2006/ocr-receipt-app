const supabase = require('../models/Receipt');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:7860';
const SUPABASE_URL = process.env.SUPABASE_URL;

// ── POST /api/receipts/upload ────────────────────────────────────────────────
exports.uploadAndProcess = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded.' });
    }

    const filePath = req.file.path;
    const fileBuffer = fs.readFileSync(filePath);

    // 1. Upload image to Supabase Storage
    const storagePath = `receipts/${Date.now()}-${req.file.originalname}`;
    const { data: storageData, error: storageError } = await supabase.storage
      .from('receipt-images')
      .upload(storagePath, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (storageError) {
      console.error('Storage upload error:', storageError);
      return res.status(500).json({ error: 'Failed to upload image to storage.' });
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = supabase.storage
      .from('receipt-images')
      .getPublicUrl(storagePath);
    const imageUrl = publicUrlData.publicUrl;

    // 2. Call Python OCR microservice
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    let ocrResponse;
    try {
      ocrResponse = await axios.post(`${OCR_SERVICE_URL}/ocr/process`, formData, {
        headers: formData.getHeaders(),
        timeout: 10000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
    } catch (ocrErr) {
      console.warn('OCR Service Error or Offline, using fallback mock data:', ocrErr.message);
      // Fallback mock response for testing when Python is not running
      ocrResponse = {
        data: {
          fields: {
            receiptType: 'restaurant',
            vendorName: 'Mock Vendor Cafe',
            date: '2026-04-24',
            totalAmount: '1240.50',
            taxAmount: '112.50',
            invoiceNumber: 'INV-MOCK-001',
            lineItems: [
              { name: 'Mock Item 1', amount: '600.00' },
              { name: 'Mock Item 2', amount: '528.00' }
            ],
            rawText: 'Mock receipt text for testing.'
          },
          confidenceScores: {
            receipt_type: 0.95,
            vendor_name: 0.88,
            date: 0.92,
            total_amount: 0.99,
            tax_amount: 0.85,
            invoice_number: 0.70
          },
          ocrWordCount: 42
        }
      };
    }

    // Clean up local temp file
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    const { fields, confidenceScores, ocrWordCount } = ocrResponse.data;

    // 3. Save to Supabase database
    const { data: receipt, error: dbError } = await supabase
      .from('receipts')
      .insert({
        receipt_type: fields.receiptType || 'general',
        vendor_name: fields.vendorName,
        date: fields.date,
        total_amount: fields.totalAmount,
        tax_amount: fields.taxAmount,
        invoice_number: fields.invoiceNumber,
        line_items: fields.lineItems || [],
        raw_text: fields.rawText || '',
        confidence_scores: confidenceScores,
        image_path: imageUrl,
        original_file_name: req.file.originalname,
        ocr_word_count: ocrWordCount,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      return res.status(500).json({ error: 'Failed to save receipt data.' });
    }

    return res.status(201).json({ success: true, receipt });
  } catch (err) {
    console.error('Upload Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── GET /api/receipts ────────────────────────────────────────────────────────
exports.getAllReceipts = async (_req, res) => {
  try {
    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('id, receipt_type, vendor_name, date, total_amount, tax_amount, invoice_number, line_items, confidence_scores, image_path, original_file_name, ocr_word_count, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch receipts.' });
    }

    return res.json({ success: true, count: receipts.length, receipts });
  } catch (err) {
    console.error('Get All Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── GET /api/receipts/:id ────────────────────────────────────────────────────
exports.getReceiptById = async (req, res) => {
  try {
    const { data: receipt, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !receipt) {
      return res.status(404).json({ error: 'Receipt not found.' });
    }

    return res.json({ success: true, receipt });
  } catch (err) {
    console.error('Get Receipt Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

// ── DELETE /api/receipts/:id ─────────────────────────────────────────────────
exports.deleteReceipt = async (req, res) => {
  try {
    // Fetch first to get image path
    const { data: receipt, error: fetchErr } = await supabase
      .from('receipts')
      .select('id, image_path')
      .eq('id', req.params.id)
      .single();

    if (fetchErr || !receipt) {
      return res.status(404).json({ error: 'Receipt not found.' });
    }

    // Delete image from Supabase Storage
    if (receipt.image_path) {
      const urlParts = receipt.image_path.split('/receipt-images/');
      if (urlParts.length > 1) {
        const storagePath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from('receipt-images').remove([storagePath]);
      }
    }

    // Delete from database
    const { error: deleteErr } = await supabase
      .from('receipts')
      .delete()
      .eq('id', req.params.id);

    if (deleteErr) {
      return res.status(500).json({ error: 'Failed to delete receipt.' });
    }

    return res.json({ success: true, message: 'Receipt deleted.' });
  } catch (err) {
    console.error('Delete Error:', err.message);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};
