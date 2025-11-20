import SidebarLayout from '../../ui/Sidebar';
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- Types ---------------- */
interface Task {
    text: string;
    done: boolean;
}

interface Project {
    id: number;
    title: string;
    association: string;
    description: string;
    progress: number;
    tasks: Task[];
    startDate: string;
    location: string;
    supervisor: string;
    duration: string;
}

interface DataType {
    [key: string]: Project[];
}

/* ---------------- Tabs ---------------- */
const tabs = ["قيد التنفيذ", "جديدة", "معلقة", "ملغية", "مكتملة"];

/* ---------------- Demo Data ---------------- */
const data: DataType = {
    "قيد التنفيذ": [
        {
            id: 1,
            title: "تطوير نظام متابعة المتطوعين",
            association: "جمعية تمكين",
            description: "إنشاء منصة لتسجيل وتتبع المتطوعين في البرامج الصيفية.",
            progress: 40,
            tasks: [
                { text: "تصميم واجهة تسجيل المتطوعين.", done: true },
                { text: "تطوير قاعدة البيانات.", done: true },
                { text: "إنشاء لوحة تحكم للمشرفين.", done: false },
                { text: "اختبار النظام.", done: false },
                { text: "رفع المشروع لتجربة.", done: false },
            ],
            startDate: "22 ربيع الأول",
            supervisor: "مها خالد",
            location: "مقر الجمعية",
            duration: "30 ساعة",
        },
        {
            id: 2,
            title: "اعادة تصميم مواقع تبرعات",
            association: "جمعية تمكين",
            description: "تحسين تجربة المستخدم لواجهة التبرع الأكتروني.",
            progress: 70,
            tasks: [
                { text: "تصميم الصفحة الرئيسية الجديدة.", done: true },
                { text: "تطوير صفحة الدفع.", done: true },
                { text: "ربط بوابة الدفع الأكتروني.", done: true },
                { text: "اختبار عملية الدفع.", done: false },
                { text: "رفع المشروع للتجربة.", done: false },
            ],
            startDate: "22 ربيع الأول",
            supervisor: "ساره محمد",
            location: "مقر الجمعية",
            duration: "24 ساعة",
        }
    ],

    "جديدة": [
        {
            id: 3,
            title: "اطلاق حملة تعريفية بالجمعية",
            association: "جمعية أفق",
            description: "تصميم صفحة بسيطة للتعريف بالجمعية وأنشطتها الأساسية.",
            progress: 0,
            tasks: [
                { text: "تصميم الصفحة الرئيسية الجديدة.", done: false },
                { text: "تصميم واجهة الصفحة التعريفية.", done: false },
                { text: "اضافة صور وأنشطة الجمعية", done: false },
                { text: "تجهيز نموذج \"تواصل معنا\".", done: false },
            ],
            startDate: "10 جمادى الأخر",
            supervisor: "محمد العتيبي",
            location: "مقر الجمعية",
            duration: "40 ساعة",
        }
    ],

    "معلقة": [
        {
            id: 4,
            title: "تطوير تطبيق متابعةالتبرعات",
            association: "جمعية الزاد الخيرية",
            description: "بناء تطبيق مبدئي لتتبع حالة التبرعات الشهرية للمستفدين.",
            progress: 80,
            tasks: [
                { text: "اعداد واجهة تسجيل دخول.", done: true },
                { text: "تصميم صفحة لوحة التحكم.", done: true },
                { text: "ربط قاعدة بيانات التجارب.", done: true },
                { text: "اختبار نسخة اولية.", done: false },
            ],
            startDate: "25 جمادى الاخر",
            supervisor: "ساره العتيبي",
            location: "مقر الجمعية",
            duration: "28 ساعة",
        }
    ],

    "ملغية": [{
        id: 5,
        title: "تطوير تطبيق متابعةالتبرعات",
        association: "جمعية الزاد الخيرية",
        description: "بناء تطبيق مبدئي لتتبع حالة التبرعات الشهرية للمستفدين.",
        progress: 80,
        tasks: [
            { text: "اعداد واجهة تسجيل دخول.", done: true },
            { text: "تصميم صفحة لوحة التحكم.", done: true },
            { text: "ربط قاعدة بيانات التجارب.", done: true },
            { text: "اختبار نسخة اولية.", done: false },
        ],
        startDate: "25 جمادى الاخر",
        supervisor: "ساره العتيبي",
        location: "مقر الجمعية",
        duration: "28 ساعة",
    }],

    "مكتملة": [{
        id: 4,
        title: "تطوير موقع الأسر المنتجة",
        association: "جمعية الوفاء النسائية",
        description: "اعادة تصميم الموقع الأكتروني لعرض منتجات الأسر المنتجة بشكل عصري.",
        progress: 100,
        tasks: [],
        startDate: "25 جمادى الاخر",
        supervisor: "ساره العتيبي",
        location: "مقر الجمعية",
        duration: "28 ساعة",
    }],
};

