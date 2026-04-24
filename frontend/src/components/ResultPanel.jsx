import { motion } from 'framer-motion';
import {
  Building2,
  Calendar,
  IndianRupee,
  Receipt,
  Hash,
  Tag,
  ListChecks,
} from 'lucide-react';

const fieldIcons = {
  receipt_type:   Tag,
  vendor_name:    Building2,
  date:           Calendar,
  total_amount:   IndianRupee,
  tax_amount:     Receipt,
  invoice_number: Hash,
};

const fieldLabels = {
  receipt_type:   'Document Classification',
  vendor_name:    'Identified Vendor',
  date:           'Timestamp',
  total_amount:   'Gross Amount',
  tax_amount:     'Levied Taxes',
  invoice_number: 'Reference Number',
};

function getConfidenceColor(score) {
  if (score >= 0.8) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (score >= 0.5) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
  return 'text-red-400 bg-red-400/10 border-red-400/20';
}

export default function ResultPanel({ receipt }) {
  if (!receipt) return null;

  const displayFields = ['receipt_type', 'vendor_name', 'date', 'total_amount', 'tax_amount', 'invoice_number'];
  const confidence = receipt.confidence_scores || {};

  // Map confidence keys (camelCase from OCR) to snake_case DB fields
  const confKeyMap = {
    receipt_type: 'receiptType',
    vendor_name: 'vendorName',
    date: 'date',
    total_amount: 'totalAmount',
    tax_amount: 'taxAmount',
    invoice_number: 'invoiceNumber',
  };

  return (
    <div className="space-y-6">
      {/* ── Extracted Fields ──────────────────────────────────── */}
      <div className="bg-[#101010] border border-white/5 rounded-[2rem] p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
            Neural Extraction Results
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayFields.map((key, idx) => {
            const value = receipt[key];
            const Icon = fieldIcons[key];
            const confKey = confKeyMap[key] || key;
            const conf = confidence[confKey];
            const confPct = conf != null ? Math.round(conf * 100) : null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-primary/60" />
                  </div>
                  {confPct != null && (
                    <div className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold tracking-tighter ${getConfidenceColor(conf)}`}>
                      {confPct}% Match
                    </div>
                  )}
                </div>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">{fieldLabels[key]}</p>
                  <p className="text-primary font-medium truncate">
                    {value || <span className="text-primary/20 italic font-normal">Undetected</span>}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Line Items ─────────────────────────────────────────────── */}
      {receipt.line_items && receipt.line_items.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#101010] border border-white/5 rounded-[2rem] p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <ListChecks className="w-5 h-5 text-primary/40" />
            <h3 className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em]">
              Itemized Inventory ({receipt.line_items.length})
            </h3>
          </div>
          <div className="space-y-2">
            {receipt.line_items.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                <span className="text-sm text-primary/80">{item.name}</span>
                <span className="text-sm font-mono font-bold text-primary">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── OCR Stats ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#101010] border border-white/5 rounded-3xl p-6 text-center">
          <p className="text-3xl font-medium text-primary tracking-tighter leading-none">{receipt.ocr_word_count || 0}</p>
          <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest mt-3">Words Processed</p>
        </div>
        <div className="bg-[#101010] border border-white/5 rounded-3xl p-6 text-center">
          <p className="text-3xl font-medium text-primary tracking-tighter leading-none capitalize">{receipt.receipt_type || '—'}</p>
          <p className="text-[10px] text-primary/30 font-bold uppercase tracking-widest mt-3">Node Identity</p>
        </div>
      </div>
    </div>
  );
}
