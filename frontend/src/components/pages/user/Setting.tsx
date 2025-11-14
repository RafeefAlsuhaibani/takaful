import SidebarLayout from '../../ui/Sidebar';

export default function UserSettings() {
    return (
        <SidebarLayout>
            <div className="h-full flex items-center justify-center">
                <p className="text-xl font-semibold text-gray-800">
                    انت بصفحة الإعدادات الخاصة بالمستخدم
                </p>
            </div>
        </SidebarLayout>
    );
}
