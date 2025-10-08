import Container from './Container';

export default function Navbar() {
  const handleLogin = () => {
    alert("تسجيل الدخول");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg transition-colors duration-200 ease-out cursor-pointer select-none"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            تسجيل الدخول
          </button>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8 space-x-reverse">
            <a 
              href="#projects" 
              className="text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-out cursor-pointer select-none"
            >
              المشاريع
            </a>
            <a 
              href="#services" 
              className="text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-out cursor-pointer select-none"
            >
              الخدمات
            </a>
            <a 
              href="#volunteers" 
              className="text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-out cursor-pointer select-none"
            >
              المتطوعين
            </a>
            <a 
              href="#about" 
              className="text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-out cursor-pointer select-none"
            >
              من نحن
            </a>
          </div>
        </div>
      </Container>
    </nav>
  );
}
