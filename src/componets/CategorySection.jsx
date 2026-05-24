import React from 'react';
import Link from 'next/link';
import { ArrowRight, Building, Home, Briefcase, Map, Layers } from 'lucide-react';
import { getProduct } from '../actions/server/product';

const categoryIcons = {
  Villa: Building,
  Apartment: Layers,
  House: Home,
  Commercial: Briefcase,
  Land: Map,
};

const CategorySection = async () => {
  const products = await getProduct();

  // Group products by category and find total counts and first product image
  const categoryMap = {};

  products.forEach((product) => {
    const catName = product.category || product.propertyType || 'Other';
    if (!categoryMap[catName]) {
      categoryMap[catName] = {
        name: catName,
        count: 0,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      };
    }
    categoryMap[catName].count += 1;
  });

  const categories = Object.values(categoryMap);

  return (
    <section className="py-24 bg-base-200/50 w-full relative z-10">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header Section */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Property Types</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
              Explore Our Categories
            </h2>
            <p className="text-base-content/60 text-lg mt-3">
              Browse through our handpicked selections tailored for every lifestyle, budget, and business venture.
            </p>
          </div>
          
          <Link 
            href="/properties" 
            className="btn btn-ghost text-primary hover:bg-primary/10 rounded-full font-bold px-6 py-2 self-start md:self-auto group flex items-center gap-2 transition-colors border border-primary/20"
          >
            View All Listings
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.name] || Home;
            return (
              <Link 
                key={cat.name} 
                href={`/properties?category=${cat.name}`}
                className="group relative h-96 rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-end p-6 border border-base-200 hover:-translate-y-2"
              >
                {/* Background Image with Zoom on Hover */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                
                {/* Black Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-300 group-hover:opacity-95" />

                {/* Animated Ambient Light Orb */}
                <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Category Icon */}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center mb-4 group-hover:bg-primary group-hover:border-primary/50 group-hover:scale-110 transition-all duration-300">
                  <IconComponent size={22} className="stroke-[2]" />
                </div>

                {/* Info Text */}
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                    <span className="text-sm text-white/70 font-semibold">
                      {cat.count} {cat.count === 1 ? 'Property' : 'Properties'}
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-primary transition-all duration-300">
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
