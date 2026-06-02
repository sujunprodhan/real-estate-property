import React from 'react';
import Link from 'next/link';
import { Building, Layers, Home, Briefcase, Map, Grid, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
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

const Property = async ({ category, search = '', sort = '', showSidebar = true, page = 1, limit = 8 }) => {
  const properties = await getProperty();

  // Dynamic Category Counts
  const categoryCounts = { All: properties?.length || 0 };
  properties?.forEach((p) => {
    const cat = p.category || p.propertyType || 'Other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Filtered Properties
  let filteredProperties = properties || [];

  if (category) {
    filteredProperties = filteredProperties.filter(
      (p) =>
        p.category?.toLowerCase() === category.toLowerCase() ||
        p.propertyType?.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const s = search.toLowerCase();
    filteredProperties = filteredProperties.filter((p) => 
      p.title?.toLowerCase().includes(s) || 
      p.location?.city?.toLowerCase().includes(s) ||
      p.location?.state?.toLowerCase().includes(s) ||
      p.location?.address?.toLowerCase().includes(s)
    );
  }

  if (sort === 'price-low-high') {
    filteredProperties.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sort === 'price-high-low') {
    filteredProperties.sort((a, b) => (b.price || 0) - (a.price || 0));
  } else {
    // Default sort by newest
    filteredProperties.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }

  // Pagination calculations
  const totalItems = filteredProperties?.length || 0;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const startIndex = (currentPage - 1) * limit;
  const paginatedProperties = filteredProperties?.slice(startIndex, startIndex + limit) || [];

  return (
    <section className="py-20 bg-base-100/50 relative z-10 w-full min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
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

        {/* Top Filters */}
        {showSidebar && (
          <div className="bg-base-100/80 backdrop-blur-md rounded-[2.5rem] p-6 md:p-8 border border-base-200 shadow-xl mb-12">
            
            {/* Search and Sort Form */}
            <form method="GET" action="/property" className="flex flex-col md:flex-row gap-4">
              {category && <input type="hidden" name="category" value={category} />}
              
              <div className="form-control flex-1">
                <input 
                  type="text" 
                  name="search"
                  defaultValue={search} 
                  placeholder="Search by city, location, or title..." 
                  className="input input-bordered w-full rounded-2xl bg-base-200/50 focus:bg-base-100 font-semibold h-14" 
                />
              </div>

              <div className="form-control w-full md:w-64">
                <select name="sort" defaultValue={sort} className="select select-bordered w-full rounded-2xl bg-base-200/50 focus:bg-base-100 font-bold h-14">
                  <option value="">Default (Newest)</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="price-low-high">Price: Low to High</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary rounded-2xl md:w-auto px-8 text-white font-bold h-14 shadow-lg shadow-primary/20">
                Apply Filters
              </button>
            </form>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          {showSidebar && (
            <div className="w-full lg:w-1/4 lg:shrink-0">
              <div className="bg-base-100/80 backdrop-blur-md rounded-[2.5rem] p-6 border border-base-200 shadow-xl lg:sticky lg:top-24">
                <h3 className="text-xl font-bold mb-6 text-base-content">Categories</h3>
                <div className="flex flex-col gap-3">
                  {Object.keys(categoryCounts).map((catName) => {
                    const Icon = categoryIcons[catName] || Home;
                    const isActive =
                      (catName === 'All' && !category) ||
                      category?.toLowerCase() === catName.toLowerCase();
                    
                    return (
                      <Link
                        key={catName}
                        href={catName === 'All' ? '/property' : `/property?category=${catName}`}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 font-bold border ${isActive ? 'bg-primary border-primary text-white shadow-md shadow-primary/30 scale-105' : 'bg-base-200/50 border-transparent hover:border-primary/30 text-base-content/85 hover:bg-base-200/80'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-primary'}`} />
                          <span className="text-sm">{catName}</span>
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
          )}

          {/* Properties Listings Grid */}
          <div className={`w-full ${showSidebar ? 'lg:w-3/4' : ''}`}>
              {paginatedProperties?.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {paginatedProperties.map((property) => (
                      <PropertyCard key={property._id?.toString()} property={property} />
                    ))}
                  </div>

                  {/* Premium Glassmorphic Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-16 flex justify-center items-center gap-2">
                      {/* Previous Button */}
                      {currentPage > 1 ? (
                        <Link
                          href={`?${category ? `category=${category}&` : ''}${search ? `search=${encodeURIComponent(search)}&` : ''}${sort ? `sort=${sort}&` : ''}page=${currentPage - 1}`}
                          scroll={false}
                          className="w-11 h-11 rounded-full bg-base-100 hover:bg-primary border border-base-200 hover:border-primary text-base-content hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group"
                        >
                          <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <span className="w-11 h-11 rounded-full bg-base-200/50 border border-base-300/30 text-base-content/30 flex items-center justify-center cursor-not-allowed">
                          <ChevronLeft size={18} />
                        </span>
                      )}

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => {
                        const pNum = i + 1;
                        const isActive = pNum === currentPage;
                        return (
                          <Link
                            key={pNum}
                            href={`?${category ? `category=${category}&` : ''}${search ? `search=${encodeURIComponent(search)}&` : ''}${sort ? `sort=${sort}&` : ''}page=${pNum}`}
                            scroll={false}
                            className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 ${
                              isActive
                                ? 'bg-primary text-primary-content shadow-lg shadow-primary/30 scale-105 border border-primary/20'
                                : 'bg-base-100 border border-base-200 hover:border-primary/40 text-base-content hover:bg-base-200/60 cursor-pointer hover:scale-105 active:scale-95'
                            }`}
                          >
                            {pNum}
                          </Link>
                        );
                      })}

                      {/* Next Button */}
                      {currentPage < totalPages ? (
                        <Link
                          href={`?${category ? `category=${category}&` : ''}${search ? `search=${encodeURIComponent(search)}&` : ''}${sort ? `sort=${sort}&` : ''}page=${currentPage + 1}`}
                          scroll={false}
                          className="w-11 h-11 rounded-full bg-base-100 hover:bg-primary border border-base-200 hover:border-primary text-base-content hover:text-white flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 group"
                        >
                          <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <span className="w-11 h-11 rounded-full bg-base-200/50 border border-base-300/30 text-base-content/30 flex items-center justify-center cursor-not-allowed">
                          <ChevronRight size={18} />
                        </span>
                      )}
                    </div>
                  )}
                </>
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
