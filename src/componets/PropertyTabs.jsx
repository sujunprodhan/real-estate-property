'use client';

import React, { useState } from 'react';
import { CheckCircle, Star, MessageSquare, PlusCircle, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const PropertyTabs = ({ description, amenities }) => {
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'reviews'
  
  // Review Form state
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    // Mimic database post / API call
    console.log('Submitted Review:', newReview);

    setNewReview({ name: '', comment: '', rating: 5 });
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* 1. TABS HEADER BAR (Premium Glassmorphic Layout) */}
      <div className="flex bg-base-200/50 p-2 rounded-2xl border border-base-300/40 gap-2">
        <button
          onClick={() => setActiveTab('description')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-[13px] md:text-sm uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'description'
              ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-102 font-black'
              : 'text-base-content/65 hover:text-base-content hover:bg-base-300/50'
          }`}
        >
          Description & Details
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-extrabold text-[13px] md:text-sm uppercase tracking-wider transition-all duration-300 ${
            activeTab === 'reviews'
              ? 'bg-primary text-primary-content shadow-lg shadow-primary/20 scale-102 font-black'
              : 'text-base-content/65 hover:text-base-content hover:bg-base-300/50'
          }`}
        >
          Reviews
        </button>
      </div>

      {/* 2. TABS CONTENT */}
      <div className="bg-base-100 rounded-3xl p-6 md:p-8 border border-base-200 shadow-md min-h-[300px]">
        {activeTab === 'description' ? (
          
          /* ================= DESCRIPTION TAB ================= */
          <div className="space-y-8 animate-fade-in">
            
            {/* About Property */}
            <div>
              <h3 className="text-xl md:text-2xl font-black text-base-content mb-4 flex items-center gap-2">
                About This Property
              </h3>
              <p className="text-base-content/75 text-[15px] md:text-[16px] leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Premium Amenities inside Description Tab */}
            {amenities && amenities.length > 0 && (
              <div className="pt-6 border-t border-base-200">
                <h3 className="text-xl md:text-2xl font-black text-base-content mb-5 flex items-center gap-2">
                  Premium Amenities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {amenities.map((amenity, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-base-200/40 rounded-xl p-4 border border-base-200/50"
                    >
                      <CheckCircle size={18} className="text-success shrink-0" />
                      <span className="text-base-content font-bold text-sm md:text-[15px]">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        ) : (
          
          /* ================= REVIEWS TAB (Form Only) ================= */
          <div className="space-y-8 animate-fade-in">
            
            {/* Submit New Review Form Header */}
            <div>
              <h3 className="text-xl md:text-2xl font-black text-base-content mb-2 flex items-center gap-2">
                <PlusCircle size={22} className="text-primary" />
                Submit a Review
              </h3>
              <p className="text-xs md:text-sm text-base-content/50 font-semibold">
                Share your rating and feedback for this premium property listing.
              </p>
            </div>

            {submitSuccess && (
              <div className="alert alert-success rounded-2xl mb-6 flex items-center gap-2.5 text-white bg-emerald-500 font-bold p-4 shadow-lg shadow-emerald-500/20 animate-bounce-slow">
                <CheckCircle size={20} />
                <span>Your review has been submitted successfully!</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-5 max-w-2xl">
              
              {/* Dynamic Rating Star Picker */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-base-content/70 uppercase tracking-wider block pl-2">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5 pl-2">
                  {Array.from({ length: 5 }, (_, idx) => {
                    const ratingVal = idx + 1;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating: ratingVal })}
                        onMouseEnter={() => setHoverRating(ratingVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="hover:scale-110 active:scale-95 transition-transform"
                      >
                        <Star 
                          size={26}
                          className={`transition-colors duration-200 ${
                            ratingVal <= (hoverRating || newReview.rating)
                              ? "fill-warning text-warning" 
                              : "text-base-content/25"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-base-content/70 uppercase tracking-wider block pl-2">
                  Full Name
                </label>
                <input 
                  type="text"
                  required
                  placeholder="Amélie Laurent"
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  className="input w-full bg-base-200/50 border border-base-300 focus:border-primary/50 text-xs font-semibold px-5 py-3 h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base-content placeholder-base-content/30"
                />
              </div>

              {/* Comment Textarea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-base-content/70 uppercase tracking-wider block pl-2">
                  Your Comment
                </label>
                <textarea 
                  required
                  rows={5}
                  placeholder="Share your thoughts about the neighborhood, local amenities, and property layout..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="textarea w-full bg-base-200/50 border border-base-300 focus:border-primary/50 text-xs font-semibold px-5 py-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all text-base-content resize-none leading-relaxed placeholder-base-content/30"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="btn btn-primary text-white font-extrabold text-xs tracking-wider uppercase h-11 rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 mt-2"
              >
                <MessageSquare size={14} />
                Submit Review
              </button>

            </form>
          </div>
        )}
      </div>

    </div>
  );
};

export default PropertyTabs;
