from django.contrib import admin
from .models import Profile, Project, Skill, Experience, BlogPost, ContactMessage

admin.site.register(Profile)
admin.site.register(Project)
admin.site.register(Skill)
admin.site.register(Experience)
admin.site.register(BlogPost)
admin.site.register(ContactMessage)