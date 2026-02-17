import Icon from '../ui/Icon';
import Card from '../ui/Card';
import DonutChart from '../ui/DonutChart';
import { useDashboardSettings } from '../../contexts/useDashboardSettings';
import { useEffect, useState } from 'react';

const DEBUG_DASHBOARD_SETTINGS = true;

// Static data used for demo purposes
const STATIC_DATA = {
  kpis: {
    hours: '79,584',
    impactValue: '1.03M',
  },
  volunteerCounts: {
    new: 1240,
    repeat: 580,
  },
  topVolunteers: [
    { name: 'أحمد علي', hours: 320 },
    { name: 'سارة محمد', hours: 298 },
    { name: 'خالد عبدالله', hours: 256 },
  ],
};

export default function HomeVolunteerDashboard() {
  const { settings } = useDashboardSettings();
  const currentYear = settings?.year ?? new Date().getFullYear();
  const totalVolunteers = STATIC_DATA.volunteerCounts.new + STATIC_DATA.volunteerCounts.repeat;
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 640px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(max-width: 640px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    setIsMobile(media.matches);
    media.addEventListener('change', onChange);

    return () => media.removeEventListener('change', onChange);
  }, []);

  if (DEBUG_DASHBOARD_SETTINGS) console.log('[HomeVolunteerDashboard] render with settings:', settings);
  if (!settings.showDashboard) return null;

  return (
    <section className="relative z-10 bg-[#f8f3f1] py-12" dir="rtl">
      <div className="mx-auto max-w-6xl px-4">
        {/* Section Header */}
        <div className="mb-8 text-center">
          <h2 className="mb-1 text-2xl font-bold text-[#4f1b25] md:text-3xl">إحصائيات قسم التطوع لعام {currentYear}</h2>
          <p className="text-sm text-[#7f6761]">ملخص مؤشرات التطوع</p>
        </div>

        {/* Row 1: KPI Cards */}
        {(settings.showKPIs || settings.showVolunteerBars) && (
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {settings.showKPIs && (
              <Card className="h-full rounded-2xl border border-[#eadfda] bg-[#fffdfa] p-5 shadow-[0_2px_12px_rgba(107,31,43,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#DFC775]">
                    <Icon name="Clock" className="text-white" size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-[#5b3b34]">عدد الساعات التطوعية</h3>
                  <p className="mt-1 text-xs text-[#8d726b]">مجموع ساعات التطوع</p>
                  <div className="mt-4 text-3xl font-extrabold text-[#6B1F2B] md:text-4xl">{STATIC_DATA.kpis.hours}</div>
                  <p className="mt-2 text-xs text-[#8d726b]">حسب بيانات العام الحالي</p>
                </div>
              </Card>
            )}

            {settings.showKPIs && (
              <Card className="h-full rounded-2xl border border-[#eadfda] bg-[#fffdfa] p-5 shadow-[0_2px_12px_rgba(107,31,43,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#DFC775]">
                    <Icon name="Heart" className="text-white" size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-[#5b3b34]">قيمة إسهام المتطوع</h3>
                  <p className="mt-1 text-xs text-[#8d726b]">قيمة الأثر الإجمالي</p>
                  <div className="mt-4 text-3xl font-extrabold text-[#6B1F2B] md:text-4xl">{STATIC_DATA.kpis.impactValue}</div>
                  <p className="mt-2 text-xs text-[#8d726b]">حسب بيانات العام الحالي</p>
                </div>
              </Card>
            )}

            {settings.showVolunteerBars && (
              <Card className="h-full rounded-2xl border border-[#eadfda] bg-[#fffdfa] p-5 shadow-[0_2px_12px_rgba(107,31,43,0.06)]">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#DFC775]">
                    <Icon name="Users" className="text-white" size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-[#5b3b34]">عدد المتطوعين</h3>
                  <p className="mt-1 text-xs text-[#8d726b]">إجمالي المتطوعين الحاليين</p>
                  <div className="mt-4 text-3xl font-extrabold text-[#6B1F2B] md:text-4xl">{totalVolunteers.toLocaleString()}</div>
                  <p className="mt-2 text-xs text-[#8d726b]">يشمل المتطوعين الجدد والمكررين</p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Row 2: Charts Area */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {settings.showDonut && (
            <Card className="h-full rounded-2xl border border-[#eadfda] bg-[#fffdfa] p-6 md:p-7 shadow-[0_2px_12px_rgba(107,31,43,0.06)] lg:col-span-2">
              <div className="mb-4 text-right">
                <h3 className="text-base font-semibold text-[#5b3b34]">مجموع الساعات التطوعية للإدارات</h3>
                <p className="mt-1 text-xs text-[#8d726b]">توزيع نسبي لمساهمة الإدارات</p>
              </div>
              <DonutChart
                total={100}
                size={isMobile ? 210 : 260}
                strokeWidth={22}
                segments={[
                  { label: 'إدارة أ', value: 40, color: '#6B1F2B' },
                  { label: 'إدارة ب', value: 30, color: '#D6B25E' },
                  { label: 'إدارة ج', value: 20, color: '#E7B7BE' },
                  { label: 'أخرى', value: 10, color: '#BFA8A1' },
                ]}
              />
            </Card>
          )}

          <div className={`${settings.showDonut ? 'lg:col-span-1' : 'lg:col-span-3'} space-y-4`}>
            {settings.showTopVolunteers && (
              <Card className="h-full rounded-2xl border border-[#eadfda] bg-[#fffdfa] p-5 shadow-[0_2px_12px_rgba(107,31,43,0.06)]">
                <div className="mb-4 text-right">
                  <h3 className="text-base font-semibold text-[#5b3b34]">أفضل المتطوعين</h3>
                  <p className="mt-1 text-xs text-[#8d726b]">ترتيب المتطوعين حسب عدد الساعات</p>
                </div>

                <div className="space-y-3">
                  {STATIC_DATA.topVolunteers.map((volunteer, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b border-[#f1e7e4] pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3e3cd] text-xs font-bold text-[#6B1F2B]">
                          {idx + 1}
                        </div>

                        <p className="text-sm font-medium text-[#3f302c]">
                          {volunteer.name}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-[#6B1F2B]">
                        {volunteer.hours}
                      </p>

                    </div>
                  ))}
                </div>

              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
