import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  Eye,
  Calendar,
  IndianRupee,
  Building2,
  Search,
  RefreshCw,
  X,
  FileText,
  Clock
} from 'lucide-react';
import { getAllReceipts, deleteReceipt } from '../utils/api';
import { WordsPullUp } from '../components/animations/TextAnimations';

function getTypeBadgeColor(type) {
  const colors = {
    restaurant:  'text-orange-400 bg-orange-400/10 border-orange-400/20',
    electricity: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    bank:        'text-blue-400 bg-blue-400/10 border-blue-400/20',
    grocery:     'text-green-400 bg-green-400/10 border-green-400/20',
    medical:     'text-rose-400 bg-rose-400/10 border-rose-400/20',
    general:     'text-slate-400 bg-slate-400/10 border-slate-400/20',
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
    <div className="space-y-12">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <WordsPullUp 
            text="Expense Vault"
            className="text-4xl font-medium tracking-tight text-primary"
          />
          <p className="text-primary/50 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {receipts.length} intelligence logs archived
          </p>
        </div>
        <button 
          onClick={fetchReceipts}
          className="group flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary rounded-full px-6 py-2 text-sm font-medium transition-all hover:bg-primary hover:text-black"
        >
          <RefreshCw className={`w-4 h-4 transition-transform duration-700 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
          Refresh Database
        </button>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <div className="w-16 h-16 rounded-full border-2 border-primary/10 border-t-primary animate-spin" />
          <p className="text-primary/40 text-sm animate-pulse uppercase tracking-widest font-bold">Accessing Secure Vault...</p>
        </div>
      ) : receipts.length === 0 ? (
        <div className="bg-[#101010] border border-white/5 rounded-[2rem] p-24 text-center">
          <Search className="w-16 h-16 text-primary/10 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-primary/60 mb-2">Vault is Empty</h3>
          <p className="text-primary/30 text-sm max-w-xs mx-auto">No processed receipts found in your history. Head over to the Scan page to begin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {receipts.map((r, idx) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative bg-[#101010] border border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
              >
                {/* Image Preview */}
                <div className="h-48 relative overflow-hidden bg-black/40">
                  {r.image_path ? (
                    <img
                      src={r.image_path}
                      alt={r.vendor_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-20">
                      <FileText className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getTypeBadgeColor(r.receipt_type)}`}>
                      {r.receipt_type || 'general'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-primary font-medium truncate">{r.vendor_name || 'Unknown Vendor'}</h4>
                      <p className="text-primary/40 text-xs mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {r.date || '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-bold text-lg leading-none">
                        {r.total_amount ? `₹${r.total_amount}` : '—'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[10px] text-primary/30 font-medium uppercase tracking-tighter">
                      Created {formatDate(r.created_at)}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelected(r)}
                        className="p-2.5 rounded-xl bg-primary/5 text-primary/60 hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        disabled={deleting === r.id}
                        className="p-2.5 rounded-xl bg-red-500/5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      >
                        <Trash2 className={`w-4 h-4 ${deleting === r.id ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* ── Detail Modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-[#101010] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelected(null)}
                className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/50 text-white/50 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side: Image */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-black">
                {selected.image_path ? (
                  <img
                    src={selected.image_path}
                    alt="Receipt Original"
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10 italic">
                    No image available
                  </div>
                )}
                <div className="absolute bottom-8 left-8">
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest ${getTypeBadgeColor(selected.receipt_type)}`}>
                    {selected.receipt_type || 'General'}
                  </div>
                </div>
              </div>

              {/* Right Side: Data */}
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto space-y-8 custom-scrollbar">
                <div className="space-y-1">
                  <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Transaction Log</p>
                  <h2 className="text-3xl font-medium text-primary leading-tight">
                    {selected.vendor_name || 'Processed Entry'}
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Date', value: selected.date, icon: Calendar },
                    { label: 'Total', value: selected.total_amount ? `₹${selected.total_amount}` : null, icon: IndianRupee },
                    { label: 'Tax', value: selected.tax_amount ? `₹${selected.tax_amount}` : null, icon: Building2 },
                    { label: 'Invoice', value: selected.invoice_number, icon: FileText },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center gap-2 text-primary/30 text-[10px] font-bold uppercase tracking-wider">
                        <item.icon className="w-3 h-3" />
                        {item.label}
                      </div>
                      <p className="text-primary font-medium truncate">{item.value || '—'}</p>
                    </div>
                  ))}
                </div>

                {selected.line_items?.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-primary/40 text-[10px] font-bold uppercase tracking-[0.2em]">Itemized Breakdown</p>
                    <div className="space-y-2">
                      {selected.line_items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.02]">
                          <span className="text-sm text-primary/80">{item.name}</span>
                          <span className="text-sm font-mono text-primary font-bold">{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-8 border-t border-white/5 flex items-center justify-between opacity-30 text-[10px] font-medium uppercase tracking-widest">
                  <span>Archived on {formatDate(selected.created_at)}</span>
                  <span>Neural ID: {selected.id.slice(0, 8)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
