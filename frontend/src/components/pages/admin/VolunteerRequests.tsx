import { useState } from 'react';
import AdminLayout from "../../layout/AdminLayout";
import { FiSearch } from "react-icons/fi";
import { MapPin, Mail, Phone, Star, Check, X } from 'lucide-react';

interface VolunteerRequest {
  id: string;
  name: string;
  location: string;
  email: string;
  phone: string;
  qualification: string;
  university: string;
  specialization: string;
  skills: string[];
  volunteerHours: number;
  rating: number;
  avatar?: string;
}

const mockVolunteers: VolunteerRequest[] = [
  {
    id: '1',
    name: 'احمد محمد علي',
    location: 'الرياض',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    qualification: 'بكالوريوس في الأعلام',
    university: 'جامعة الملك سعود',
    specialization: 'الإعلام الرقمي وكتابة محتوى',
    skills: ['التواصل والإقناع', 'كتابة محتوى'],
    volunteerHours: 20,
    rating: 4.8
  },
  {
    id: '2',
    name: 'فاطمة سالم',
    location: 'القصيم',
    email: 'fatima@example.com',
    phone: '+966507654321',
    qualification: 'بكالوريوس تقنية معلومات',
    university: 'جامعة القصيم',
    specialization: 'تصميم واجهات وتجربة مستخدم',
    skills: ['تصميم UI/UX', 'Figma', 'Adobe Creative'],
    volunteerHours: 14,
    rating: 4.9
  },
  {
    id: '3',
    name: 'عمر خالد',
    location: 'مكة',
    email: 'omar@example.com',
    phone: '+966501234567',
    qualification: 'بكالوريوس إدارة الأعمال',
    university: 'جامعة الإمام محمد بن سعود',
    specialization: 'إدارة المشاريع',
    skills: ['تحليل البيانات', 'ادارة المشاريع'],
    volunteerHours: 15,
    rating: 4.7
  },
  {
    id: '4',
    name: 'ساره أحمد',
    location: 'القصيم',
    email: 'sara@example.com',
    phone: '+966507654321',
    qualification: 'دبلوم برمجة وتطوير ويب',
    university: 'جامعة القصيم',
    specialization: 'تحليل نظم وتطوير مواقع',
    skills: ['تطوير الويب', 'JavaScript', 'محللة نظم'],
    volunteerHours: 6,
    rating: 4.5
  }
];

export default function VolunteerRequests() {
  const [searchQuery, setSearchQuery] = useState('');
  const [volunteers, setVolunteers] = useState<VolunteerRequest[]>(mockVolunteers);

  const handleAccept = (id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    // هنا يمكن إضافة منطق قبول المتطوع
  };

  const handleReject = (id: string) => {
    setVolunteers(prev => prev.filter(v => v.id !== id));
    // هنا يمكن إضافة منطق رفض المتطوع
  };

  const filteredVolunteers = volunteers.filter(volunteer =>
    volunteer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    volunteer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

    return (
        <AdminLayout>
      <div className="h-full">
        {/* Search Bar */}
        <div dir="ltr" className="flex justify-start mb-6">
          <div className="relative w-[321px] h-[42px]">
            <div className="absolute inset-0 bg-[#faf6f76b] rounded-[20px] shadow-[inset_0px_0px_8px_#f3e3e3e0,0px_4px_15px_#8d2e4682]" />
            <input
              type="text"
              placeholder="البحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="absolute inset-0 w-full h-full bg-transparent border-none outline-none pl-10 pr-3 text-[15px] text-[#4e4a4b] [direction:rtl] font-[Cairo]"
            />
            <div className="absolute top-1/2 -translate-y-1/2 left-[10px]">
              <FiSearch className="w-[16px] h-[16px] text-[#4e4a4b]" />
            </div>
          </div>
        </div>

        {/* Title Banner */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#f3e3e3] rounded-[19px] px-12 py-4 border border-[#e0cfd4] shadow-[0px_3px_25px_#8d2e4673] w-fit min-w-[300px]">
            <h1 className="text-3xl font-bold text-[#2e2b2c] text-center font-[Cairo]">طلبات التطوع</h1>
          </div>
        </div>

        {/* Volunteer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredVolunteers.map((volunteer) => (
            <div
              key={volunteer.id}
              className="bg-[#f3e3e3] rounded-[18px] p-6 border border-[#e0cfd4] shadow-[0px_3px_15px_#8d2e4633]"
            >
              {/* Header with Name and Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-[#8D2E46] border-2 border-white">
                  {volunteer.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold text-[#2e2b2c] flex-1 font-[Cairo]">{volunteer.name}</h3>
              </div>

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-600" />
                  <span>{volunteer.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail size={16} className="text-gray-600" />
                  <span>{volunteer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={16} className="text-gray-600" />
                  <span>{volunteer.phone}</span>
                </div>
              </div>

              {/* Education and Experience */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">التعليم والخبرة :</h4>
                <div className="bg-white/60 rounded-[14px] p-4 space-y-2 backdrop-blur-sm">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">المؤهل :</span> {volunteer.qualification}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">الجامعة :</span> {volunteer.university}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">التخصص :</span> {volunteer.specialization}
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">المهارات :</h4>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-white/80 text-gray-700 text-xs font-medium border border-white/60 backdrop-blur-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Volunteer Hours and Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">الساعات التطوعية</span>
                  <span className="text-sm font-bold text-gray-900">{volunteer.volunteerHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-900">{volunteer.rating}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleAccept(volunteer.id)}
                  className="flex-1 bg-[#8D2E46] hover:bg-[#6B1E2A] text-white font-medium py-2.5 rounded-xl transition-colors duration-200"
                >
                  قبول
                </button>
                <button
                  onClick={() => handleReject(volunteer.id)}
                  className="flex-1 bg-[#fdf8f9] hover:bg-gray-50 text-[#8D2E46] border border-[#e0cfd4] font-medium py-2.5 rounded-[999px] transition-colors duration-200 font-[Cairo]"
                >
                  رفض
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVolunteers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">لا توجد طلبات تطوع متاحة</p>
          </div>
        )}
      </div>
        </AdminLayout>
    );
}
