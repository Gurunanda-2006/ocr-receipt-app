import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { HiOutlineCloudUpload, HiOutlinePhotograph } from 'react-icons/hi';

export default function UploadArea({ onFileSelect, isProcessing, uploadProgress }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0 && !isProcessing) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect, isProcessing]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/tiff': ['.tiff', '.tif'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    disabled: isProcessing,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragActive
            ? 'upload-zone-active border-brand-400'
            : 'border-white/10 hover:border-brand-500/50 hover:bg-white/[0.02]'
          }
          ${isProcessing ? 'pointer-events-none opacity-60' : ''}
        `}
      >
        <input {...getInputProps()} id="receipt-upload-input" />

        {/* Glow background on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600/5 to-cyan-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10">
          {isProcessing ? (
            <div className="flex flex-col items-center gap-4">
              {/* Spinner */}
              <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
              <p className="text-lg font-semibold text-brand-300">Processing receipt…</p>
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-64 mx-auto">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Uploading</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {uploadProgress >= 100 && (
                <p className="text-sm text-slate-400">Running OCR analysis — this may take a moment…</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-600/20 to-cyan-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {isDragActive ? (
                  <HiOutlineCloudUpload className="w-10 h-10 text-brand-400 animate-bounce" />
                ) : (
                  <HiOutlinePhotograph className="w-10 h-10 text-brand-400" />
                )}
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-200">
                  {isDragActive ? 'Drop your receipt here' : 'Upload a receipt image'}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  Drag & drop or <span className="text-brand-400 font-medium">click to browse</span>
                </p>
              </div>
              <div className="flex items-center gap-3 mt-2">
                {['JPG', 'PNG', 'WEBP', 'TIFF'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-2.5 py-1 text-xs font-mono font-medium bg-white/5 text-slate-400 rounded-lg border border-white/5"
                  >
                    {fmt}
                  </span>
                ))}
                <span className="text-xs text-slate-500">Max 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
