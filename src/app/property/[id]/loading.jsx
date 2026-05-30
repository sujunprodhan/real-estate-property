'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100/50 py-12 relative z-10 w-full animate-pulse">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Breadcrumb Skeleton */}
        <div className="h-5 w-48 bg-base-300/60 rounded-lg mb-8"></div>

        {/* Image Gallery Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main Large Image */}
          <div className="md:col-span-2 h-[400px] md:h-[500px] bg-base-300/50 rounded-3xl"></div>

          {/* Small Side Image & Pricing Card */}
          <div className="flex flex-col gap-6 h-[500px]">
            <div className="flex-1 bg-base-300/50 rounded-3xl"></div>
            <div className="h-44 bg-base-100 rounded-3xl p-6 border border-base-200 shadow-md flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-base-200 rounded-md"></div>
                <div className="h-8 w-36 bg-base-300/80 rounded-xl"></div>
              </div>
              <div className="space-y-2 pt-4 border-t border-base-200">
                <div className="h-4 w-full bg-base-200 rounded-md"></div>
                <div className="h-4 w-3/4 bg-base-200 rounded-md"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Columns */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md space-y-4">
              <div className="h-10 w-3/4 bg-base-300/60 rounded-2xl"></div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-base-200 rounded-full"></div>
                <div className="h-5 w-1/2 bg-base-200 rounded-md"></div>
              </div>
              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-base-200/50 rounded-2xl"></div>
                ))}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md space-y-3">
              <div className="h-7 w-48 bg-base-300/60 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-base-200 rounded-md"></div>
                <div className="h-4 w-full bg-base-200 rounded-md"></div>
                <div className="h-4 w-5/6 bg-base-200 rounded-md"></div>
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md space-y-4">
              <div className="h-7 w-48 bg-base-300/60 rounded-xl"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-base-200/50 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Agent Info Card */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-base-300/50"></div>
              <div className="h-6 w-32 bg-base-300/60 rounded-lg"></div>
              <div className="h-4 w-24 bg-base-200 rounded-md"></div>
              <div className="w-full pt-4 space-y-3">
                <div className="h-12 w-full bg-base-200 rounded-2xl"></div>
                <div className="h-12 w-full bg-base-200 rounded-2xl"></div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-base-100 rounded-3xl p-8 shadow-md border border-base-200 h-64 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-7 w-48 bg-base-300/60 rounded-xl"></div>
                <div className="h-4 w-full bg-base-200 rounded-md"></div>
              </div>
              <div className="h-12 w-full bg-base-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
