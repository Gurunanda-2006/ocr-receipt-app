import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLightningBolt, HiOutlineRefresh } from 'react-icons/hi';
import UploadArea from '../components/UploadArea';
import ReceiptImage from '../components/ReceiptImage';
import ResultPanel from '../components/ResultPanel';
import ConfidenceTable from '../components/ConfidenceTable';
import { uploadReceipt } from '../utils/api';

export default function Home() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setReceipt(null);
    setError(null);
    setIsProcessing(true);
    setUploadProgress(0);

    try {
      const data = await uploadReceipt(selectedFile, (pct) => setUploadProgress(pct));
      setReceipt(data.receipt);
    } catch (err) {
      console.error('Upload failed:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to process receipt.';
      setError(msg);
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setReceipt(null);
    setError(null);
    setIsProcessing(false);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-600/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-4"
        >
          <HiOutlineLightningBolt className="w-4 h-4" />
          AI-Powered OCR Engine
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-extrabold gradient-text leading-tight">
          Extract Receipt Data Instantly
        </h1>
        <p className="text-slate-400 mt-3 text-lg">
          Upload any receipt — restaurant bills, electricity bills, bank slips — and our AI extracts structured data with confidence scoring.
        </p>
      </div>

      {/* ── Upload or Results ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {!receipt && !error && (
          <UploadArea
            key="upload"
            onFileSelect={handleFileSelect}
            isProcessing={isProcessing}
            uploadProgress={uploadProgress}
          />
        )}
      </AnimatePresence>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-red-500/30 p-6 text-center"
        >
          <p className="text-red-400 font-semibold mb-2">Processing Failed</p>
          <p className="text-sm text-slate-400 mb-4">{error}</p>
          <button onClick={handleReset} className="btn-primary text-sm">
            <span className="flex items-center gap-2">
              <HiOutlineRefresh className="w-4 h-4" />
              Try Again
            </span>
          </button>
        </motion.div>
      )}

      {/* ── Side-by-Side Results ──────────────────────────────────────── */}
      {receipt && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">Results</h2>
            <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-2">
              <HiOutlineRefresh className="w-4 h-4" />
              Scan Another
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Original Image */}
            <div className="space-y-5">
              <ReceiptImage
                src={preview}
                fileName={file?.name}
              />
            </div>

            {/* Right: Extracted Data + Confidence */}
            <div className="space-y-5">
              <ResultPanel receipt={receipt} />
              <ConfidenceTable
                confidenceScores={receipt.confidence_scores}
              />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
