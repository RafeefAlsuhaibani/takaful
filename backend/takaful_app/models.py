from django.db import models
from django.contrib.auth.models import User 


class Project(models.Model):
    STATUS_CHOICES = [
        ("PLANNED", "Planned"),
        ("ACTIVE", "Active"),
        ("COMPLETED", "Completed"),
    ]

    # Basic Information
    title = models.CharField(max_length=200)
    desc = models.TextField(blank=True)
    category = models.CharField(max_length=50, blank=True)  # أساسي, مجتمعي, مؤسسي
    
    # Target & Impact
    target_audience = models.CharField(max_length=200, blank=True)  # الفئة المستهدفة
    beneficiaries = models.IntegerField(default=0)
    
    # Location
    location = models.CharField(max_length=200, blank=True)
    
    # Financial
    donation_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # مبلغ التبرع
    
    # Timeline
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    # Planning Details
    implementation_requirements = models.TextField(blank=True)  # متطلبات التنفيذ
    project_goals = models.TextField(blank=True)  # أهداف المشروع
    
    # Volunteer Management
    estimated_hours = models.IntegerField(default=0)
    supervisor = models.CharField(max_length=200, blank=True)
    duration = models.CharField(max_length=100, blank=True)
    
    # NEW FIELDS FOR ADMIN DASHBOARD
    tags = models.JSONField(default=list, blank=True)  # ["متوسطة", "تسويق"]
    progress = models.IntegerField(default=0)  # 0-100 percentage
    organization = models.CharField(max_length=200, blank=True)  # "جمعية تمكين"
    hours = models.CharField(max_length=50, blank=True)  # "40 ساعة"
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PLANNED")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Service(models.Model):
    STATUS_CHOICES = [
        ("متاحة", "متاحة"),
        ("قادمة", "قادمة"),
        ("مكتملة", "مكتملة"),
    ]

    title = models.CharField(max_length=200)
    desc = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="متاحة")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("DONE", "Done"),
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="requests")
    beneficiary_name = models.CharField(max_length=200)
    beneficiary_contact = models.CharField(max_length=200, blank=True)
    details = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.service.title} for {self.beneficiary_name}"


class Volunteer(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name


class Suggestion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    submitted_by = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class ProjectAssignment(models.Model):
    """
    Assign projects to users (volunteers)
    Links User (from accounts) to Project
    """
    STATUS_CHOICES = [
        ("جديدة", "New"),
        ("قيد التنفيذ", "In Progress"),
        ("معلقة", "On Hold"),
        ("مكتملة", "Completed"),
        ("ملغية", "Cancelled"),
    ]
    
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="assignments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="project_assignments")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="جديدة")
    assigned_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    hours_contributed = models.IntegerField(default=0)
    progress = models.IntegerField(default=0)  # 0-100
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['project', 'user']
        ordering = ['-assigned_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.project.title} ({self.status})"


class Task(models.Model):
    """
    Tasks assigned to volunteers within projects
    Used in VolunteerManagement page
    """
    STATUS_CHOICES = [
        ("قيد التنفيذ", "In Progress"),
        ("في الانتظار", "Waiting"),
        ("مكتملة", "Completed"),
        ("معلقة", "On Hold"),
    ]
    
    PRIORITY_CHOICES = [
        ("عالية", "High"),
        ("متوسطة", "Medium"),
        ("منخفضة", "Low"),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")
    volunteer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_tasks")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="في الانتظار")
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default="متوسطة")
    
    due_date = models.DateField(null=True, blank=True)
    hours = models.IntegerField(default=0)  # Estimated hours
    progress = models.IntegerField(default=0)  # 0-100, auto-calculated from subtasks
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.project.title}"
    
    def calculate_progress(self):
        """Calculate progress based on completed subtasks"""
        subtasks = self.subtasks.all()
        if not subtasks.exists():
            return self.progress
        
        total = subtasks.count()
        completed = subtasks.filter(completed=True).count()
        return int((completed / total) * 100) if total > 0 else 0


class Subtask(models.Model):
    """
    Subtasks for breaking down tasks into smaller pieces
    """
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="subtasks")
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.task.title} - {self.title}"