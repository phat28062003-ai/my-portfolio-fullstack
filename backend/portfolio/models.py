from django.db import models

# 1. Thông tin Profile cá nhân
class Profile(models.Model):
    full_name = models.CharField(max_length=100)
    title = models.CharField(max_length=200)
    bio = models.TextField()
    email = models.EmailField()
    github = models.URLField(blank=True, null=True)
    # ➕ Thêm trường avatar hỗ trợ kéo thả ảnh
    avatar = models.ImageField(upload_to='profiles/', blank=True, null=True)

    def __str__(self):
        return self.full_name

# 2. Dự án cá nhân
class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    technology = models.CharField(max_length=200) # Ví dụ: React, Django, Python
    
    def __str__(self):
        return self.title

# 3. Kỹ năng dạng thanh tiến độ (Skills)
class Skill(models.Model):
    name = models.CharField(max_length=100) # Tên kỹ năng (Ví dụ: Python, React)
    proficiency = models.IntegerField()     # Mức độ thành thạo từ 0 đến 100 (%)
    category = models.CharField(max_length=50, default="Frontend/Backend") # Phân loại

    def __str__(self):
        return f"{self.name} ({self.proficiency}%)"

# 4. Kinh nghiệm làm việc / Quá trình học tập (Experience)
class Experience(models.Model):
    role = models.CharField(max_length=150)       # Vị trí (Ví dụ: Full-stack Developer)
    company = models.CharField(max_length=150)    # Công ty / Trường học
    period = models.CharField(max_length=100)     # Thời gian (Ví dụ: 2024 - 2026)
    description = models.TextField()              # Mô tả công việc

    def __str__(self):
        return f"{self.role} at {self.company}"

# 5. Nhật ký Blog cá nhân (có hình ảnh và chú thích)
class BlogPost(models.Model):
    title = models.CharField(max_length=200)      # Tiêu đề bài viết
    summary = models.TextField()                  # Tóm tắt ngắn
    content = models.TextField()                  # Nội dung chi tiết
    image = models.ImageField(upload_to='blog_images/', blank=True, null=True) # Link hình ảnh minh họa
    image_caption = models.CharField(max_length=255, blank=True, null=True) # Chú thích ảnh
    created_at = models.DateTimeField(auto_now_add=True) # Ngày đăng

    def __str__(self):
        return self.title

# 6. Hộp thư liên hệ trực tiếp từ người xem (Contact)
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)       # Người gửi
    email = models.EmailField()                   # Email người gửi
    message = models.TextField()                  # Nội dung tin nhắn
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Message from {self.name} ({self.email})"