import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode;
  title: string;
  desc: string;
  ctaLabel: string;
  href: string;
}

export default function FeatureCard({ icon, title, desc, ctaLabel, href }: FeatureCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-lg transition-transform duration-300 ease-out animate-fadeIn">
      {icon && (
        <div className="mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 leading-relaxed">
        {desc}
      </p>
      <a
        href={href}
        className="inline-block bg-brand-600 hover:bg-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 transition-all duration-200 ease-out active:scale-95 text-white font-medium px-6 py-3 rounded-lg cursor-pointer select-none"
      >
        {ctaLabel}
      </a>
    </div>
  );
}
