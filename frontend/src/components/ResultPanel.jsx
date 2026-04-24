import { motion } from 'framer-motion';
import {
  HiOutlineOfficeBuilding,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineReceiptTax,
  HiOutlineHashtag,
  HiOutlineTag,
  HiOutlineClipboardList,
} from 'react-icons/hi';

const fieldIcons = {
  receipt_type:   HiOutlineTag,
  vendor_name:    HiOutlineOfficeBuilding,
  date:           HiOutlineCalendar,
  total_amount:   HiOutlineCurrencyDollar,
  tax_amount:     HiOutlineReceiptTax,
  invoice_number: HiOutlineHashtag,
};

const fieldLabels = {
  receipt_type:   'Receipt Type',
  vendor_name:    'Vendor Name',
  date:           'Date',
  total_amount:   'Total Amount',
  tax_amount:     'Tax / GST',
  invoice_number: 'Invoice No.',
};

function getConfidenceColor(score) {
  if (score >= 0.8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  if (score >= 0.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
  return 'text-red-400 bg-red-500/10 border-red-500/20';
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5"
    >
      {/* ── Extracted Fields Table ──────────────────────────────────── */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
          Extracted Data
        </h3>
        <div className="space-y-3">
          {displayFields.map((key, idx) => {
            const value = receipt[key];
            const Icon = fieldIcons[key];
            const confKey = confKeyMap[key] || key;
            const conf = confidence[confKey];
            const confPct = conf != null ? Math.round(conf * 100) : null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-brand-600/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 font-medium">{fieldLabels[key]}</p>
                  <p className="text-sm font-semibold text-slate-100 truncate">
                    {value || <span className="text-slate-600 italic">Not detected</span>}
                  </p>
                </div>
                {confPct != null && (
                  <span
                    className={`text-xs font-mono font-semibold px-2 py-1 rounded-lg border ${getConfidenceColor(conf)}`}
                  >
                    {confPct}%
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Line Items ─────────────────────────────────────────────── */}
      {receipt.line_items && receipt.line_items.length > 0 && (
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineClipboardList className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Line Items ({receipt.line_items.length})
            </h3>
          </div>
          <div className="divide-y divide-white/5">
            {receipt.line_items.map((item, i) => (
              <div key={i} className="flex justify-between py-2.5">
                <span className="text-sm text-slate-300">{item.name}</span>
                <span className="text-sm font-mono font-semibold text-slate-100">
                  {item.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── OCR Stats ──────────────────────────────────────────────── */}
      <div className="flex gap-3">
        <div className="flex-1 glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text">{receipt.ocr_word_count || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Words Detected</p>
        </div>
        <div className="flex-1 glass-card p-4 text-center">
          <p className="text-2xl font-bold gradient-text capitalize">{receipt.receipt_type || '—'}</p>
          <p className="text-xs text-slate-500 mt-1">Receipt Type</p>
        </div>
      </div>
    </motion.div>
  );
}
