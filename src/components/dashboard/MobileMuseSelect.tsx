import { motion } from 'motion/react';
import { LogOut } from 'lucide-react';
import { Muse } from './Sidebar';
import { type User } from '../../lib/firebase';

interface Props {
  muses: Muse[];
  authUser: User | null;
  onSelect: (muse: Muse) => void;
  onSignOut: () => void;
}

export function MobileMuseSelect({ muses, authUser, onSelect, onSignOut }: Props) {
  return (
    <div className="fixed inset-0 bg-[#070707] overflow-y-auto">

      {/* Ambient top glow */}
      <div className="absolute top-0 inset-x-0 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,94,98,0.12) 0%, transparent 70%)' }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <div>
          <p className="text-white/25 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Choose your</p>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">
            Perfect Vibe&nbsp;
            <span className="text-[#FF5E62]">✦</span>
          </h1>
        </div>

        {/* Auth avatar + sign out */}
        {authUser && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {authUser.photoURL && (
              <img
                src={authUser.photoURL}
                alt={authUser.displayName ?? ''}
                className="w-8 h-8 rounded-full border border-white/10"
              />
            )}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all active:scale-95"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-white/40" />
            </button>
          </div>
        )}
      </div>

      {/* Sub-label */}
      <p className="px-5 mb-6 text-white/25 text-xs font-medium">
        Tap a card to start a live voice call
      </p>

      {/* Character cards */}
      <div className="px-4 pb-12 space-y-4">
        {muses.map((muse, i) => (
          <motion.button
            key={muse.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSelect(muse)}
            className="w-full text-left active:scale-[0.975] transition-transform duration-150"
          >
            <div className="relative rounded-[1.75rem] overflow-hidden h-64 bg-gray-950">

              {/* Photo */}
              <img
                src={muse.avatar}
                alt={muse.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay — dark at bottom, accent mid */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    to bottom,
                    rgba(0,0,0,0.06) 0%,
                    rgba(0,0,0,0.08) 35%,
                    ${muse.accentColor}28 60%,
                    rgba(0,0,0,0.92) 100%
                  )`,
                }}
              />

              {/* Accent glow at bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${muse.accentColor}30, transparent)`,
                  filter: 'blur(8px)',
                }}
              />

              {/* Online badge */}
              {muse.active && (
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[8px] font-black text-white/65 uppercase tracking-widest">Online</span>
                </div>
              )}

              {/* Connect CTA — top right */}
              <div
                className="absolute top-3.5 right-3.5 px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white"
                style={{
                  background: muse.accentColor,
                  boxShadow: `0 4px 18px ${muse.accentColor}65`,
                }}
              >
                Connect →
              </div>

              {/* Info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-2xl font-black tracking-tight mb-0.5 drop-shadow">
                  {muse.name}
                </h3>
                <p className="text-white/45 text-xs font-medium mb-3 drop-shadow">
                  {muse.personality}
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {muse.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                      style={{
                        backgroundColor: `${muse.accentColor}22`,
                        color: muse.accentColor,
                        border: `1px solid ${muse.accentColor}40`,
                        textShadow: 'none',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
