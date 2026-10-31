from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProfileViewSet, ProjectViewSet, SkillViewSet, 
    ExperienceViewSet, BlogPostViewSet, ContactMessageViewSet
)

router = DefaultRouter()
router.register(r'profile', ProfileViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'skills', SkillViewSet)
router.register(r'experience', ExperienceViewSet)
router.register(r'blogs', BlogPostViewSet)
router.register(r'contacts', ContactMessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
]