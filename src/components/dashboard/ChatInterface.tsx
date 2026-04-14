import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Video, Info, Plus, Smile, Send } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Muse } from './Sidebar';

export interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  time: string;
}

interface ChatInterfaceProps {
  isCallActive: boolean;
  selectedMuse: Muse;
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function ChatInterface({ isCallActive, selectedMuse, messages, onSendMessage }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex-1 h-full bg-white flex flex-col relative">
      {/* Header */}
      <header className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={selectedMuse.avatar} 
              className="w-12 h-12 rounded-2xl object-cover" 
              alt={selectedMuse.name}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-bold text-lg text-[#1A1A1A]">{selectedMuse.name}</h3>
              <div className="flex gap-2">
                {selectedMuse.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 text-[8px] font-bold text-gray-400 uppercase tracking-widest">{tag}</span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400">{isCallActive ? "In a video call" : "Online"}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
            <Info className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="text-center">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Connected at 2:14 PM</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={cn(
            "flex gap-4 max-w-[80%]",
            msg.sender === 'user' ? "ml-auto flex-row-reverse" : ""
          )}>
            {msg.sender === 'ai' && (
              <img src={selectedMuse.avatar} className="w-8 h-8 rounded-xl flex-shrink-0" alt={selectedMuse.name} referrerPolicy="no-referrer" />
            )}
            <div className="space-y-2">
              <div className={cn(
                "p-5 rounded-[2rem]",
                msg.sender === 'ai' 
                  ? "bg-gray-50 text-[#1A1A1A] rounded-tl-none" 
                  : "bg-[#FF5E62] text-white rounded-tr-none shadow-lg shadow-pink-100"
              )}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <p className={cn(
                "text-[10px] font-bold text-gray-300",
                msg.sender === 'user' ? "text-right" : ""
              )}>
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button className="p-3 hover:bg-gray-50 rounded-2xl text-gray-400 transition-colors">
            <Plus className="w-6 h-6" />
          </button>
          <div className="flex-1 relative">
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Write your secret here..."
              className="w-full bg-gray-50 border-none rounded-full py-4 px-6 pr-12 text-sm focus:ring-2 focus:ring-[#FF5E62]/20 transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={handleSend}
            className="w-12 h-12 rounded-full bg-[#FF5E62] flex items-center justify-center text-white shadow-lg shadow-pink-200 hover:scale-105 active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
