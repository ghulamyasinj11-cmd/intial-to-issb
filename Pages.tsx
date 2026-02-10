import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  MoreVertical,
  ExternalLink,
  Layout,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPages, deletePage, duplicatePage, updatePage } from '@/lib/cmsStore';
import { toast } from 'sonner';
import type { Page } from '@/types/cms';

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    setPages(getPages());
  }, []);

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'published' && page.isPublished) ||
      (filter === 'draft' && !page.isPublished);
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (page: Page) => {
    if (page.isHomePage) {
      toast.error('Cannot delete the home page');
      return;
    }
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      deletePage(page.id);
      setPages(getPages());
      toast.success('Page deleted');
    }
  };

  const handleDuplicate = (page: Page) => {
    const duplicated = duplicatePage(page.id);
    if (duplicated) {
      setPages(getPages());
      toast.success('Page duplicated');
    }
  };

  const togglePublish = (page: Page) => {
    updatePage(page.id, { isPublished: !page.isPublished });
    setPages(getPages());
    toast.success(page.isPublished ? 'Page unpublished' : 'Page published');
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">Pages</h1>
          <p className="text-[#5A6578] mt-1">Manage your website pages and content.</p>
        </div>
        <Link to="/admin/pages/new">
          <Button className="btn-primary rounded-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
          <Input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${
                filter === f
                  ? 'bg-[#1D4ED8] text-white'
                  : 'bg-white text-[#5A6578] hover:bg-[#F6F7F9]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pages Grid */}
      {filteredPages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              className="group bg-white rounded-2xl border border-[rgba(11,18,32,0.08)] p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#F6F7F9] rounded-xl flex items-center justify-center">
                  {page.isHomePage ? (
                    <Layout className="w-6 h-6 text-[#1D4ED8]" />
                  ) : (
                    <FileText className="w-6 h-6 text-[#5A6578]" />
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/admin/pages/edit/${page.id}`)}>
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(page)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => togglePublish(page)}>
                      {page.isPublished ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    {!page.isHomePage && (
                      <DropdownMenuItem
                        onClick={() => handleDelete(page)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <h3 className="font-semibold text-[#0B1220] mb-1">{page.title}</h3>
              <p className="text-sm text-[#5A6578] mb-3">/{page.slug}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={page.isPublished ? 'default' : 'secondary'}
                    className={page.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                  >
                    {page.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  {page.isHomePage && (
                    <Badge variant="outline" className="border-[#1D4ED8] text-[#1D4ED8]">
                      Home
                    </Badge>
                  )}
                </div>
                <Link
                  to={page.slug}
                  target="_blank"
                  className="text-[#5A6578] hover:text-[#1D4ED8] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-[rgba(11,18,32,0.08)] flex items-center text-xs text-[#5A6578]">
                <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{page.sections.length} sections</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[rgba(11,18,32,0.14)]">
          <FileText className="w-12 h-12 text-[#5A6578]/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#0B1220] mb-2">No pages found</h3>
          <p className="text-[#5A6578] mb-4">Create your first page to get started.</p>
          <Link to="/admin/pages/new">
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
