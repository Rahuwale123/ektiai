import { motion } from 'motion/react';
import { Phone, Star } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="pt-32 pb-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF5E62] text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-[#FF5E62] animate-pulse" />
              Limited Beta Access
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-8">
              Master the Art of <br />
              <span className="text-[#FF5E62]">Flirting.</span>
            </h1>
            
            <p className="text-xl text-[#666666] leading-relaxed mb-10 max-w-lg">
              Experience connection without the pressure. Practice your banter with sophisticated AI companions that feel remarkably real.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-[#FF5E62] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#ff4b4f] transition-all shadow-xl shadow-pink-200 active:scale-95"
              >
                Get Started — It's Free
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <img 
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">
                    +2k
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400">Join 2,400+ active beta users</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            {/* App Mockup */}
            <div className="relative mx-auto w-full max-w-[400px] aspect-[9/19] bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[8px] border-gray-900 overflow-hidden">
              {/* Status Bar */}
              <div className="h-10 bg-white flex items-center justify-between px-8">
                <span className="text-xs font-bold">9:41</span>
                <div className="flex gap-1.5">
                  <div className="w-4 h-2 rounded-full bg-black/10" />
                  <div className="w-4 h-2 rounded-full bg-black/10" />
                  <div className="w-4 h-2 rounded-full bg-black" />
                </div>
              </div>

              {/* Chat Interface */}
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/mia/200/200" className="w-10 h-10 rounded-full" alt="Mia" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-sm">Mia</span>
                        <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-[6px] text-white">✓</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-green-500 font-bold uppercase">Online Now</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-orange-50 text-[8px] font-bold text-orange-600 border border-orange-100">
                    🔥 Chemistry: High
                  </div>
                </div>

                <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                  <img src="https://picsum.photos/seed/mia-photo/600/600" className="w-full h-full object-cover" alt="Mia" referrerPolicy="no-referrer" />
                </div>

                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-xs text-gray-700">You finally made it. I was starting to think you got shy. 😉</p>
                  </div>
                  <div className="bg-[#FF5E62] rounded-2xl rounded-tr-none p-3 max-w-[80%] ml-auto">
                    <p className="text-xs text-white">Just had to make sure my opening line was perfect.</p>
                  </div>
                </div>

                <div className="absolute bottom-6 left-4 right-4 h-12 bg-gray-50 rounded-full border border-gray-100 flex items-center px-4 justify-between">
                  <span className="text-xs text-gray-400">Type your reply...</span>
                  <div className="w-8 h-8 rounded-full bg-[#FF5E62] flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-3xl opacity-50 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
