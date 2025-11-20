import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import SidebarLayout from '../../ui/Sidebar';
import { Edit, Search, Check, X, Mail } from 'lucide-react';

export default function PersonalInfo() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || 'فرح صالح الحربي',
    gender: 'أنثى',
    age: '25',
    city: 'بريدة',
    joinDate: '2/1/ 1447هـ',
    phone: '+9665035839',
    email: user?.email || 'farah.s@example.com',
    qualification: 'بكالوريوس تقنية معلومات',
    university: 'جامعة القصيم',
    specialization: 'تصميم واجهات وتجربة مستخدم + تطوير Frontend & Backend'
  });

  const [emailVerified, setEmailVerified] = useState(false);
  const [showGenderOptions, setShowGenderOptions] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    setIsEditingEducation(false);
    // هنا يمكن إضافة منطق حفظ البيانات
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingEducation(false);
    setShowGenderOptions(false);
  };

  const handleVerifyEmail = () => {
    // محاكاة التحقق من الإيميل
    setEmailVerified(true);
    setTimeout(() => {
      setEmailVerified(false);
    }, 3000);
  };

  const handleGenderSelect = (gender: string) => {
    handleInputChange('gender', gender);
    setShowGenderOptions(false);
  };

  return (
    <SidebarLayout>
      <div className="h-full">
        {/* Search Bar and Quote - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          {/* Motivational Quote */}
          <div className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 flex items-center gap-4 border border-[#e3d1d8]">
            <div className="text-4xl">🌱</div>
            <div className="flex-1">
              <p className="text-gray-800 leading-relaxed text-sm">
                قال النبي ﷺ : " إِنْ قَامَتِ السَّاعَةُ وَفِي يَدِ أَحَدِكُمْ فَسِيلَةً، فَإِنِ اسْتَطَاعَ أَنْ لَا تَقُومَ حَتَّى يَغْرِسَهَا فَلْيَغْرِسَهَا " .
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="البحث ..."
              className="w-full bg-[#f5e6d3] rounded-full px-12 py-3 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 border border-[#e3d1d8]">
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">المعلومات الشخصية</h2>
                {!isEditing ? (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Edit size={18} className="text-gray-700" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Check size={18} className="text-green-700" />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-red-700" />
                    </button>
                  </div>
                )}
              </div>
              <div className="h-px bg-gray-300 mx-auto" style={{ width: '60%' }}></div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* الاسم */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">الاسم :</span> {formData.name}
                </p>
              )}
            </div>

            {/* الجنس */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 relative backdrop-blur-sm">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setShowGenderOptions(!showGenderOptions)}
                    className="w-full text-right text-gray-700 text-base focus:outline-none"
                  >
                    <span className="font-semibold">الجنس :</span> {formData.gender}
                  </button>
                  {showGenderOptions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                      <button
                        onClick={() => handleGenderSelect('أنثى')}
                        className={`w-full text-right px-6 py-3 hover:bg-gray-50 transition-colors ${
                          formData.gender === 'أنثى' ? 'bg-[#f5e6d3]' : ''
                        }`}
                      >
                        <span className="text-gray-700">أنثى</span>
                      </button>
                      <button
                        onClick={() => handleGenderSelect('ذكر')}
                        className={`w-full text-right px-6 py-3 hover:bg-gray-50 transition-colors ${
                          formData.gender === 'ذكر' ? 'bg-[#f5e6d3]' : ''
                        }`}
                      >
                        <span className="text-gray-700">ذكر</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">الجنس :</span> {formData.gender}
                </p>
              )}
            </div>

            {/* العمر */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">العمر :</span> {formData.age}
                </p>
              )}
            </div>

            {/* المدينة */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">المدينة :</span> {formData.city}
                </p>
              )}
            </div>

            {/* تاريخ الإنضمام */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              <p className="text-gray-700 text-base">
                <span className="font-semibold">تاريخ الإنضمام :</span> {formData.joinDate}
              </p>
            </div>

            {/* رقم الجوال */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">رقم الجوال :</span> {formData.phone}
                </p>
              )}
            </div>

            {/* الإيميل مع التحقق */}
            <div className="bg-white/60 rounded-2xl px-6 py-4 md:col-span-2 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 bg-transparent text-gray-700 text-base focus:outline-none"
                    />
                    <button
                      onClick={handleVerifyEmail}
                      className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <Mail size={16} />
                      {emailVerified ? 'تم التحقق' : 'التحقق من الإيميل'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 flex-1">
                    <p className="text-gray-700 text-base flex-1">
                      <span className="font-semibold">الإيميل :</span> {formData.email}
                    </p>
                    {emailVerified && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check size={18} />
                        <span className="text-sm">تم التحقق</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* Education and Experience Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#f5e6d3] to-[#e3d1d8] rounded-2xl p-6 border border-[#e3d1d8]">
            {/* Header */}
            <div className="text-center mb-6 relative">
              <div className="flex items-center justify-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">التعليم والخبرة</h2>
                {!isEditingEducation ? (
                  <button 
                    onClick={() => setIsEditingEducation(true)}
                    className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <Edit size={18} className="text-gray-700" />
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleSave}
                      className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Check size={18} className="text-green-700" />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X size={18} className="text-red-700" />
                    </button>
                  </div>
                )}
              </div>
              <div className="h-px bg-gray-300 mx-auto" style={{ width: '60%' }}></div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditingEducation ? (
                <input
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">المؤهل :</span> {formData.qualification}
                </p>
              )}
            </div>
            <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
              {isEditingEducation ? (
                <input
                  type="text"
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">الجامعة / المدرسة :</span> {formData.university}
                </p>
              )}
            </div>
            <div className="bg-white/60 rounded-2xl px-6 py-4 md:col-span-2 backdrop-blur-sm">
              {isEditingEducation ? (
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                />
              ) : (
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">التخصص :</span> {formData.specialization}
                </p>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">المهارات:</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium border border-blue-200">
              تطوير المواقع
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
              التصميم
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
              UI/UX
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
              مطورة باك - إند
            </span>
            <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium border border-purple-200">
              مطورة واجهات
            </span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
