import HomeHero from "../componets/layouts/Home";
import Product from "../componets/Product";
import CategorySection from "../componets/CategorySection";
import AgentContactSection from "../componets/AgentContactSection";
import HomeExtraSections from "../componets/HomeExtraSections";

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      <HomeHero />
      <CategorySection />
      <Product />
      <HomeExtraSections />
      <AgentContactSection />
    </div>
  );
}

