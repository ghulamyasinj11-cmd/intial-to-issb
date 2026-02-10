import { useState } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getContent, updateContent, resetToDefaults } from '@/lib/dataStore';
import { toast } from 'sonner';
import type { SiteContent } from '@/types';

export default function AdminContent() {
  const [content, setContent] = useState<SiteContent>(getContent());
  const [activeTab, setActiveTab] = useState('hero');

  const handleSave = () => {
    updateContent(content);
    toast.success('Content saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all content to defaults? This cannot be undone.')) {
      resetToDefaults();
      setContent(getContent());
      toast.success('Content reset to defaults');
    }
  };

  const updateHero = (field: string, value: string | { label: string; value: string; description: string }[]) => {
    setContent({
      ...content,
      hero: { ...content.hero, [field]: value },
    });
  };

  const updateStat = (index: number, field: string, value: string) => {
    const newStats = [...content.hero.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    updateHero('stats', newStats);
  };

  const updateSection = (section: keyof SiteContent, field: string, value: string) => {
    setContent({
      ...content,
      [section]: { ...content[section], [field]: value },
    });
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] mb-2">Content Editor</h1>
          <p className="text-[#5A6578]">Edit website text and content.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={handleReset} className="rounded-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-[rgba(11,18,32,0.08)]">
          <TabsTrigger value="hero" className="rounded-lg">Hero</TabsTrigger>
          <TabsTrigger value="subjects" className="rounded-lg">Subjects</TabsTrigger>
          <TabsTrigger value="studyModes" className="rounded-lg">Study Modes</TabsTrigger>
          <TabsTrigger value="success" className="rounded-lg">Success</TabsTrigger>
          <TabsTrigger value="whyChoose" className="rounded-lg">Why Choose</TabsTrigger>
          <TabsTrigger value="examCoverage" className="rounded-lg">Exams</TabsTrigger>
          <TabsTrigger value="studyPlanner" className="rounded-lg">Planner</TabsTrigger>
          <TabsTrigger value="instructors" className="rounded-lg">Instructors</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg">Contact</TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Hero Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Title Line 1</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title Line 2</Label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={content.hero.description}
                  onChange={(e) => updateHero('description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>Primary CTA</Label>
                <Input
                  value={content.hero.ctaPrimary}
                  onChange={(e) => updateHero('ctaPrimary', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Secondary CTA</Label>
                <Input
                  value={content.hero.ctaSecondary}
                  onChange={(e) => updateHero('ctaSecondary', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.hero.stats.map((stat, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <Label>Stat {index + 1} Value</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="rounded-xl mt-2"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={stat.description}
                      onChange={(e) => updateStat(index, 'description', e.target.value)}
                      className="rounded-xl mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent value="subjects" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Subjects Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.subjects.subtitle}
                  onChange={(e) => updateSection('subjects', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.subjects.title}
                  onChange={(e) => updateSection('subjects', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.subjects.description}
                  onChange={(e) => updateSection('subjects', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Study Modes Tab */}
        <TabsContent value="studyModes" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Study Modes Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.studyModes.subtitle}
                  onChange={(e) => updateSection('studyModes', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.studyModes.title}
                  onChange={(e) => updateSection('studyModes', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Success Stories Tab */}
        <TabsContent value="success" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Success Stories Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.successStories.subtitle}
                  onChange={(e) => updateSection('successStories', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.successStories.title}
                  onChange={(e) => updateSection('successStories', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Big Stat Number</Label>
                <Input
                  value={content.successStories.stat}
                  onChange={(e) => updateSection('successStories', 'stat', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Stat Label</Label>
                <Input
                  value={content.successStories.statLabel}
                  onChange={(e) => updateSection('successStories', 'statLabel', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Wide Card Text</Label>
                <Input
                  value={content.successStories.wideCardText}
                  onChange={(e) => updateSection('successStories', 'wideCardText', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Why Choose Tab */}
        <TabsContent value="whyChoose" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Why Choose Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.whyChoose.subtitle}
                  onChange={(e) => updateSection('whyChoose', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.whyChoose.title}
                  onChange={(e) => updateSection('whyChoose', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.whyChoose.description}
                  onChange={(e) => updateSection('whyChoose', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>CTA Button Text</Label>
                <Input
                  value={content.whyChoose.cta}
                  onChange={(e) => updateSection('whyChoose', 'cta', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Exam Coverage Tab */}
        <TabsContent value="examCoverage" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Exam Coverage Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.examCoverage.subtitle}
                  onChange={(e) => updateSection('examCoverage', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.examCoverage.title}
                  onChange={(e) => updateSection('examCoverage', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.examCoverage.description}
                  onChange={(e) => updateSection('examCoverage', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Study Planner Tab */}
        <TabsContent value="studyPlanner" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Study Planner Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.studyPlanner.subtitle}
                  onChange={(e) => updateSection('studyPlanner', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.studyPlanner.title}
                  onChange={(e) => updateSection('studyPlanner', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.studyPlanner.description}
                  onChange={(e) => updateSection('studyPlanner', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Instructors Tab */}
        <TabsContent value="instructors" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Instructors Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.instructors.subtitle}
                  onChange={(e) => updateSection('instructors', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.instructors.title}
                  onChange={(e) => updateSection('instructors', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.instructors.description}
                  onChange={(e) => updateSection('instructors', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Contact Section</h3>
            <div className="space-y-4">
              <div>
                <Label>Subtitle (Eyebrow)</Label>
                <Input
                  value={content.contact.subtitle}
                  onChange={(e) => updateSection('contact', 'subtitle', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.contact.title}
                  onChange={(e) => updateSection('contact', 'title', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.contact.description}
                  onChange={(e) => updateSection('contact', 'description', e.target.value)}
                  className="rounded-xl mt-2"
                  rows={3}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={content.contact.email}
                  onChange={(e) => updateSection('contact', 'email', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={content.contact.phone}
                  onChange={(e) => updateSection('contact', 'phone', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
              <div>
                <Label>Hours</Label>
                <Input
                  value={content.contact.hours}
                  onChange={(e) => updateSection('contact', 'hours', e.target.value)}
                  className="rounded-xl mt-2"
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
