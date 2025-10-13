import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../ui/Icon';
import UserProfileDropdown from '../ui/UserProfileDropdown';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleLogin = () => {
    navigate('/signin');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 py-3">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - FAR LEFT */}
          <Link 
            to="/" 
            className="focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg"
            aria-label="تكافل وأثر - الصفحة الرئيسية"
          >
            <img 
              src="/logo.png" 
              alt="تكافل" 
              className="h-7 md:h-8 w-auto select-none"
            />
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8 space-x-reverse">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 ease-out hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 ${
                location.pathname === '/' ? 'text-brand-700' : 'text-gray-700'
              }`}
            >
              الصفحة الرئيسية
            </Link>
            <Link 
              to="/projects" 
              className={`text-sm font-medium transition-colors duration-200 ease-out hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 ${
                location.pathname === '/projects' ? 'text-brand-700' : 'text-gray-700'
              }`}
            >
              المشاريع
            </Link>
                <Link 
                  to="/services" 
                  className={`text-sm font-medium transition-colors duration-200 ease-out hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 ${
                    location.pathname === '/services' ? 'text-brand-700' : 'text-gray-700'
                  }`}
                >
                  الخدمات
                </Link>
            <Link 
              to="/volunteers" 
              className={`text-sm font-medium transition-colors duration-200 ease-out hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 ${
                location.pathname === '/volunteers' ? 'text-brand-700' : 'text-gray-700'
              }`}
            >
              المتطوعين
            </Link>
            <Link 
              to="/about" 
              className="text-sm font-medium text-gray-700 hover:text-brand-700 focus-visible:ring-2 ring-brand-600 ring-offset-2 rounded-lg px-3 py-2 transition-colors duration-200 ease-out"
            >
              من نحن
            </Link>
          </div>

          {/* Login/User Button - FAR RIGHT */}
          {isAuthenticated ? (
            <UserProfileDropdown userName={user?.name || ''} userRole={user?.role || 'user'} />
          ) : (
            <button
              onClick={handleLogin}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 ring-brand-600 ring-offset-2 flex items-center gap-2"
            >
              <Icon name="User" size={16} />
              تسجيل الدخول
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
