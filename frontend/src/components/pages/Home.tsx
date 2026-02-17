import { useEffect, useState } from 'react';
import { mockServices } from '../../data/home';
import Icon from '../ui/Icon';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Hero from '../ui/Hero';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-pulseSoft rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <Hero />

      <section className="py-10 sm:py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <Card className="p-4 sm:p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      شارك في مشروع تكافلي
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      اكتشف مشاريعنا المتنوعة واختر المشروع الذي يناسب اهتماماتك للمشاركة في صنع الأثر
                    </p>
                  </div>
                  <Icon name="HandHeart" className="text-[#DFC775] sm:ml-4 flex-shrink-0" size={28} />
                </div>
                <Button variant="primary" href="/projects">
                  المشاريع
                </Button>
              </Card>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Card className="p-4 sm:p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                      اقترح مبادرة تكافلية
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                      شاركنا أفكارك لمبادرات تكافلية جديدة يمكن أن تُحدث أثرًا إيجابيًا في المجتمع
                    </p>
                  </div>
                  <Icon name="Lightbulb" className="text-[#DFC775] sm:ml-4 flex-shrink-0" size={28} />
                </div>
                <Button variant="outline" href="/suggest">
                  شارك اقتراحك
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-10 sm:py-12 md:py-16 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fadeIn">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              خدماتنا الأساسية المؤثّرة
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {mockServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="p-4 sm:p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg h-full">
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                        {service.desc}
                      </p>
                    </div>
                    <Icon
                      name={
                        service.id === 'saqya' ? 'Droplets' :
                          service.id === 'balsam' ? 'Stethoscope' :
                            service.id === 'transport' ? 'Ambulance' : 'Users'
                      }
                      className="text-[#DFC775] sm:ml-4 flex-shrink-0"
                      size={24}
                    />
                  </div>
                  <Button variant="outline" size="sm" href={service.href}>
                    {service.ctaLabel}
                  </Button>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
