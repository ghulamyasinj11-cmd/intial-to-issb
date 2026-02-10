import { useState } from 'react';
import { Save, Globe, Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSiteSettings, updateSiteSettings } from '@/lib/cmsStore';
import { toast } from 'sonner';
import type { SiteSettings as SiteSettingsType, SocialLink } from '@/types/cms';

export default function SiteSettings() {
  const [settings, setSettings] = useState<SiteSettingsType>(getSiteSettings());
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field: keyof SiteSettingsType, value: any) => {
    setSettings({ ...settings, [field]: value });
    setHasChanges(true);
  };

  const handleContactChange = (field: keyof typeof settings.contactInfo, value: string) => {
    setSettings({
      ...settings,
      contactInfo: { ...settings.contactInfo, [field]: value },
    });
    setHasChanges(true);
  };

  const handleSocialChange = (index: number, field: keyof SocialLink, value: string) => {
    const newSocialLinks = [...settings.socialLinks];
    newSocialLinks[index] = { ...newSocialLinks[index], [field]: value };
    setSettings({ ...settings, socialLinks: newSocialLinks });
    setHasChanges(true);
  };

  const addSocialLink = () => {
    setSettings({
      ...settings,
      socialLinks: [...settings.socialLinks, { platform: '', url: '', icon: '' }],
    });
    setHasChanges(true);
  };

  const removeSocialLink = (index: number) => {
    const newSocialLinks = settings.socialLinks.filter((_, i) => i !== index);
    setSettings({ ...settings, socialLinks: newSocialLinks });
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSiteSettings(settings);
    setHasChanges(false);
    toast.success('Site settings saved');
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return Facebook;
      case 'twitter':
        return Twitter;
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      default:
        return Globe;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220]">Site Settings</h1>
          <p className="text-[#5A6578] mt-1">Configure your website settings and information.</p>
        </div>
        <Button onClick={handleSave} className="btn-primary rounded-full" disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-white p-1 rounded-xl border border-[rgba(11,18,32,0.08)]">
          <TabsTrigger value="general" className="rounded-lg">General</TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg">Contact</TabsTrigger>
          <TabsTrigger value="social" className="rounded-lg">Social</TabsTrigger>
          <TabsTrigger value="maintenance" className="rounded-lg">Maintenance</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <h3 className="text-lg font-semibold text-[#0B1220] mb-6">Site Information</h3>
            <div className="space-y-6">
              <div>
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="Your Site Name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Tagline</Label>
                <Input
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Your tagline"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Footer Text</Label>
                <Textarea
                  value={settings.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  placeholder="Text to display in footer"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label>Copyright Text</Label>
                <Input
                  value={settings.copyrightText}
                  onChange={(e) => handleChange('copyrightText', e.target.value)}
                  placeholder="© {year} Your Company"
                  className="mt-1"
                />
                <p className="text-xs text-[#5A6578] mt-1">
                  Use {'{year}'} to automatically insert the current year
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#0B1220]">Contact Information</h3>
            </div>

            <div className="space-y-6">
              <div>
                <Label>Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
                  <Input
                    value={settings.contactInfo.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="contact@example.com"
                    className="pl-12 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
                  <Input
                    value={settings.contactInfo.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+1 234 567 890"
                    className="pl-12 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
                  <Input
                    value={settings.contactInfo.address}
                    onChange={(e) => handleContactChange('address', e.target.value)}
                    placeholder="Your address"
                    className="pl-12 mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Business Hours</Label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
                  <Input
                    value={settings.contactInfo.hours}
                    onChange={(e) => handleContactChange('hours', e.target.value)}
                    placeholder="Mon-Fri: 9AM - 5PM"
                    className="pl-12 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[#0B1220]">Social Media Links</h3>
              <Button variant="outline" onClick={addSocialLink}>
                Add Link
              </Button>
            </div>

            <div className="space-y-4">
              {settings.socialLinks.map((link, index) => {
                const Icon = getSocialIcon(link.platform);
                return (
                  <div key={index} className="flex items-center gap-4 p-4 bg-[#F6F7F9] rounded-xl">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#5A6578]" />
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <Input
                        value={link.platform}
                        onChange={(e) => handleSocialChange(index, 'platform', e.target.value)}
                        placeholder="Platform (e.g., Facebook)"
                      />
                      <Input
                        value={link.url}
                        onChange={(e) => handleSocialChange(index, 'url', e.target.value)}
                        placeholder="URL"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSocialLink(index)}
                      className="text-red-500"
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}

              {settings.socialLinks.length === 0 && (
                <div className="text-center py-8 text-[#5A6578]">
                  <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p>No social links added</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Maintenance Mode */}
        <TabsContent value="maintenance" className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[rgba(11,18,32,0.08)]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#0B1220]">Maintenance Mode</h3>
                <p className="text-sm text-[#5A6578]">Temporarily disable public access</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl mb-6">
              <div>
                <p className="font-medium text-[#0B1220]">Enable Maintenance Mode</p>
                <p className="text-sm text-[#5A6578]">Only admins can access the site</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
              />
            </div>

            {settings.maintenanceMode && (
              <div>
                <Label>Maintenance Message</Label>
                <Textarea
                  value={settings.maintenanceMessage}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  placeholder="Message to display to visitors"
                  className="mt-1"
                  rows={4}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
