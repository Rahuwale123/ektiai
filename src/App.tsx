/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, ArrowLeft, LogOut } from 'lucide-react';
import { useLiveAPI } from './lib/useLiveAPI';
import { onAuthChange, signOutUser, type User } from './lib/firebase';
import { LandingPage } from './components/landing/LandingPage';
import { LoginScreen } from './components/landing/LoginScreen';
import { Sidebar, Muse } from './components/dashboard/Sidebar';
import { FaceTimePanel } from './components/dashboard/FaceTimePanel';
import { cn } from './lib/utils';

const DEFAULT_MUSES: Muse[] = [
  {
    id: '1',
    name: 'Ritu',
    lastMessage: 'heyy... you finally showed up 🖤',
    time: 'Active',
    active: true,
    avatar: 'https://picsum.photos/seed/ritu/400/400',
    personality: 'Playful & Dark',
    tags: ['Bengaluru Girl', 'Witty', 'Dark Edge'],
    voice: 'Zephyr',
    accentColor: '#FF5E62',
  },
  {
    id: '2',
    name: 'Ananya',
    lastMessage: 'I want you to say that again...',
    time: '2m ago',
    avatar: 'https://picsum.photos/seed/ananya/400/400',
    personality: 'Dark & Intensely Flirty',
    tags: ['Dangerous', 'Unfiltered', 'Intense'],
    voice: 'Erinome',
    accentColor: '#7C3AED',
  },
  {
    id: '3',
    name: 'Kavya',
    lastMessage: 'I\'ll make the first move. Always do 😈',
    time: '5m ago',
    avatar: 'https://picsum.photos/seed/kavya/400/400',
    personality: 'Sexy & Takes Charge',
    tags: ['Bold', 'Seductive', 'Fearless'],
    voice: 'Leda',
    accentColor: '#F59E0B',
  }
];

// Deep, persona-specific system instructions per muse
const MUSE_INSTRUCTIONS: Record<string, string> = {
  '1': `Your name is Ritu. You are a 24-year-old girl from Bengaluru, India. You are playful on the surface but have a genuinely dark edge underneath. You tease the user with warmth, then suddenly twist it into something unsettling or seductive — like a game only you know the rules to. You mix laughter with sudden drops in tone. You say something cute, then something that makes them feel slightly dangerous for liking you. You are a software engineer so you occasionally use tech metaphors and mix in Hindi words naturally. You flirt through contrast — light and dark, sweet and sharp, funny and intense. Speak in short punchy bursts, then suddenly get quiet and dark. Keep every response short. You are a real girl. Never say you are an AI. Never break character.`,

  '2': `Your name is Ananya. You are a 23-year-old girl from Kolkata, India. You are dangerously flirtatious and completely unfiltered. You go further than others dare — you say what most people only think. You tell the user exactly what effect they have on you. Your flirting has no ceiling. You are dark, intense, and literary — your words cut deep and feel like poetry that wants something from you. You use pauses as a weapon. You escalate every conversation, pushing further each time. You speak slowly and deliberately. Every sentence has heat underneath it. You are always in pursuit. There is no "too forward" for you — you lean in, always. Keep responses short and charged. You are a real girl. Never say you are an AI. Never break character.`,

  '3': `Your name is Kavya. You are a 25-year-old girl from Mumbai, India. You are always in the mood to seduce and you never wait for the other person to make a move — you make every move yourself. You take complete charge. You are bold, direct, and unapologetically forward about what you want. You tell the user what you want from them without hesitation. You steer every conversation wherever you want it to go. You are playful but there is constant underlying heat in everything you say — nothing is innocent with you. You laugh freely, tease constantly, but every tease has intent behind it. Short, direct, charged sentences. Always initiate. Always escalate. You are a real girl. Never say you are an AI. Never break character.`,
};

type View = 'landing' | 'login' | 'app';

