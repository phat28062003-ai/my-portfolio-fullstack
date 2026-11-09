import os
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from a2wsgi import ASGIMiddleware

app = FastAPI(title="AI Resume Assistant API")

# Cấu hình CORS cho phép GitHub Pages gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

RESUME_CONTEXT = """
Bạn là Trợ lý AI cá nhân đại diện cho Lữ Tiến Phát.
Dưới đây là thông tin chi tiết về Tiến Phát:
- Học vấn: Sinh viên ngành Công nghệ Thông tin.
- Định hướng: Lập trình viên Full-stack (Python, Django REST Framework, JavaScript, TypeScript, Vite) và đang phát triển thành AI Engineer.
- Các dự án nổi bật:
  1. Full-stack Todo Application: Backend Django REST Framework (xác thực JWT, CORS), Frontend TypeScript/Vite (đã deploy trên Vercel).
  2. Personal Portfolio Website: Web cá nhân giao diện Dark/Cyberpunk mode, tích hợp Formspree nhận tin nhắn liên hệ.
- Phong cách làm việc: Chăm chỉ, chủ động học hỏi, đam mê tối ưu hóa trải nghiệm người dùng và tích hợp AI vào sản phẩm thực tế.
"""

class ChatRequest(BaseModel):
    message: str

# 1. API CHATBOT
@app.post("/api/ai-chat/")
async def chat_with_resume_ai(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Câu hỏi không được để trống.")
    
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=f"{RESUME_CONTEXT}\n\nCâu hỏi của người dùng: {request.message}",
        )
        return {"reply": response.text}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# 2. MOCK ENDPOINTS (ĐẦY ĐỦ PROFILE, SKILLS, EXPERIENCE, BLOGS)
@app.get("/api/profile/")
async def get_profile():
    return [{
        "id": 1,
        "name": "Lữ Tiến Phát",
        "title": "Full-stack Developer & AI Engineer Aspirant",
        "bio": "Đam mê xây dựng các ứng dụng web tối ưu và tích hợp AI vào sản phẩm thực tế.",
        "location": "Mỹ Tho, Việt Nam"
    }]

@app.get("/api/experience/")
async def get_experience():
    return [{
        "id": 1,
        "title": "Full-stack Developer",
        "company": "Personal Projects",
        "period": "2023 - Present",
        "description": "Phát triển các ứng dụng Full-stack với Django REST Framework, React/TypeScript và Gemini AI."
    }]

@app.get("/api/blogs/")
async def get_blogs():
    return []

@app.get("/api/skills/")
async def get_skills():
    return [
        {"id": 1, "name": "Python / Django REST Framework", "category": "Backend"},
        {"id": 2, "name": "JavaScript / TypeScript / React", "category": "Frontend"},
        {"id": 3, "name": "FastAPI & Gemini AI Integration", "category": "AI / Backend"}
    ]

# Cầu nối biến ứng dụng FastAPI (ASGI) thành WSGI cho PythonAnywhere
wsgi_app = ASGIMiddleware(app)