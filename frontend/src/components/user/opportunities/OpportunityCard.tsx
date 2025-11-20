import React from 'react';
import { MapPin, Clock3, Users } from 'lucide-react';

type Urgency = 'مستعجلة' | 'شبه مستعجلة' | 'عادية';

interface OpportunityCardProps {
  title: string;
  org: string;
  location: string;
  urgency: Urgency;
  duration: string;
  people: string;
}

const urgencyStyles: Record<Urgency, string> = {
  مستعجلة: 'bg-[#fde1e1] text-[#c54030] border-[#f4b1a7]',
  'شبه مستعجلة': 'bg-[#f8e8c8] text-[#735727] border-[#e4c48d]',
  عادية: 'bg-[#e8f3ea] text-[#496a51] border-[#bcd8c2]',
};

const OpportunityCard: React.FC<OpportunityCardProps> = ({
  title,
  org,
  location,
  urgency,
  duration,
  people,
}) => {
  return (
    <div
      className="bg-[#faf6f7] border border-[#e6d2d7] rounded-2xl p-4 shadow-sm flex items-center gap-4 flex-row-reverse"
      dir="rtl"
    >
      <div className="w-[105px] h-[72px] border border-[#e6d2d7] rounded-[10px] bg-white flex items-center justify-center text-[12px] text-[#6e6d6d] flex-shrink-0">
        شعار الجمعية
      </div>

      <div className="flex-1 space-y-1">
        <p className="text-[15px] font-medium text-[#4e4a4b] leading-snug">{title}</p>

        <div className="text-[11px] text-[#6e6d6d] flex items-center flex-wrap gap-1">
          <span>{org}</span>
          <span className="text-[#c4b9bb]">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {location}
          </span>
          <span className="text-[#c4b9bb]">•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {people}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#6e6d6d]">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[10px] font-medium ${urgencyStyles[urgency]}`}
          >
            {urgency}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 className="w-4 h-4" />
            {duration}
          </span>
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          type="button"
          className="px-4 py-1.5 rounded-[10px] bg-[#a54c63] text-white text-[13px] font-medium hover:brightness-110 transition"
        >
          التقدم الآن
        </button>
      </div>
    </div>
  );
};

export default OpportunityCard;
