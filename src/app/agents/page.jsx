'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Award,
  ShieldCheck,
  Briefcase,
  Search,
  Star,
  Quote,
  TrendingUp,
  Users,
  Compass,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';

const agentsList = [
  {
    name: 'Sarah Jenkins',
    role: 'Principal Broker & Founder',
    email: 'sarah.j@realestate.com',
    phone: '+1 (555) 123-4567',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialty: 'Luxury',
    specialtyLabel: 'Oceanfront Luxury & Villas',
    experience: '12+ Years Experience',
    rating: 5,
  },
  {
    name: 'Michael Chen',
    role: 'Senior Investment Analyst',
    email: 'm.chen@realestate.com',
    phone: '+1 (555) 987-6543',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialty: 'Commercial',
    specialtyLabel: 'High-yield Commercial Properties',
    experience: '9+ Years Experience',
    rating: 4.9,
  },
  {
    name: 'Emma Watson',
    role: 'Client Relations Manager',
    email: 'emma.w@realestate.com',
    phone: '+1 (555) 456-7890',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialty: 'Residential',
    specialtyLabel: 'Residential Estates & Relocation',
    experience: '7+ Years Experience',
    rating: 5,
  },
  {
    name: 'David Martinez',
    role: 'Land Development Consultant',
    email: 'david.m@realestate.com',
    phone: '+1 (555) 789-0123',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specialty: 'Land',
    specialtyLabel: 'Acreage, Plots & Development Land',
    experience: '15+ Years Experience',
    rating: 4.8,
  },
];

const testimonials = [
  {
    quote: "Sarah helped us secure our oceanfront villa effortlessly. Her negotiation intelligence is second to none.",
    author: "Richard & Clara Vance",
    role: "Vance Enterprises CEO",
    agent: "Sarah Jenkins",
  },
  {
    quote: "Michael's yield calculations for our shopping plaza acquisition were perfectly accurate. Truly outstanding service.",
    author: "Jonathan Pierce",
    role: "Real Estate Investor",
    agent: "Michael Chen",
  },
  {
    quote: "Emma Watson turned what could have been a highly stressful relocation into an absolute dream. 5 stars!",
    author: "Sophia Laurent",
    role: "International Client",
    agent: "Emma Watson",
  },
];

