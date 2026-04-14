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
}

const muses: Muse[] = [
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

interface SidebarProps {
  selectedMuseId: string;
  onSelectMuse: (muse: Muse) => void;
}

export function Sidebar({ selectedMuseId, onSelectMuse }: SidebarProps) {
  return (
    <div className="w-80 h-full bg-white border-r border-gray-100 flex flex-col p-6 overflow-y-auto hidden xl:flex">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">Your Muses</h2>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Bengaluru's Finest</p>
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
    </div>
  );
}
