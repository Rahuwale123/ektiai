import { Sparkles, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white pt-16 md:pt-24 pb-10 md:pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-16 mb-12 md:mb-20">
          {/* Brand — full width on mobile */}
          <div className="col-span-2 md:col-span-4">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#FF5E62] flex items-center justify-center">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-[#1A1A1A] tracking-tight">Aflirt AI</span>
            </div>
            <p className="text-sm text-[#666666] leading-relaxed mb-5 md:mb-8 max-w-xs">
              The premier platform for practicing meaningful connections using advanced AI.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF5E62] hover:border-[#FF5E62] transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF5E62] hover:border-[#FF5E62] transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#1A1A1A] mb-4 md:mb-6 text-sm">Product</h4>
            <ul className="space-y-3 text-sm text-[#666666]">
              {['Features', 'Pricing', 'AI Models', 'Roadmap'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#FF5E62] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#1A1A1A] mb-4 md:mb-6 text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-[#666666]">
              {['About Us', 'Privacy', 'Terms', 'Contact'].map(item => (
                <li key={item}><a href="#" className="hover:text-[#FF5E62] transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 md:pt-12 border-t border-gray-100 gap-3">
          <p className="text-xs text-gray-400">© 2024 Aflirt AI. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
