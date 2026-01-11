import type { JSX } from "react";
import { Bell, Home, ClipboardList, ExternalLink, Users, Plus, FileText, UserCheck } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

type MenuKey = "home" | "add-project" | "volunteer-requests" | "volunteer-applications" | "volunteer-management" | "reports";

const menuItems = [
    { key: "home" as MenuKey, label: "الرئيسية", icon: Home, to: "/Admin", exact: true },
    { key: "add-project" as MenuKey, label: "اضافة مشروع", icon: Plus, to: "/Admin/tasks" },
    { key: "volunteer-requests" as MenuKey, label: "طلبات التطوع", icon: Users, to: "/Admin/requests" },
    { key: "volunteer-applications" as MenuKey, label: "طلبات الانضمام", icon: UserCheck, to: "/Admin/applications" },
    { key: "volunteer-management" as MenuKey, label: "ادارة المتطوعين", icon: ClipboardList, to: "/Admin/management" },
    { key: "reports" as MenuKey, label: "التقارير", icon: FileText, to: "/Admin/reports" },
];

export default function AdminSidebar(): JSX.Element {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/signin");
    };

    return (
        <aside
            className="fixed right-4 top-4 bottom-4 w-56 h-[calc(100vh-2rem)] z-10"
            style={{ direction: "rtl" }}
        >
            <div className="relative w-full h-full overflow-hidden rounded-3xl">
                {/* خلفية السايدبار */}
                <div className="absolute inset-0 bg-[#F3E3E3] shadow-sm" />

                {/* المحتوى */}
                <div className="relative h-full flex flex-col p-1">
                    {/* Top Icons */}
                    <div className="flex justify-between items-center m-2">
                        <button className="p-2 hover:bg-white rounded-xl transition">
                            <Bell className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Logo */}
                    <div className="flex flex-col items-center mb-8 mt-12">
                        <h2 className="text-4xl font-bold text-gray-800 mb-8">تكافل</h2>
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
                                        `flex items-center gap-4 px-6 py-3 backdrop-blur rounded-3xl transition-all ${isActive
                                            ? "bg-white/90 text-gray-800 shadow-sm"
                                            : "bg-transparent text-gray-500 hover:bg-white/40"
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
                            className="flex items-center gap-4 px-6 py-3 backdrop-blur rounded-full transition-all bg-transparent text-gray-500 hover:bg-white/40"
                        >
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-base">صفحة تكافل</span>
                        </a>
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-auto pb-4">
                        <div className="text-center">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 mx-auto text-gray-500 text-xs hover:text-gray-700 transition mb-4"
                            >
                                <span>تسجيل خروج</span>
                                <span>←</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
