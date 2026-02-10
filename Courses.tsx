import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Check, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getCourses } from '@/lib/dataStore';

export default function Courses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const courses = getCourses().filter((c) => c.published);
  
  const categories = ['All', ...Array.from(new Set(courses.map((c) => c.category)))];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#F6F7F9] pt-24 lg:pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="eyebrow block mb-4">COURSES</span>
          <h1 className="text-[clamp(36px,4.5vw,64px)] font-bold text-[#0B1220] leading-tight mb-4">
            Our Programs
          </h1>
          <p className="text-lg text-[#5A6578]">
            Structured courses designed to help you succeed in your armed forces journey.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5A6578]" />
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-full border-[rgba(11,18,32,0.14)] focus:border-[#1D4ED8] focus:ring-[#1D4ED8]"
            />
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-[#5A6578] flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#1D4ED8] text-white'
                    : 'bg-white text-[#5A6578] hover:bg-[#1D4ED8]/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-[28px] overflow-hidden border border-[rgba(11,18,32,0.08)] shadow-[0_18px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)] transition-all duration-300"
              >
                <div className="h-48 bg-gradient-to-br from-[#1D4ED8]/20 to-[#1D4ED8]/5 flex items-center justify-center">
                  <span className="text-6xl font-bold text-[#1D4ED8]/20">
                    {course.title.charAt(0)}
                  </span>
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-[#1D4ED8]/10 text-[#1D4ED8] text-xs font-semibold rounded-full">
                      {course.category}
                    </span>
                    <span className="flex items-center text-sm text-[#5A6578]">
                      <Clock className="w-4 h-4 mr-1" />
                      {course.duration}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0B1220] mb-3">
                    {course.title}
                  </h2>
                  <p className="text-[#5A6578] text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {course.features.slice(0, 3).map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center text-sm text-[#5A6578]"
                      >
                        <Check className="w-4 h-4 text-[#1D4ED8] mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-4 border-t border-[rgba(11,18,32,0.08)]">
                    <span className="text-xl font-bold text-[#1D4ED8]">
                      {course.price}
                    </span>
                    <Link to="/#contact">
                      <Button className="btn-primary">Enroll Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-[#5A6578]">No courses found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
