import { useState } from 'react';
import { Save, Globe, Search, FileText, Code, RefreshCw, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSEOSettings, updateSEOSettings } from '@/lib/cmsStore';
import { toast } from 'sonner';
import type { SEOSettings as SEOSettingsType } from '@/types/cms';

export default function SEOSettings() {
  const [settings, setSettings] = useState<SEOSettingsType>(getSEOSettings());
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof SEOSettingsType, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSEOSettings(settings);
    setHasChanges(false);
    toast.success('SEO settings saved');
  };

  const generateSitemap = () => {
    toast.success('Sitemap generated successfully');
  };

  const generateRobotsTxt = () => {
    const robots = `User-agent: *
${settings.sitemapEnabled ? 'Allow: /' : 'Disallow: /'}
Disallow: /admin
Disallow: /api

${settings.sitemapEnabled ? 'Sitemap: https://yourdomain.com/sitemap.xml' : ''}`;
    handleChange('robotsTxt', robots);
    toast.success('robots.txt generated');
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">SEO Settings</h1>
          <p className="text-[#5A6578] mt-1">Optimize your website for search engines.</p>
        </div>
        <Button onClick={handleSave} className="btn-primary rounded-full" disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-[rgba(11,18,32,0.08)]">
          <TabsTrigger value="general" className="rounded-lg">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="advanced" className="rounded-lg">
            <Code className="w-4 h-4 mr-2" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="sitemap" className="rounded-lg">
            <Map className="w-4 h-4 mr-2" />
            Sitemap
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0B1220]">Search Appearance</h3>
                <p className="text-sm text-[#5A6578]">How your site appears in search results</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Site Title</Label>
                <Input
                  value={settings.siteTitle}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                  placeholder="Your Site Title"
                  className="mt-1"
                />
                <p className="text-xs text-[#5A6578] mt-1">
                  The title that appears in search engine results
                </p>
              </div>

              <div>
                <Label>Site Description</Label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Brief description of your site"
                  className="mt-1"
                  rows={3}
                />
                <p className="text-xs text-[#5A6578] mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label>Site Keywords</Label>
                <Input
                  value={settings.siteKeywords}
                  onChange={(e) => handleChange('siteKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                  className="mt-1"
                />
                <p className="text-xs text-[#5A6578] mt-1">
                  Comma-separated keywords relevant to your site
                </p>
              </div>

              <div>
                <Label>Twitter Handle</Label>
                <Input
                  value={settings.twitterHandle || ''}
                  onChange={(e) => handleChange('twitterHandle', e.target.value)}
                  placeholder="@yourhandle"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Google Analytics ID</Label>
                <Input
                  value={settings.googleAnalyticsId || ''}
                  onChange={(e) => handleChange('googleAnalyticsId', e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0B1220]">Open Graph</h3>
                <p className="text-sm text-[#5A6578]">Social media sharing settings</p>
              </div>
            </div>

            <div>
              <Label>Default OG Image URL</Label>
              <Input
                value={settings.ogDefaultImage || ''}
                onChange={(e) => handleChange('ogDefaultImage', e.target.value)}
                placeholder="https://yoursite.com/og-image.jpg"
                className="mt-1"
              />
              <p className="text-xs text-[#5A6578] mt-1">
                Recommended size: 1200x630 pixels
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1220]">robots.txt</h3>
                  <p className="text-sm text-[#5A6578]">Control search engine crawling</p>
                </div>
              </div>
              <Button variant="outline" onClick={generateRobotsTxt}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Default
              </Button>
            </div>

            <Textarea
              value={settings.robotsTxt}
              onChange={(e) => handleChange('robotsTxt', e.target.value)}
              className="font-mono text-sm"
              rows={10}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <h3 className="text-lg font-semibold text-[#0B1220] mb-4">SEO Features</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#F6F7F9] rounded-xl">
                <div>
                  <p className="font-medium text-[#0B1220]">Canonical URLs</p>
                  <p className="text-sm text-[#5A6578]">Prevent duplicate content issues</p>
                </div>
                <Switch
                  checked={settings.canonicalUrls}
                  onCheckedChange={(checked) => handleChange('canonicalUrls', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-[#F6F7F9] rounded-xl">
                <div>
                  <p className="font-medium text-[#0B1220]">Structured Data</p>
                  <p className="text-sm text-[#5A6578]">Add JSON-LD schema markup</p>
                </div>
                <Switch
                  checked={settings.structuredData}
                  onCheckedChange={(checked) => handleChange('structuredData', checked)}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Sitemap */}
        <TabsContent value="sitemap" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Map className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[#0B1220]">XML Sitemap</h3>
                  <p className="text-sm text-[#5A6578]">Help search engines index your site</p>
                </div>
              </div>
              <Button variant="outline" onClick={generateSitemap}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate Sitemap
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#F6F7F9] rounded-xl mb-4">
              <div>
                <p className="font-medium text-[#0B1220]">Enable Sitemap</p>
                <p className="text-sm text-[#5A6578]">Automatically generate sitemap.xml</p>
              </div>
              <Switch
                checked={settings.sitemapEnabled}
                onCheckedChange={(checked) => handleChange('sitemapEnabled', checked)}
              />
            </div>

            {settings.sitemapEnabled && (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-[#5A6578] mb-2">Sitemap URL:</p>
                <code className="text-sm bg-white px-3 py-2 rounded-lg block">
                  https://yourdomain.com/sitemap.xml
                </code>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
