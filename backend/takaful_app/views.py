from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum, Count, Q

from .models import (
    Project, Service, ServiceRequest, Volunteer, Suggestion, 
    ProjectAssignment, Task, Subtask
)
from .serializers import (
    ProjectSerializer, ServiceSerializer, ServiceRequestSerializer,
    VolunteerSerializer, SuggestionSerializer, ProjectAssignmentSerializer,
    TaskSerializer, SubtaskSerializer, VolunteerDetailSerializer,
    VolunteerRequestSerializer
)


# Custom permission to check if user is admin
class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view) and
            request.user.profile.role == 'admin'
        )


# ============================================================================
# ADMIN STATISTICS ENDPOINTS
# ============================================================================
@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_stats(request):
    """
    GET /api/admin/stats/
    Returns aggregated statistics for admin dashboard (main.tsx)
    """
    active_projects_count = Project.objects.filter(status='ACTIVE').count()
    completed_projects_count = Project.objects.filter(status='COMPLETED').count()
    total_projects_count = Project.objects.count()
    
    total_donations = Project.objects.aggregate(
        total=Sum('donation_amount')
    )['total'] or 0
    
    total_beneficiaries = Project.objects.aggregate(
        total=Sum('beneficiaries')
    )['total'] or 0
    
    return Response({
        'total_donations': float(total_donations),
        'total_beneficiaries': total_beneficiaries,
        'active_projects': active_projects_count,
        'completed_projects': completed_projects_count,
        'total_projects': total_projects_count,
    })


@api_view(['GET'])
@permission_classes([IsAdmin])
def volunteer_stats(request):
    """
    GET /api/admin/volunteer-stats/
    Returns volunteer statistics for VolunteerManagement page
    """
    # ✅ UPDATED: Count only APPROVED volunteers
    total_volunteers = User.objects.filter(
        profile__role='user',
        profile__is_approved=True
    ).count()
    
    # Active volunteers: those with current tasks
    active_volunteers = User.objects.filter(
        profile__role='user',
        profile__is_approved=True,
        assigned_tasks__status__in=['قيد التنفيذ', 'في الانتظار']
    ).distinct().count()
    
    # Total volunteer hours (only approved)
    total_hours = User.objects.filter(
        profile__role='user',
        profile__is_approved=True
    ).aggregate(
        total=Sum('profile__total_volunteer_hours')
    )['total'] or 0
    
    # Completed tasks
    completed_tasks = Task.objects.filter(status='مكتملة').count()
    
    return Response({
        'total_volunteers': total_volunteers,
        'active_volunteers': active_volunteers,
        'total_hours': total_hours,
        'completed_tasks': completed_tasks,
    })


@api_view(['GET'])
@permission_classes([IsAdmin])
def get_my_active_project(request):
    """
    GET /api/admin/my-active-project/
    Returns the admin's currently active project for the bottom section of main page
    """
    try:
        # Get the most recent active project
        project = Project.objects.filter(
            status='ACTIVE'
        ).order_by('-created_at').first()
        
        if project:
            serializer = ProjectSerializer(project)
            data = serializer.data
            
            # Add Arabic status display
            status_map = {
                'ACTIVE': 'نشط',
                'PLANNED': 'متوقف', 
                'COMPLETED': 'مكتمل',
                'CANCELLED': 'ملغي'
            }
            data['status_display'] = status_map.get(project.status, 'نشط')
            
            return Response(data)
        
        # Return null if no active project
        return Response(None, status=200)
        
    except Exception as e:
        return Response({'error': str(e)}, status=500)


