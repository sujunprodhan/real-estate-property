'use client';

import React, { useState } from 'react';
import { MapPin, Search, TrendingUp, Home, Building, Map } from 'lucide-react';

const US_CITIES = [
  { name: 'New York', lat: 40.7128, lng: -74.006, count: 142, state: 'NY' },
  { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, count: 98, state: 'CA' },
  { name: 'Chicago', lat: 41.8781, lng: -87.6298, count: 76, state: 'IL' },
  { name: 'Houston', lat: 29.7604, lng: -95.3698, count: 65, state: 'TX' },
  { name: 'Miami', lat: 25.7617, lng: -80.1918, count: 88, state: 'FL' },
  { name: 'Seattle', lat: 47.6062, lng: -122.3321, count: 54, state: 'WA' },
];

const PropertyMapSection = () => {
  const [activeCity, setActiveCity] = useState(US_CITIES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLocation, setMapLocation] = useState(`${US_CITIES[0].lat},${US_CITIES[0].lng}`);
  const [isCustomSearch, setIsCustomSearch] = useState(false);
  const [customLocationName, setCustomLocationName] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setMapLocation(searchQuery);
      setIsCustomSearch(true);
      setCustomLocationName(searchQuery);
    }
  };

  const handleCitySelect = (city) => {
    setActiveCity(city);
    setMapLocation(`${city.lat},${city.lng}`);
    setIsCustomSearch(false);
    setSearchQuery('');
  };

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&z=${isCustomSearch ? 5 : 11}&output=embed&hl=en`;

  return (
    <section className="py-24 bg-base-100/50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">
            Explore Locations
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content mb-4 tracking-tight">
            Find Properties Worldwide
          </h2>
          <p className="text-base-content/70 text-lg">
            Browse our premium listings spanning major cities and countries. Search for any country or click a city to explore properties.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { icon: Home, label: 'Total Listings', value: '2,400+' },
            { icon: MapPin, label: 'Cities Covered', value: '50+' },
            { icon: Building, label: 'States', value: 'All 50' },
            { icon: TrendingUp, label: 'New This Week', value: '128' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="bg-base-100 rounded-2xl p-5 border border-base-200 shadow-md flex items-center gap-4 hover:border-primary/30 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xl font-black text-base-content">{value}</p>
                <p className="text-xs text-base-content/60 font-semibold uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Map + City Picker Layout */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* City Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-base-100 rounded-[2rem] border border-base-200 shadow-xl overflow-hidden h-full flex flex-col">
              <div className="p-5 border-b border-base-200 bg-primary/5">
                <div className="flex items-center gap-2 mb-1">
                  <Map size={18} className="text-primary" />
                  <h3 className="font-extrabold text-base-content">Browse by City</h3>
                </div>
                <p className="text-xs text-base-content/60">Select a city to preview on map</p>
              </div>
              <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                {US_CITIES.map((city) => {
                  const isActive = !isCustomSearch && activeCity.name === city.name;
                  return (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-between group ${
                        isActive
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'hover:bg-base-200/70 text-base-content'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                          {city.state}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{city.name}</p>
                          <p className={`text-xs ${isActive ? 'text-white/70' : 'text-base-content/50'}`}>
                            {city.count} properties
                          </p>
                        </div>
                      </div>
                      <MapPin size={14} className={`shrink-0 ${isActive ? 'text-white' : 'text-primary opacity-0 group-hover:opacity-100'} transition-opacity`} />
                    </button>
                  );
                })}
              </div>

              {/* View All Link */}
              <div className="p-4 border-t border-base-200 mt-auto">
                <a
                  href="/property"
                  className="btn btn-primary btn-sm w-full rounded-xl font-bold text-white"
                >
                  View All Properties
                </a>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 min-h-[480px] lg:min-h-[560px] rounded-[2rem] overflow-hidden border border-base-200 shadow-2xl relative group">
            
            {/* Visual Map Overlay */}
            <div className="absolute inset-0 bg-primary/5 pointer-events-none z-0 group-hover:bg-transparent transition-colors duration-500"></div>

            {/* Search and Active Badge Overlay */}
            <div className="absolute top-4 left-0 right-0 z-10 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Active Location Badge */}
              <div className="bg-base-100/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-base-200 shadow-lg flex items-center gap-2 max-w-full">
                <MapPin size={16} className="text-primary shrink-0" />
                <span className="font-extrabold text-base-content text-sm truncate">
                  {isCustomSearch ? customLocationName : `${activeCity.name}, ${activeCity.state}`}
                </span>
                {!isCustomSearch && (
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full ml-1 shrink-0">
                    {activeCity.count} listings
                  </span>
                )}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative w-full sm:w-72 shadow-lg rounded-2xl">
                <input
                  type="text"
                  placeholder="Search country or city (e.g. USA)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-base-100/95 backdrop-blur-md border border-base-200 text-base-content text-sm rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-xl hover:bg-primary-focus transition-colors"
                >
                  <Search size={14} />
                </button>
              </form>
            </div>

            <iframe
              key={mapLocation}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '480px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${isCustomSearch ? customLocationName : activeCity.name}`}
              className="w-full h-full absolute inset-0 z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyMapSection;
