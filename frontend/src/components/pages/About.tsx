import { useEffect, useState } from 'react';

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
      <section className="bg-gradient-to-b from-brand-600 to-brand-500 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              من نحن
            </h1>
            <p className="text-lg md:text-xl text-brand-100 max-w-3xl mx-auto leading-relaxed">
              منصة تكافل وأثر - رؤيتنا ورسالتنا في خدمة المجتمع
            </p>
          </div>
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
