import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Clock, Zap, X } from 'lucide-react';
import type { Muse } from './Sidebar';

interface PaymentModalProps {
  isOpen: boolean;
  selectedMuse: Muse;
  priceInr: number;
  sessionDurationMin: number;
  isProcessing: boolean;
  error: string | null;
  onConfirm: () => void;
  onClose: () => void;
}

export function PaymentModal({
  isOpen,
  selectedMuse,
  priceInr,
  sessionDurationMin,
  isProcessing,
  error,
  onConfirm,
  onClose,
}: PaymentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[80]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-end sm:items-center justify-center z-[90] p-4"
          >
            <div className="w-full max-w-sm rounded-3xl border border-white/10 overflow-hidden"
              style={{ backgroundColor: '#0F0F0F' }}>

              {/* Header */}
              <div
                className="relative px-6 pt-6 pb-5"
                style={{
                  background: `linear-gradient(135deg, ${selectedMuse.accentColor}18 0%, transparent 60%)`,
                }}
              >
                {!isProcessing && (
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all"
                  >
                    <X className="w-3.5 h-3.5 text-white/50" />
                  </button>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl p-[2px]"
                    style={{ background: `linear-gradient(135deg, ${selectedMuse.accentColor}, ${selectedMuse.accentColor}40)` }}
                  >
                    <img
                      src={selectedMuse.avatar}
                      alt={selectedMuse.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-white font-black text-base leading-tight">Talk to {selectedMuse.name}</p>
                    <p className="text-white/40 text-xs font-medium">{selectedMuse.personality}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">₹{priceInr}</span>
                  <span className="text-white/40 text-sm font-semibold">/ session</span>
                </div>
                <p className="text-white/30 text-xs">{sessionDurationMin} minutes of uninterrupted conversation</p>
              </div>

              {/* Features */}
              <div className="px-6 py-4 space-y-3 border-t border-white/5">
                {[
                  { icon: Clock, label: `${sessionDurationMin} minute session`, sub: 'Auto-ends when time runs out' },
                  { icon: Zap, label: 'Instant activation', sub: 'Start talking right after payment' },
                  { icon: ShieldCheck, label: 'Secure payment via Cashfree', sub: 'UPI, Cards & Net Banking accepted' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: `${selectedMuse.accentColor}20`, border: `1px solid ${selectedMuse.accentColor}30` }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: selectedMuse.accentColor }} />
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold leading-tight">{label}</p>
                      <p className="text-white/35 text-[10px] mt-0.5">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mb-2 px-3 py-2.5 rounded-xl bg-red-950/60 border border-red-800/40"
                  >
                    <p className="text-red-400 text-xs font-semibold">{error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA */}
              <div className="px-6 pb-6 pt-2">
                <motion.button
                  whileHover={{ scale: isProcessing ? 1 : 1.02 }}
                  whileTap={{ scale: isProcessing ? 1 : 0.97 }}
                  onClick={onConfirm}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl font-black text-white text-sm uppercase tracking-widest relative overflow-hidden transition-all disabled:opacity-70"
                  style={{
                    backgroundColor: selectedMuse.accentColor,
                    boxShadow: `0 8px 32px ${selectedMuse.accentColor}50`,
                  }}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Pay ₹${priceInr} & Start Call`
                  )}
                </motion.button>

                <p className="text-center text-white/20 text-[9px] font-semibold uppercase tracking-widest mt-3">
                  Powered by Cashfree · Secure · Instant
                </p>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