# ============================================================================
# PROJECT VIEWSET (Enhanced) - CORRECTED VERSION
# ============================================================================
class ProjectViewSet(viewsets.ModelViewSet):
    """
    Admin endpoint for managing projects
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdmin]
    
    STATUS_MAPPING = {
        'نشط': 'ACTIVE',
        'متوقف': 'PLANNED',
        'مكتمل': 'COMPLETED',
        'ملغي': 'CANCELLED',
        'حالة المشروع': 'PLANNED',
    }
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status', None)
        
        if status_param == 'pending':
            queryset = queryset.filter(status='PLANNED')
        elif status_param == 'active':
            queryset = queryset.filter(status='ACTIVE')
        elif status_param == 'completed':
            queryset = queryset.filter(status='COMPLETED')
        
        return queryset
    
    def update(self, request, *args, **kwargs):
        """Handle full updates (PUT)"""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Make a mutable copy of the data
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        
        # Handle status mapping from Arabic to English
        if 'status' in data:
            arabic_status = data['status']
            english_status = self.STATUS_MAPPING.get(arabic_status, arabic_status)
            data['status'] = english_status
        
        # Serialize and save
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Return updated data with Arabic status for frontend
        response_data = serializer.data
        if 'status' in response_data:
            reverse_status_map = {
                'ACTIVE': 'نشط',
                'PLANNED': 'متوقف',
                'COMPLETED': 'مكتمل',
                'CANCELLED': 'ملغي'
            }
            response_data['status_display'] = reverse_status_map.get(
                response_data['status'], 
                response_data['status']
            )
        
        return Response(response_data)
    
    def partial_update(self, request, *args, **kwargs):
        """Handle partial updates (PATCH)"""
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def assign_volunteer(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {"error": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        assignment, created = ProjectAssignment.objects.get_or_create(
            project=project,
            user=user,
            defaults={'status': 'جديدة'}
        )
        
        if not created:
            return Response(
                {"error": "User already assigned to this project"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ProjectAssignmentSerializer(assignment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        project = self.get_object()
        
        if project.status != 'PLANNED':
            return Response(
                {"error": "Only pending projects can be approved"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project.status = 'ACTIVE'
        project.save()
        
        serializer = self.get_serializer(project)
        return Response({
            "message": "Project approved successfully",
            "project": serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        project = self.get_object()
        
        if project.status != 'PLANNED':
            return Response(
                {"error": "Only pending projects can be rejected"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        project_title = project.title
        project.delete()
        
        return Response({
            "message": f"Project '{project_title}' rejected successfully"
        })


# ============================================================================
# TASK VIEWSET
# ============================================================================
class TaskViewSet(viewsets.ModelViewSet):
    """
    Admin endpoint for managing tasks
    GET /api/admin/tasks/ - List all tasks
    POST /api/admin/tasks/ - Create new task
    PUT /api/admin/tasks/{id}/ - Update task (including subtasks)
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset().select_related('project', 'volunteer__profile')
        
        # Filter by volunteer
        volunteer_id = self.request.query_params.get('volunteer_id')
        if volunteer_id:
            queryset = queryset.filter(volunteer_id=volunteer_id)
        
        # Filter by project
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        # Filter by status
        task_status = self.request.query_params.get('status')
        if task_status:
            queryset = queryset.filter(status=task_status)
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        POST /api/admin/tasks/{id}/assign/
        Body: { "volunteer_id": 1 }
        Assign a task to a volunteer
        """
        task = self.get_object()
        volunteer_id = request.data.get('volunteer_id')
        
        if not volunteer_id:
            return Response(
                {"error": "volunteer_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            volunteer = User.objects.get(id=volunteer_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Volunteer not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        task.volunteer = volunteer
        if task.status == 'في الانتظار':
            task.status = 'قيد التنفيذ'
        task.save()
        
        serializer = self.get_serializer(task)
        return Response({
            "message": "Task assigned successfully",
            "task": serializer.data
        })


# ============================================================================
# VOLUNTEER MANAGEMENT ENDPOINTS
# ============================================================================
@api_view(['GET'])
@permission_classes([IsAdmin])
def list_volunteers(request):
    """
    GET /api/admin/volunteers/
    Returns detailed list of APPROVED volunteers for VolunteerManagement page
    """
    # ✅ UPDATED: Only show approved volunteers
    volunteers = User.objects.filter(
        profile__role='user',
        profile__is_approved=True
    ).select_related('profile').prefetch_related('assigned_tasks')
    
    serializer = VolunteerDetailSerializer(volunteers, many=True)
    return Response({
        'results': serializer.data
    })


@api_view(['GET'])
@permission_classes([IsAdmin])
def volunteer_requests_list(request):
    """
    GET /api/admin/volunteer-requests/
    Returns list of PENDING volunteer approval requests
    For VolunteerRequests.tsx page
    """
    # ✅ UPDATED: Only show pending (not approved) volunteers
    pending_volunteers = User.objects.filter(
        profile__role='user',
        profile__is_approved=False
    ).select_related('profile')
    
    serializer = VolunteerRequestSerializer(pending_volunteers, many=True)
    return Response({
        'results': serializer.data
    })


@api_view(['POST'])
@permission_classes([IsAdmin])
def accept_volunteer_request(request, volunteer_id):
    """
    POST /api/admin/volunteer-requests/{id}/accept/
    Accept a volunteer request
    """
    try:
        volunteer = User.objects.get(id=volunteer_id)
    except User.DoesNotExist:
        return Response(
            {"error": "Volunteer not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # ✅ UPDATED: Mark as approved
    volunteer.profile.is_approved = True
    volunteer.profile.save()
    
    return Response({
        "message": "Volunteer request accepted successfully",
        "volunteer": VolunteerRequestSerializer(volunteer).data
    })


@api_view(['POST'])
@permission_classes([IsAdmin])
def reject_volunteer_request(request, volunteer_id):
    """
    POST /api/admin/volunteer-requests/{id}/reject/
    Reject a volunteer request
    """
    try:
        volunteer = User.objects.get(id=volunteer_id)
    except User.DoesNotExist:
        return Response(
            {"error": "Volunteer not found"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Option: Delete the user or mark as rejected
    volunteer_name = volunteer.profile.name
    volunteer.delete()
    
    return Response({
        "message": f"Volunteer request for '{volunteer_name}' rejected successfully"
    })


# ============================================================================
# PERFORMANCE REPORTS
# ============================================================================
@api_view(['GET'])
@permission_classes([IsAdmin])
def projects_progress_report(request):
    """
    GET /api/admin/reports/projects-progress/
    Returns progress report for all projects
    """
    projects = Project.objects.filter(
        status__in=['ACTIVE', 'COMPLETED']
    ).values('title', 'progress')
    
    return Response({
        'projects': [
            {
                'name': p['title'],
                'progress': p['progress']
            }
            for p in projects
        ]
    })


@api_view(['GET'])
@permission_classes([IsAdmin])
def volunteers_performance_report(request):
    """
    GET /api/admin/reports/volunteers-performance/
    Returns performance report for all volunteers
    """
    # ✅ UPDATED: Only show approved volunteers
    volunteers = User.objects.filter(
        profile__role='user',
        profile__is_approved=True
    ).select_related('profile')
    
    data = []
    for volunteer in volunteers:
        completed = volunteer.assigned_tasks.filter(status='مكتملة').count()
        current = volunteer.assigned_tasks.exclude(status='مكتملة').count()
        total = completed + current
        completion_rate = int((completed / total) * 100) if total > 0 else 0
        
        data.append({
            'name': volunteer.profile.name,
            'completed': completed,
            'current': current,
            'completion_rate': completion_rate,
            'join_date': volunteer.date_joined.strftime('%Y-%m-%d'),
        })
    
    return Response({
        'volunteers': data
    })


@api_view(['GET'])
@permission_classes([IsAdmin])
def volunteer_tasks_report(request):
    """
    GET /api/admin/reports/volunteer-tasks/?volunteer_id=1
    Returns tasks for a specific volunteer
    """
    volunteer_id = request.query_params.get('volunteer_id')
    
    if not volunteer_id:
        return Response(
            {"error": "volunteer_id parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    tasks = Task.objects.filter(
        volunteer_id=volunteer_id
    ).order_by('-due_date')
    
    serializer = TaskSerializer(tasks, many=True)
    return Response({
        'tasks': serializer.data
    })


# ============================================================================
# OTHER VIEWSETS
# ============================================================================
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdmin]


class VolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all()
    serializer_class = VolunteerSerializer
    permission_classes = [IsAdmin]


class SuggestionViewSet(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all()
    serializer_class = SuggestionSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [AllowAny()]


class ProjectAssignmentViewSet(viewsets.ModelViewSet):
    queryset = ProjectAssignment.objects.all()
    serializer_class = ProjectAssignmentSerializer
    permission_classes = [IsAdmin]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset


@api_view(['GET'])
@permission_classes([IsAdmin])
def list_users(request):
    """
    GET /api/admin/users/
    Returns list of all registered users with their profiles
    """
    users = User.objects.select_related('profile').all()
    
    data = []
    for user in users:
        data.append({
            'id': user.id,
            'email': user.email,
            'name': user.profile.name,
            'role': user.profile.role,
            'skills': user.profile.skills,
            'city': user.profile.city,
            'total_volunteer_hours': user.profile.total_volunteer_hours,
            'completed_tasks_count': user.profile.completed_tasks_count,
        })
    
    return Response(data)


# ============================================================================
# AUTH VIEWS (Login & Register)
# ============================================================================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"detail": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=email, password=password)

        if user is None:
            return Response(
                {"detail": "بيانات الدخول غير صحيحة"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "name": user.get_full_name() or user.username,
                "email": user.email or user.username,
                "role": "user",
            },
            status=status.HTTP_200_OK,
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        full_name = request.data.get("fullName") or request.data.get("full_name")
        email = request.data.get("email")
        phone = request.data.get("phone")
        password = request.data.get("password")

        if not full_name or not email or not password:
            return Response(
                {"detail": "الاسم، البريد الإلكتروني، وكلمة السر مطلوبة"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=email).exists():
            return Response(
                {"detail": "هذا البريد مسجّل مسبقاً"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
        )
        user.first_name = full_name
        user.save()

        Volunteer.objects.create(
            full_name=full_name,
            email=email,
            phone=phone or "",
        )

        return Response(
            {
                "name": full_name,
                "email": email,
                "role": "user",
            },
            status=status.HTTP_201_CREATED,
        )