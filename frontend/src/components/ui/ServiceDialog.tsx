import { X, Star, Heart, ArrowRight, ShoppingBag, MapPin, CalendarDays, Building } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import { participationSuccessCopy } from '../../utils/notifyParticipationSuccess';
import ParticipationSuccessDialog from '../feedback/ParticipationSuccessDialog';
import type { Service } from '../../types';
import Modal from './Modal';
import Badge from './Badge';
import Tag from './Tag';
import ProgressBar from './ProgressBar';

interface ServiceDialogProps {
  service: Service | null;
  open: boolean;
  onClose: () => void;
}

export default function ServiceDialog({ service, open, onClose }: ServiceDialogProps) {
  const { success } = useToast();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  if (!service || !service.details) return null;

  const { details } = service;

  const handleJoinService = () => {
    // Simulate API call success
    setTimeout(() => {
      success(participationSuccessCopy);
      setShowSuccessDialog(true);
    }, 100);
    
    onClose(); // Close dialog first
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'متاحة':
        return 'success';
      case 'قادمة':
        return 'info';
      case 'مكتملة':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} labelledById="service-title">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6 animate-slideUp">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 id="service-title" className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {service.title}
                </h1>
                <ShoppingBag 
                  size={24} 
                  className="text-[#DFC775] flex-shrink-0" 
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant(service.status)}>
                  {service.status}
                </Badge>
                {service.category && (
                  <Badge variant="default">
                    {service.category}
                  </Badge>
                )}
              </div>
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

          {/* Service Summary */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">وصف الخدمة</h2>
            <p className="text-gray-700 leading-8">
              {details.summary}
            </p>
          </div>

          {/* Meta Information */}
          {details.meta && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.meta.map((meta, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {meta.icon === 'MapPin' && <MapPin size={16} className="text-gray-500" />}
                    {meta.icon === 'CalendarDays' && <CalendarDays size={16} className="text-gray-500" />}
                    {meta.icon === 'Building' && <Building size={16} className="text-gray-500" />}
                    <div>
                      <span className="text-gray-500">{meta.label}:</span>
                      <span className="text-gray-900 font-medium mr-1">{meta.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-100 mt-6"></div>

          {/* Target Audiences */}
          {details.audiences && (
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
          )}

          <div className="border-t border-gray-100 mt-6"></div>

          {/* Requirements */}
          {details.requirements && (
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
          )}

          <div className="border-t border-gray-100 mt-6"></div>

          {/* Volunteers Progress */}
          {details.volunteers && (
            <section className="mt-8 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 mb-3">عدد المتطوعين</h2>
              <ProgressBar 
                current={details.volunteers.current} 
                total={details.volunteers.need}
              />
            </section>
          )}

          {/* Footer CTA Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleJoinService}
                className="w-full rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2 flex items-center justify-center gap-2"
              >
                شارك في الخدمة
                <ArrowRight size={16} />
              </button>
              <button className="w-full rounded-full border border-[#DFC775] text-[#DFC775] hover:bg-[#FFF5D6] py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2 flex items-center justify-center gap-2">
                تبرع للخدمة
                <Heart size={16} />
              </button>
            </div>
          </div>
        </div>
      </Modal>
      
      <ParticipationSuccessDialog
        type="service"
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
      />
    </>
  );
}
