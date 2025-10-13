import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { services } from '../../data/services';
import type { Service } from '../../types';
import Icon from '../ui/Icon';
import Chip from '../ui/Chip';
import ServiceCard from '../ui/ServiceCard';
import ServiceDialog from '../ui/ServiceDialog';

export default function Services() {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [activeService, setActiveService] = useState<Service | null>(null);
  const navigate = useNavigate();

  const filters = [
    { id: 'All', label: 'الكل' },
    { id: 'متاحة', label: 'الخدمات المتاحة' },
    { id: 'قادمة', label: 'الخدمات القادمة' },
    { id: 'مكتملة', label: 'الخدمات المكتملة' },
  ];

  const filteredServices = selectedFilter === 'All' 
    ? services 
    : services.filter(service => service.status === selectedFilter);

  const handleRegister = (_service: Service) => {
    // Navigate to volunteers page
    navigate('/volunteers');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative isolate text-white bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500 py-20 md:py-28">
        {/* Vignette overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            background:
              'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,.18), transparent 60%)'
          }}
        />
        
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-slideUp">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              الخدمات
            </h1>
            <p className="mt-4 mx-auto flex items-center justify-center gap-2 max-w-2xl text-base md:text-lg text-white/85">
              <Icon name="Lightbulb" size={20} style={{ color: "#DFC775" }} aria-hidden="true" className="shrink-0" />
              اكتشف خدماتنا المتنوعة وانضم إلى مبادراتنا التكافلية
            </p>
          </div>
        </div>
      </section>

      {/* Filter Chips */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
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

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service, index) => (
              <div 
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ServiceCard
                  service={service}
                  onDetails={setActiveService}
                  onRegister={handleRegister}
                />
              </div>
            ))}
          </div>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">لا توجد خدمات في هذه الفئة</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Dialog */}
      <ServiceDialog 
        service={activeService} 
        open={!!activeService} 
        onClose={() => setActiveService(null)} 
      />
    </div>
  );
}
