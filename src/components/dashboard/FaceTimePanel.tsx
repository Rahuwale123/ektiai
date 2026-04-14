import { motion, AnimatePresence } from 'motion/react';
import { Settings, Mic, MicOff, PhoneOff, Video, VideoOff, Play, Sparkles } from 'lucide-react';
import { CameraPreview } from '../CameraPreview';
import { VoiceVisualizer } from '../VoiceVisualizer';
import { cn } from '../../lib/utils';

import { Muse } from './Sidebar';

interface FaceTimePanelProps {
  isCallActive: boolean;
  isCameraOn: boolean;
  isRecording: boolean;
  isConnecting: boolean;
  selectedMuse: Muse;
  onToggleCall: () => void;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onVideoFrame: (base64: string) => void;
}

export function FaceTimePanel({
  isCallActive,
  isCameraOn,
  isRecording,
  isConnecting,
  selectedMuse,
  onToggleCall,
  onToggleMic,
  onToggleCamera,
  onVideoFrame
}: FaceTimePanelProps) {
  return (
    <div className="w-full h-full bg-white flex flex-col p-4 md:p-8 overflow-y-auto">
      {/* FaceTime Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">FaceTime</h2>
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isCallActive ? "bg-red-500 animate-pulse" : "bg-gray-300")} />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {isCallActive ? "Live" : "Offline"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-xs font-bold text-gray-900">{selectedMuse.name}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">{selectedMuse.personality}</span>
          </div>
          <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Preview Container */}
      <div className="relative group flex-1 min-h-[400px] mb-6">
        <div className="absolute -inset-1 bg-gradient-to-br from-[#FF5E62]/10 to-blue-500/10 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative bg-gray-900 rounded-[3rem] h-full overflow-hidden shadow-2xl border border-gray-100">
          {/* Main Content: Either Camera or Visualizer */}
          <div className="absolute inset-0">
            {isCallActive ? (
              <CameraPreview 
                className="w-full h-full object-cover" 
                onFrame={onVideoFrame}
                isStreaming={isCameraOn}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black p-12">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10"
                >
                  <Video className="w-12 h-12 text-white/20" />
                </motion.div>
                <h4 className="text-white text-xl font-bold text-center mb-2">Ready to connect?</h4>
                <p className="text-white/40 text-sm text-center max-w-xs">Start a video call with {selectedMuse.name} to see her reaction in real-time.</p>
              </div>
            )}
          </div>

          {/* Overlay Controls */}
          <div className="absolute inset-x-0 bottom-10 flex justify-center gap-6 z-20">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleMic}
              className={cn(
                "p-5 rounded-full backdrop-blur-xl transition-all border border-white/10",
                isRecording ? "bg-white/20 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {isRecording ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleCall}
              disabled={isConnecting}
              className={cn(
                "p-7 rounded-full shadow-2xl transition-all",
                isCallActive ? "bg-red-500 text-white" : "bg-[#FF5E62] text-white"
              )}
            >
              {isConnecting ? (
                <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isCallActive ? (
                <PhoneOff className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 fill-white" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleCamera}
              className={cn(
                "p-5 rounded-full backdrop-blur-xl transition-all border border-white/10",
                isCameraOn ? "bg-white/20 text-white" : "bg-red-500/80 text-white"
              )}
            >
              {isCameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Floating User Preview (Small) */}
          {isCallActive && (
            <div className="absolute top-8 right-8 w-32 aspect-[3/4] bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden z-20 shadow-2xl">
              <div className="w-full h-full flex items-center justify-center">
                {isCameraOn ? (
                  <CameraPreview 
                    className="w-full h-full border-0" 
                    isStreaming={isCameraOn}
                  />
                ) : (
                  <>
                    <VideoOff className="w-8 h-8 text-white/20" />
                    <span className="absolute bottom-3 text-[10px] font-bold text-white/40 uppercase tracking-widest">You</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* AI Name Tag */}
          <div className="absolute top-8 left-8 px-4 py-2 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 z-20">
            <span className="text-xs font-bold text-white uppercase tracking-widest">{selectedMuse.name}</span>
          </div>
        </div>
      </div>

      {/* Vibe Section */}
      <div className="bg-gray-50 rounded-[3rem] p-6 md:p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#FF5E62]" />
            </div>
            <div>
              <h4 className="font-bold text-[#1A1A1A]">Connection Vibe</h4>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Real-time Analysis</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-full bg-pink-100 text-[10px] font-black text-[#FF5E62] uppercase tracking-widest border border-pink-200">{selectedMuse.tags[1] || 'Flirty'}</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Sweet</span>
            <span>Spicy</span>
          </div>
          <div className="h-3 w-full bg-gray-200 rounded-full relative overflow-hidden shadow-inner">
            <motion.div 
              initial={{ width: "40%" }}
              animate={{ width: isCallActive ? "75%" : "40%" }}
              className="h-full bg-gradient-to-r from-[#FF5E62] via-pink-500 to-purple-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
