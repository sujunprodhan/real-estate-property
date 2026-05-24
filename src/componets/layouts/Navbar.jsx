'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Building, Users, Phone, Heart, ShoppingCart } from 'lucide-react';

import Navlink from './buttons/Navlink';
import AuthButton from './buttons/AuthButton';

const MobileNavLink = ({ href, icon: Icon, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
        isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-base-200 text-base-content/80 hover:text-primary'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-primary' : 'text-primary/70'} />
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-base-100/90 backdrop-blur-lg shadow-md' : 'bg-base-100'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                SP
              </div>

              <span className="text-xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                RealEstate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Navlink key={link.name} href={link.href}>
                  {link.name}
                </Navlink>
              ))}
            </nav>

            {/* Desktop Action Icons & Auth Button */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/favorites"
                className="btn btn-ghost btn-circle text-base-content/80 hover:text-primary transition-colors"
                aria-label="Favorites"
              >
                <Heart size={22} />
              </Link>
              <Link
                href="/cart"
                className="btn btn-ghost btn-circle text-base-content/80 hover:text-primary transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
              </Link>
              <div className="ml-2">
                <AuthButton />
              </div>
            </div>

            {/* Mobile Action Icons & Menu Button */}
            <div className="flex md:hidden items-center gap-1">
              <Link
                href="/favorites"
                className="btn btn-ghost btn-circle text-base-content/80"
                aria-label="Favorites"
              >
                <Heart size={20} />
              </Link>
              <Link
                href="/cart"
                className="btn btn-ghost btn-circle text-base-content/80"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="btn btn-ghost btn-circle"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-500px opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-base-100 border-t border-base-200 px-4 py-5 space-y-3 shadow-xl">
            {navLinks.map((link) => (
              <MobileNavLink
                key={link.name}
                href={link.href}
                icon={link.icon}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </MobileNavLink>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="pt-4 flex flex-col gap-3">
              <button className="btn btn-outline rounded-full">Log In</button>

              <button className="btn btn-primary rounded-full">Sign Up</button>
            </div>
          </div>
        </div>
      </header>

      {/* Navbar Spacer */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
