import os
from pathlib import Path
from dotenv import load_dotenv

# Tự động nạp các biến môi trường từ file .env trong cùng thư mục backend
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from a2wsgi import ASGIMiddleware

app = FastAPI(title="AI Resume Assistant API")

# Cấu hình CORS cho phép gọi API từ mọi nguồn (bao gồm GitHub Pages, Vercel, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

RESUME_CONTEXT = """
Bạn là Trợ lý AI cá nhân đại diện cho Lữ Tiến Phát.
Dưới đây là thông tin chi tiết về Tiến Phát:
- Học vấn: Sinh viên ngành Công nghệ Thông tin.
- Định hướng: Lập trình viên Full-stack (Python, Django REST Framework, JavaScript, TypeScript, Vite) và đang phát triển thành AI Engineer.
- Các dự án nổi bật:
  1. Full-stack Todo Application: Backend Django REST Framework (xác thực JWT, CORS), Frontend TypeScript/Vite (đã deploy trên Vercel).
  2. Personal Portfolio Website: Web cá nhân giao diện Dark/Cyberpunk mode, tích hợp Formspree nhận tin nhắn liên hệ.
- Phong cách làm việc: Chăm chỉ, chủ động học hỏi, đam mê tối ưu hóa trải nghiệm người dùng và tích hợp AI vào sản phẩm thực tế.
- Nhiệm vụ: Trả lời ngắn gọn, thân thiện, chuyên nghiệp về kinh nghiệm, kỹ năng và các dự án của Tiến Phát.
"""

# Khởi tạo Gemini client an toàn (không làm sập server khi chưa có KEY)
def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="GEMINI_API_KEY chưa được thiết lập. Vui lòng cấu hình biến môi trường hoặc file .env."
        )
    return genai.Client(api_key=api_key)

class ChatRequest(BaseModel):
    message: str

class ContactMessageRequest(BaseModel):
    name: str
    email: str
    message: str

# 0. HEALTH CHECK
@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Resume Assistant API is running"}

# 1. API CHATBOT
@app.post("/api/ai-chat/")
async def chat_with_resume_ai(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống.")
    
    client = get_gemini_client()
    
    # Danh sách model theo thứ tự ưu tiên (phòng trường hợp 1 model bị giới hạn hoặc thay đổi)
    models_to_try = ["gemini-3.5-flash", "gemini-3.1-flash-lite"]
    last_error = None
    
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=f"{RESUME_CONTEXT}\n\nCâu hỏi của người dùng: {request.message}",
            )
            return {"reply": response.text}
        except Exception as e:
            last_error = e
            traceback.print_exc()
            continue
            
    raise HTTPException(status_code=500, detail=f"Không thể kết nối với mô hình AI: {last_error}")

# 2. ENDPOINTS (PROFILE, SKILLS, EXPERIENCE, PROJECTS, BLOGS, CONTACTS)
@app.get("/api/profile/")
async def get_profile():
    return [{
        "id": 1,
        "full_name": "Lữ Tiến Phát",
        "name": "Lữ Tiến Phát",
        "title": "Full-stack Developer & AI Engineer Aspirant",
        "bio": "Đam mê xây dựng các ứng dụng web tối ưu và tích hợp AI vào sản phẩm thực tế.",
        "email": "phat28062003@gmail.com",
        "github": "https://github.com/phat28062003-ai",
        "location": "Mỹ Tho, Việt Nam",
        "avatar": ""
    }]

@app.get("/api/projects/")
async def get_projects():
    return [
        {
            "id": 1,
            "title": "Full-stack Todo Application",
            "description": "Ứng dụng quản lý công việc toàn diện, xây dựng với Django REST Framework ở Backend và TypeScript/Vite ở Frontend với giao diện responsive tối ưu.",
            "technology": "TypeScript / Django REST",
            "github": "https://github.com/phat28062003-ai",
            "demo": "https://todo-frontend-tawny-iota.vercel.app/#/"
        },
        {
            "id": 2,
            "title": "Personal Portfolio & AI Assistant",
            "description": "Website Portfolio cá nhân phong cách Cyberpunk tích hợp Trợ lý ảo AI thông minh với Google Gemini.",
            "technology": "React / Vite / FastAPI",
            "github": "https://github.com/phat28062003-ai",
            "demo": "https://Phatne.pythonanywhere.com"
        }
    ]

@app.get("/api/skills/")
async def get_skills():
    return [
        {"id": 1, "name": "Python / Django REST Framework", "proficiency": 90, "category": "Backend"},
        {"id": 2, "name": "JavaScript / TypeScript / React", "proficiency": 85, "category": "Frontend"},
        {"id": 3, "name": "FastAPI & Gemini AI Integration", "proficiency": 80, "category": "AI / Backend"},
        {"id": 4, "name": "PostgreSQL & SQLite", "proficiency": 80, "category": "Database"},
        {"id": 5, "name": "Git & Deployment (Vercel, PythonAnywhere)", "proficiency": 75, "category": "DevOps"}
    ]

@app.get("/api/experience/")
async def get_experience():
    return [{
        "id": 1,
        "role": "Full-stack Developer",
        "title": "Full-stack Developer",
        "company": "Personal Projects",
        "period": "2023 - Present",
        "description": "Phát triển các ứng dụng Full-stack với Django REST Framework, React/TypeScript và Gemini AI."
    }]

import sqlite3
from fastapi.staticfiles import StaticFiles

# Phục vụ thư mục ảnh media nếu tồn tại
media_dir = BASE_DIR / "media"
if media_dir.exists():
    app.mount("/media", StaticFiles(directory=str(media_dir)), name="media")

@app.get("/api/blogs/")
async def get_blogs():
    db_path = BASE_DIR / "db.sqlite3"
    if db_path.exists():
        try:
            conn = sqlite3.connect(str(db_path))
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            rows = cursor.execute("SELECT id, title, summary, content, image, image_caption, created_at FROM portfolio_blogpost ORDER BY created_at DESC").fetchall()
            conn.close()
            if rows:
                return [dict(r) for r in rows]
        except Exception as e:
            traceback.print_exc()

    return [
        {
            "id": 1,
            "title": "Hôm nay ngày 30/10",
            "summary": "Học đọc kiến thức mới",
            "content": "Hôm nay học đọc thêm nhiều kiến thức mới về Django, React và tích hợp AI. Từng bước hoàn thiện dự án fullstack và nâng cấp giao diện phong cách cyberpunk.",
            "image": "blog_images/images_lKvqlr2.jfif",
            "image_caption": "Giao diện & hệ thống",
            "created_at": "2026-10-30T04:40:15Z"
        },
        {
            "id": 2,
            "title": "Dog",
            "summary": "So cute",
            "content": "Chú cún cưng siêu đáng yêu! Khoảnh khắc thư giãn tuyệt vời sau những giờ lập trình căng thẳng.",
            "image": "blog_images/download_1.jfif",
            "image_caption": "Cute dog",
            "created_at": "2026-10-30T04:48:40Z"
        }
    ]

@app.post("/api/contacts/")
async def create_contact(request: ContactMessageRequest):
    return {
        "status": "success",
        "message": "Tin nhắn của bạn đã được gửi thành công!",
        "data": request.model_dump()
    }

# Cầu nối biến ứng dụng FastAPI (ASGI) thành WSGI cho PythonAnywhere
wsgi_app = ASGIMiddleware(app)
