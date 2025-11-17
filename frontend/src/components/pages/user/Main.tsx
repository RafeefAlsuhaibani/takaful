import SidebarLayout from '../../ui/Sidebar';

export default function UserMain() {
  return (
    <SidebarLayout>
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">مرحباً بك في صفحتك الرئيسية</h1>
          <p className="text-xl text-gray-600">
            يمكنك الوصول إلى معلوماتك الشخصية والمهام والإعدادات من القائمة الجانبية
          </p>
        </div>
      </div>
    </SidebarLayout>
  );
}
