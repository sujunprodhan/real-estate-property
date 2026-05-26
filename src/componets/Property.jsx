import React from 'react';
import Link from 'next/link';
import { Building, Layers, Home, Briefcase, Map, Grid, Inbox } from 'lucide-react';
import { getProperty } from '../actions/server/property';
import PropertyCard from './layouts/card/PropertyCard';

const categoryIcons = {
  All: Grid,
  Villa: Building,
  Apartment: Layers,
  'Family House': Home,
  House: Home,
  Commercial: Briefcase,
  'Land Plot': Map,
  Land: Map,
};

const Property = async ({ category }) => {
  const properties = await getProperty();

  // Dynamic Category Counts
  const categoryCounts = { All: properties?.length || 0 };
  properties?.forEach((p) => {
    const cat = p.category || p.propertyType || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Filtered Properties
  const filteredProperties = category
    ? properties?.filter(
        (p) =>
          p.category?.toLowerCase() === category.toLowerCase() ||
          p.propertyType?.toLowerCase() === category.toLowerCase()
      )
    : properties;

  return (
    <section className="py-20 bg-base-100/50 relative z-10 w-full min-h-screen">
      <div className="container mx-auto px-6 lg:px-12 max-w-full">
        {/* Header Title Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">
            Premium Catalog
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4 tracking-tight">
            Find Your Dream Home
          </h2>
          <p className="text-base-content/70 text-lg">
            Explore our handpicked collection of high-quality premium properties.
          </p>
        </div>

        {/* Responsive Grid Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          
          {/* Left Column: Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-xl sticky top-28">
              <h3 className="text-xl font-extrabold text-base-content mb-6 pb-3 border-b border-base-200">
                Filter by Category
              </h3>
              
              {/* Category Buttons List */}
              <div className="flex flex-col gap-2.5">
                {Object.keys(categoryCounts).map((catName) => {
                  const Icon = categoryIcons[catName] || Home;
                  const isActive =
                    (catName === 'All' && !category) ||
                    category?.toLowerCase() === catName.toLowerCase();
                  
                  return (
                    <Link
                      key={catName}
                      href={catName === 'All' ? '/property' : `/property?category=${catName}`}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 font-bold border ${isActive ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-102' : 'bg-base-200/50 border-transparent hover:border-primary/30 text-base-content/85 hover:bg-base-200/80'}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
                        <span className="text-[15px]">{catName}</span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-black ${isActive ? 'bg-white/20 text-white' : 'bg-base-300/60 text-base-content/70'}`}>
                        {categoryCounts[catName]}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Properties Listings Grid */}
          <div className="lg:col-span-3">
            {filteredProperties?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property._id?.toString()} property={property} />
                ))}
              </div>
            ) : (
              /* Premium Empty State */
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-base-100 rounded-3xl border border-base-200 shadow-lg min-h-[400px]">
                <div className="w-20 h-20 rounded-3xl bg-base-200/50 flex items-center justify-center mb-6 border border-base-200">
                  <Inbox size={40} className="text-base-content/40" />
                </div>
                <h3 className="text-2xl font-extrabold text-base-content mb-3">No Properties Found</h3>
                <p className="text-base-content/60 max-w-md mb-8">
                  We currently don&apos;t have any active listings in the selected category. Check back later or explore other premium sections.
                </p>
                <Link href="/property" className="btn btn-primary rounded-full px-8 text-white font-bold shadow-lg">
                  View All Properties
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Property;