const faqs = [
  {
    q: "How do I choose the best agent for my property requirements?",
    a: "Our agents specialize in different niches. Sarah handles luxury beach properties, Michael handles multi-million dollar portfolios and commercial investments, Emma manages residential relocations, and David coordinates land development and building acreage acquisitions."
  },
  {
    q: "Are scheduled tours free of charge?",
    a: "Yes! All scheduled showing tours and initial portfolio consultations with our agents are entirely free of charge for registered investors."
  },
  {
    q: "How fast will an agent reply to my inquiry?",
    a: "Our customer service standard dictates that our agents must reply within 24 hours of receiving an inquiry from our online form."
  }
];

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [activeFaq, setActiveFaq] = useState(null);

  const specialties = ['All', 'Luxury', 'Commercial', 'Residential', 'Land'];

  const filteredAgents = agentsList.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.specialtyLabel.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || agent.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <main className="min-h-screen bg-base-300 pt-32 pb-24 text-base-content relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[5%] left-[-15%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[-15%] w-[700px] h-[700px] rounded-full bg-secondary/5 blur-[180px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-6 lg:px-12">
        
        {/* ================= HERO & SEARCH ================= */}
        <div className="mb-16 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-primary font-black tracking-widest uppercase text-xs bg-primary/10 px-3.5 py-2 rounded-full inline-block">
            Elite Investment Advisory
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-base-content tracking-tight uppercase leading-none">
            Our Elite Consultants
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full my-4"></div>
          <p className="text-base-content/70 text-sm md:text-base leading-relaxed">
            Connect with certified property strategists who will help you find premium villas, high-yield retail hubs, and premium residential estates.
          </p>

          {/* Interactive Search & Filter bar */}
          <div className="pt-6 flex flex-col md:flex-row gap-4 max-w-2xl mx-auto items-center">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={18} />
              <input
                type="text"
                placeholder="Search advisor by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-11 rounded-2xl bg-base-200/60 border-base-100 focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full md:w-auto py-1 scrollbar-thin">
              {specialties.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`btn btn-xs rounded-full font-black px-4.5 py-2.5 h-auto uppercase transition-all shrink-0 ${
                    selectedSpecialty === spec 
                      ? 'btn-primary text-white border-none' 
                      : 'bg-base-200 text-base-content/75 hover:bg-base-100 hover:text-primary border-none'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= AGENTS CARDS GRID ================= */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-24">
            {filteredAgents.map((agent) => (
              <div
                key={agent.name}
                className="bg-base-200/50 backdrop-blur-md border border-base-100/70 rounded-[2.5rem] p-6 shadow-xl flex flex-col items-center hover:border-primary/45 transition-all duration-300 hover:scale-[1.015] group"
              >
                {/* Profile Image with dynamic border */}
                <div className="relative w-36 h-36 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 group-hover:border-primary p-1.5 transition-all duration-500">
                    <div
                      className="w-full h-full rounded-full bg-cover bg-top transform group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${agent.image}')` }}
                    />
                  </div>
                  <div className="absolute -bottom-2 right-1 bg-amber-500 text-white font-black text-xs px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Star size={12} fill="white" stroke="none" />
                    {agent.rating}
                  </div>
                </div>

                {/* Identity details */}
                <h2 className="text-xl font-black text-base-content tracking-tight text-center uppercase">
                  {agent.name}
                </h2>
                <p className="text-xs text-primary font-bold tracking-wide mt-1.5 uppercase text-center">
                  {agent.role}
                </p>

                {/* Specialty Tag */}
                <div className="mt-4 px-4.5 py-1.5 bg-base-300 rounded-full text-xs font-bold text-base-content/85 text-center flex items-center gap-1.5">
                  <Award size={14} className="text-primary" />
                  {agent.specialtyLabel}
                </div>

                {/* Key Features details */}
                <div className="w-full mt-6 py-4 px-5 bg-base-100/40 rounded-2xl border border-base-100/50 space-y-2 text-xs font-bold text-base-content/75">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-success shrink-0" />
                    <span>Licensed Luxury Broker</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-accent shrink-0" />
                    <span>{agent.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-primary shrink-0" />
                    <span>Global Portfolio Manager</span>
                  </div>
                </div>

                {/* Contact info links */}
                <div className="mt-6 space-y-2 w-full pt-4 border-t border-base-content/5 text-xs font-bold text-base-content/60">
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center justify-center gap-2 hover:text-primary transition-colors py-1 truncate"
                  >
                    <Mail size={14} className="text-primary/70 shrink-0" />
                    <span className="truncate">{agent.email}</span>
                  </a>
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center justify-center gap-2 hover:text-primary transition-colors py-1"
                  >
                    <Phone size={14} className="text-primary/70 shrink-0" />
                    <span>{agent.phone}</span>
                  </a>
                </div>

                {/* Action button */}
                <div className="w-full mt-6 pt-2">
                  <Link
                    href="/contact"
                    className="btn btn-ghost btn-outline btn-sm w-full rounded-2xl font-black text-xs uppercase hover:bg-primary hover:text-primary-content hover:border-none transition-all"
                  >
                    Contact {agent.name.split(' ')[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-base-200/30 rounded-[2.5rem] mb-24 border border-base-100/30 max-w-xl mx-auto">
            <span className="text-primary text-4xl block mb-4">🔍</span>
            <h3 className="text-xl font-black uppercase text-base-content">No Specialists Found</h3>
            <p className="text-xs font-bold text-base-content/50 mt-2">Try adjusting your search criteria or changing specialty tags.</p>
          </div>
        )}

        {/* ================= STATS SECTION ================= */}
        <section className="mb-28 bg-base-200/50 backdrop-blur-md border border-base-100/50 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center relative z-10">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                <TrendingUp size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-4xl font-black text-base-content tracking-tight">$2.4B+</h4>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Total Volume Closed</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mx-auto mb-4">
                <Users size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-4xl font-black text-base-content tracking-tight">98.6%</h4>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Investor Satisfaction</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mx-auto mb-4">
                <Compass size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-4xl font-black text-base-content tracking-tight">150+</h4>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Prime Micro-locations</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-success mx-auto mb-4">
                <CheckCircle2 size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-4xl font-black text-base-content tracking-tight">24/7</h4>
              <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest">Executive Support</p>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS SECTION ================= */}
        <section className="mb-28">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-primary font-black uppercase text-xs tracking-widest">Global Reviews</span>
            <h3 className="text-3xl md:text-4xl font-black text-base-content tracking-tight uppercase">Investor Testimonials</h3>
            <p className="text-xs font-bold text-base-content/65 leading-relaxed">Here is what premium estate buyers and retail syndicators say about our team's guidance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, i) => (
              <div
                key={i}
                className="bg-base-200/50 backdrop-blur-md border border-base-100/70 rounded-[2.5rem] p-8 shadow-xl relative flex flex-col justify-between"
              >
                <div className="absolute top-6 right-8 text-primary/10">
                  <Quote size={56} fill="currentColor" stroke="none" />
                </div>
                <div className="relative z-10">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={14} fill="#f59e0b" stroke="none" />
                    ))}
                  </div>
                  <p className="text-sm font-semibold italic text-base-content/85 leading-relaxed">
                    "{testi.quote}"
                  </p>
                </div>
                
                <div className="mt-8 pt-5 border-t border-base-content/5 flex flex-col">
                  <span className="text-sm font-black text-base-content">{testi.author}</span>
                  <span className="text-xs font-bold text-base-content/50 mt-0.5">{testi.role}</span>
                  <span className="text-[10px] font-black text-primary uppercase mt-2.5 bg-primary/10 py-1 px-3 rounded-full self-start">
                    Consulted {testi.agent.split(' ')[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= FAQ SECTION ================= */}
        <section className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-primary font-black uppercase text-xs tracking-widest">Common Inquiries</span>
            <h3 className="text-3xl md:text-4xl font-black text-base-content tracking-tight uppercase">Frequently Asked Questions</h3>
            <p className="text-xs font-bold text-base-content/65">Get quick answers regarding scheduled walkthrough tours and consultancy parameters.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-base-200/50 backdrop-blur-md border border-base-100/70 rounded-[2rem] overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left font-black uppercase text-sm md:text-base text-base-content hover:text-primary transition-colors focus:outline-hidden"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={20}
                      className={`text-primary shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen ? 'max-h-[300px] border-t border-base-content/5 p-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-sm font-semibold text-base-content/75 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </main>
  );
};

export default AgentsPage;
