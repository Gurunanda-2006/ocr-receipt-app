import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, FileSearch } from 'lucide-react';
import { useState } from 'react';

export default function ReceiptImage({ src, fileName }) {
  const [isZoomed, setIsZoomed] = useState(false);

  if (!src) return null;

  return (
    <>
      <div className="bg-[#101010] border border-white/5 rounded-[2rem] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center">
              <FileSearch className="w-4 h-4 text-primary/60" />
            </div>
            <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
              Source Capture
            </h3>
          </div>
          <button
            onClick={() => setIsZoomed(true)}
            className="flex items-center gap-2 text-[10px] font-bold text-primary/40 hover:text-primary transition-colors uppercase tracking-widest"
          >
            <Maximize2 className="w-3 h-3" />
            Enlarge
          </button>
        </div>

        <div
          className="relative rounded-[1.5rem] overflow-hidden bg-black/50 cursor-zoom-in group border border-white/5"
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={src}
            alt={fileName || 'Receipt'}
            className="w-full h-auto max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
            <motion.span 
              initial={{ y: 10 }}
              whileHover={{ y: 0 }}
              className="text-[10px] font-bold text-black bg-primary px-4 py-2 rounded-full uppercase tracking-widest shadow-xl shadow-primary/20"
            >
              Full Inspection
            </motion.span>
          </div>
        </div>
        
        {fileName && (
          <div className="flex items-center justify-center gap-2 py-2 border-t border-white/5">
            <p className="text-[10px] text-primary/20 font-mono truncate tracking-tight">{fileName}</p>
          </div>
        )}
      </div>

      {/* ── Lightbox Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isZoomed && (
          <div
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 cursor-pointer"
            onClick={() => setIsZoomed(false)}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-8 right-8 p-3 rounded-full bg-white/5 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={src}
              alt={fileName || 'Receipt'}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary/40 text-[10px] font-bold uppercase tracking-[0.3em]"
            >
              Click anywhere to exit
            </motion.p>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
