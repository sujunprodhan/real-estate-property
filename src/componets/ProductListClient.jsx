'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from './layouts/card/ProductCard';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, Building, Home, Briefcase, Map, Layers } from 'lucide-react';

const categoryIcons = {
  All: Building,
  Villa: Building,
  Apartment: Layers,
  House: Home,
  Commercial: Briefcase,
  Land: Map,
};

const ProductListClient = ({ initialProducts, itemsPerPage = 3, showSearchBar = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [priceSort, setPriceSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const searchParams = useSearchParams();
  const categoryParam = searchParams ? searchParams.get('category') : null;

  // Listen to category queries in url
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      setCurrentPage(1);
    }
  }, [categoryParam]);

  // categories
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category || p.propertyType));
    return ['All', ...Array.from(cats)].filter(Boolean);
  }, [initialProducts]);

  // Dynamic category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: initialProducts.length };
    initialProducts.forEach(p => {
      const cat = p.category || p.propertyType || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [initialProducts]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); 
  };

  // Filter, search, and sort products
  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    // 1. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => (p.category || p.propertyType) === selectedCategory);
    }

    // 2. Location/Title Search
    if (searchLocation.trim() !== '') {
      const query = searchLocation.toLowerCase();
      result = result.filter(p => 
        p.location?.city?.toLowerCase().includes(query) || 
        p.location?.address?.toLowerCase().includes(query) ||
        p.title?.toLowerCase().includes(query)
      );
    }

    // 3. Price Sorting
    if (priceSort === 'asc') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (priceSort === 'desc') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [initialProducts, selectedCategory, searchLocation, priceSort]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  return (
    <div className="flex flex-col w-full">
      
      {/* Search Bar */}
      {showSearchBar && (
        <div className="relative z-30 -mt-24 mb-16 mx-auto w-full max-w-5xl">
          <div className="bg-base-100 p-4 rounded-3xl shadow-2xl shadow-black/10 border border-base-200 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4">
            
            {/* Location Input */}
            <div className="flex-1 w-full relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50">
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="Search by location, city, or property name..." 
                value={searchLocation}
                onChange={(e) => { setSearchLocation(e.target.value); setCurrentPage(1); }}
                className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium"
              />
            </div>

            {/* Category Dropdown */}
            <div className="w-full md:w-48 relative">
              <select 
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="select select-bordered w-full rounded-2xl bg-base-200 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold text-base-content"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Price Sort Dropdown */}
            <div className="w-full md:w-56 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 pointer-events-none">
                <SlidersHorizontal size={18} />
              </div>
              <select 
                value={priceSort}
                onChange={(e) => { setPriceSort(e.target.value); setCurrentPage(1); }}
                className="select select-bordered w-full pl-11 rounded-2xl bg-base-200 border-none focus:outline-none focus:ring-2 focus:ring-primary/50 font-bold text-base-content appearance-none"
              >
                <option value="default">Sort by Price</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            <button className="btn btn-primary rounded-2xl w-full md:w-auto px-8 text-white shadow-lg shadow-primary/30 hover:scale-105 transition-transform">
              Search
            </button>

          </div>
        </div>
      )}

      {/* Product List Content Layout */}
      {showSearchBar ? (
        /* Properties Page split layout with Sidebar */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar Category Section */}
          <aside className="lg:col-span-3 w-full space-y-6 bg-base-200/40 p-6 rounded-[2.5rem] border border-base-200/80 sticky top-24 backdrop-blur-md">
            <div>
              <h3 className="text-xl font-extrabold text-base-content mb-4 pb-2 border-b border-base-content/10 flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-primary" />
                Categories
              </h3>
              <div className="flex flex-col gap-2">
                {categories.map((category) => {
                  const isSelected = selectedCategory === category;
                  const count = categoryCounts[category] || 0;
                  const IconComponent = categoryIcons[category] || Building;
                  return (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 w-full group ${
                        isSelected
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]'
                          : 'bg-base-100 text-base-content/75 hover:bg-primary/5 hover:text-primary border border-base-200 hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent size={18} className={isSelected ? 'text-white' : 'text-primary/70 group-hover:text-primary'} />
                        <span>{category}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold transition-all duration-300 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-base-200 text-base-content/50 group-hover:bg-primary/10 group-hover:text-primary'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Contact Promo Card */}
            <div className="p-6 rounded-[2rem] bg-linear-to-br from-primary/10 to-secondary/10 border border-primary/10 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 rounded-full bg-primary/5 blur-lg group-hover:scale-150 transition-transform"></div>
              <h4 className="font-extrabold text-base-content text-sm mb-1">Expert Advisors</h4>
              <p className="text-xs text-base-content/60 leading-relaxed mb-4">
                Have specific queries? Talk directly with our top agents for personalized support.
              </p>
              <Link href="/#agent-contact-form" className="btn btn-primary btn-sm btn-block rounded-full text-white border-none font-bold shadow-md shadow-primary/20">
                Contact Agent
              </Link>
            </div>
          </aside>

          {/* Main Property Listings Grid */}
          <div className="lg:col-span-9 flex flex-col w-full">
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product._id || product.title} product={product} />
                ))}
              </div>
            ) : (
              <div className="w-full py-24 flex flex-col items-center justify-center bg-base-200/50 rounded-[2.5rem] border border-base-300/80 border-dashed">
                <h3 className="text-2xl font-bold text-base-content/50">No properties found</h3>
                <p className="text-base-content/40 mt-2">Try selecting a different filter or search query.</p>
              </div>
            )}

            {/* Pagination inside Listings */}
            {totalPages > 1 && renderPagination()}
          </div>

        </div>
      ) : (
        /* Home page minimal view (Featured Properties without redundant tabs) */
        <div className="flex flex-col w-full">
          {/* Products Grid */}
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id || product.title} product={product} />
              ))}
            </div>
          ) : (
            <div className="w-full py-20 flex flex-col items-center justify-center bg-base-200 rounded-[2rem] border border-base-300 border-dashed">
              <h3 className="text-2xl font-bold text-base-content/50">No properties found.</h3>
              <p className="text-base-content/40 mt-2">Try selecting a different category.</p>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && renderPagination()}
        </div>
      )}
    </div>
  );

  // Helper renderer function for pagination to keep code tidy
  function renderPagination() {
    return (
      <div className="flex justify-center mt-20">
        <div className="inline-flex items-center gap-2 bg-base-100 p-2 rounded-full shadow-xl shadow-base-content/5 border border-base-200/80 backdrop-blur-xl">
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-11 h-11 rounded-full text-base-content/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content/60 transition-colors"
          >
            <ChevronLeft size={22} />
          </button>
          
          <div className="flex items-center gap-1 px-4 border-x border-base-200/60 h-8">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-bold transition-all duration-300 ${
                    currentPage === pageNumber
                      ? 'bg-primary text-primary-content shadow-lg shadow-primary/40 scale-110'
                      : 'text-base-content/60 hover:bg-base-200 hover:text-base-content'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-11 h-11 rounded-full text-base-content/60 hover:text-primary hover:bg-primary/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-content/60 transition-colors"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    );
  }
};

export default ProductListClient;

