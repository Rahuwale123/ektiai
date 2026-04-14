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
    <div className="w-full h-full bg-white flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1A1A1A] mb-0.5">Live Call</h2>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-1.5 h-1.5 rounded-full transition-colors",
              isCallActive ? "bg-red-500 animate-pulse" : "bg-gray-300"
            )} />
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {isCallActive ? "Live" : "Ready"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Video/AI Area */}
      <div className="relative group flex-1 min-h-0 mb-3 sm:mb-4 md:mb-6" style={{ minHeight: '260px' }}>
        {/* Glow backdrop */}
        <div
          className="absolute -inset-1 rounded-[2rem] md:rounded-[3rem] blur-2xl opacity-40 group-hover:opacity-70 transition duration-1000"
          style={{ background: `linear-gradient(135deg, ${selectedMuse.accentColor}33, #3b82f620)` }}
        />

        <div className="relative bg-gray-900 rounded-[2rem] md:rounded-[3rem] h-full overflow-hidden shadow-2xl border border-gray-100">
          <AnimatePresence mode="wait">
            {!isCallActive ? (
              /* Idle state */
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-6 md:p-12"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative mb-5 md:mb-8"
                >
                  <img
                    src={selectedMuse.avatar}
                    alt={selectedMuse.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/10"
                  />
                  <div
                    className="absolute inset-0 rounded-full opacity-20"
                    style={{ boxShadow: `0 0 40px 10px ${selectedMuse.accentColor}` }}
                  />
                </motion.div>
                <h4 className="text-white text-lg sm:text-xl md:text-2xl font-bold text-center mb-1">{selectedMuse.name}</h4>
                <p className="text-white/40 text-xs md:text-sm text-center font-medium mb-2">{selectedMuse.personality}</p>
                <div className="flex flex-wrap gap-1.5 mt-2 justify-center">
                  {selectedMuse.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 text-white/30 text-[8px] font-bold uppercase tracking-wider border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-white/20 text-[10px] mt-5 md:mt-8 text-center uppercase tracking-widest font-bold">Tap call to connect</p>
              </motion.div>
            ) : (
              /* Active call */
              <motion.div
                key="active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black"
              >
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: `radial-gradient(circle at 50% 40%, ${selectedMuse.accentColor} 0%, transparent 65%)` }}
                />

                {/* Pulsing rings */}
                <div className="relative flex items-center justify-center mb-4 md:mb-8">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border"
                      animate={isSpeaking
                        ? { scale: [1, 1.15 + i * 0.12, 1], opacity: [0.5, 0.1, 0.5] }
                        : { scale: [1, 1.04 + i * 0.03, 1], opacity: [0.2, 0.05, 0.2] }
                      }
                      transition={{
                        duration: isSpeaking ? 0.9 + i * 0.15 : 2.5 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.15,
                      }}
                      style={{
                        width: `${110 + i * 44}px`,
                        height: `${110 + i * 44}px`,
                        borderColor: `${selectedMuse.accentColor}${isSpeaking ? '60' : '30'}`,
                      }}
                    />
                  ))}

                  <motion.div
                    animate={isSpeaking ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, repeat: isSpeaking ? Infinity : 0 }}
                    className="relative z-10"
                  >
                    <img
                      src={selectedMuse.avatar}
                      alt={selectedMuse.name}
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full object-cover border-4"
                      style={{ borderColor: `${selectedMuse.accentColor}60` }}
                    />
                    {isSpeaking && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 0.6, repeat: Infinity }}
                        style={{ boxShadow: `0 0 30px 8px ${selectedMuse.accentColor}50` }}
                      />
                    )}
                  </motion.div>
                </div>

                {/* Audio bars */}
                <div className="flex items-end justify-center gap-1 h-8 md:h-10 mb-3 md:mb-4">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full"
                      style={{ background: `linear-gradient(to top, ${selectedMuse.accentColor}60, ${selectedMuse.accentColor})` }}
                      animate={isSpeaking
                        ? { height: [4, 20 + Math.sin(i) * 10, 4], opacity: [0.5, 1, 0.5] }
                        : { height: 3, opacity: 0.2 }
                      }
                      transition={{ duration: 0.5 + Math.random() * 0.4, repeat: Infinity, delay: i * 0.07 }}
                    />
                  ))}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span className="text-white text-sm md:text-base font-bold">{selectedMuse.name}</span>
                  <motion.span
                    animate={{ opacity: isSpeaking ? [0.6, 1, 0.6] : 0.3 }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-[9px] font-bold uppercase tracking-widest"
                    style={{ color: isSpeaking ? selectedMuse.accentColor : '#ffffff50' }}
                  >
                    {isSpeaking ? "Speaking..." : "Listening"}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User camera PiP */}
          <AnimatePresence>
            {isCallActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-4 right-4 w-16 sm:w-20 md:w-28 aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden border border-white/20 shadow-xl z-20 bg-black/40 backdrop-blur-xl"
              >
                {isCameraOn ? (
                  <CameraPreview className="w-full h-full border-0 rounded-none" isStreaming={isCameraOn} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                    <VideoOff className="w-4 h-4 text-white/20" />
                    <span className="text-[8px] font-bold text-white/30 uppercase">You</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Call controls */}
          <div className="absolute inset-x-0 bottom-5 md:bottom-8 flex justify-center items-center gap-3 md:gap-5 z-20">
            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={onToggleMic}
              className={cn(
                "p-3 md:p-4 rounded-full backdrop-blur-xl transition-all border",
                isRecording ? "bg-white/15 text-white border-white/15" : "bg-red-500/80 text-white border-red-400/50"
              )}
            >
              {isRecording ? <Mic className="w-4 h-4 md:w-5 md:h-5" /> : <MicOff className="w-4 h-4 md:w-5 md:h-5" />}
            </motion.button>

            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={onToggleCall}
              disabled={isConnecting}
              className={cn("p-5 md:p-6 rounded-full shadow-2xl transition-all", isCallActive ? "bg-red-500 text-white" : "text-white")}
              style={!isCallActive ? { backgroundColor: selectedMuse.accentColor } : {}}
            >
              {isConnecting
                ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : isCallActive
                  ? <PhoneOff className="w-6 h-6 md:w-7 md:h-7" />
                  : <Play className="w-6 h-6 md:w-7 md:h-7 fill-white" />
              }
            </motion.button>

            <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
              onClick={onToggleCamera}
              className={cn(
                "p-3 md:p-4 rounded-full backdrop-blur-xl transition-all border",
                isCameraOn ? "bg-white/15 text-white border-white/15" : "bg-red-500/80 text-white border-red-400/50"
              )}
            >
              {isCameraOn ? <Video className="w-4 h-4 md:w-5 md:h-5" /> : <VideoOff className="w-4 h-4 md:w-5 md:h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Vibe section */}
      <div className="bg-gray-50 rounded-[1.75rem] md:rounded-[2.5rem] p-4 md:p-6 border border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${selectedMuse.accentColor}18` }}>
              <span className="text-sm md:text-lg">✨</span>
            </div>
            <div>
              <h4 className="font-bold text-[#1A1A1A] text-xs md:text-sm">Vibe Check</h4>
              <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Live Chemistry</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border"
            style={{ backgroundColor: `${selectedMuse.accentColor}12`, color: selectedMuse.accentColor, borderColor: `${selectedMuse.accentColor}30` }}>
            {selectedMuse.tags[0]}
          </span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Sweet</span><span>Spicy</span>
          </div>
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <motion.div
              initial={{ width: "35%" }}
              animate={{ width: isCallActive ? "78%" : "35%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(to right, ${selectedMuse.accentColor}80, ${selectedMuse.accentColor})` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
