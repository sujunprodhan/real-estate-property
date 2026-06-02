'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getBookings, deleteBooking, getAllBookings, updateBookingStatus } from '../../actions/server/booking';
import { getFavorites, toggleFavorite } from '../../actions/server/favorite';
import { getUserProfile, updateUserProfile } from '../../actions/server/user';
import { getUnreadCount } from '../../actions/server/message';
import ChatInterface from '../../componets/chat/ChatInterface';
import {
  User,
  Building,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  MapPin,
  BedDouble,
  Bath,
  Square,
  Clock,
  CheckCircle,
  Plus,
  Trash2,
  ExternalLink,
  Camera,
  Search,
  SlidersHorizontal,
  Bell,
  Sparkles,
} from 'lucide-react';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('tab');
      if (tab) {
        setActiveTab(tab);
      }
    }
  }, []);

  // Form states for settings
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '+1 (555) 019-2834',
    bio: 'Luxury real estate investor and architecture enthusiast.',
  });

  // Saved properties list (starts empty by default)
  const [savedProperties, setSavedProperties] = useState([]);

  // Dynamic viewings from database
  const [viewings, setViewings] = useState([]);

  // Calculate dynamic Portfolio Value based on saved estates
  const portfolioValue = savedProperties.reduce((acc, prop) => {
    if (typeof prop.price === 'string') {
      const numericPrice = parseFloat(prop.price.replace(/[^0-9.]/g, ''));
      return acc + (isNaN(numericPrice) ? 0 : numericPrice);
    }
    if (typeof prop.price === 'number') {
      return acc + prop.price;
    }
    return acc;
  }, 0);

  const formattedPortfolioValue = portfolioValue > 0
    ? `$${(portfolioValue / 1000000).toFixed(1)}M`
    : '$0.0M';

  // Mock inbox messages
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      agent: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100',
      property: 'The Obsidian Grand Penthouse',
      lastMessage: 'The penthouse is available for viewing on Thursday morning. Let me know if that works.',
      date: '10:14 AM',
      unread: true,
    },
    {
      id: 'm2',
      agent: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100',
      property: 'Serene Waters Modern Villa',
      lastMessage: 'I have received your deposit preferences. I am talking to the developer now.',
      date: 'Yesterday',
      unread: false,
    },
  ]);

  useEffect(() => {
    if (session?.user) {
      const fetchProfile = async () => {
        try {
          const dbProfile = await getUserProfile(session.user.email);
          if (dbProfile) {
            setProfileForm({
              name: dbProfile.name || session.user.name || '',
              email: dbProfile.email || session.user.email || '',
              phone: dbProfile.phone || '',
              bio: dbProfile.bio || '',
            });
            setAvatarPreview(dbProfile.image || session.user.image || null);
          } else {
            setProfileForm((prev) => ({
              ...prev,
              name: session.user.name || '',
              email: session.user.email || '',
            }));
            setAvatarPreview(session.user.image || null);
          }
        } catch (err) {
          console.error('Error fetching db profile:', err);
        }
      };

      fetchProfile();

      const fetchBookings = async () => {
        try {
          const userBookings = await getBookings(session.user.email);
          setViewings(
            userBookings.map((b) => ({
              id: b._id,
              propertyTitle: b.propertyTitle,
              propertyImage: b.propertyImage,
              agent: b.agent?.name || 'Expert Agent',
              date: b.date,
              time: b.time,
              status: b.status || 'Pending',
            }))
          );
        } catch (err) {
          console.error('Error fetching bookings:', err);
        }
      };

      const fetchFavorites = async () => {
        try {
          const userFavs = await getFavorites(session.user.email);
          setSavedProperties(
            userFavs.map((f) => ({
              id: f.propertyId.toString(),
              title: f.title,
              price: typeof f.price === 'number' ? `$${f.price.toLocaleString()}` : f.price,
              location: f.location,
              image: f.image,
              beds: f.beds,
              baths: f.baths,
              sqft: f.sqft,
              type: f.type,
            }))
          );
        } catch (err) {
          console.error('Error fetching favorites:', err);
        }
      };

      const checkUnread = async () => {
        try {
          const count = await getUnreadCount(session.user.email, isAdmin);
          setUnreadCount(count);
        } catch (err) {
          console.error(err);
        }
      };

      fetchBookings();
      fetchFavorites();
      checkUnread();
      
      const interval = setInterval(checkUnread, 3000);
      return () => clearInterval(interval);
    }
  }, [session, isAdmin]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-base-300 flex flex-col justify-center items-center gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-xs font-bold text-base-content/60 tracking-wider">LOADING SECURE WORKSPACE...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 flex flex-col justify-center items-center p-6 text-center">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary animate-pulse border border-primary/20">
            <User size={32} />
          </div>
          <h2 className="text-2xl font-black text-white">Access Denied</h2>
          <p className="text-xs text-slate-300/80 leading-relaxed">
            You must be logged in to view your professional investor dashboard. Register or log in to manage your luxury building portfolio.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/login"
              className="btn btn-primary w-full text-white font-extrabold rounded-full shadow-lg shadow-primary/30"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn btn-ghost w-full text-slate-300 border border-white/10 rounded-full hover:bg-white/5"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handle local avatar file conversion for real-time preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '801df07212c14c5c7db6a2aee813d11b';
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) return data.data.url;
    } catch (error) {
      console.error('Image upload failed', error);
    }
    return null;
  };

  // Handle settings form save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalAvatarUrl = avatarPreview;
      if (imageFile) {
        finalAvatarUrl = await uploadImageToImgbb(imageFile);
      }
      
      const res = await updateUserProfile(session.user.email, {
        name: profileForm.name,
        image: finalAvatarUrl || '',
        phone: profileForm.phone || '',
        bio: profileForm.bio || '',
      });

      setLoading(false);
      if (res?.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your investor settings have been successfully persisted.',
          confirmButtonColor: '#10b981',
        });
        window.location.reload();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Save Failed',
          text: res?.error || 'Could not save profile changes.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'An unexpected error occurred.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  // Remove saved property
  const handleRemoveProperty = (id, title) => {
    Swal.fire({
      title: 'Remove saved listing?',
      text: `Are you sure you want to remove "${title}" from your favorites?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it',
    }).then((result) => {
      if (result.isConfirmed) {
        toggleFavorite({ propertyId: id, userEmail: session.user.email }).then((res) => {
          if (res?.success) {
            setSavedProperties(savedProperties.filter((p) => p.id !== id));
            window.dispatchEvent(new Event('favorites-updated'));
            Swal.fire({
              title: 'Removed!',
              text: 'Listing removed from favorites.',
              icon: 'success',
              confirmButtonColor: '#10b981',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: res?.error || 'Could not remove favorite.',
              icon: 'error',
              confirmButtonColor: '#ef4444',
            });
          }
        });
      }
    });
  };

  // Logout with sweetalert2
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of your investor dashboard.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, log out',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        signOut({ callbackUrl: '/' });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-300 text-base-content flex flex-col lg:flex-row transition-all duration-300">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-80 bg-base-200 border-r border-base-100 flex flex-col justify-between shrink-0 p-6 gap-6 relative">
        <div className="space-y-8">
          {/* Logo Badge */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-content font-black text-xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform duration-300">
              E
            </div>
            <span className="text-xl font-black bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
              ESTATE<span className="text-base-content font-bold">EASE</span>
            </span>
          </Link>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-base-100/50 rounded-2xl border border-base-100/60 shadow-xs">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt={profileForm.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-content font-black text-base shrink-0 uppercase shadow-md">
                {profileForm.name ? profileForm.name.slice(0, 2) : 'US'}
              </div>
            )}
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-xs text-base-content truncate">{profileForm.name}</h4>
              <span className="text-[10px] text-base-content/50 font-bold tracking-wider uppercase block mt-0.5">
                {isAdmin ? 'ADMINISTRATOR' : 'VIP INVESTOR'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {isAdmin && (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left bg-gradient-to-r from-accent to-indigo-600 text-white shadow-lg shadow-accent/20 hover:scale-[1.01] transition-all mb-4"
              >
                <SlidersHorizontal size={16} />
                Admin Dashboard
              </Link>
            )}
            {!isAdmin && (
              <Link
                href="/membership"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left bg-linear-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-all my-3 border border-amber-400/30 animate-pulse shrink-0"
              >
                <Sparkles size={16} className="text-white shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
                VIP Membership Upgrade
              </Link>
            )}
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-primary'
              }`}
            >
              <User size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'properties'
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-primary'
              }`}
            >
              <Building size={16} />
              Saved Properties
              <span className="badge badge-sm badge-accent ml-auto font-black">{savedProperties.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('viewings')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'viewings'
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-primary'
              }`}
            >
              <Calendar size={16} />
              Scheduled Visits
              <span className="badge badge-sm badge-neutral ml-auto font-black">{viewings.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'messages'
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-primary'
              }`}
            >
              <MessageSquare size={16} />
              Inbox & Chat
              {unreadCount > 0 && (
                <span className="badge badge-sm badge-accent ml-auto font-black animate-pulse">{unreadCount}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider w-full text-left transition-all ${
                activeTab === 'settings'
                  ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.01]'
                  : 'hover:bg-base-100 text-base-content/75 hover:text-primary'
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="space-y-3 pt-6 border-t border-base-100/50">
          <Link
            href="/"
            className="btn btn-outline btn-sm rounded-full w-full font-bold flex items-center justify-center gap-2 text-xs"
          >
            <Home size={14} />
            Back To Website
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm rounded-full w-full font-bold flex items-center justify-center gap-2 text-xs"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. DYNAMIC WORKSPACE BODY */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto space-y-8 max-w-7xl mx-auto w-full">
        {/* Workspace Title & Alert Headers */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content uppercase">
              {activeTab} Workspace
            </h1>
            <p className="text-xs text-base-content/60 font-bold mt-1">
              Welcome back, {profileForm.name}. Manage your luxury estate operations.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Quick alert notifications indicator */}
            <button className="btn btn-circle btn-ghost bg-base-100 border border-base-200/40 relative" onClick={() => setActiveTab('messages')}>
              <Bell size={20} className="text-base-content/70" />
              {unreadCount > 0 && (
                <span className="w-4 h-4 bg-accent text-[8px] font-black text-white flex items-center justify-center rounded-full absolute -top-1 -right-1 shadow-md animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-base-content/40 font-black tracking-wider uppercase block">CURRENT DATE</span>
              <span className="text-xs font-extrabold text-base-content block mt-0.5">May 31, 2026</span>
            </div>
          </div>
        </div>

        {/* -------------------- TAB CONTENT: OVERVIEW -------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* STAT CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Saved Estates</span>
                  <span className="text-3xl font-black text-base-content block mt-1">{savedProperties.length} Units</span>
                </div>
              </div>
              <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                  <Calendar size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Walkthroughs</span>
                  <span className="text-3xl font-black text-base-content block mt-1">{viewings.length} Visits</span>
                </div>
              </div>
              <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Active Chats</span>
                  <span className="text-3xl font-black text-base-content block mt-1">1 Conversation</span>
                </div>
              </div>
              <div className="bg-base-200/60 border border-base-100/60 p-6 rounded-3xl shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-info/10 border border-info/20 flex items-center justify-center text-info">
                  <Home size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-base-content/40 uppercase tracking-widest block">Portfolio Value</span>
                  <span className="text-3xl font-black text-base-content block mt-1">{formattedPortfolioValue}</span>
                </div>
              </div>
            </div>

            {/* SPLIT SECTION ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2/3 - Timeline & Upcoming Viewings */}
              <div className="lg:col-span-2 bg-base-200/50 border border-base-100/60 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-base-100 pb-4">
                  <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                    <Clock size={18} className="text-primary" />
                    Upcoming Visit Agenda
                  </h3>
                  <button
                    onClick={() => setActiveTab('viewings')}
                    className="text-xs font-extrabold text-primary hover:underline"
                  >
                    View All agenda
                  </button>
                </div>

                <div className="space-y-4">
                  {viewings.map((viewing, idx) => (
                    <div
                      key={viewing.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-base-100 border border-base-200/60 rounded-2xl hover:border-primary/20 transition-all shadow-xs"
                    >
                      <div className="space-y-1">
                        <span className="text-[9px] font-black tracking-widest uppercase text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                          {viewing.date} - {viewing.time}
                        </span>
                        <h4 className="font-extrabold text-xs text-base-content mt-1">{viewing.propertyTitle}</h4>
                        <span className="text-[10px] text-base-content/50 font-bold block">Assigned Advisor: {viewing.agent}</span>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <span
                          className={`badge badge-sm font-black uppercase text-[8px] tracking-wider px-2.5 py-2 ${
                            viewing.status === 'Confirmed' ? 'badge-success text-white' : 'badge-warning text-white'
                          }`}
                        >
                          {viewing.status}
                        </span>
                        <button className="btn btn-ghost btn-circle btn-sm hover:text-primary">
                          <ExternalLink size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 1/3 - Brief Profile settings snapshot card */}
              <div className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-[-30%] right-[-30%] w-40 h-40 rounded-full bg-primary/10 blur-[50px] group-hover:bg-primary/20 transition-all"></div>
                <div className="space-y-6 relative z-10">
                  <span className="text-[9px] font-black tracking-widest uppercase text-primary-content bg-primary px-3 py-1 rounded-full w-fit block">
                    Verified Portfolio
                  </span>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight">{profileForm.name}</h3>
                    <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">
                      "{profileForm.bio}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-center">
                    <div>
                      <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase block">SAVED LISTS</span>
                      <span className="text-lg font-black text-white mt-1 block">{savedProperties.length}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase block">WALKTHROUGHS</span>
                      <span className="text-lg font-black text-white mt-1 block">{viewings.length}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('settings')}
                  className="btn btn-primary rounded-full text-white font-extrabold text-xs w-full uppercase tracking-wider h-11 shrink-0 mt-8 hover:scale-[1.02] transition-transform"
                >
                  Edit Profile Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: SAVED PROPERTIES -------------------- */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {savedProperties.length === 0 ? (
              <div className="text-center py-16 bg-base-200/60 rounded-[2.5rem] border border-dashed border-base-100 max-w-lg mx-auto p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center text-base-content/40 mx-auto">
                  <Building size={28} />
                </div>
                <h3 className="font-extrabold text-base">No Saved Properties</h3>
                <p className="text-xs text-base-content/50 leading-relaxed">
                  Start browsing our exclusive properties catalog and tap the heart icon to save listings here!
                </p>
                <Link
                  href="/property"
                  className="btn btn-primary btn-sm rounded-full px-6 font-bold"
                >
                  Explore properties
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedProperties.map((property) => (
                  <div
                    key={property.id}
                    className="bg-base-200/70 border border-base-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all hover:border-primary/20 flex flex-col justify-between group"
                  >
                    {/* Top image section with type badge */}
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <span className="absolute top-4 left-4 badge badge-neutral text-[9px] font-black uppercase tracking-wider py-2.5 px-3 border-none bg-slate-950/80 backdrop-blur-md text-white shadow-md">
                        {property.type}
                      </span>
                    </div>

                    {/* Middle details section */}
                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5 text-primary text-[10px] font-black tracking-wider uppercase">
                          <MapPin size={11} className="shrink-0" />
                          {typeof property.location === 'object' 
                            ? `${property.location?.city || property.location?.address || ''}`
                            : property.location}
                        </div>
                        <h4 className="font-extrabold text-sm text-base-content line-clamp-1 leading-snug">
                          {property.title}
                        </h4>
                        <span className="text-lg font-black text-emerald-500 block">{property.price}</span>
                      </div>

                      {/* Estate details stats badge group */}
                      <div className="grid grid-cols-3 gap-2 border-t border-base-100 pt-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-base-content/60 bg-base-100 py-1.5 px-1 rounded-xl">
                          <BedDouble size={12} className="text-primary/70 shrink-0" />
                          {property.beds} Bed
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-base-content/60 bg-base-100 py-1.5 px-1 rounded-xl">
                          <Bath size={12} className="text-primary/70 shrink-0" />
                          {property.baths} Bath
                        </div>
                        <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-base-content/60 bg-base-100 py-1.5 px-1 rounded-xl">
                          <Square size={12} className="text-primary/70 shrink-0" />
                          {property.sqft} sqft
                        </div>
                      </div>
                    </div>

                    {/* Bottom quick actions */}
                    <div className="px-5 pb-5 pt-1.5 flex gap-2 w-full shrink-0">
                      <Link
                        href={`/property/${property.id}`}
                        className="btn btn-neutral btn-sm rounded-full font-bold text-[10px] uppercase flex-1 flex items-center justify-center gap-1.5 hover:scale-[1.01]"
                      >
                        <ExternalLink size={12} />
                        View details
                      </Link>
                      <button
                        onClick={() => handleRemoveProperty(property.id, property.title)}
                        className="btn btn-outline btn-error btn-sm rounded-full font-bold px-3 hover:scale-[1.01]"
                        aria-label="Remove Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB CONTENT: VIEWINGS / VISITS -------------------- */}
        {activeTab === 'viewings' && (
          <div className="bg-base-200/50 border border-base-100 p-6 sm:p-8 rounded-[2rem] shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
                <Calendar size={18} className="text-primary" />
                Scheduled Tours & Viewings
              </h3>
              <button
                onClick={() => router.push('/property')}
                className="btn btn-primary btn-sm rounded-full font-bold text-xs flex items-center gap-1 text-white shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform"
              >
                <Plus size={14} /> Book tour
              </button>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-100/60 font-black text-[10px] text-base-content/40 tracking-wider uppercase">
                    <th>Property Listing</th>
                    <th>Assigned Advisor</th>
                    <th>Date & Time</th>
                    <th>Tour Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-100/40">
                      {viewings.map((viewing) => (
                        <tr key={viewing.id} className="hover:bg-base-100/20 transition-colors">
                          <td className="font-extrabold text-xs text-base-content py-4">
                            <div className="flex items-center gap-3">
                              {viewing.propertyImage && (
                                <img src={viewing.propertyImage} alt={viewing.propertyTitle} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                              )}
                              <span>{viewing.propertyTitle}</span>
                            </div>
                          </td>
                          <td className="text-xs font-semibold text-base-content/85">{viewing.agent}</td>
                      <td className="text-xs font-bold text-primary">{viewing.date} at {viewing.time}</td>
                      <td>
                        <span
                          className={`badge badge-sm font-black uppercase text-[8px] tracking-wider px-2 py-2 ${
                            viewing.status === 'Confirmed' ? 'badge-success text-white' : 'badge-warning text-white'
                          }`}
                        >
                          {viewing.status}
                        </span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => {
                            Swal.fire({
                              title: 'Cancel scheduled tour?',
                              text: `Cancel your upcoming walkthrough for "${viewing.propertyTitle}"?`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#ef4444',
                              confirmButtonText: 'Yes, cancel tour',
                            }).then((result) => {
                              if (result.isConfirmed) {
                                deleteBooking(viewing.id).then((res) => {
                                  if (res?.success) {
                                    setViewings(viewings.filter((v) => v.id !== viewing.id));
                                    Swal.fire({
                                      title: 'Cancelled!',
                                      text: 'Viewing appointment has been cancelled.',
                                      icon: 'success',
                                      confirmButtonColor: '#10b981',
                                    });
                                  } else {
                                    Swal.fire({
                                      title: 'Error!',
                                      text: res?.error || 'Could not cancel booking.',
                                      icon: 'error',
                                      confirmButtonColor: '#ef4444',
                                    });
                                  }
                                });
                              }
                            });
                          }}
                          className="btn btn-ghost btn-circle btn-sm hover:text-error"
                          aria-label="Cancel appointment"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------- TAB CONTENT: INBOX MESSAGES -------------------- */}
        {activeTab === 'messages' && (
          <div className="bg-base-200/50 border border-base-100 rounded-[2rem] overflow-hidden min-h-[500px] shadow-sm p-4">
            <ChatInterface session={session} isAdminMode={isAdmin} />
          </div>
        )}

        {/* -------------------- TAB CONTENT: ACCOUNT SETTINGS -------------------- */}
        {activeTab === 'settings' && (
          <div className="bg-base-200/50 border border-base-100 p-6 sm:p-8 rounded-[2rem] shadow-sm max-w-2xl mx-auto space-y-6">
            <h3 className="text-lg font-black text-base-content uppercase tracking-tight flex items-center gap-2">
              <User size={18} className="text-primary" />
              Account & Investor Profile Settings
            </h3>

            <form onSubmit={handleSaveSettings} className="space-y-5">
              {/* Profile image dropzone preview */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pb-2">
                <div className="relative group w-20 h-20 shrink-0 cursor-pointer">
                  <div className="w-full h-full rounded-2xl border-2 border-dashed border-base-300 bg-base-100 hover:border-primary flex items-center justify-center overflow-hidden transition-all shadow-xs">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-base-content/40 flex flex-col items-center justify-center">
                        <Camera size={20} />
                        <span className="text-[7px] font-black mt-1 uppercase tracking-wider">Upload</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="space-y-0.5 text-center sm:text-left">
                  <h4 className="font-extrabold text-xs text-base-content">Change profile image</h4>
                  <p className="text-[9px] font-bold text-base-content/40 uppercase tracking-wide mt-0.5">
                    JPG, PNG or WEBP formats up to 4MB sizes.
                  </p>
                </div>
              </div>

              {/* Full Name input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-base-content/60 pl-2 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  placeholder="Amélie Laurent"
                  required
                  className="input w-full bg-base-100 border border-base-300 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 text-base-content"
                />
              </div>

              {/* Email input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-base-content/60 pl-2 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  disabled
                  placeholder="amélielaurent7622@gmail.com"
                  className="input w-full bg-base-100/60 border border-base-300 text-xs font-semibold px-5 py-3 h-11 rounded-full text-base-content/50 cursor-not-allowed focus:outline-none"
                />
              </div>

              {/* Phone input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-base-content/60 pl-2 uppercase tracking-wider">Phone number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="input w-full bg-base-100 border border-base-300 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 text-base-content"
                />
              </div>

              {/* Bio input */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-base-content/60 pl-2 uppercase tracking-wider">Investor Bio / Preferences</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Tell us about your buying preferences..."
                  rows={4}
                  className="textarea w-full bg-base-100 border border-base-300 text-xs font-semibold px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 text-base-content"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary rounded-full w-full text-white font-extrabold text-xs uppercase tracking-wider h-11 shadow-lg shadow-primary/25 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Save preferences'}
              </button>
            </form>
          </div>
        )}
      </main>

    </div>
  );
};

export default ProfilePage;
