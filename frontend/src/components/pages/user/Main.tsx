import React from 'react';
import SidebarLayout from '../../ui/Sidebar';
import { MapPin, Clock3, Users, CalendarClock, Search } from 'lucide-react';
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
  category: string;
  location: string;
  urgency: OpportunityUrgency;
  duration: string;
  people: string;
  logoUrl: string;
};

// -------------- البيانات --------------

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

type InfoItemProps = {
  icon: React.ElementType;
  children: React.ReactNode;
  reverse?: boolean;
};

function InfoItem({ icon: Icon, children, reverse = false }: InfoItemProps) {
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

// -------------- كرت المهام --------------

function TaskCard({ task }: { task: Task }) {
  const badgeClasses = statusClasses(task.status);
  const primaryAction = primaryActionLabel(task.status);
  const emoji = statusEmoji(task.status);

  return (
    <div className="rounded-2xl bg-[#faf6f7] border border-[#e6d2d7] px-5 py-4 shadow-[0_4px_12px_#0000000d]">
      <div className="flex flex-col gap-1" dir="rtl">
        {/* البادج + العنوان + الإيموجي */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center justify-center px-3 py-[2px] rounded-full border text-[10px] font-normal ${badgeClasses}`}
          >
            {task.status}
          </span>

          <p className="flex-1 text-center text-[15px] font-bold text-[#4e4a4b]">
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

// -------------- كرت الفرص --------------

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const urgencyBadge = urgencyClasses(opportunity.urgency);

  return (
    <div
      className="rounded-2xl bg-[#faf6f7] border border-[#e6d2d7] px-5 py-4 shadow-[0_4px_12px_#0000000d]"
      dir="rtl"
    >
      {/* الجزء العلوي: اللوقو على اليمين، العنوان + البادج + التفاصيل على اليسار */}
      <div className="flex items-center gap-4">
        {/* اللوقو على اليمين */}
        <div className="w-[105px] h-[72px] rounded-[10px] border border-[#e6d2d7] bg-white flex items-center justify-center overflow-hidden shrink-0">
          <img
            src={opportunity.logoUrl}
            alt={opportunity.org}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* النصوص */}
        <div className="flex-1 flex flex-col gap-1 text-right">
          {/* العنوان + البادج في نفس السطر */}
          <div className="flex items-center justify-between w-full mt-1">
            <p className="text-[15px] font-medium text-[#4e4a4b] leading-snug flex-1 ml-2">
              {opportunity.title}
            </p>
            <span
              className={`px-3 py-[2px] rounded-full border text-[10px] font-normal shrink-0 ${urgencyBadge}`}
            >
              {opportunity.urgency}
            </span>
          </div>

          <p className="text-[13px] text-[#a54c62cc] font-medium mt-1">
            {opportunity.category}
          </p>

          <p className="text-[11px] text-[#6e6d6d]">{opportunity.org}</p>
        </div>
      </div>

      {/* السطر السفلي: المعلومات ثم زر التقدم الآن يسار */}
      <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-[#6e6d6d]">
        {/* معلومات: الأشخاص – المدة – الموقع (الأيقونة أولاً ثم النص) */}
        <div className="flex flex-wrap items-center gap-3">
          <InfoItem icon={Users}>{opportunity.people}</InfoItem>
          <InfoItem icon={Clock3}>{opportunity.duration}</InfoItem>
          <InfoItem icon={MapPin}>{opportunity.location}</InfoItem>
        </div>

        <button
          type="button"
          className="px-5 py-2 rounded-[10px] bg-[#a54c63] text-white text-[13px] font-medium hover:brightness-110 transition"
        >
          التقدم الآن
        </button>
      </div>
    </div>
  );
}

// -------------- كرت الحديث --------------

function HadithCard() {
  return (
    <div
      className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 flex items-center gap-4 border border-[#e3d1d8]"
      dir="rtl"
    >
      <div className="text-4xl">🌱</div>
      <div className="flex-1">
        <p className="text-gray-800 leading-relaxed text-sm">
          قال النبي ﷺ : " إِنْ قَامَتِ السَّاعَةُ وَفِي يَدِ أَحَدِكُمْ فَسِيلَةً،
          فَإِنِ اسْتَطَاعَ أَنْ لَا تَقُومَ حَتَّى يَغْرِسَهَا فَلْيَغْرِسَهَا ".
        </p>
      </div>
    </div>
  );
}

// -------------- إحصائيات المتطوع --------------

function StatsSection() {
  return (
    <section
      className="relative max-w-[540px] w-full rounded-[25px] py-5 px-6 text-[#4e4a4b]
                 bg-[linear-gradient(0deg,rgba(250,246,247,0.8)_0%,rgba(250,246,247,0.8)_100%),linear-gradient(177deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,180,32,1)_100%)]
                 shadow-[-1px_5px_11px_#00000008,-3px_20px_20px_#00000008,-7px_45px_28px_#00000005,-12px_81px_33px_transparent,-18px_126px_36px_transparent]"
      dir="rtl"
    >
      {/* الهيدر + الميدالية */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-[#2e2b2c] text-[22px] md:text-[24px]">
          إحصائيات المتطوع
        </h2>
        <img
          className="w-8 h-8 md:w-9 md:h-9"
          alt="Carbon badge"
          src="https://c.animaapp.com/2u79Z8fE/img/carbon-badge.svg"
        />
      </div>

      <div className="mb-4 h-px w-[88%] mx-auto bg-white/60" />

      {/* الأرقام الثلاثة */}
      <div className="mb-6 flex justify-between text-center gap-6">
        {/* ساعة تطوعية */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <img
            className="w-7 h-7 md:w-8 md:h-8"
            alt="clock"
            src="https://c.animaapp.com/2u79Z8fE/img/mdi-light-clock.svg"
          />
          <p className="font-bold text-[#8d2e46] text-3xl md:text-4xl">150</p>
          <p className="mt-1 font-medium text-[#4e4a4b] text-[14px] md:text-[15px]">
            ساعة تطوعية
          </p>
        </div>

        <div className="w-px bg-white/60 self-stretch hidden md:block" />

        {/* التقييم */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <img
            className="w-7 h-7 md:w-8 md:h-8"
            alt="rating"
            src="https://c.animaapp.com/2u79Z8fE/img/solar-star-outline.svg"
          />
          <p className="font-bold text-[#8d2e46] text-3xl md:text-4xl">4.5</p>
          <p className="mt-1 font-medium text-[#4e4a4b] text-[14px] md:text-[15px]">
            التقييم
          </p>
        </div>

        <div className="w-px bg-white/60 self-stretch hidden md:block" />

        {/* مهام منجزة */}
        <div className="flex-1 flex flex-col items-center gap-1">
          <img
            className="w-7 h-7 md:w-8 md:h-8"
            alt="done"
            src="https://c.animaapp.com/2u79Z8fE/img/lets-icons-done-ring-round.svg"
          />
          <p className="font-bold text-[#8d2e46] text-3xl md:text-4xl">10</p>
          <p className="mt-1 font-medium text-[#4e4a4b] text-[14px] md:text-[15px]">
            مهام منجزة
          </p>
        </div>
      </div>

      {/* نقاط المتطوع */}
      <div className="flex items-center gap-3">
        <div className="w-[130px] h-[38px] rounded-[10px] bg-[linear-gradient(90deg,rgba(141,46,70,0.9)_0%,rgba(228,177,6,0.9)_100%)] flex items-center justify-center">
          <span className="font-semibold text-[#8d2e46] text-[16px] md:text-[18px]">
            25 نقطة
          </span>
        </div>
        <span className="font-medium text-[15px] md:text-[16px] text-[#4e4a4b]">
          نقاط المتطوع
        </span>
      </div>
    </section>
  );
}

// -------------- سكشن البحث --------------

function SearchBox() {
  return (
    <div className="w-full" dir="rtl">
      <div className="relative">
        <input
          type="text"
          placeholder="... البحث"
          className="w-full bg-[#f5e6d3] rounded-full py-4 pr-5 pl-14
                     text-gray-700 placeholder-gray-500
                     focus:outline-none focus:ring-2 focus:ring-[#c5a89c] transition shadow-inner"
        />

        <Search className="absolute top-1/2 -translate-y-1/2 left-6 w-5 h-5 text-gray-500 pointer-events-none" />
      </div>
    </div>
  );
}

// -------------- سكشن الفرص --------------

function OpportunitiesSection() {
  const navigate = useNavigate();

  const handleMoreClick = () => {
    navigate('/');
  };

  return (
    <section
      className="rounded-[25px] shadow-[-1px_5px_11px_#00000008,-3px_20px_20px_#00000008,-7px_45px_28px_#00000005,-12px_81px_33px_transparent,-18px_126px_36px_transparent]
                 bg-[linear-gradient(0deg,rgba(250,246,247,0.8)_0%,rgba(250,246,247,0.8)_100%),linear-gradient(223deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,180,32,1)_100%)]
                 p-6"
      dir="rtl"
    >
      <header className="mb-3 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {/* العنوان ثم الأيقونة */}
          <h2 className="font-semibold text-[#2e2b2c] text-[22px]">
            فرص تطوعية مقترحة
          </h2>
          <img
            className="w-10 h-10"
            alt="Icon"
            src="https://c.animaapp.com/2u79Z8fE/img/icon-@2x.png"
          />
        </div>
        <div className="h-px bg-gray-300 mx-auto" style={{ width: '60%' }} />
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
    navigate('/user/tasks');
  };

  return (
    <SidebarLayout>
      <div className="h-full" dir="rtl">
        {/* أعلى الصفحة: الحديث + البحث */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <HadithCard />
          <SearchBox />
        </div>

        {/* تحت: عمودين متساويين */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* العمود الأيسر: الإحصائيات + الفرص */}
          <div className="flex flex-col gap-4 items-center">
            <StatsSection />
            <OpportunitiesSection />
          </div>

          {/* العمود الأيمن: المهام الحالية */}
          <div className="flex flex-col gap-4">
            <section
              className="rounded-[25px] shadow-[-5px_8px_19px_#00000008,-18px_30px_35px_#00000008,-41px_68px_48px_#00000005,-72px_122px_57px_transparent,-113px_190px_62px_transparent]
                         bg-[linear-gradient(0deg,rgba(250,246,247,0.8)_0%,rgba(250,246,247,0.8)_100%),linear-gradient(177deg,rgba(152,66,88,1)_0%,rgba(165,86,78,1)_33%,rgba(228,180,32,1)_100%)]
                         p-6 flex-1"
            >
              <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                  المهام الحالية
                </h2>
                <div
                  className="h-px bg-gray-300 mx-auto"
                  style={{ width: '60%' }}
                />
              </div>

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
        </div>
      </div>
    </SidebarLayout>
  );
}
