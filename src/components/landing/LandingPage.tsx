import { Header } from './Header';
import { Hero } from './Hero';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { SuccessStories } from './SuccessStories';
import { CTA } from './CTA';
import { Footer } from './Footer';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-pink-100 selection:text-[#FF5E62]">
      <Header onGetStarted={onGetStarted} />
      <Hero onGetStarted={onGetStarted} />
      <Features />
      <HowItWorks />
      <SuccessStories />
      <CTA onGetStarted={onGetStarted} />
      <Footer />
    </div>
  );
}
