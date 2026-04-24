import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentSearch,
  HiOutlineRefresh,
} from 'react-icons/hi';
import { getAllReceipts, deleteReceipt } from '../utils/api';

function getTypeBadgeColor(type) {
  const colors = {
    restaurant:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
    electricity: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    bank:        'bg-blue-500/10 text-blue-400 border-blue-500/20',
    grocery:     'bg-green-500/10 text-green-400 border-green-500/20',
    medical:     'bg-rose-500/10 text-rose-400 border-rose-500/20',
    general:     'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return colors[type] || colors.general;
}

export default function History() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const data = await getAllReceipts();
      setReceipts(data.receipts || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReceipts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this receipt permanently?')) return;
    setDeleting(id);
    try {
      await deleteReceipt(id);
      setReceipts((prev) => prev.filter((r) => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Receipt History</h1>
          <p className="text-sm text-slate-400 mt-1">
            {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} processed
          </p>
        </div>
        <button onClick={fetchReceipts} className="btn-secondary text-sm flex items-center gap-2">
          <HiOutlineRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
        </div>
      )}

      {!loading && receipts.length === 0 && (
        <div className="glass-card p-16 text-center">
          <HiOutlineDocumentSearch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-400">No receipts yet</p>
          <p className="text-sm text-slate-500 mt-1">Upload a receipt on the Scan page to get started.</p>
        </div>
      )}

      {!loading && receipts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {receipts.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.04 }}
                className="glass-card-hover p-5 flex flex-col"
              >
                {r.image_path && (
                  <div className="rounded-xl overflow-hidden bg-black/20 mb-4 h-40">
                    <img
                      src={r.image_path}
                      alt={r.vendor_name || 'Receipt'}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                <span className={`self-start text-xs font-semibold px-2.5 py-1 rounded-lg border mb-3 capitalize ${getTypeBadgeColor(r.receipt_type)}`}>
                  {r.receipt_type || 'general'}
                </span>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <HiOutlineOfficeBuilding className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-200 truncate font-medium">{r.vendor_name || 'Unknown Vendor'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HiOutlineCalendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-400">{r.date || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HiOutlineCurrencyDollar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="text-slate-200 font-mono font-semibold">
                      {r.total_amount ? `₹${r.total_amount}` : '—'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(r)}
                      className="p-2 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all"
                      title="View details"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      <HiOutlineTrash className={`w-4 h-4 ${deleting === r.id ? 'animate-pulse' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Detail Modal ───────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-slate-100">{selected.vendor_name || 'Receipt Details'}</h2>
              <button
                onClick={() => setSelected(null)}
                className="text-slate-400 hover:text-white text-2xl leading-none"
              >&times;</button>
            </div>

            {selected.image_path && (
              <img
                src={selected.image_path}
                alt="Receipt"
                className="w-full max-h-72 object-contain rounded-xl bg-black/30"
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              {[
                ['Type', selected.receipt_type],
                ['Date', selected.date],
                ['Total', selected.total_amount ? `₹${selected.total_amount}` : null],
                ['Tax', selected.tax_amount ? `₹${selected.tax_amount}` : null],
                ['Invoice #', selected.invoice_number],
                ['Words', selected.ocr_word_count],
              ].map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl bg-white/[0.03]">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="text-sm font-semibold text-slate-200 capitalize">{val || '—'}</p>
                </div>
              ))}
            </div>

            {selected.line_items?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Line Items</h4>
                <div className="divide-y divide-white/5">
                  {selected.line_items.map((item, i) => (
                    <div key={i} className="flex justify-between py-2">
                      <span className="text-sm text-slate-300">{item.name}</span>
                      <span className="text-sm font-mono text-slate-100">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}
