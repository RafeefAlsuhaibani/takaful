from rest_framework import serializers
from .models import Project, Service, ServiceRequest, Volunteer, Suggestion


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


class ServiceRequestSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source="service.name")

    class Meta:
        model = ServiceRequest
        fields = "__all__"


class VolunteerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Volunteer
        fields = "__all__"


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = "__all__"
