import { motion } from 'framer-motion';
import { HiOutlineZoomIn } from 'react-icons/hi';
import { useState } from 'react';

export default function ReceiptImage({ src, fileName }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-4 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Original Image
          </h3>
          <button
            onClick={() => setIsZoomed(true)}
            className="flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 transition-colors"
          >
            <HiOutlineZoomIn className="w-4 h-4" />
            Zoom
          </button>
        </div>
        <div
          className="relative rounded-xl overflow-hidden bg-black/30 cursor-pointer group"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={src}
            alt={fileName || 'Receipt'}
            className="w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span className="text-xs text-white/80 bg-black/50 px-3 py-1 rounded-full">
              Click to enlarge
            </span>
          </div>
        </div>
        {fileName && (
          <p className="text-xs text-slate-500 mt-3 font-mono truncate">{fileName}</p>
        )}
      </motion.div>

      {/* ── Lightbox Modal ──────────────────────────────────────────── */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 cursor-pointer"
          onClick={() => setIsZoomed(false)}
        >
          <motion.img
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            src={src}
            alt={fileName || 'Receipt'}
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
          />
          <span className="absolute top-6 right-6 text-white/60 text-sm">Press anywhere to close</span>
        </div>
      )}
    </>
  );
}
