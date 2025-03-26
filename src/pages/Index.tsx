
import { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FeatureSection from '@/components/FeatureSection';
import LeaderboardSection from '@/components/LeaderboardSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Index = () => {
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-page-in min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-300/20 via-white to-white dark:from-zinc-800/20 dark:via-zinc-900 dark:to-zinc-900 foggy-grain">
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <LeaderboardSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
