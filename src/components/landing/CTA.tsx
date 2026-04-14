import { motion } from 'motion/react';

interface CTAProps {
  onGetStarted: () => void;
}

export function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-[3rem] bg-gradient-to-br from-[#FF5E62] to-[#FF9966] p-12 md:p-24 text-center overflow-hidden shadow-2xl shadow-pink-200"
        >
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to Find Your Perfect AI Match?
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Join our growing community and start mastering the art of connection today.
            </p>
            
            <button 
              onClick={onGetStarted}
              className="bg-white text-[#FF5E62] px-12 py-5 rounded-full font-bold text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95"
            >
              Get Started Now
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
