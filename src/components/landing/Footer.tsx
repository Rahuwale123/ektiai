import { Sparkles, Twitter, Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FF5E62] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">Aflirt AI</span>
            </div>
            <p className="text-[#666666] leading-relaxed mb-8 max-w-xs">
              The premier platform for practicing meaningful connections and social skills using advanced AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF5E62] hover:border-[#FF5E62] transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#FF5E62] hover:border-[#FF5E62] transition-all">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#1A1A1A] mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-[#666666]">
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">AI Models</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#1A1A1A] mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-[#666666]">
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Dating Guide</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="font-bold text-[#1A1A1A] mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-[#666666]">
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-[#FF5E62] transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-gray-100 gap-6">
          <p className="text-xs text-gray-400">
            © 2024 Aflirt AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Platform Status: Optimal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
