import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export function SuccessStories() {
  const testimonials = [
    {
      text: "I'm pretty introverted, and Ekti gave me a safe place to practice talking to women. My real-world dates have been way more relaxed lately.",
      author: "David L.",
      role: "Software Engineer",
      image: "https://picsum.photos/seed/david/100/100"
    },
    {
      text: "The voice models are actually insane. It doesn't feel like a bot. It feels like a genuine connection that keeps me coming back.",
      author: "Sarah M.",
      role: "Marketing Creative",
      image: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      text: "Finally, an app that actually focuses on the conversation part of dating. It's high-end, smooth, and honestly addicted.",
      author: "Marcus T.",
      role: "Entrepreneur",
      image: "https://picsum.photos/seed/marcus/100/100"
    }
  ];

  return (
    <section id="success-stories" className="py-24 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1A1A1A] italic uppercase tracking-tighter mb-4">Success Stories</h2>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 fill-[#FF5E62] text-[#FF5E62]" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm"
            >
              <p className="text-[#666666] italic leading-relaxed mb-8">
                "{t.text}"
              </p>
              <div className="flex items-center gap-4">
                <img src={t.image} className="w-12 h-12 rounded-full" alt={t.author} referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold text-[#1A1A1A]">{t.author}</h4>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
