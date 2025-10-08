import Container from './Container';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">من نحن</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              منصة تكافل وأثر تهدف إلى ربط المحتاجين بالمتبرعين والمتطوعين لصنع أثر إيجابي في المجتمع.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors duration-200 ease-out text-sm cursor-pointer select-none">
                  الرئيسية
                </a>
              </li>
              <li>
                <a href="#projects" className="text-gray-300 hover:text-white transition-colors duration-200 ease-out text-sm cursor-pointer select-none">
                  المشاريع
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-white transition-colors duration-200 ease-out text-sm cursor-pointer select-none">
                  الخدمات
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-200 ease-out text-sm cursor-pointer select-none">
                  من نحن
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-200 ease-out text-sm cursor-pointer select-none">
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>البريد الإلكتروني: info@takafol-athar.com</p>
              <p>الهاتف: +966 50 123 4567</p>
              <p>العنوان: الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 منصة تكافل وأثر. جميع الحقوق محفوظة.
          </p>
        </div>
      </Container>
    </footer>
  );
}
