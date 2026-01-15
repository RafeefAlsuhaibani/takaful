import React, { useState, useEffect } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { FiSearch } from "react-icons/fi";
import {
    Mail,
    Phone,
    MapPin,
    Star,
    Check,
    Square,
    ChevronDown,
    Pencil,
    Trash2,
    Save,
    User,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";  // ✅ ADD THIS LINE
import { API_BASE_URL } from "../../../config";  // ✅ ADD THIS LINE TOO

//
// أنواع البيانات
//
interface StatItem {
    id: string;
    label: string;
    value: string;
    icon: string;
    iconAlt: string;
}

interface Volunteer {
    id: number;  // ✅ ADD
    name: string;
    email: string;
    phone: string;
    status: string;
    skills: string[];
    available_days: string[];
    completed_tasks: number;  // CHANGE from completedTasks
    current_tasks: number;  //  CHANGE from currentTasks
    rating: number;
    join_date: string;  //  CHANGE from joinDate
    current_projects: string[];  //  CHANGE from currentProjects
    location: string;
    volunteer_hours: number;  //  CHANGE from volunteerHours
}

interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

interface Task {
    
        id: number;  //  CHANGE from string
        title: string;
        project_name: string;  //  CHANGE from project
        volunteer_name: string | null;  //  CHANGE from volunteerName
        volunteer_id: number | null;  // ADD
        status: string;
        priority: string;
        due_date: string;  //  CHANGE from dueDate
        hours: number;
        progress: number;
        description?: string;
        subtasks?: Subtask[];
    }

//
// هيلبرز
//
const getCityFromLocation = (location: string) =>
    location.split("-")[0].trim();

const getInitial = (name: string) => name.trim().charAt(0);

const getStatusClasses = (status: string) => {
    switch (status) {
        case "مكتملة":
            return "bg-[#d5f3df] text-[#1d6b3a]";
        case "قيد التنفيذ":
            return "bg-[#e0ecff] text-[#155fa0]";
        case "في الانتظار":
            return "bg-[#fff3c9] text-[#a67912]";
        case "معلقة":
            return "bg-[#f3e8ff] text-[#6b3aa7]";
        default:
            return "bg-[#e4e0e1] text-[#6b6567]";
    }
};

const getProgressBarColor = () => "#c87981";

//
// بيانات ابتدائية
//


//
// كارد الإحصائيات
//
const ProjectOverviewSection: React.FC<{ stats: any }> = ({ stats }) => {
    const statsData: StatItem[] = [
        {
            id: "total-volunteers",
            label: "اجمالي المتطوعين",
            value: stats.total_volunteers?.toString() || "0",
            icon: "https://c.animaapp.com/u4OaXzk0/img/multiple-neutral-2-streamline-ultimate-regular@2x.png",
            iconAlt: "People",
        },
        {
            id: "active-volunteers",
            label: "المتطوعين النشطين",
            value: stats.active_volunteers?.toString() || "0",
            icon: "https://c.animaapp.com/u4OaXzk0/img/famicons-star-outline.svg",
            iconAlt: "Star",
        },
        {
            id: "total-hours",
            label: "اجمالي الساعات",
            value: stats.total_hours?.toString() || "0",
            icon: "https://c.animaapp.com/u4OaXzk0/img/time-clock-file-setting-streamline-ultimate-regular@2x.png",
            iconAlt: "Clock",
        },
        {
            id: "completed-tasks",
            label: "المهام المكتملة",
            value: stats.completed_tasks?.toString() || "0",
            icon: "https://c.animaapp.com/u4OaXzk0/img/list-to-do-streamline-ultimate-regular@2x.png",
            iconAlt: "Checkmark",
        },
    ];

    return (
        <section
            aria-labelledby="volunteer-stats-heading"
            dir="rtl"
            className="w-full bg-[#f3e3e3] rounded-[19px] shadow-[0px_3px_25px_#8d2e4673] px-8 py-7 space-y-6"
        >
            <div className="flex justify-center">
                <h2
                    id="volunteer-stats-heading"
                    className="font-bold text-[#2e2b2c] text-[24px] md:text-[32px] text-center font-[Cairo]"
                >
                    احصائيات المتطوعين
                </h2>
            </div>

            <div className="w-[80%] mx-auto h-[2px] bg-[#e0cfd4] opacity-80" />

            <div className="mt-4 flex flex-col md:flex-row items-stretch justify-between gap-8">
                {statsData.map((stat, index) => (  // ✅ CHANGED from stats.map to statsData.map
                    <div
                        key={stat.id}
                        className="flex-1 flex flex-col items-center gap-3 relative"
                    >
                        {index > 0 && (
                            <span className="hidden md:block absolute top-2 bottom-2 left-full w-px bg-[#d2b8c0]" />
                        )}

                        <img
                            src={stat.icon}
                            alt={stat.iconAlt}
                            className="w-[58px] h-[58px] object-contain"
                        />

                        <div className="text-[26px] md:text-[32px] font-bold text-[#8d2e46] leading-none">
                            {stat.value}
                        </div>

                        <div className="text-sm md:text-base text-[#2e2b2c] font-medium text-center font-[Cairo]">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
//
// تبويب المهام والمتطوعين
//
interface TasksVolunteersTabsProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    volunteers: Volunteer[];
    onTaskUpdate: () => void;
}

const TasksVolunteersTabs: React.FC<TasksVolunteersTabsProps> = ({
    tasks,
    setTasks,
    volunteers,
    onTaskUpdate,
}) => {
    const [activeTab, setActiveTab] = useState<"tasks" | "volunteers">(
        "volunteers"
    );

    const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(
        null
    );
    const [assignVolunteer, setAssignVolunteer] = useState<Volunteer | null>(
        null
    );
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // دايلوق تحديث المهمة
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [editStatus, setEditStatus] = useState<string>("");
    const [editDueDate, setEditDueDate] = useState<string>("");
    const [editHours, setEditHours] = useState<number>(0);
    const [editSubtasks, setEditSubtasks] = useState<Subtask[]>([]);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);

    // ✅ ADD: State for creating new task
    const [isCreatingTask, setIsCreatingTask] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskProject, setNewTaskProject] = useState<number | null>(null);
    const [newTaskPriority, setNewTaskPriority] = useState("متوسطة");
    const [newTaskDueDate, setNewTaskDueDate] = useState("");
    const [newTaskHours, setNewTaskHours] = useState(0);
    const [projects, setProjects] = useState<Array<{ id: number; name: string }>>([]);
    const [isProjectSelectOpen, setIsProjectSelectOpen] = useState(false);
    const [isPrioritySelectOpen, setIsPrioritySelectOpen] = useState(false);

    const { access } = useAuth();  // ✅ ADD: Get access token

    const adminInfo = {
        name: "إدارة الجمعية",
        email: "admin@example.com",
        role: "مسؤول المهام",
    };

    const assignableTasks = tasks.filter((t) => t.status !== "مكتملة");

    const statusOptions = [
        { value: "قيد التنفيذ", label: "قيد التنفيذ" },
        { value: "في الانتظار", label: "في الانتظار" },
        { value: "معلقة", label: "معلقة" },
        { value: "مكتملة", label: "مكتملة" },
    ];

    const priorityOptions = [
        { value: "عالية", label: "عالية" },
        { value: "متوسطة", label: "متوسطة" },
        { value: "منخفضة", label: "منخفضة" },
    ];

    // ✅ FETCH PROJECTS for create task dialog
    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/admin/projects/`, {
                    headers: { 'Authorization': `Bearer ${access}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    const projectList = (data.results || data).map((p: any) => ({
                        id: p.id,
                        name: p.title || p.name  // ✅ Use title field from backend
                    }));
                    console.log('✅ Projects loaded:', projectList.length, 'projects');
                    console.log('Projects:', projectList);
                    setProjects(projectList);
                } else {
                    console.error('❌ Failed to fetch projects:', response.status);
                }
            } catch (error) {
                console.error('❌ Error fetching projects:', error);
            }
        };
        if (access) {
            fetchProjects();
        }
    }, [access]);

    // ✅ CREATE TASK
    const handleCreateTask = async () => {
        if (!newTaskTitle.trim() || !newTaskProject) {
            alert("يجب إدخال عنوان المهمة واختيار المشروع");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/tasks/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: newTaskTitle,
                    description: newTaskDescription,
                    project: newTaskProject,
                    priority: newTaskPriority,
                    due_date: newTaskDueDate || null,
                    hours: newTaskHours,
                    status: "في الانتظار"
                })
            });

            if (response.ok) {
                const newTask = await response.json();
                // Add to local state
                setTasks((prev) => [newTask, ...prev]);
                // Reset form
                setIsCreatingTask(false);
                setNewTaskTitle("");
                setNewTaskDescription("");
                setNewTaskProject(null);
                setNewTaskPriority("متوسطة");
                setNewTaskDueDate("");
                setNewTaskHours(0);
                // Refresh data
                onTaskUpdate();
            } else {
                const error = await response.json();
                console.error('Error creating task:', error);
                alert("حدث خطأ أثناء إنشاء المهمة");
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert("حدث خطأ أثناء إنشاء المهمة");
        }
    };

    // ✅ DELETE TASK
    const handleDeleteTask = async (taskId: number) => {
        if (!confirm("هل أنت متأكد من حذف هذه المهمة؟")) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/tasks/${taskId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${access}`
                }
            });

            if (response.ok || response.status === 204) {
                // Remove from local state
                setTasks((prev) => prev.filter((t) => t.id !== taskId));
                // Refresh data
                onTaskUpdate();
            } else {
                alert("حدث خطأ أثناء حذف المهمة");
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert("حدث خطأ أثناء حذف المهمة");
        }
    };

    // فتح دايلوق تحديث المهمة
    const handleOpenEditTask = (task: Task) => {
        setEditingTask(task);
        setEditStatus(task.status);
        setEditDueDate(task.due_date);  // ✅ FIXED: use due_date not dueDate
        setEditHours(task.hours);
        setEditSubtasks(task.subtasks ? [...task.subtasks] : []);
        setIsStatusOpen(false);
        setEditingSubtaskId(null);
    };

    const handleCloseEditTask = () => {
        setEditingTask(null);
        setIsStatusOpen(false);
        setEditingSubtaskId(null);
    };

    const handleChangeSubtaskTitle = (id: string, title: string) => {
        setEditSubtasks((prev) =>
            prev.map((st) => (st.id === id ? { ...st, title } : st))
        );
    };

    const handleToggleSubtaskCompleted = (id: string) => {
        setEditSubtasks((prev) =>
            prev.map((st) =>
                st.id === id ? { ...st, completed: !st.completed } : st
            )
        );
    };

    const handleAddSubtask = () => {
        const newId = `new-${Date.now()}`;
        const newSubtask: Subtask = {
            id: newId,
            title: "",
            completed: false,
        };
        setEditSubtasks((prev) => [...prev, newSubtask]);
        setEditingSubtaskId(newId);
    };

    const handleRemoveSubtask = (id: string) => {
        setEditSubtasks((prev) => prev.filter((st) => st.id !== id));
        if (editingSubtaskId === id) {
            setEditingSubtaskId(null);
        }
    };

    // ✅ UPDATED: Save task changes to backend
    const handleSaveTaskChanges = async () => {
        if (!editingTask) return;

        let newProgress = editingTask.progress;
        if (editSubtasks.length > 0) {
            const completedCount = editSubtasks.filter((st) => st.completed).length;
            newProgress = Math.round((completedCount / editSubtasks.length) * 100);
        }

        try {
            // Prepare subtasks data for backend
            const subtasksData = editSubtasks.map((st, index) => ({
                title: st.title,
                completed: st.completed,
                order: index
            }));

            const response = await fetch(`${API_BASE_URL}/api/admin/tasks/${editingTask.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: editStatus || editingTask.status,
                    due_date: editDueDate || null,
                    hours: editHours,
                    progress: newProgress,
                    subtasks: subtasksData
                })
            });

            if (response.ok) {
                const updatedTask = await response.json();
                // Update local state with backend response
                setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
                setEditingTask(null);
                setIsStatusOpen(false);
                setEditingSubtaskId(null);
                // Refresh data
                onTaskUpdate();
            } else {
                const error = await response.json();
                console.error('Error updating task:', error);
                alert("حدث خطأ أثناء تحديث المهمة");
            }
        } catch (error) {
            console.error('Error updating task:', error);
            alert("حدث خطأ أثناء تحديث المهمة");
        }
    };

    // ✅ UPDATED: Assign task to volunteer via backend
    const handleAssignTaskToCurrentVolunteer = async (taskId: number) => {
        if (!assignVolunteer) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/tasks/${taskId}/assign/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    volunteer_id: assignVolunteer.id
                })
            });

            console.log('Assignment response status:', response.status);
            console.log('Assignment response ok:', response.ok);

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Assignment successful!', result);
                console.log('✅ Updated task:', result.task);
                console.log('✅ Volunteer name in response:', result.task.volunteer_name);

                // Update local state with the updated task
                setTasks((prev) => {
                    const updatedTasks = prev.map((t) => {
                        if (t.id === result.task.id) {
                            console.log('Updating task ID', t.id, 'from:', t, 'to:', result.task);
                            return result.task;
                        }
                        return t;
                    });
                    return updatedTasks;
                });

                // Close dialog
                setAssignVolunteer(null);

                // Show success message
                console.log('✅ Showing success alert');
                alert(`✅ تم تعيين المهمة بنجاح لـ ${assignVolunteer.name}`);

                // Refresh data to get latest state from server
                console.log('Refreshing data...');
                onTaskUpdate();
                console.log('✅ Data refresh complete');
            } else {
                // Not OK response
                const errorText = await response.text();
                console.error('❌ Assignment failed with status:', response.status);
                console.error('❌ Error response:', errorText);
                alert(`❌ حدث خطأ أثناء تعيين المهمة (${response.status})`);
            }
        } catch (error) {
            console.error('❌ Network or parsing error:', error);
            alert("❌ حدث خطأ في الاتصال أثناء تعيين المهمة");
        }
    };

    return (
        <section dir="rtl" className="w-full space-y-4">
            {/* التبويبات */}
            <div className="w-full bg-[#c87981] rounded-[18px] px-2 py-2 shadow-[0px_3px_15px_#8d2e4626]">
                <div className="flex flex-row-reverse">
                    <button
                        type="button"
                        onClick={() => setActiveTab("tasks")}
                        className={[
                            "flex-1 px-4 py-2 rounded-[14px] text-sm md:text-base font-[Cairo] transition-all duration-150",
                            activeTab === "tasks"
                                ? "bg-[#fdf8f9] text-[#2e2b2c] shadow-[0px_2px_8px_#8d2e4680]"
                                : "bg-transparent text-[#fdf8f9]",
                        ].join(" ")}
                    >
                        المهام
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("volunteers")}
                        className={[
                            "flex-1 px-4 py-2 rounded-[14px] text-sm md:text-base font-[Cairo] transition-all duration-150",
                            activeTab === "volunteers"
                                ? "bg-[#fdf8f9] text-[#2e2b2c] shadow-[0px_2px_8px_#8d2e4680]"
                                : "bg-transparent text-[#fdf8f9]",
                        ].join(" ")}
                    >
                        المتطوعين
                    </button>
                </div>
            </div>

            {/* المحتوى */}
            <div className="w-full bg-[#fdf8f9] rounded-[16px] shadow-[0px_3px_15px_#8d2e4626] px-5 py-4 min-h-[160px]">
                {activeTab === "tasks" ? (
                    <>
                        {/* ✅ ADD: Create task button */}
                        <div className="flex justify-end mb-3">
                            <button
                                type="button"
                                onClick={() => setIsCreatingTask(true)}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#8d2e46] text-white font-[Cairo] flex items-center gap-2"
                            >
                                <span>+ إضافة مهمة</span>
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                        {tasks.slice(0, 4).map((t) => {
                            const isCompleted = t.status === "مكتملة";

                            return (
                                <div
                                    key={t.id}
                                    className="bg-[#f3e3e3] rounded-[18px] px-4 py-3 shadow-[0px_3px_15px_#8d2e4633] space-y-3"
                                >
                                    {/* العنوان + الحالة */}
                                    <div className="flex items-start justify-between gap-3">
                                        <h3
                                            className={
                                                "flex-1 text-[17px] md:text-[18px] font-bold font-[Cairo] text-right leading-snug " +
                                                (isCompleted
                                                    ? "text-[#7c7577] line-through"
                                                    : "text-[#2e2b2c]")
                                            }
                                        >
                                            {t.title}
                                        </h3>
                                        <span
                                            className={[
                                                "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-[Cairo]",
                                                getStatusClasses(t.status),
                                            ].join(" ")}
                                        >
                                            {t.status}
                                        </span>
                                    </div>

                                    {/* تفاصيل */}
                                    <div className="space-y-1 text-[12px] text-[#4e4a4b] font-[Cairo]">
                                        <div className="flex justify-between">
                                            <span>المكلف :</span>
                                            <span className={!t.volunteer_name ? "text-gray-400 italic" : ""}>
                                                {t.volunteer_name || "غير محدد"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>الأولوية :</span>
                                            <span>{t.priority}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>تاريخ الاستحقاق :</span>
                                            <span>{t.due_date || "غير محدد"}</span>
                                        </div>
                                    </div>

                                    {/* التقدم */}
                                    <div className="mt-2 space-y-1">
                                        <div className="flex items-center justify-between text-[11px] text-[#4e4a4b] font-[Cairo]">
                                            <span>التقدم :</span>
                                            <span>{t.progress}%</span>
                                        </div>
                                        <div className="w-full h-[6px] rounded-full bg-[#f0dde2] overflow-hidden">
                                            <div
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${t.progress}%`,
                                                    backgroundColor: getProgressBarColor(),
                                                    transition: "width 0.3s ease",
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* الأزرار */}
                                    <div className="flex justify-end gap-2 mt-3">
                                        <button
                                            type="button"
                                            className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#fdf8f9] text-[#8d2e46] border border-[#e0cfd4] font-[Cairo]"
                                            onClick={() => setSelectedTask(t)}
                                        >
                                            تفاصيل المهمة
                                        </button>
                                        <button
                                            type="button"
                                            className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#8d2e46] text-white font-[Cairo]"
                                            onClick={() => handleOpenEditTask(t)}
                                        >
                                            تحديث المهمة
                                        </button>
                                        {/* ✅ ADD: Delete button */}
                                        <button
                                            type="button"
                                            className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#fdf8f9] text-red-600 border border-red-300 font-[Cairo] flex items-center gap-1"
                                            onClick={() => handleDeleteTask(t.id)}
                                        >
                                            <Trash2 size={12} />
                                            <span>حذف</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                    </>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {volunteers.map((v) => {
                            const completedCount = v.completed_tasks;
                            const currentCount = v.current_tasks;

                            return (
                                <div
                                    key={v.email}
                                    className="bg-[#f3e3e3] rounded-[18px] px-4 py-3 shadow-[0px_3px_15px_#8d2e4633] space-y-3"
                                >
                                    {/* الاسم + الحالة */}
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[18px] font-bold text-[#2e2b2c] font-[Cairo]">
                                            {v.name}
                                        </h3>
                                        <span
                                            className={[
                                                "inline-flex items-center px-3 py-1 rounded-full text-xs font-[Cairo]",
                                                v.status === "نشط"
                                                    ? "bg-[#cef2d4] text-[#1d6b3a]"
                                                    : v.status === "مشغول"
                                                        ? "bg-[#ffe9c4] text-[#a76511]"
                                                        : "bg-[#e4e0e1] text-[#6b6567]",
                                            ].join(" ")}
                                        >
                                            {v.status}
                                        </span>
                                    </div>

                                    {/* تواصل */}
                                    <div className="flex flex-wrap gap-6 mt-1 text-[12px] text-[#4e4a4b] font-[Cairo]">
                                        <div className="flex items-center gap-1">
                                            <MapPin size={15} className="text-[#8d2e46]" />
                                            <span>{getCityFromLocation(v.location)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Mail size={15} className="text-[#8d2e46]" />
                                            <span>{v.email}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Phone size={15} className="text-[#8d2e46]" />
                                            <span>{v.phone}</span>
                                        </div>
                                    </div>

                                    {/* المهارات */}
                                    <div className="mt-2 text-right">
                                        <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c] mb-1">
                                            المهارات :
                                        </div>
                                        <div className="flex flex-wrap gap-2 justify-start">
                                            {v.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-[4px] rounded-full border border-[#8d2e46] text-[11px] text-[#8d2e46] font-[Cairo] bg-transparent"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* إحصائيات صغيرة */}
                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3 font-[Cairo]">
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-[11px] text-[#6b6567]">
                                                تاريخ الانضمام
                                            </span>
                                            <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                {v.join_date}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-[11px] text-[#6b6567]">التقييم</span>
                                            <span className="flex items-center justify-center gap-1 text-[13px] font-semibold text-[#2e2b2c]">
                                                {v.rating}
                                                <Star size={14} className="text-[#f2b01e]" />
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-[11px] text-[#6b6567]">
                                                المهام المكتملة
                                            </span>
                                            <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                {completedCount}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className="text-[11px] text-[#6b6567]">
                                                المهام الحالية
                                            </span>
                                            <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                {currentCount}
                                            </span>
                                        </div>
                                    </div>

                                    {/* المشاريع + الأزرار */}
                                    <div className="mt-3 space-y-2">
                                        <div className="text-right">
                                            <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c] mb-1">
                                                المشاريع الحالية :
                                            </div>
                                            <div className="flex flex-wrap gap-2 justify-start text-[11px] text-[#6b6567] font-[Cairo]">
                                                {v.current_projects.map((p) => (
                                                    <span
                                                        key={p}
                                                        className="px-3 py-[4px] rounded-full bg-[#e9d5da] text-[#4e2a35]"
                                                    >
                                                        {p}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 justify-end">
                                            <button
                                                className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#fdf8f9] text-[#8d2e46] border border-[#e0cfd4] font-[Cairo]"
                                                onClick={() => setSelectedVolunteer(v)}
                                            >
                                                تفاصيل المتطوع
                                            </button>
                                            <button
                                                className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#8d2e46] text-white font-[Cairo]"
                                                onClick={() => setAssignVolunteer(v)}
                                            >
                                                تعيين مهمة
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 🔹 دايلوق تفاصيل المتطوع */}
            {selectedVolunteer && (
                <div
                    dir="rtl"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setSelectedVolunteer(null)}
                >
                    <div
                        className="bg-[#fdf8f9] rounded-[20px] shadow-[0px_8px_25px_#00000040] w-[95%] max-w-[650px] px-6 py-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="w-[90px] h-[90px] rounded-full bg-[#e9d5da] flex items-center justify-center text-[#4e2a35] font-bold text-[36px]">
                                {getInitial(selectedVolunteer.name)}
                            </div>

                            <div className="flex-1 space-y-2 text-right">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-[20px] md:text-[22px] font-bold text-[#2e2b2c] font-[Cairo]">
                                        {selectedVolunteer.name}
                                    </h3>
                                    <span
                                        className={[
                                            "inline-flex items-center px-3 py-1 rounded-full text-xs font-[Cairo]",
                                            selectedVolunteer.status === "نشط"
                                                ? "bg-[#cef2d4] text-[#1d6b3a]"
                                                : selectedVolunteer.status === "مشغول"
                                                    ? "bg-[#ffe9c4] text-[#a76511]"
                                                    : "bg-[#e4e0e1] text-[#6b6567]",
                                        ].join(" ")}
                                    >
                                        {selectedVolunteer.status}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-[12px] text-[#4e4a4b] font-[Cairo]">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={15} className="text-[#8d2e46]" />
                                        <span>{selectedVolunteer.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Mail size={15} className="text-[#8d2e46]" />
                                        <span>{selectedVolunteer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Phone size={15} className="text-[#8d2e46]" />
                                        <span>{selectedVolunteer.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-4 font-[Cairo]">
                            <div className="flex flex-col items-center text-center">
                                <span className="text-[11px] text-[#6b6567]">تاريخ الانضمام</span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedVolunteer.join_date}
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-[11px] text-[#6b6567]">التقييم</span>
                                <span className="flex items-center justify-center gap-1 text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedVolunteer.rating}
                                    <Star size={14} className="text-[#f2b01e]" />
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-[11px] text-[#6b6567]">الساعات التطوعية</span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedVolunteer.volunteer_hours}
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <span className="text-[11px] text-[#6b6567]">المهام المكتملة</span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedVolunteer.completed_tasks}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2 text-right">
                            <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c]">
                                المهارات :
                            </div>
                            <div className="flex flex-wrap gap-2 justify-start">
                                {selectedVolunteer.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-[4px] rounded-full border border-[#8d2e46] text-[11px] text-[#8d2e46] font-[Cairo] bg-transparent"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2 text-right">
                            <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c]">
                                المشاريع الحالية :
                            </div>
                            <div className="flex flex-wrap gap-2 justify-start text-[11px] text-[#6b6567] font-[Cairo]">
                                {selectedVolunteer.current_projects.map((p) => (
                                    <span
                                        key={p}
                                        className="px-3 py-[4px] rounded-full bg-[#e9d5da] text-[#4e2a35]"
                                    >
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center justify-end mt-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedVolunteer(null)}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#f3e3e3] text-[#2e2b2c] font-[Cairo] border border-[#e0cfd4]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 دايلوق تعيين مهمة */}
            {assignVolunteer && (
                <div
                    dir="rtl"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setAssignVolunteer(null)}
                >
                    <div
                        className="bg-[#fdf8f9] rounded-[20px] shadow-[0px_8px_25px_#00000040] w-[95%] max-w-[750px] px-6 py-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-2 mb-2">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-[20px] md:text-[22px] font-bold text-[#2e2b2c] font-[Cairo]">
                                    تعيين مهمة لـ {assignVolunteer.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-[#e9d5da] flex items-center justify-center text-[#4e2a35] font-bold text-sm">
                                        {getInitial(adminInfo.name)}
                                    </div>
                                    <div className="text-[11px] text-right font-[Cairo]">
                                        <div className="font-semibold text-[#2e2b2c]">
                                            {adminInfo.name}
                                        </div>
                                        <div className="text-[#6b6567]">{adminInfo.role}</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-[12px] text-[#6b6567] font-[Cairo]">
                                اختر إحدى المهام المتاحة أدناه لتعيينها لهذا المتطوع. هذه المهام
                                هي المهام الحالية / الجديدة غير المكتملة عند الإدارة.
                            </p>
                        </div>

                        <div className="max-h-[340px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                            {assignableTasks.length === 0 ? (
                                <div className="text-center text-[13px] text-[#6b6567] font-[Cairo] py-6">
                                    لا توجد مهام متاحة للتعيين حاليًا.
                                </div>
                            ) : (
                                assignableTasks.map((t) => (
                                    <div
                                        key={t.id}
                                        className="bg-[#f3e3e3] rounded-[16px] px-4 py-3 shadow-[0px_3px_10px_#8d2e4626] space-y-3"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="text-[14px] font-[Cairo] font-bold text-[#2e2b2c] text-right">
                                                    {t.title}
                                                </div>
                                                <div className="text-[11px] font-[Cairo] text-[#6b6567] mt-1 text-right">
                                                    المشروع: {t.project_name}
                                                </div>
                                            </div>
                                            <span
                                                className={[
                                                    "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-[Cairo]",
                                                    getStatusClasses(t.status),
                                                ].join(" ")}
                                            >
                                                {t.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-[11px] text-[#4e4a4b] font-[Cairo]">
                                            <span>الأولوية: {t.priority}</span>
                                            <span>تاريخ الاستحقاق: {t.due_date || "غير محدد"}</span>
                                            <span>الساعات التقديرية: {t.hours}</span>
                                        </div>
                                        {t.volunteer_name && (
                                            <div className="text-[11px] text-[#8d2e46] font-[Cairo] mt-1">
                                                ⚠️ مكلف حاليًا: {t.volunteer_name} (سيتم إعادة التعيين)
                                            </div>
                                        )}

                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center justify-between text-[11px] text-[#4e4a4b] font-[Cairo]">
                                                <span>التقدم :</span>
                                                <span>{t.progress}%</span>
                                            </div>
                                            <div className="w-full h-[6px] rounded-full bg-[#f0dde2] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${t.progress}%`,
                                                        backgroundColor: getProgressBarColor(),
                                                        transition: "width 0.3s ease",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="button"
                                                className="px-3 py-[6px] rounded-[999px] text-[11px] bg-[#8d2e46] text-white font-[Cairo]"
                                                onClick={() =>
                                                    handleAssignTaskToCurrentVolunteer(t.id)
                                                }
                                            >
                                                تعيين هذه المهمة
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setAssignVolunteer(null)}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#f3e3e3] text-[#2e2b2c] font-[Cairo] border border-[#e0cfd4]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 دايلوق تفاصيل المهمة */}
            {selectedTask && (
                <div
                    dir="rtl"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setSelectedTask(null)}
                >
                    <div
                        className="bg-[#fdf8f9] rounded-[20px] shadow-[0px_8px_25px_#00000040] w-[95%] max-w-[720px] px-6 py-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* الهيدر */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1 text-right">
                                <h3 className="text-[20px] md:text-[22px] font-bold text-[#2e2b2c] font-[Cairo]">
                                    {selectedTask.title}
                                </h3>
                                <div className="text-[12px] text-[#6b6567] font-[Cairo]">
                                    المشروع: {selectedTask.project_name}
                                </div>
                            </div>
                            <span
                                className={[
                                    "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-[Cairo]",
                                    getStatusClasses(selectedTask.status),
                                ].join(" ")}
                            >
                                {selectedTask.status}
                            </span>
                        </div>

                        {/* وصف المهمة */}
                        {selectedTask.description && (
                            <div className="text-[13px] text-[#4e4a4b] font-[Cairo] text-right leading-relaxed bg-[#f3e3e3] rounded-[14px] px-3 py-3">
                                {selectedTask.description}
                            </div>
                        )}

                        {/* معلومات أساسية – بالوسط */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 font-[Cairo] text-right">
                            <div className="flex flex-col items-center gap-[2px] text-center">
                                <span className="text-[11px] text-[#6b6567]">المكلّف</span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedTask.volunteer_name}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-[2px] text-center">
                                <span className="text-[11px] text-[#6b6567]">الأولوية</span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedTask.priority}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-[2px] text-center">
                                <span className="text-[11px] text-[#6b6567]">
                                    تاريخ الاستحقاق
                                </span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedTask.due_date}
                                </span>
                            </div>
                            <div className="flex flex-col items-center gap-[2px] text-center">
                                <span className="text-[11px] text-[#6b6567]">
                                    الساعات التقديرية
                                </span>
                                <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                    {selectedTask.hours}
                                </span>
                            </div>
                        </div>

                        {/* التقدم في المهمة */}
                        <div className="space-y-1 mt-2">
                            <div className="flex items-center justify-between text-[11px] text-[#4e4a4b] font-[Cairo]">
                                <span>نسبة التقدم الحالية :</span>
                                <span>{selectedTask.progress}%</span>
                            </div>
                            <div className="w-full h-[6px] rounded-full bg-[#f0dde2] overflow-hidden">
                                <div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${selectedTask.progress}%`,
                                        backgroundColor: getProgressBarColor(),
                                        transition: "width 0.3s ease",
                                    }}
                                />
                            </div>
                        </div>

                        {/* المهام الفرعية */}
                        {selectedTask.subtasks && selectedTask.subtasks.length > 0 && (
                            <div className="space-y-2 mt-3">
                                <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c] text-right">
                                    المهام الفرعية (يبنى عليها التقدم) :
                                </div>
                                <div className="space-y-1">
                                    {selectedTask.subtasks.map((st) => (
                                        <div
                                            key={st.id}
                                            className="flex items-center justify-between bg-[#f3e3e3] rounded-[12px] px-3 py-2 text-[12px] font-[Cairo]"
                                        >
                                            <div className="flex items-center gap-2">
                                                {st.completed ? (
                                                    <Check size={16} className="text-[#1d6b3a]" />
                                                ) : (
                                                    <Square size={16} className="text-[#a67912]" />
                                                )}
                                                <span
                                                    className={
                                                        st.completed
                                                            ? "text-[#6b6567] line-through"
                                                            : "text-[#2e2b2c]"
                                                    }
                                                >
                                                    {st.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setSelectedTask(null)}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#f3e3e3] text-[#2e2b2c] font-[Cairo] border border-[#e0cfd4]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 دايلوق تحديث المهمة */}
            {editingTask && (
                <div
                    dir="rtl"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={handleCloseEditTask}
                >
                    <div
                        className="bg-[#fdf8f9] rounded-[20px] shadow-[0px_8px_25px_#00000040] w-[95%] max-w-[720px] px-6 py-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* الهيدر */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 text-right space-y-1">
                                <h3 className="text-[20px] md:text-[22px] font-bold text-[#2e2b2c] font-[Cairo]">
                                    تحديث المهمة
                                </h3>
                                <div className="text-[12px] text-[#6b6567] font-[Cairo]">
                                    {editingTask.title} – {editingTask.project_name}
                                </div>
                            </div>
                            <span
                                className={[
                                    "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-[Cairo]",
                                    getStatusClasses(editStatus || editingTask.status),
                                ].join(" ")}
                            >
                                {editStatus || editingTask.status}
                            </span>
                        </div>

                        {/* الحقول الأساسية */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6 font-[Cairo] text-right">
                            {/* دروب داون حالة المهمة */}
                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    حالة المهمة
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsStatusOpen((prev) => !prev)}
                                        className="w-full h-[40px] rounded-[12px] border border-[#e0cfd4] bg-white px-3 flex items-center justify-between text-[13px] text-[#2e2b2c]"
                                    >
                                        <span className="flex-1 text-right">
                                            {editStatus || "اختر حالة المهمة"}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-[#8d2e46]" />
                                    </button>

                                    {isStatusOpen && (
                                        <div className="absolute z-[100] mt-1 w-full rounded-[12px] bg-white shadow-[0px_8px_20px_#00000080] border-2 border-[#8d2e46] overflow-hidden text-[13px]">
                                            {statusOptions.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditStatus(opt.value);
                                                        setIsStatusOpen(false);
                                                    }}
                                                    className={`w-full text-right px-4 py-2 flex items-center justify-between hover:bg-[#fdf1f4] ${editStatus === opt.value ? "bg-[#f3e3e8]" : ""
                                                        }`}
                                                >
                                                    <span className="flex-1">{opt.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    تاريخ الاستحقاق
                                </label>
                                <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                />
                            </div>

                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    الساعات التقديرية
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={editHours}
                                    onChange={(e) =>
                                        setEditHours(e.target.value ? Number(e.target.value) : 0)
                                    }
                                    className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                />
                            </div>

                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    نسبة التقدم (تُحتسب من المهام الفرعية)
                                </label>
                                <div className="text-[12px] text-[#2e2b2c] font-semibold">
                                    {editSubtasks.length > 0
                                        ? `${Math.round(
                                            (editSubtasks.filter((s) => s.completed).length /
                                                editSubtasks.length) *
                                            100
                                        )}%`
                                        : `${editingTask.progress}%`}
                                </div>
                            </div>
                        </div>

                        {/* المهام الفرعية - تعديل / إضافة / حذف */}
                        <div className="space-y-2 mt-3">
                            <div className="flex items-center justify-between">
                                <div className="text-[13px] font-[Cairo] font-semibold text-[#2e2b2c]">
                                    المهام الفرعية
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSubtask}
                                    className="text-[11px] font-[Cairo] px-3 py-[4px] rounded-full bg-[#e9d5da] text-[#4e2a35]"
                                >
                                    + إضافة مهمة فرعية
                                </button>
                            </div>

                            {editSubtasks.length === 0 ? (
                                <div className="text-[12px] text-[#6b6567] font-[Cairo] bg-[#f3e3e3] rounded-[12px] px-3 py-2 text-right">
                                    لا توجد مهام فرعية، يمكنك إضافة مهام لتحديد التقدم.
                                </div>
                            ) : (
                                <div className="space-y-1 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                                    {editSubtasks.map((st) => {
                                        const isEditing = editingSubtaskId === st.id;

                                        return (
                                            <div
                                                key={st.id}
                                                className="flex items-center justify-between bg-[#f3e3e3] rounded-[12px] px-3 py-2 text-[12px] font-[Cairo] gap-2"
                                            >
                                                <div className="flex items-center gap-2 flex-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleToggleSubtaskCompleted(st.id)
                                                        }
                                                        className="shrink-0"
                                                    >
                                                        {st.completed ? (
                                                            <Check size={16} className="text-[#1d6b3a]" />
                                                        ) : (
                                                            <Square size={16} className="text-[#a67912]" />
                                                        )}
                                                    </button>

                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={st.title}
                                                            onChange={(e) =>
                                                                handleChangeSubtaskTitle(
                                                                    st.id,
                                                                    e.target.value
                                                                )
                                                            }
                                                            placeholder="عنوان المهمة الفرعية"
                                                            autoFocus
                                                            className={
                                                                "w-full bg-transparent border-none outline-none text-[12px] " +
                                                                (st.completed
                                                                    ? "text-[#6b6567] line-through"
                                                                    : "text-[#2e2b2c]")
                                                            }
                                                        />
                                                    ) : (
                                                        <span
                                                            className={
                                                                "w-full " +
                                                                (st.completed
                                                                    ? "text-[#6b6567] line-through"
                                                                    : "text-[#2e2b2c]")
                                                            }
                                                        >
                                                            {st.title || "مهمة بدون عنوان"}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            isEditing
                                                                ? setEditingSubtaskId(null)
                                                                : setEditingSubtaskId(st.id)
                                                        }
                                                        className="p-1"
                                                    >
                                                        {isEditing ? (
                                                            <Save size={16} className="text-[#1d6b3a]" />
                                                        ) : (
                                                            <Pencil size={16} className="text-[#8d2e46]" />
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveSubtask(st.id)}
                                                        className="p-1"
                                                    >
                                                        <Trash2 size={16} className="text-[#8d2e46]" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* الأزرار */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleCloseEditTask}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#f3e3e3] text-[#2e2b2c] font-[Cairo] border border-[#e0cfd4]"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveTaskChanges}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#8d2e46] text-white font-[Cairo]"
                            >
                                حفظ التغييرات
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ CREATE TASK DIALOG */}
            {isCreatingTask && (
                <div
                    dir="rtl"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setIsCreatingTask(false)}
                >
                    <div
                        className="bg-[#fdf8f9] rounded-[20px] shadow-[0px_8px_25px_#00000040] w-[95%] max-w-[720px] px-6 py-5 space-y-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* الهيدر */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1 text-right space-y-1">
                                <h3 className="text-[20px] md:text-[22px] font-bold text-[#2e2b2c] font-[Cairo]">
                                    إضافة مهمة جديدة
                                </h3>
                                <div className="text-[12px] text-[#6b6567] font-[Cairo]">
                                    قم بملء البيانات لإنشاء مهمة جديدة
                                </div>
                            </div>
                        </div>

                        {/* الحقول */}
                        <div className="grid grid-cols-1 gap-y-3 font-[Cairo] text-right">
                            {/* عنوان المهمة */}
                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    عنوان المهمة *
                                </label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="أدخل عنوان المهمة"
                                    className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                />
                            </div>

                            {/* الوصف */}
                            <div className="flex flex-col gap-[4px]">
                                <label className="text-[11px] text-[#6b6567]">
                                    الوصف
                                </label>
                                <textarea
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    placeholder="وصف تفصيلي للمهمة"
                                    rows={3}
                                    className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                {/* المشروع */}
                                <div className="flex flex-col gap-[4px]">
                                    <label className="text-[11px] text-[#6b6567]">
                                        المشروع *
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsProjectSelectOpen((prev) => !prev)}
                                            className="w-full h-[40px] rounded-[12px] border border-[#e0cfd4] bg-white px-3 flex items-center justify-between text-[13px] text-[#2e2b2c]"
                                        >
                                            <span className="flex-1 text-right">
                                                {newTaskProject
                                                    ? projects.find(p => p.id === newTaskProject)?.name
                                                    : `اختر المشروع${projects.length > 0 ? ` (${projects.length})` : ''}`}
                                            </span>
                                            <ChevronDown className={`w-4 h-4 text-[#8d2e46] transition-transform ${isProjectSelectOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isProjectSelectOpen && (
                                            <div className="absolute z-[100] mt-1 w-full rounded-[12px] bg-white shadow-[0px_8px_20px_#00000080] border-2 border-[#8d2e46] overflow-hidden text-[13px] max-h-[180px] overflow-y-auto">
                                                {projects.length === 0 ? (
                                                    <div className="px-4 py-3 text-center text-[#6b6567]">
                                                        لا توجد مشاريع متاحة
                                                    </div>
                                                ) : (
                                                    projects.map((proj) => (
                                                        <button
                                                            key={proj.id}
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setNewTaskProject(proj.id);
                                                                setIsProjectSelectOpen(false);
                                                            }}
                                                            className={`w-full text-right px-4 py-2 hover:bg-[#fdf1f4] ${
                                                                newTaskProject === proj.id ? "bg-[#f3e3e8]" : ""
                                                            }`}
                                                        >
                                                            {proj.name}
                                                        </button>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* الأولوية */}
                                <div className="flex flex-col gap-[4px]">
                                    <label className="text-[11px] text-[#6b6567]">
                                        الأولوية
                                    </label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsPrioritySelectOpen((prev) => !prev)}
                                            className="w-full h-[40px] rounded-[12px] border border-[#e0cfd4] bg-white px-3 flex items-center justify-between text-[13px] text-[#2e2b2c]"
                                        >
                                            <span className="flex-1 text-right">{newTaskPriority}</span>
                                            <ChevronDown className="w-4 h-4 text-[#8d2e46]" />
                                        </button>

                                        {isPrioritySelectOpen && (
                                            <div className="absolute z-[100] mt-1 w-full rounded-[12px] bg-white shadow-[0px_8px_20px_#00000080] border-2 border-[#8d2e46] overflow-hidden text-[13px]">
                                                {priorityOptions.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setNewTaskPriority(opt.value);
                                                            setIsPrioritySelectOpen(false);
                                                        }}
                                                        className={`w-full text-right px-4 py-2 hover:bg-[#fdf1f4] ${
                                                            newTaskPriority === opt.value ? "bg-[#f3e3e8]" : ""
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* تاريخ الاستحقاق */}
                                <div className="flex flex-col gap-[4px]">
                                    <label className="text-[11px] text-[#6b6567]">
                                        تاريخ الاستحقاق
                                    </label>
                                    <input
                                        type="date"
                                        value={newTaskDueDate}
                                        onChange={(e) => setNewTaskDueDate(e.target.value)}
                                        className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                    />
                                </div>

                                {/* الساعات التقديرية */}
                                <div className="flex flex-col gap-[4px]">
                                    <label className="text-[11px] text-[#6b6567]">
                                        الساعات التقديرية
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={newTaskHours}
                                        onChange={(e) => setNewTaskHours(e.target.value ? Number(e.target.value) : 0)}
                                        className="w-full border border-[#e0cfd4] rounded-[12px] px-3 py-2 text-[12px] bg-white focus:outline-none focus:ring-1 focus:ring-[#c87981]"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* الأزرار */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreatingTask(false)}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#f3e3e3] text-[#2e2b2c] font-[Cairo] border border-[#e0cfd4]"
                            >
                                إلغاء
                            </button>
                            <button
                                type="button"
                                onClick={handleCreateTask}
                                className="px-4 py-2 rounded-[999px] text-[12px] bg-[#8d2e46] text-white font-[Cairo]"
                            >
                                إضافة المهمة
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

//
// سكشن التقارير
//
interface PerformanceReportsSectionProps {
    tasks: Task[];
    volunteers: Volunteer[];
}

const PerformanceReportsSection: React.FC<PerformanceReportsSectionProps> = ({
    tasks,
    volunteers,
}) => {
    const [activeTab, setActiveTab] = useState<"projects" | "volunteers">(
        "volunteers"
    );
    const [selectedVolunteer, setSelectedVolunteer] = useState<string>("");
    const [isVolunteerSelectOpen, setIsVolunteerSelectOpen] = useState(false);

    const projects = [
        { name: "منصة المتطوعين", progress: 75 },
        { name: "حملة التوعية", progress: 60 },
        { name: "تطوير التطبيق", progress: 40 },
    ];

    // أرقام الأداء من بيانات المتطوع مباشرة
    const volunteersPerformance = volunteers.map((v) => ({
        name: v.name,
        completed: v.completed_tasks,
        current: v.current_tasks,
        joinDate: v.join_date,
    }));

    const selectedVolunteerObj = selectedVolunteer
        ? volunteers.find((v) => v.name === selectedVolunteer) || null
        : null;

    const selectedVolunteerTasks = selectedVolunteerObj
        ? tasks
            .filter((t) => t.volunteer_name === selectedVolunteerObj.name)
            .sort((a, b) => (a.due_date < b.due_date ? 1 : -1))
        : [];

    const selectedPerfRow = selectedVolunteer
        ? volunteersPerformance.find((v) => v.name === selectedVolunteer) || null
        : null;

    return (
        <section dir="rtl" className="w-full space-y-5 mt-6">
            {/* العنوان */}
            <div className="flex justify-center">
                <div className="bg-[#fdf8f9] px-6 py-3 rounded-[18px] shadow-[0px_3px_15px_#8d2e4626]">
                    <h2 className="text-[18px] md:text-[20px] font-[Cairo] font-bold text-[#2e2b2c] text-center">
                        تقارير مفصلة عن أداء المتطوعين والمشاريع
                    </h2>
                </div>
            </div>

            {/* التبويبات */}
            <div className="w-full max-w-[420px] mx-auto bg-[#c87981] rounded-[18px] px-2 py-2 shadow-[0px_3px_15px_#8d2e4626] flex flex-row-reverse gap-1 justify-between">
                <button
                    type="button"
                    onClick={() => setActiveTab("projects")}
                    className={[
                        "flex-1 min-w-[160px] px-4 py-2 rounded-[14px] text-sm md:text-base font-[Cairo] text-center transition-all duration-150",
                        activeTab === "projects"
                            ? "bg-[#fdf8f9] text-[#2e2b2c] shadow-[0px_2px_8px_#8d2e4680]"
                            : "bg-transparent text-[#fdf8f9]",
                    ].join(" ")}
                >
                    تقدم المشاريع
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab("volunteers")}
                    className={[
                        "flex-1 min-w-[160px] px-4 py-2 rounded-[14px] text-sm md:text-base font-[Cairo] text-center transition-all duration-150",
                        activeTab === "volunteers"
                            ? "bg-[#fdf8f9] text-[#2e2b2c] shadow-[0px_2px_8px_#8d2e4680]"
                            : "bg-transparent text-[#fdf8f9]",
                    ].join(" ")}
                >
                    تفاصيل الأداء
                </button>
            </div>

            {/* حسب التاب */}
            {activeTab === "projects" && (
                <div className="bg-[#fdf8f9] rounded-[18px] shadow-[0px_3px_15px_#8d2e4626] px-5 py-4">
                    <h3 className="text-[15px] font-[Cairo] font-semibold text-[#2e2b2c] mb-3 text-right">
                        تقدم المشاريع
                    </h3>

                    <div className="space-y-3">
                        {projects.map((p) => (
                            <div key={p.name} className="space-y-1">
                                <div className="flex items-center justify-between text-[12px] text-[#4e4a4b] font-[Cairo]">
                                    <span>{p.name}</span>
                                    <span>{p.progress}%</span>
                                </div>
                                <div className="w-full h-[6px] rounded-full bg-[#f0dde2] overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${p.progress}%`,
                                            backgroundColor: "#c87981",
                                            transition: "width 0.3s ease",
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === "volunteers" && (
                <div className="space-y-4">
                    {/* جدول المتطوعين */}
                    <div className="bg-[#fdf8f9] rounded-[18px] shadow-[0px_3px_15px_#8d2e4626] px-5 py-4 overflow-x-auto">
                        <h3 className="text-[15px] font-[Cairo] font-semibold text-[#2e2b2c] mb-3 text-right">
                            تفاصيل أداء المتطوعين
                        </h3>

                        <table className="min-w-full text-[12px] font-[Cairo] text-right">
                            <thead>
                                <tr className="text-[#6b6567] border-b border-[#e0cfd4]">
                                    <th className="py-2 px-2 font-normal">المتطوع</th>
                                    <th className="py-2 px-2 font-normal">المهام المكتملة</th>
                                    <th className="py-2 px-2 font-normal">المهام الحالية</th>
                                    <th className="py-2 px-2 font-normal">معدل الإنجاز</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteersPerformance.map((v, idx) => {
                                    const total = v.completed + v.current;
                                    const rate =
                                        total === 0 ? 0 : Math.round((v.completed / total) * 100);
                                    return (
                                        <tr
                                            key={v.name}
                                            className={
                                                idx % 2 === 0 ? "bg-[#fdf8f9]" : "bg-[#f6ecef]"
                                            }
                                        >
                                            <td className="py-2 px-2 text-[#2e2b2c]">{v.name}</td>
                                            <td className="py-2 px-2 text-[#2e2b2c]">
                                                {v.completed}
                                            </td>
                                            <td className="py-2 px-2 text-[#2e2b2c]">
                                                {v.current}
                                            </td>
                                            <td className="py-2 px-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-full h-[5px] rounded-full bg-[#f0dde2] overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${rate}%`,
                                                                backgroundColor: "#c87981",
                                                            }}
                                                        />
                                                    </div>
                                                    <span className="text-[#2e2b2c] min-w-[32px] text-left">
                                                        {rate}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* اختيار متطوع + التقرير الفردي */}
                    <div className="space-y-3">
                        {/* الدروب ليست على اليسار */}
                        <div className="flex justify-end">
                            <div className="relative w-[220px]">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsVolunteerSelectOpen((prev) => !prev)
                                    }
                                    className="w-[220px] h-[40px] rounded-[18px] border border-[#e0cfd4] bg-[#fdf8f9] px-4 pr-4 pl-8 text-[13px] text-[#2e2b2c] font-[Cairo] flex items-center justify-between"
                                >
                                    <span className="flex-1 text-right">
                                        {selectedVolunteer || "اختر متطوع"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 text-[#8d2e46]" />
                                </button>

                                {isVolunteerSelectOpen && (
                                    <div className="absolute z-[100] mt-1 w-[220px] rounded-[12px] bg-white shadow-[0px_8px_20px_#00000080] border-2 border-[#8d2e46] overflow-hidden text-[13px] max-h-[220px] overflow-y-auto custom-scrollbar">
                                        {volunteersPerformance.length === 0 ? (
                                            <div className="px-4 py-3 text-center text-[#6b6567]">
                                                لا يوجد متطوعون
                                            </div>
                                        ) : (
                                            volunteersPerformance.map((v) => (
                                                <button
                                                    key={v.name}
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedVolunteer(v.name);
                                                        setIsVolunteerSelectOpen(false);
                                                    }}
                                                    className={`w-full text-right px-4 py-2 hover:bg-[#fdf1f4] ${selectedVolunteer === v.name
                                                            ? "bg-[#f3e3e8]"
                                                            : ""
                                                        }`}
                                                >
                                                    {v.name}
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#fdf8f9] rounded-[18px] shadow-[0px_3px_15px_#8d2e4626] px-6 py-8 flex items-center justify-center">
                            {selectedVolunteerObj && selectedPerfRow ? (
                                <div className="w-full">
                                    <div className="flex flex-col md:flex-row items-stretch gap-6">
                                        {/* يمين: معلومات عامة */}
                                        <div className="w-full md:w-[40%] flex flex-col items-end text-right space-y-1">
                                            <div className="text-[15px] font-[Cairo] font-bold text-[#2e2b2c]">
                                                تقرير فردي - {selectedVolunteerObj.name}
                                            </div>
                                            <div className="text-[12px] text-[#6b6567] font-[Cairo]">
                                                {selectedVolunteerObj.skills[0] || "متطوع"}
                                            </div>

                                            <div className="mt-4 space-y-2 text-[12px] font-[Cairo]">
                                                <div className="flex flex-col items-end gap-[2px]">
                                                    <span className="text-[#6b6567]">
                                                        تاريخ الانضمام
                                                    </span>
                                                    <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                        {selectedPerfRow.joinDate}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-[2px]">
                                                    <span className="text-[#6b6567]">
                                                        المهام المكتملة
                                                    </span>
                                                    <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                        {selectedPerfRow.completed}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-[2px]">
                                                    <span className="text-[#6b6567]">
                                                        المهام الحالية
                                                    </span>
                                                    <span className="text-[13px] font-semibold text-[#2e2b2c]">
                                                        {selectedPerfRow.current}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* يسار: المهام الأخيرة */}
                                        <div className="w-full md:w-[60%] flex flex-col gap-3 text-right">
                                            <div className="text-[14px] font-[Cairo] font-semibold text-[#2e2b2c] text-right">
                                                المهام الأخيرة
                                            </div>
                                            <div className="space-y-2 text-[12px] font-[Cairo]">
                                                {selectedVolunteerTasks.length === 0 ? (
                                                    <div className="text-center text-[#c2b5b9]">
                                                        لا توجد مهام مسندة حاليًا لهذا المتطوع.
                                                    </div>
                                                ) : (
                                                    selectedVolunteerTasks.map((t) => (
                                                        <div
                                                            key={t.id}
                                                            className="flex items-center justify-between gap-3"
                                                        >
                                                            <span className="text-[#6b6567] min-w-[80px] text-right">
                                                                {t.due_date}
                                                            </span>
                                                            <div className="flex-1 text-right text-[#2e2b2c]">
                                                                {t.title}
                                                            </div>
                                                            <span
                                                                className={[
                                                                    "px-3 py-[3px] rounded-full text-[11px]",
                                                                    getStatusClasses(t.status),
                                                                ].join(" ")}
                                                            >
                                                                {t.status}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center gap-3 text-center font-[Cairo]">
                                    <User size={38} className="text-[#c2b5b9]" />
                                    <div className="text-[#c2b5b9] text-[14px]">
                                        اختر متطوعًا لعرض تقريره الفردي
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

//
// الصفحة الرئيسية
//
const VolunteerManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { access } = useAuth();  //  ADD
    
    // ADD API State
    const [stats, setStats] = useState({
        total_volunteers: 0,
        active_volunteers: 0,
        total_hours: 0,
        completed_tasks: 0
    });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const term = searchTerm.trim().toLowerCase();



    // Fetch data on mount
useEffect(() => {
    fetchStats();
    fetchVolunteers();
    fetchTasks();
}, []);

const fetchStats = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/volunteer-stats/`, {
            headers: { 'Authorization': `Bearer ${access}` }
        });
        if (response.ok) {
            const data = await response.json();
            console.log('Volunteers data:', data);
            console.log('Results:', data.results);
            setStats(data);
        }
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
};

const fetchVolunteers = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/volunteers/`, {
            headers: { 'Authorization': `Bearer ${access}` }
        });
        if (response.ok) {
            const data = await response.json();
            setVolunteers(data.results || []);
        }
    } catch (error) {
        console.error('Error fetching volunteers:', error);
    }
};

const fetchTasks = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin/tasks/`, {
            headers: { 'Authorization': `Bearer ${access}` }
        });
        if (response.ok) {
            const data = await response.json();
            setTasks(data.results || data);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    } finally {
        setLoading(false);
    }
};

const handleTaskUpdate = () => {
    fetchStats();
    fetchTasks();
    fetchVolunteers();
};


    const filteredVolunteers = volunteers.filter((v) => {
        if (!term) return true;
        const haystack = (
            v.name +
            " " +
            v.email +
            " " +
            v.phone +
            " " +
            v.location +
            " " +
            v.skills.join(" ") +
            " " +
            (v.available_days || []).join(" ")
        ).toLowerCase();
        return haystack.includes(term);
    });

    const filteredTasks = tasks.filter((t) => {
        if (!term) return true;
        const haystack = (
            t.title +
            " " +
            t.project_name +
            " " +
            t.volunteer_name +
            " " +
            t.status +
            " " +
            t.priority
        ).toLowerCase();
        return haystack.includes(term);
    });

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500 font-[Cairo]">جاري التحميل...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <section dir="rtl" className="space-y-8">
                {/* البحث */}
                <div dir="ltr" className="flex justify-start">
                    <div className="relative w-[321px] h-[42px]">
                        <div className="absolute inset-0 bg-[#faf6f76b] rounded-[20px] shadow-[inset_0px_0px_8px_#f3e3e3e0,0px_4px_15px_#8d2e4682]" />

                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="البحث عن متطوع او مهارة...."
                            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none pl-10 pr-3 text-[15px] text-[#4e4a4b] [direction:rtl] font-[Cairo]"
                        />

                        <div className="absolute top-1/2 -translate-y-1/2 left-[10px]">
                            <FiSearch className="w-[16px] h-[16px] text-[#4e4a4b]" />
                        </div>
                    </div>
                </div>

                <ProjectOverviewSection stats={stats} />
                <TasksVolunteersTabs
                    tasks={filteredTasks}
                    setTasks={setTasks}
                    volunteers={filteredVolunteers}
                    onTaskUpdate={handleTaskUpdate}
                />
                <PerformanceReportsSection
                    tasks={filteredTasks}
                    volunteers={filteredVolunteers}
                />
            </section>
        </AdminLayout>
    );
};

export default VolunteerManagement;