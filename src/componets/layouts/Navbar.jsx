'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  X,
  Home,
  Building,
  Users,
  Phone,
  Heart,
  Calendar,
  Sun,
  Moon,
  BookOpen,
  Sparkles,
  ChevronDown,
  Plus,
} from 'lucide-react';
import AuthButton from './buttons/AuthButton';
import { useSession } from 'next-auth/react';
import { getFavorites } from '../../actions/server/favorite';
import { getBookings } from '../../actions/server/booking';
import Swal from 'sweetalert2';

const MobileNavLink = ({ href, icon: Icon, children, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3.5 px-5 py-4 rounded-2xl font-black text-xs uppercase tracking-wider w-full transition-all border ${
        isActive
          ? 'bg-primary border-primary text-white shadow-md shadow-primary/20 scale-[1.01]'
          : 'bg-base-200/40 border-transparent hover:border-primary/20 text-base-content/75 hover:bg-base-200'
      }`}
    >
      <Icon size={16} className={isActive ? 'text-white' : 'text-primary'} />
      {children}
    </Link>
  );
};

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  const { data: session } = useSession();
  const [favCount, setFavCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);

  const fetchFavCount = async () => {
    if (session?.user?.email) {
      try {
        const favs = await getFavorites(session.user.email);
        setFavCount(favs.length);
      } catch (err) {
      }
    } else {
      setFavCount(0);
    }
  };

  const fetchBookingCount = async () => {
    if (session?.user?.email) {
      try {
        const bookings = await getBookings(session.user.email);
        setBookingCount(bookings.length);
      } catch (err) {
      }
    } else {
      setBookingCount(0);
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
    fetchBookingCount();

    window.addEventListener('favorites-updated', fetchFavCount);
    window.addEventListener('bookings-updated', fetchBookingCount);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('favorites-updated', fetchFavCount);
      window.removeEventListener('bookings-updated', fetchBookingCount);
    };
  }, [session]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'night' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const isSolid = isScrolled || pathname !== '/';

  const handleAddPropertyClick = (e) => {
    if (!session) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to your account before listing new properties.',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        router.push('/login');
      });
    }
  };

  const handleAddBlogClick = (e) => {
    if (!session) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to your account before posting new blog articles.',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        router.push('/login');
      });
    }
  };

  const handleMembershipClick = (e) => {
    if (!session) {
      e.preventDefault();
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please log in to your account to access the VIP Membership page.',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        router.push('/login');
      });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isSolid ? 'bg-base-100/95 backdrop-blur-lg shadow-md border-b border-base-200/50' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-black text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
                E
              </div>
              <span className="text-xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
                ESTATE<span className={isSolid ? 'text-base-content font-bold' : 'text-white font-bold'}>EASE</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Home */}
              <Link
                href="/"
                className={`px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors ${
                  pathname === '/' ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                }`}
              >
                Home
              </Link>

              {/* Properties Dropdown */}
              <div className="relative group/dropdown py-2">
                <button
                  className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 focus:outline-none transition-colors ${
                    pathname.startsWith('/property') ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                  }`}
                >
                  Properties
                  <ChevronDown size={14} className="transition-transform duration-300 group-hover/dropdown:rotate-180" />
                </button>
                {/* Connector Bridge Wrapper */}
                <div className="absolute top-[80%] left-0 pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover/dropdown:opacity-100 group-hover/dropdown:translate-y-0 group-hover/dropdown:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-base-200 border border-base-100/60 rounded-2xl p-2 shadow-2xl">
                    <Link
                      href="/property"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors text-base-content/75"
                    >
                      View Properties
                    </Link>
                    <Link
                      href={
                        !session
                          ? '/login'
                          : session.user.role === 'admin'
                          ? '/dashboard?tab=properties&addProperty=true'
                          : '/membership'
                      }
                      onClick={handleAddPropertyClick}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors text-base-content/75"
                    >
                      Add Property
                    </Link>
                  </div>
                </div>
              </div>

              {/* Agents */}
              <Link
                href="/agents"
                className={`px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors ${
                  pathname === '/agents' ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                }`}
              >
                Agents
              </Link>

              {/* Blog Dropdown */}
              <div className="relative group/blog-dropdown py-2">
                <button
                  className={`font-black text-xs uppercase tracking-wider flex items-center gap-1.5 focus:outline-none transition-colors ${
                    pathname.startsWith('/blogs') ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                  }`}
                >
                  Blog
                  <ChevronDown size={14} className="transition-transform duration-300 group-hover/blog-dropdown:rotate-180" />
                </button>
                {/* Connector Bridge Wrapper */}
                <div className="absolute top-[80%] left-0 pt-4 w-48 opacity-0 translate-y-2 pointer-events-none group-hover/blog-dropdown:opacity-100 group-hover/blog-dropdown:translate-y-0 group-hover/blog-dropdown:pointer-events-auto transition-all duration-300 z-50">
                  <div className="bg-base-200 border border-base-100/60 rounded-2xl p-2 shadow-2xl">
                    <Link
                      href="/blogs"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors text-base-content/75"
                    >
                      View All Blog
                    </Link>
                    <Link
                      href={
                        !session
                          ? '/login'
                          : session.user.role === 'admin'
                          ? '/dashboard?tab=blogs&addBlog=true'
                          : '/membership'
                      }
                      onClick={handleAddBlogClick}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-primary hover:text-white font-extrabold text-[10px] uppercase tracking-wider transition-colors text-base-content/75"
                    >
                      Add Blog
                    </Link>
                  </div>
                </div>
              </div>

              {/* Membership */}
              <Link
                href={session ? '/membership' : '/login'}
                onClick={handleMembershipClick}
                className={`px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors ${
                  pathname === '/membership' ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                }`}
              >
                Membership
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-2xl font-black text-xs uppercase tracking-wider transition-colors ${
                  pathname === '/contact' ? 'text-primary' : isSolid ? 'text-base-content/85 hover:text-primary' : 'text-white/80 hover:text-white hover:text-primary'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Action Controls */}
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
                href="/profile?tab=viewings"
                className={`btn btn-ghost btn-circle hover:text-primary relative transition-colors ${
                  isSolid ? 'text-base-content/80' : 'text-white/80 hover:text-white'
                }`}
                aria-label="Bookings"
              >
                <Calendar size={22} />
                {bookingCount > 0 && (
                  <span className="badge badge-sm badge-primary absolute -top-1 -right-1 font-black scale-90 border-none px-1.5 py-0.5 animate-bounce">
                    {bookingCount}
                  </span>
                )}
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
                href="/profile?tab=viewings"
                className={`btn btn-ghost btn-circle relative ${
                  isSolid ? 'text-base-content/80' : 'text-white/80'
                }`}
                aria-label="Bookings"
              >
                <Calendar size={20} />
                {bookingCount > 0 && (
                  <span className="badge badge-xs badge-primary absolute top-1 right-1 font-black scale-95 border-none px-1 py-0.5">
                    {bookingCount}
                  </span>
                )}
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
            isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-base-100 border-t border-base-200 px-4 py-5 space-y-3 shadow-xl">
            <MobileNavLink href="/" icon={Home} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </MobileNavLink>

            <MobileNavLink href="/property" icon={Building} onClick={() => setIsMobileMenuOpen(false)}>
              View Properties
            </MobileNavLink>

            <MobileNavLink
              href={
                !session
                  ? '/login'
                  : session.user.role === 'admin'
                  ? '/dashboard?tab=properties&addProperty=true'
                  : '/membership'
              }
              icon={Plus}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleAddPropertyClick(e);
              }}
            >
              Add Property
            </MobileNavLink>

            <MobileNavLink href="/agents" icon={Users} onClick={() => setIsMobileMenuOpen(false)}>
              Agents
            </MobileNavLink>

            <MobileNavLink href="/blogs" icon={BookOpen} onClick={() => setIsMobileMenuOpen(false)}>
              View All Blog
            </MobileNavLink>

            <MobileNavLink
              href={
                !session
                  ? '/login'
                  : session.user.role === 'admin'
                  ? '/dashboard?tab=blogs&addBlog=true'
                  : '/membership'
              }
              icon={Plus}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleAddBlogClick(e);
              }}
            >
              Add Blog
            </MobileNavLink>

            <MobileNavLink
              href={session ? '/membership' : '/login'}
              icon={Sparkles}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleMembershipClick(e);
              }}
            >
              Membership
            </MobileNavLink>

            <MobileNavLink href="/contact" icon={Phone} onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </MobileNavLink>

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
