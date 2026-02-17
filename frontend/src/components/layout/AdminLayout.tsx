import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import AdminSidebar from "../ui/AdminSidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
    const location = useLocation();

    const pageTitle = useMemo(() => {
        const pathname = location.pathname.toLowerCase();
        const titles: Record<string, string> = {
            "/admin": "لوحة الإدارة",
            "/admin/requests": "طلبات التطوع",
            "/admin/applications": "طلبات الانضمام",
            "/admin/management": "إدارة المتطوعين",
            "/admin/tasks": "إضافة مشروع",
            "/admin/ideas": "أفكار المشاريع",
            "/admin/reports": "التقارير",
            "/admin/service-requests": "طلبات الخدمات",
        };

        return titles[pathname] ?? "لوحة الإدارة";
    }, [location.pathname]);

    return (
        <div
            className="min-h-screen bg-gradient-to-r from-[#ab686f] to-[#e2b7a2] flex"
            style={{ direction: "rtl" }}
        >
            <AdminSidebar
                mobileOpen={mobileDrawerOpen}
                onMobileOpenChange={setMobileDrawerOpen}
                showMobileToggle={false}
            />

            <main className="flex-1 min-w-0 md:mr-64">
                <header className="sticky top-0 z-40 border-b border-white/30 bg-[#fdf8f9]/90 backdrop-blur-sm">
                    <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
                        <h1 className="text-[#4e2a35] font-bold text-base sm:text-lg font-[Cairo] truncate">
                            {pageTitle}
                        </h1>
                        <button
                            type="button"
                            onClick={() => setMobileDrawerOpen(true)}
                            className="md:hidden rounded-xl border border-[#cfaab3] bg-white/90 p-2 text-[#4e2a35] shadow-sm"
                            aria-label="فتح القائمة"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                <div className="px-4 sm:px-6 md:pr-4 md:pl-8 py-6">
                    <div className="w-full max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
