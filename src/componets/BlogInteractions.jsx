'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  MessageSquare, 
  Send, 
  Link2, 
  Check, 
  User, 
  Calendar,
  Building,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

const initialComments = {
  'investing-oceanfront-property': [
    {
      name: 'Robert Vance',
      date: 'May 19, 2026',
      text: 'Extremely insightful analysis! I\'ve been considering a property in Florida, and the point about modern concrete alloys and lower insurance premiums is a huge factor I hadn\'t fully calculated. Thank you!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    },
    {
      name: 'Elena Rostova',
      date: 'May 20, 2026',
      text: 'Double-digit rental yields on peak oceanfront locations are absolutely real. My colleague purchased a beachfront villa last year, and it generates around 12% cash-on-cash return. Great article!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ],
  'modernist-gated-villa-interiors': [
    {
      name: 'Sophia Laurent',
      date: 'May 13, 2026',
      text: 'Recessed circadian-lighting arrays are a total game changer for modernist homes. We installed them in our living room and the transition from warm morning light to energetic cool daylight is incredible.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ],
  'purchasing-development-land': [
    {
      name: 'David K. Miller',
      date: 'May 06, 2026',
      text: 'Having geotechnical soil testing done BEFORE dropping the earnest deposit saved me over $50k on a sloping plot. The soil composition is vital. Every first-time land buyer should read this.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
    }
  ]
};

const BlogInteractions = ({ slug, postTitle, authorName }) => {
  const [comments, setComments] = useState(initialComments[slug] || []);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Handle link copying
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Submit comment in real-time
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;

    const newComment = {
      name: name,
      date: 'Today',
      text: commentText,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80' // default premium avatar
    };

    setComments([newComment, ...comments]);
    setName('');
    setCommentText('');
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="w-full space-y-12">
      
      {/* 1. SOCIAL SHARE MODULE */}
      <div className="p-6 rounded-[2rem] bg-base-200/40 border border-base-200/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Share2 size={18} className="text-primary" />
          <span className="font-extrabold text-sm text-base-content">Share this article:</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Facebook */}
          <button 
            onClick={() => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
            className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center"
            aria-label="Share on Facebook"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
            </svg>
          </button>
          
          {/* Twitter */}
          <button 
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
            className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center"
            aria-label="Share on Twitter"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </button>
          
          {/* LinkedIn */}
          <button 
            onClick={() => window.open(`https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`, '_blank')}
            className="btn btn-circle btn-ghost btn-sm text-base-content/60 hover:text-primary hover:bg-primary/10 transition-all duration-300 flex items-center justify-center"
            aria-label="Share on LinkedIn"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </button>
          
          {/* Copy Link button */}
          <button 
            onClick={handleCopyLink}
            className={`btn btn-sm rounded-full font-bold transition-all duration-300 gap-1.5 ${
              copied 
                ? 'bg-success text-success-content hover:bg-success' 
                : 'bg-base-100 hover:bg-primary hover:text-white border border-base-200'
            }`}
          >
            {copied ? <Check size={14} /> : <Link2 size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>


      {/* 2. DYNAMIC MOCK TAKEAWAY INFO WIDGET */}
      <div className="p-8 rounded-[2.5rem] bg-linear-to-br from-primary/5 via-transparent to-secondary/5 border border-base-200 flex flex-col md:flex-row items-center gap-6 justify-between group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-secondary/5 blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
        
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Building size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h4 className="font-extrabold text-base-content text-base mb-1">Inspired by this post?</h4>
            <p className="text-xs text-base-content/60 leading-relaxed max-w-lg">
              Unlock exclusive luxury residential and investment properties connected directly to this topic with {authorName}.
            </p>
          </div>
        </div>

        <Link 
          href="/properties" 
          className="btn btn-primary rounded-full text-white px-6 border-none shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 group shrink-0"
        >
          View Listings
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>


      {/* 3. INTERACTIVE COMMENTS SECTION */}
      <div className="space-y-8 pt-6 border-t border-base-200">
        <h3 className="text-2xl font-extrabold text-base-content flex items-center gap-2.5">
          <MessageSquare size={22} className="text-primary" />
          Comments ({comments.length})
        </h3>

        {/* Existing Comments */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <div 
                key={index}
                className="flex gap-4 items-start p-6 rounded-[2rem] bg-base-200/30 border border-base-200/50 hover:border-base-200 transition-colors animate-fade-in duration-500"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-base-200">
                  <img src={comment.avatar} alt={comment.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-extrabold text-sm text-base-content">{comment.name}</h5>
                    <span className="text-[10px] text-base-content/40 flex items-center gap-1">
                      <Calendar size={10} />
                      {comment.date}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/70 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-base-content/40 italic pl-2">No comments posted yet. Be the first to share your thoughts!</p>
          )}
        </div>

        {/* Add comment form */}
        <div className="bg-base-200/30 p-8 rounded-[2.5rem] border border-base-200/50 space-y-6">
          <h4 className="font-extrabold text-base-content text-base">Leave a Reply</h4>
          
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none">
                  <User size={16} />
                </div>
                <input 
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full pl-11 rounded-2xl bg-base-100 border-base-200/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-semibold px-4 py-3"
                  required
                />
              </div>
            </div>

            <textarea 
              rows={4}
              placeholder="Share your thoughts about this article..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="textarea textarea-bordered w-full rounded-2xl bg-base-100 border-base-200/60 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-semibold p-4"
              required
            ></textarea>

            {formSubmitted && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-xl text-xs font-bold text-success text-center">
                Success! Your comment has been published successfully.
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary rounded-2xl text-white px-6 border-none font-bold shadow-md shadow-primary/20 flex items-center gap-2 hover:scale-[1.01]"
            >
              Post Comment
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};

export default BlogInteractions;
