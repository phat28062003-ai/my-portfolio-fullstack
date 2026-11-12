import { useEffect, useState } from 'react';
import {
  getProfile, getProjects, getSkills,
  getExperiences, getBlogPosts
} from './api';
import { GitHubActivity } from './GitHubActivity';
import { AIChatWidget } from './AIChatWidget';
import { ParticleBackground } from './ParticleBackground';
import { SkillsSection } from './SkillsSection';
import { ProjectsSection } from './ProjectsSection';
import { ExperienceSection } from './ExperienceSection';
import { BlogSection } from './BlogSection';
import { ContactSection } from './ContactSection';
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
  const [, setExperiences] = useState<any[]>([]);
  const [, setBlogs] = useState<any[]>([]);

  const [, setSelectedTech] = useState('All');
  const [typedTitle, setTypedTitle] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showGithubWidget, setShowGithubWidget] = useState(true);

  useEffect(() => {
    const defaultProfile = {
      id: 1,
      full_name: 'Lữ Tiến Phát',
      title: 'Full-stack Developer & AI Engineer Aspirant',
      bio: 'Chào bạn, mình là Lữ Tiến Phát, một lập trình viên Full-stack trẻ tuổi và đầy nhiệt huyết. Mình có thế mạnh trong việc xây dựng các ứng dụng web hiện đại, kết hợp mạnh mẽ giữa Django Backend và Vite/TypeScript Frontend. Mình luôn tò mò học hỏi công nghệ mới và tập trung tạo ra những sản phẩm có trải nghiệm mượt mà, tối ưu.',
      email: 'phat28062003@gmail.com',
      github: 'https://github.com/phat28062003-ai',
      location: 'Mỹ Tho, Tiền Giang, Việt Nam',
      avatar: 'profiles/p.jpg'
    };

    const defaultSkills = [
      { id: 1, name: 'Python / Django REST Framework', proficiency: 90, category: 'Backend' },
      { id: 2, name: 'JavaScript / TypeScript / React', proficiency: 85, category: 'Frontend' },
      { id: 3, name: 'FastAPI & Gemini AI Integration', proficiency: 80, category: 'AI / Backend' },
      { id: 4, name: 'PostgreSQL & SQLite', proficiency: 80, category: 'Database' },
      { id: 5, name: 'Git & Deployment (Vercel, PythonAnywhere)', proficiency: 75, category: 'DevOps' }
    ];

    setProfile(defaultProfile);
    setSkills(defaultSkills);

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
        setProjects(apiProjects);
      }
    }).catch(() => { });

    getSkills().then((data) => {
      if (Array.isArray(data) && data.length > 0) setSkills(data);
    }).catch(() => { });

    getExperiences().then((data) => {
      if (Array.isArray(data) && data.length > 0) setExperiences(data);
    }).catch(() => { });

    getBlogPosts().then((data) => {
      if (Array.isArray(data) && data.length > 0) setBlogs(data);
    }).catch(() => { });

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
    const fullText = profile?.title || 'Full-stack Developer & AI Engineer Aspirant';
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

            {/* Các Dự Án Nổi Bật Siêu Đẹp & Hiện Đại */}
            <ProjectsSection apiProjects={projects} />

            {/* GitHub Activity Dashboard */}
            <div style={{ textAlign: 'right', marginTop: '35px', marginBottom: '10px' }}>
              <button
                onClick={() => setShowGithubWidget(!showGithubWidget)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-muted)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {showGithubWidget ? '👁️ Ẩn Bảng Hoạt Động GitHub' : '👁️ Hiện Bảng Hoạt Động GitHub'}
              </button>
            </div>

            {showGithubWidget && <GitHubActivity />}
          </div>
        )}

        {/* Tab Kỹ Năng: Cyberpunk Tech Matrix */}
        {activeTab === 'skills' && <SkillsSection skills={skills} />}

        {/* Tab Kinh Nghiệm: Cyberpunk Career Timeline */}
        {activeTab === 'experience' && <ExperienceSection />}

        {/* Tab Nhật Ký: Tech Magazine Grid */}
        {activeTab === 'blog' && <BlogSection getMediaUrl={getMediaUrl} />}

        {/* Tab Liên Hệ: Cyberpunk Contact Hub */}
        {activeTab === 'contact' && (
          <ContactSection
            initialEmail={profile?.email}
            initialGithub={profile?.github}
            initialLocation={profile?.location}
          />
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
