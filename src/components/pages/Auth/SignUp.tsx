import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HandHeart } from 'lucide-react';
import Card from '../../ui/Card';
import Input from '../../ui/Input';
import Select from '../../ui/Select';
import Chip from '../../ui/Chip';
import TagInput from '../../ui/TagInput';
import Button from '../../ui/Button';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    region: '',
    city: '',
    educationLevel: '',
    availableDays: [] as string[],
    skills: [] as string[],
    agreeToTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const educationOptions = [
    { value: 'bachelor', label: 'بكالوريوس' },
    { value: 'diploma', label: 'دبلوم' },
    { value: 'highschool', label: 'ثانوي' },
    { value: 'middle', label: 'متوسط' },
    { value: 'elementary', label: 'ابتدائي' }
  ];

  const dayOptions = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'رقم الهوية مطلوب';
    } else if (!/^\d{10}$/.test(formData.nationalId.replace(/\*/g, ''))) {
      newErrors.nationalId = 'رقم الهوية يجب أن يكون 10 أرقام';
    }

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!formData.phone) {
      newErrors.phone = 'رقم الجوال مطلوب';
    } else if (!/^5\d{8}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'رقم الجوال يجب أن يبدأ بـ 5 ويحتوي على 9 أرقام';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة السر مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة السر يجب أن تكون 8 أحرف على الأقل';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة السر غير متطابقة';
    }

    if (!formData.age) {
      newErrors.age = 'العمر مطلوب';
    } else if (parseInt(formData.age) < 18 || parseInt(formData.age) > 65) {
      newErrors.age = 'العمر يجب أن يكون بين 18 و 65';
    }

    if (!formData.gender) {
      newErrors.gender = 'الجنس مطلوب';
    }

    if (!formData.region) {
      newErrors.region = 'المنطقة مطلوبة';
    }

    if (!formData.city) {
      newErrors.city = 'المدينة مطلوبة';
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = 'المستوى التعليمي مطلوب';
    }

    if (formData.availableDays.length === 0) {
      newErrors.availableDays = 'يرجى اختيار يوم واحد على الأقل';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'يجب الموافقة على الشروط والأحكام';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('تم إنشاء الحساب بنجاح');
      navigate('/');
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDayToggle = (day: string) => {
    const newDays = formData.availableDays.includes(day)
      ? formData.availableDays.filter(d => d !== day)
      : [...formData.availableDays, day];
    handleInputChange('availableDays', newDays);
  };

  const formatNationalId = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    return digits.slice(0, 2) + '*'.repeat(Math.min(digits.length - 2, 6)) + digits.slice(-2);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+966 ${digits}`;
    if (digits.length <= 4) return `+966 ${digits.slice(1)}`;
    if (digits.length <= 7) return `+966 ${digits.slice(1, 4)} ${digits.slice(4)}`;
    return `+966 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 9)}`;
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center justify-end gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              انضم إلينا
            </h1>
            <HandHeart 
              size={32} 
              className="text-[#DFC775] flex-shrink-0" 
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-white/85 text-lg">
            معًا نحقق الأثر ونبني مجتمعًا أفضل.
          </p>
        </div>
      </section>

      {/* Sign Up Form */}
      <div className="max-w-4xl mx-auto -mt-8 md:-mt-10 px-4">
        <Card className="rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 animate-fadeIn">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            تسجيل متطوع جديد
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="الاسم كامل"
                placeholder="الاسم كامل"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                error={errors.fullName}
                required
              />

              <Input
                label="رقم الهوية"
                placeholder="11******"
                value={formData.nationalId}
                onChange={(e) => handleInputChange('nationalId', formatNationalId(e.target.value))}
                error={errors.nationalId}
                required
              />

              <Input
                type="email"
                label="البريد الإلكتروني"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <Input
                label="رقم الجوال"
                placeholder="+966 5* **** **"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                error={errors.phone}
                required
              />

              <Input
                type="password"
                label="كلمة السر"
                placeholder="كلمة السر"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                required
              />

              <Input
                type="password"
                label="تأكيد كلمة السر"
                placeholder="تأكيد كلمة السر"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                error={errors.confirmPassword}
                required
              />

              <Input
                type="number"
                label="العمر"
                placeholder="العمر"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                error={errors.age}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الجنس <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {['ذكر', 'أنثى'].map((gender) => (
                    <Chip
                      key={gender}
                      selected={formData.gender === gender}
                      onClick={() => handleInputChange('gender', gender)}
                    >
                      {gender}
                    </Chip>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <Input
                label="المنطقة"
                placeholder="المنطقة"
                value={formData.region}
                onChange={(e) => handleInputChange('region', e.target.value)}
                error={errors.region}
                required
              />

              <Input
                label="المدينة"
                placeholder="المدينة"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={errors.city}
                required
              />

              <Select
                label="المستوى التعليمي"
                placeholder="اختر المستوى التعليمي"
                options={educationOptions}
                value={formData.educationLevel}
                onChange={(e) => handleInputChange('educationLevel', e.target.value)}
                error={errors.educationLevel}
                required
              />
            </div>

            {/* Available Days */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الأيام المتاحة <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {dayOptions.map((day) => (
                  <Chip
                    key={day}
                    selected={formData.availableDays.includes(day)}
                    onClick={() => handleDayToggle(day)}
                  >
                    {day}
                  </Chip>
                ))}
              </div>
              {errors.availableDays && (
                <p className="mt-1 text-sm text-red-600">{errors.availableDays}</p>
              )}
            </div>

            {/* Skills */}
            <TagInput
              label="المهارات"
              tags={formData.skills}
              onTagsChange={(skills) => handleInputChange('skills', skills)}
              placeholder="اضغط Enter لإضافة مهارة"
            />

            {/* Terms Agreement */}
            <div className="flex items-start">
              <input
                id="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agreeToTerms" className="mr-2 text-sm text-gray-700">
                أوافق على الشروط والأحكام لمنصة تكافل.
                <span className="text-red-500 mr-1">*</span>
              </label>
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                variant="outlineGold"
                className="w-full md:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link 
                to="/signin" 
                className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                تسجيل الدخول ←
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
