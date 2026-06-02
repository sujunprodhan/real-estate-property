import React from 'react';
import Link from 'next/link';
import { getBlogs } from '../../actions/server/blog';
import { Calendar, Clock, ArrowRight, Sparkles, Mail, Send, BookOpen } from 'lucide-react';

export default async function BlogsPage() {
  const blogs = await getBlogs();

  // Sort blogs by newest first
  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.createdAt || a.date);
    const dateB = new Date(b.createdAt || b.date);
    return dateB - dateA;
  });

  const featuredBlog = sortedBlogs[0];
  const regularBlogs = sortedBlogs.slice(1);
  const recentBlogs = sortedBlogs.slice(0, 5);

  return (
    <main className="min-h-screen bg-base-100 pb-24 pt-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block flex items-center justify-center gap-2">
            <Sparkles size={16} />
            Insights & News
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight mb-4">
            Our Latest Articles
          </h1>
          <p className="text-base-content/60 text-lg">
            Discover real estate forecasts, architectural trends, and expert tips from our professional agents.
          </p>
        </div>

        {sortedBlogs.length === 0 ? (
          <div className="text-center py-20 bg-base-200/50 rounded-[3rem] border border-base-200">
            <h2 className="text-2xl font-bold text-base-content mb-2">No Articles Found</h2>
            <p className="text-base-content/60">Check back soon for new insights and news.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Content Area */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* Featured Blog */}
              {featuredBlog && (
                <Link 
                  href={`/blogs/${featuredBlog.slug}`}
                  className="group flex flex-col bg-base-200/50 backdrop-blur-md border border-base-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <div className="absolute top-6 left-6 z-10">
                      <span className="bg-base-100/90 backdrop-blur-md text-primary font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-full shadow-sm">
                        {featuredBlog.tag || 'Featured News'}
                      </span>
                    </div>
                    <img 
                      src={featuredBlog.image} 
                      alt={featuredBlog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-base-300/90 via-base-300/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full">
                      <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-snug group-hover:text-primary transition-colors">
                        {featuredBlog.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-white/70 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {featuredBlog.date}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          {featuredBlog.readTime || '5 min read'}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Grid of Regular Blogs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularBlogs.map((blog) => (
                  <Link 
                    key={blog._id || blog.slug} 
                    href={`/blogs/${blog.slug}`}
                    className="group flex flex-col bg-base-200/50 backdrop-blur-md border border-base-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-base-100/90 backdrop-blur-md text-primary font-extrabold text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                          {blog.tag || 'News'}
                        </span>
                      </div>
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-extrabold text-base-content mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-base-content/60 text-xs mb-6 line-clamp-3 leading-relaxed flex-1">
                        {blog.introduction || 'Read more about this topic inside the article.'}
                      </p>

                      <div className="flex items-center justify-between border-t border-base-content/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3 text-[9px] text-base-content/50 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Calendar size={10} />
                            {blog.date}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8 sticky top-32">
              
              {/* Newsletter Widget */}
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

              {/* Recent Posts Widget */}
              {recentBlogs.length > 0 && (
                <div className="bg-base-200/50 backdrop-blur-md border border-base-200 p-8 rounded-[2.5rem] shadow-sm">
                  <h4 className="text-lg font-extrabold text-base-content mb-6 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary" />
                    Recent Articles
                  </h4>
                  <div className="flex flex-col gap-6">
                    {recentBlogs.map((blog, index) => (
                      <Link 
                        key={index} 
                        href={`/blogs/${blog.slug}`} 
                        className="group flex gap-4 items-start border-b border-base-content/5 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="w-20 aspect-square rounded-2xl overflow-hidden shadow-sm shrink-0">
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block mb-1">
                            {blog.tag || 'News'}
                          </span>
                          <h5 className="font-extrabold text-sm text-base-content leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {blog.title}
                          </h5>
                          <span className="text-[10px] text-base-content/40 block mt-1.5 flex items-center gap-1">
                            <Clock size={10} />
                            {blog.readTime || '5 min read'}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>

          </div>
        )}
      </div>
    </main>
  );
}
