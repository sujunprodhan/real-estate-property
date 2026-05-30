import HomeHero from '../componets/layouts/Home';
import CategorySection from '../componets/CategorySection';
import AgentContactSection from '../componets/AgentContactSection';
import HomeExtraSections from '../componets/HomeExtraSections';
import Property from '../componets/Property';

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1', 10);

  return (
    <div className="w-full overflow-hidden">
      <HomeHero />
      <CategorySection />
      <Property showSidebar={false} page={page} limit={6}></Property>
      <HomeExtraSections />
      <AgentContactSection />
    </div>
  );
}
