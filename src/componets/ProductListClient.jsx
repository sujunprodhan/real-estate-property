'use client';

import React, { useState, useMemo } from 'react';
import ProductCard from './layouts/card/ProductCard';
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';

const ProductListClient = ({ initialProducts, itemsPerPage = 3, showSearchBar = false }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchLocation, setSearchLocation] = useState('');
  const [priceSort, setPriceSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  // categories
  const categories = useMemo(() => {
    const cats = new Set(initialProducts.map(p => p.category || p.propertyType));
    return ['All', ...Array.from(cats)].filter(Boolean);
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
      {showSearchBar ? (
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
      ) : (
        /* Category Tabs */
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-base-200 text-base-content/70 hover:bg-base-300 hover:text-base-content'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
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
      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default ProductListClient;
