import React from 'react';
import SidebarLayout from '../../ui/Sidebar';
import { MapPin, Clock3, Users, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TaskStatus = 'جديدة' | 'قيد التنفيذ' | 'معلقة';

type Task = {
  id: number;
  status: TaskStatus;
  title: string;
  org: string;
  description: string;
  date: string;
  duration: string;
  location: string;
};

type OpportunityUrgency = 'مستعجلة' | 'شبه مستعجلة' | 'عادية';

type Opportunity = {
  id: number;
  title: string;
  org: string;
  category: string; // تطوير الأنظمة / تطوير المواقع / تصميم الواجهات
  location: string;
  urgency: OpportunityUrgency;
  duration: string;
  people: string;
  logoUrl: string; // شعار الجمعية من النت
};

// -------------- البيانات مطابقه لتصميم أنيما --------------

const tasks: Task[] = [
  {
    id: 1,
    status: 'جديدة',
    title: 'تطوير صفحة تعريفية لحملة الأيتام',
    org: 'جمعية تمكين الشباب',
    description:
      'بناء واجهة تفاعلية لبوابة تسجيل المتطوعين وربطها بقاعدة بيانات.',
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
    description:
      'تطوير موقع يعرض الدورات القادمة مع إمكانية التسجيل الإلكتروني.',
    date: '٢٢ صفر',
    duration: 'شهر',
    location: 'مقر الجمعية',
  },
  {
    id: 4,
    status: 'قيد التنفيذ',
    title: 'تطوير صفحة تعريفية لحملة الأيتام',
    org: 'جمعية رعاية الأيتام',
    description:
      'إنشاء موقع بسيط يوضح تفاصيل حملة كفالة الأيتام مع زر تبرع إلكتروني.',
    date: '٢٨ ربيع الأول',
    duration: 'أسبوع',
    location: 'مقر الجمعية',
  },
];

const opportunities: Opportunity[] = [
  {
    id: 1,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'جمعية الزاد',
    category: 'تطوير الأنظمة',
    location: 'مقر الجمعية',
    urgency: 'مستعجلة',
    duration: 'أسبوعين',
    people: '٣ أشخاص',
    logoUrl: 'https://c.animaapp.com/2u79Z8fE/img/image-15@2x.png',
  },
  {
    id: 2,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'جمعية العطاء التنموية',
    category: 'تطوير المواقع',
    location: 'المقر - عنيزة',
    urgency: 'شبه مستعجلة',
    duration: '١٠ أيام',
    people: 'شخصين',
    logoUrl: 'https://c.animaapp.com/2u79Z8fE/img/image-17@2x.png',
  },
  {
    id: 3,
    title: 'إنشاء نظام لإدارة طلبات الأسر المستفيدة.',
    org: 'مؤسسة سبل الخير',
    category: 'تصميم الواجهات',
    location: 'المقر - عنيزة',
    urgency: 'عادية',
    duration: '٣ أسابيع',
    people: 'شخص واحد',
    logoUrl: 'https://c.animaapp.com/2u79Z8fE/img/image-15-1@2x.png',
  },
];

// -------------- Helpers للستايل --------------

function statusClasses(status: TaskStatus) {
  switch (status) {
    case 'جديدة':
      return 'bg-[#e5f6ea] text-[#496a51] border-[#b7ddc1]';
    case 'قيد التنفيذ':
      return 'bg-[#fdf0d8] text-[#495b6a] border-[#f0d29e]';
    case 'معلقة':
      return 'bg-[#f7eee1] text-[#6a5c49] border-[#e2c9a2]';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function primaryActionLabel(status: TaskStatus) {
  if (status === 'جديدة') return 'إبداء الأن';
  if (status === 'قيد التنفيذ') return 'استئناف';
  return 'استئناف';
}

function statusEmoji(status: TaskStatus) {
  if (status === 'جديدة') return '✨';
  if (status === 'قيد التنفيذ') return '⏳';
  return '😊';
}

function urgencyClasses(urgency: OpportunityUrgency) {
  switch (urgency) {
    case 'مستعجلة':
      return 'bg-[#fde1e1] text-[#c54030] border-[#f4b1a7]';
    case 'شبه مستعجلة':
      return 'bg-[#f8e8c8] text-[#735727] border-[#e4c48d]';
    case 'عادية':
      return 'bg-[#e8f3ea] text-[#496a51] border-[#bcd8c2]';
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

// -------------- مكوّن عام لسطور الأيقونة + النص --------------

function InfoItem({
  icon: Icon,
  children,
  reverse = false,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${reverse ? 'flex-row-reverse' : ''
        }`}
    >
      <Icon className="w-3 h-3 relative top-[1px]" />
      <span>{children}</span>
    </span>
  );
}

// -------------- كرت المهام (ستايل أنيما) --------------

function TaskCard({ task }: { task: Task }) {
  const badgeClasses = statusClasses(task.status);
  const primaryAction = primaryActionLabel(task.status);
  const emoji = statusEmoji(task.status);

  return (
    <div className="rounded-[25px] bg-[#faf6f7] border border-[#f0e2e6] px-5 py-4 shadow-[0_6px_14px_rgba(0,0,0,0.04)]">
      <div className="flex flex-col gap-1" dir="rtl">
        {/* البادج + العنوان + الإيموجي */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center justify-center px-3 py-[2px] rounded-[999px] border text-[10px] font-normal ${badgeClasses}`}
          >
            {task.status}
          </span>

          <p className="flex-1 text-center text-[15px] font-bold bg-[linear-gradient(270deg,#8d2e46_0%,#963b40_39%,#e4b006_100%)] bg-clip-text text-transparent">
            {task.title}{' '}
            <span className="align-middle text-[15px]">{emoji}</span>
          </p>

          <span className="w-10" />
        </div>

        {/* اسم الجمعية */}
        <p className="text-[13px] font-semibold text-[#4e4a4b] text-center">
          {task.org}
        </p>

        {/* الوصف */}
        <p className="text-[11px] text-[#4e4a4b] text-center leading-relaxed mt-0.5">
          {task.description}
        </p>

        {/* الأزرار + المعلومات */}
        <div className="mt-3 flex items-center justify-between gap-2 text-[11px]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-4 py-1 rounded-md bg-[linear-gradient(90deg,rgba(141,46,70,0.7)_0%,rgba(228,177,6,0.7)_100%)] text-[#4e4a4b] text-[11px] font-semibold hover:brightness-110 transition"
            >
              {primaryAction}
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-md border border-[#6e6d6d] text-[#4e4a4b] text-[11px] font-semibold bg-white hover:bg-gray-50 transition"
            >
              انسحاب
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[#6e6d6d] justify-end">
            <InfoItem icon={MapPin} reverse>
              {task.location}
            </InfoItem>
            <InfoItem icon={CalendarClock} reverse>
              {task.date}
            </InfoItem>
            <InfoItem icon={Clock3} reverse>
              {task.duration}
            </InfoItem>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------- كرت الفرص (مقارب لـ OtherOpportunities) --------------

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const urgencyBadge = urgencyClasses(opportunity.urgency);

  return (
    <div
      className="rounded-2xl bg-[#faf6f7] border border-[#e6d2d7] px-4 py-3 shadow-[0_6px_14px_rgba(0,0,0,0.04)]"
      dir="rtl"
    >
      <div className="flex items-center gap-4">
        {/* الشعار – يمين الكارد داخل إطار أبيض */}
        <div className="w-[105px] h-[72px] rounded-[10px] border border-[#e6d2d7] bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={opportunity.logoUrl}
            alt={opportunity.org}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* النصوص */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col items-start gap-0.5 text-right">
              <p className="text-[15px] font-medium text-[#4e4a4b]">
                {opportunity.title}
              </p>
              <p className="text-[13px] text-[#a54c62cc] font-medium">
                {opportunity.category}
              </p>
              <p className="text-[11px] text-[#6e6d6d]">{opportunity.org}</p>
            </div>

            <span
              className={`px-3 py-[2px] rounded-[999px] border text-[10px] font-normal ${urgencyBadge}`}
            >
              {opportunity.urgency}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-[#6e6d6d]">
            <InfoItem icon={Users} reverse>
              {opportunity.people}
            </InfoItem>

            <InfoItem icon={MapPin} reverse>
              {opportunity.location}
            </InfoItem>

            <InfoItem icon={Clock3} reverse>
              {opportunity.duration}
            </InfoItem>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            type="button"
            className="px-5 py-2 rounded-[10px] bg-[#a54c63] text-white text-[13px] font-medium hover:brightness-110 transition"
          >
            التقدم الأن
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------- كرت الحديث (من تصميمك في أنيما) --------------

function HadithCard() {
  return (
    <section className="rounded-[25px] shadow-[2px_-2px_6px_rgba(0,0,0,0.06),8px_-7px_11px_rgba(0,0,0,0.04)] bg-[#faf6f6] px-6 py-6 flex items-center justify-center">
      <p className="w-full max-w-[461px] font-semibold text-[#4e4a4b] text-[16px] md:text-[18px] text-center leading-[1.8] [direction:rtl] font-['Cairo',Helvetica]">
        قال النبي ﷺ : “ إن قامت الساعة وفي يد أحدكم فسيلة، فإن استطاع أن لا
        تقوم حتى يغرسها فليغرسها “
      </p>
    </section>
  );
}

// -------------- إحصائيات المتطوع (مبني على View من أنيما) --------------

function StatsSection() {
  return (
    <section
      className="rounded-[25px] bg-[linear-gradient(0deg,rgba(250,246,247,0.8)_0%,rgba(250,246,247,0.8)_100%),linear-gradient(126deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,180,32,1)_100%)] px-6 py-5 text-[#4e4a4b] shadow-[0_6px_18px_rgba(0,0,0,0.08)]"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-[#2e2b2c] text-[20px]">إحصائيات المتطوع</h2>
        <img
          className="w-[54px] h-[54px]"
          alt="Carbon badge"
          src="https://c.animaapp.com/2u79Z8fE/img/carbon-badge.svg"
        />
      </div>

      {/* الخط تحت العنوان */}
      <div className="mb-4 h-px w-[85%] mx-auto bg-white/70" />

      {/* الثلاث خانات */}
      <div className="relative mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="relative">
            <p className="font-bold text-[#8d2e46] text-3xl">150</p>
            <p className="mt-1 font-medium text-[#4e4a4b] text-[15px]">
              ساعة تطوعية
            </p>
          </div>

          <div className="relative">
            <p className="font-bold text-[#8d2e46] text-3xl">4.5</p>
            <p className="mt-1 font-medium text-[#4e4a4b] text-[15px]">
              التقييم
            </p>
            <img
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-[35px] h-[35px]"
              alt="Solar star outline"
              src="https://c.animaapp.com/2u79Z8fE/img/solar-star-outline.svg"
            />
          </div>

          <div className="relative">
            <p className="font-bold text-[#8d2e46] text-3xl">10</p>
            <p className="mt-1 font-medium text-[#4e4a4b] text-[15px]">
              مهام منجزة
            </p>
            <img
              className="absolute -top-2 left-1/2 -translate-x-1/2 w-[35px] h-[35px]"
              alt="Done ring"
              src="https://c.animaapp.com/2u79Z8fE/img/lets-icons-done-ring-round.svg"
            />
          </div>
        </div>

        {/* خطوط فاصلة مثل أنيما */}
        <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-white/60" />
        <div className="pointer-events-none absolute inset-y-1 left-1/3 w-px bg-white/60" />
        <div className="pointer-events-none absolute inset-y-1 left-2/3 w-px bg-white/60" />
      </div>

      {/* نقاط المتطوع */}
      <div className="flex items-center gap-3">
        <div className="w-[120px] h-[35px] rounded-[10px] bg-[linear-gradient(90deg,rgba(141,46,70,0.59)_0%,rgba(228,177,6,0.59)_100%)] flex items-center justify-center">
          <span className="font-semibold text-[#8d2e46] text-[18px]">
            25 نقطة
          </span>
        </div>
        <span className="font-medium text-[16px] text-[#4e4a4b]">
          نقاط المتطوع
        </span>
      </div>
    </section>
  );
}

// -------------- سكشن البحث --------------

function SearchBox() {
  return (
    <section className="rounded-[32px] shadow-[-1px_-2px_4px_rgba(0,0,0,0.06),-2px_-6px_6px_rgba(0,0,0,0.04)] bg-transparent px-6 pt-3 pb-4">
      <div className="relative w-full" dir="rtl">
        <input
          type="text"
          placeholder="الـبـحـث ..."
          className="w-full rounded-[28px] shadow-[inset_0px_4px_4px_rgba(0,0,0,0.05)] border-0 bg-[linear-gradient(0deg,rgba(250,246,247,0.9)_0%,rgba(250,246,247,0.9)_100%),linear-gradient(177deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,177,6,1)_100%)] py-3.5 pr-11 pl-5 text-sm font-semibold text-[#6e6d6d] placeholder:text-[#6e6d6d]"
        />
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[#6e6d6d] text-sm">
          🔍
        </span>
      </div>
    </section>
  );
}

// -------------- سكشن الفرص (مبني على OtherOpportunities) --------------

function OpportunitiesSection() {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    // صفحة تكافل الرئيسية (مثل الموجودة في القائمة الجانبية)
    navigate('/');
  };

  return (
    <section
      className="rounded-[25px] shadow-[-1px_5px_11px_rgba(0,0,0,0.08)] bg-[linear-gradient(0deg,rgba(250,246,247,0.8)_0%,rgba(250,246,247,0.8)_100%),linear-gradient(223deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,180,32,1)_100%)] px-5 py-5"
      dir="rtl"
    >
      <header className="mb-3 flex flex-col items-center gap-2">
        <img
          className="w-10 h-10"
          alt="Icon"
          src="https://c.animaapp.com/2u79Z8fE/img/icon-@2x.png"
        />
        <h2 className="font-semibold text-[#2e2b2c] text-[20px] text-center">
          فرص تطوعية مقترحة
        </h2>
        <div className="h-px w-[70%] bg-white/70 mt-1" />
      </header>

      <div className="space-y-3">
        {opportunities.map((op) => (
          <OpportunityCard key={op.id} opportunity={op} />
        ))}
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          className="font-medium text-[#4e4a4b] text-[15px]"
          onClick={handleMoreClick}
        >
          المزيد
        </button>
      </div>
    </section>
  );
}

// -------------- الصفحة الرئيسية --------------

export default function UserMain() {
  const navigate = useNavigate();

  const handleTasksMore = () => {
    // يودّي لصفحة المهام مثل ما طلبتِ
    navigate('/user/tasks');
  };

  return (
    <SidebarLayout>
      <div className="h-full flex flex-col gap-6" dir="rtl">
        {/* نخلي ترتيب الأعمدة LTR عشان RTL ما يقلبهم */}
        <div
          className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)] gap-6"
          dir="ltr"
        >
          {/* العمود الأيسر: البحث + المهام الحالية */}
          <div className="flex flex-col gap-4" dir="rtl">
            <SearchBox />

            <section className="rounded-[25px] shadow-[-5px_8px_19px_rgba(0,0,0,0.05)] bg-[linear-gradient(180deg,#f3d7e1_0%,#ffe9c8_100%)] px-6 pt-5 pb-4 flex-1">
              {/* هيدر يشبه أنيما */}
              <header className="mb-4 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#facc15] text-white text-xl shadow-sm">
                  ✓
                </span>
                <div className="flex-1">
                  <h2 className="text-lg md:text-xl font-bold text-[#2e2b2c]">
                    المهام الحالية
                  </h2>
                  <div className="mt-1 h-px w-full bg-white/60" />
                </div>
              </header>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  className="text-[14px] font-medium text-[#4e4a4b]"
                  onClick={handleTasksMore}
                >
                  عرض المزيد
                </button>
              </div>
            </section>
          </div>

          {/* العمود الأيمن: الحديث + الإحصائيات + الفرص */}
          <div className="flex flex-col gap-4" dir="rtl">
            <HadithCard />
            <StatsSection />
            <OpportunitiesSection />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
