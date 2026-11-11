const API_BASE_URL = 'https://phatne.pythonanywhere.com/api';

export interface Profile {
  id: number;
  full_name: string;
  title: string;
  bio: string;
  github?: string;
  email: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  technology: string;
}

export interface Skill {
  id: number;
  name: string;
  proficiency: number;
  category: string;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string;
  image_caption?: string;
  created_at: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

// 1. Lấy thông tin cá nhân
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/profile/`);
    const data = await response.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Lỗi khi tải profile:", error);
    return null;
  }
};

// 2. Lấy danh sách dự án
export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/projects/`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Lỗi khi tải projects:", error);
    return [];
  }
};

// 3. Lấy danh sách kỹ năng (Skills)
export const getSkills = async (): Promise<Skill[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/skills/`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Lỗi khi tải skills:", error);
    return [];
  }
};

// 4. Lấy danh sách kinh nghiệm (Experience)
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/experience/`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Lỗi khi tải experience:", error);
    return [];
  }
};

// 5. Lấy danh sách bài viết blog
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blogs/`);
    const data = await response.json();
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    console.error("Lỗi khi tải blogs:", error);
    return [];
  }
};

// 6. Gửi tin nhắn liên hệ từ người dùng
export const sendContactMessage = async (messageData: ContactMessage) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contacts/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi gửi tin nhắn:", error);
    return null;
  }
};

// 7. Gửi tin nhắn tới trợ lý AI (Tự động nhận diện local hay server online)
export const sendAIChatMessage = async (message: string) => {
  const url = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000/api/ai-chat/'
    : `${API_BASE_URL}/ai-chat/`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi kết nối AI chat:", error);
    return { reply: "🔌 Mất kết nối tới Backend AI." };
  }
};