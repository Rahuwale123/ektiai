import { motion } from 'motion/react';

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Build Your Ideal Companion",
      description: "Set the personality, interests, and conversational style. Want someone who's witty? Mysterious? Supportive? You choose."
    },
    {
      number: "2",
      title: "Engage in Dynamic Chats",
      description: "From voice notes to video calls, dive into interactions that challenge your social skills and build confidence."
    },
    {
      number: "3",
      title: "The Curiosity Gap...",
      description: "Wait until you see how our 'Spark Index' analyzes your patterns to show you exactly where you shine. Unlock it inside."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://picsum.photos/seed/couple/800/1000" 
                className="w-full aspect-[4/5] object-cover" 
                alt="Couple laughing"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[2rem] shadow-xl max-w-xs border border-gray-100">
              <p className="text-sm italic text-[#1A1A1A] leading-relaxed mb-4">
                "It actually helped me in real life."
              </p>
              <p className="text-xs font-bold text-[#666666]">
                — James, 26, New York
              </p>
            </div>
          </motion.div>

          <div>
            <h2 className="text-4xl font-bold text-[#1A1A1A] mb-4">How It Works</h2>
            <p className="text-lg text-[#666666] mb-12">
              Three steps to transforming your dating life.
            </p>

            <div className="space-y-10">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FF5E62] text-white flex items-center justify-center font-bold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{step.title}</h3>
                    <p className="text-[#666666] leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-12 bg-[#1A1A1A] text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all active:scale-95">
              Explore the Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
