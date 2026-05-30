'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  X, 
  Clock, 
  Sparkles,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [weekDates, setWeekDates] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);

  // Trigger smooth entrance animation and compute real-time dates on component mount
  useEffect(() => {
    setMounted(true);

    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
    setCurrentDayIndex(currentDay);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const diff = i - currentDay;
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() + diff);
      dates.push(dayDate.getDate());
    }
    setWeekDates(dates);
  }, []);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = (data) => {
    setLoading(true);
    console.log('Login Form Data:', data);
    
    // Mimicking network lag to show loading state beautifully
    setTimeout(() => {
      setLoading(false);
      alert('Login Verified Successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-base-100 via-base-200 to-base-300/40 flex flex-col justify-start items-center p-4 sm:p-6 md:p-10 pt-32 sm:pt-36 md:pt-40 pb-20 overflow-hidden transition-colors duration-300">
      
      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-6 relative overflow-hidden transition-colors duration-300">
        
        {/* Soft Ambient Vector Orb Inside Card */}
        <div className="absolute top-[-20%] left-[-20%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[80px] pointer-events-none -z-10 animate-pulse"></div>

        {/* 1. VISUAL GRAPHIC BOARD WITH WIDGETS (With gorgeous slide-in animation & fallback background gradient) */}
        <div 
          className={`w-full lg:w-[55%] relative aspect-[4/3] lg:aspect-auto rounded-[1.8rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm flex items-center justify-center group min-h-[360px] sm:min-h-[430px] lg:min-h-[580px] order-2 lg:order-1 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 transition-all duration-1000 transform ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          
          {/* Main Visual Image asset (Fast-loading high-resolution luxury architecture interior) */}
          <Image 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000" 
            alt="Elite Modern Architecture Concept" 
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay mask for visual depth */}
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/15 transition-all"></div>

          {/* Close round icon at top-right */}
          <Link href="/" className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/90 border border-base-300/40 flex items-center justify-center text-base-content shadow-md hover:scale-105 active:scale-95 transition-all z-10">
            <X size={14} />
          </Link>

          {/* A. FLOATING STICKY THEME CARD (Top Left - Fully responsive scaling) */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-primary text-primary-content p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl max-w-[170px] sm:max-w-[210px] animate-bounce-slow z-10">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider opacity-80">Task Review</span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-content animate-ping"></div>
            </div>
            <h4 className="font-black text-[10px] sm:text-xs leading-snug">Task Review With Team</h4>
            <span className="text-[8px] sm:text-[9px] font-bold opacity-80 mt-1.5 sm:mt-2 flex items-center gap-1">
              <Clock size={9} />
              1H 30m / 10am - 11:30am
            </span>
          </div>

          {/* B. GLASS CALENDAR WIDGET (Center Right - Scaled down nicely on mobile) */}
          <div className="absolute bottom-20 sm:bottom-32 left-4 right-4 sm:left-8 sm:right-8 bg-slate-950/40 backdrop-blur-md border border-white/10 p-3.5 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-2xl z-10">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                const isActive = currentDayIndex === -1 ? (day === 'Wed' || i === 3) : (i === currentDayIndex);
                const dateVal = weekDates[i] || (22 + i);
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-300 opacity-60 uppercase">{day}</span>
                    <span className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-all duration-300 ${
                      isActive 
                        ? 'bg-linear-to-br from-primary to-indigo-500 text-white font-black shadow-lg shadow-primary/30 scale-105 border border-primary/20' 
                        : 'text-white/70 font-semibold hover:bg-white/10 hover:text-white cursor-pointer'
                    }`}>
                      {dateVal}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* C. FLOATING WHITE MEETING CARD (Bottom Left - Dynamic Theme) */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-base-100 border border-base-300/40 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-between gap-4 max-w-none sm:max-w-sm transition-colors duration-300 z-10">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[8px] sm:text-[9px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={9} />
                Daily Meeting
              </span>
              <h4 className="font-extrabold text-[10px] sm:text-xs text-base-content">Review Marketing Strategies</h4>
              <span className="text-[8px] sm:text-[9px] font-bold text-base-content/40">12:00pm - 01:30pm</span>
            </div>
            
            {/* Avatar Stack Pile */}
            <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
              <Image width={24} height={24} className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" alt="Avatar" />
              <Image width={24} height={24} className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" alt="Avatar" />
              <Image width={24} height={24} className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80" alt="Avatar" />
            </div>
          </div>

          {/* D. FLOATING FACE BUBBLES WITH CONNECTOR (Middle Right - Hidden on Mobile for clean space) */}
          <div className="absolute top-1/3 right-8 hidden md:flex flex-col gap-6 items-end pointer-events-none z-10">
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform translate-x-3">
              <Image width={36} height={36} src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar Widget" className="w-full h-full object-cover" />
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform -translate-x-1.5">
              <Image width={36} height={36} src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar Widget" className="w-full h-full object-cover" />
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform translate-x-2">
              <Image width={36} height={36} src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar Widget" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>

        {/* 2. FORM PANEL (With gorgeous slide-up & fade-in animation: order-1 lg:order-2) */}
        <div 
          className={`w-full lg:w-[45%] flex flex-col justify-between p-4 sm:p-6 md:p-8 space-y-6 order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          
          {/* Top Logo Badge - Dynamic Theme */}
          <div className="flex items-center justify-between">
            <Link href="/" className="px-5 py-2.5 rounded-full bg-base-100/90 border border-base-300/60 shadow-xs flex items-center gap-2 group w-fit transition-colors">
              <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center text-primary-content font-extrabold text-[10px]">
                E
              </div>
              <span className="text-[11px] font-black text-base-content tracking-wider">
                ESTATE<span className="text-primary">EASE</span>
              </span>
            </Link>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-base-content tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-base-content/60 font-semibold pl-0.5">
              Sign in to manage your luxury properties portfolio
            </p>
          </div>

          {/* React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-base-content/70 pl-2 uppercase tracking-wider block">Email</label>
              <input 
                type="email"
                placeholder="amélielaurent7622@gmail.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })}
                className="input w-full bg-base-100 border border-base-300/80 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base-content placeholder-base-content/40"
              />
              {errors.email && (
                <span className="text-[9px] font-bold text-error pl-3 block">{errors.email.message}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-2">
                <label className="text-[10px] font-extrabold text-base-content/70 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[10px] font-bold text-base-content/40 hover:text-primary transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••••••••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="input w-full bg-base-100 border border-base-300/80 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 pr-12 transition-all text-base-content placeholder-base-content/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[9px] font-bold text-error pl-3 block">{errors.password.message}</span>
              )}
            </div>

            {/* Dynamic Theme Matching Submit Button */}
            <button 
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-primary-content font-extrabold text-xs tracking-wider uppercase h-11 rounded-full shadow-lg shadow-primary/20 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] mt-3 flex items-center justify-center gap-2"
            >
              {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Submit'}
            </button>

          </form>

          {/* Social Duplex Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* Apple */}
            <button className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-300 hover:text-base-content rounded-full font-bold text-xs h-11 flex items-center justify-center gap-2 text-base-content/80 transition-all">
              <svg className="w-3.5 h-3.5 fill-current shrink-0 mb-0.5" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-.96.04-2.13.64-2.82 1.45-.6.69-1.12 1.83-.98 2.94 1.07.08 2.15-.52 2.81-1.33z"/>
              </svg>
              Apple
            </button>
            {/* Google */}
            <button className="btn btn-outline border-base-300 bg-base-100 hover:bg-base-300 hover:text-base-content rounded-full font-bold text-xs h-11 flex items-center justify-center gap-2 text-base-content/80 transition-all">
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </button>
          </div>

          {/* Bottom links */}
          <div className="flex items-center justify-between text-[11px] font-bold text-base-content/50 pt-5 border-t border-base-300/40">
            <span>
              Don't have account?{' '}
              <Link href="/register" className="text-primary hover:underline font-extrabold">
                Sign up
              </Link>
            </span>
            <Link href="#" className="hover:underline">
              Terms & Conditions
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default LoginPage;
