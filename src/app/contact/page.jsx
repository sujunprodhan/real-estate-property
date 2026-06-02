'use client';

import React from 'react';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';
import AgentContactSection from '../../componets/AgentContactSection';

const ContactPage = () => {
  const contactDetails = [
    {
      icon: Phone,
      title: 'Telephone Contacts',
      description: 'Reach our central booking desk directly.',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
    },
    {
      icon: Mail,
      title: 'Email Correspondence',
      description: 'For general inquiries and booking tickets.',
      value: 'support@realestate.com',
      link: 'mailto:support@realestate.com',
    },
    {
      icon: MapPin,
      title: 'Headquarters Location',
      description: 'Visit our flagship investment office.',
      value: '742 Evergreen Terrace, NY',
      link: 'https://maps.google.com',
    },
  ];

  return (
    <main className="min-h-screen bg-base-300 pt-32 text-base-content relative overflow-hidden">
      {/* Background ambient radial glowing effects */}
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[150px] pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Hero Header */}
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-primary font-black tracking-widest uppercase text-xs bg-primary/10 px-3 py-1.5 rounded-full inline-block">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-base-content tracking-tight leading-none uppercase">
            Contact Our Advisors
          </h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full my-4"></div>
          <p className="text-base-content/75 text-sm md:text-base leading-relaxed">
            Have questions about a listing, showing, or property investment? Contact our support staff or submit a direct inquiry to one of our premier agents below.
          </p>
        </div>
      </div>

      {/* Information Cards Grid */}
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactDetails.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.title}
                href={item.link}
                target={item.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="bg-base-200/50 backdrop-blur-md border border-base-100/70 rounded-[2.5rem] p-8 shadow-xl flex flex-col items-center text-center group hover:border-primary/45 transition-all duration-300 hover:scale-[1.015]"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform duration-300 mb-6">
                  <Icon size={26} className="stroke-[2.2]" />
                </div>
                <h3 className="text-lg font-black uppercase text-base-content tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-xs font-bold text-base-content/50 mb-4.5">
                  {item.description}
                </p>
                <span className="text-sm font-black text-primary group-hover:text-primary/80 transition-colors uppercase">
                  {item.value}
                </span>
              </a>
            );
          })}
        </div>
      </div>

      {/* Embedded Agent Contact Section */}
      <div className="border-t border-base-100/30 bg-base-100/10">
        <AgentContactSection />
      </div>
    </main>
  );
};

export default ContactPage;
