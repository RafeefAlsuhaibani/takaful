import { useEffect, useMemo, useState } from 'react';
import Button from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';
import { API_BASE_URL } from '../../config';

interface Service {
  id: number;
  title: string;
}

interface WaterSupplyFormData {
  beneficiary_name: string;
  beneficiary_contact: string;
  details: string;
}

const WATER_SUPPLY_KEYWORDS = ['water supply', 'سقيا ماء', 'سقيا', 'الماء', 'مشروع السقيا'];

const normalizeText = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, ' ');

const isWaterSupplyService = (title: string) => {
  const normalizedTitle = normalizeText(title);
  return WATER_SUPPLY_KEYWORDS.some((keyword) => normalizedTitle.includes(normalizeText(keyword)));
};

export default function WaterSupplyRequestPage() {
  const { success, error } = useToast();

  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<WaterSupplyFormData>({
    beneficiary_name: '',
    beneficiary_contact: '',
    details: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoadingServices(true);
        const response = await fetch(`${API_BASE_URL}/api/public-services/`);

        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        setServices(data.results || data);
      } catch (fetchError) {
        console.error('Error fetching services:', fetchError);
        error({
          title: 'تعذر تحميل الخدمات',
          description: 'حاول إعادة تحميل الصفحة لاحقاً.',
          duration: 4000,
        });
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [error]);

  const waterSupplyService = useMemo(
    () => services.find((service) => isWaterSupplyService(service.title)),
    [services]
  );

  const isSubmitDisabled = loadingServices || isSubmitting || !waterSupplyService;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!waterSupplyService) {
      error({
        title: 'خدمة سقيا الماء غير متاحة حالياً',
        description: 'يرجى التواصل مع الإدارة لإضافة الخدمة أولاً.',
        duration: 4000,
      });
      return;
    }

    if (!formData.beneficiary_name || !formData.beneficiary_contact) {
      error({
        title: 'الرجاء ملء الحقول المطلوبة',
        description: 'الاسم ومعلومات التواصل حقول إلزامية.',
        duration: 4000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${API_BASE_URL}/api/public-service-request/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: waterSupplyService.id,
          beneficiary_name: formData.beneficiary_name,
          beneficiary_contact: formData.beneficiary_contact,
          details: formData.details,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit water supply request');
      }

      success({
        title: 'تم إرسال طلب سقيا الماء بنجاح',
        description: 'سيتم مراجعة طلبك والتواصل معك قريباً.',
        duration: 5000,
      });

      setFormData({
        beneficiary_name: '',
        beneficiary_contact: '',
        details: '',
      });
    } catch (submitError) {
      console.error('Error submitting water supply request:', submitError);
      error({
        title: 'حدث خطأ أثناء إرسال الطلب',
        description: 'لم يتم إرسال الطلب، حاول مرة أخرى.',
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <section className="bg-gradient-to-b from-brand-600 to-brand-500 text-white py-10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">طلب سقيا ماء</h1>
          <p className="mt-3 text-base md:text-lg text-brand-100">
            املأ النموذج التالي لرفع طلب خدمة سقيا الماء.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-4 md:p-6 space-y-5">
          {loadingServices && (
            <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm text-gray-600">
              جارٍ التحقق من توفر خدمة سقيا الماء...
            </div>
          )}

          {!loadingServices && !waterSupplyService && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
              خدمة سقيا الماء غير موجودة حالياً ضمن الخدمات المتاحة، لذلك تم تعطيل الإرسال.
            </div>
          )}

          {!loadingServices && waterSupplyService && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
              الخدمة المحددة: {waterSupplyService.title}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="beneficiary_name" className="text-sm font-medium text-gray-700">
                اسم المستفيد <span className="text-red-500">*</span>
              </label>
              <input
                id="beneficiary_name"
                type="text"
                value={formData.beneficiary_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, beneficiary_name: e.target.value }))}
                placeholder="مثال: مسجد النور"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFC775] focus:border-[#DFC775]"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="beneficiary_contact" className="text-sm font-medium text-gray-700">
                معلومات التواصل <span className="text-red-500">*</span>
              </label>
              <input
                id="beneficiary_contact"
                type="text"
                value={formData.beneficiary_contact}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, beneficiary_contact: e.target.value }))
                }
                placeholder="رقم الجوال أو البريد الإلكتروني"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFC775] focus:border-[#DFC775]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="details" className="text-sm font-medium text-gray-700">
              تفاصيل الطلب
            </label>
            <textarea
              id="details"
              rows={5}
              value={formData.details}
              onChange={(e) => setFormData((prev) => ({ ...prev, details: e.target.value }))}
              placeholder="مثال: نحتاج سقيا ماء لعدد 100 مستفيد يوم الجمعة."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DFC775] focus:border-[#DFC775] resize-none"
            />
          </div>

          <Button type="submit" variant="outlineGold" size="lg" className="w-full" disabled={isSubmitDisabled}>
            {isSubmitting ? 'جاري الإرسال...' : 'إرسال طلب سقيا الماء'}
          </Button>
        </form>
      </section>
    </div>
  );
}
