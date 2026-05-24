'use client';

import React from 'react';
import { Loader2, Building, Home, MapPin } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-start pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Main Central Loader Status */}
        <div className="flex flex-col items-center text-center mb-16 mt-6">
          <div className="relative flex items-center justify-center w-24 h-24 mb-6">
            {/* Spinning gradient outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
            
            {/* Pulsing inner house/building icon */}
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center animate-pulse">
              <Building size={28} className="stroke-[2.5]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold tracking-tight text-base-content/90 mb-2">
            Finding Your Perfect Space
          </h2>
          <p className="text-sm text-base-content/50 max-w-xs sm:max-w-md">
            Connecting to our real estate database to fetch premium properties, locations, and pricing...
          </p>
        </div>

        {/* Skeleton Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="bg-base-100 border border-base-200/60 rounded-[2.5rem] p-5 shadow-sm space-y-5 relative overflow-hidden"
            >
              {/* Shimmer overlay effect */}
              <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-base-content/5 to-transparent animate-[shimmer_2s_infinite]"></div>

              {/* Image Skeleton */}
              <div className="w-full aspect-[4/3] rounded-[2rem] bg-base-200 flex items-center justify-center">
                <Home size={40} className="text-base-content/10 stroke-[1.5]" />
              </div>

              {/* Content Skeletons */}
              <div className="space-y-4 px-2">
                {/* Category and Rating line */}
                <div className="flex justify-between items-center">
                  <div className="h-6 w-24 rounded-full bg-base-200"></div>
                  <div className="h-5 w-12 rounded-full bg-base-200"></div>
                </div>

                {/* Title Line */}
                <div className="h-8 w-3/4 rounded-xl bg-base-200"></div>

                {/* Location Line */}
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-base-200"></div>
                  <div className="h-4 w-1/2 rounded-lg bg-base-200"></div>
                </div>

                {/* Specs (beds, baths, sqft) */}
                <div className="flex gap-4 pt-2 border-t border-base-200">
                  <div className="h-5 w-12 rounded-md bg-base-200"></div>
                  <div className="h-5 w-12 rounded-md bg-base-200"></div>
                  <div className="h-5 w-12 rounded-md bg-base-200"></div>
                </div>

                {/* Price and Action Button */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-7 w-28 rounded-xl bg-base-200"></div>
                  <div className="h-10 w-24 rounded-full bg-base-200"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
