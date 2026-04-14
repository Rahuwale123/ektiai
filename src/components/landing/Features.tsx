import { motion } from 'motion/react';
import { Shield, Brain, Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Features() {
  const features = [
    {
      icon: <Shield className="w-6 h-6 text-[#FF5E62]" />,
      title: "Judgment-Free",
      description: "Experiment with different vibes and personalities. Say the wrong thing? It's okay — that's how you learn.",
      bg: "bg-pink-50"
    },
    {
      icon: <Brain className="w-6 h-6 text-[#FF5E62]" />,
      title: "Deep Learning",
      description: "Our AI understands nuance, subtext, and emotional intelligence, providing realistic feedback to your style.",
      bg: "bg-pink-50",
      popular: true
    },
    {
      icon: <Zap className="w-6 h-6 text-[#FF5E62]" />,
      title: "Instant Access",
      description: "No more waiting days for a reply. Your companions are ready whenever you want to chat, day or night.",
      bg: "bg-pink-50"
    }
  ];

  return (
    <section id="why-aflirt" className="py-16 md:py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A1A] mb-4">Why Connection Matters</h2>
          <p className="text-base sm:text-lg text-[#666666] max-w-2xl mx-auto px-4">
            In a world of swiping, the art of real conversation is being lost. Aflirt is your personal laboratory for social connection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="relative bg-white p-7 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
            >
              {feature.popular && (
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full bg-[#FF5E62] text-white text-[9px] font-bold uppercase tracking-widest">
                  Popular
                </div>
              )}
              <div className={cn("w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 group-hover:scale-110 transition-transform", feature.bg)}>
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#1A1A1A] mb-3">{feature.title}</h3>
              <p className="text-sm md:text-base text-[#666666] leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
