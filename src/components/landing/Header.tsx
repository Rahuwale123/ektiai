import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-[#FF5E62] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Aflirt AI</span>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            <a href="#how-it-works" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">How It Works</a>
            <a href="#why-aflirt" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">Why Aflirt?</a>
            <a href="#success-stories" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">Success Stories</a>
          </nav>

          <div className="flex items-center gap-6">
            <button 
              onClick={onGetStarted}
              className="text-sm font-semibold text-[#1A1A1A] hover:text-[#FF5E62] transition-colors"
            >
              Login
            </button>
            <button 
              onClick={onGetStarted}
              className="bg-[#FF5E62] text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-[#ff4b4f] transition-all shadow-lg shadow-pink-200 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
