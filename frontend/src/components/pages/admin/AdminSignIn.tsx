import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import Card from '../../ui/Card';
import Input from '../../forms/Input';
import Button from '../../ui/Button';

export default function AdminSignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة السر مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة السر يجب أن تكون 6 أحرف على الأقل';
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
      // Extract name from email (for demo purposes)
      const name = formData.email.split('@')[0];
      
      // Store admin data
      login({
        name: name,
        email: formData.email,
        role: 'admin'
      });
      
      alert('تم تسجيل دخول المشرف بنجاح');
      navigate('/admin/dashboard'); // Redirect to admin dashboard
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500 text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
          <div className="flex items-center justify-end gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold">
              حيّاك الله، مشرفنا العزيز
            </h1>
            <Shield 
              size={32} 
              className="text-[#DFC775] flex-shrink-0" 
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-white/85 text-lg">
            بوجودك تكتمل المنظومة ونمضي بخطى ثابتة نحو التمكين.
          </p>
        </div>
      </section>

      {/* Admin Sign In Form */}
      <div className="max-w-2xl mx-auto -mt-8 md:-mt-10 px-4">
        <Card className="rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 relative animate-fadeIn">
          {/* Top border glow */}
          <div className="absolute inset-x-6 top-0 h-[2px] bg-[#DFC775]/40 rounded-full"></div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            تسجيل دخول المشرف
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              label="البريد الإلكتروني"
              placeholder="ادخل بريدك الالكتروني"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              required
            />

            <Input
              type="password"
              label="كلمة السر"
              placeholder="ادخل كلمة السر"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={errors.password}
              required
            />

            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="mr-2 text-sm text-gray-700">
                تذكرني
              </label>
            </div>

            <Button
              type="submit"
              variant="outlineGold"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري تسجيل الدخول...' : 'تسجيل دخول المشرف'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ليس لديك صلاحيات مشرف؟{' '}
              <Link 
                to="/signin" 
                className="text-brand-600 hover:text-brand-700 font-medium transition-colors"
              >
                تسجيل دخول عادي ←
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
