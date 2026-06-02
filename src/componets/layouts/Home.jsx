'use client';

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Home as HomeIcon, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { useRouter } from 'next/navigation';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const router = useRouter();
  const [searchLocation, setSearchLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const handleSearch = () => {
    let query = '/property?';
    if (propertyType) query += `category=${propertyType}&`;
    if (searchLocation) query += `search=${encodeURIComponent(searchLocation)}`;
    router.push(query);
  };

  const slidesData = [
    {
      bgImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80",
      agentImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Male agent in suit
    },
    {
      bgImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      agentImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Female agent
    },
    {
      bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      agentImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Another agent
    }
  ];

  return (
    <div className={`relative w-full h-auto lg:h-screen min-h-[600px] sm:min-h-[700px] flex items-start pt-24 sm:pt-28 pb-20 lg:pb-0 lg:items-center lg:pt-0 overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Swiper Background Slider with Fade Effect */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1500}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          allowTouchMove={false}
          className="w-full h-full"
        >
          {slidesData.map((slide, index) => (
            <SwiperSlide key={index}>
              {/* Background Image */}
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] ease-out hover:scale-105"
                style={{ backgroundImage: `url('${slide.bgImage}')` }}
              />

              {/* Left and Right Overlays (Inside slide so they don't cover the Agent Image) */}
              <div className="absolute inset-0 bg-linear-to-r from-[#020617]/95 via-[#020617]/50 to-transparent pointer-events-none"></div>
              <div className="absolute inset-0 bg-linear-to-l from-[#020617]/95 via-[#020617]/50 to-transparent pointer-events-none"></div>

              {/* Agent Image Overlay (Synchronized with Swiper Fade) */}
              <div className="hidden lg:flex absolute top-[55%] right-[8%] -translate-y-1/2 items-center justify-center pointer-events-none">
                <div className="relative w-[350px] h-[350px] rounded-full p-2 bg-white/10 backdrop-blur-md shadow-2xl pointer-events-auto">
                  <div 
                    className="w-full h-full rounded-full bg-cover bg-top border-4 border-base-100/50 overflow-hidden"
                    style={{ backgroundImage: `url('${slide.agentImage}')` }}
                  ></div>
                  
                  
                  {/* Play Button Overlay with Pulsing Ring */}
                  <div className="absolute top-0 right-0 -translate-y-4 translate-x-4">
                    {/* Pulsing Sonar Ring */}
                    <div className="absolute inset-0 rounded-full bg-white opacity-70 animate-ping"></div>
                    {/* Actual Play Button */}
                    <button className="relative z-10 w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform duration-300 cursor-pointer group">
                      <Play size={30} fill="currentColor" className="ml-1 group-hover:text-secondary transition-colors" />
                    </button>
                  </div>
                </div>
              </div>

            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-20 w-full mt-0 lg:mt-50 pointer-events-none">
        {/* Ambient Soft Glow Orb */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-tr from-primary/15 via-secondary/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse duration-10000"></div>

        <div className="max-w-3xl pointer-events-auto">
          {/* Animated Badge */}
          <div className={`transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary/15 via-secondary/10 to-transparent text-primary border border-primary/20 hover:border-primary/40 backdrop-blur-md font-bold text-xs tracking-wider uppercase mb-6 transition-all duration-300">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-md shadow-primary"></span>
              Premium Real Estate Agency
            </span>
          </div>

          {/* Animated Heading */}
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-white mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-indigo-400 to-secondary drop-shadow-sm">Dream Home</span> <br />With Confidence
          </h1>

          {/* Animated Subheading */}
          <p className={`text-lg md:text-xl text-white/80 mb-10 max-w-2xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover the most premium properties in your area. We provide seamless, transparent, and expert guidance to help you make the best choice.
          </p>

          {/* Search Glassmorphism Bar */}
          <div className={`bg-slate-950/40 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-[2.5rem] shadow-2xl shadow-slate-950/50 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              
              {/* Location Input */}
              <div className="w-full md:flex-1 h-16 flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-4 border border-white/10 hover:border-primary/30 focus-within:border-primary/50 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Location</label>
                  <input 
                    type="text" 
                    placeholder="New York, USA" 
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-semibold w-full placeholder:text-white/30 h-6 py-0 text-sm focus:ring-0" 
                  />
                </div>
              </div>

              {/* Property Type Input */}
              <div className="w-full md:flex-1 h-16 flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-4 border border-white/10 hover:border-secondary/30 focus-within:border-secondary/50 focus-within:bg-white/10 transition-all duration-300 shadow-inner">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary shrink-0 border border-secondary/20">
                  <HomeIcon size={20} />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-none mb-1">Property Type</label>
                  <select 
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="bg-transparent border-none outline-none text-white font-semibold w-full cursor-pointer h-6 py-0 text-sm focus:ring-0" 
                  >
                    <option value="" disabled className="bg-slate-950 text-white">Select type</option>
                    <option value="Villa" className="bg-slate-950 text-white">Luxury Villa</option>
                    <option value="Apartment" className="bg-slate-950 text-white">Modern Apartment</option>
                    <option value="House" className="bg-slate-950 text-white">Family House</option>
                    <option value="Commercial" className="bg-slate-950 text-white">Commercial</option>
                    <option value="Land" className="bg-slate-950 text-white">Land Plot</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="btn btn-primary h-16 rounded-2xl px-10 hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 flex items-center justify-center gap-2 border-none w-full md:w-auto shrink-0 font-extrabold text-sm tracking-wider uppercase bg-linear-to-r from-primary to-indigo-500 hover:from-primary hover:to-indigo-600 text-white"
              >
                <Search size={18} className="stroke-3" />
                <span>Search</span>
              </button>

            </div>
          </div>
          
          {/* Stats */}
          <div className={`flex flex-wrap gap-8 mt-12 mb-5 lg:mb-20 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">1.5K+</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mt-1.5">Properties Ready</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">500+</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mt-1.5">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-white/10 hidden md:block"></div>
            <div className="transition-transform duration-300 hover:scale-105">
              <p className="text-3xl font-extrabold text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">50+</p>
              <p className="text-xs text-white/50 uppercase tracking-widest font-bold mt-1.5">Expert Agents</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;