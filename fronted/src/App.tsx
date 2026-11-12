import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  getProfile, getProjects, getSkills,
  getExperiences, getBlogPosts, sendAIChatMessage
} from './api';
import './style.css';

// ==========================================
// COMPONENT: CYBERPUNK AI CHAT WIDGET
// ==========================================
interface Message {
  sender: 'user' | 'ai';
  text: string;
}

function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: '⚡ Chào bạn! Tôi là hệ thống AI trực tuyến đại diện cho Tiến Phát. Hân hạnh phục vụ bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      // Gọi trực tiếp hàm thông minh tập trung từ api.ts
      const data = await sendAIChatMessage(userMsg);

      if (data && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'ai', text: '⚠️ Phản hồi hệ thống gặp lỗi, vui lòng thử lại sau.' }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '🔌 Mất kết nối tới Backend AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* Nút bong bóng chat phong cách Cyber/Neon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '14px 22px',
            borderRadius: '35px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            cursor: 'pointer',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.25)',
            fontWeight: '600',
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            backdropFilter: 'blur(8px)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(56, 189, 248, 0.45)';
            e.currentTarget.style.borderColor = '#38bdf8';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.25)';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
          }}
        >
          <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
            <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#38bdf8', opacity: 0.75 }}></span>
            <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '10px', width: '10px', backgroundColor: '#0ea5e9' }}></span>
          </span>
          💬 AI Assistant
        </button>
      )}

      {/* Cửa sổ khung chat */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          borderRadius: '18px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          {/* Header */}
          <div style={{
            padding: '16px 18px',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
              }}>
                🥷
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.5px', color: '#38bdf8' }}>
                  Naruto đây !
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
                  Online (luôn sẵn sàng trả lời bạn)
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94a3b8',
                cursor: 'pointer',
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
            >
              ✕
            </button>
          </div>

          {/* Vùng chứa tin nhắn */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#050811',
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 0)',
            backgroundSize: '20px 20px'
          }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#0284c7' : '#111827',
                  color: msg.sender === 'user' ? '#f8fafc' : '#e2e8f0',
                  padding: '10px 14px',
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  maxWidth: '85%',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  border: msg.sender === 'ai' ? '1px solid rgba(56, 189, 248, 0.15)' : 'none',
                  boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.4)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.85rem', fontStyle: 'italic', paddingLeft: '4px' }}>
                ⚡ Đang xử lý dữ liệu...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Ô nhập tin nhắn */}
          <div style={{
            padding: '14px',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '8px',
            backgroundColor: '#0f172a'
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Nhập câu hỏi cho AI..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                backgroundColor: '#050811',
                color: '#fff',
                outline: 'none',
                fontSize: '0.9rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'}
            />
            <button
              onClick={handleSend}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.9rem',
                boxShadow: '0 0 15px rgba(14, 165, 233, 0.4)',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper xử lý đường dẫn ảnh
const getMediaUrl = (path?: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}media/${cleanPath}`;
};

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'experience' | 'blog' | 'contact'>('profile');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  const [selectedTech, setSelectedTech] = useState('All');
  const [typedTitle, setTypedTitle] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [statusMsg, setStatusMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showGithubWidget, setShowGithubWidget] = useState(true);

  useEffect(() => {
    const defaultProfile = {
      id: 1,
      full_name: 'Lữ Tiến Phát',
      title: 'Full-stack Developer & AI Engineer Aspirant',
      bio: 'Chào bạn, mình là Lữ Tiến Phát, một lập trình viên Full-stack trẻ tuổi và đầy nhiệt huyết. Mình có thế mạnh trong việc xây dựng các ứng dụng web hiện đại, kết hợp mạnh mẽ giữa Django Backend và Vite/TypeScript Frontend. Mình luôn tò mò học hỏi công nghệ mới và tập trung tạo ra những sản phẩm có trải nghiệm mượt mà, tối ưu.',
      email: 'phat28062003@gmail.com',
      github: 'https://github.com/phat28062003-ai',
      location: 'Mỹ Tho, Việt Nam',
      avatar: 'profiles/p.jpg'
    };

    const defaultSkills = [
      { id: 1, name: 'Python / Django REST Framework', proficiency: 90, category: 'Backend' },
      { id: 2, name: 'JavaScript / TypeScript / React', proficiency: 85, category: 'Frontend' },
      { id: 3, name: 'FastAPI & Gemini AI Integration', proficiency: 80, category: 'AI / Backend' },
      { id: 4, name: 'PostgreSQL & SQLite', proficiency: 80, category: 'Database' },
      { id: 5, name: 'Git & Deployment (Vercel, PythonAnywhere)', proficiency: 75, category: 'DevOps' }
    ];

    const defaultExperiences = [
      {
        id: 1,
        role: 'Full-stack Developer',
        company: 'Personal Projects',
        period: '2023 - Present',
        description: 'Phát triển các ứng dụng Full-stack với Django REST Framework, React/TypeScript và Gemini AI.'
      }
    ];

    const defaultBlogs = [
      {
        id: 1,
        title: 'Hôm nay ngày 30/10',
        summary: 'Học đọc kiến thức mới',
        content: 'Hôm nay học đọc thêm nhiều kiến thức mới về Django, React và tích hợp AI. Từng bước hoàn thiện dự án fullstack và nâng cấp giao diện phong cách cyberpunk.',
        image: 'blog_images/images_lKvqlr2.jfif',
        image_caption: 'Giao diện & hệ thống',
        created_at: '2026-10-30T04:40:15Z'
      },
      {
        id: 2,
        title: 'Dog',
        summary: 'So cute',
        content: 'Chú cún cưng siêu đáng yêu! Khoảnh khắc thư giãn tuyệt vời sau những giờ lập trình căng thẳng.',
        image: 'blog_images/download_1.jfif',
        image_caption: 'Cute dog',
        created_at: '2026-10-30T04:48:40Z'
      }
    ];

    const todoAppProject = {
      id: 'todo-fullstack-fixed',
      title: 'Full-stack Todo Application',
      description: 'Ứng dụng quản lý công việc toàn diện, xây dựng với Django REST Framework ở Backend và TypeScript/Vite ở Frontend với giao diện responsive tối ưu.',
      technology: 'TypeScript',
      github: 'https://github.com/phat28062003-ai',
      demo: 'https://todo-frontend-tawny-iota.vercel.app/#/'
    };

    setProfile(defaultProfile);
    setSkills(defaultSkills);
    setExperiences(defaultExperiences);
    setBlogs(defaultBlogs);
    setProjects([todoAppProject]);

    getProfile().then((data) => {
      if (data) {
        setProfile({
          ...data,
          avatar: data.avatar || 'profiles/p.jpg'
        });
      }
    }).catch(() => { });
    getProjects().then((apiProjects) => {
      if (Array.isArray(apiProjects) && apiProjects.length > 0) {
        const otherProjects = apiProjects.filter((p: any) => p.title !== todoAppProject.title);
        setProjects([todoAppProject, ...otherProjects]);
      }
    }).catch(() => { });
    getSkills().then((data) => { if (Array.isArray(data) && data.length > 0) setSkills(data); }).catch(() => { });
    getExperiences().then((data) => { if (Array.isArray(data) && data.length > 0) setExperiences(data); }).catch(() => { });
    getBlogPosts().then((data) => { if (Array.isArray(data) && data.length > 0) setBlogs(data); }).catch(() => { });

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fullText = profile?.title || 'Full-stack Developer | Python & TypeScript Enthusiast';
    let index = 0;
    setTypedTitle('');
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedTitle(fullText.substring(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 45);
    return () => clearInterval(timer);
  }, [profile]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const response = await fetch("https://formspree.io/f/xnppryjl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message
        })
      });

      if (response.ok) {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        setStatusMsg('🚀 Tuyệt vời! Tin nhắn của bạn đã được gửi thành công và chuyển đến email của tôi.');
        setContactForm({ name: '', email: '', message: '' });
      } else {
        setStatusMsg('❌ Có lỗi xảy ra khi gửi. Vui lòng thử lại sau!');
      }
    } catch (error) {
      setStatusMsg('❌ Lỗi kết nối mạng. Vui lòng kiểm tra lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const technologies = ['All', ...Array.from(new Set(projects.map(p => p.technology).filter(Boolean)))];
  const filteredProjects = selectedTech === 'All'
    ? projects
    : projects.filter(p => p.technology === selectedTech);

  return (
    <div>
      <nav className="navbar">
        {(['profile', 'skills', 'experience', 'blog', 'contact'] as const).map((tab) => (
          <button
            key={tab}
            className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); scrollToTop(); }}
          >
            {tab === 'profile' && '👤 Profile'}
            {tab === 'skills' && '⚡ Kỹ Năng'}
            {tab === 'experience' && '💼 Kinh Nghiệm'}
            {tab === 'blog' && '📝 Nhật Ký'}
            {tab === 'contact' && '📬 Liên Hệ'}
          </button>
        ))}
        <button
          className="nav-btn"
          onClick={toggleTheme}
          title="Chuyển đổi giao diện Sáng / Tối"
          style={{ padding: '8px 12px', fontSize: '1.1rem' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>

      <div className="container">
        {activeTab === 'profile' && (
          <div className="tab-content">
            {profile && (
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px' }}>
                <img
                  src={getMediaUrl(profile.avatar || 'profiles/p.jpg')}
                  alt={profile.full_name || 'Lữ Tiến Phát'}
                  style={{
                    width: '130px',
                    height: '130px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid #38bdf8',
                    boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
                    marginBottom: '20px'
                  }}
                />
                <h1 className="profile-title">{profile.full_name}</h1>
                <p style={{ color: '#c084fc', fontSize: '1.2rem', margin: '15px 0', fontWeight: 600, minHeight: '30px' }}>
                  {typedTitle}<span style={{ opacity: 0.7, animation: 'blink 1s infinite' }}>|</span>
                </p>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', maxWidth: '700px', margin: '0 auto', fontSize: '1.05rem' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '40px 0 20px 0', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: 'var(--text-main)' }}>
                <span>🚀</span> Các Dự Án Nổi Bật
              </h2>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {technologies.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setSelectedTech(tech)}
                    style={{
                      background: selectedTech === tech ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'var(--card-bg)',
                      color: selectedTech === tech ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--card-border)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {filteredProjects.length > 0 ? (
              filteredProjects.map((p) => (
                <div key={p.id} className="card" style={{ position: 'relative' }}>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: '#38bdf8' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>{p.description}</p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                      🛠 {p.technology}
                    </span>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                          GitHub ↗
                        </a>
                      )}
                      {(p.demo || p.live_demo) && (
                        <a href={p.demo || p.live_demo} target="_blank" rel="noreferrer" style={{ color: '#c084fc', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>
                          Live Demo ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>🚀 Không tìm thấy dự án phù hợp.</p>
              </div>
            )}

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button
                onClick={() => setShowGithubWidget(!showGithubWidget)}
                style={{ background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                {showGithubWidget ? '👁️ Ẩn Hoạt Động GitHub' : '👁️ Hiện Hoạt Động GitHub'}
              </button>
            </div>

            {showGithubWidget && (
              <div className="card" style={{ textAlign: 'center', marginTop: '10px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#38bdf8' }}>📊 Hoạt Động GitHub</h3>
                <img
                  src="https://github-readme-stats.vercel.app/api?username=phat28062003-ai&show_icons=true&theme=tokyonight&hide_border=true&bg_color=030712"
                  alt="GitHub Stats"
                  style={{ maxWidth: '100%', borderRadius: '12px' }}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="tab-content card">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text-main)' }}>⚡ Kỹ Năng Lập Trình</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Mức độ thành thạo các công nghệ chuyên môn.</p>
            {skills.length > 0 ? (
              skills.map((s) => (
                <div key={s.id} className="skill-item">
                  <div className="skill-info">
                    <span>{s.name}</span>
                    <span style={{ color: '#38bdf8' }}>{s.proficiency}%</span>
                  </div>
                  <div className="progress-bg">
                    <div className="progress-fill" style={{ width: `${s.proficiency}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)' }}>Chưa có kỹ năng nào.</p>
            )}
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="tab-content">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: 'var(--text-main)' }}>💼 Quá Trình & Kinh Nghiệm</h2>
            {experiences.length > 0 ? (
              experiences.map((exp) => (
                <div key={exp.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ color: '#38bdf8', fontSize: '1.3rem' }}>{exp.role}</h3>
                    <span style={{ background: 'rgba(192, 132, 252, 0.1)', color: '#c084fc', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
                      {exp.period}
                    </span>
                  </div>
                  <h4 style={{ color: 'var(--text-muted)', marginBottom: '15px', fontWeight: 500 }}>{exp.company}</h4>
                  <p style={{ lineHeight: '1.7', color: 'var(--text-main)' }}>{exp.description}</p>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>Chưa có thông tin kinh nghiệm.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="tab-content">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '25px', color: 'var(--text-main)' }}>📝 Nhật Ký & Bài Viết Cá Nhân</h2>
            {blogs.length > 0 ? (
              blogs.map((b) => (
                <article key={b.id} className="card">
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: 'var(--text-main)' }}>{b.title}</h3>
                  <small style={{ color: 'var(--text-muted)' }}>📅 Đăng ngày: {new Date(b.created_at).toLocaleDateString()}</small>
                  {b.image && (
                    <div style={{ marginTop: '12px' }}>
                      <img
                        src={getMediaUrl(b.image)}
                        alt={b.title}
                        className="blog-img"
                        style={{ maxWidth: '100%', borderRadius: '8px' }}
                      />
                      {b.image_caption && <p className="img-caption" style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '6px' }}>📸 {b.image_caption}</p>}
                    </div>
                  )}
                  <p style={{ marginTop: '15px', lineHeight: '1.8', color: 'var(--text-main)' }}>{b.content}</p>
                </article>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>Chưa có bài viết nhật ký nào. Truy cập <a href="https://phatne.pythonanywhere.com/admin/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Django Admin</a> để thêm bài viết mới.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="tab-content card">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--text-main)' }}>📬 Hộp Thư Liên Hệ</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Hãy gửi lời nhắn cho tôi!</p>
            {statusMsg && (
              <div style={{ background: statusMsg.includes('❌') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(74, 222, 128, 0.1)', color: statusMsg.includes('❌') ? '#ef4444' : '#4ade80', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 500 }}>
                {statusMsg}
              </div>
            )}
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="Nguyễn Văn A"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  placeholder="name@example.com"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  rows={5}
                  name="message"
                  className="form-textarea"
                  placeholder="Nội dung tin nhắn..."
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Nhắn 🚀'}
              </button>
            </form>
          </div>
        )}

        <button
          className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
          onClick={scrollToTop}
          title="Về đầu trang"
        >
          ↑
        </button>

        <AIChatWidget />
      </div>
    </div>
  );
}