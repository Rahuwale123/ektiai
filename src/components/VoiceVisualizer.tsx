import { motion } from 'motion/react';

export function VoiceVisualizer() {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Outer Glows */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute inset-0 rounded-full border border-[#FF5E62]/20"
          animate={{
            scale: [1, 1.5 + i * 0.2, 1],
            opacity: [0.2, 0, 0.2],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Central Pulse */}
      <div className="flex items-center justify-center gap-1.5 h-16">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`bar-${i}`}
            className="w-1 bg-gradient-to-t from-[#FF5E62]/40 via-pink-400/60 to-[#FF5E62]/40 rounded-full"
            animate={{
              height: [16, 48 + Math.random() * 20, 16],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1 + Math.random(),
              repeat: Infinity,
              delay: i * 0.05,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
}
