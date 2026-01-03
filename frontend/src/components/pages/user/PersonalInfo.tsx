import { useState, useEffect } from 'react';
import SidebarLayout from '../../ui/Sidebar';
import { Edit, Search, Check, X, Mail } from 'lucide-react';
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "../../../config";
import TagInput from "../../forms/TagInput";

export default function PersonalInfo() {
  const { access, isAuthenticated } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingEducation, setIsEditingEducation] = useState(false);
  const [isEditingGender, setIsEditingGender] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    age: '',
    city: '',
    joinDate: '',
    phone: '',
    email: '',
    qualification: '',
    university: '',
    specialization: '',
    skills: [] as string[],          
  });
  
  const [emailVerified, setEmailVerified] = useState(false);
  const [showGenderOptions, setShowGenderOptions] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    if (!isAuthenticated || !access) {
      setLoading(false);
      return;
    }
  
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
  
        if (!res.ok) throw new Error("Failed to fetch profile");
  
        const data = await res.json();
        console.log("Profile data:", data); // Debug
        
        // Map backend response to frontend format
        setFormData({
          name: data.profile?.name || "",
          gender: data.profile?.gender || "",
          age: data.profile?.age?.toString() || "",
          city: data.profile?.city || "",
          joinDate: data.profile?.created_at 
            ? new Date(data.profile.created_at).toLocaleDateString('ar-SA') 
            : "",
          phone: data.profile?.phone || "",
          email: data.email || "",
          qualification: data.profile?.qualification || "",
          university: data.profile?.university || "",
          specialization: data.profile?.specialization || "",
          skills: Array.isArray(data.profile?.skills) ? data.profile.skills : [],
        });
        
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [isAuthenticated, access]);
  

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Prepare update payload
      const updatePayload = {
        name: formData.name,
        gender: formData.gender,
        age: parseInt(formData.age) || null,
        city: formData.city,
        phone: formData.phone,
        qualification: formData.qualification,
        skills: formData.skills,
      };

      const res = await fetch(`${API_BASE_URL}/api/accounts/profile/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(updatePayload),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Update failed:", errorData);
        throw new Error("Update failed");
      }
  
      // Fetch updated profile
      const updatedRes = await fetch(`${API_BASE_URL}/api/accounts/me/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      
      if (updatedRes.ok) {
        const data = await updatedRes.json();
        setFormData({
          name: data.profile?.name || "",
          gender: data.profile?.gender || "",
          age: data.profile?.age?.toString() || "",
          city: data.profile?.city || "",
          joinDate: data.profile?.created_at 
            ? new Date(data.profile.created_at).toLocaleDateString('ar-SA') 
            : "",
          phone: data.profile?.phone || "",
          email: data.email || "",
          qualification: data.profile?.qualification || "",
          university: data.profile?.university || "",
          specialization: data.profile?.specialization || "",
          skills: Array.isArray(data.profile?.skills) ? data.profile.skills : [],
        });
      }

      setIsEditing(false);
      setIsEditingEducation(false);
      setIsEditingGender(false);
      setShowGenderOptions(false);
      
      alert("تم حفظ التغييرات بنجاح!");
    } catch (err) {
      console.error("Profile update error:", err);
      alert("حدث خطأ أثناء حفظ التغييرات");
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false);
    setIsEditingEducation(false);
    setIsEditingGender(false);
    setShowGenderOptions(false);
  };

  const handleVerifyEmail = () => {
    setEmailVerified(true);
    setTimeout(() => {
      setEmailVerified(false);
    }, 3000);
  };

  const handleGenderSelect = (gender: string) => {
    handleInputChange('gender', gender);
    setShowGenderOptions(false);
    setIsEditingGender(false);
  };

  if (loading) {
    return (
      <SidebarLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل البيانات...</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

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
                قال النبي ﷺ : " إِنْ قَامَتِ السَّاعَةُ وَفِي يَدِ أَحَدِكُمْ فَسِيلَةً، فَإِنِ اسْتَطَاعَ أَنْ لَا تَقُومَ حَتَّى يَغْرِسَهَا فَلْيَغْرِسَهَا " .
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
                    <span className="font-semibold">الاسم :</span> {formData.name || 'غير محدد'}
                  </p>
                )}
              </div>

              {/* الجنس */}
              <div className="bg-white/60 rounded-2xl px-6 py-4 relative backdrop-blur-sm">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => {
                        setIsEditingGender(true);
                        setShowGenderOptions(!showGenderOptions);
                      }}
                      className="w-full text-right text-gray-700 text-base focus:outline-none"
                    >
                      <span className="font-semibold">الجنس :</span> {formData.gender || 'اختر'}
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
                    <span className="font-semibold">الجنس :</span> {formData.gender || 'غير محدد'}
                  </p>
                )}
              </div>

              {/* العمر */}
              <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full bg-transparent text-gray-700 text-base focus:outline-none"
                  />
                ) : (
                  <p className="text-gray-700 text-base">
                    <span className="font-semibold">العمر :</span> {formData.age || 'غير محدد'}
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
                    <span className="font-semibold">المدينة :</span> {formData.city || 'غير محدد'}
                  </p>
                )}
              </div>

              {/* تاريخ الإنضمام */}
              <div className="bg-white/60 rounded-2xl px-6 py-4 backdrop-blur-sm">
                <p className="text-gray-700 text-base">
                  <span className="font-semibold">تاريخ الإنضمام :</span> {formData.joinDate || 'غير محدد'}
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
                    <span className="font-semibold">رقم الجوال :</span> {formData.phone || 'غير محدد'}
                  </p>
                )}
              </div>

              {/* الإيميل مع التحقق */}
              <div className="bg-white/60 rounded-2xl px-6 py-4 md:col-span-2 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <p className="text-gray-700 text-base flex-1">
                      <span className="font-semibold">الإيميل :</span> {formData.email || 'غير محدد'}
                    </p>
                    {emailVerified && (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check size={18} />
                        <span className="text-sm">تم التحقق</span>
                      </div>
                    )}
                  </div>
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
                    <span className="font-semibold">المؤهل :</span> {formData.qualification || 'غير محدد'}
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
                    <span className="font-semibold">الجامعة / المدرسة :</span> {formData.university || 'غير محدد'}
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
                    <span className="font-semibold">التخصص :</span> {formData.specialization || 'غير محدد'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            المهارات
          </h3>

          <TagInput
            tags={formData.skills}
            onTagsChange={(tags) =>
              setFormData((prev) => ({ ...prev, skills: tags }))
            }
            placeholder="اضغط Enter لإضافة مهارة"
            inputProps={{
              readOnly: !isEditing && !isEditingEducation,
              disabled: !isEditing && !isEditingEducation,
            }}
          />
        </div>
      </div>
    </SidebarLayout>
  );
}