import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getBlogs } from '@/lib/dataStore';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const blogs = getBlogs().filter((b) => b.published);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow block mb-4">BLOG</span>
          <h1 className="text-[clamp(36px,4.5vw,64px)] font-bold text-[#0B1220] leading-tight mb-4">
            Latest Articles
          </h1>
          <p className="text-lg text-[#5A6578]">
            Tips, strategies, and insights for your armed forces preparation journey.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
            />
          </div>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredBlogs.map((blog) => (
              <article
                key={blog.id}
                className="bg-white rounded-[28px] overflow-hidden border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-[#1D4ED8]/20 to-[#1D4ED8]/5 flex items-center justify-center">
                  <span className="text-6xl font-bold text-[#1D4ED8]/20">
                    {blog.title.charAt(0)}
                  </span>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="px-3 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0B1220] mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-[#5A6578] text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(11,18,32,0.08)]">
                    <div className="flex items-center space-x-4 text-sm text-[#5A6578]">
                      <span className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>{blog.author}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(blog.date).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/blog/${blog.id}`}
                    className="inline-flex items-center text-[#1D4ED8] font-medium mt-4 hover:underline"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[#5A6578]">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
