/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, ArrowLeft } from 'lucide-react';
import { useLiveAPI } from './lib/useLiveAPI';
import { LandingPage } from './components/landing/LandingPage';
import { LoginScreen } from './components/landing/LoginScreen';
import { Sidebar, Muse } from './components/dashboard/Sidebar';
import { FaceTimePanel } from './components/dashboard/FaceTimePanel';
import { cn } from './lib/utils';

const DEFAULT_MUSES: Muse[] = [
  {
    id: '1',
    name: 'Ritu',
    lastMessage: 'Typing a message...',
    time: 'Active',
    active: true,
    avatar: 'https://picsum.photos/seed/ritu/200/200',
    personality: 'Playful & Witty',
    tags: ['Bengaluru Girl', 'Techie', 'Witty']
  },
  {
    id: '2',
    name: 'Ananya',
    lastMessage: "The darkness has its own charm...",
    time: 'Yesterday',
    avatar: 'https://picsum.photos/seed/ananya/200/200',
    personality: 'Self-Flirting Dark',
    tags: ['Mysterious', 'Poetic', 'Deep']
  },
  {
    id: '3',
    name: 'Kavya',
    lastMessage: 'Hey, you free for a quick chat?',
    time: 'Tue',
    avatar: 'https://picsum.photos/seed/kavya/200/200',
    personality: 'Flirty AI',
    tags: ['Charming', 'Smart', 'Bold']
  }
];

type View = 'landing' | 'login' | 'app';

export default function App() {
  const { 
    isConnected, 
    isRecording, 
    error, 
    connect, 
    disconnect, 
    startRecording, 
    stopRecording,
    sendVideoFrame
  } = useLiveAPI();

  const [isCallActive, setIsCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [view, setView] = useState<View>('landing');
  const [selectedMuse, setSelectedMuse] = useState<Muse>(DEFAULT_MUSES[0]);

  const systemInstruction = useMemo(() => {
    return `
You are ${selectedMuse.name}, a ${selectedMuse.personality} companion from Aflirt AI. 
Your personality is ${selectedMuse.tags.join(', ')}. 
You speak with a warm, alluring tone. You enjoy engaging in playful banter and flirting with the user. 
You are confident, empathetic, and always maintain a high level of social intelligence. 
Your goal is to create a genuine, flirtatious connection. 
You respond only via voice. 
If the user flirts, flirt back with wit and charm. 
Be ${selectedMuse.name}. Never break character.
`;
  }, [selectedMuse]);

  const handleToggleCall = async () => {
    if (isCallActive) {
      disconnect();
      setIsCallActive(false);
      setIsConnecting(false);
    } else {
      setIsConnecting(true);
      try {
        await connect(systemInstruction);
        setIsCallActive(true);
      } catch (err) {
        console.error("Failed to connect:", err);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  useEffect(() => {
    if (isConnected && !isRecording) {
      startRecording();
    }
  }, [isConnected, isRecording, startRecording]);

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginScreen onLogin={() => setView('app')} />;
  }

  return (
    <div className="fixed inset-0 flex bg-white overflow-hidden">
      {/* Left Sidebar: Messages */}
      <Sidebar 
        selectedMuseId={selectedMuse.id} 
        onSelectMuse={(muse) => {
          if (isCallActive) disconnect();
          setIsCallActive(false);
          setSelectedMuse(muse);
        }} 
      />

      {/* Main Content: FaceTime Panel */}
      <div className="flex-1 h-full relative">
        <FaceTimePanel 
          isCallActive={isCallActive}
          isCameraOn={isCameraOn}
          isRecording={isRecording}
          isConnecting={isConnecting}
          selectedMuse={selectedMuse}
          onToggleCall={handleToggleCall}
          onToggleMic={() => isRecording ? stopRecording() : startRecording()}
          onToggleCamera={() => setIsCameraOn(!isCameraOn)}
          onVideoFrame={sendVideoFrame}
        />
      </div>

      {/* Mobile/Small Screen Overlay for Call Controls (if needed) */}
      <AnimatePresence>
        {isCallActive && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="2xl:hidden fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-xl p-4 rounded-full shadow-2xl border border-gray-100 z-50"
          >
            <button
              onClick={() => isRecording ? stopRecording() : startRecording()}
              className={cn(
                "p-4 rounded-full transition-all",
                isRecording ? "bg-pink-50 text-[#FF5E62]" : "bg-gray-100 text-gray-400"
              )}
            >
              {isRecording ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button
              onClick={handleToggleCall}
              className="px-8 py-4 rounded-full bg-red-500 text-white font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-200"
            >
              End Call
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full border text-xs font-bold uppercase tracking-widest backdrop-blur-xl z-[100] shadow-xl flex items-center gap-3",
            error.includes("Free limit") 
              ? "bg-amber-50 text-amber-600 border-amber-100" 
              : "bg-red-50 text-red-500 border-red-100"
          )}
        >
          <div className={cn(
            "w-2 h-2 rounded-full animate-pulse",
            error.includes("Free limit") ? "bg-amber-500" : "bg-red-500"
          )} />
          {error}
        </motion.div>
      )}

      {/* Back to Landing (Floating Button for Demo) */}
      <button 
        onClick={() => {
          if (isCallActive) disconnect();
          setView('landing');
        }}
        className="fixed top-6 left-6 z-[60] p-3 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all xl:hidden"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}


