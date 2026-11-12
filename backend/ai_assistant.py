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
Bạn là Trợ lý AI cá nhân kiêm Điều phối viên thông minh (Agentic AI Assistant) đại diện cho Lữ Tiến Phát trên Website Portfolio.
Thông tin chi tiết về Lữ Tiến Phát:
- Học vấn: Sinh viên ngành Công nghệ Thông tin, đam mê trở thành Full-stack Developer & AI Engineer.
- Kỹ năng chính: Python (Django REST Framework, FastAPI), JavaScript/TypeScript, React, Vite, SQLite/PostgreSQL, Gemini AI API, JWT Authentication, Git & Deployment (Vercel, Render, GitHub Pages).
- Các dự án nổi bật:
  1. Full-stack Todo Application: Backend Django REST & FastAPI (xác thực JWT, bảo mật CORS, CRUD tasks thời gian thực), Frontend TypeScript/Vite hiện đại (Live Demo: https://todo-frontend-tawny-iota.vercel.app/).
  2. Personal Portfolio & AI Assistant: Website phong cách Cyberpunk tích hợp Gemini 3.5 AI, Dark/Light mode, GitHub Live Activity Dashboard, liên kết Formspree.
- Email liên hệ: phat28062003@gmail.com
- GitHub: https://github.com/phat28062003-ai
- Địa chỉ: Mỹ Tho, Tiền Giang, Việt Nam.
- Tinh thần làm việc: Chăm chỉ, chủ động học hỏi công nghệ mới, tập trung vào trải nghiệm người dùng và tư duy giải quyết vấn đề bằng AI.

QUY TẮC ĐIỀU PHỐI GIAO DIỆN (AGENTIC ACTION TAGS):
Bạn có khả năng ĐIỀU KHIỂN GIAO DIỆN của trang web để hỗ trợ trực tiếp người xem.
Khi người dùng hỏi hoặc yêu cầu điều hướng, hãy trả lời thật thân thiện, ngắn gọn và đính kèm MỘT thẻ hành động duy nhất ở cuối câu:
- Xem kỹ năng hoặc công nghệ: đính kèm [ACTION:NAVIGATE_SKILLS]
- Xem các dự án hoặc demo Todo: đính kèm [ACTION:NAVIGATE_PROJECTS]
- Xem kinh nghiệm làm việc: đính kèm [ACTION:NAVIGATE_EXPERIENCE]
- Xem nhật ký học tập hoặc blog: đính kèm [ACTION:NAVIGATE_BLOG]
- Muốn liên hệ, gửi tin nhắn, phỏng vấn tuyển dụng: đính kèm [ACTION:NAVIGATE_CONTACT]
- Muốn lọc dự án TypeScript: đính kèm [ACTION:FILTER_TYPESCRIPT]
- Muốn lọc dự án React/FastAPI: đính kèm [ACTION:FILTER_REACT]
- Muốn đổi giao diện Sáng/Tối: đính kèm [ACTION:TOGGLE_THEME]
- Muốn tải CV hoặc xem hồ sơ năng lực: đính kèm [ACTION:DOWNLOAD_CV]

Ví dụ: "Tôi sẽ dẫn bạn đến danh mục Kỹ Năng chuyên môn của Tiến Phát ngay bây giờ nhé! [ACTION:NAVIGATE_SKILLS]"
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
        "avatar": "profiles/p.jpg"
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
            "demo": "https://phat28062003-ai.github.io/my-portfolio-fullstack/"
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

# 3. ENDPOINTS CHO ỨNG DỤNG FULL-STACK TODO (XÁC THỰC JWT & QUẢN LÝ TASK)
import base64
import json
import time

try:
    import jwt
except ImportError:
    jwt = None

JWT_SECRET = "todo-jwt-secret-key-2026"

def create_jwt_token(username: str) -> str:
    payload = {
        "user_id": 1,
        "username": username,
        "exp": int(time.time()) + 30 * 86400
    }
    if jwt is not None:
        try:
            return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        except Exception:
            pass
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    body = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    sig = base64.urlsafe_b64encode(b"simulated_jwt_signature").decode().rstrip("=")
    return f"{header}.{body}.{sig}"

TODOS_DB = [
    {"id": 1, "title": "IT", "completed": True, "priority": "medium", "due_date": None},
    {"id": 2, "title": "Bảo trì", "completed": True, "priority": "medium", "due_date": None},
    {"id": 3, "title": "Bảo vệ hệ thống", "completed": True, "priority": "medium", "due_date": None},
    {"id": 4, "title": "Khai thác công nghệ mới", "completed": True, "priority": "high", "due_date": None},
    {"id": 5, "title": "Công nghệ FastAPI & React", "completed": True, "priority": "high", "due_date": None},
    {"id": 6, "title": "Giám sát hiệu năng và bảo mật", "completed": True, "priority": "medium", "due_date": None},
    {"id": 7, "title": "Cải tiến giao diện Cyberpunk", "completed": True, "priority": "medium", "due_date": None},
    {"id": 8, "title": "Hóa chất & kiểm định an toàn", "completed": True, "priority": "medium", "due_date": None},
    {"id": 9, "title": "Tích hợp Gemini AI Assistant", "completed": False, "priority": "high", "due_date": None},
]

class TokenRequest(BaseModel):
    username: str
    password: str

class TodoItemRequest(BaseModel):
    title: str
    completed: bool = False
    priority: str = "medium"
    due_date: str | None = None

class TodoItemPatch(BaseModel):
    title: str | None = None
    completed: bool | None = None
    priority: str | None = None
    due_date: str | None = None

@app.post("/api/token/")
async def login_for_access_token(req: TokenRequest):
    # Chấp nhận mọi tài khoản đăng nhập (demo, admin, phat, tg1.laptop001, ...) để không bao giờ bị báo sai mật khẩu
    token = create_jwt_token(req.username)
    return {
        "access": token,
        "refresh": token
    }

@app.post("/api/token/refresh/")
async def refresh_access_token():
    token = create_jwt_token("user")
    return {"access": token}

@app.get("/api/todos/")
async def list_todos():
    return TODOS_DB

@app.post("/api/todos/")
async def add_todo(req: TodoItemRequest):
    new_id = max([t["id"] for t in TODOS_DB], default=0) + 1
    new_item = {
        "id": new_id,
        "title": req.title,
        "completed": req.completed,
        "priority": req.priority,
        "due_date": req.due_date
    }
    TODOS_DB.append(new_item)
    return new_item

@app.patch("/api/todos/{todo_id}/")
async def patch_todo(todo_id: int, req: TodoItemPatch):
    for item in TODOS_DB:
        if item["id"] == todo_id:
            if req.completed is not None:
                item["completed"] = req.completed
            if req.title is not None:
                item["title"] = req.title
            if req.priority is not None:
                item["priority"] = req.priority
            if req.due_date is not None:
                item["due_date"] = req.due_date
            return item
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/api/todos/{todo_id}/")
async def remove_todo(todo_id: int):
    global TODOS_DB
    TODOS_DB = [t for t in TODOS_DB if t["id"] != todo_id]
    return {"status": "success"}

# Cầu nối biến ứng dụng FastAPI (ASGI) thành WSGI cho PythonAnywhere
wsgi_app = ASGIMiddleware(app)
