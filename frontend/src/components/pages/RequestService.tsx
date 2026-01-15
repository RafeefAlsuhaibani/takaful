import { useState, useEffect } from 'react';
import { Package, Send, CheckCircle } from 'lucide-react';
import { API_BASE_URL } from '../../config';

interface Service {
  id: number;
  title: string;
  desc: string;
  status: string;
  is_active: boolean;
}

export default function RequestService() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    service: '',
    beneficiary_name: '',
    beneficiary_contact: '',
    details: '',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/public-services/`);
      if (response.ok) {
        const data = await response.json();
        setServices(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.service || !formData.beneficiary_name || !formData.beneficiary_contact) {
      alert('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/public-service-request/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          service: '',
          beneficiary_name: '',
          beneficiary_contact: '',
          details: '',
        });

        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const data = await response.json();
        alert(data.error || 'فشل في إرسال الطلب');
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('حدث خطأ أثناء إرسال الطلب');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[Cairo]" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#6F1A28] to-[#8d2e46] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-extrabold">طلب خدمة</h1>
          </div>
          <p className="text-xl text-white/90">
            نحن هنا لخدمتكم. يرجى ملء النموذج أدناه وسنقوم بمراجعة طلبكم في أقرب وقت
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Success Message */}
        {success && (
          <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-lg p-6 flex items-center gap-4 animate-fadeIn">
            <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="text-xl font-bold text-green-800 mb-1">تم إرسال طلبك بنجاح!</h3>
              <p className="text-green-700">سيتم مراجعة طلبك من قبل فريقنا والتواصل معك قريباً.</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service Selection */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                نوع الخدمة <span className="text-red-500">*</span>
              </label>
              {loading ? (
                <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
              ) : (
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6F1A28] focus:ring-2 focus:ring-[#6F1A28]/20 outline-none transition-all text-lg"
                  required
                >
                  <option value="">اختر الخدمة المطلوبة</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              )}
              <p className="text-sm text-gray-500 mt-2">اختر نوع الخدمة التي تحتاجها</p>
            </div>

            {/* Beneficiary Name */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                اسم المستفيد <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.beneficiary_name}
                onChange={(e) => setFormData({ ...formData, beneficiary_name: e.target.value })}
                placeholder="مثال: مسجد النور، جمعية الخير، محمد أحمد..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6F1A28] focus:ring-2 focus:ring-[#6F1A28]/20 outline-none transition-all text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-2">اسم المسجد أو المؤسسة أو الشخص المستفيد</p>
            </div>

            {/* Contact Info */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                معلومات التواصل <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.beneficiary_contact}
                onChange={(e) => setFormData({ ...formData, beneficiary_contact: e.target.value })}
                placeholder="رقم الجوال أو البريد الإلكتروني"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6F1A28] focus:ring-2 focus:ring-[#6F1A28]/20 outline-none transition-all text-lg"
                required
              />
              <p className="text-sm text-gray-500 mt-2">رقم الجوال أو البريد الإلكتروني للتواصل معك</p>
            </div>

            {/* Details */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-2">
                تفاصيل الطلب
              </label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="اكتب تفاصيل إضافية عن احتياجاتك... مثال: نحتاج إلى 100 زجاجة ماء لتوزيعها على المصلين"
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-[#6F1A28] focus:ring-2 focus:ring-[#6F1A28]/20 outline-none transition-all text-lg resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">أضف أي تفاصيل إضافية تساعدنا على فهم احتياجاتك بشكل أفضل</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#6F1A28] text-white py-4 rounded-lg font-bold text-xl hover:bg-[#8d2e46] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  إرسال الطلب
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-3">ملاحظة هامة</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-2xl">•</span>
              <span>سيتم مراجعة طلبك من قبل فريقنا خلال 24-48 ساعة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">•</span>
              <span>سنقوم بالتواصل معك عبر معلومات التواصل المقدمة</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-2xl">•</span>
              <span>الرجاء التأكد من صحة معلومات التواصل</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
