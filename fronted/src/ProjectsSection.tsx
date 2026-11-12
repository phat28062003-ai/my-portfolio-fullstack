import React, { useState } from 'react';

export interface ProjectItem {
  id: string | number;
  title: string;
  badge: string;
  badgeColor: string;
  status: string;
  description: string;
  keyFeatures: string[];
  techStack: string[];
  github?: string;
  demo?: string;
  category: string;
}

interface ProjectsSectionProps {
  apiProjects?: any[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ apiProjects = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const defaultProjects: ProjectItem[] = [
    {
      id: 'todo-fullstack-fixed',
      title: 'Full-stack Todo Application',
      badge: 'DỰ ÁN TIÊU BIỂU • PRODUCTION',
      badgeColor: '#38bdf8',
      status: '🟢 Đang chạy Live trên Vercel & Render',
      description: 'Hệ thống quản lý công việc và mục tiêu toàn diện. Kiến trúc phân tách hoàn toàn giữa Django REST Framework backend và React/TypeScript frontend với giao diện responsive tối ưu.',
      keyFeatures: [
        'Xác thực phân quyền bảo mật cao bằng JSON Web Token (JWT) Access & Refresh Tokens.',
        'Bộ lọc công việc thông minh theo trạng thái, mức độ ưu tiên (Priority) và ngày đến hạn.',
        'Hiệu ứng kỷ niệm pháo hoa confetti khi hoàn thành task và thông báo đẩy trực quan.',
        'Triển khai Backend trên Render Cloud và Frontend trên Vercel Edge Network.'
      ],
      techStack: ['Django REST Framework', 'Python', 'TypeScript', 'React', 'Vite', 'JWT Auth', 'PostgreSQL', 'Vercel'],
      github: 'https://github.com/phat28062003-ai',
      demo: 'https://todo-frontend-tawny-iota.vercel.app/#/',
      category: 'Full-Stack'
    },
    {
      id: 'portfolio-ai-agent',
      title: 'Personal Portfolio & Agentic AI Assistant',
      badge: 'CYBERPUNK UI • GEMINI AGENT',
      badgeColor: '#c084fc',
      status: '🟢 Đang chạy Live trên GitHub Pages',
      description: 'Website Portfolio cá nhân phong cách Cyberpunk Glassmorphism tích hợp Trợ lý ảo AI thông minh với Google Gemini 3.5 & 3.1 Lite, có khả năng điều khiển giao diện web bằng giọng nói.',
      keyFeatures: [
        'Agentic AI Co-Pilot: Điều khiển chuyển trang, tra cứu dự án, lọc kỹ năng bằng giọng nói hoặc chat text.',
        'Mạng lưới hạt tương tác canvas (Particle Network) phản hồi theo chuyển động chuột và theme.',
        'Bảng thống kê hoạt động GitHub thời gian thực trực quan hoá commits và repositories.',
        'Bộ nhớ đệm đa tầng (Client/Server Cache) và cơ chế Instant Action 0ms cho phản hồi tức thì.'
      ],
      techStack: ['React', 'TypeScript', 'Vite', 'FastAPI', 'Google Gemini AI', 'Web Speech API', 'Canvas API', 'GitHub Pages'],
      github: 'https://github.com/phat28062003-ai/my-portfolio-fullstack',
      demo: 'https://phat28062003-ai.github.io/my-portfolio-fullstack/',
      category: 'AI / Frontend'
    }
  ];

  // Kết hợp với các dự án từ API nếu có
  const mergedProjects: ProjectItem[] = [
    ...defaultProjects,
    ...apiProjects
      .filter((p: any) => p.title !== defaultProjects[0].title && p.title !== defaultProjects[1].title)
      .map((p: any) => ({
        id: p.id || Math.random(),
        title: p.title,
        badge: 'DỰ ÁN DỮ LIỆU',
        badgeColor: '#f59e0b',
        status: '🟢 Sẵn sàng',
        description: p.description || '',
        keyFeatures: ['Phát triển độc lập với kiến trúc mở rộng.'],
        techStack: [p.technology || 'Full-stack'],
        github: p.github || 'https://github.com/phat28062003-ai',
        demo: p.demo || p.live_demo || '',
        category: 'Khác'
      }))
  ];

  const categories = ['All', 'Full-Stack', 'AI / Frontend', 'Khác'];

  const filteredProjects = selectedCategory === 'All'
    ? mergedProjects
    : mergedProjects.filter(p => p.category === selectedCategory || p.techStack.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase())));

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
      {/* Header and Filter */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '35px 0 24px 0',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h2 id="projects-heading" style={{
            fontSize: '1.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            margin: 0,
            color: 'var(--text-main)',
            fontWeight: 800
          }}>
            <span style={{ filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))' }}>🚀</span> Các Dự Án Nổi Bật & Thực Chiến
          </h2>
          <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Các sản phẩm Full-stack và giải pháp ứng dụng AI đã triển khai thực tế trên môi trường Production.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                background: selectedCategory === cat
                  ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
                  : 'var(--card-bg)',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--card-border)',
                padding: '7px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.84rem',
                transition: 'all 0.25s ease',
                boxShadow: selectedCategory === cat ? '0 4px 14px rgba(56, 189, 248, 0.35)' : 'none'
              }}
            >
              {cat === 'All' ? '⚡ Tất Cả' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="card animated-card-hover"
            style={{
              position: 'relative',
              padding: '28px',
              border: `1px solid var(--card-border)`,
              borderRadius: '16px',
              background: 'var(--card-bg)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
              overflow: 'hidden'
            }}
          >
            {/* Top Accent Line */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${project.badgeColor}, transparent)`
            }} />

            {/* Badges Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <span style={{
                background: `${project.badgeColor}18`,
                color: project.badgeColor,
                border: `1px solid ${project.badgeColor}40`,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.5px'
              }}>
                {project.badge}
              </span>

              <span style={{
                fontSize: '0.82rem',
                color: '#4ade80',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600
              }}>
                {project.status}
              </span>
            </div>

            {/* Project Title */}
            <h3 style={{
              fontSize: '1.6rem',
              margin: '0 0 10px',
              color: 'var(--text-main)',
              fontWeight: 800,
              letterSpacing: '-0.3px'
            }}>
              {project.title}
            </h3>

            {/* Description */}
            <p style={{
              color: 'var(--text-muted)',
              lineHeight: '1.7',
              fontSize: '0.96rem',
              marginBottom: '18px'
            }}>
              {project.description}
            </p>

            {/* Key Features Bullet List */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '14px 18px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.8rem', color: project.badgeColor, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                ⭐ Tính năng & Điểm nổi bật kỹ thuật:
              </div>
              <ul style={{ margin: 0, paddingLeft: '18px', color: 'var(--text-main)', fontSize: '0.88rem', lineHeight: '1.6' }}>
                {project.keyFeatures.map((feat, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{feat}</li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                Công nghệ sử dụng:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.22)',
                      color: '#38bdf8',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      fontFamily: 'monospace'
                    }}
                  >
                    #{tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid var(--card-border)'
            }}>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 16px rgba(56, 189, 248, 0.35)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>🚀</span> Xem Demo Trực Tiếp ↗
                </a>
              )}

              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--card-border)',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    textDecoration: 'none',
                    fontSize: '0.92rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <span>💻</span> Mã Nguồn GitHub ↗
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

