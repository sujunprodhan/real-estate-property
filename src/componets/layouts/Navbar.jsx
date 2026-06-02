'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Building,
  Users,
  Phone,
  Heart,
  ShoppingCart,
  Sun,
  Moon,
} from 'lucide-react';

import Navlink from './buttons/Navlink';
import AuthButton from './buttons/AuthButton';
import { useSession } from 'next-auth/react';
import { getFavorites } from '../../actions/server/favorite';

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
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const isSolid = isScrolled || pathname !== '/';

  const { data: session } = useSession();
  const [favCount, setFavCount] = useState(0);

  const fetchFavCount = async () => {
    if (session?.user?.email) {
      try {
        const favs = await getFavorites(session.user.email);
        setFavCount(favs.length);
      } catch (err) {
        console.error(err);
      }
    } else {
      setFavCount(0);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    fetchFavCount();

    window.addEventListener('favorites-updated', fetchFavCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favorites-updated', fetchFavCount);
    };
  }, [session]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'night' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/property', icon: Building },
    { name: 'Agents', href: '/agents', icon: Users },
    { name: 'Contact', href: '/contact', icon: Phone },
  ];

  return (
    <>
      {/* Navbar */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isSolid ? 'bg-base-100/95 backdrop-blur-lg shadow-md border-b border-base-200/50' : 'bg-transparent'
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
                <Navlink key={link.name} href={link.href} scrolled={isSolid}>
                  {link.name}
                </Navlink>
              ))}
            </nav>

            {/* Desktop Auth Button */}
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className={`btn btn-ghost btn-circle hover:text-primary transition-colors ${
                  isSolid ? 'text-base-content/80' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={22} /> : <Sun size={22} />}
              </button>
              <Link
                href="/profile?tab=properties"
                className={`btn btn-ghost btn-circle hover:text-primary relative transition-colors ${
                  isSolid ? 'text-base-content/80' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Favorites"
              >
                <Heart size={22} />
                {favCount > 0 && (
                  <span className="badge badge-sm badge-accent absolute -top-1 -right-1 font-black scale-90 border-none px-1.5 py-0.5 animate-bounce">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className={`btn btn-ghost btn-circle hover:text-primary transition-colors ${
                  isSolid ? 'text-base-content/80' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
              </Link>
              <div className="ml-2">
                <AuthButton scrolled={isSolid} />
              </div>
            </div>

            {/* Mobile Action Menu */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={toggleTheme}
                className={`btn btn-ghost btn-circle ${
                  isSolid ? 'text-base-content/80' : 'text-white/80'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <Link
                href="/profile?tab=properties"
                className={`btn btn-ghost btn-circle relative ${
                  isSolid ? 'text-base-content/80' : 'text-white/80'
                }`}
                aria-label="Favorites"
              >
                <Heart size={20} />
                {favCount > 0 && (
                  <span className="badge badge-xs badge-accent absolute top-1 right-1 font-black scale-95 border-none px-1 py-0.5">
                    {favCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                className={`btn btn-ghost btn-circle ${
                  isSolid ? 'text-base-content/80' : 'text-white/80'
                }`}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`btn btn-ghost btn-circle ${
                  isSolid ? 'text-base-content/80' : 'text-white/80'
                }`}
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
              <AuthButton scrolled={true} />
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
