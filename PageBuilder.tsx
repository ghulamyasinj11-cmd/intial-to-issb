import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Eye,
  Save,
  Settings,
  Trash2,
  ChevronDown,
  ChevronUp,
  Type,
  Image,
  LayoutGrid,
  BarChart3,
  Users,
  MessageSquare,
  Star,
  Video,
  Phone,
  Megaphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getPageById, createPage, updatePage } from '@/lib/cmsStore';
import { toast } from 'sonner';
import type { Page, PageSection } from '@/types/cms';
import { v4 as uuidv4 } from 'uuid';

const sectionTypes = [
  { type: 'hero', label: 'Hero', icon: LayoutGrid, description: 'Large banner with title and CTA' },
  { type: 'text', label: 'Text Block', icon: Type, description: 'Simple text content' },
  { type: 'image-text', label: 'Image + Text', icon: Image, description: 'Side-by-side layout' },
  { type: 'features', label: 'Features Grid', icon: LayoutGrid, description: 'Feature cards' },
  { type: 'stats', label: 'Statistics', icon: BarChart3, description: 'Number counters' },
  { type: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Customer quotes' },
  { type: 'team', label: 'Team', icon: Users, description: 'Team members' },
  { type: 'cta', label: 'Call to Action', icon: Megaphone, description: 'Promotional section' },
  { type: 'contact', label: 'Contact Form', icon: Phone, description: 'Contact section' },
  { type: 'video', label: 'Video', icon: Video, description: 'Video embed' },
  { type: 'gallery', label: 'Gallery', icon: Image, description: 'Image gallery' },
  { type: 'custom', label: 'Custom HTML', icon: Star, description: 'Custom code' },
];

export default function PageBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [page, setPage] = useState<Partial<Page>>({
    title: '',
    slug: '',
    description: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
    isHomePage: false,
    sections: [],
  });
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isNew && id) {
      const existingPage = getPageById(id);
      if (existingPage) {
        setPage(existingPage);
      } else {
        toast.error('Page not found');
        navigate('/admin/pages');
      }
    }
  }, [id, isNew, navigate]);

  const handleSave = () => {
    if (!page.title || !page.slug) {
      toast.error('Title and slug are required');
      return;
    }

    if (isNew) {
      const newPage = createPage(page as Omit<Page, 'id' | 'createdAt' | 'updatedAt'>);
      toast.success('Page created');
      navigate(`/admin/pages/edit/${newPage.id}`);
    } else if (id) {
      updatePage(id, page);
      toast.success('Page saved');
    }
  };

  const addSection = (type: string) => {
    const newSection: PageSection = {
      id: uuidv4(),
      type: type as PageSection['type'],
      name: sectionTypes.find((s) => s.type === type)?.label || 'Section',
      order: page.sections?.length || 0,
      isVisible: true,
      settings: {},
      content: getDefaultContent(type),
    };

    setPage({
      ...page,
      sections: [...(page.sections || []), newSection],
    });
    setShowAddSection(false);
    toast.success('Section added');
  };

  const getDefaultContent = (type: string) => {
    switch (type) {
      case 'hero':
        return {
          eyebrow: '',
          title: 'New Hero Section',
          subtitle: '',
          description: '',
          ctaPrimary: { text: 'Get Started', link: '#' },
          ctaSecondary: { text: 'Learn More', link: '#' },
        };
      case 'text':
        return {
          title: 'Section Title',
          content: 'Add your content here...',
          align: 'left',
        };
      case 'features':
        return {
          eyebrow: '',
          title: 'Our Features',
          description: '',
          features: [
            { icon: 'Star', title: 'Feature 1', description: 'Description' },
            { icon: 'Star', title: 'Feature 2', description: 'Description' },
            { icon: 'Star', title: 'Feature 3', description: 'Description' },
          ],
        };
      case 'stats':
        return {
          stats: [
            { value: '100+', label: 'Stat 1' },
            { value: '50+', label: 'Stat 2' },
            { value: '1000+', label: 'Stat 3' },
          ],
        };
      case 'testimonials':
        return {
          eyebrow: 'TESTIMONIALS',
          title: 'What People Say',
          testimonials: [
            { quote: 'Great service!', author: 'John Doe', role: 'Customer' },
          ],
        };
      case 'cta':
        return {
          title: 'Ready to Get Started?',
          description: 'Join thousands of satisfied customers.',
          buttonText: 'Sign Up Now',
          buttonLink: '#',
        };
      case 'contact':
        return {
          title: 'Contact Us',
          description: 'Get in touch with our team.',
          email: '',
          phone: '',
          address: '',
        };
      default:
        return {};
    }
  };

  const updateSection = (sectionId: string, updates: Partial<PageSection>) => {
    setPage({
      ...page,
      sections: page.sections?.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    });
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setPage({
        ...page,
        sections: page.sections?.filter((s) => s.id !== sectionId),
      });
      toast.success('Section deleted');
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const sections = [...(page.sections || [])];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
    sections.forEach((s, i) => (s.order = i));

    setPage({ ...page, sections });
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const sections = [...(page.sections || [])];
    const [draggedSection] = sections.splice(draggedIndex, 1);
    sections.splice(index, 0, draggedSection);
    sections.forEach((s, i) => (s.order = i));

    setPage({ ...page, sections });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F6F7F9]">
      {/* Header */}
      <header className="bg-white border-b border-[rgba(11,18,32,0.08)] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/pages')}
              className="p-2 hover:bg-[#F6F7F9] rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[#0B1220]">
                {isNew ? 'Create Page' : 'Edit Page'}
              </h1>
              <p className="text-sm text-[#5A6578]">{page.title || 'Untitled Page'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 mr-4">
              <Switch
                checked={page.isPublished}
                onCheckedChange={(checked) => setPage({ ...page, isPublished: checked })}
              />
              <span className="text-sm text-[#5A6578]">
                {page.isPublished ? 'Published' : 'Draft'}
              </span>
            </div>
            <Button variant="outline" onClick={() => window.open(page.slug || '/', '_blank')}>
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Page Settings */}
        <div className="w-80 bg-white border-r border-[rgba(11,18,32,0.08)] overflow-y-auto">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="p-4 space-y-4">
              <div>
                <Label>Page Title</Label>
                <Input
                  value={page.title}
                  onChange={(e) => setPage({ ...page, title: e.target.value })}
                  placeholder="Page Title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>URL Slug</Label>
                <Input
                  value={page.slug}
                  onChange={(e) => setPage({ ...page, slug: e.target.value })}
                  placeholder="page-url"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={page.description}
                  onChange={(e) => setPage({ ...page, description: e.target.value })}
                  placeholder="Page description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={page.isHomePage}
                  onCheckedChange={(checked) => setPage({ ...page, isHomePage: checked })}
                />
                <Label>Set as Homepage</Label>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="p-4 space-y-4">
              <div>
                <Label>Meta Title</Label>
                <Input
                  value={page.metaTitle}
                  onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                  placeholder="SEO Title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={page.metaDescription}
                  onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                  placeholder="SEO Description"
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label>Meta Keywords</Label>
                <Input
                  value={page.metaKeywords}
                  onChange={(e) => setPage({ ...page, metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2"
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Section Builder */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Add Section Button */}
            <Dialog open={showAddSection} onOpenChange={setShowAddSection}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full py-8 border-dashed mb-6">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Section</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {sectionTypes.map((section) => (
                    <button
                      key={section.type}
                      onClick={() => addSection(section.type)}
                      className="flex items-start p-4 rounded-xl border border-[rgba(11,18,32,0.08)] hover:border-[#1D4ED8] hover:bg-[#1D4ED8]/5 transition-all text-left"
                    >
                      <div className="w-10 h-10 bg-[#F6F7F9] rounded-lg flex items-center justify-center mr-3">
                        <section.icon className="w-5 h-5 text-[#5A6578]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#0B1220]">{section.label}</p>
                        <p className="text-xs text-[#5A6578]">{section.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            {/* Sections List */}
            <div className="space-y-4">
              {page.sections?.map((section, index) => (
                <div
                  key={section.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-xl border ${
                    activeSection === section.id
                      ? 'border-[#1D4ED8] ring-2 ring-[#1D4ED8]/20'
                      : 'border-[rgba(11,18,32,0.08)]'
                  } overflow-hidden`}
                >
                  {/* Section Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F6F7F9]"
                    onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-[#5A6578] cursor-grab" />
                      <div>
                        <p className="font-medium text-[#0B1220]">{section.name}</p>
                        <p className="text-xs text-[#5A6578]">
                          {sectionTypes.find((s) => s.type === section.type)?.label}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, 'up');
                        }}
                        disabled={index === 0}
                        className="p-1 hover:bg-[#F6F7F9] rounded disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          moveSection(index, 'down');
                        }}
                        disabled={index === (page.sections?.length || 0) - 1}
                        className="p-1 hover:bg-[#F6F7F9] rounded disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <Switch
                        checked={section.isVisible}
                        onCheckedChange={(checked) =>
                          updateSection(section.id, { isVisible: checked })
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        className="p-1 hover:bg-red-50 text-red-500 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Section Editor */}
                  {activeSection === section.id && (
                    <div className="border-t border-[rgba(11,18,32,0.08)] p-4 bg-[#F6F7F9]/50">
                      <SectionEditor
                        section={section}
                        onUpdate={(updates) => updateSection(section.id, updates)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {page.sections?.length === 0 && (
              <div className="text-center py-16">
                <LayoutGrid className="w-16 h-16 text-[#5A6578]/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0B1220] mb-2">No sections yet</h3>
                <p className="text-[#5A6578] mb-4">Add sections to build your page</p>
                <Button onClick={() => setShowAddSection(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Section Editor Component
function SectionEditor({
  section,
  onUpdate,
}: {
  section: PageSection;
  onUpdate: (updates: Partial<PageSection>) => void;
}) {
  const updateContent = (key: string, value: any) => {
    onUpdate({
      content: { ...section.content, [key]: value },
    });
  };

  switch (section.type) {
    case 'hero':
      return (
        <div className="space-y-4">
          <div>
            <Label>Eyebrow Text</Label>
            <Input
              value={section.content.eyebrow || ''}
              onChange={(e) => updateContent('eyebrow', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={section.content.subtitle || ''}
              onChange={(e) => updateContent('subtitle', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={section.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={section.content.content || ''}
              onChange={(e) => updateContent('content', e.target.value)}
              className="mt-1"
              rows={6}
            />
          </div>
        </div>
      );

    case 'features':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={section.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={section.content.title || ''}
              onChange={(e) => updateContent('title', e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={section.content.description || ''}
              onChange={(e) => updateContent('description', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Button Text</Label>
              <Input
                value={section.content.buttonText || ''}
                onChange={(e) => updateContent('buttonText', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={section.content.buttonLink || ''}
                onChange={(e) => updateContent('buttonLink', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="text-center py-8 text-[#5A6578]">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Editor for this section type is coming soon.</p>
        </div>
      );
  }
}
