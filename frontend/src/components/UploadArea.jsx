import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

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
    <div className="max-w-3xl mx-auto">
      <div
        {...getRootProps()}
        className={`relative group cursor-pointer rounded-[2.5rem] p-12 md:p-20 text-center transition-all duration-500 overflow-hidden border-2 border-dashed
          ${isDragActive
            ? 'border-primary bg-primary/5'
            : 'border-white/10 hover:border-primary/40 hover:bg-white/[0.02]'
          }
          ${isProcessing ? 'pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} id="receipt-upload-input" />

        {/* Cinematic Background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        <div className="relative z-10 flex flex-col items-center">
          {isProcessing ? (
            <div className="space-y-8 w-full max-w-sm">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto" />
                <div className="absolute inset-0 blur-2xl bg-primary/20 animate-pulse" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-primary">Digitizing Receipt...</h3>
                <p className="text-primary/40 text-sm uppercase tracking-[0.2em] font-bold">Neural Engine Active</p>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] text-primary/50 font-bold uppercase tracking-widest">
                    <span>Transmitting Data</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  {isDragActive ? (
                    <UploadCloud className="w-10 h-10 text-primary animate-bounce" />
                  ) : (
                    <ImageIcon className="w-10 h-10 text-primary" />
                  )}
                </div>
                <div className="absolute inset-0 blur-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-medium text-primary">
                  {isDragActive ? 'Release to Scan' : 'Ready for Ingestion'}
                </h3>
                <p className="text-primary/40 text-base max-w-xs mx-auto leading-relaxed">
                  Drop your physical receipt or click to browse local files.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                {['JPG', 'PNG', 'WEBP'].map((fmt) => (
                  <span
                    key={fmt}
                    className="px-4 py-1.5 text-[10px] font-bold tracking-widest bg-white/5 text-primary/40 rounded-full border border-white/5 uppercase"
                  >
                    {fmt}
                  </span>
                ))}
                <div className="h-4 w-px bg-white/10 mx-2" />
                <span className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">Up to 10MB</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
