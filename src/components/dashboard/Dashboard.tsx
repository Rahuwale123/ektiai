import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LogOut,
  Mic,
  Wallet,
  Plus,
  X,
  ChevronRight,
  Sparkles,
  Loader2,
  Clock,
} from "lucide-react";
import { type User } from "../../lib/firebase";
import { type Muse } from "./Sidebar";
import { RATE_PER_MIN_INR } from "../../lib/useWallet";

const TOP_UP_AMOUNTS = [20, 50, 100, 200];

interface DashboardProps {
  muses: Muse[];
  authUser: User | null;
  balance: number;
  minutesRemaining: number;
  showWallet: boolean;
  topUpStatus: "idle" | "processing" | "error";
  topUpError: string | null;
  onSelect: (muse: Muse) => void;
  onSignOut: () => void;
  onOpenWallet: () => void;
  onCloseWallet: () => void;
  onTopUp: (amount: number) => void;
}

export function Dashboard({
  muses,
  authUser,
  balance,
  minutesRemaining,
  showWallet,
  topUpStatus,
  topUpError,
  onSelect,
  onSignOut,
  onOpenWallet,
  onCloseWallet,
  onTopUp,
}: DashboardProps) {
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = authUser?.displayName?.split(" ")[0] ?? "there";

  return (
    <div className="fixed inset-0 bg-[#F5F5F7] overflow-y-auto">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-black/6 px-5 md:px-10 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF5E62] to-[#FF2D55] flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1A1A1A] font-black text-xl tracking-tight">
              ekti<span className="text-[#FF5E62]">ai</span>
            </span>
          </div>

          {/* Right: Wallet + Profile */}
          <div className="flex items-center gap-3">

            {/* Wallet chip */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onOpenWallet}
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#F0F0F3] hover:bg-[#E8E8EC] border border-black/6 transition-all"
            >
              <Wallet className="w-4 h-4 text-[#FF5E62]" />
              <span className="text-[#1A1A1A] text-sm font-bold">₹{balance.toFixed(0)}</span>
              <div className="w-5 h-5 rounded-full bg-[#FF5E62] flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </div>
            </motion.button>

            {/* Profile */}
            {authUser && (
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  {authUser.photoURL ? (
                    <img
                      src={authUser.photoURL}
                      alt={authUser.displayName ?? ""}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5E62] to-[#FF2D55] flex items-center justify-center border-2 border-white shadow-sm">
                      <span className="text-white text-sm font-black">{firstName[0]}</span>
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                </div>
                <button
                  onClick={onSignOut}
                  className="p-2 rounded-xl hover:bg-black/5 transition-all"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4 text-black/30" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Welcome + Balance strip ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-8 pb-5">
        <div className="flex items-start justify-between gap-4">
          {/* Greeting */}
          <div className="flex items-center gap-4">
            {authUser?.photoURL && (
              <img
                src={authUser.photoURL}
                alt={authUser.displayName ?? ""}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover border border-black/8 shadow-md flex-shrink-0"
              />
            )}
            <div>
              <p className="text-black/40 text-sm font-medium">{greeting()},</p>
              <h1 className="text-[#1A1A1A] text-2xl md:text-3xl font-black tracking-tight leading-tight">
                {firstName} 👋
              </h1>
            </div>
          </div>

          {/* Balance card */}
          <div
            onClick={onOpenWallet}
            className="flex-shrink-0 bg-white rounded-2xl border border-black/6 shadow-sm px-4 py-3 cursor-pointer hover:shadow-md transition-all min-w-[120px]"
          >
            <p className="text-black/35 text-[10px] font-black uppercase tracking-widest mb-1">Balance</p>
            <p className="text-[#1A1A1A] text-xl font-black leading-none">₹{balance.toFixed(0)}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <Clock className="w-2.5 h-2.5 text-black/30" />
              <p className="text-black/35 text-[10px] font-semibold">
                ~{minutesRemaining} min left
              </p>
            </div>
          </div>
        </div>

        <p className="text-black/40 text-sm mt-4">
          {/* Pick a companion · ₹{RATE_PER_MIN_INR}/min billed live */}
        </p>
      </div>

      {/* ── Section label ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-8 mb-4 flex items-center justify-between">
        <p className="text-[#1A1A1A] text-base font-black">Your Companions</p>
        <span className="text-black/30 text-xs font-semibold">{muses.length} available</span>
      </div>

      {/* ── Cards ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {muses.map((muse, i) => (
            <MuseCard key={muse.id} muse={muse} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>

      {/* ── Wallet Modal ── */}
      <WalletModal
        isOpen={showWallet}
        balance={balance}
        minutesRemaining={minutesRemaining}
        topUpStatus={topUpStatus}
        topUpError={topUpError}
        onTopUp={onTopUp}
        onClose={onCloseWallet}
      />
    </div>
  );
}

// ── Muse Card ─────────────────────────────────────────────────────────────────

interface MuseCardProps {
  muse: Muse;
  index: number;
  onSelect: (muse: Muse) => void;
  key?: React.Key;
}

function MuseCard({ muse, index, onSelect }: MuseCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, scale: 1.015 }}
      whileTap={{ scale: 0.975 }}
      onClick={() => onSelect(muse)}
      className="w-full text-left focus:outline-none group"
    >
      <div
        className="relative rounded-[1.75rem] overflow-hidden shadow-lg transition-shadow duration-300 group-hover:shadow-2xl"
        style={{ height: 400 }}
      >
        <img
          src={muse.avatar}
          alt={muse.name}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.05) 35%, ${muse.accentColor}22 58%, rgba(0,0,0,0.82) 78%, rgba(0,0,0,0.95) 100%)`,
          }}
        />
        <div
          className="absolute bottom-0 inset-x-0 h-44 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 100% 60% at 50% 110%, ${muse.accentColor}30, transparent)` }}
        />

        {/* Online badge */}
        <div className="absolute top-4 left-4">
          {muse.active ? (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/10 text-[8px] font-black text-white/65 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Online
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/35 backdrop-blur-md border border-white/8 text-[8px] font-black text-white/30 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-white/20 inline-block" />
              Away
            </span>
          )}
        </div>

        {/* Bottom */}
        <div className="absolute bottom-0 inset-x-0 p-5">
          <h3 className="text-white text-2xl font-black tracking-tight mb-0.5 drop-shadow">{muse.name}</h3>
          <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: muse.accentColor }}>
            {muse.personality}
          </p>
          <div className="flex gap-1.5 flex-wrap mb-4">
            {muse.tags.map(tag => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider"
                style={{ backgroundColor: `${muse.accentColor}20`, color: muse.accentColor, border: `1px solid ${muse.accentColor}40` }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-black text-white text-sm transition-all"
            style={{ backgroundColor: muse.accentColor, boxShadow: `0 6px 24px ${muse.accentColor}50` }}
          >
            <span className="flex items-center gap-2 uppercase tracking-wider text-[11px]">
              <Mic className="w-3.5 h-3.5" />
              Start Call
            </span>
            <ChevronRight className="w-4 h-4 opacity-70" />
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ── Wallet Modal ──────────────────────────────────────────────────────────────

interface WalletModalProps {
  isOpen: boolean;
  balance: number;
  minutesRemaining: number;
  topUpStatus: "idle" | "processing" | "error";
  topUpError: string | null;
  onTopUp: (amount: number) => void;
  onClose: () => void;
}

function WalletModal({ isOpen, balance, minutesRemaining, topUpStatus, topUpError, onTopUp, onClose }: WalletModalProps) {
  const isProcessing = topUpStatus === "processing";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 flex items-end sm:items-center justify-center z-[90] p-4"
          >
            <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden">

              {/* Header */}
              <div className="px-6 pt-6 pb-5 border-b border-black/5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF5E62] to-[#FF2D55] flex items-center justify-center shadow-sm">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-black text-base leading-tight">My Wallet</p>
                      <p className="text-black/35 text-xs">Ekti AI Credits</p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all">
                      <X className="w-4 h-4 text-black/50" />
                    </button>
                  )}
                </div>

                {/* Balance card */}
                <div className="bg-gradient-to-br from-[#FF5E62] to-[#FF2D55] rounded-2xl px-5 py-4 text-white">
                  <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Available Balance</p>
                  <p className="text-4xl font-black tracking-tight">₹{balance.toFixed(0)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-white/55 text-xs">
                      ~{minutesRemaining} min talk time remaining
                    </p>
                    <span className="text-white/50 text-[10px] font-bold">₹{RATE_PER_MIN_INR}/min</span>
                  </div>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {topUpError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mx-6 mt-4 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
                  >
                    <p className="text-red-500 text-xs font-semibold">{topUpError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add money */}
              <div className="px-6 py-5">
                <p className="text-[#1A1A1A] text-sm font-black mb-3">Add Money</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {TOP_UP_AMOUNTS.map(amount => (
                    <motion.button
                      key={amount}
                      whileTap={{ scale: isProcessing ? 1 : 0.95 }}
                      onClick={() => !isProcessing && onTopUp(amount)}
                      disabled={isProcessing}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-black/8 bg-[#F5F5F7] hover:bg-[#EFEFF2] hover:border-[#FF5E62]/30 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div>
                        <span className="text-[#1A1A1A] font-black text-sm">₹{amount}</span>
                        <p className="text-black/35 text-[9px] mt-0.5">~{Math.floor(amount / RATE_PER_MIN_INR)} min</p>
                      </div>
                      {isProcessing
                        ? <Loader2 className="w-3.5 h-3.5 text-[#FF5E62] animate-spin" />
                        : <Plus className="w-3.5 h-3.5 text-black/25 group-hover:text-[#FF5E62] transition-colors" />
                      }
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-black/20 text-[10px] font-semibold mt-4 uppercase tracking-widest">
                  Secured by Cashfree · Instant activation
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
