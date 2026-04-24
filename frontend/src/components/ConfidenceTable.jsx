import { motion } from 'framer-motion';

function getConfidenceColor(score) {
  if (score >= 0.8) return { bar: 'from-emerald-500 to-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (score >= 0.5) return { bar: 'from-amber-500 to-yellow-400', text: 'text-amber-400', bg: 'bg-amber-500/10' };
  return { bar: 'from-red-500 to-rose-400', text: 'text-red-400', bg: 'bg-red-500/10' };
}

function getFieldLabel(key) {
  const labels = {
    receiptType:   'Receipt Type',
    receipt_type:  'Receipt Type',
    vendorName:    'Vendor Name',
    vendor_name:   'Vendor Name',
    date:          'Date',
    totalAmount:   'Total Amount',
    total_amount:  'Total Amount',
    taxAmount:     'Tax / GST',
    tax_amount:    'Tax / GST',
    invoiceNumber: 'Invoice No.',
    invoice_number:'Invoice No.',
    imageQuality:  'Image Quality',
    image_quality: 'Image Quality',
  };
  return labels[key] || key;
}

export default function ConfidenceTable({ confidenceScores }) {
  if (!confidenceScores) return null;

  const entries = Object.entries(confidenceScores).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-5"
    >
      <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
        Confidence Scores
      </h3>
      <div className="space-y-3">
        {entries.map(([field, score], idx) => {
          const pct = Math.round(score * 100);
          const colors = getConfidenceColor(score);
          return (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-slate-300">{getFieldLabel(field)}</span>
                <span className={`text-sm font-mono font-semibold ${colors.text}`}>
                  {pct}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${colors.bar} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
