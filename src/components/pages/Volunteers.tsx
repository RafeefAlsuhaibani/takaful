import { Users, Clock, CheckCircle, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../ui/StatCard';
import DonutChart from '../ui/DonutChart';

export default function Volunteers() {
  const navigate = useNavigate();

  // Sample data
  const donutData = {
    total: 100,
    segments: [
      { value: 52, color: '#711f2c', label: 'رجال' },
      { value: 48, color: '#DFC775', label: 'نساء' }
    ]
  };

  const stats = [
    { icon: <Users size={20} />, value: 170, label: 'متطوع' },
    { icon: <Clock size={20} />, value: 284, label: 'ساعة تطوعية' },
    { icon: <CheckCircle size={20} />, value: 32, label: 'مشاركات' },
    { icon: <Award size={20} />, value: 21, label: 'نجاحات' }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Main Container */}
        <div className="rounded-3xl bg-white shadow-[0_10px_30px_rgba(0,0,0,.06)] p-6 md:p-8 relative animate-fadeIn">
          {/* Top border glow */}
          <div className="absolute inset-x-6 top-0 h-[2px] bg-[#DFC775]/60 rounded-full"></div>
          
          {/* First Row - Donut Chart and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Donut Chart */}
            <div className="animate-slideUp">
              <DonutChart 
                total={donutData.total} 
                segments={donutData.segments} 
              />
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={index}
                  icon={stat.icon}
                  value={stat.value}
                  label={stat.label}
                  className="animate-fadeIn"
                  style={{ animationDelay: `${index * 80}ms` }}
                />
              ))}
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2"
            >
              تسجيل جديد كمتطوع
            </button>
            
            <button
              type="button"
              onClick={() => navigate("/signin")}
              className="rounded-full border-2 border-[#DFC775] text-[#DFC775] bg-white hover:bg-[#FFF5D6] font-semibold px-8 py-3 transition-all focus-visible:ring-2 ring-brand-600 ring-offset-2"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
