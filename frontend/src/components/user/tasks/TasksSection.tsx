import React from 'react';
import TaskCard from './TaskCard';

type TaskStatus = 'جديدة' | 'قيد التنفيذ' | 'معلقة';

interface Task {
  id: number;
  status: TaskStatus;
  title: string;
  org: string;
  description: string;
  date: string;
  duration: string;
  location: string;
}

const tasks: Task[] = [
  {
    id: 1,
    status: 'جديدة',
    title: 'تطوير صفحة تعريفية لحملة الأيتام',
    org: 'جمعية تمكين الشباب',
    description: 'بناء واجهة تفاعلية لبوابة تسجيل المتطوعين وربطها بقاعدة بيانات.',
    date: '٧ ربيع الآخر',
    duration: 'أسبوعان',
    location: 'مقر الجمعية',
  },
  {
    id: 2,
    status: 'قيد التنفيذ',
    title: 'نظام متابعة المتطوعين',
    org: 'جمعية تمكين الشباب',
    description: 'تصميم Dashboard يعرض ساعات التطوع ومجالات مشاركة الأعضاء.',
    date: '٢٢ ربيع الأول',
    duration: '٣ أسابيع',
    location: 'مقر الجمعية',
  },
  {
    id: 3,
    status: 'معلقة',
    title: 'منصة تفاعلية للدورات التدريبية',
    org: 'جمعية الثقافة والفنون',
    description: 'تطوير موقع يعرض الدورات القادمة مع إمكانية التسجيل الإلكتروني.',
    date: '٢٢ صفر',
    duration: 'أسبوع',
    location: 'مقر الجمعية',
  },
  {
    id: 4,
    status: 'قيد التنفيذ',
    title: 'تطوير صفحة تعريفية لحملة الأيتام',
    org: 'جمعية رعاية الأيتام',
    description: 'إنشاء موقع بسيط يوضح تفاصيل حملة كفالة الأيتام مع زر تبرع إلكتروني.',
    date: '٢٨ ربيع الأول',
    duration: '٤ أسابيع',
    location: 'مقر الجمعية',
  },
];

const TasksSection: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 border border-[#e3d1d8] h-full flex flex-col"
      dir="rtl"
    >
      <div className="flex items-center justify-center gap-3 mb-5">
        <div className="flex-1 h-px bg-[#e2c8cc]" />
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#f9d476] text-[#3f3b3b] text-lg">
            ✓
          </span>
          <h2 className="text-2xl font-bold text-gray-900">المهام الحالية</h2>
        </div>
        <div className="flex-1 h-px bg-[#e2c8cc]" />
      </div>

      <div className="space-y-3 flex-1">
        {tasks.map((task) => (
          <TaskCard key={task.id} {...task} />
        ))}
      </div>

      <div className="mt-4 text-center text-sm font-medium text-[#4e4a4b]">
        عرض المزيد
      </div>
    </div>
  );
};

export default TasksSection;
