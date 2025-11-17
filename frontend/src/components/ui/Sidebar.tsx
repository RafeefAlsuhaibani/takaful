import type { ReactNode, JSX } from 'react';
import { Bell, Settings, Home, ClipboardList, ExternalLink, UserCircle } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

type MenuKey = 'home' | 'personal-info' | 'tasks' | 'settings' | 'takaful';

interface SidebarLayoutProps {
    children: ReactNode;
}

const menuItems = [
    { key: 'home' as MenuKey, label: 'الرئيسية', icon: Home, to: '/user/main', exact: true },
    { key: 'tasks' as MenuKey, label: 'المهام', icon: ClipboardList, to: '/user/tasks' },
    { key: 'personal-info' as MenuKey, label: 'المعلومات الشخصية', icon: UserCircle, to: '/user/personal-info', exact: true },
    { key: 'settings' as MenuKey, label: 'الإعدادات', icon: Settings, to: '/user/settings' },
];

export default function ArabicSidebar({ children }: SidebarLayoutProps): JSX.Element {
    return (
        <div className="min-h-screen bg-gray-50 flex" style={{ direction: 'rtl' }}>
            {/* Sidebar */}
            <div className="w-56 relative overflow-hidden rounded-3xl m-4 sticky top-4 self-start h-[calc(100vh-2rem)]">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e3d1d8] via-[#f5e6d3] to-[#fef3c7]"></div>

                {/* Content */}
                <div className="relative h-full flex flex-col p-3">
                    {/* Top Icons */}
                    <div className="flex justify-between items-center mb-4">
                        <button className="p-2 hover:bg-white/30 rounded-lg transition">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-white/30 rounded-lg transition">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-4">
                        {/* Avatar with border */}
                        <div className="relative mb-3">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#8D2E46] via-[#b07a7a] to-[#d4b896] p-1">
                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <h2 className="text-lg font-bold text-gray-800 mb-2">في صالح</h2>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 justify-center mb-1.5">
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] border border-teal-200">
                                تطوير المواقع
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] border border-purple-200">
                                التصميم
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-[10px] border border-gray-300">
                                UI / UX
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[10px] border border-pink-200">
                                جرافيك ثري 3D
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] border border-orange-200">
                                موشن جرافيك
                            </span>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <nav className="flex-1 space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            
                            return (
                                <NavLink
                                    key={item.key}
                                    to={item.to}
                                    end={item.exact}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2 backdrop-blur rounded-full transition-all ${
                                            isActive
                                                ? 'bg-white/90 text-gray-800 shadow-sm'
                                                : 'bg-transparent text-gray-500 hover:bg-white/40'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-base">{item.label}</span>
                                </NavLink>
                            );
                        })}

                        <a
                            href="/"
                            className="flex items-center gap-3 px-4 py-2 backdrop-blur rounded-full transition-all bg-transparent text-gray-500 hover:bg-white/40"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-base">صفحة تكافل</span>
                        </a>
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-auto pb-4">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-800 mb-1">تكافل</h3>
                            <button className="flex items-center gap-2 mx-auto text-gray-500 text-xs hover:text-gray-700 transition">
                                <span>تسجيل خروج</span>
                                <span>←</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 m-4">
                <div className="bg-white rounded-3xl h-full min-h-[calc(100vh-2rem)] border border-gray-200 shadow-sm p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
