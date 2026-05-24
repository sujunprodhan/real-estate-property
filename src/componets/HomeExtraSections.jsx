'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Coins, 
  Headphones, 
  Star, 
  Quote, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  BookOpen 
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: ShieldCheck,
    title: 'Certified Gated Security',
    description: 'We prioritize your peace of mind with vetted listings and verified secure community neighborhoods.',
    color: 'from-blue-500/20 to-indigo-500/20 text-primary',
  },
  {
    icon: Award,
    title: 'Highly Awarded Agency',
    description: 'Recognized for 5 consecutive years as the premier platform for luxury real estate and user satisfaction.',
    color: 'from-purple-500/20 to-pink-500/20 text-secondary',
  },
  {
    icon: Coins,
    title: 'Flexible Financing Plans',
    description: 'Partnered with elite banks to offer lowest interest mortgages and seamless installment schemes.',
    color: 'from-amber-500/20 to-orange-500/20 text-warning',
  },
  {
    icon: Headphones,
    title: '24/7 Concierge Support',
    description: 'Our dedicated support desk and agents are on call day and night to assist with viewings and bookings.',
    color: 'from-emerald-500/20 to-teal-500/20 text-success',
  },
];

const testimonials = [
  {
    name: 'Alexandra Vance',
    location: 'Miami, Florida',
    text: 'Finding our beach house through this agency was a breeze! The dynamic category layout helped us locate properties instantly, and Michael Chen was exceptionally helpful with negotiation.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Jonathan Sterling',
    location: 'Austin, Texas',
    text: 'I am highly impressed by the transparent process. The 3D-feeling glassmorphism design looks beautiful in night mode. Booked a commercial space, and the support was stellar!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Melissa K. Rogers',
    location: 'New York, NY',
    text: 'Every listing has validated documentation and pricing details. Highly recommend their platform. It takes only a click to schedule a viewing directly with their principal broker.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

import blogs from '../data/blogs.json';

const HomeExtraSections = () => {
  return (
    <div className="w-full relative z-10 bg-base-100">
      
      {/* 1. WHY CHOOSE US (SERVICES) SECTION */}
      <section className="py-24 bg-base-200/30 w-full border-t border-base-200">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Why Choose Us</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4">
              Premium Services Built For You
            </h2>
            <p className="text-base-content/60 text-lg">
              We stand apart by offering highly verified listings, expert insights, and smooth customer transitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <div 
                  key={index}
                  className="bg-base-100 border border-base-200/80 p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-start group"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent size={26} className="stroke-[2]" />
                  </div>
                  <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-base-content/60 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* 2. CLIENT TESTIMONIALS SECTION */}
      <section className="py-24 bg-base-100 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-1/2 right-[-10%] w-[350px] h-[350px] rounded-full bg-secondary/5 blur-[100px] pointer-events-none -z-10 animate-pulse"></div>

        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="mb-16 text-center max-w-3xl mx-auto">
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Client Reviews</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4">
              What Our Buyers Say
            </h2>
            <p className="text-base-content/60 text-lg">
              Hear directly from our verified clients who have discovered their perfect estates through our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div 
                key={index}
                className="bg-base-200/50 backdrop-blur-md border border-base-200 p-8 rounded-[3rem] shadow-sm relative flex flex-col justify-between group hover:border-primary/30 transition-all duration-300"
              >
                {/* Large quote icon in background */}
                <div className="absolute top-6 right-8 text-base-content/5 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote size={64} className="rotate-180" />
                </div>

                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-6 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" className="stroke-none" />
                    ))}
                  </div>

                  {/* Feedback text */}
                  <p className="text-base-content/75 text-[15px] leading-relaxed italic mb-8 relative z-10">
                    "{item.text}"
                  </p>
                </div>

                {/* Profile detail */}
                <div className="flex items-center gap-4 pt-4 border-t border-base-content/5">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base-content text-sm">{item.name}</h4>
                    <span className="text-xs text-base-content/55 font-medium">{item.location}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* 3. REAL ESTATE NEWS & INSIGHTS SECTION */}
      <section className="py-24 bg-base-200/30 w-full border-t border-b border-base-200">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Insights & Blogs</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
                Latest Real Estate News
              </h2>
              <p className="text-base-content/60 text-lg mt-3">
                Stay updated with the latest market trends, interior design tips, and professional property advice.
              </p>
            </div>

            <button className="btn btn-ghost text-primary hover:bg-primary/10 rounded-full font-bold px-6 py-2 border border-primary/20 flex items-center gap-2 group transition-all">
              <BookOpen size={18} />
              Read All Articles
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((post, index) => (
              <Link 
                key={index}
                href={`/blogs/${post.slug}`}
                className="bg-base-100 border border-base-200/80 rounded-[2.5rem] overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between text-left cursor-pointer"
              >
                <div>
                  {/* Banner image with hover zoom */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Tag badge */}
                    <span className="absolute top-4 left-4 bg-primary text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full shadow-lg">
                      {post.tag}
                    </span>
                  </div>

                  {/* Text details */}
                  <div className="p-6 pb-2">
                    <h3 className="font-extrabold text-base-content text-xl mb-3 leading-snug group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-base-content/60 leading-relaxed mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="p-6 pt-4 border-t border-base-content/5 flex items-center justify-between text-xs text-base-content/50">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} />
                      {post.readTime}
                    </span>
                  </div>
                  <span className="text-primary font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Read
                    <ArrowUpRight size={14} />
                  </span>
                </div>

              </Link>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default HomeExtraSections;
