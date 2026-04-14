import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, PhoneOff, Video, VideoOff, Play } from 'lucide-react';
import { CameraPreview } from '../CameraPreview';
import { cn } from '../../lib/utils';
import { Muse } from './Sidebar';

interface FaceTimePanelProps {
  isCallActive: boolean;
  isCameraOn: boolean;
  isRecording: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  selectedMuse: Muse;
  onToggleCall: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
}

export function FaceTimePanel({
  isCallActive,
  isCameraOn,
  isRecording,
  isConnecting,
  isSpeaking,
  selectedMuse,
  onToggleCall,
  onToggleMic,
  onToggleCamera,
}: FaceTimePanelProps) {
  return (
    <div className="w-full h-full bg-[#070707] flex flex-col relative overflow-hidden">

      {/* Ambient gradient — morphs with muse accent */}
      <div
        className="absolute inset-0 transition-all duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 80% 55% at 50% 0%, ${selectedMuse.accentColor}22 0%, transparent 65%)`,
        }}
      />

      {/* Subtle noise grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
      />

      {/* Status chip — top left */}
      <div className="absolute top-4 left-4 z-30">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/8">
          <div className={cn(
            "w-1.5 h-1.5 rounded-full transition-colors",
            isCallActive ? "bg-red-400 animate-pulse" : "bg-white/20"
          )} />
          <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">
            {isCallActive ? "Live" : "Ready"}
          </span>
        </div>
      </div>

      {/* User camera PiP */}
      <AnimatePresence>
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-4 right-4 w-[72px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/15 shadow-2xl z-20 bg-black/50 backdrop-blur-xl"
          >
            {isCameraOn ? (
              <CameraPreview className="w-full h-full border-0 rounded-none" isStreaming={isCameraOn} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                <VideoOff className="w-3.5 h-3.5 text-white/15" />
                <span className="text-[7px] font-black text-white/20 uppercase tracking-wider">You</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative px-6 pt-16 pb-2">
        <AnimatePresence mode="wait">

          {/* ── IDLE STATE ── */}
          {!isCallActive && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full"
            >
              {/* Avatar with glow */}
              <div className="relative mb-5">
                <div
                  className="absolute inset-0 rounded-full blur-2xl scale-110"
                  style={{ background: `${selectedMuse.accentColor}35` }}
                />
                <div
                  className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[2.5px]"
                  style={{ background: `linear-gradient(135deg, ${selectedMuse.accentColor}, ${selectedMuse.accentColor}40)` }}
                >
                  <img
                    src={selectedMuse.avatar}
                    alt={selectedMuse.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Inner shimmer */}
                  <div
                    className="absolute inset-[2.5px] rounded-full"
                    style={{ background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.12) 0%, transparent 55%)` }}
                  />
                </div>
              </div>

              {/* Name */}
              <h2 className="text-white text-3xl md:text-4xl font-black tracking-tight mb-1">{selectedMuse.name}</h2>

              {/* Personality */}
              <p className="text-white/35 text-xs font-semibold mb-4 tracking-wide">{selectedMuse.personality}</p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap justify-center mb-8">
                {selectedMuse.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                    style={{
                      backgroundColor: `${selectedMuse.accentColor}18`,
                      color: selectedMuse.accentColor,
                      border: `1px solid ${selectedMuse.accentColor}35`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tap hint */}
              <motion.p
                animate={{ opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25"
              >
                tap call to connect
              </motion.p>
            </motion.div>
          )}

          {/* ── ACTIVE CALL STATE ── */}
          {isCallActive && (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center w-full"
            >
              {/* Pulsing rings + avatar */}
              <div className="relative flex items-center justify-center mb-5">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border"
                    animate={isSpeaking
                      ? { scale: [1, 1.14 + i * 0.11, 1], opacity: [0.45, 0.08, 0.45] }
                      : { scale: [1, 1.03 + i * 0.025, 1], opacity: [0.18, 0.04, 0.18] }
                    }
                    transition={{
                      duration: isSpeaking ? 0.85 + i * 0.14 : 2.4 + i * 0.45,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.14,
                    }}
                    style={{
                      width: `${120 + i * 48}px`,
                      height: `${120 + i * 48}px`,
                      borderColor: `${selectedMuse.accentColor}${isSpeaking ? '55' : '28'}`,
                    }}
                  />
                ))}

                <motion.div
                  animate={isSpeaking ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                  className="relative z-10"
                >
                  <div
                    className="w-28 h-28 md:w-32 md:h-32 rounded-full p-[2px]"
                    style={{ background: `linear-gradient(135deg, ${selectedMuse.accentColor}, ${selectedMuse.accentColor}40)` }}
                  >
                    <img
                      src={selectedMuse.avatar}
                      alt={selectedMuse.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  {isSpeaking && (
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 0.55, repeat: Infinity }}
                      style={{ boxShadow: `0 0 28px 8px ${selectedMuse.accentColor}45` }}
                    />
                  )}
                </motion.div>
              </div>

              {/* Audio visualizer bars */}
              <div className="flex items-end justify-center gap-[3px] h-8 mb-4">
                {[...Array(11)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full"
                    style={{ background: `linear-gradient(to top, ${selectedMuse.accentColor}50, ${selectedMuse.accentColor})` }}
                    animate={isSpeaking
                      ? { height: [3, 14 + Math.abs(Math.sin(i * 1.1)) * 18, 3], opacity: [0.4, 1, 0.4] }
                      : { height: 3, opacity: 0.15 }
                    }
                    transition={{ duration: 0.45 + (i % 4) * 0.12, repeat: Infinity, delay: i * 0.06 }}
                  />
                ))}
              </div>

              {/* Name + speaking status */}
              <span className="text-white text-xl font-black mb-1.5 tracking-tight">{selectedMuse.name}</span>
              <motion.span
                animate={{ opacity: isSpeaking ? [0.55, 1, 0.55] : 0.25 }}
                transition={{ duration: 0.75, repeat: Infinity }}
                className="text-[9px] font-black uppercase tracking-[0.25em]"
                style={{ color: isSpeaking ? selectedMuse.accentColor : 'rgba(255,255,255,0.3)' }}
              >
                {isSpeaking ? "speaking..." : "listening..."}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Vibe Check compact glass card ── */}
      <div className="mx-4 mb-3">
        <div
          className="rounded-2xl px-4 py-3 border border-white/8"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none">✨</span>
              <div>
                <p className="text-[9px] font-black text-white/60 uppercase tracking-[0.2em]">Vibe Check</p>
              </div>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider"
              style={{
                backgroundColor: `${selectedMuse.accentColor}18`,
                color: selectedMuse.accentColor,
                border: `1px solid ${selectedMuse.accentColor}30`,
              }}
            >
              {selectedMuse.tags[0]}
            </span>
          </div>
          <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-wider mb-2">
            <span>Sweet</span><span>Spicy</span>
          </div>
          <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: "30%" }}
              animate={{ width: isCallActive ? "76%" : "30%" }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${selectedMuse.accentColor}70, ${selectedMuse.accentColor})` }}
            />
          </div>
        </div>
      </div>

      {/* ── Controls — glassmorphism floating pill ── */}
      <div className="mx-4 mb-6 md:mb-8">
        <div
          className="flex justify-center items-center gap-4 py-3 px-4 rounded-[2rem] border border-white/8"
          style={{ backgroundColor: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)' }}
        >
          {/* Mic */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleMic}
            className={cn(
              "p-3 rounded-full transition-all",
              isRecording
                ? "bg-white/10 text-white border border-white/10"
                : "bg-red-500/70 text-white border border-red-400/30"
            )}
          >
            {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </motion.button>

          {/* Main call button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.92 }}
            onClick={onToggleCall}
            disabled={isConnecting}
            className={cn(
              "p-5 rounded-full shadow-2xl transition-all relative overflow-hidden",
              isCallActive ? "bg-red-500 text-white" : "text-white"
            )}
            style={!isCallActive ? {
              backgroundColor: selectedMuse.accentColor,
              boxShadow: `0 8px 32px ${selectedMuse.accentColor}60`,
            } : {}}
          >
            {/* shimmer on idle */}
            {!isCallActive && !isConnecting && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 50%)' }}
                animate={{ opacity: [0.6, 0.2, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            {isConnecting
              ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : isCallActive
                ? <PhoneOff className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
                : <Play className="w-6 h-6 md:w-7 md:h-7 fill-white relative z-10" />
            }
          </motion.button>

          {/* Camera */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleCamera}
            className={cn(
              "p-3 rounded-full transition-all",
              isCameraOn
                ? "bg-white/10 text-white border border-white/10"
                : "bg-red-500/70 text-white border border-red-400/30"
            )}
          >
            {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

    </div>
  );
}
