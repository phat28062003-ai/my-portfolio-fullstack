import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  getProfile, getProjects, getSkills,
  getExperiences, getBlogPosts, sendContactMessage
} from './api';
import './style.css';

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

  // State để ẩn/hiện widget GitHub tạm thời khi bị lỗi 503
  const [showGithubWidget, setShowGithubWidget] = useState(true);

  useEffect(() => {
    getProfile().then(setProfile);
    getProjects().then(setProjects);
    getSkills().then(setSkills);
    getExperiences().then(setExperiences);
    getBlogPosts().then(setBlogs);

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

  // Hiệu ứng gõ chữ tiêu đề mượt mà
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

  // Chuyển đổi Dark / Light Theme
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
    await sendContactMessage(contactForm);

    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStatusMsg('🚀 Tuyệt vời! Tin nhắn của bạn đã được gửi thành công.');
    setContactForm({ name: '', email: '', message: '' });
  };

  const technologies = ['All', ...Array.from(new Set(projects.map(p => p.technology)))];
  const filteredProjects = selectedTech === 'All'
    ? projects
    : projects.filter(p => p.technology === selectedTech);

  return (
    <div>
      {/* Thanh Menu Nổi Kính Mờ & Nút Đổi Theme */}
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
        {/* TAB PROFILE & PROJECTS */}
        {activeTab === 'profile' && (
          <div className="tab-content">
            {profile && (
              <div className="card" style={{ textAlign: 'center', padding: '50px 30px' }}>
                {profile.avatar && (
                  <img
                    src={profile.avatar.startsWith('http') ? profile.avatar : `https://Phatne.pythonanywhere.com${profile.avatar.startsWith('/') ? '' : '/'}${profile.avatar}`}
                    alt={profile.full_name}
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
                )}
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

              {/* Bộ Lọc công nghệ */}
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
                <div key={p.id} className="card">
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '10px', color: '#38bdf8' }}>{p.title}</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '15px' }}>{p.description}</p>
                  <span style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 600 }}>
                    🛠 {p.technology}
                  </span>
                </div>
              ))
            ) : (
              <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>🚀 Không tìm thấy dự án phù hợp.</p>
              </div>
            )}

            {/* Nút bật/tắt tạm thời Widget Thống kê GitHub để tránh lỗi 503 */}
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
                  src="https://github-readme-stats.vercel.app/api?username=github&show_icons=true&theme=tokyonight&hide_border=true&bg_color=030712"
                  alt="GitHub Stats"
                  style={{ maxWidth: '100%', borderRadius: '12px' }}
                />
              </div>
            )}
          </div>
        )}

        {/* TAB SKILLS */}
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

        {/* TAB EXPERIENCE */}
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

        {/* TAB BLOG */}
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
                        src={
                          b.image.startsWith('http')
                            ? b.image
                            : `https://Phatne.pythonanywhere.com${b.image.startsWith('/') ? '' : '/'}${b.image}`
                        }
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
                <p>Chưa có bài viết nhật ký nào. Truy cập <a href="https://Phatne.pythonanywhere.com/admin/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Django Admin</a> để thêm bài viết mới.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTACT */}
        {activeTab === 'contact' && (
          <div className="tab-content card">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--text-main)' }}>📬 Hộp Thư Liên Hệ</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>Hãy gửi lời nhắn cho tôi!</p>
            {statusMsg && (
              <div style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', fontWeight: 500 }}>
                {statusMsg}
              </div>
            )}
            <form onSubmit={handleContactSubmit}>
              <div className="form-group">
                <label>Họ và Tên</label>
                <input
                  type="text"
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
                  className="form-textarea"
                  placeholder="Nội dung tin nhắn..."
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">Gửi Lời Nhắn 🚀</button>
            </form>
          </div>
        )}

        {/* Nút Cuộn Về Đầu Trang (Scroll to Top) */}
        <button
          className={`scroll-to-top ${showScrollTop ? 'show' : ''}`}
          onClick={scrollToTop}
          title="Về đầu trang"
        >
          ↑
        </button>
      </div>
    </div>
  );
}