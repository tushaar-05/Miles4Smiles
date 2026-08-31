import HeroSection from '@/components/HeroSection';
import CountdownTickerSection from '@/components/CountdownTickerSection';
import ManifestoSection from '@/components/ManifestoSection';
import RaceOverviewSection from '@/components/RaceOverviewSection';
import RouteSection from '@/components/RouteSection';
import SponsorsSection from '@/components/SponsorsSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CountdownTickerSection />
      <ManifestoSection />
      <RaceOverviewSection />
      <RouteSection />
      <SponsorsSection />
    </main>
  );
}
