import type { ReactNode } from "react";
import AdminSidebar from "../ui/AdminSidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div
            className="min-h-screen bg-gradient-to-r from-[#ab686f] to-[#e2b7a2] flex"
            style={{ direction: "rtl" }}
        >
            {/* Sidebar على اليمين */}
            <AdminSidebar />

            {/* محتوى الصفحات */}
            <main className="flex-1 pr-4 pl-8 py-8 mr-64">
                {/* كارد المحتوى – أكبر ومرتّب */}
                <div className="bg-[#FFF9F6] rounded-[32px] border border-white/60 shadow-[0_18px_40px_rgba(0,0,0,0.12)] px-10 py-8 max-w-6xl mx-auto min-h-[75vh]">
                    {children}
                </div>
            </main>
        </div>
    );
}
