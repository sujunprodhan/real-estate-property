import React from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Quote, 
  Mail, 
  Send, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';
import blogs from '../../../data/blogs.json';
import BlogInteractions from '../../../componets/BlogInteractions';

// Generate static params for all dynamic slugs to enable fast static optimization
export async function generateStaticParams() {
  return blogs.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  
  // Find current blog post
  const post = blogs.find((b) => b.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-6">
        <div className="text-center p-8 bg-base-200/50 border border-base-200 rounded-[2.5rem] max-w-md w-full backdrop-blur-md">
          <h2 className="text-3xl font-extrabold text-base-content mb-3">Article Not Found</h2>
          <p className="text-base-content/60 text-sm mb-6 leading-relaxed">
            The blog article you are looking for does not exist or has been relocated to another directory.
          </p>
          <Link href="/" className="btn btn-primary rounded-full text-white w-full border-none shadow-md shadow-primary/20">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Get related articles (excluding the current one)
  const relatedArticles = blogs.filter((b) => b.slug !== slug).slice(0, 2);

  return (
    <main className="min-h-screen bg-base-100 pb-24 pt-32">
      
      {/* 1. MAIN WRAPPER CONTAINER */}
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-primary font-bold text-sm mb-8 hover:gap-3 transition-all duration-300 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>

        {/* 2. BLOG HEADER */}
        <header className="mb-10 max-w-4xl">
          <span className="bg-primary/10 text-primary font-extrabold text-xs tracking-wider uppercase px-4 py-1.5 rounded-full mb-6 inline-block">
            {post.tag}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-base-content tracking-tight leading-tight mb-8">
            {post.title}
          </h1>

          {/* Author & Read Time Meta */}
          <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-base-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/20 shadow-md">
                <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-base-content text-sm leading-none mb-1">{post.author.name}</h4>
                <span className="text-xs text-base-content/50">{post.author.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-base-content/50 ml-0 md:ml-6 border-l border-base-200 pl-6 h-10">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>

        {/* 3. HERO BANNER COVER */}
        <div className="relative aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden mb-16 shadow-xl shadow-black/5">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* 4. SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* A. LEFT COLUMN: ARTICLE BODY CONTENT */}
          <article className="lg:col-span-8 space-y-8 pr-0 lg:pr-6">
            
            {/* Introduction paragraph */}
            <p className="text-lg md:text-xl text-base-content/85 leading-relaxed font-medium">
              {post.introduction}
            </p>

            {/* Dynamic Content Blocks */}
            {post.content.map((block, index) => {
              if (block.type === 'heading') {
                return (
                  <h3 key={index} className="text-2xl md:text-3xl font-extrabold text-base-content mt-12 mb-4 leading-snug">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === 'paragraph') {
                return (
                  <p key={index} className="text-base-content/70 text-base md:text-lg leading-relaxed mb-6 font-normal">
                    {block.text}
                  </p>
                );
              }
              if (block.type === 'quote') {
                return (
                  <div key={index} className="relative p-8 rounded-[2rem] bg-linear-to-br from-primary/5 to-secondary/5 border-l-4 border-primary my-10 group overflow-hidden">
                    <div className="absolute top-4 right-6 text-primary/10 pointer-events-none">
                      <Quote size={80} className="rotate-180" />
                    </div>
                    <p className="text-lg md:text-xl font-bold text-base-content italic leading-relaxed relative z-10">
                      "{block.text}"
                    </p>
                  </div>
                );
              }
              return null;
            })}

            {/* Interactive Comment Logs & Share Hub */}
            <div className="mt-16 pt-8 border-t border-base-200">
              <BlogInteractions slug={slug} postTitle={post.title} authorName={post.author.name} />
            </div>

          </article>


          {/* B. RIGHT COLUMN: SIDEBAR */}
          <aside className="lg:col-span-4 space-y-8 sticky top-32">
            
            {/* Newsletter Card */}
            <div className="bg-base-200/50 backdrop-blur-md border border-base-200 p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 blur-xl group-hover:scale-150 transition-transform"></div>
              
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary">
                <Mail size={22} />
              </div>

              <h4 className="text-lg font-extrabold text-base-content mb-2">Subscribe to Insights</h4>
              <p className="text-xs text-base-content/60 leading-relaxed mb-6">
                Receive latest real estate forecasts, local design tips, and newly posted high-yield properties directly in your inbox.
              </p>

              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="input input-bordered w-full rounded-2xl bg-base-100 border-base-200/80 focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs font-semibold px-4 py-3"
                  required
                />
                <button type="button" className="btn btn-primary rounded-2xl text-white w-full border-none font-bold shadow-md shadow-primary/20 flex items-center justify-center gap-2">
                  Subscribe
                  <Send size={14} />
                </button>
              </div>
            </div>


            {/* Related Articles Card */}
            {relatedArticles.length > 0 && (
              <div className="bg-base-200/50 backdrop-blur-md border border-base-200 p-8 rounded-[2.5rem] shadow-sm">
                <h4 className="text-lg font-extrabold text-base-content mb-6 flex items-center gap-2">
                  <BookOpen size={18} className="text-primary" />
                  Related News
                </h4>

                <div className="flex flex-col gap-6">
                  {relatedArticles.map((rel, index) => (
                    <Link 
                      key={index} 
                      href={`/blogs/${rel.slug}`} 
                      className="group flex gap-4 items-start border-b border-base-content/5 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="w-20 aspect-square rounded-2xl overflow-hidden shadow-sm shrink-0">
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block mb-1">
                          {rel.tag}
                        </span>
                        <h5 className="font-extrabold text-sm text-base-content leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {rel.title}
                        </h5>
                        <span className="text-[10px] text-base-content/40 block mt-1.5 flex items-center gap-1">
                          <Clock size={10} />
                          {rel.readTime}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </aside>

        </div>

      </div>
    </main>
  );
}
