import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, BedDouble, Bath, Square, Mail, Phone, CheckCircle } from 'lucide-react';
import { getSingleProperty } from '../../../actions/server/property';

const ProductDetails = async ({ params }) => {
  const { id } = await params;
  const property = await getSingleProperty(id);

  if (!property || !property.title) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-extrabold text-base-content mb-4">Property Not Found</h2>
        <p className="text-base-content/70 mb-8 max-w-md">
          The property you are looking for does not exist or may have been removed.
        </p>
        <Link href="/" className="btn btn-primary rounded-full px-8 text-white font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100/50 py-12 relative z-10 w-full">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Navigation Breadcrumb */}
        <div className="text-sm breadcrumbs mt-20 mb-8 text-base-content/60">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>Properties</li>
            <li className="text-primary font-semibold truncate max-w-xs">{property.title}</li>
          </ul>
        </div>

        {/* Hero Grid / Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 relative h-400px md:h-500px rounded-3xl overflow-hidden shadow-xl border border-base-200">
            <Image
              src={
                property.images?.[0] ||
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3'
              }
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
            <span
              className={`absolute top-6 left-6 text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md z-20 ${property.status === 'For Rent' ? 'bg-secondary/90 text-secondary-content' : 'bg-primary/90 text-primary-content'}`}
            >
              {property.status}
            </span>
          </div>

          <div className="flex flex-col gap-6 h-[500px]">
            <div className="relative flex-1 rounded-3xl overflow-hidden shadow-lg border border-base-200">
              <Image
                src={
                  property.images?.[1] ||
                  property.images?.[0] ||
                  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3'
                }
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="bg-base-100 rounded-3xl p-6 border border-base-200 shadow-lg flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-primary font-extrabold block mb-2">
                  Price
                </span>
                <div className="text-4xl font-black text-primary flex items-end gap-1">
                  ${property.price?.toLocaleString()}
                  {property.status === 'For Rent' && (
                    <span className="text-lg text-base-content/50 font-semibold mb-1">/mo</span>
                  )}
                </div>
              </div>
              <div className="border-t border-base-200 pt-4 mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-base-content/60 font-semibold">Property Type</span>
                  <span className="text-base-content font-bold">{property.propertyType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-base-content/60 font-semibold">Year Built</span>
                  <span className="text-base-content font-bold">{property.yearBuilt || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left / Main Details Column */}
          <div className="lg:col-span-2 space-y-10">
            {/* Title & Location */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md">
              <h1 className="text-3xl md:text-4xl font-extrabold text-base-content mb-4">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-base-content/70">
                <MapPin size={20} className="text-primary" />
                <span className="text-lg font-medium">
                  {property.location?.address}, {property.location?.city},{' '}
                  {property.location?.state} {property.location?.zipCode}
                </span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mt-8 bg-base-200/50 rounded-2xl p-6 border border-base-200/50">
                <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                  <BedDouble size={26} className="text-primary mb-1" />
                  <span className="text-base-content font-extrabold text-lg">
                    {property.bedrooms}
                  </span>
                  <span className="text-base-content/50 text-[11px] uppercase tracking-wider font-bold">
                    Bedrooms
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 text-center border-x border-base-300">
                  <Bath size={26} className="text-primary mb-1" />
                  <span className="text-base-content font-extrabold text-lg">
                    {property.bathrooms}
                  </span>
                  <span className="text-base-content/50 text-[11px] uppercase tracking-wider font-bold">
                    Bathrooms
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                  <Square size={26} className="text-primary mb-1" />
                  <span className="text-base-content font-extrabold text-lg">{property.area}</span>
                  <span className="text-base-content/50 text-[11px] uppercase tracking-wider font-bold">
                    Square Feet
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md">
              <h3 className="text-2xl font-bold text-base-content mb-4">About This Property</h3>
              <p className="text-base-content/70 text-lg leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-md">
              <h3 className="text-2xl font-bold text-base-content mb-6">Premium Amenities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.amenities?.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-base-200/40 rounded-xl p-4 border border-base-200/50"
                  >
                    <CheckCircle size={20} className="text-success shrink-0" />
                    <span className="text-base-content font-semibold text-[15px]">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right / Sidebar Column */}
          <div className="space-y-8">
            {/* Agent Info Card */}
            <div className="bg-base-100 rounded-3xl p-8 border border-base-200 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl"></div>

              <h3 className="text-xl font-extrabold text-base-content mb-6 pb-4 border-b border-base-200">
                Listed By Agent
              </h3>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="avatar mb-4">
                  <div className="w-24 h-24 rounded-full ring-4 ring-primary ring-offset-base-100 ring-offset-4 overflow-hidden shadow-md">
                    <Image
                      src={
                        property.agent?.image ||
                        'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3'
                      }
                      alt={property.agent?.name}
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                </div>
                <h4 className="text-2xl font-extrabold text-base-content">
                  {property.agent?.name || 'Expert Agent'}
                </h4>
                <span className="text-sm font-semibold text-primary uppercase tracking-widest mt-1">
                  Real Estate Professional
                </span>
              </div>

              <div className="space-y-4">
                <a
                  href={`mailto:${property.agent?.email}`}
                  className="flex items-center gap-3 btn btn-outline btn-neutral w-full rounded-2xl justify-start px-6 font-semibold transition-all"
                >
                  <Mail size={18} className="text-primary shrink-0" />
                  <span className="truncate">
                    {property.agent?.email || 'agent@realestate.com'}
                  </span>
                </a>
                <a
                  href={`tel:${property.agent?.phone}`}
                  className="flex items-center gap-3 btn btn-outline btn-neutral w-full rounded-2xl justify-start px-6 font-semibold transition-all"
                >
                  <Phone size={18} className="text-primary shrink-0" />
                  <span>{property.agent?.phone || '+1 (555) 000-0000'}</span>
                </a>
              </div>
            </div>

            {/* Booking / Action Card */}
            <div className="bg-primary text-primary-content rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>

              <h3 className="text-2xl font-black mb-4">Schedule a Visit</h3>
              <p className="text-primary-content/85 text-[15px] leading-relaxed mb-6">
                Interested in viewing this spectacular property in person? Request a private showing
                with our agent today.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 mb-6">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Booking Status</span>
                  <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                    {property.booking?.bookingStatus || 'Available'}
                  </span>
                </div>
              </div>

              <button className="btn bg-white hover:bg-neutral-100 text-primary w-full rounded-2xl font-bold border-none shadow-lg text-[16px] h-14">
                Book a Showing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
