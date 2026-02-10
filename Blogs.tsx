import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { getBlogs, addBlog, updateBlog, deleteBlog } from '@/lib/dataStore';
import { toast } from 'sonner';
import type { Blog } from '@/types';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>(getBlogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    published: true,
  });

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingBlog(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      published: blog.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      deleteBlog(id);
      setBlogs(getBlogs());
      toast.success('Blog deleted successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBlog) {
      updateBlog(editingBlog.id, { ...formData, date: editingBlog.date });
      toast.success('Blog updated successfully');
    } else {
      addBlog({
        ...formData,
        date: new Date().toISOString().split('T')[0],
      });
      toast.success('Blog added successfully');
    }
    
    setBlogs(getBlogs());
    setIsDialogOpen(false);
  };

  const togglePublish = (blog: Blog) => {
    updateBlog(blog.id, { published: !blog.published });
    setBlogs(getBlogs());
    toast.success(blog.published ? 'Blog unpublished' : 'Blog published');
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] mb-2">Blogs</h1>
          <p className="text-[#5A6578]">Manage your blog posts and articles.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-xl"
                  required
                />
              </div>
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="rounded-xl"
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="rounded-xl"
                  rows={8}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <Button type="submit" className="btn-primary w-full">
                {editingBlog ? 'Update Blog' : 'Add Blog'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
        <Input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-3 rounded-xl border-[rgba(11,18,32,0.14)]"
        />
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-[28px] border border-[rgba(11,18,32,0.08)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F7F9]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Author</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1220]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(11,18,32,0.08)]">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-[#F6F7F9]/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#0B1220]">{blog.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs font-semibold rounded-full">
                      {blog.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A6578]">{blog.author}</td>
                  <td className="px-6 py-4 text-sm text-[#5A6578]">
                    {new Date(blog.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(blog)}
                      className={`flex items-center space-x-1 text-sm ${
                        blog.published ? 'text-green-600' : 'text-[#5A6578]'
                      }`}
                    >
                      {blog.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{blog.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                        className="text-[#1D4ED8] hover:bg-[#1D4ED8]/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5A6578]">No blogs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
