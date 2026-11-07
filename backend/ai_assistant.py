import os
import traceback
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai

app = FastAPI(title="AI Resume Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đưa API Key vào biến môi trường để SDK Google GenAI tự động nhận diện chuẩn xác 100%
os.environ["GEMINI_API_KEY"] 
client = genai.Client()

RESUME_CONTEXT = """
Bạn là Trợ lý AI cá nhân đại diện cho Lũ Tiến Phát.
Dưới đây là thông tin chi tiết về Tiến Phát:
- Học vấn: Sinh viên ngành Công nghệ Thông tin.
- Định hướng: Lập trình viên Full-stack (Python, Django REST Framework, JavaScript, TypeScript, Vite) và đang phát triển thành AI Engineer.
- Các dự án nổi bật:
  1. Full-stack Todo Application: Backend Django REST Framework (xác thực JWT, CORS), Frontend TypeScript/Vite (đã deploy trên Vercel).
  2. Personal Portfolio Website: Web cá nhân giao diện Dark/Cyberpunk mode, tích hợp Formspree nhận tin nhắn liên hệ.
- Phong cách làm việc: Chăm chỉ, chủ động học hỏi, đam mê tối ưu hóa trải nghiệm người dùng và tích hợp AI vào sản phẩm thực tế.

Nhiệm vụ của bạn: Trả lời các câu hỏi của nhà tuyển dụng hoặc khách ghé thăm một cách thân thiện, chuyên nghiệp, ngắn gọn và chính xác dựa trên thông tin trên. Nếu câu hỏi không liên quan đến công việc hay kỹ năng của Tiến Phát, hãy lịch sự lái câu chuyện quay lại hồ sơ của anh ấy.
"""

class ChatRequest(BaseModel):
    message: str

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
        error_detail = str(e)
        print("\n--- LỖI CHI TIẾT ---")
        traceback.print_exc()
        print("---------------------\n")
        raise HTTPException(status_code=500, detail=error_detail)