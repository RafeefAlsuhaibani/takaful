import React from 'react';
import { Medal, Star } from 'lucide-react';

const StatsView: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 border border-[#e3d1d8]"
      dir="rtl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center">
          <Medal className="w-5 h-5 text-[#f1a91c]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">إحصائيات المتطوع</h2>
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/60 text-center mb-4">
        <div className="px-2 space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#c53f4e]">
            <span className="text-xl font-bold">150</span>
          </div>
          <p className="text-xs text-gray-700">ساعة تطوعية</p>
        </div>

        <div className="px-2 space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#f1a91c]">
            <span className="text-xl font-bold">4.5</span>
            <Star className="w-4 h-4" />
          </div>
          <p className="text-xs text-gray-700">التقييم</p>
        </div>

        <div className="px-2 space-y-1">
          <div className="flex items-center justify-center gap-1 text-[#c53f4e]">
            <span className="text-xl font-bold">10</span>
          </div>
          <p className="text-xs text-gray-700">مهام منجزة</p>
        </div>
      </div>

      <div className="h-px bg-white/60 w-full mb-4" />

      <div className="bg-[#fbe4b7] rounded-2xl px-5 py-3 flex items-center justify-between text-sm">
        <span className="text-gray-800">نقاط المتطوع</span>
        <span className="px-4 py-1 rounded-full bg-[#b6454f] text-white text-xs font-semibold">
          25 نقطة
        </span>
      </div>
    </div>
  );
};

export default StatsView;
