import React from 'react';
import { MapPin, Clock3, CalendarClock } from 'lucide-react';

type TaskStatus = 'جديدة' | 'قيد التنفيذ' | 'معلقة';

interface TaskCardProps {
  status: TaskStatus;
  title: string;
  org: string;
  description: string;
  date: string;
  duration: string;
  location: string;
}

const statusMeta: Record<
  TaskStatus,
  {
    icon: string;
    pillClass: string;
    primaryLabel: string;
  }
> = {
  جديدة: {
    icon: '✨',
    pillClass: 'bg-[#e5f6ea] text-[#496a51] border-[#b7ddc1]',
    primaryLabel: 'ابدأ الآن',
  },
  'قيد التنفيذ': {
    icon: '⏳',
    pillClass: 'bg-[#fdf0d8] text-[#495b6a] border-[#f0d29e]',
    primaryLabel: 'استئناف',
  },
  معلقة: {
    icon: '😊',
    pillClass: 'bg-[#f7eee1] text-[#6a5c49] border-[#e2c9a2]',
    primaryLabel: 'استئناف',
  },
};

const TaskCard: React.FC<TaskCardProps> = ({
  status,
  title,
  org,
  description,
  date,
  duration,
  location,
}) => {
  const meta = statusMeta[status];

  return (
    <div
      className="bg-[#faf6f7] border border-[#f0e2e6] shadow-sm rounded-2xl p-4 md:p-5 flex flex-col gap-3"
      dir="rtl"
    >
      <div className="flex flex-row-reverse items-start gap-3">
        <div className="text-xl" aria-hidden>
          {meta.icon}
        </div>

        <div className="flex-1 text-center space-y-1">
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full border text-[10px] font-medium ${meta.pillClass}`}
          >
            {status}
          </span>
          <p className="text-base md:text-lg font-bold bg-[linear-gradient(270deg,#8d2e46_0%,#963b40_39%,#e4b006_100%)] bg-clip-text text-transparent leading-snug">
            {title}
          </p>
          <p className="text-[12px] font-semibold text-[#4e4a4b]">{org}</p>
        </div>
      </div>

      <p className="text-[11px] text-[#4e4a4b] text-center leading-relaxed">{description}</p>

      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px]" dir="rtl">
        <div className="flex flex-wrap items-center gap-3 text-[#6e6d6d]">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarClock className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock3 className="w-4 h-4" />
            <span>{duration}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#4e4a4b]">
          <button
            className="px-4 py-1.5 rounded-md font-semibold bg-[linear-gradient(90deg,rgba(141,46,70,0.7)_0%,rgba(228,177,6,0.7)_100%)]"
            type="button"
          >
            {meta.primaryLabel}
          </button>
          <button
            className="px-4 py-1.5 rounded-md font-semibold border border-[#6e6d6d] hover:bg-gray-50 transition-colors"
            type="button"
          >
            انسحاب
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
