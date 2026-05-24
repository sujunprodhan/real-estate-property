import React, { Suspense } from 'react';
import { getProduct } from '../../actions/server/product';
import ProductListClient from '../../componets/ProductListClient';

export const metadata = {
  title: 'All Properties | Real Estate',
  description: 'Browse our full collection of premium real estate properties.',
};

const PropertiesPage = async () => {
  const products = await getProduct();

  return (
    <main className="min-h-screen pb-20 bg-base-100">
      {/* Page Banner */}
      <div className="relative w-full h-[450px] flex items-center justify-center overflow-hidden mb-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 text-center px-6 mt-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            Discover Properties
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto drop-shadow-md">
            Find your perfect home, investment, or commercial space from our extensive and carefully curated catalog.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Suspense wrapper for query routing safe optimization */}
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="loading loading-spinner loading-xl text-primary"></span>
            <p className="text-sm font-semibold text-base-content/50 animate-pulse">Loading listing dashboard...</p>
          </div>
        }>
          {/* Product List Component (Showing 6 per page here instead of 3) */}
          <ProductListClient initialProducts={products} itemsPerPage={6} showSearchBar={true} />
        </Suspense>
      </div>
    </main>
  );
};

export default PropertiesPage;

