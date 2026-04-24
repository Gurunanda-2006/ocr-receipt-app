import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

function getConfidenceColor(score) {
  if (score >= 0.8) return { bar: 'bg-emerald-400', text: 'text-emerald-400', shadow: 'shadow-emerald-400/20' };
  if (score >= 0.5) return { bar: 'bg-amber-400', text: 'text-amber-400', shadow: 'shadow-amber-400/20' };
  return { bar: 'bg-red-400', text: 'text-red-400', shadow: 'shadow-red-400/20' };
}

function getFieldLabel(key) {
  const labels = {
    receiptType:   'Document Logic',
    receipt_type:  'Document Logic',
    vendorName:    'Entity Matching',
    vendor_name:   'Entity Matching',
    date:          'Temporal Data',
    totalAmount:   'Fiscal Integrity',
    total_amount:  'Fiscal Integrity',
    taxAmount:     'Regulatory Check',
    tax_amount:    'Regulatory Check',
    invoiceNumber: 'Sequence Logic',
    invoice_number:'Sequence Logic',
  };
  return labels[key] || key;
}

export default function ConfidenceTable({ confidenceScores }) {
  if (!confidenceScores) return null;

  const entries = Object.entries(confidenceScores).sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-[#101010] border border-white/5 rounded-[2rem] p-8">
      <div className="flex items-center gap-3 mb-8">
        <Target className="w-5 h-5 text-primary/40" />
        <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
          Neural Precision Metrics
        </h3>
      </div>

      <div className="space-y-6">
        {entries.map(([field, score], idx) => {
          const pct = Math.round(score * 100);
          const colors = getConfidenceColor(score);
          return (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary/50 uppercase tracking-widest">{getFieldLabel(field)}</span>
                <span className={`text-xs font-mono font-bold ${colors.text}`}>
                  {pct}% Accuracy
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 1.2, delay: 0.2 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`h-full ${colors.bar} rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] ${colors.shadow}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
