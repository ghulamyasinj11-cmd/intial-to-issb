import { useState } from 'react';
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { getCourses, addCourse, updateCourse, deleteCourse } from '@/lib/dataStore';
import { toast } from 'sonner';
import type { Course } from '@/types';

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(getCourses());
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fullDescription: '',
    duration: '',
    price: '',
    category: '',
    features: [''],
    published: true,
  });

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    setEditingCourse(null);
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      duration: '',
      price: '',
      category: '',
      features: [''],
      published: true,
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      fullDescription: course.fullDescription,
      duration: course.duration,
      price: course.price,
      category: course.category,
      features: course.features,
      published: course.published,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      deleteCourse(id);
      setCourses(getCourses());
      toast.success('Course deleted successfully');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const courseData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
    };
    
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      toast.success('Course updated successfully');
    } else {
      addCourse(courseData);
      toast.success('Course added successfully');
    }
    
    setCourses(getCourses());
    setIsDialogOpen(false);
  };

  const togglePublish = (course: Course) => {
    updateCourse(course.id, { published: !course.published });
    setCourses(getCourses());
    toast.success(course.published ? 'Course unpublished' : 'Course published');
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] mb-2">Courses</h1>
          <p className="text-[#5A6578]">Manage your courses and programs.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAdd} className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
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
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-xl"
                  rows={2}
                  required
                />
              </div>
              <div>
                <Label htmlFor="fullDescription">Full Description</Label>
                <Textarea
                  id="fullDescription"
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="rounded-xl"
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="rounded-xl"
                    placeholder="e.g., 8 Weeks"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="rounded-xl"
                    placeholder="e.g., PKR 15,000"
                    required
                  />
                </div>
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
              <div>
                <Label>Features</Label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="rounded-xl"
                        placeholder={`Feature ${index + 1}`}
                      />
                      {formData.features.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addFeature}
                    className="rounded-xl"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </Button>
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
                {editingCourse ? 'Update Course' : 'Add Course'}
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
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-3 rounded-xl border-[rgba(11,18,32,0.14)]"
        />
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-[28px] border border-[rgba(11,18,32,0.08)] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F6F7F9]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Duration</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0B1220]">Status</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[#0B1220]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(11,18,32,0.08)]">
              {filteredCourses.map((course) => (
                <tr key={course.id} className="hover:bg-[#F6F7F9]/50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#0B1220]">{course.title}</p>
                    <p className="text-sm text-[#5A6578] line-clamp-1">{course.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#5A6578]">{course.duration}</td>
                  <td className="px-6 py-4 text-sm text-[#0B1220] font-medium">{course.price}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => togglePublish(course)}
                      className={`flex items-center space-x-1 text-sm ${
                        course.published ? 'text-green-600' : 'text-[#5A6578]'
                      }`}
                    >
                      {course.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      <span>{course.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(course)}
                        className="text-[#1D4ED8] hover:bg-[#1D4ED8]/10"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course.id)}
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
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5A6578]">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
