import React, { useState } from 'react';

interface SkillItem {
  id: number;
  name: string;
  category: 'Backend' | 'Frontend' | 'AI / Machine Learning' | 'Database & DevOps';
  proficiency: number;
  level: string;
  icon: string;
  accentColor: string;
  description: string;
  tags: string[];
}

export interface SkillsSectionProps {
  skills?: any[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const skillsData: SkillItem[] = [
    {
      id: 1,
      name: 'Python / Django REST Framework',
      category: 'Backend',
      proficiency: 92,
      level: 'Core Mastery',
      icon: '🐍',
      accentColor: '#38bdf8',
      description: 'Thiết kế kiến trúc API RESTful chuẩn mực, xác thực phân quyền JWT bảo mật, tối ưu ORM và bảo mật CORS đa nền tảng.',
      tags: ['Django REST', 'Python 3.11+', 'JWT Authentication', 'ORM Optimization', 'RESTful API']
    },
    {
      id: 2,
      name: 'TypeScript / React / Vite',
      category: 'Frontend',
      proficiency: 88,
      level: 'Advanced',
      icon: '⚛️',
      accentColor: '#61dafb',
      description: 'Xây dựng giao diện SPA hiệu năng cao, type-safety chặt chẽ với TypeScript, quản lý State mượt mà và responsive đa thiết bị.',
      tags: ['React 19', 'TypeScript', 'Vite', 'Custom Hooks', 'Tailwind / CSS3', 'SPA Router']
    },
    {
      id: 3,
      name: 'FastAPI & Google Gemini AI',
      category: 'AI / Machine Learning',
      proficiency: 86,
      level: 'Specialized',
      icon: '🧠',
      accentColor: '#c084fc',
      description: 'Tích hợp các mô hình LLM (Gemini 3.5 / Lite), xây dựng Trợ lý ảo Agentic điều khiển giao diện web qua Action Tags và xử lý Async.',
      tags: ['Google Gemini API', 'Agentic AI', 'Function Calling', 'Prompt Engineering', 'Async Endpoints']
    },
    {
      id: 4,
      name: 'PostgreSQL & SQLite Database',
      category: 'Database & DevOps',
      proficiency: 82,
      level: 'Proficient',
      icon: '🐘',
      accentColor: '#34d399',
      description: 'Thiết kế cơ sở dữ liệu quan hệ, tối ưu câu lệnh truy vấn, quản lý schema migration và đảm bảo an toàn toàn vẹn dữ liệu.',
      tags: ['PostgreSQL', 'SQLite', 'Database Modeling', 'Data Migrations', 'SQL Optimization']
    },
    {
      id: 5,
      name: 'Git, Cloud & Multi-Deployments',
      category: 'Database & DevOps',
      proficiency: 84,
      level: 'Proficient',
      icon: '🚀',
      accentColor: '#fb923c',
      description: 'Triển khai hệ thống tự động đa nền tảng (Vercel Frontend, Render Backend, GitHub Pages), quản lý phiên bản với Git Flow.',
      tags: ['Git & GitHub', 'Vercel Deployment', 'Render Cloud', 'CI/CD Workflow', 'Environment Config']
    },
    {
      id: 6,
      name: 'Web Speech & Audio Interactive UI',
      category: 'Frontend',
      proficiency: 85,
      level: 'Advanced',
      icon: '🎙️',
      accentColor: '#f43f5e',
      description: 'Tương tác giọng nói 2 chiều (Speech-to-Text & Text-to-Speech tiếng Việt), hiệu ứng hạt sáng Canvas và giao diện Cyberpunk cao cấp.',
      tags: ['Web Speech API', 'SpeechSynthesis', 'Canvas 2D Particle', 'Cyberpunk Animation']
    }
  ];

  const categories = ['All', 'Backend', 'Frontend', 'AI / Machine Learning', 'Database & DevOps'];

  const filteredSkills = selectedCategory === 'All'
    ? skillsData
    : skillsData.filter((s) => s.category === selectedCategory);

  return (
    <div className="tab-content" style={{ animation: 'smoothFade 0.4s ease' }}>
      {/* 1. Header Khối Kỹ Năng */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '28px'
      }}>
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '8px',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>⚡</span> Kỹ Năng & Năng Lực Chuyên Môn
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: 0, lineHeight: '1.6' }}>
            Tổng hợp công nghệ cốt lõi và kinh nghiệm thực chiến từ kiến trúc Backend, giao diện Frontend đến giải pháp tích hợp AI.
          </p>
        </div>

        {/* Huy hiệu tổng quan */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          padding: '8px 16px',
          borderRadius: '30px'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e', display: 'inline-block' }}></span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8' }}>
            Full-stack & AI Focused
          </span>
        </div>
      </div>

      {/* 2. Bảng 4 Khối Chỉ Số Năng Lực Nổi Bật (Competency Highlights) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '32px'
      }}>
        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🐍 Backend Architecture
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            Django & FastAPI
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            RESTful API, JWT Auth
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ⚛️ Modern Frontend
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#61dafb', marginTop: '6px' }}>
            React & TypeScript
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Vite SPA, Type Safety
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🧠 AI Integration
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc', marginTop: '6px' }}>
            Google Gemini 3.5
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Agentic Co-Pilot, Speech
          </div>
        </div>

        <div style={{
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '16px',
          padding: '16px 20px',
          boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🚀 Cloud Deployments
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80', marginTop: '6px' }}>
            Multi-Platform
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
            Vercel, Render, GH Pages
          </div>
        </div>
      </div>

      {/* 3. Dãy Nút Lọc Danh Mục (Category Filter Pills) */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '24px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat
                ? 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)'
                : 'var(--card-bg)',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
              border: selectedCategory === cat ? '1px solid transparent' : '1px solid var(--card-border)',
              padding: '8px 18px',
              borderRadius: '25px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: selectedCategory === cat ? '0 4px 15px rgba(56, 189, 248, 0.35)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.color = 'var(--text-main)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedCategory !== cat) {
                e.currentTarget.style.color = 'var(--text-muted)';
                e.currentTarget.style.borderColor = 'var(--card-border)';
              }
            }}
          >
            {cat === 'All' ? '🌐 Tất Cả Kỹ Năng' : cat}
          </button>
        ))}
      </div>

      {/* 4. Lưới Thẻ Kỹ Năng Hiện Đại (Tech Cards Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '35px'
      }}>
        {filteredSkills.map((skill) => {
          const isHovered = hoveredCard === skill.id;

          return (
            <div
              key={skill.id}
              className="card"
              onMouseEnter={() => setHoveredCard(skill.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                position: 'relative',
                padding: '24px',
                borderRadius: '20px',
                background: 'var(--card-bg)',
                border: isHovered
                  ? `1px solid ${skill.accentColor}`
                  : '1px solid var(--card-border)',
                boxShadow: isHovered
                  ? `0 16px 35px rgba(0,0,0,0.4), 0 0 25px ${skill.accentColor}33`
                  : '0 8px 24px rgba(0,0,0,0.25)',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Header Thẻ: Icon + Tên + Badge Level */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${skill.accentColor}18`,
                      border: `1px solid ${skill.accentColor}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      boxShadow: `0 0 15px ${skill.accentColor}25`
                    }}>
                      {skill.icon}
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
                        {skill.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {skill.category}
                      </span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    background: `${skill.accentColor}18`,
                    color: skill.accentColor,
                    border: `1px solid ${skill.accentColor}44`
                  }}>
                    {skill.level}
                  </span>
                </div>

                {/* Mô tả ứng dụng thực tế */}
                <p style={{
                  fontSize: '0.88rem',
                  lineHeight: '1.6',
                  color: 'var(--text-muted)',
                  marginBottom: '18px'
                }}>
                  {skill.description}
                </p>

                {/* Thanh Tiến Trình Neon với Hiệu Ứng Shimmer */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                      Mức độ thành thạo:
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: skill.accentColor }}>
                      {skill.proficiency}%
                    </span>
                  </div>
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${skill.proficiency}%`,
                        height: '100%',
                        borderRadius: '10px',
                        background: `linear-gradient(90deg, ${skill.accentColor}88 0%, ${skill.accentColor} 100%)`,
                        boxShadow: `0 0 12px ${skill.accentColor}`,
                        transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Danh sách Tags công nghệ liên quan */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '14px'
              }}>
                {skill.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'monospace',
                      color: 'var(--text-main)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--card-border)',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Khối Công Cụ & Môi Trường Làm Việc (Developer Toolkit & Environments) */}
      <div className="card" style={{
        padding: '24px 28px',
        borderRadius: '20px',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.6) 0%, rgba(3, 7, 18, 0.8) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.2)'
      }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          marginBottom: '16px',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>🛠️</span> Công Cụ & Môi Trường Lập Trình Thường Dùng
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px'
        }}>
          {[
            { name: 'VS Code & Cursor', icon: '💻', desc: 'IDE chính & AI Extension' },
            { name: 'Git & GitHub', icon: '🐙', desc: 'Quản lý phiên bản mã' },
            { name: 'Postman', icon: '📮', desc: 'Kiểm thử RESTful API' },
            { name: 'Docker', icon: '🐳', desc: 'Containerization' },
            { name: 'Vercel & Render', icon: '☁️', desc: 'Cloud Host Production' },
            { name: 'Chrome DevTools', icon: '🔍', desc: 'Debug & Performance' }
          ].map((tool, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '12px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
              }}
            >
              <span style={{ fontSize: '20px' }}>{tool.icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {tool.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
