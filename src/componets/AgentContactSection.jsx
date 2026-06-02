'use client';

import React, { useState } from 'react';
import { Mail, Phone, User, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { addAgentInquiry } from '../actions/server/inquiry';

const agents = [
  {
    name: 'Sarah Jenkins',
    role: 'Principal Broker & Founder',
    email: 'sarah.j@realestate.com',
    phone: '+1 (555) 123-4567',
    image: 'https://i.ibb.co.com/qFN76sbV/Sarah-Jenkins.webp',
    specialty: 'Oceanfront Luxury & Villas',
  },
  {
    name: 'Michael Chen',
    role: 'Senior Investment Analyst',
    email: 'm.chen@realestate.com',
    phone: '+1 (555) 987-6543',
    image: 'https://i.ibb.co.com/mCwPTtX4/Michael-Chen.webp',
    specialty: 'High-yield Commercial Properties',
  },
  {
    name: 'Emma Watson',
    role: 'Client Relations Manager',
    email: 'emma.w@realestate.com',
    phone: '+1 (555) 456-7890',
    image: 'https://i.ibb.co.com/PGDBmVNH/Emma-Watson.webp',
    specialty: 'Residential Estates & Relocation',
  },
  {
    name: 'David Martinez',
    role: 'Land Development Consultant',
    email: 'david.m@realestate.com',
    phone: '+1 (555) 789-0123',
    image: 'https://i.ibb.co.com/cKmYF3cv/David-Martinez.webp',
    specialty: 'Acreage, Plots & Development Land',
  },
];

const AgentContactSection = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0].name);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await addAgentInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        agentName: selectedAgent,
      });

      setIsSubmitting(false);
      if (res?.success) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (err) {
      setIsSubmitting(false);
    }
  };

  const handleAgentClick = (agentName) => {
    setSelectedAgent(agentName);
    // Smooth scroll down to contact form for mobile users
    const element = document.getElementById('agent-contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-24 bg-base-100 relative z-10 w-full overflow-hidden">
      {/* Background ambient radial glowing effects */}
      <div className="absolute top-1/2 left-[-10%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Header Title Section */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Expert Advisors</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4">
            Meet Our Top Professionals
          </h2>
          <p className="text-base-content/70 text-lg">
            Connect with our certified agents to receive tailor-made, high-end guidance for your property journey.
          </p>
        </div>

        {/* Flex layout for agents grid and contact form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Agent Cards Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {agents.map((agent) => {
              const isSelected = selectedAgent === agent.name;
              return (
                <div 
                  key={agent.name}
                  onClick={() => handleAgentClick(agent.name)}
                  className={`cursor-pointer rounded-[2.5rem] p-6 border transition-all duration-300 relative group flex flex-col items-center text-center ${
                    isSelected 
                      ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5 scale-[1.02]' 
                      : 'bg-base-200/50 border-base-200 hover:border-primary/40 hover:bg-base-200/80 hover:shadow-lg'
                  }`}
                >
                  {/* Active selection dot indicator */}
                  {isSelected && (
                    <span className="absolute top-4 right-4 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}

                  {/* Portrait picture */}
                  <div className="relative w-28 h-28 mb-4">
                    <div className={`absolute inset-0 rounded-full border-2 p-1 transition-colors duration-300 ${isSelected ? 'border-primary' : 'border-base-content/10 group-hover:border-primary/40'}`}>
                      <div 
                        className="w-full h-full rounded-full bg-cover bg-top"
                        style={{ backgroundImage: `url('${agent.image}')` }}
                      />
                    </div>
                  </div>

                  {/* Info details */}
                  <h3 className="text-lg font-bold text-base-content">{agent.name}</h3>
                  <p className="text-xs text-primary font-bold tracking-wide mt-1 uppercase">{agent.role}</p>
                  
                  {/* Specialty tag */}
                  <div className="mt-3 px-3 py-1 bg-base-300/60 rounded-full text-xs font-semibold text-base-content/70">
                    {agent.specialty}
                  </div>

                  {/* Direct Contact info */}
                  <div className="mt-5 space-y-2 w-full pt-4 border-t border-base-content/5 text-sm text-base-content/60">
                    <div className="flex items-center justify-center gap-2">
                      <Mail size={14} className="text-primary/70" />
                      <span className="truncate">{agent.email}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Phone size={14} className="text-primary/70" />
                      <span>{agent.phone}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div id="agent-contact-form" className="lg:col-span-5 w-full">
            <div className="bg-base-200/50 backdrop-blur-xl border border-base-200/80 rounded-[3rem] p-8 md:p-10 shadow-2xl relative">
              
              {/* Overlay success message */}
              {isSuccess && (
                <div className="absolute inset-0 bg-base-100/95 backdrop-blur-lg rounded-[3rem] flex flex-col items-center justify-center text-center p-8 z-20 animate-fade-in">
                  <CheckCircle2 size={64} className="text-success animate-bounce mb-4" />
                  <h3 className="text-2xl font-bold text-base-content">Inquiry Sent Successfully!</h3>
                  <p className="text-base-content/60 text-sm mt-2 max-w-sm">
                    Thank you. We have notified <strong>{selectedAgent}</strong>. They will review your query and contact you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setIsSuccess(false)}
                    className="btn btn-primary rounded-full mt-6 px-6 text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <MessageSquare size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-base-content">Contact Agent</h3>
                  <p className="text-xs text-base-content/50">Send a direct inquiry or schedule a viewing</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Agent Dropdown */}
                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-base-content/70 uppercase tracking-wider pl-1 mb-1">
                    Select Agent
                  </label>
                  <select 
                    value={selectedAgent} 
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="select select-bordered rounded-2xl bg-base-100 border-base-300/60 focus:outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                  >
                    {agents.map((agent) => (
                      <option key={agent.name} value={agent.name}>
                        {agent.name} ({agent.specialty})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Name Input */}
                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-base-content/70 uppercase tracking-wider pl-1 mb-1">
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="input input-bordered rounded-2xl bg-base-100 border-base-300/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label text-xs font-bold text-base-content/70 uppercase tracking-wider pl-1 mb-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="input input-bordered rounded-2xl bg-base-100 border-base-300/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label text-xs font-bold text-base-content/70 uppercase tracking-wider pl-1 mb-1">
                      Phone Number
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="input input-bordered rounded-2xl bg-base-100 border-base-300/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="form-control w-full">
                  <label className="label text-xs font-bold text-base-content/70 uppercase tracking-wider pl-1 mb-1">
                    Your Message
                  </label>
                  <textarea 
                    rows={4}
                    placeholder={`Hello, I'm interested in working with you to find a property...`}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    className="textarea textarea-bordered rounded-2xl bg-base-100 border-base-300/60 focus:outline-none focus:ring-2 focus:ring-primary/40 text-base"
                  />
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="btn btn-primary w-full rounded-2xl text-white font-bold shadow-lg shadow-primary/30 mt-4 flex items-center justify-center gap-2 border-none"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Submit Inquiry to {selectedAgent.split(' ')[0]}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AgentContactSection;
