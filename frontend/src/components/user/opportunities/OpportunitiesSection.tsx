import React from 'react';
import OpportunityCard from './OpportunityCard';

const opportunities = [
  {
    id: 1,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'جمعية الزاد',
    location: 'مقر الجمعية',
    urgency: 'مستعجلة' as const,
    duration: 'أسبوعين',
    people: '٣ أشخاص',
  },
  {
    id: 2,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'جمعية العطاء التنموية',
    location: 'المقر - عنيزة',
    urgency: 'شبه مستعجلة' as const,
    duration: '١٠ أيام',
    people: 'شخصين',
  },
  {
    id: 3,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'مؤسسة سبل الخير',
    location: 'المقر - عنيزة',
    urgency: 'عادية' as const,
    duration: '٣ أسابيع',
    people: 'شخص واحد',
  },
];

const OpportunitiesSection: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 border border-[#e3d1d8]"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span role="img" aria-label="heart">
            💛
          </span>
          فرص تطوعية مقترحة
        </h2>
      </div>

      <div className="h-px bg-gray-300 w-full mb-4" />

      <div className="space-y-3">
        {opportunities.map((opportunity) => (
          <OpportunityCard key={opportunity.id} {...opportunity} />
        ))}
      </div>

      <div className="mt-4 text-center text-sm font-medium text-[#4e4a4b]">المزيد</div>
    </div>
  );
};

export default OpportunitiesSection;
