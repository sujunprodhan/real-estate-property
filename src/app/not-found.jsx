'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search, ArrowLeft, Building } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden pt-20">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/10 blur-[130px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-xl w-full text-center relative z-10">
        {/* Animated Compass Visual */}
        <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
          {/* Rotating outer compass ring */}
          <div className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30 animate-[spin_40s_linear_infinite]"></div>
          
          {/* Pulse wave effects */}
          <div className="absolute w-28 h-28 rounded-full bg-primary/5 animate-ping"></div>
          
          {/* Central Glassmorphic circle with moving compass hand */}
          <div className="relative w-28 h-28 rounded-full bg-base-100 border border-base-200/80 shadow-2xl flex items-center justify-center backdrop-blur-xl">
            <Compass size={48} className="text-primary stroke-[1.5] animate-[bounce_3s_ease-in-out_infinite]" />
          </div>
        </div>

        {/* 404 Header text */}
        <h1 className="text-8xl sm:text-9xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent drop-shadow-sm select-none">
          404
        </h1>
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-base-content mt-4 tracking-tight">
          Lost in the Neighborhood?
        </h2>
        
        <p className="text-base-content/60 text-base mt-4 max-w-md mx-auto leading-relaxed">
          The property, agent, or listing page you are looking for has moved, expired, or doesn't exist in our current registry.
        </p>

        {/* Quick Search Help */}
        <div className="mt-8 p-6 bg-base-200/50 backdrop-blur-md rounded-3xl border border-base-200/80 max-w-md mx-auto">
          <h3 className="text-sm font-semibold text-base-content/80 flex items-center justify-center gap-2 mb-3">
            <Search size={16} className="text-primary" />
            Looking for something specific?
          </h3>
          <p className="text-xs text-base-content/50">
            Try going back to see our available properties or search again in our listing dashboard.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="btn btn-ghost rounded-full font-bold px-8 py-3 w-full sm:w-auto border border-base-content/20 hover:bg-base-200 hover:text-base-content transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <Link
            href="/properties"
            className="btn btn-primary rounded-full font-bold px-8 py-3 w-full sm:w-auto text-white shadow-xl shadow-primary/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Building size={18} />
            Explore Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
