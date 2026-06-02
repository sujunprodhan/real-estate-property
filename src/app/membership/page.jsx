'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CreditCard,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Building,
  BookOpen,
  Calendar,
  Users,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { upgradeToAdmin } from '../../actions/server/user';

const MembershipPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [isFlipped, setIsFlipped] = useState(false);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-base-200 border border-base-100 rounded-3xl p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black uppercase text-base-content tracking-tight">Access Restricted</h2>
          <p className="text-xs text-base-content/60 font-bold leading-relaxed">
            Please log in or create an account before taking a premium agency membership upgrade.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/login" className="btn btn-primary rounded-full text-white font-extrabold uppercase text-xs">
              Log In
            </Link>
            <Link href="/" className="btn btn-ghost rounded-full font-extrabold uppercase text-xs">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'number') {
      formattedValue = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
    } else if (name === 'expiry') {
      formattedValue = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').trim().slice(0, 5);
      if (formattedValue.endsWith('/')) formattedValue = formattedValue.slice(0, -1);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCardForm({ ...cardForm, [name]: formattedValue });
  };

  const handleUpgrade = async (e) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.name || !cardForm.expiry || !cardForm.cvv) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please complete all credit card payment fields.',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    setLoading(true);
    try {
      // Execute role database upgrade server action
      const res = await upgradeToAdmin(session.user.email);
      setLoading(false);

      if (res?.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Payment Successful!',
          html: `
            <div class="space-y-3 text-sm text-center">
              <p class="font-bold text-emerald-500">Transaction ID: EASE-${Math.floor(100000 + Math.random() * 900000)}</p>
              <p class="font-extrabold">Welcome to EstateEase Elite Leadership!</p>
              <p class="text-xs text-base-content/60">Your VIP investor account has been automatically upgraded to Root Administrator clearance.</p>
            </div>
          `,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Enter Admin Dashboard',
        });
        
        // Reload page to refresh NextAuth JWT role session updates
        window.location.href = '/dashboard';
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Upgrade Failed',
          text: res?.error || 'Failed to complete transaction.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (err) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Transaction Error',
        text: 'Payment processor returned an unexpected failure state.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const vipFeatures = [
    { icon: Building, title: 'Manage Estate Listings', desc: 'Add, update, and remove exclusive mansions, villas, and commercial properties directly.' },
    { icon: BookOpen, title: 'Write & Edit Blogs', desc: 'Publish high-traffic real estate insights, design tutorials, and market forecasts.' },
    { icon: Calendar, title: 'Confirm showing bookings', desc: 'Control user showing tour requests, dispatch invoice sheets, and coordinate dates.' },
    { icon: Users, title: 'Manage User Clearances', desc: 'Demote or promote other accounts to coordinate team workflows easily.' },
  ];

  return (
    <main className="min-h-screen bg-base-300 pt-32 pb-24 text-base-content relative overflow-hidden">
      {/* Background ambient radial glowing effects */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Navigation back */}
        <Link href="/profile" className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider mb-8 hover:translate-x-[-2px] transition-transform">
          <ArrowLeft size={14} /> Back To Profile
        </Link>

        {/* Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Membership details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-primary font-black tracking-widest uppercase text-xs bg-primary/10 px-3.5 py-2 rounded-full inline-block">
                EstateEase Premium Upgrade
              </span>
              <h1 className="text-3xl md:text-5xl font-black text-base-content uppercase tracking-tight leading-none">
                VIP Broker & Admin Membership
              </h1>
              <p className="text-base-content/75 text-sm md:text-base leading-relaxed">
                Take complete charge of your real estate business. Buy a lifetime membership today and unlock administrative privileges instantly.
              </p>
            </div>

            {/* Price tag glassmorphic panel */}
            <div className="bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-[-30%] right-[-20%] w-48 h-48 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all"></div>
              <div className="relative z-10 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest block">LIFETIME ACCESS PASS</span>
                  <span className="text-4xl font-black text-white">$99.00 <span className="text-xs text-slate-400 font-bold uppercase">USD</span></span>
                </div>
                <div className="w-12 h-12 bg-primary/15 border border-primary/25 rounded-2xl flex items-center justify-center text-primary animate-bounce">
                  <Sparkles size={22} className="stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Privilege features cards list */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-base-content/40 border-b border-base-100 pb-2">Unlocked Permissions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vipFeatures.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="bg-base-200/50 backdrop-blur-md border border-base-100/60 p-5 rounded-2xl flex gap-3.5">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Icon size={18} className="stroke-[2.2]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-xs text-base-content uppercase tracking-tight">{item.title}</h4>
                        <p className="text-[10px] text-base-content/60 font-bold leading-normal">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Premium Credit Card Checkout */}
          <div className="lg:col-span-6">
            <div className="bg-base-200/70 border border-base-100/80 rounded-[3rem] p-8 md:p-10 shadow-2xl relative">
              
              <div className="text-center mb-8 space-y-2">
                <h3 className="text-lg font-black uppercase tracking-tight flex items-center justify-center gap-1.5">
                  <CreditCard size={18} className="text-primary" />
                  Secure Card Checkout
                </h3>
                <p className="text-[10px] text-base-content/50 font-bold uppercase tracking-widest">
                  Payments are SSL encrypted and PCI compliant.
                </p>
              </div>

              {/* CARD PREVIEW DESIGN */}
              <div className="relative w-full aspect-[1.586/1] max-w-sm mx-auto mb-10 perspective-1000 group">
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d cursor-pointer ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  
                  {/* CARD FRONT */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-linear-to-br from-amber-500 via-amber-600 to-indigo-950 p-6 flex flex-col justify-between text-white backface-hidden shadow-2xl overflow-hidden border border-white/20">
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full blur-2xl"></div>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start relative z-10">
                      <div>
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/50">EstateEase</span>
                        <h4 className="text-xs font-black uppercase tracking-wider mt-0.5">ELITE ADVISOR PASS</h4>
                      </div>
                      <div className="w-10 h-6 bg-white/10 rounded-md border border-white/25 flex items-center justify-center">
                        <span className="text-[9px] font-black text-white/80">VISA</span>
                      </div>
                    </div>

                    {/* Chip */}
                    <div className="w-10 h-8 bg-amber-200/90 rounded-md border border-amber-300 relative z-10 shadow-sm shrink-0">
                      <div className="absolute inset-x-2 inset-y-1 border border-amber-400/40"></div>
                    </div>

                    {/* Card details */}
                    <div className="space-y-4 relative z-10">
                      <span className="text-base md:text-lg font-mono font-black tracking-widest block text-center truncate">
                        {cardForm.number || '•••• •••• •••• ••••'}
                      </span>
                      <div className="flex justify-between items-end">
                        <div className="overflow-hidden pr-4">
                          <span className="text-[7px] font-black uppercase tracking-widest text-white/50 block">CARDHOLDER</span>
                          <span className="text-xs font-bold uppercase truncate block mt-0.5">{cardForm.name || 'YOUR FULL NAME'}</span>
                        </div>
                        <div className="shrink-0">
                          <span className="text-[7px] font-black uppercase tracking-widest text-white/50 block">EXPIRES</span>
                          <span className="text-xs font-bold font-mono block mt-0.5">{cardForm.expiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CARD BACK */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl bg-linear-to-br from-indigo-950 via-slate-900 to-amber-900 p-6 flex flex-col justify-between text-white rotate-y-180 backface-hidden shadow-2xl border border-white/20">
                    <div className="w-full h-10 bg-slate-950 absolute left-0 top-6"></div>
                    <div className="mt-12 space-y-4 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-full h-9 bg-white/10 rounded-md border border-white/20 flex justify-end items-center pr-3">
                          <span className="text-xs text-white/40 italic font-mono font-semibold">Authorized signature</span>
                        </div>
                        <div className="w-16 h-9 bg-white text-slate-900 font-mono font-black flex items-center justify-center rounded-md border border-slate-300 shadow-inner">
                          {cardForm.cvv || '•••'}
                        </div>
                      </div>
                      <p className="text-[6px] text-white/40 font-bold leading-normal">
                        This administrative pass is property of EstateEase Inc. If found, please return to any official regional investment agency branch.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* PAYMENT FORM */}
              <form onSubmit={handleUpgrade} className="space-y-4">
                
                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65 tracking-wider">Cardholder Name</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={cardForm.name}
                    onChange={handleInputChange}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="e.g. Sarah Jenkins"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold text-xs"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label py-1">
                    <span className="text-[10px] font-black uppercase text-base-content/65 tracking-wider">Card Number</span>
                  </label>
                  <input
                    type="text"
                    name="number"
                    value={cardForm.number}
                    onChange={handleInputChange}
                    onFocus={() => setIsFlipped(false)}
                    placeholder="4111 2222 3333 4444"
                    className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono font-black text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="text-[10px] font-black uppercase text-base-content/65 tracking-wider">Expiration Date</span>
                    </label>
                    <input
                      type="text"
                      name="expiry"
                      value={cardForm.expiry}
                      onChange={handleInputChange}
                      onFocus={() => setIsFlipped(false)}
                      placeholder="MM/YY"
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono font-black text-xs"
                      required
                    />
                  </div>
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="text-[10px] font-black uppercase text-base-content/65 tracking-wider">Security CVV</span>
                    </label>
                    <input
                      type="password"
                      name="cvv"
                      value={cardForm.cvv}
                      onChange={handleInputChange}
                      onFocus={() => setIsFlipped(true)}
                      placeholder="•••"
                      className="input input-bordered w-full rounded-2xl bg-base-100 border-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 font-mono font-black text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="btn btn-primary w-full text-white font-extrabold uppercase rounded-full tracking-wider shadow-lg shadow-primary/25 h-12 flex items-center justify-center gap-2 group"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner text-white"></span>
                    ) : (
                      <>
                        Pay & Upgrade Instantly
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>

              {/* Secure note */}
              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-success/80 bg-success/5 border border-success/15 py-2.5 rounded-2xl">
                <ShieldCheck size={14} className="stroke-[2.2]" />
                <span>PCI-DSS Secured & Encrypted Processing</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default MembershipPage;
