import type { Service } from '../data/home';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 hover:bg-brand-50 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg transition-all duration-300 ease-out border border-gray-100 animate-fadeIn">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        {service.title}
      </h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">
        {service.desc}
      </p>
      <a
        href={service.href}
        className="inline-block border border-brand-600 text-brand-600 hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 font-medium px-4 py-2 rounded-lg transition-all duration-200 ease-out cursor-pointer select-none"
      >
        {service.ctaLabel}
      </a>
    </div>
  );
}
