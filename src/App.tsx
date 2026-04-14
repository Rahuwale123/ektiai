/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useLiveAPI } from './lib/useLiveAPI';
import { onAuthChange, signOutUser, type User } from './lib/firebase';
import { LandingPage } from './components/landing/LandingPage';
import { LoginScreen } from './components/landing/LoginScreen';
import { Sidebar, Muse } from './components/dashboard/Sidebar';
import { FaceTimePanel } from './components/dashboard/FaceTimePanel';
import { MobileMuseSelect } from './components/dashboard/MobileMuseSelect';
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
type MobileScreen = 'select' | 'call';

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
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('select');
  const [selectedMuse, setSelectedMuse] = useState<Muse>(DEFAULT_MUSES[0]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Listen to Firebase auth state — if already signed in, go straight to app
  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setAuthUser(user);
      setAuthLoading(false);
      if (user) setView('app');
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

  // Mobile: user taps a character card → go to call screen
  const handleMobileSelect = (muse: Muse) => {
    if (isCallActive) disconnect();
    setIsCallActive(false);
    setSelectedMuse(muse);
    setMobileScreen('call');
  };

  // Mobile: back button on call screen
  const handleMobileBack = () => {
    if (isCallActive) disconnect();
    setIsCallActive(false);
    setMobileScreen('select');
  };

  // Desktop: switch muse from sidebar
  const handleDesktopMuseSelect = (muse: Muse) => {
    if (isCallActive) disconnect();
    setIsCallActive(false);
    setSelectedMuse(muse);
  };

  const handleSignOut = async () => {
    if (isCallActive) disconnect();
    await signOutUser();
    setView('landing');
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
      <div className="fixed inset-0 flex items-center justify-center bg-[#070707]">
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
    <div className="fixed inset-0 bg-[#070707] overflow-hidden">

      {/* ── MOBILE layout (hidden on xl+) ── */}
      <div className="xl:hidden h-full">
        <AnimatePresence mode="wait">

          {/* Screen 1 — Character selection */}
          {mobileScreen === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              <MobileMuseSelect
                muses={DEFAULT_MUSES}
                authUser={authUser}
                onSelect={handleMobileSelect}
                onSignOut={handleSignOut}
              />
            </motion.div>
          )}

          {/* Screen 2 — Call screen */}
          {mobileScreen === 'call' && (
            <motion.div
              key="call"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-full flex flex-col"
            >
              {/* Call top nav */}
              <div className="flex-shrink-0 bg-[#0A0A0A] border-b border-white/5 px-4 py-3 flex items-center gap-3 z-40">
                <button
                  onClick={handleMobileBack}
                  className="p-2 rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 transition-all active:scale-95 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 text-white/60" />
                </button>

                <img
                  src={selectedMuse.avatar}
                  alt={selectedMuse.name}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl object-cover border border-white/15 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-black leading-tight truncate">{selectedMuse.name}</p>
                  <p
                    className="text-[9px] font-bold uppercase tracking-wider truncate"
                    style={{ color: selectedMuse.accentColor }}
                  >
                    {selectedMuse.personality}
                  </p>
                </div>

                {isCallActive && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/25 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span className="text-[8px] font-black text-red-400 uppercase tracking-wider">Live</span>
                  </div>
                )}
              </div>

              {/* Call panel fills rest */}
              <div className="flex-1 min-h-0">
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
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── DESKTOP layout (hidden on mobile) ── */}
      <div className="hidden xl:flex h-full">
        <Sidebar
          selectedMuseId={selectedMuse.id}
          onSelectMuse={handleDesktopMuseSelect}
        />

        <div className="flex-1 min-w-0 h-full relative overflow-hidden">
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

        {/* Desktop sign-out */}
        {authUser && (
          <div className="fixed top-3 right-3 z-[60] flex items-center gap-2">
            {authUser.photoURL && (
              <img
                src={authUser.photoURL}
                alt={authUser.displayName ?? ''}
                className="w-7 h-7 rounded-full border border-white/10"
              />
            )}
            <button
              onClick={handleSignOut}
              className="p-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 hover:bg-white/15 transition-all"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5 text-white/50" />
            </button>
          </div>
        )}
      </div>

      {/* Error toast — both layouts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={cn(
              "fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full border text-xs font-bold uppercase tracking-widest backdrop-blur-xl z-[100] shadow-xl flex items-center gap-2 whitespace-nowrap",
              error.includes("Free limit")
                ? "bg-amber-950/80 text-amber-400 border-amber-800/50"
                : "bg-red-950/80 text-red-400 border-red-800/50"
            )}
          >
            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", error.includes("Free limit") ? "bg-amber-400" : "bg-red-400")} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
