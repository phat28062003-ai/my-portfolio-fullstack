import React from 'react';

interface ExperienceItem {
  id: number;
  period: string;
  role: string;
  company: string;
  location: string;
  badge: string;
  badgeColor: string;
  highlights: string[];
  techStack: string[];
}

export const ExperienceSection: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      id: 1,
      period: '2024 - HIỆN TẠI',
      role: 'Full-stack Developer & AI Engineer Aspirant',
      company: 'Personal Projects & Open-Source Research',
      location: 'Mỹ Tho, Việt Nam (Remote)',
      badge: 'Chủ Lực • Active',
      badgeColor: '#38bdf8',
      highlights: [
        'Phát triển Website Portfolio cá nhân phong cách Cyberpunk tích hợp Trợ lý ảo Agentic AI Naruto sử dụng Google Gemini 3.5 và Gemini 3.1 Lite.',
        'Xây dựng hệ thống điều khiển giao diện web bằng giọng nói tiếng Việt 2 chiều (Web Speech API) và cơ chế Action Tags tự động hoá.',
        'Tối ưu hóa tốc độ phản hồi AI xuống dưới 1 giây bằng bộ nhớ đệm đa tầng (Client/Server LRU Cache) và cơ chế Instant Action 0ms.',
        'Triển khai tự động hóa hạ tầng CI/CD trên Render, Vercel và GitHub Pages với độ ổn định 99.9%.'
      ],
      techStack: ['Python', 'FastAPI', 'Google Gemini AI', 'React 19', 'TypeScript', 'Vite', 'Web Speech API']
    },
    {
      id: 2,
      period: '2023 - 2024',
      role: 'Full-stack Web Developer',
      company: 'Todo Application & Web Solutions',
      location: 'Việt Nam',
      badge: 'Hoàn Thành',
      badgeColor: '#4ade80',
      highlights: [
        'Thiết kế và phát triển toàn diện ứng dụng Todo Management Full-stack kết hợp giữa Backend Django REST và Frontend Vite/TypeScript.',
        'Xây dựng hệ thống xác thực người dùng phân quyền bằng JSON Web Token (JWT) an toàn, tích hợp CORS Middleware cho client đa nguồn.',
        'Triển khai các tính năng quản lý công việc nâng cao: mức độ ưu tiên (Priority), hạn chót (Due Date), bộ lọc động và thống kê số liệu.',
        'Tích hợp hiệu ứng pháo hoa confetti kỷ niệm hoàn thành task và giao diện đổi màu themes IT linh hoạt.'
      ],
      techStack: ['Django REST Framework', 'Python', 'SimpleJWT', 'TypeScript', 'SQLite / PostgreSQL', 'Vercel']
    },
    {
      id: 3,
      period: '2021 - 2025 (DỰ KIẾN)',
      role: 'Sinh Viên Ngành Công Nghệ Thông Tin',
      company: 'Đại Học / Học Viện CNTT',
      location: 'Việt Nam',
      badge: 'Đào Tạo Chính Quy',
      badgeColor: '#c084fc',
      highlights: [
        'Nghiên cứu nền tảng vững chắc về Cấu trúc dữ liệu & Giải thuật, Lập trình Hướng đối tượng (OOP), và Kiến trúc phần mềm.',
        'Thiết kế và chuẩn hóa cơ sở dữ liệu quan hệ (RDBMS), tối ưu hóa câu lệnh truy vấn SQL phức tạp.',
        'Tự học và cập nhật liên tục các công nghệ hiện đại: Trí tuệ nhân tạo tạo sinh (GenAI), Cloud Computing và DevOps cơ bản.'
      ],
      techStack: ['Data Structures & Algorithms', 'Database System', 'OOP', 'Software Engineering', 'Network Security']
    }
  ];

  return (
    <div className="tab-content" style={{ animation: 'smoothFade 0.4s ease' }}>
      {/* 1. Header */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 800,
          color: 'var(--text-main)',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>💼</span> Quá Trình & Kinh Nghiệm Thực Chiến
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '650px', margin: 0, lineHeight: '1.6' }}>
          Hành trình phát triển từ sinh viên chuyên ngành CNTT đến Lập trình viên Full-stack đam mê tích hợp Trí tuệ nhân tạo vào sản phẩm thực tế.
        </p>
      </div>

      {/* 2. Dòng thời gian Cyberpunk Timeline */}
      <div style={{ position: 'relative', paddingLeft: '28px', borderLeft: '2px solid rgba(56, 189, 248, 0.25)' }}>
        {experiences.map((exp) => (
          <div
            key={exp.id}
            style={{
              position: 'relative',
              marginBottom: '36px'
            }}
          >
            {/* Chấm tròn neon phát sáng trên trục thời gian */}
            <div style={{
              position: 'absolute',
              left: '-37px',
              top: '4px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              backgroundColor: exp.badgeColor,
              boxShadow: `0 0 14px ${exp.badgeColor}, 0 0 25px ${exp.badgeColor}88`,
              border: '3px solid #030712'
            }}></div>

            {/* Thẻ nội dung kinh nghiệm */}
            <div
              className="card animated-card-hover"
              style={{
                padding: '26px',
                borderRadius: '20px',
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Header Thẻ: Thời gian + Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '0.82rem',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: exp.badgeColor,
                  letterSpacing: '1px'
                }}>
                  📅 {exp.period}
                </span>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '3px 12px',
                  borderRadius: '20px',
                  background: `${exp.badgeColor}18`,
                  color: exp.badgeColor,
                  border: `1px solid ${exp.badgeColor}44`
                }}>
                  {exp.badge}
                </span>
              </div>

              {/* Chức danh & Đơn vị */}
              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                margin: '0 0 6px 0'
              }}>
                {exp.role}
              </h3>
              <div style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span>🏢 {exp.company}</span>
                <span>•</span>
                <span>📍 {exp.location}</span>
              </div>

              {/* Các điểm nhấn thành tựu */}
              <ul style={{
                paddingLeft: '18px',
                margin: '0 0 20px 0',
                color: 'var(--text-muted)',
                fontSize: '0.92rem',
                lineHeight: '1.75'
              }}>
                {exp.highlights.map((item, hIdx) => (
                  <li key={hIdx} style={{ marginBottom: '6px' }}>
                    {item}
                  </li>
                ))}
              </ul>

              {/* Tech Stack Chips */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '16px'
              }}>
                {exp.techStack.map((tech, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      fontWeight: 600,
                      color: '#38bdf8',
                      background: 'rgba(56, 189, 248, 0.08)',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                      padding: '3px 10px',
                      borderRadius: '8px'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
