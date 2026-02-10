import { useState, useEffect } from 'react';
import { Save, RotateCcw, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getTheme, updateTheme, defaultTheme } from '@/lib/dataStore';
import { toast } from 'sonner';
import type { Theme } from '@/types';

export default function AdminTheme() {
  const [theme, setTheme] = useState<Theme>(getTheme());
  const [previewTheme, setPreviewTheme] = useState<Theme>(getTheme());

  useEffect(() => {
    setPreviewTheme(theme);
  }, [theme]);

  const handleSave = () => {
    updateTheme(theme);
    toast.success('Theme saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset to default theme?')) {
      setTheme(defaultTheme);
      updateTheme(defaultTheme);
      toast.success('Theme reset to defaults');
    }
  };

  const updateColor = (field: keyof Theme, value: string) => {
    setTheme({ ...theme, [field]: value });
  };

  const colorInputs: { key: keyof Theme; label: string; description: string }[] = [
    { key: 'primaryColor', label: 'Primary Color', description: 'Used for headings and main text' },
    { key: 'secondaryColor', label: 'Secondary Color', description: 'Used for secondary text and labels' },
    { key: 'accentColor', label: 'Accent Color', description: 'Used for buttons, links, and highlights' },
    { key: 'backgroundColor', label: 'Background Color', description: 'Main page background' },
    { key: 'textColor', label: 'Text Color', description: 'Default body text color' },
  ];

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] mb-2">Theme Editor</h1>
          <p className="text-[#5A6578]">Customize your website colors and appearance.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Settings */}
        <div className="space-y-6">
          <div className="admin-card">
            <div className="flex items-center space-x-3 mb-6">
              <Palette className="w-6 h-6 text-[#1D4ED8]" />
              <h3 className="text-lg font-bold text-[#0B1220]">Color Palette</h3>
            </div>
            
            <div className="space-y-6">
              {colorInputs.map((input) => (
                <div key={input.key}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-medium text-[#0B1220]">{input.label}</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={theme[input.key]}
                        onChange={(e) => updateColor(input.key, e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0"
                      />
                      <Input
                        type="text"
                        value={theme[input.key]}
                        onChange={(e) => updateColor(input.key, e.target.value)}
                        className="w-28 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-[#5A6578]">{input.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-4">Font Family</h3>
            <div className="flex items-center space-x-4">
              <select
                value={theme.fontFamily}
                onChange={(e) => updateColor('fontFamily', e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-[rgba(11,18,32,0.14)] bg-white text-[#0B1220] focus:border-[#1D4ED8] focus:ring-1 focus:ring-[#1D4ED8] outline-none"
              >
                <option value="Inter">Inter (Modern)</option>
                <option value="Space Grotesk">Space Grotesk (Bold)</option>
                <option value="Poppins">Poppins (Friendly)</option>
                <option value="Roboto">Roboto (Clean)</option>
                <option value="Open Sans">Open Sans (Classic)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="admin-card">
            <h3 className="text-lg font-bold text-[#0B1220] mb-6">Live Preview</h3>
            
            <div 
              className="rounded-2xl p-8 transition-all duration-300"
              style={{ backgroundColor: previewTheme.backgroundColor }}
            >
              {/* Hero Preview */}
              <div className="mb-8">
                <span 
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: previewTheme.secondaryColor }}
                >
                  PREVIEW SECTION
                </span>
                <h1 
                  className="text-3xl font-bold mt-2 mb-4"
                  style={{ 
                    color: previewTheme.primaryColor,
                    fontFamily: previewTheme.fontFamily 
                  }}
                >
                  Sample Heading
                </h1>
                <p 
                  className="text-base leading-relaxed mb-6"
                  style={{ color: previewTheme.textColor }}
                >
                  This is how your website content will look with the selected theme colors and font.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-3 rounded-full text-white font-medium transition-all"
                    style={{ backgroundColor: previewTheme.accentColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-6 py-3 rounded-full font-medium border transition-all"
                    style={{ 
                      borderColor: previewTheme.primaryColor,
                      color: previewTheme.primaryColor 
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              {/* Card Preview */}
              <div 
                className="rounded-2xl p-6"
                style={{ backgroundColor: 'white' }}
              >
                <div 
                  className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${previewTheme.accentColor}20` }}
                >
                  <Palette style={{ color: previewTheme.accentColor }} />
                </div>
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: previewTheme.primaryColor }}
                >
                  Card Title
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: previewTheme.secondaryColor }}
                >
                  This is a preview of how cards will appear on your website.
                </p>
              </div>
            </div>
          </div>

          <div className="admin-card bg-gradient-to-br from-[#1D4ED8]/10 to-[#1D4ED8]/5">
            <h3 className="text-lg font-bold text-[#0B1220] mb-2">Theme Tips</h3>
            <ul className="space-y-2 text-sm text-[#5A6578]">
              <li>• Choose colors that match your brand identity</li>
              <li>• Ensure good contrast for readability</li>
              <li>• Use the accent color sparingly for emphasis</li>
              <li>• Test your theme on different devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
