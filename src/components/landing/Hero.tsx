import { motion } from 'motion/react';
import { Phone, Star } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-20 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-100 text-[#FF5E62] text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-[#FF5E62] animate-pulse" />
              Limited Beta Access
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1A1A1A] leading-[1.1] tracking-tight mb-6">
              Master the Art of{' '}
              <span className="text-[#FF5E62]">Flirting.</span>
            </h1>

            <p className="text-lg sm:text-xl text-[#666666] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Experience connection without the pressure. Practice your banter with sophisticated AI companions that feel remarkably real.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <button
                onClick={onGetStarted}
                className="w-full sm:w-auto bg-[#FF5E62] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#ff4b4f] transition-all shadow-xl shadow-pink-200 active:scale-95"
              >
                Get Started — It's Free
              </button>

              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      src={`https://picsum.photos/seed/user${i}/100/100`}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white"
                      alt="User"
                      referrerPolicy="no-referrer"
                    />
                  ))}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-gray-500">
                    +2k
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-400">2,400+ beta users</span>
              </div>
            </div>

            {/* Mobile social proof stars */}
            <div className="flex items-center justify-center lg:hidden gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FF5E62] text-[#FF5E62]" />
              ))}
              <span className="text-xs text-gray-400 ml-2 font-medium">4.9 / 5 rating</span>
            </div>
          </motion.div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[300px] lg:max-w-[360px] aspect-[9/19] bg-white rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-[6px] sm:border-[8px] border-gray-900 overflow-hidden mx-auto">
              {/* Status Bar */}
              <div className="h-8 bg-white flex items-center justify-between px-5">
                <span className="text-[10px] font-bold">9:41</span>
                <div className="flex gap-1">
                  <div className="w-3 h-1.5 rounded-full bg-black/10" />
                  <div className="w-3 h-1.5 rounded-full bg-black/10" />
                  <div className="w-3 h-1.5 rounded-full bg-black" />
                </div>
              </div>
              {/* Chat Interface */}
              <div className="p-3 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <img src="https://picsum.photos/seed/mia/200/200" className="w-8 h-8 rounded-full" alt="Mia" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs">Mia</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-[5px] text-white">✓</span>
                        </div>
                      </div>
                      <span className="text-[9px] text-green-500 font-bold">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-50 text-[7px] font-bold text-orange-600 border border-orange-100">
                    🔥 High
                  </div>
                </div>
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img src="https://picsum.photos/seed/mia-photo/600/600" className="w-full h-full object-cover" alt="Mia" referrerPolicy="no-referrer" />
                </div>
                <div className="space-y-2">
                  <div className="bg-gray-100 rounded-xl rounded-tl-none p-2 max-w-[80%]">
                    <p className="text-[10px] text-gray-700">You finally made it 😉</p>
                  </div>
                  <div className="bg-[#FF5E62] rounded-xl rounded-tr-none p-2 max-w-[80%] ml-auto">
                    <p className="text-[10px] text-white">Had to perfect my opener.</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-3 right-3 h-9 bg-gray-50 rounded-full border border-gray-100 flex items-center px-3 justify-between">
                  <span className="text-[9px] text-gray-400">Type your reply...</span>
                  <div className="w-6 h-6 rounded-full bg-[#FF5E62] flex items-center justify-center">
                    <Phone className="w-3 h-3 text-white rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative blobs */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-pink-100 rounded-full blur-3xl opacity-60 -z-10" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-blue-100 rounded-full blur-3xl opacity-50 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
