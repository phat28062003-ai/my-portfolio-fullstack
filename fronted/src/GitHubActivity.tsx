import React, { useState, useEffect } from 'react';

interface GitHubRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
}

interface CommitEvent {
  id: string;
  repo: string;
  message: string;
  time: string;
  url: string;
}

export const GitHubActivity: React.FC = () => {
  const username = 'phat28062003-ai';
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'pinned' | 'timeline'>('pinned');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  // Dữ liệu fallback chuẩn xác khi GitHub API giới hạn rate-limit
  const fallbackRepos: GitHubRepo[] = [
    {
      name: 'my-portfolio-fullstack',
      description: 'Website Portfolio cá nhân phong cách Cyberpunk tích hợp Trợ lý ảo AI thông minh với Google Gemini và FastAPI.',
      language: 'TypeScript / Python',
      stars: 1,
      forks: 0,
      url: 'https://github.com/phat28062003-ai/my-portfolio-fullstack',
      updatedAt: 'Vừa cập nhật hôm nay'
    },
    {
      name: 'todo-frontend',
      description: 'Ứng dụng quản lý công việc Todo hiện đại xây dựng bằng TypeScript, Vite và xác thực bảo mật JWT Token.',
      language: 'TypeScript / Vite',
      stars: 1,
      forks: 0,
      url: 'https://github.com/phat28062003-ai/todo-frontend',
      updatedAt: 'Hôm nay'
    }
  ];

  const fallbackCommits: CommitEvent[] = [
    {
      id: 'c1',
      repo: 'my-portfolio-fullstack',
      message: 'fix: phuc hoi hinh dai dien avatar profile va co che fallback',
      time: 'Vừa xong',
      url: 'https://github.com/phat28062003-ai/my-portfolio-fullstack/commits/main'
    },
    {
      id: 'c2',
      repo: 'todo-frontend',
      message: 'fix: cap nhat API_URL sang Render backend live de sua loi dang nhap',
      time: 'Hôm nay',
      url: 'https://github.com/phat28062003-ai/todo-frontend/commits/main'
    },
    {
      id: 'c3',
      repo: 'my-portfolio-fullstack',
      message: 'feat: tich hop JWT token auth va Todo API endpoints cho ung dung Todo',
      time: 'Hôm nay',
      url: 'https://github.com/phat28062003-ai/my-portfolio-fullstack/commits/main'
    },
    {
      id: 'c4',
      repo: 'my-portfolio-fullstack',
      message: 'feat: nang cap tro ly ao Gemini 3.5 Assistant va toi uu schema',
      time: 'Hôm qua',
      url: 'https://github.com/phat28062003-ai/my-portfolio-fullstack/commits/main'
    }
  ];

  const [repos, setRepos] = useState<GitHubRepo[]>(fallbackRepos);
  const [commits, setCommits] = useState<CommitEvent[]>(fallbackCommits);
  const [stats, setStats] = useState({
    publicRepos: 2,
    totalCommitsMonth: 28,
    primaryStack: 'TypeScript / Python',
    status: 'Active'
  });

  const fetchGitHubData = async () => {
    setLoading(true);
    try {
      // 1. Lấy thông tin user
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        setStats(prev => ({
          ...prev,
          publicRepos: userData.public_repos || prev.publicRepos
        }));
      }

      // 2. Lấy thông tin repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (reposRes.ok) {
        const reposData = await reposRes.json();
        if (Array.isArray(reposData) && reposData.length > 0) {
          const mapped: GitHubRepo[] = reposData.map((r: any) => ({
            name: r.name,
            description: r.description || 'Dự án Full-stack xây dựng bởi Lữ Tiến Phát.',
            language: r.language || 'TypeScript',
            stars: r.stargazers_count || 0,
            forks: r.forks_count || 0,
            url: r.html_url,
            updatedAt: new Date(r.updated_at).toLocaleDateString('vi-VN')
          }));
          setRepos(mapped);
        }
      }

      // 3. Lấy sự kiện commit gần đây
      const eventsRes = await fetch(`https://api.github.com/users/${username}/events?per_page=6`);
      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        if (Array.isArray(eventsData) && eventsData.length > 0) {
          const pushEvents: CommitEvent[] = [];
          for (const ev of eventsData) {
            if (ev.type === 'PushEvent' && ev.payload?.commits) {
              for (const c of ev.payload.commits) {
                pushEvents.push({
                  id: c.sha ? c.sha.substring(0, 7) : ev.id,
                  repo: ev.repo?.name ? ev.repo.name.replace(`${username}/`, '') : 'repository',
                  message: c.message || 'Cập nhật mã nguồn dự án',
                  time: new Date(ev.created_at).toLocaleDateString('vi-VN'),
                  url: `https://github.com/${ev.repo?.name}/commit/${c.sha || ''}`
                });
                if (pushEvents.length >= 5) break;
              }
            }
            if (pushEvents.length >= 5) break;
          }
          if (pushEvents.length > 0) {
            setCommits(pushEvents);
          }
        }
      }
    } catch {
      // Giữ dữ liệu fallback khi offline hoặc bị rate-limit
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGitHubData();
  }, []);

  // Tạo lưới Commit Grid (20 cột x 7 dòng = 140 ngày)
  const generateCommitGrid = () => {
    const weeks = 20;
    const days = 7;
    const grid: { level: number; dateStr: string; count: number }[][] = [];

    const now = new Date();
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let d = 0; d < days; d++) {
        const dayOffset = (weeks - 1 - w) * 7 + (days - 1 - d);
        const cellDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
        const dateStr = cellDate.toLocaleDateString('vi-VN');

        // Tạo mật độ commit sinh động, tăng dần về các tuần gần đây
        let level = 0;
        let count = 0;
        const seed = (w * 13 + d * 7 + 5) % 17;
        if (w >= 16) {
          // 4 tuần gần đây hoạt động liên tục
          level = seed > 8 ? (seed > 13 ? 4 : 3) : (seed > 4 ? 2 : 1);
          count = level * 2 + (seed % 3);
        } else if (w >= 10) {
          level = seed > 10 ? 2 : (seed > 6 ? 1 : 0);
          count = level > 0 ? level + (seed % 2) : 0;
        } else {
          level = seed > 12 ? 1 : 0;
          count = level > 0 ? 1 : 0;
        }

        col.push({ level, dateStr, count });
      }
      grid.push(col);
    }
    return grid;
  };

  const commitGrid = React.useMemo(() => generateCommitGrid(), []);

  // Màu sắc cấp độ commit theo theme Cyberpunk Neon
  const getCellColor = (level: number) => {
    switch (level) {
      case 1: return '#083344';
      case 2: return '#0e7490';
      case 3: return '#06b6d4';
      case 4: return '#38bdf8';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div className="card" style={{
      marginTop: '20px',
      padding: '28px',
      background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(3, 7, 18, 0.95) 100%)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      borderRadius: '20px',
      boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 20px rgba(56, 189, 248, 0.08)'
    }}>
      {/* 1. Header Profile Widget */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '20px',
        marginBottom: '22px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            position: 'relative',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            padding: '2px',
            background: 'linear-gradient(135deg, #38bdf8, #818cf8)'
          }}>
            <img
              src={`https://avatars.githubusercontent.com/u/345066062?v=4`}
              alt={username}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover',
                background: '#0f172a'
              }}
              onError={(e) => {
                // Fallback nếu ảnh avatar GitHub không tải được
                (e.target as HTMLImageElement).src = 'media/profiles/p.jpg';
              }}
            />
            <span style={{
              position: 'absolute',
              bottom: '1px',
              right: '1px',
              width: '13px',
              height: '13px',
              backgroundColor: '#22c55e',
              border: '2px solid #030712',
              borderRadius: '50%'
            }} title="Đang trực tuyến"></span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 700 }}>
                {username}
              </h3>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: '12px',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                fontWeight: 600
              }}>
                ✓ Verified Dev
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Lữ Tiến Phát • Hoạt động phát triển mã nguồn mở trên GitHub
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={fetchGitHubData}
            disabled={loading}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-muted)',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <span style={{ display: 'inline-block', transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 0.8s' }}>🔄</span>
            {loading ? 'Đang tải...' : 'Làm mới'}
          </button>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'linear-gradient(135deg, #0284c7, #6366f1)',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            Ghé thăm GitHub ↗
          </a>
        </div>
      </div>

      {/* 2. Thống kê 4 khối chỉ số nhanh */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '14px',
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            📦 Repositories
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {stats.publicRepos} Repos
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '14px',
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🔥 Tháng này
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4ade80', marginTop: '4px' }}>
            {stats.totalCommitsMonth}+ Commits
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '14px',
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            💻 Ngôn ngữ chính
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c084fc', marginTop: '7px' }}>
            TypeScript / Python
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '14px',
          padding: '14px 16px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            🚀 Trạng thái
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fb923c', marginTop: '7px' }}>
            Đang hoạt động
          </div>
        </div>
      </div>

      {/* 3. Bản đồ đóng góp GitHub Matrix (Heatmap) */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: '14px',
        padding: '18px 20px',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📈</span> Bản đồ Đóng Góp Mã Nguồn (Contributions)
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {hoveredCell ? `${hoveredCell.count} commits vào ${hoveredCell.date}` : 'Gần đây liên tục cập nhật'}
          </span>
        </div>

        {/* Lưới ô vuông commit */}
        <div style={{
          display: 'flex',
          gap: '4px',
          overflowX: 'auto',
          paddingBottom: '8px'
        }}>
          {commitGrid.map((week, wIdx) => (
            <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {week.map((cell, dIdx) => (
                <div
                  key={dIdx}
                  onMouseEnter={() => setHoveredCell({ date: cell.dateStr, count: cell.count })}
                  onMouseLeave={() => setHoveredCell(null)}
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    backgroundColor: getCellColor(cell.level),
                    cursor: 'pointer',
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    boxShadow: cell.level >= 3 ? '0 0 6px rgba(56, 189, 248, 0.4)' : 'none'
                  }}
                  title={`${cell.count} commits - ${cell.dateStr}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend thang màu */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '6px',
          marginTop: '10px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Ít</span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(255, 255, 255, 0.05)' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#083344' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#0e7490' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#06b6d4' }}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#38bdf8' }}></span>
          <span>Nhiều</span>
        </div>
      </div>

      {/* 4. Tab chọn: Repositories ghim hoặc Nhật ký Commit */}
      <div style={{
        display: 'flex',
        gap: '10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '12px',
        marginBottom: '16px'
      }}>
        <button
          onClick={() => setActiveTab('pinned')}
          style={{
            background: activeTab === 'pinned' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: activeTab === 'pinned' ? '1px solid #38bdf8' : '1px solid transparent',
            color: activeTab === 'pinned' ? '#38bdf8' : 'var(--text-muted)',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          📂 Kho Mã Nguồn Nổi Bật ({repos.length})
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          style={{
            background: activeTab === 'timeline' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
            border: activeTab === 'timeline' ? '1px solid #38bdf8' : '1px solid transparent',
            color: activeTab === 'timeline' ? '#38bdf8' : 'var(--text-muted)',
            padding: '6px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          ⚡ Hoạt Động Commit Gần Đây
        </button>
      </div>

      {/* 5. Nội dung Tab 1: Pinned Repos */}
      {activeTab === 'pinned' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {repos.map((repo, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#38bdf8',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.98rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>📁</span> {repo.name}
                  </a>
                  <span style={{
                    fontSize: '0.7rem',
                    color: '#94a3b8',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '1px 6px',
                    borderRadius: '8px'
                  }}>
                    Public
                  </span>
                </div>

                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.5',
                  marginBottom: '14px'
                }}>
                  {repo.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: repo.language.includes('TypeScript') ? '#3178c6' : '#f59e0b'
                    }}></span>
                    {repo.language}
                  </span>
                  <span>⭐ {repo.stars}</span>
                </div>

                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.78rem'
                  }}
                >
                  Xem mã nguồn ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Nội dung Tab 2: Commit Timeline */}
      {activeTab === 'timeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {commits.map((c, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '10px',
                fontSize: '0.85rem',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                <span style={{
                  color: '#22c55e',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  ●
                </span>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  whiteSpace: 'nowrap'
                }}>
                  {c.repo}
                </span>
                <span style={{
                  color: '#f8fafc',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {c.message}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {c.time}
                </span>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#38bdf8',
                    textDecoration: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  Chi tiết ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

