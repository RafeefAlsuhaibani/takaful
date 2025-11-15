from rest_framework import viewsets
from django.contrib.auth.models import User
from .models import Project, Service, ServiceRequest, Volunteer, Suggestion
from .serializers import (
    ProjectSerializer,
    ServiceSerializer,
    ServiceRequestSerializer,
    VolunteerSerializer,
    SuggestionSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate



class AdminProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer


class AdminServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all().order_by("-created_at")
    serializer_class = ServiceSerializer


class AdminServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all().order_by("-created_at")
    serializer_class = ServiceRequestSerializer


class AdminVolunteerViewSet(viewsets.ModelViewSet):
    queryset = Volunteer.objects.all().order_by("-created_at")
    serializer_class = VolunteerSerializer


class AdminSuggestionViewSet(viewsets.ModelViewSet):
    queryset = Suggestion.objects.all().order_by("-created_at")
    serializer_class = SuggestionSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

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
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Accept both camelCase and snake_case from FE
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
