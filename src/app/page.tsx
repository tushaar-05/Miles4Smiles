import HeroSection from '@/components/HeroSection';
import CountdownTickerSection from '@/components/CountdownTickerSection';
import ManifestoSection from '@/components/ManifestoSection';
import RaceOverviewSection from '@/components/RaceOverviewSection';
import CategoriesSection from '@/components/CategoriesSection';
import RouteSection from '@/components/RouteSection';
import SponsorsSection from '@/components/SponsorsSection';
import FaqSection from '@/components/FaqSection';
import FooterSection from '@/components/FooterSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CountdownTickerSection />
      <ManifestoSection />
      <RaceOverviewSection />
      <CategoriesSection />
      <RouteSection />
      <SponsorsSection />
      <FaqSection />
      <FooterSection />
    </main>
  );
}
