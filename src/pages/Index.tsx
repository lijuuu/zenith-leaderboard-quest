
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
    <div className="animate-page-in">
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
