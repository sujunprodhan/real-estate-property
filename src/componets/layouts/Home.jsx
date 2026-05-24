'use client';

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Home as HomeIcon, Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
    <div className={`relative w-full h-screen min-h-[700px] flex items-center overflow-hidden transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
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

      <div className="container mx-auto px-6 lg:px-12 relative z-20 w-full mt-10 pointer-events-none">
        <div className="max-w-3xl pointer-events-auto">
          {/* Animated Badge */}
          <div className={`transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-md font-medium text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              Premium Real Estate Agency
            </span>
          </div>

          {/* Animated Heading */}
          <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Find Your <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">Dream Home</span> <br />With Confidence
          </h1>

          {/* Animated Subheading */}
          <p className={`text-lg md:text-xl text-white/80 mb-10 max-w-2xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            Discover the most premium properties in your area. We provide seamless, transparent, and expert guidance to help you make the best choice.
          </p>

          {/* Search Glassmorphism Bar */}
          <div className={`bg-base-100/20 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="flex flex-col md:flex-row gap-4">
              
              {/* Location Input */}
              <div className="flex-1 flex items-center gap-3 bg-base-100/40 rounded-2xl p-3 border border-white/5 focus-within:border-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <MapPin size={20} />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Location</label>
                  <input type="text" placeholder="New York, USA" className="bg-transparent border-none outline-hidden text-white font-medium w-full placeholder:text-white/40" />
                </div>
              </div>

              {/* Property Type Input */}
              <div className="flex-1 flex items-center gap-3 bg-base-100/40 rounded-2xl p-3 border border-white/5 focus-within:border-primary transition-colors">
                <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                  <HomeIcon size={20} />
                </div>
                <div className="flex flex-col w-full">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Property Type</label>
                  <select className="bg-transparent border-none outline-hidden text-white font-medium w-full cursor-pointer" defaultValue="">
                    <option value="" disabled className="bg-base-100 text-base-content">Select type</option>
                    <option value="house" className="bg-base-100 text-base-content">Luxury House</option>
                    <option value="apartment" className="bg-base-100 text-base-content">Modern Apartment</option>
                    <option value="villa" className="bg-base-100 text-base-content">Beach Villa</option>
                    <option value="penthouse" className="bg-base-100 text-base-content">Penthouse</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button className="btn btn-primary h-auto rounded-2xl px-8 hover:scale-105 transition-transform duration-300 shadow-lg shadow-primary/30 flex items-center gap-2 border-none">
                <Search size={20} />
                <span>Search</span>
              </button>

            </div>
          </div>
          
          {/* Stats */}
          <div className={`flex flex-wrap gap-8 mt-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            <div>
              <p className="text-3xl font-bold text-white">1.5K+</p>
              <p className="text-sm text-white/60 font-medium mt-1">Properties Ready</p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <div>
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-sm text-white/60 font-medium mt-1">Happy Customers</p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden md:block"></div>
            <div>
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-sm text-white/60 font-medium mt-1">Expert Agents</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;