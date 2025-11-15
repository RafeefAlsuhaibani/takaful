from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdminProjectViewSet,
    AdminServiceViewSet,
    AdminServiceRequestViewSet,
    AdminVolunteerViewSet,
    AdminSuggestionViewSet,
    LoginView,
    RegisterView,
   # submit_suggestion,

   
)


# DRF router for admin APIs
admin_router = DefaultRouter()
admin_router.register("projects", AdminProjectViewSet, basename="admin-project")
admin_router.register("services", AdminServiceViewSet, basename="admin-service")
admin_router.register("service-requests", AdminServiceRequestViewSet, basename="admin-service-request")
admin_router.register("volunteers", AdminVolunteerViewSet, basename="admin-volunteer")
admin_router.register("suggestions", AdminSuggestionViewSet, basename="admin-suggestion")

urlpatterns = [
    path("admin/", include(admin_router.urls)),
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
  #  path("submit-suggestion/", submit_suggestion, name="submit_suggestion"),
]
