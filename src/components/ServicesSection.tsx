import { mockServices } from '../data/home';
import Container from './Container';
import ServiceCard from './ServiceCard';

export default function ServicesSection() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <Container>
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
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
