import HeroSection from '@/components/HeroSection';
import CountdownTickerSection from '@/components/CountdownTickerSection';
import ManifestoSection from '@/components/ManifestoSection';
import RaceOverviewSection from '@/components/RaceOverviewSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CountdownTickerSection />
      <ManifestoSection />
      <RaceOverviewSection />
    </main>
  );
}
