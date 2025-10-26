import { useState, useMemo, memo } from 'react';
import { projects } from '../../data/projects';
import type { Project } from '../../types';
import Icon from '../ui/Icon';
import Card from '../ui/Card';
import Chip from '../ui/Chip';
import ProjectDialog from '../ui/ProjectDialog';

// FIX: Memoize filter options to prevent unnecessary re-renders
const filters = [
  { id: 'All', label: 'الكل' },
  { id: 'أساسي', label: 'المشاريع الأساسية' },
  { id: 'مجتمعي', label: 'المشاريع المجتمعية' },
  { id: 'مؤسسي', label: 'المشاريع المؤسسية' }
];

// FIX: Memoize project card component
const ProjectCard = memo(({ project, index }: { project: Project; index: number }) => (
  <div 
    key={project.id}
    className="animate-fadeIn"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          {/* Category Badge */}
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-brand-100 text-brand-700 mb-3">
            {project.category}
          </div>
          
          {/* Title and Description */}
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            {project.desc}
          </p>
          
          {/* Meta Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Icon name="Users" size={16} />
              <span>{project.beneficiaries.toLocaleString()} مستفيد</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="CalendarDays" size={16} />
              <span>{project.status}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="MapPin" size={16} />
              <span>{project.location}</span>
            </div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="flex flex-col items-end gap-3">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            متاح
          </div>
        </div>
      </div>
      
      {/* CTA Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setActiveProject(project)}
          className="inline-flex items-center gap-2 border border-brand-600 text-brand-600 hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-out cursor-pointer select-none"
          aria-haspopup="dialog"
        >
          <Icon name="ChevronLeft" size={16} />
          تفاصيل المشروع
        </button>
      </div>
    </Card>
  </div>
));

ProjectCard.displayName = 'ProjectCard';

function Projects() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // FIX: Memoize filtered projects to prevent unnecessary recalculations
  const filteredProjects = useMemo(() => 
    selectedFilter === 'All' 
      ? projects 
      : projects.filter(project => project.category === selectedFilter),
    [selectedFilter]
  );

  // FIX: Memoize projects list to prevent unnecessary re-renders
  const projectsList = useMemo(() => 
    filteredProjects.map((project, index) => (
      <ProjectCard key={project.id} project={project} index={index} />
    )), [filteredProjects]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-brand-600 to-brand-500 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              المشاريع
            </h1>
            <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto">
              اكتشف مشاريعنا المتنوعة واختر المشروع الذي يناسب اهتماماتك للمشاركة في صنع الأثر
            </p>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {filters.map((filter) => (
              <Chip
                key={filter.id}
                selected={selectedFilter === filter.id}
                onClick={() => setSelectedFilter(filter.id)}
              >
                {filter.label}
              </Chip>
            ))}
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {projectsList}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد مشاريع في هذه الفئة</p>
            </div>
          )}
        </div>
      </section>

      {/* Project Dialog */}
      <ProjectDialog 
        project={activeProject} 
        open={!!activeProject} 
        onClose={() => setActiveProject(null)} 
      />
    </div>
  );
}

export default memo(Projects);