/* ---------------- Hijri Helpers ---------------- */
function getHijriParts(date: Date) {
    const formatter = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
    });

    const parts = formatter.formatToParts(date);

    const convertArabicNumber = (str: string) =>
        Number(str.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()));

    return {
        hy: convertArabicNumber(parts.find((p) => p.type === "year")?.value ?? "0"),
        hm: convertArabicNumber(parts.find((p) => p.type === "month")?.value ?? "0"),
        hd: convertArabicNumber(parts.find((p) => p.type === "day")?.value ?? "0"),
    };
}

function generateHijriMonthDates(hYear: number, hMonth: number) {
    const found: Date[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 120);

    for (let i = 0; i < 260; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const { hy, hm } = getHijriParts(d);
        if (hy === hYear && hm === hMonth) found.push(new Date(d));
    }

    return found.sort((a, b) => a.getTime() - b.getTime());
}

function jsWeekdayToFigmaIndex(js: number) {
    const map: Record<number, number> = {
        5: 0,
        6: 1,
        0: 2,
        1: 3,
        2: 4,
        3: 5,
        4: 6,
    };
    return map[js];
}

/* ---------------- Component ---------------- */
export default function Tasks() {
    const [activeTab, setActiveTab] = useState("قيد التنفيذ");

    const [showPopup, setShowPopup] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

    const [showWithdrawPopup, setShowWithdrawPopup] = useState(false);
    const [withdrawProjectId, setWithdrawProjectId] = useState<number | null>(null);
    const [withdrawProjectTab, setWithdrawProjectTab] = useState<string | null>(null);

    /* Tasks state */
    const [tasksState, setTasksState] = useState<DataType>(() => {
        const copy: DataType = {};
        for (const tab in data) {
            copy[tab] = data[tab].map((p) => ({
                ...p,
                tasks: p.tasks.map((t) => ({ ...t })),
            }));
        }
        return copy;
    });

    /* Hijri Calendar state */
    const today = new Date();
    const todayHijri = getHijriParts(today);

    const [currentHijriMonth, setCurrentHijriMonth] = useState(todayHijri.hm);
    const [currentHijriYear, setCurrentHijriYear] =
        useState(todayHijri.hy);

    const deadlines = [5, 12, 30];

    const monthNamesHijri = [
        "محرم", "صفر", "ربيع الأول", "ربيع الثاني",
        "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان",
        "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
    ];

    const monthDates = useMemo(
        () => generateHijriMonthDates(currentHijriYear, currentHijriMonth),
        [currentHijriYear, currentHijriMonth]
    );

    const gridDays = useMemo(() => {
        if (!monthDates.length) return [];

        const firstDate = monthDates[0];
        const firstIndex = jsWeekdayToFigmaIndex(firstDate.getDay());

        const days: (number | null)[] = Array(firstIndex).fill(null);

        for (const d of monthDates) {
            days.push(getHijriParts(d).hd);
        }

        while (days.length % 7 !== 0) days.push(null);
        return days;
    }, [monthDates]);

    /* Calendar handlers */
    const handlePrevHijri = () => {
        if (currentHijriMonth === 1) {
            setCurrentHijriMonth(12);
            setCurrentHijriYear((y) => y - 1);
        } else {
            setCurrentHijriMonth((m) => m - 1);
        }
    };

    const handleNextHijri = () => {
        if (currentHijriMonth === 12) {
            setCurrentHijriMonth(1);
            setCurrentHijriYear((y) => y + 1);
        } else {
            setCurrentHijriMonth((m) => m + 1);
        }
    };

    /* Withdraw handlers */
    const handleOpenWithdrawPopup = (projectId: number) => {
        setWithdrawProjectId(projectId);
        setWithdrawProjectTab(activeTab);
        setShowWithdrawPopup(true);
    };

    const handleConfirmWithdraw = () => {
        if (!withdrawProjectId || !withdrawProjectTab) return;

        setTasksState((prev) => {
            const newState: DataType = {};

            for (const key in prev) {
                newState[key] = prev[key].map((p) => ({
                    ...p,
                    tasks: p.tasks.map((t) => ({ ...t })),
                }));
            }

            newState[withdrawProjectTab] = newState[withdrawProjectTab].filter(
                (p) => p.id !== withdrawProjectId
            );

            return newState;
        });

        setShowWithdrawPopup(false);
        setWithdrawProjectId(null);
        setWithdrawProjectTab(null);
    };

    /* Progress popup */
    const handleOpenPopup = (projectId: number) => {
        setSelectedProjectId(projectId);
        setShowPopup(true);
    };

    const handleToggleTask = (taskIndex: number) => {
        if (selectedProjectId === null) return;

        setTasksState((prev) => {
            const newState: DataType = {};

            for (const key in prev) {
                newState[key] = prev[key].map((p) => ({
                    ...p,
                    tasks: p.tasks.map((t) => ({ ...t })),
                }));
            }

            const list = newState[activeTab];
            const index = list.findIndex((p) => p.id === selectedProjectId);
            if (index === -1) return newState;

            const project = list[index];
            project.tasks[taskIndex].done = !project.tasks[taskIndex].done;

            const completed = project.tasks.filter((t) => t.done).length;
            const total = project.tasks.length;
            project.progress = Math.round((completed / total) * 100);

            return newState;
        });
    };

    const handleSaveProgress = () => {
        if (!selectedProjectId) return;

        setTasksState((prev) => {
            const newState: DataType = {};
            for (const key in prev) {
                newState[key] = prev[key].map((p) => ({
                    ...p,
                    tasks: p.tasks.map((t) => ({ ...t })),
                }));
            }

            const list = newState[activeTab];
            const index = list.findIndex((p) => p.id === selectedProjectId);
            if (index === -1) return newState;

            const project = list[index];

            if (project.progress === 100) {
                newState[activeTab] = newState[activeTab].filter(
                    (p) => p.id !== project.id
                );
                newState["مكتملة"].push(project);
            }

            if (project.progress < 100 && activeTab === "مكتملة") {
                newState["مكتملة"] = newState["مكتملة"].filter(
                    (p) => p.id !== project.id
                );
                newState["قيد التنفيذ"].push(project);
            }

            return newState;
        });

        setShowPopup(false);
    };

    const selectedProject = selectedProjectId
        ? tasksState[activeTab]?.find((p) => p.id === selectedProjectId)
        : null;

    const badgeColors: Record<string, string> = {
        "قيد التنفيذ": "bg-blue-100 text-blue-700 border-blue-200",
        "جديدة": "bg-green-100 text-green-700 border-green-200",
        "معلقة": "bg-yellow-100 text-yellow-700 border-yellow-200",
        "ملغية": "bg-gray-100 text-gray-700 border-gray-200",
        "مكتملة": "font-bold text-[#6F1A28]",
    };


    return (
        <SidebarLayout>
            <div className="h-full w-full overflow-auto bg-gray-50">

                {/* Popup Modal */}
                {showPopup && selectedProject && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowPopup(false)}
                    >
                        <div
                            className="bg-white rounded-3xl p-8 w-[500px] shadow-2xl border-4 border-[#C49FA3]"
                            onClick={(e) => e.stopPropagation()}
                            style={{ direction: "rtl" }}
                        >
                            <h2 className="text-2xl font-bold text-[#8D2E46] mb-4">
                                تحديث التقدم
                            </h2>

                            <h3 className="text-lg font-semibold text-[#6F1A28] mb-6">
                                {selectedProject.title}
                            </h3>

                            <div className="space-y-3 mb-6">
                                {selectedProject.tasks.map((task, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 bg-gradient-to-br from-[#e3d1d8] to-[#fef3c7] rounded-xl cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={task.done}
                                            onChange={() => handleToggleTask(idx)}
                                            className="w-5 h-5 accent-[#8D2E46] cursor-pointer"
                                        />

                                        <span
                                            className={`text-sm ${task.done ? "line-through text-gray-400" : "text-[#6F1A28]"
                                                }`}
                                        >
                                            {task.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-full h-4 overflow-hidden mb-3">
                                <div
                                    style={{
                                        width: `${selectedProject.progress}%`,
                                        backgroundColor: "#E8C150",
                                    }}
                                    className="h-4 rounded-full transition-all duration-300"
                                />
                            </div>

                            <p className="text-center text-sm font-bold text-[#6F1A28] mb-6">
                                التقدم: {selectedProject.progress}%
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleSaveProgress}
                                    className="px-6 py-2 bg-gradient-to-r from-[#a83451ff] to-[#E4B106] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    حفظ
                                </button>
                                <button
                                    onClick={() => setShowPopup(false)}
                                    className="px-6 py-2 border-2 border-[#86676A] text-[#86676A] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdraw Popup */}
                {showWithdrawPopup && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                        onClick={() => setShowWithdrawPopup(false)}
                    >
                        <div
                            className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl border-4 border-[#C49FA3]"
                            style={{ direction: "rtl" }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-2xl font-bold text-[#8D2E46] mb-4 text-center">
                                تأكيد الانسحاب
                            </h2>

                            <p className="text-center text-[#6F1A28] mb-8">
                                هل أنت متأكد من رغبتك في الانسحاب من هذا المشروع؟
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={handleConfirmWithdraw}
                                    className="px-6 py-2 bg-gradient-to-r from-[#a83451ff] to-[#E4B106] 
                                    text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                                >
                                    نعم، انسحب
                                </button>

                                <button
                                    onClick={() => setShowWithdrawPopup(false)}
                                    className="px-6 py-2 border-2 border-[#86676A] 
                                    text-[#86676A] rounded-lg text-sm font-medium 
                                    hover:bg-gray-50 transition-colors"
                                >
                                    إلغاء
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* MAIN */}
                <div className="h-full ">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8" style={{ direction: "rtl" }}>

                        {/* TOP CARDS */}
                        <div className="w-[600px] bg-white border-4 border-[#C49FA3] rounded-3xl p-6 shadow-md flex justify-between mt-4 items-center order-2 lg:order-1">

                            <div className="flex flex-col items-center flex-1">
                                <div className="text-3xl font-bold text-[#8D2E46]">22 ربيع الآخرة</div>
                                <div className="text-sm text-gray-600">أقرب موعد نهائي</div>
                            </div>

                            <div className="w-px h-12 bg-[#C49FA3]" />

                            <div className="flex flex-col items-center flex-1">
                                <div className="text-3xl font-bold text-[#8D2E46]">7</div>
                                <div className="text-sm text-gray-600">إجمالي المهام المنجزة</div>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="w-[390px] mr-16 flex items-center relative order-1 lg:order-2">
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                                <Search className="text-gray-500 w-6 h-5" />
                            </div>

                            <input
                                type="text"
                                placeholder="البحث ..."
                                className="w-full bg-gradient-to-b from-[#e3d1d8] to-[#fef3c7] rounded-full pr-12 pl-4 py-3 
                                text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C49FA3]"
                            />
                        </div>
                    </div>


                    <div className="w-full grid grid-cols-12 gap-10" style={{ direction: "rtl" }}>

                        {/* Calendar */}
                        <div className="col-span-6 order-2">
                            <div className="w-[470px] bg-white border-4 border-[#C49FA3] rounded-3xl p-6 shadow-md">

                                <div className="flex items-center justify-between mb-3">
                                    <button onClick={handlePrevHijri}>
                                        <ChevronRight className="w-6 h-6 text-[#6E6D6D]" />
                                    </button>

                                    <div className="text-lg font-bold text-[#4E4A4B]">
                                        {monthNamesHijri[currentHijriMonth - 1]} {currentHijriYear}
                                    </div>

                                    <button onClick={handleNextHijri}>
                                        <ChevronLeft className="w-7 h-6 text-[#6E6D6D]" />
                                    </button>
                                </div>

                                <div className="w-full h-[1px] bg-[#D0A9B3] mb-4"></div>

                                <div className="grid grid-cols-7 text-center mb-3">
                                    {["خميس", "أربعاء", "ثلاث", "اثنين", "أحد", "سبت", "جمعة"].map((d) => (
                                        <div key={d} className="text-sm font-semibold text-[#6E6D6D]">
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-7 gap-1">
                                    {gridDays.map((d, i) => {
                                        const isToday =
                                            d === todayHijri.hd &&
                                            currentHijriMonth === todayHijri.hm &&
                                            currentHijriYear === todayHijri.hy;

                                        return (
                                            <div
                                                key={i}
                                                className={`h-10 flex items-center justify-center rounded-lg text-sm relative
                                                ${!d ? "text-transparent" : ""}
                                                ${isToday ? "bg-[#8D2E46] text-white font-bold" : "text-[#4E4A4B]"}`}
                                            >
                                                {d ?? ""}

                                                {d && deadlines.includes(d) && (
                                                    <span className="absolute w-3 h-3 bg-[#E4B106]/30 rounded-full bottom-1 right-1"></span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="col-span-6">
                            <div className="border-b-0 border-[#C49FA3] bg-gradient-to-l from-[#e3d1d8] via-[#f5e6d3] to-[#fef3c7] rounded-t-2xl flex overflow-x-auto shadow-lg">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`
                                                 w-[470px] py-3 px-6 text-sm font-medium transition-all duration-200
                                                     ${activeTab === tab ? `
                                                 bg-white text-[#291613] border-x-4 border-t-4 border-[#C49FA3] rounded-t-2xl shadow-sm`
                                                : `text-[#7f6f6f] border-b-4 border-[#C49FA3]`
                                            }`
                                        }>
                                        {tab}
                                    </button>

                                ))}
                            </div>

                            <div className="bg-white rounded-b-2xl border-4 border-[#C49FA3] border-t-0 p-6 space-y-6">
                                {tasksState[activeTab]?.length ? (
                                    tasksState[activeTab].map((project) => (
                                        <div
                                            key={project.id}
                                            className={`bg-gradient-to-br from-[#e3d1d8] to-[#fef3c7] rounded-2xl p-6 shadow-sm
                                            ${activeTab === "ملغية"
                                                    ? "line-through text-gray-400 opacity-70"
                                                    : ""
                                                }`}
                                        >
                                            <div className="w-[470px] grid lg:grid-cols-2 gap-4">
                                                <h3 className="font-bold text-lg text-[#6F1A28] mb-1">
                                                    {project.title}
                                                </h3>

                                                <div className="flex items-center justify-between">
                                                    <span
                                                        className={`mr-[150px] text-xs px-3 py-1 rounded-full border 
                                                        ${badgeColors[activeTab] ||
                                                            "bg-gray-100 text-gray-700 border-gray-200"
                                                            }`}
                                                    >
                                                        {activeTab}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-sm font-medium text-[#6F1A28] mb-2">
                                                {project.association}
                                            </p>

                                            <p className="text-xs text-[#6F1A28] mb-4">
                                                {project.description}
                                            </p>

                                            <div className="bg-white rounded-full h-3 overflow-hidden mb-2">
                                                <div
                                                    style={{
                                                        width: `${project.progress}%`,
                                                        backgroundColor: "#E8C150",
                                                    }}
                                                    className="h-3 rounded-full"
                                                />
                                            </div>

                                            <p className="text-xs mb-4 font-medium text-[#6F1A28]">
                                                التقدم {project.progress}%
                                            </p>

                                            <div className="bg-white/50 rounded-2xl p-3 mb-4">
                                                <p className="text-xs font-bold text-[#6F1A28] mb-1">
                                                    المهام الفرعية:
                                                </p>

                                                <ul className="text-xs text-[#6F1A28] space-y-1">
                                                    {project.tasks.map((task, idx) => (
                                                        <li
                                                            key={idx}
                                                            className={`flex gap-2 ${task.done
                                                                ? "line-through text-gray-400"
                                                                : ""
                                                                }`}
                                                        >
                                                            • {task.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="flex text-xs text-[#6F1A28] gap-6 mb-4">
                                                <span>📅 {project.startDate}</span>
                                                <span>👤 {project.supervisor}</span>
                                                <span>📍 {project.location}</span>
                                                <span>⏰ {project.duration}</span>
                                            </div>

                                            <div className="flex gap-3 ">
                                                {activeTab !== "ملغية" &&
                                                    activeTab !== "مكتملة" && (
                                                        <button
                                                            onClick={() =>
                                                                handleOpenPopup(project.id)
                                                            }
                                                            className="px-4 py-2 bg-gradient-to-r from-[#a83451ff] to-[#E4B106] text-white rounded-lg text-xs hover:opacity-90 transition-opacity"
                                                        >
                                                            تحديث التقدم
                                                        </button>
                                                    )}

                                                {activeTab !== "ملغية" &&
                                                    activeTab !== "مكتملة" && (
                                                        <button
                                                            onClick={() =>
                                                                handleOpenWithdrawPopup(
                                                                    project.id
                                                                )
                                                            }
                                                            className="px-4 py-2 border-2 border-[#86676A] text-[#86676A] rounded-lg text-xs hover:bg-gray-50 transition-colors"
                                                        >
                                                            انسحاب
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-400 py-10">
                                        لا توجد مهام في هذا التبويب.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>
    );
}