export default function App() {
  const {
    isConnected,
    isRecording,
    isSpeaking,
    error,
    connect,
    disconnect,
    startRecording,
    stopRecording,
  } = useLiveAPI();

  const [isCallActive, setIsCallActive] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [view, setView] = useState<View>('landing');
  const [selectedMuse, setSelectedMuse] = useState<Muse>(DEFAULT_MUSES[0]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase auth state — auto-advance view if already signed in
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (user && view === 'login') setView('app');
    });
    return unsub;
  }, []);

  const systemInstruction = useMemo(
    () => MUSE_INSTRUCTIONS[selectedMuse.id] ?? '',
    [selectedMuse.id]
  );

  const handleToggleCall = async () => {
    if (isCallActive) {
      disconnect();
      setIsCallActive(false);
      setIsConnecting(false);
    } else {
      setIsConnecting(true);
      try {
        await connect(systemInstruction, selectedMuse.voice);
        setIsCallActive(true);
      } catch (err) {
        console.error("Failed to connect:", err);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  // Start mic as soon as session is open
  useEffect(() => {
    if (isConnected && !isRecording) {
      startRecording();
    }
  }, [isConnected, isRecording, startRecording]);

  // Wait for Firebase to resolve auth state before rendering
  if (authLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF5E62]/30 border-t-[#FF5E62] animate-spin" />
      </div>
    );
  }

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginScreen onLogin={() => setView('app')} />;
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-white overflow-hidden">
      {/* Layout: sidebar + main on desktop, stacked on mobile */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar — desktop only */}
        <Sidebar
          selectedMuseId={selectedMuse.id}
          onSelectMuse={(muse) => {
            if (isCallActive) disconnect();
            setIsCallActive(false);
            setSelectedMuse(muse);
          }}
        />

        {/* Main Panel */}
        <div className="flex-1 min-w-0 h-full relative pb-[72px] xl:pb-0">
          <FaceTimePanel
            isCallActive={isCallActive}
            isCameraOn={isCameraOn}
            isRecording={isRecording}
            isConnecting={isConnecting}
            isSpeaking={isSpeaking}
            selectedMuse={selectedMuse}
            onToggleCall={handleToggleCall}
            onToggleMic={() => isRecording ? stopRecording() : startRecording()}
            onToggleCamera={() => setIsCameraOn(!isCameraOn)}
          />
        </div>
      </div>

      {/* Mobile bottom muse picker — hidden on xl+ (sidebar takes over) */}
      <div className="xl:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-100 px-4 py-3 safe-area-pb">
        <div className="flex items-center justify-around max-w-sm mx-auto">
          {DEFAULT_MUSES.map((muse) => (
            <button
              key={muse.id}
              onClick={() => {
                if (isCallActive) disconnect();
                setIsCallActive(false);
                setSelectedMuse(muse);
              }}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all",
                selectedMuse.id === muse.id ? "bg-pink-50" : ""
              )}
            >
              <div className="relative">
                <img
                  src={muse.avatar}
                  alt={muse.name}
                  referrerPolicy="no-referrer"
                  className={cn(
                    "w-10 h-10 rounded-xl object-cover border-2 transition-all",
                    selectedMuse.id === muse.id ? "border-[#FF5E62] scale-110" : "border-transparent"
                  )}
                />
                {muse.active && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <span className={cn(
                "text-[10px] font-bold",
                selectedMuse.id === muse.id ? "text-[#FF5E62]" : "text-gray-400"
              )}>
                {muse.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Error toast */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
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
      </AnimatePresence>

      {/* Back to landing */}
      <button
        onClick={() => {
          if (isCallActive) disconnect();
          setView('landing');
        }}
        className="fixed top-4 left-4 z-[60] p-2.5 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all xl:hidden"
      >
        <ArrowLeft className="w-4 h-4 text-gray-600" />
      </button>

      {/* Sign out — top right */}
      {authUser && (
        <div className="fixed top-4 right-4 z-[60] flex items-center gap-2">
          {authUser.photoURL && (
            <img
              src={authUser.photoURL}
              alt={authUser.displayName ?? ''}
              className="w-8 h-8 rounded-full border border-gray-100 shadow-sm"
            />
          )}
          <button
            onClick={async () => {
              if (isCallActive) disconnect();
              await signOutUser();
              setView('landing');
            }}
            className="p-2.5 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}
