const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'DELETE'],
}));
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
const receiptRoutes = require('./routes/receipts');
app.use('/api/receipts', receiptRoutes);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'OCR Receipt Backend is running',
    version: '1.0.0',
    database: 'Supabase',
    timestamp: new Date().toISOString(),
  });
});

// ── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 OCR Service: ${process.env.OCR_SERVICE_URL || 'http://localhost:7860'}`);
  console.log(`🗄️  Database: Supabase (${process.env.SUPABASE_URL})`);
});
