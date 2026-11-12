import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  getProfile, getProjects, getSkills,
  getExperiences, getBlogPosts
} from './api';
import { GitHubActivity } from './GitHubActivity';
import { AIChatWidget } from './AIChatWidget';
import { ParticleBackground } from './ParticleBackground';
import { SkillsSection } from './SkillsSection';
import './style.css';

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
      <ParticleBackground theme={theme} />
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
              <div className="card animated-card-hover" style={{ textAlign: 'center', padding: '50px 30px' }}>
                <div className="avatar-wrapper">
                  <div className="avatar-neon-ring"></div>
                  <img
                    src={getMediaUrl(profile.avatar || 'profiles/p.jpg')}
                    alt={profile.full_name || 'Lữ Tiến Phát'}
                    className="avatar-img"
                  />
                </div>
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
              <h2 id="projects-heading" style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px', margin: 0, color: 'var(--text-main)' }}>
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
                <div key={p.id} className="card animated-card-hover" style={{ position: 'relative' }}>
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

            {showGithubWidget && <GitHubActivity />}
          </div>
        )}

        {activeTab === 'skills' && <SkillsSection skills={skills} />}

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

        <AIChatWidget
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setSelectedTech={setSelectedTech}
          toggleTheme={toggleTheme}
          theme={theme}
          scrollToTop={scrollToTop}
        />
      </div>
    </div>
  );
}