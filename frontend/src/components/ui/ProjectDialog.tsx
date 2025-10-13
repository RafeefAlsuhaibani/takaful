import { X, Star, Heart, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { participationSuccessCopy } from '../../utils/notifyParticipationSuccess';
import ParticipationSuccessDialog from '../feedback/ParticipationSuccessDialog';
import type { Project } from '../../types';
import Modal from './Modal';
import Badge from './Badge';
import Tag from './Tag';

interface ProjectDialogProps {
  project: Project | null;
  open: boolean;
  onClose: () => void;
}

export default function ProjectDialog({ project, open, onClose }: ProjectDialogProps) {
  const { success } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  if (!project || !project.details) return null;

  const { details } = project;

  const handleJoinProject = () => {
    // Simulate API call success
    setTimeout(() => {
      success(participationSuccessCopy);
      setShowSuccessDialog(true);
    }, 100);
    
    onClose(); // Close dialog first
  };

  return (
    <>
      <Modal open={open} onClose={onClose} labelledById="project-title">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 animate-slideUp">
            <div className="flex-1">
              <h1 id="project-title" className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                {project.title}
              </h1>
              <Badge variant="warning">
                {project.category}
              </Badge>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 focus-visible:ring-2 ring-brand-600 transition-colors duration-200"
              aria-label="إغلاق"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Project Summary */}
          <div className="mb-6">
            <p className="text-gray-700 leading-8">
              {details.summary}
            </p>
          </div>

          <div className="border-t border-gray-100 mt-6"></div>

          {/* What the Project Includes */}
          <section className="mt-8 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-3">مايشمله المشروع</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {details.includes.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star 
                    size={16} 
                    className="shrink-0 mt-1" 
                    style={{ color: "#DFC775" }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-100 mt-6"></div>

          {/* Target Audiences */}
          <section className="mt-8 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-3">الفئات المستهدفة</h2>
            <div className="flex flex-wrap gap-2">
              {details.audiences.map((audience, index) => (
                <Tag key={index}>
                  {audience}
                </Tag>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-100 mt-6"></div>

          {/* Requirements */}
          <section className="mt-8 animate-fadeIn">
            <h2 className="text-lg font-bold text-gray-900 mb-3">متطلبات التنفيذ</h2>
            <div className="space-y-3">
              {details.requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Star 
                    size={16} 
                    className="shrink-0 mt-1" 
                    style={{ color: "#DFC775" }}
                    aria-hidden="true"
                  />
                  <span className="text-gray-700 text-sm">{requirement}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer CTA Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleJoinProject}
                className="w-full rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2 flex items-center justify-center gap-2"
              >
                شارك في المشروع
                <ArrowRight size={16} />
              </button>
              <button className="w-full rounded-full border border-brand-600 text-brand-600 hover:bg-brand-50 py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2 flex items-center justify-center gap-2">
                تبرع للمشروع
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      
      <ParticipationSuccessDialog
        type="project"
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />
    </>
  );
}
