import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X } from 'lucide-react';

interface HeaderProps {
  onGetStarted: () => void;
}

export function Header({ onGetStarted }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#FF5E62] flex items-center justify-center">
              <Sparkles className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight">Ekti AI</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            <a href="#how-it-works" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">How It Works</a>
            <a href="#why-aflirt" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">Why Ekti?</a>
            <a href="#success-stories" className="text-sm font-medium text-[#666666] hover:text-[#FF5E62] transition-colors">Stories</a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            <button onClick={onGetStarted} className="text-sm font-semibold text-[#1A1A1A] hover:text-[#FF5E62] transition-colors">
              Login
            </button>
            <button onClick={onGetStarted} className="bg-[#FF5E62] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#ff4b4f] transition-all shadow-lg shadow-pink-200 active:scale-95">
              Get Started
            </button>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <button onClick={onGetStarted} className="bg-[#FF5E62] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md shadow-pink-200 active:scale-95">
              Get Started
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-xl text-gray-600">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {['How It Works', 'Why Ekti?', 'Success Stories'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-').replace('?', '')}`}
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-[#666666] hover:bg-pink-50 hover:text-[#FF5E62] transition-colors"
                >
                  {item}
                </a>
              ))}
              <button
                onClick={() => { onGetStarted(); setMenuOpen(false); }}
                className="mt-2 w-full py-3 rounded-full bg-[#FF5E62] text-white font-bold text-sm"
              >
                Login / Sign Up
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
