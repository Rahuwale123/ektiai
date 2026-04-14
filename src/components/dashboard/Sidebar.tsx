import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface Muse {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  active?: boolean;
  avatar: string;
  personality: string;
  tags: string[];
  voice: string;
  accentColor: string;
}

const muses: Muse[] = [
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

interface SidebarProps {
  selectedMuseId: string;
  onSelectMuse: (muse: Muse) => void;
}

export function Sidebar({ selectedMuseId, onSelectMuse }: SidebarProps) {
  return (
    <div className="w-80 h-full bg-white border-r border-gray-100 flex flex-col p-6 overflow-y-auto hidden xl:flex">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Your Muses</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Choose your companion</p>
      </div>

      <div className="space-y-2">
        {muses.map((muse) => (
          <motion.div
            key={muse.id}
            whileHover={{ x: 4 }}
            onClick={() => onSelectMuse(muse)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-3xl cursor-pointer transition-all",
              selectedMuseId === muse.id ? "bg-pink-50/50 border border-pink-100" : "hover:bg-gray-50"
            )}
          >
            <div className="relative">
              <img
                src={muse.avatar}
                className="w-12 h-12 rounded-2xl object-cover"
                alt={muse.name}
                referrerPolicy="no-referrer"
              />
              {muse.active && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-bold text-[#1A1A1A] truncate">{muse.name}</h4>
                <span className={cn(
                  "text-[10px] font-bold",
                  selectedMuseId === muse.id ? "text-[#FF5E62]" : "text-gray-400"
                )}>
                  {muse.time}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate">{muse.lastMessage}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t border-gray-50">
        <p className="text-[10px] text-gray-300 text-center uppercase tracking-widest font-bold">Powered by Gemini Live</p>
      </div>
    </div>
  );
}
