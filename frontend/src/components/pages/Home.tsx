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
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Hero />

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      شارك في مشروع تكافلي
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      اكتشف مشاريعنا المتنوعة واختر المشروع الذي يناسب اهتماماتك للمشاركة في صنع الأثر
                    </p>
                  </div>
                  <Icon name="HandHeart" className="text-[#DFC775] ml-4 flex-shrink-0" size={32} />
                </div>
                <Button variant="primary" href="/projects">
                  المشاريع
                </Button>
              </Card>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
              <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      اقترح مبادرة تكافلية
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      شاركنا أفكارك لمبادرات تكافلية جديدة يمكن أن تُحدث أثرًا إيجابيًا في المجتمع
                    </p>
                  </div>
                  <Icon name="Lightbulb" className="text-[#DFC775] ml-4 flex-shrink-0" size={32} />
                </div>
                <Button variant="outline" href="/suggest">
                  شارك اقتراحك
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 bg-gray-50 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدماتنا الأساسية المؤثّرة
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockServices.map((service, index) => (
              <div
                key={service.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
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
                      className="text-[#DFC775] ml-4 flex-shrink-0"
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
