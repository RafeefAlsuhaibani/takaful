from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'projects', views.ProjectViewSet, basename='project')
router.register(r'services', views.ServiceViewSet, basename='service')
router.register(r'volunteers-old', views.VolunteerViewSet, basename='volunteer-old')  # Old volunteer model
router.register(r'suggestions', views.SuggestionViewSet, basename='suggestion')
router.register(r'assignments', views.ProjectAssignmentViewSet, basename='assignment')
router.register(r'tasks', views.TaskViewSet, basename='task')  # NEW: Task management

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Statistics endpoints
    path('stats/', views.admin_stats, name='admin-stats'),
    path('volunteer-stats/', views.volunteer_stats, name='volunteer-stats'),  # NEW
    path('my-active-project/', views.get_my_active_project, name='my-active-project'),  # 🔥 ADD THIS LINE
    
    # Volunteer management (NEW)
    path('volunteers/', views.list_volunteers, name='list-volunteers'),
    
    # Volunteer requests (NEW - for VolunteerRequests.tsx)
    path('volunteer-requests/', views.volunteer_requests_list, name='volunteer-requests-list'),
    path('volunteer-requests/<int:volunteer_id>/accept/', views.accept_volunteer_request, name='accept-volunteer'),
    path('volunteer-requests/<int:volunteer_id>/reject/', views.reject_volunteer_request, name='reject-volunteer'),
    
    # Performance reports (NEW)
    path('reports/projects-progress/', views.projects_progress_report, name='projects-progress'),
    path('reports/volunteers-performance/', views.volunteers_performance_report, name='volunteers-performance'),
    path('reports/volunteer-tasks/', views.volunteer_tasks_report, name='volunteer-tasks'),
    
    # Users list
    path('users/', views.list_users, name='list-users'),
]