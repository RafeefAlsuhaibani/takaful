import AdminLayout from "../../layout/AdminLayout";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import { Eye, EyeOff, ChevronLeft, Users, SquarePen, FolderOpen, FileText, HandCoins, ChevronDown, ChevronUp, CalendarDays, MapPin, User, Clock, AlertTriangle, X } from "lucide-react";
import Modal from "../../ui/Modal";
import { useAuth } from "../../../contexts/AuthContext";
import { API_BASE_URL } from "../../../config";


interface Project {
    id: number;
    title: string;
    description: string;
    desc?: string;
    beneficiaries: number;
    donations?: number;
    donation_amount?: number;
    progress: number;
    supervisor?: string;
    tags?: string[];
    date?: string;
    start_date?: string;
    organization?: string;
    location?: string;
    hours?: string;
    estimated_hours?: number;
    budget?: string;
    status?: string;
    is_hidden?: boolean;
    category?: string;
    target_audience?: string;
}


// Project Status Dropdown Component
// Project Status Dropdown Component - FIXED VERSION
function ProjectStatusDropdown({ currentStatus, onStatusChange }: { currentStatus: string; onStatusChange: (status: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    const statuses = [
        { value: "نشط", label: "نشط" },
        { value: "متوقف", label: "متوقف" },
        { value: "مكتمل", label: "مكتمل" },
        { value: "ملغي", label: "ملغي" }
    ];

    return (
        <div className="relative" dir="rtl">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 bg-white border-2 border-[#6F1A28] rounded-[8px] sm:rounded-[8px] md:rounded-[20px] min-w-[140px] sm:min-w-[160px] md:min-w-[180px] shadow-sm hover:shadow-md transition-shadow"
                aria-label="اختيار حالة المشروع"
            >
                {/* ✅ FIXED: Changed from "حالة المشروع" to {currentStatus} */}
                <span className="text-[#6F1A28] font-bold text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                    {currentStatus}
                </span>
                {isOpen ? (
                    <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#6F1A28]" />
                ) : (
                    <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#6F1A28]" />
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-[16px] sm:rounded-[18px] md:rounded-[20px] shadow-lg border-2 border-[#A97D84] overflow-hidden z-50">
                    {statuses.map((status) => (
                        <button
                            key={status.value}
                            onClick={() => {
                                onStatusChange(status.value);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full px-3 sm:px-4 py-2.5 sm:py-3 text-right
                                text-[#6F1A28] font-medium text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]
                                bg-white
                                ${currentStatus === status.value ? 'font-bold bg-[#F3E3E3]' : ''}
                                hover:bg-[#F3E3E3] transition-colors
                                first:rounded-t-[14px] sm:first:rounded-t-[16px] md:first:rounded-t-[18px]
                                last:rounded-b-[14px] sm:last:rounded-b-[16px] md:last:rounded-b-[18px]
                            `}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// Project Card Component
function ProjectCard({ project, showProgress = false, isCompleted = false, onDetailsClick, onApprove, onReject }: { project: any; showProgress?: boolean; isCompleted?: boolean; onDetailsClick?: () => void; onApprove?: () => void; onReject?: () => void }) {
    // For finished and active projects, use the new design matching the image
    if (showProgress) {
        return (
            <div className="bg-white rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-200" dir="rtl">
                {/* Title - Dark red/maroon at top right */}
                <h3 className="text-[#6F1A28] font-bold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] mb-3 font-[Cairo] text-right">
                    {project.title}
                </h3>

                {/* Organization Name - Dark gray */}
                {project.organization && (
                    <p className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px] mb-2 font-[Cairo] text-right">
                        {project.organization}
                    </p>
                )}

                {/* Description - Dark gray */}
                <p className="text-gray-700 text-[12px] sm:text-[13px] md:text-[14px] mb-4 leading-relaxed font-[Cairo] text-right">
                    {project.description || project.desc}
                </p>

                {/* Progress Section */}
                {showProgress && project.progress !== undefined && (
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-700 text-[12px] sm:text-[13px] md:text-[14px] font-[Cairo]">
                                التقدم
                            </p>
                            <span className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px] font-[Cairo]">
                                %{project.progress}
                            </span>
                        </div>
                        <div className="bg-gray-300 rounded-full h-2.5 sm:h-3 overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-[#8D2E46]' : 'bg-yellow-400'}`}
                                style={{ width: `${project.progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Footer Metadata - 4 items with icons, arranged right to left */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 justify-center">
                    {/* Calendar */}
                    {(project.date || project.start_date) && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                            <CalendarDays className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600" />
                            <span>{project.date || project.start_date}</span>
                        </div>
                    )}

                    {/* Location */}
                    {project.location && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                            <MapPin className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600" />
                            <span>{project.location}</span>
                        </div>
                    )}

                    {/* Supervisor/Person */}
                    {project.supervisor && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600" />
                            <span>{project.supervisor}</span>
                        </div>
                    )}

                    {/* Hours/Clock */}
                    {(project.hours || project.estimated_hours) && (
                        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                            <Clock className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-600" />
                            <span>{project.hours || `${project.estimated_hours} ساعة`}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // For project ideas, match the image design exactly
    return (
        <div className="bg-white rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-4 sm:p-5 md:p-6 shadow-md border border-gray-200" dir="rtl">
            {/* Top Section: Title on right, Buttons on left */}
            <div className="flex items-start justify-between gap-4 mb-3">
                {/* Title Section - Right side */}
                <div className="flex-1">
                    <h3 className="text-[#6F1A28] font-bold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] mb-2 font-[Cairo] text-right">
                        {project.title}
                    </h3>

                    {/* Metadata with icons */}
                    <div className="flex flex-wrap items-center gap-4 sm:gap-5 text-gray-600 text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                        {(project.date || project.start_date) && (
                            <div className="flex items-center gap-1.5">
                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                <span>{project.date || project.start_date}</span>
                            </div>
                        )}
                        {project.supervisor && (
                            <div className="flex items-center gap-1.5">
                                <User className="w-4 h-4 text-gray-500" />
                                <span>{project.supervisor}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons - Left side */}
                <div className="flex gap-2 flex-shrink-0">
                    <button
                        onClick={onApprove}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[12px] md:text-[13px] font-medium transition flex items-center gap-1.5 font-[Cairo]"
                        aria-label="اعتماد المشروع"
                    >
                        اعتماد
                    </button>
                    <button
                        onClick={onReject}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-[12px] md:text-[13px] font-medium transition flex items-center gap-1.5 font-[Cairo]"
                        aria-label="رفض المشروع"
                    >
                        رفض
                    </button>
                </div>
            </div>

            {/* Description Section */}
            <p className="text-gray-700 text-[12px] sm:text-[13px] md:text-[14px] mb-4 leading-relaxed font-[Cairo] text-right">
                {project.description || project.desc}
            </p>

            {/* Footer Section: Budget on right, Tags in middle, Details button on left */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
                {/* Budget - Right side */}
                {(project.budget || project.donation_amount) && (
                    <div className="text-[#6F1A28] font-semibold text-[13px] sm:text-[14px] md:text-[15px] font-[Cairo]">
                        {project.budget || `${project.donation_amount} ريال`}
                    </div>
                )}

                {/* Tags - Middle */}
                <div className="flex flex-wrap gap-2 flex-1 justify-center">
                    {project.tags && project.tags.map((tag: string, idx: number) => {
                        const isMedium = tag === "متوسطة";
                        const isLarge = tag === "كبيرة";
                        return (
                            <span
                                key={idx}
                                className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] md:text-[12px] font-[Cairo] flex items-center gap-1 ${isMedium
                                    ? 'bg-[#FFDAB9] text-orange-700'
                                    : isLarge
                                        ? 'bg-[#E0F2F7] text-blue-700'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                            >
                                {(isMedium || isLarge) && (
                                    <AlertTriangle className="w-3 h-3" />
                                )}
                                {tag}
                            </span>
                        );
                    })}
                </div>

                {/* Details Button - Left side */}
                <button
                    onClick={onDetailsClick}
                    className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-[#6F1A28] text-[11px] sm:text-[12px] md:text-[13px] transition font-[Cairo] bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg"
                    aria-label={`عرض تفاصيل ${project.title}`}
                >
                    عرض التفاصيل
                </button>
            </div>
        </div>
    );
}

export default function AdminMain() {
    const { access } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("افكار المشاريع");
    const tabs = ["افكار المشاريع", "المشاريع المنتهية", "المشاريع النشطة"];
    const [selectedProject, setSelectedProject] = useState<any | null>(null);
    const [rejectConfirmProject, setRejectConfirmProject] = useState<any | null>(null);
    const [removedProjects, setRemovedProjects] = useState<Set<number>>(new Set());
    const [visibleProjectsCount, setVisibleProjectsCount] = useState<{ [key: string]: number }>({
        "افكار المشاريع": 2,
        "المشاريع النشطة": 2,
        "المشاريع المنتهية": 2
    });

    // API States
    const [stats, setStats] = useState({
        total_donations: "0",
        total_beneficiaries: "0",
        active_projects: "0",
        completed_projects: "0",
        total_projects: "0"
    });
    const [projectIdeas, setProjectIdeas] = useState<Project[]>([]);
    const [activeProjects, setActiveProjects] = useState<Project[]>([]);
    const [completedProjects, setCompletedProjects] = useState<Project[]>([]);
    const [participationRequests, setParticipationRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Bottom Project Section States
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [projectStatus, setProjectStatus] = useState("حالة المشروع");
    const [isProjectHidden, setIsProjectHidden] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        projectName: '',
        projectType: '',
        projectDescription: '',
        targetAudience: '',
        beneficiaries: '',
        donationAmount: '',
        startDate: '',
        endDate: '',
    });

    // Fetch all data on mount
    useEffect(() => {
        fetchStats();
        fetchProjects();
        fetchParticipationRequests();
        fetchActiveProject();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/stats/`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (response.ok) {
                const data = await response.json();
                setStats({
                    total_donations: data.total_donations?.toLocaleString() || "0",
                    total_beneficiaries: `+ ${data.total_beneficiaries || 0}`,
                    active_projects: data.active_projects?.toString() || "0",
                    completed_projects: data.completed_projects?.toString() || "0",
                    total_projects: data.total_projects?.toString() || "0"
                });
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            // Fetch pending projects (ideas)
            const pendingResponse = await fetch(`${API_BASE_URL}/api/admin/projects/?status=pending`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (pendingResponse.ok) {
                const pendingData = await pendingResponse.json();
                setProjectIdeas(pendingData.results || pendingData);
            }

            // Fetch active projects
            const activeResponse = await fetch(`${API_BASE_URL}/api/admin/projects/?status=active`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (activeResponse.ok) {
                const activeData = await activeResponse.json();
                setActiveProjects(activeData.results || activeData);
            }

            // Fetch completed projects
            const completedResponse = await fetch(`${API_BASE_URL}/api/admin/projects/?status=completed`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (completedResponse.ok) {
                const completedData = await completedResponse.json();
                setCompletedProjects(completedData.results || completedData);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchParticipationRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/volunteer-requests/?limit=4`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (response.ok) {
                const data = await response.json();
                setParticipationRequests(data.results || []);
            }
        } catch (error) {
            console.error('Error fetching participation requests:', error);
        }
    };

    const fetchActiveProject = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/my-active-project/`, {
                headers: { 'Authorization': `Bearer ${access}` }
            });
            if (response.ok) {
                const data = await response.json();
                if (data) {
                    setActiveProject(data);
                    setProjectStatus(data.status_display || "نشط");
                    setIsProjectHidden(data.is_hidden || false);
                    setEditFormData({
                        projectName: data.title || '',
                        projectType: data.category || 'أساسي',
                        projectDescription: data.desc || data.description || '',
                        targetAudience: data.target_audience || '',
                        beneficiaries: data.beneficiaries?.toString() || '',
                        donationAmount: data.donation_amount?.toString() || '',
                        startDate: data.start_date || '',
                        endDate: data.end_date || '',
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching active project:', error);
        }
    };

    const handleApproveProject = async (projectId: number) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${projectId}/approve/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setRemovedProjects(prev => new Set(prev).add(projectId));
                fetchStats();
                fetchProjects();
            }
        } catch (error) {
            console.error('Error approving project:', error);
        }
    };

    const handleRejectProject = async (project: any) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${project.id}/reject/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setRemovedProjects(prev => new Set(prev).add(project.id));
                setRejectConfirmProject(null);
                fetchStats();
                fetchProjects();
            }
        } catch (error) {
            console.error('Error rejecting project:', error);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!activeProject) return;
    
        try {
            const statusMap: { [key: string]: string } = {
                "نشط": "ACTIVE",
                "متوقف": "PLANNED",
                "مكتمل": "COMPLETED",
                "ملغي": "CANCELLED"
            };
    
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${activeProject.id}/`, {
                method: 'PATCH',  // ✅ Changed to PATCH
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: statusMap[newStatus] || newStatus
                })
            });
    
            if (response.ok) {
                setProjectStatus(newStatus);
                fetchActiveProject();
                fetchStats();
                fetchProjects();
            } else {
                const error = await response.json();
                console.error('Error updating status:', error);
            }
        } catch (error) {
            console.error('Error updating project status:', error);
        }
    };
    
    const handleToggleProjectVisibility = async () => {
        if (!activeProject) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${activeProject.id}/`, {
                method: 'PATCH',  // ✅ Changed to PATCH
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    is_hidden: !isProjectHidden
                })
            });
    
            if (response.ok) {
                setIsProjectHidden(!isProjectHidden);
                fetchActiveProject();
            } else {
                const error = await response.json();
                console.error('Error toggling visibility:', error);
            }
        } catch (error) {
            console.error('Error toggling project visibility:', error);
        }
    };
    const handleSaveEdit = async () => {
        if (!activeProject) return;
    
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/projects/${activeProject.id}/`, {
                method: 'PATCH',  // ✅ Changed from PUT to PATCH
                headers: {
                    'Authorization': `Bearer ${access}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editFormData.projectName,
                    category: editFormData.projectType,
                    desc: editFormData.projectDescription,
                    target_audience: editFormData.targetAudience,
                    beneficiaries: parseInt(editFormData.beneficiaries) || 0,
                    donation_amount: parseFloat(editFormData.donationAmount) || 0,
                    start_date: editFormData.startDate,
                    end_date: editFormData.endDate,
                    // Include status if it was changed in the modal
                    status: projectStatus !== "حالة المشروع" ? projectStatus : undefined
                })
            });
    
            if (response.ok) {
                const updatedProject = await response.json();
                alert('تم حفظ التعديلات بنجاح!');
                setShowEditModal(false);
                
                // Refresh all data
                fetchActiveProject();
                fetchStats();
                fetchProjects();
            } else {
                const errorData = await response.json();
                console.error('Error saving project:', errorData);
                alert('حدث خطأ أثناء حفظ التعديلات');
            }
        } catch (error) {
            console.error('Error saving project edit:', error);
            alert('حدث خطأ أثناء حفظ التعديلات');
        }
    };

    const statsData = [
        {
            value: stats.total_donations,
            label: "اجمالي التبرعات",
            icon: <HandCoins className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-yellow-400" />
        },
        {
            value: stats.total_beneficiaries,
            label: "اجمالي المستفيدين",
            icon: <img src="https://c.animaapp.com/u4OaXzk0/img/multiple-neutral-2-streamline-ultimate-regular@2x.png" alt="المستفيدين" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12" />
        },
        {
            value: stats.active_projects,
            label: "المشاريع النشطة",
            icon: <FolderOpen className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-yellow-400" />
        },
        {
            value: stats.completed_projects,
            label: "المشاريع المكتملة",
            icon: <img src="https://c.animaapp.com/u4OaXzk0/img/time-clock-file-setting-streamline-ultimate-regular@2x.png" alt="المشاريع المكتملة" className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12" />
        },
        {
            value: stats.total_projects,
            label: "اجمالي المشاريع",
            icon: <FileText className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-yellow-400" />
        },
    ];

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
            <div className="h-full">
                {/* Search Bar */}
                <div dir="ltr" className="flex justify-start mb-5 sm:mb-6">
                    <div className="relative w-full max-w-[280px] sm:max-w-[300px] md:max-w-[321px] h-[38px] sm:h-[40px] md:h-[42px]">
                        <div className="absolute inset-0 bg-[#faf6f76b] rounded-[20px] shadow-[inset_0px_0px_8px_#f3e3e3e0,0px_4px_15px_#8d2e4682]" />
                        <input
                            type="text"
                            placeholder="البحث..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="absolute inset-0 w-full h-full bg-transparent border-none outline-none pl-9 sm:pl-10 pr-3 text-[13px] sm:text-[14px] md:text-[15px] text-[#4e4a4b] [direction:rtl] font-[Cairo]"
                            aria-label="البحث في المشاريع"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 left-[8px] sm:left-[10px]">
                            <FiSearch className="w-[14px] h-[14px] sm:w-[15px] sm:h-[15px] md:w-[16px] md:h-[16px] text-[#4e4a4b]" />
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="bg-[#F3E3E3] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] shadow-xl mb-4 sm:mb-5 md:mb-6 p-4 sm:p-5 md:p-6 border border-[#f0d8c2]">
                    <div className="text-center mb-3 sm:mb-4">
                        <span className="text-[#6F1A28] font-bold text-[19px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-[Cairo]">
                            احصائيات مدير المشروع
                        </span>
                    </div>

                    <div className="flex justify-center mb-4">
                        <div className="w-[700px] h-[2px] bg-[#B98A91] rounded-full shadow-[0_3px_8px_rgba(185,138,145,0.35)]"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {statsData.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 md:gap-3 px-2 sm:px-3 py-2 relative"
                            >
                                <div className="flex-shrink-0">
                                    {stat.icon}
                                </div>

                                <div className="flex flex-col items-center gap-1">
                                    <p className="text-[#6F1A28] font-black text-[20px] sm:text-[22px] md:text-[26px] lg:text-[28px]">
                                        {stat.value}
                                    </p>
                                    <p className="text-[#6F1A28] text-[10px] sm:text-[11px] md:text-[12px] text-center leading-tight font-[Cairo]">
                                        {stat.label}
                                    </p>
                                </div>

                                {index !== statsData.length - 1 && (
                                    <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 h-16 md:h-18 lg:h-20 w-px bg-[#d7b7ae]" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Columns */}
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
                    {/* Projects Tabs Column */}
                    <div className="flex-1 min-w-0">
                        <div className="bg-[#ab686f] rounded-t-[16px] sm:rounded-t-[18px] md:rounded-t-[20px] flex overflow-x-auto shadow-lg">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={` flex-1 py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 lg:px-6 text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] font-bold font-[Cairo] transition-all duration-200 whitespace-nowrap relative
                                        ${activeTab === tab
                                            ? "bg-[#F3E3E3] text-[#291613] rounded-t-[16px] sm:rounded-t-[18px] md:rounded-t-[20px] shadow-sm"
                                            : "text-white/50"}
                                            `} aria-label={`عرض ${tab}`} role="tab" aria-selected={activeTab === tab}>
                                    {tab}
                                    {activeTab === tab && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-[2px] bg-[#d9bdc1] rounded-t-full"></span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="bg-[#F3E3E3] rounded-b-[16px] sm:rounded-b-[18px] md:rounded-b-[20px] p-3 sm:p-4 md:p-5 lg:p-6 space-y-3 sm:space-y-4" role="tabpanel" style={{ minHeight: '600px' }}>
                            {activeTab === "افكار المشاريع" && (
                                <>
                                    {projectIdeas
                                        .filter(project => !removedProjects.has(project.id))
                                        .slice(0, visibleProjectsCount["افكار المشاريع"])
                                        .map((project) => (
                                            <ProjectCard
                                                key={project.id}
                                                project={project}
                                                onDetailsClick={() => setSelectedProject(project)}
                                                onApprove={() => handleApproveProject(project.id)}
                                                onReject={() => setRejectConfirmProject(project)}
                                            />
                                        ))}
                                    {projectIdeas.filter(project => !removedProjects.has(project.id)).length > visibleProjectsCount["افكار المشاريع"] && (
                                        <div className="flex justify-center -mb-6 sm:-mb-3">
                                            <button
                                                onClick={() => setVisibleProjectsCount(prev => ({ ...prev, "افكار المشاريع": prev["افكار المشاريع"] + 2 }))}
                                                className="py-2 text-sm text-gray-700 font-[Cairo] mt-2">
                                                عرض المزيد
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "المشاريع النشطة" && (
                                <>
                                    {activeProjects
                                        .filter(project => !removedProjects.has(project.id))
                                        .slice(0, visibleProjectsCount["المشاريع النشطة"])
                                        .map((project) => (
                                            <ProjectCard key={project.id} project={project} showProgress={true} onDetailsClick={() => setSelectedProject(project)} />
                                        ))}
                                    {activeProjects.filter(project => !removedProjects.has(project.id)).length > visibleProjectsCount["المشاريع النشطة"] && (
                                        <div className="flex justify-center -mb-6 sm:-mb-3">
                                            <button
                                                onClick={() => setVisibleProjectsCount(prev => ({ ...prev, "المشاريع النشطة": prev["المشاريع النشطة"] + 2 }))}
                                                className="py-2 text-sm text-gray-700 font-[Cairo] mt-2">
                                                عرض المزيد
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === "المشاريع المنتهية" && (
                                <>
                                    {completedProjects
                                        .filter(project => !removedProjects.has(project.id))
                                        .slice(0, visibleProjectsCount["المشاريع المنتهية"])
                                        .map((project) => (
                                            <ProjectCard key={project.id} project={project} showProgress={true} isCompleted={true} onDetailsClick={() => setSelectedProject(project)} />
                                        ))}
                                    {completedProjects.filter(project => !removedProjects.has(project.id)).length > visibleProjectsCount["المشاريع المنتهية"] && (
                                        <div className="flex justify-center -mb-6 sm:-mb-3">
                                            <button
                                                onClick={() => setVisibleProjectsCount(prev => ({ ...prev, "المشاريع المنتهية": prev["المشاريع المنتهية"] + 2 }))}
                                                className="py-2 text-sm text-gray-700 font-[Cairo] mt-2">
                                                عرض المزيد
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Requests Column */}
                    <div className="w-full lg:w-[300px] xl:w-[340px] lg:flex-shrink-0">
                        <div className="bg-[#F3E3E3] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg border border-[#f0d8c2]">
                            <h3 className="text-[#6F1A28] font-bold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] mb-3 sm:mb-4 font-[Cairo]">
                                طلبات المشاركة بالمشاريع
                            </h3>

                            <div className="space-y-2 sm:space-y-2.5 md:space-y-3 mb-3 sm:mb-4">
                                {participationRequests.map((request) => (
                                    <div
                                        key={request.id}
                                        className="bg-white rounded-[12px] sm:rounded-[14px] md:rounded-[16px] p-2.5 sm:p-3 md:p-4 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                                        role="button"
                                        tabIndex={0}
                                        onClick={() => navigate('/Admin/requests')}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                navigate('/Admin/requests');
                                            }
                                        }}
                                        aria-label={`عرض تفاصيل طلب ${request.name}`}
                                    >
                                        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
                                            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#ab686f] rounded-full flex items-center justify-center text-white font-semibold text-[12px] sm:text-[13px] md:text-[14px]">
                                                {request.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-[#6F1A28] font-semibold text-[11px] sm:text-[12px] md:text-[13px] font-[Cairo]">
                                                    {request.name}
                                                </p>
                                                <p className="text-gray-600 text-[9px] sm:text-[10px] md:text-[11px] font-[Cairo]">
                                                    {request.role}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#6F1A28]" />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/Admin/requests')}
                                className="w-full py-2 sm:py-2.5 rounded-lg text-[11px] sm:text-[12px] md:text-[13px] font-medium transition hover:opacity-80 bg-[#ab686f] text-white font-[Cairo] focus:outline-none focus:ring-2 focus:ring-[#ab686f] focus:ring-offset-2"
                                aria-label="مشاهدة جميع التفاصيل"
                            >
                                مشاهدة التفاصيل
                            </button>
                        </div>
                    </div>
                </div>


                {/* Bottom Project Section */}
                {activeProject ? (
                    <div className="bg-[#F3E3E3] rounded-[16px] sm:rounded-[18px] md:rounded-[20px] p-4 sm:p-6 md:p-8 lg:p-10 shadow-xl border border-[#f0d8c2] w-full relative" dir="rtl">
                        <div className="flex items-start justify-between gap-4 mb-4 sm:mb-8 flex-row-reverse">

                            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                                <button
                                    onClick={() => setShowEditModal(true)}
                                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                    aria-label="تعديل المشروع"
                                >
                                    <SquarePen className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                </button>

                                <div className="relative group">
                                    <button
                                        onClick={handleToggleProjectVisibility}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors relative"
                                        aria-label={isProjectHidden ? "إظهار المشروع" : "إخفاء المشروع"}
                                    >
                                        {isProjectHidden ? (
                                            <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        ) : (
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        )}
                                    </button>

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-white text-gray-700 text-xs rounded-lg shadow-lg border border-gray-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {isProjectHidden ? "إظهار المشروع" : "إخفاء المشروع"}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 text-center">
                                <h2 className="text-[#6F1A28] font-bold text-[19px] sm:text-[20px] md:text-[22px] lg:text-[24px] font-[Cairo] mb-6">
                                    {activeProject.title}
                                </h2>

                                <div className="w-full max-w-[600px] mx-auto h-[2px] bg-[#B98A91] mb-6" />

                                <p className="text-gray-700 text-[13px] sm:text-[14px] md:text-[15px] leading-relaxed font-[Cairo] max-w-4xl mx-auto">
                                    {activeProject.description || activeProject.desc}
                                </p>
                            </div>

                            <div className="flex justify-start flex-shrink-0">
                                <ProjectStatusDropdown
                                    currentStatus={projectStatus}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] items-center pt-6" dir="rtl">

                            <div className="flex flex-col items-center text-center">
                                <p className="text-gray-600 text-[19px] font-medium mb-3 font-[Cairo]">
                                    عدد المستفيدين :
                                </p>

                                <div className="flex items-center gap-3">
                                    <span className="text-[#6F1A28] font-bold text-[20px] font-[Cairo]">
                                        {activeProject.beneficiaries}
                                    </span>
                                    <Users className="w-6 h-6 text-yellow-400" />
                                </div>
                            </div>


                            <div className="hidden sm:flex justify-center">
                                <span className="w-[3px] h-24 bg-[#d9bdc1]" />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <p className="text-gray-600 text-[19px] font-medium mb-3 font-[Cairo]">
                                    التبرعات للمشروع :
                                </p>

                                <div className="flex items-center gap-3">
                                    <span className="text-[#6F1A28] font-bold text-[20px] font-[Cairo]">
                                        {(activeProject.donations || activeProject.donation_amount || 0).toLocaleString()}
                                    </span>
                                    <HandCoins className="w-6 h-6 text-yellow-400" />
                                </div>
                            </div>

                            <div className="hidden sm:flex justify-center">
                                <span className="w-[3px] h-24 bg-[#d9bdc1]" />
                            </div>

                            <div className="flex flex-col items-center text-center">
                                <p className="text-gray-600 text-[19px] font-medium mb-3 font-[Cairo]">
                                    نسبة اكتمال المشروع :
                                </p>

                                <span className="text-[#6F1A28] font-bold text-[20px] font-[Cairo] mb-2">
                                    %{activeProject.progress}
                                </span>

                                <div className="w-[200px] bg-gray-300 rounded-full h-3 overflow-hidden">
                                    <div className="bg-yellow-400 h-3 rounded-full" style={{ width: `${activeProject.progress}%`, marginLeft: 'auto', }} />
                                </div>
                            </div>
                        </div>


                        {/* Edit Project Modal */}
                        {showEditModal && (
                            <div
                                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                                onClick={() => setShowEditModal(false)}
                            >
                                <div
                                    className="bg-[#fdf8f9] rounded-[20px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide"
                                    onClick={(e) => e.stopPropagation()}
                                    dir="rtl"
                                >
                                    {/* Modal Header */}
                                    <div className="sticky top-0 bg-[#f3e3e3] rounded-t-[20px] px-6 py-4 border-b-2 border-[#e0cfd4] flex items-center justify-between">
                                        <h2 className="text-[20px] sm:text-[22px] md:text-[24px] font-bold text-[#2e2b2c] font-[Cairo]">
                                            تعديل بيانات المشروع
                                        </h2>
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#8d2e46] hover:bg-[#6b1e2a] text-white flex items-center justify-center transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Modal Body */}
                                    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                                        <div className="bg-white/60 rounded-[18px] p-4 sm:p-5">
                                            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#2e2b2c] mb-3 sm:mb-4 font-[Cairo] flex items-center gap-2">
                                                <span className="w-1 h-6 bg-[#8d2e46] rounded-full"></span>
                                                المعلومات الأساسية
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                {/* اسم المشروع */}
                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        اسم المشروع
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.projectName}
                                                        onChange={(e) => setEditFormData({ ...editFormData, projectName: e.target.value })}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        نوع المشروع
                                                    </label>
                                                    <select
                                                        value={editFormData.projectType}
                                                        onChange={(e) => setEditFormData({ ...editFormData, projectType: e.target.value })}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                    >
                                                        <option value="أساسي">أساسي</option>
                                                        <option value="مجتمعي">مجتمعي</option>
                                                        <option value="مؤسسي">مؤسسي</option>
                                                    </select>
                                                </div>

                                                <div className="md:col-span-2">
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        وصف المشروع
                                                    </label>
                                                    <textarea
                                                        value={editFormData.projectDescription}
                                                        onChange={(e) => setEditFormData({ ...editFormData, projectDescription: e.target.value })}
                                                        rows={3}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] resize-none font-[Cairo]"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white/60 rounded-[18px] p-4 sm:p-5">
                                            <h3 className="text-[16px] sm:text-[18px] font-bold text-[#2e2b2c] mb-3 sm:mb-4 font-[Cairo] flex items-center gap-2">
                                                <span className="w-1 h-6 bg-[#8d2e46] rounded-full"></span>
                                                تفاصيل التخطيط
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        الفئة المستهدفة
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={editFormData.targetAudience}
                                                        onChange={(e) => setEditFormData({ ...editFormData, targetAudience: e.target.value })}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        عدد المستفيدين
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editFormData.beneficiaries}
                                                        onChange={(e) => setEditFormData({ ...editFormData, beneficiaries: e.target.value })}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        مبلغ التبرع للمشروع
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={editFormData.donationAmount}
                                                            onChange={(e) => setEditFormData({ ...editFormData, donationAmount: e.target.value })}
                                                            className="flex-1 bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                        />
                                                        <span className="text-[12px] sm:text-[13px] text-gray-700 font-medium font-[Cairo]">ريال</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[12px] sm:text-[13px] font-semibold text-gray-800 mb-1.5 sm:mb-2 font-[Cairo]">
                                                        حالة المشروع
                                                    </label>
                                                    <select
                                                        value={projectStatus}
                                                        onChange={(e) => setProjectStatus(e.target.value)}
                                                        className="w-full bg-white rounded-xl border border-[#8d2e46] px-3 sm:px-4 py-2 sm:py-2.5 text-[12px] sm:text-[13px] md:text-[14px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8d2e46] font-[Cairo]"
                                                    >
                                                        <option value="نشط">نشط</option>
                                                        <option value="متوقف">متوقف</option>
                                                        <option value="مكتمل">مكتمل</option>
                                                        <option value="ملغي">ملغي</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="sticky bottom-0 bg-[#f3e3e3] rounded-b-[20px] px-6 py-4 border-t-2 border-[#e0cfd4] flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="w-full sm:w-auto bg-[#8d2e46] hover:bg-[#6b1e2a] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] md:text-[14px] font-bold transition-colors font-[Cairo] flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            حفظ التعديلات
                                        </button>
                                        <button
                                            onClick={() => setShowEditModal(false)}
                                            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#8d2e46] border-2 border-[#8d2e46] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-[12px] sm:text-[13px] md:text-[14px] font-bold transition-colors font-[Cairo] flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            إلغاء
                                        </button>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                ) : (
                    <div className="bg-[#F3E3E3] rounded-[20px] p-10 shadow-lg border border-[#f0d8c2] text-center" dir="rtl">
                        <p className="text-gray-600 text-xl font-[Cairo]">لا يوجد مشروع نشط</p>
                    </div>
                )}
            </div>

            {/* Project Details Dialog */}
            {selectedProject && (
                <Modal
                    open={!!selectedProject}
                    onClose={() => setSelectedProject(null)}
                    labelledById="project-dialog-title"
                >
                    <div className="flex flex-col max-h-[80vh]" dir="rtl">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-start justify-between">
                            <div className="flex-1">
                                <h2 id="project-dialog-title" className="text-2xl font-bold text-[#6F1A28] font-[Cairo] mb-2">
                                    {selectedProject.title}
                                </h2>
                                {(selectedProject.date || selectedProject.start_date || selectedProject.supervisor) && (
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm font-[Cairo]">
                                        {(selectedProject.date || selectedProject.start_date) && (
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                                <span>{selectedProject.date || selectedProject.start_date}</span>
                                            </div>
                                        )}
                                        {selectedProject.supervisor && (
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span>{selectedProject.supervisor}</span>
                                            </div>
                                        )}
                                        {selectedProject.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-gray-500" />
                                                <span>{selectedProject.location}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="rounded-xl p-2 hover:bg-white/50 transition-colors"
                                aria-label="إغلاق"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto px-6 py-6 bg-white">
                            {/* Description */}
                            {(selectedProject.description || selectedProject.desc) && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#6F1A28] mb-3 font-[Cairo]">الوصف</h3>
                                    <p className="text-gray-700 leading-relaxed font-[Cairo]">
                                        {selectedProject.description || selectedProject.desc}
                                    </p>
                                </div>
                            )}

                            {/* Budget */}
                            {(selectedProject.budget || selectedProject.donation_amount) && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#6F1A28] mb-3 font-[Cairo]">الميزانية</h3>
                                    <p className="text-[#6F1A28] font-semibold text-xl font-[Cairo]">
                                        {selectedProject.budget || `${selectedProject.donation_amount} ريال`}
                                    </p>
                                </div>
                            )}

                            {/* Progress (for active/completed projects) */}
                            {selectedProject.progress !== undefined && (
                                <div className="mb-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-lg font-bold text-[#6F1A28] font-[Cairo]">التقدم</h3>
                                        <span className="text-gray-700 text-base font-[Cairo]">
                                            %{selectedProject.progress}
                                        </span>
                                    </div>
                                    <div className="bg-gray-300 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-[#8D2E46] h-full rounded-full transition-all duration-300"
                                            style={{ width: `${selectedProject.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {selectedProject.tags && selectedProject.tags.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#6F1A28] mb-3 font-[Cairo]">التصنيفات</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedProject.tags.map((tag: string, idx: number) => {
                                            const isMedium = tag === "متوسطة";
                                            const isLarge = tag === "كبيرة";
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`px-3 py-1 rounded-full text-sm font-[Cairo] flex items-center gap-1 ${isMedium
                                                        ? 'bg-[#FFDAB9] text-orange-700'
                                                        : isLarge
                                                            ? 'bg-[#E0F2F7] text-blue-700'
                                                            : 'bg-gray-200 text-gray-700'
                                                        }`}
                                                >
                                                    {(isMedium || isLarge) && (
                                                        <AlertTriangle className="w-3 h-3" />
                                                    )}
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {selectedProject.organization && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#6F1A28] mb-2 font-[Cairo]">الجمعية</h3>
                                    <p className="text-gray-700 font-[Cairo]">{selectedProject.organization}</p>
                                </div>
                            )}

                            {(selectedProject.hours || selectedProject.estimated_hours) && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-[#6F1A28] mb-2 font-[Cairo]">عدد الساعات</h3>
                                    <div className="flex items-center gap-2 text-gray-700 font-[Cairo]">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span>{selectedProject.hours || `${selectedProject.estimated_hours} ساعة`}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}

            {rejectConfirmProject && (
                <Modal
                    open={!!rejectConfirmProject}
                    onClose={() => setRejectConfirmProject(null)}
                    labelledById="reject-confirm-title"
                >
                    <div className="p-6" dir="rtl">
                        <h3 id="reject-confirm-title" className="text-xl font-bold text-[#6F1A28] mb-4 font-[Cairo]">

                            هل أنت متأكد من رفض المشروع "{rejectConfirmProject.title}"؟ لا يمكن التراجع عن هذا الإجراء.
                        </h3>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setRejectConfirmProject(null)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition font-[Cairo]"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={() => handleRejectProject(rejectConfirmProject)}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-[Cairo]"
                            >
                                رفض المشروع
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </AdminLayout >
    );
}