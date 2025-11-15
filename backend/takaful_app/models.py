from django.db import models

class Project(models.Model):
    STATUS_CHOICES = [
        ("PLANNED", "Planned"),
        ("ACTIVE", "Active"),
        ("COMPLETED", "Completed"),
    ]

    title = models.CharField(max_length=200)
    desc = models.TextField(blank=True)  # 👈 matches project.desc in FE

    beneficiaries = models.IntegerField(default=0)  # 👈 matches project.beneficiaries
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PLANNED"
    )  # 👈 matches project.status
    location = models.CharField(max_length=200, blank=True)  # 👈 matches project.location
    category = models.CharField(max_length=50, blank=True)   # 👈 matches project.category

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title

class Service(models.Model):
    STATUS_CHOICES = [
        ("متاحة", "متاحة"),
        ("قادمة", "قادمة"),
        ("مكتملة", "مكتملة"),
    ]

    title = models.CharField(max_length=200)              # matches Service.title in FE
    desc = models.TextField(blank=True)                   # matches Service.desc
    status = models.CharField(                            # matches Service.status
        max_length=20, choices=STATUS_CHOICES, default="متاحة"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.title


class ServiceRequest(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
        ("DONE", "Done"),
    ]

    service = models.ForeignKey(
        Service, on_delete=models.CASCADE, related_name="requests"
    )
    beneficiary_name = models.CharField(max_length=200)  # mosque name
    beneficiary_contact = models.CharField(max_length=200, blank=True)
    details = models.TextField(blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="PENDING"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.service.name} for {self.beneficiary_name}"


class Volunteer(models.Model):
    full_name = models.CharField(max_length=200)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return self.full_name


class Suggestion(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    submitted_by = models.CharField(max_length=150, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_reviewed = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.title
