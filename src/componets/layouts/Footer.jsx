'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Globe, MessageSquare, Camera, Briefcase } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content pt-16 pb-8 border-t border-base-300 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group inline-block w-fit">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                SP
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                RealEstate
              </span>
            </Link>
            <p className="text-base-content/70 mt-2 leading-relaxed">
              Find your dream home with our comprehensive real estate platform. We make property buying, selling, and renting seamless.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-primary-content transition-colors"><Globe size={16} /></a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-primary-content transition-colors"><MessageSquare size={16} /></a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-primary-content transition-colors"><Camera size={16} /></a>
              <a href="#" className="btn btn-circle btn-sm btn-ghost bg-base-300 hover:bg-primary hover:text-primary-content transition-colors"><Briefcase size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Home</Link></li>
              <li><Link href="/properties" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Properties</Link></li>
              <li><Link href="/agents" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Agents</Link></li>
              <li><Link href="/about" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>About Us</Link></li>
              <li><Link href="/contact" className="text-base-content/70 hover:text-primary transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/50"></span>Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-base-content/70">
                <MapPin className="text-primary mt-1 shrink-0" size={20} />
                <span>123 Real Estate Blvd,<br />Suite 100, New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3 text-base-content/70">
                <Phone className="text-primary shrink-0" size={20} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-base-content/70">
                <Mail className="text-primary shrink-0" size={20} />
                <span>support@realestate.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-bold mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-primary rounded-full"></span>
            </h3>
            <p className="text-base-content/70 mb-4">
              Subscribe to our newsletter to get the latest property updates and news.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email address" className="input input-bordered w-full focus:outline-primary" required />
              <button type="submit" className="btn btn-primary w-full">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-base-300 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-base-content/60">
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