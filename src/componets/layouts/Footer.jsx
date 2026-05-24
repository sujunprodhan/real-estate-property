'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, MessageSquare, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full text-white mt-20 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
      {/* Dark Overlay for Readability */}
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-[2px] z-0"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        
        {/* Unified Glass Container for all columns */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 lg:p-12 mb-12 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
            
            {/* Brand Info */}
            <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group inline-block w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                SP
              </div>
              <span className="text-xl font-bold text-white">
                RealEstate
              </span>
            </Link>
            <p className="text-white/70 mt-2 leading-relaxed text-sm">
              Find your dream home with our comprehensive real estate platform. We make property buying, selling, and renting seamless.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-primary text-white transition-colors border border-white/5"><Globe size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-primary text-white transition-colors border border-white/5"><MessageSquare size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-primary text-white transition-colors border border-white/5"><Camera size={16} /></a>
              <a href="#" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-primary text-white transition-colors border border-white/5"><Briefcase size={16} /></a>
            </div>
          </div>

            {/* Quick Links */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-6 relative inline-block text-white">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-white/70 hover:text-primary transition-colors flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>Home</Link></li>
              <li><Link href="/properties" className="text-white/70 hover:text-primary transition-colors flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>Properties</Link></li>
              <li><Link href="/agents" className="text-white/70 hover:text-primary transition-colors flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>Agents</Link></li>
              <li><Link href="/about" className="text-white/70 hover:text-primary transition-colors flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>About Us</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-primary transition-colors flex items-center gap-3 text-sm"><span className="w-1.5 h-1.5 rounded-full bg-primary/80"></span>Contact</Link></li>
            </ul>
          </div>

            {/* Contact Info */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-6 relative inline-block text-white">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-5">
              <li className="flex items-start gap-4 text-white/70 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={14} />
                </div>
                <span className="mt-1">123 Real Estate Blvd,<br />Suite 100, New York</span>
              </li>
              <li className="flex items-center gap-4 text-white/70 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={14} />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-4 text-white/70 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Mail className="text-primary" size={14} />
                </div>
                <span>support@realestate.com</span>
              </li>
            </ul>
          </div>

            {/* Newsletter */}
            <div className="flex flex-col">
            <h3 className="text-lg font-bold mb-6 relative inline-block text-white">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <p className="text-white/70 mb-6 text-sm">
              Subscribe to our newsletter to get the latest property updates and news.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="bg-white/10 border border-white/10 text-white placeholder-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors" required />
              <button type="submit" className="btn btn-primary rounded-xl w-full border-none shadow-[0_0_15px_rgba(79,70,229,0.4)]">Subscribe</button>
            </form>
          </div>
        </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} SP RealEstate. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;