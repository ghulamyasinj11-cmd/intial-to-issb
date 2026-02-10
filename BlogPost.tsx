import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogById } from '@/lib/dataStore';
import { toast } from 'sonner';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const blog = id ? getBlogById(id) : undefined;

  if (!blog || !blog.published) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center text-[#5A6578] hover:text-[#0B1220] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <span className="px-4 py-1.5 bg-[#1D4ED8]/10 text-[#1D4ED8] text-sm font-semibold rounded-full">
              {blog.category}
            </span>
          </div>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold text-[#0B1220] leading-tight mb-6">
            {blog.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-6 text-sm text-[#5A6578]">
              <span className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#1D4ED8]/10 flex items-center justify-center text-[#1D4ED8] font-bold text-xs">
                  {blog.author.charAt(0)}
                </div>
                <span>{blog.author}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.date).toLocaleDateString()}</span>
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="rounded-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="h-64 lg:h-96 rounded-[28px] bg-gradient-to-br from-[#1D4ED8]/20 to-[#1D4ED8]/5 flex items-center justify-center mb-10">
          <span className="text-9xl font-bold text-[#1D4ED8]/20">
            {blog.title.charAt(0)}
          </span>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-white rounded-[28px] p-8 lg:p-12 border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
            <p className="text-xl text-[#5A6578] leading-relaxed mb-8">
              {blog.excerpt}
            </p>
            <div className="text-[#0B1220] leading-relaxed whitespace-pre-line">
              {blog.content}
            </div>
          </div>
        </article>

        {/* Related Articles CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#5A6578] mb-4">Want to read more?</p>
          <Link to="/blog">
            <Button className="btn-primary">View All Articles</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
