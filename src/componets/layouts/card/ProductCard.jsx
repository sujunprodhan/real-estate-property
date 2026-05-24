import React from 'react';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, Heart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="group bg-base-100 rounded-[2rem] overflow-hidden border border-base-200 hover:border-primary/50 shadow-sm hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-500 flex flex-col h-full relative">
      
      {/* Image Box */}
      <div className="relative h-72 w-full overflow-hidden">
        {/* Top Badges */}
        <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            <span className={`text-[11px] font-black uppercase tracking-wider px-4 py-2 rounded-full shadow-lg backdrop-blur-md ${product.status === 'For Rent' ? 'bg-secondary/90 text-secondary-content' : 'bg-primary/90 text-primary-content'}`}>
              {product.status}
            </span>
            <span className="bg-base-100/90 backdrop-blur-md text-base-content text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md w-fit uppercase tracking-widest">
              {product.propertyType}
            </span>
          </div>
          
          {/* Favorite Button */}
          <button className="w-10 h-10 rounded-full bg-base-100/90 backdrop-blur-md flex items-center justify-center text-base-content/60 hover:text-red-500 hover:bg-white transition-colors shadow-lg">
            <Heart size={20} />
          </button>
        </div>

        {/* Image */}
        <img 
          src={product.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3"} 
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        
        {/* Bottom Overlay Info */}
        <div className="absolute bottom-4 left-5 right-5 z-20 flex items-center gap-2">
            <MapPin size={18} className="text-white group-hover:text-primary transition-colors duration-300 shrink-0 drop-shadow-lg" />
            <span className="text-white/95 text-[15px] font-bold truncate drop-shadow-lg tracking-wide">{product.location?.address}, {product.location?.city}</span>
        </div>

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none z-10"></div>
      </div>

      {/* Details Box */}
      <div className="p-7 flex flex-col flex-grow bg-base-100 relative">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-extrabold text-base-content line-clamp-1 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Price */}
        <div className="text-3xl font-black text-primary mb-6 flex items-end gap-1">
          ${product.price?.toLocaleString()}
          {product.status === "For Rent" && <span className="text-base text-base-content/50 font-semibold mb-1">/mo</span>}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-2 bg-base-200/50 rounded-2xl p-4 mb-6 border border-base-200/50">
          <div className="flex flex-col items-center justify-center gap-1.5">
            <BedDouble size={22} className="text-base-content/60 group-hover:text-primary transition-colors duration-300 mb-0.5" />
            <span className="text-base-content font-bold text-[15px]">{product.bedrooms}</span>
            <span className="text-base-content/50 text-[10px] uppercase tracking-wider font-bold">Beds</span>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-1.5 border-x border-base-300">
            <Bath size={22} className="text-base-content/60 group-hover:text-primary transition-colors duration-300 mb-0.5" />
            <span className="text-base-content font-bold text-[15px]">{product.bathrooms}</span>
            <span className="text-base-content/50 text-[10px] uppercase tracking-wider font-bold">Baths</span>
          </div>

          <div className="flex flex-col items-center justify-center gap-1.5">
            <Square size={22} className="text-base-content/60 group-hover:text-primary transition-colors duration-300 mb-0.5" />
            <span className="text-base-content font-bold text-[15px]">{product.area}</span>
            <span className="text-base-content/50 text-[10px] uppercase tracking-wider font-bold">Sqft</span>
          </div>
        </div>

        {/* Footer (Agent & Action) */}
        <div className="mt-auto flex items-center justify-between pt-5 border-t border-base-200">
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden shadow-sm">
                <img src={product.agent?.image || "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"} alt={product.agent?.name} className="object-cover" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-base-content/50 font-bold mb-0.5">Agent</span>
              <span className="text-[15px] font-extrabold text-base-content">{product.agent?.name || "Expert Agent"}</span>
            </div>
          </div>

          <Link href={`/properties/${product._id || '1'}`} className="btn btn-primary rounded-full px-7 hover:scale-105 hover:shadow-xl hover:shadow-primary/30 transition-all font-bold text-white border-none">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;