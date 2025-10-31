import { Users, Clock, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DonutChart from '../ui/DonutChart';

export default function Volunteers() {
  const navigate = useNavigate();

  // force english digits even if browser is Arabic
  const toEn = (n: number) => n.toLocaleString('en-US');

  const donutData = {
    total: 100,
    segments: [
      { value: 52, color: '#711f2c', label: 'رجال' },
      { value: 48, color: '#DFC775', label: 'نساء' }
    ]
  };

  const stats = [
    { icon: Users, value: 170, label: 'متطوع', accent: '#711f2c' },
    { icon: Clock, value: 284, label: 'ساعة تطوعية', accent: '#DFC775' },
    { icon: CheckCircle, value: 32, label: 'مشاركات', accent: '#4caf50' },
    { icon: Award, value: 21, label: 'نجاحات', accent: '#ff9800' }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Main Container */}
        <div
          className="
            rounded-3xl bg-white
            shadow-[0_14px_40px_rgba(0,0,0,.04)]
            p-6 md:p-8 relative
            transition-all duration-500
            hover:shadow-[0_18px_55px_rgba(0,0,0,.05)]
          "
        >
          {/* Top border glow */}
          <div className="absolute inset-x-6 top-0 h-[2px] bg-[#DFC775]/70 rounded-full pointer-events-none" />

          {/* First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Donut with animation */}
            <div
              className="
                origin-center
                animate-[fadeUp_0.6s_ease-out]
                hover:scale-[1.015]
                transition-transform duration-300
              "
            >
              <DonutChart
                total={donutData.total}
                segments={donutData.segments}
              />
            </div>

            {/* Stats as real cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="
                      flex items-center gap-4
                      bg-white/90
                      border border-[#f1f1f1]
                      rounded-2xl
                      p-4
                      shadow-sm
                      transition-all duration-300
                      hover:shadow-md hover:-translate-y-1
                    "
                    style={{ animation: `fadeUp 0.4s ease-out ${i * 0.06}s both` } as React.CSSProperties}
                  >
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ backgroundColor: `${stat.accent}15`, color: stat.accent }}
                    >
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-semibold text-slate-900 leading-tight">
                        {toEn(stat.value)}
                      </span>
                      <span className="text-sm text-slate-500">{stat.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="
                rounded-full bg-[#711f2c]
                hover:bg-[#5a1823]
                text-white font-semibold
                px-8 py-3
                transition-all duration-200
                focus-visible:ring-2 ring-[#711f2c] ring-offset-2 ring-offset-white
                shadow-[0_10px_25px_rgba(113,31,44,.35)]
              "
            >
              تسجيل جديد كمتطوع
            </button>

            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="
                rounded-full border-2 border-[#DFC775]
                text-[#711f2c]
                bg-white
                hover:bg-[#fff8e3]
                font-semibold
                px-8 py-3
                transition-all duration-200
                focus-visible:ring-2 ring-[#DFC775] ring-offset-2 ring-offset-white
              "
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>

      {/* inline keyframes for fadeUp (if Tailwind config doesn’t have it) */}
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(12px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
