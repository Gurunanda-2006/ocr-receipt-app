import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan as ScanIcon, RefreshCw, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';
import UploadArea from '../components/UploadArea';
import ReceiptImage from '../components/ReceiptImage';
import ResultPanel from '../components/ResultPanel';
import ConfidenceTable from '../components/ConfidenceTable';
import { uploadReceipt } from '../utils/api';
import { WordsPullUp } from '../components/animations/TextAnimations';

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
    <div className="space-y-12">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest"
        >
          <Zap className="w-4 h-4" />
          Neural OCR Engine v2.0
        </motion.div>
        
        <WordsPullUp 
          text="Transform Receipts into Data"
          className="text-4xl md:text-6xl font-medium tracking-tight text-primary leading-[1.1]"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-primary/60 text-lg max-w-xl mx-auto leading-relaxed"
        >
          Drop your receipt below and watch as our AI deconstructs messy text into structured financial intelligence.
        </motion.p>
      </div>

      {/* ── Main Interaction ────────────────────────────────────────── */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!receipt && !error && (
            <motion.div
              key="upload-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <UploadArea
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                uploadProgress={uploadProgress}
              />
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto bg-red-500/5 border border-red-500/20 rounded-[2rem] p-12 text-center backdrop-blur-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-400 mb-2">Extraction Interrupted</h3>
              <p className="text-primary/50 text-sm mb-8 leading-relaxed">{error}</p>
              <button 
                onClick={handleReset}
                className="group flex items-center justify-center gap-2 bg-red-500 text-white rounded-full px-8 py-3 font-medium transition-all hover:gap-4 mx-auto"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Try Another Scan
              </button>
            </motion.div>
          )}

          {receipt && (
            <motion.div
              key="results-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-widest text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    Success: Data Extraction Complete
                  </div>
                  <h2 className="text-3xl font-medium text-primary">Analysis Results</h2>
                </div>
                <button 
                  onClick={handleReset}
                  className="group flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-6 py-2.5 text-sm font-medium transition-all hover:bg-primary hover:text-black"
                >
                  <ScanIcon className="w-4 h-4" />
                  Scan Another
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Receipt Preview */}
                <div className="lg:col-span-5 sticky top-32">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ReceiptImage
                      src={preview}
                      fileName={file?.name}
                    />
                  </motion.div>
                </div>

                {/* Right: Data Breakdown */}
                <div className="lg:col-span-7 space-y-8">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <ResultPanel receipt={receipt} />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <ConfidenceTable
                      confidenceScores={receipt.confidence_scores}
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
