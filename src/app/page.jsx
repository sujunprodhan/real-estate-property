import HomeHero from '../componets/layouts/Home';
import CategorySection from '../componets/CategorySection';
import AgentContactSection from '../componets/AgentContactSection';
import HomeExtraSections from '../componets/HomeExtraSections';
import Property from '../componets/Property';

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HomeHero />
      <CategorySection />
     <Property></Property>
      <HomeExtraSections />
      <AgentContactSection />
    </div>
  );
}
