import { useEffect, useState } from 'react';
import { HeartHandshake } from 'lucide-react';

export default function About() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-pulseSoft rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative isolate text-white bg-gradient-to-b from-brand-700 via-brand-600 to-brand-500 py-20 md:py-28">
        {/* تأثير الإضاءة */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            background:
              'radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,.18), transparent 60%)',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="animate-slideUp">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              من نحن
            </h1>
            <p className="mt-4 mx-auto flex items-center justify-center gap-2 max-w-3xl text-base md:text-lg text-white/85 leading-relaxed">
              منصة تكافل وأثر - رؤيتنا ورسالتنا في خدمة المجتمع
              <HeartHandshake
                size={22}
                style={{ color: '#DFC775' }}
                className="shrink-0"
                aria-hidden="true"
              />
            </p>
          </div>
        </div>

        {/* الموجة الزخرفية تحت الهيرو */}
        <div className="absolute -bottom-px left-0 right-0 h-10" aria-hidden>
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-full"
            style={{ transform: 'scaleY(-1)' }}
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              fill="#f7f7f7"
            />
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              fill="#f7f7f7"
            />
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              fill="#fffcfcff"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 animate-fadeIn">
            <div className="text-right space-y-8">
              {/* Title */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  عن منصة تكافل وأثر
                </h2>
              </div>

              {/* Main Content */}
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                <p className="text-lg md:text-xl mb-6 leading-8">
                  منصة تكافل وأثر هي منصة إلكترونية ابتكارية تابعة لإدارة التكافل المجتمعي في جمعية الزاد، تهدف إلى تحويل قيمة التكافل الاجتماعي إلى أثرٍ ملموس من خلال منظومة رقمية تجمع بين العمل الخيري، والتمكين، والشفافية.
                </p>

                <p className="text-lg md:text-xl leading-8">
                  تتيح المنصة للزوار التعرف على البرامج والمشاريع التكافلية التي تنفذها الجمعية، والمشاركة عبر التبرع المالي أو الدعم العيني أو التطوع، ومتابعة أثر المساهمة من خلال لوحات بيانات تفاعلية، إضافة إلى كونها حاضنة مستقبلية لدعم المبادرات التكافلية النوعية على مستوى منطقة القصيم ثم المملكة.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-brand-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">التكافل الاجتماعي</h3>
                  <p className="text-gray-600 text-sm">تحويل قيمة التكافل إلى أثر ملموس</p>
                </div>

                <div className="bg-brand-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💻</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">المنظومة الرقمية</h3>
                  <p className="text-gray-600 text-sm">تجمع بين العمل الخيري والتمكين والشفافية</p>
                </div>

                <div className="bg-brand-50 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">الشفافية</h3>
                  <p className="text-gray-600 text-sm">متابعة الأثر من خلال لوحات بيانات تفاعلية</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-xl p-8 mt-12 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  انضم إلينا في رحلة التكافل والأثر
                </h3>
                <p className="text-gray-700 mb-6">
                  كن جزءاً من التغيير الإيجابي في المجتمع
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/projects"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    استكشف المشاريع
                  </a>
                  <a
                    href="/suggest"
                    className="border border-brand-600 text-brand-600 hover:bg-brand-600 hover:text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
                  >
                    شارك اقتراحك
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
