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
  Camera,
  Eye,
  EyeOff,
  Upload,
} from 'lucide-react';
import GoogleLogin from '../buttons/GoogleLogin';
import GithubLogin from '../buttons/GithubLogin';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { postUser } from '../../../actions/server/auth';

const RegisterPage = () => {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get('callbackUrl') || '/';
  
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [weekDates, setWeekDates] = useState([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(-1);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setMounted(true);

    const today = new Date();
    const currentDay = today.getDay(); 
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImageToImgbb(imageFile);
      }
      const result = await postUser({
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl,
      });
      console.log(result);
      
      if (result?.acknowledged) {
        // Auto-login after registration
        const loginResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: callbackUrl,
        });

        if (loginResult?.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Welcome to the EstateEase family.',
            confirmButtonColor: '#10b981',
          });
          router.push(callbackUrl);
        } else {
          router.push('/login');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result?.error || 'Something went wrong. Please try again.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setLoading(false);
    }
  };

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


  return (
    <div className="min-h-screen w-full bg-linear-to-br from-base-100 via-base-200 to-base-300/40 flex flex-col justify-start items-center p-4 sm:p-6 md:p-10 pt-32 sm:pt-36 md:pt-40 pb-20 overflow-hidden transition-colors duration-300">
      {/* Main Container Card */}
      <div className="w-full max-w-5xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-6 relative overflow-hidden transition-colors duration-300">
        {/* Soft Ambient Vector Orb Inside Card */}
        <div className="absolute top-[-20%] left-[-20%] w-350px h-350px rounded-full bg-primary/5 blur-[80px] pointer-events-none -z-10 animate-pulse"></div>

        {/* 1. VISUAL GRAPHIC BOARD WITH WIDGETS (With gorgeous slide-in animation & fallback background gradient) */}
        <div
          className={`w-full lg:w-[55%] relative aspect-4/3 lg:aspect-auto rounded-[1.8rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm flex items-center justify-center group min-h-360px sm:min-h-430px lg:min-h-580px order-2 lg:order-1 bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 transition-all duration-1000 transform ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          {/*  Image asset */}
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1000"
            alt="Elite Real Estate Concept Collaboration"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Overlay mask for visual depth */}
          <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/15 transition-all"></div>

          {/* Close round icon at top-right */}
          <Link
            href="/"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-base-100/90 border border-base-300/40 flex items-center justify-center text-base-content shadow-md hover:scale-105 active:scale-95 transition-all z-10"
          >
            <X size={14} />
          </Link>

          {/* A. FLOATING STICKY THEME CARD  */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 bg-primary text-primary-content p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-xl max-w-170px sm:max-w-210px animate-bounce-slow z-10">
            <div className="flex items-center justify-between gap-3 mb-1">
              <span className="text-[8px] sm:text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                Task Review
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-primary-content animate-ping"></div>
            </div>
            <h4 className="font-black text-[10px] sm:text-xs leading-snug">
              Task Review With Team
            </h4>
            <span className="text-[8px] sm:text-[9px] font-bold opacity-80 mt-1.5 sm:mt-2 flex items-center gap-1">
              <Clock size={9} />
              1H 30m / 10am - 11:30am
            </span>
          </div>

          {/* B. GLASS CALENDAR WIDGET (Center Right - Scaled down nicely on mobile) */}
          <div className="absolute bottom-20 sm:bottom-32 left-4 right-4 sm:left-8 sm:right-8 bg-slate-950/40 backdrop-blur-md border border-white/10 p-3.5 sm:p-5 rounded-2xl sm:rounded-[2rem] shadow-2xl z-10">
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => {
                const isActive =
                  currentDayIndex === -1 ? day === 'Wed' || i === 3 : i === currentDayIndex;
                const dateVal = weekDates[i] || 22 + i;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5">
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-wider text-slate-300 opacity-60 uppercase">
                      {day}
                    </span>
                    <span
                      className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[10px] sm:text-xs transition-all duration-300 ${
                        isActive
                          ? 'bg-linear-to-br from-primary to-indigo-500 text-white font-black shadow-lg shadow-primary/30 scale-105 border border-primary/20'
                          : 'text-white/70 font-semibold hover:bg-white/10 hover:text-white cursor-pointer'
                      }`}
                    >
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
              <h4 className="font-extrabold text-[10px] sm:text-xs text-base-content">
                Review Marketing Strategies
              </h4>
              <span className="text-[8px] sm:text-[9px] font-bold text-base-content/40">
                12:00pm - 01:30pm
              </span>
            </div>

            {/* Avatar Stack Pile */}
            <div className="flex -space-x-1.5 sm:-space-x-2 shrink-0">
              <Image
                width={24}
                height={24}
                className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80"
                alt="Avatar"
              />
              <Image
                width={24}
                height={24}
                className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80"
                alt="Avatar"
              />
              <Image
                width={24}
                height={24}
                className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&q=80"
                alt="Avatar"
              />
            </div>
          </div>

          {/* D. FLOATING FACE BUBBLES WITH CONNECTOR (Middle Right - Hidden on Mobile for clean space) */}
          <div className="absolute top-1/3 right-8 hidden md:flex flex-col gap-6 items-end pointer-events-none z-10">
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform translate-x-3">
              <Image
                width={36}
                height={36}
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Avatar Widget"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform -translate-x-1.5">
              <Image
                width={36}
                height={36}
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Avatar Widget"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden shadow-lg transform translate-x-2">
              <Image
                width={36}
                height={36}
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                alt="Avatar Widget"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 2. FORM */}
        <div
          className={`w-full lg:w-[45%] flex flex-col justify-between p-4 sm:p-6 md:p-8 space-y-6 order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Top Logo Badge - Dynamic Theme */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-base-100/90 border border-base-300/60 shadow-xs flex items-center gap-2 group w-fit transition-colors"
            >
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
              Create an account
            </h1>
            <p className="text-[11px] text-base-content/60 font-semibold pl-0.5">
              Sign up and get 30 day free property listing trial
            </p>
          </div>

          {/* React Hook Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center gap-1.5 pb-1">
              <label className="text-[10px] font-extrabold text-base-content/70 uppercase tracking-wider block">
                Profile Image
              </label>
              <div className="relative group cursor-pointer w-16 h-16">
                <div className="w-full h-full rounded-full border-2 border-dashed border-base-300 hover:border-primary bg-base-100 flex items-center justify-center overflow-hidden transition-all shadow-xs">
                  {avatarPreview ? (
                    <Image
                      width={64}
                      height={64}
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-base-content/40 group-hover:text-primary transition-colors">
                      <Camera size={18} className="stroke-[2.5]" />
                      <span className="text-[7px] font-extrabold mt-0.5 tracking-wider">
                        UPLOAD
                      </span>
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
            </div>

            {/* Full Name Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-base-content/70 pl-2 uppercase tracking-wider block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Amélie Laurent"
                {...register('name', { required: 'Name is required' })}
                className="input w-full bg-base-100 border border-base-300/80 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base-content placeholder-base-content/40"
              />
              {errors.name && (
                <span className="text-[9px] font-bold text-error pl-3 block">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-base-content/70 pl-2 uppercase tracking-wider block">
                Email
              </label>
              <input
                type="email"
                placeholder="amélielaurent7622@gmail.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                })}
                className="input w-full bg-base-100 border border-base-300/80 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base-content placeholder-base-content/40"
              />
              {errors.email && (
                <span className="text-[9px] font-bold text-error pl-3 block">
                  {errors.email.message}
                </span>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-base-content/70 pl-2 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="•••••••••••"
                  {...register('password', { required: 'Password is required' })}
                  className="input w-full bg-base-100 border border-base-300/80 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 pr-12 transition-all text-base-content placeholder-base-content/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors z-10"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[9px] font-bold text-error pl-3 block">
                  {errors.password.message}
                </span>
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
            <GithubLogin />
            {/* Google */}
            <GoogleLogin></GoogleLogin>
          </div>

          {/* Bottom links */}
          <div className="flex items-center justify-between text-[11px] font-bold text-base-content/50 pt-5 border-t border-base-300/40">
            <span>
              Already have account?{' '}
              <Link href="/login" className="text-primary hover:underline font-extrabold">
                Sign in
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

export default RegisterPage;
