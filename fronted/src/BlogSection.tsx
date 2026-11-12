import React, { useState } from 'react';

interface BlogPost {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  categoryColor: string;
  readTime: string;
  image?: string;
  image_caption?: string;
  created_at: string;
  tags: string[];
}

interface BlogSectionProps {
  getMediaUrl: (path?: string) => string;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ getMediaUrl }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likes, setLikes] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('blogLikes');
      return saved ? JSON.parse(saved) : { 1: 18, 2: 34, 3: 25 };
    } catch {
      return { 1: 18, 2: 34, 3: 25 };
    }
  });

  const [expandedBlog, setExpandedBlog] = useState<number | null>(null);

  const initialBlogs: BlogPost[] = [
    {
      id: 1,
      title: 'Học kiến thức mới về Django REST, React và Tích Hợp AI Agent',
      summary: 'Hành trình tự học và nâng cấp dự án full-stack với FastAPI, mô hình Gemini và giao diện Cyberpunk.',
      content: 'Trong quá trình phát triển ứng dụng, việc kết hợp giữa Django REST Framework cho dữ liệu quan hệ và FastAPI cho các tác vụ AI bất đồng bộ mang lại hiệu năng vượt trội. Đồng thời, tôi đã áp dụng Web Speech API để biến giao diện tĩnh thành một người trợ lý ảo có khả năng lắng nghe và trả lời tiếng Việt mượt mà.',
      category: 'Kỹ Thuật & AI',
      categoryColor: '#38bdf8',
      readTime: '4 phút đọc',
      image: 'blog_images/images_lKvqlr2.jfif',
      image_caption: 'Kiến trúc giao diện & luồng dữ liệu hệ thống',
      created_at: '2026-10-30T04:40:15Z',
      tags: ['Django', 'FastAPI', 'Gemini AI', 'Cyberpunk', 'Full-stack']
    },
    {
      id: 2,
      title: 'Chú cún cưng & Khoảnh khắc thư giãn tái tạo năng lượng lập trình',
      summary: 'Chia sẻ về người bạn bốn chân siêu đáng yêu giúp giải tỏa căng thẳng sau những giờ coding liên tục.',
      content: 'Lập trình đòi hỏi sự tập trung cao độ và đôi lúc không tránh khỏi những lúc đau đầu vì bug hay cấu hình deploy phức tạp. Những lúc như vậy, việc rời mắt khỏi màn hình máy tính, chơi đùa cùng chú cún cưng mang lại cảm giác bình yên và nguồn cảm hứng sáng tạo dồi dào để tiếp tục thử thách.',
      category: 'Đời Sống & Thư Giãn',
      categoryColor: '#4ade80',
      readTime: '2 phút đọc',
      image: 'blog_images/download_1.jfif',
      image_caption: 'Người bạn trung thành luôn đồng hành khi code',
      created_at: '2026-10-30T04:48:40Z',
      tags: ['Life', 'Relax', 'Pets', 'WorkLifeBalance']
    },
    {
      id: 3,
      title: 'Tối ưu hóa bảo mật và xác thực JWT trong ứng dụng SPA',
      summary: 'Kinh nghiệm triển khai JSON Web Token (Access & Refresh Token) an toàn giữa React và Django.',
      content: 'Xác thực không trạng thái (Stateless Authentication) với JWT là tiêu chuẩn vàng cho các ứng dụng hiện đại. Bài viết đúc kết kinh nghiệm xử lý tự động làm mới token (Token Refresh), lưu trữ an toàn và phân quyền người dùng trong ứng dụng Todo Full-stack.',
      category: 'Bảo Mật & Web',
      categoryColor: '#c084fc',
      readTime: '3 phút đọc',
      created_at: '2026-11-05T09:15:00Z',
      tags: ['JWT', 'Security', 'Authentication', 'TypeScript']
    }
  ];

  const categories = ['All', 'Kỹ Thuật & AI', 'Bảo Mật & Web', 'Đời Sống & Thư Giãn'];

  const handleLike = (id: number) => {
    setLikes((prev) => {
      const updated = { ...prev, [id]: (prev[id] || 0) + 1 };
      localStorage.setItem('blogLikes', JSON.stringify(updated));
      return updated;
    });
  };

  const filteredBlogs = initialBlogs.filter((b) => {
    const matchCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchQuery = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div className="tab-content" style={{ animation: 'smoothFade 0.4s ease' }}>
      {/* 1. Header & Thanh Tìm Kiếm */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: 'var(--text-main)',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span>📝</span> Nhật Ký & Bài Viết Chuyên Môn
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
            Nơi ghi lại kinh nghiệm thực chiến, bài học công nghệ và những khoảnh khắc đời thường của Tiến Phát.
          </p>
        </div>

        {/* Ô tìm kiếm bài viết */}
        <div style={{ minWidth: '240px', flex: '1 1 auto', maxWidth: '320px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Tìm kiếm bài viết, hashtag..."
            className="custom-input"
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: '25px',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              color: 'var(--text-main)',
              fontSize: '0.88rem'
            }}
          />
        </div>
      </div>

      {/* 2. Bộ Lọc Danh Mục */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '24px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'var(--card-bg)',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
              border: selectedCategory === cat ? '1px solid transparent' : '1px solid var(--card-border)',
              padding: '6px 16px',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              boxShadow: selectedCategory === cat ? '0 4px 12px rgba(56, 189, 248, 0.3)' : 'none'
            }}
          >
            {cat === 'All' ? 'Tất Cả Bài Viết' : cat}
          </button>
        ))}
      </div>

      {/* 3. Lưới Bài Viết Dạng Magazine Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '22px'
      }}>
        {filteredBlogs.map((b) => {
          const isExpanded = expandedBlog === b.id;

          return (
            <article
              key={b.id}
              className="card animated-card-hover"
              style={{
                borderRadius: '20px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)'
              }}
            >
              <div>
                {/* Ảnh Thumbnail bo góc nếu có */}
                {b.image && (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    marginBottom: '16px',
                    position: 'relative'
                  }}>
                    <img
                      src={getMediaUrl(b.image)}
                      alt={b.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(0, 0, 0, 0.65)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      📸 {b.image_caption || 'Hình ảnh minh họa'}
                    </span>
                  </div>
                )}

                {/* Danh mục & Thời gian đọc */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '14px',
                    background: `${b.categoryColor}18`,
                    color: b.categoryColor,
                    border: `1px solid ${b.categoryColor}44`
                  }}>
                    {b.category}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ⏱️ {b.readTime} • {new Date(b.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Tiêu đề bài viết */}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  margin: '0 0 10px 0',
                  lineHeight: '1.5'
                }}>
                  {b.title}
                </h3>

                {/* Tóm tắt nội dung */}
                <p style={{
                  fontSize: '0.88rem',
                  lineHeight: '1.65',
                  color: 'var(--text-muted)',
                  marginBottom: '16px'
                }}>
                  {isExpanded ? b.content : b.summary}
                </p>
              </div>

              <div>
                {/* Hashtags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {b.tags.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'monospace',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.08)',
                        padding: '2px 8px',
                        borderRadius: '6px'
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Footer Thẻ: Nút Xem Thêm & Thả Tim */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '12px'
                }}>
                  <button
                    onClick={() => setExpandedBlog(isExpanded ? null : b.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#38bdf8',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    {isExpanded ? 'Thu gọn ▲' : 'Đọc toàn bộ bài viết ↗'}
                  </button>

                  <button
                    onClick={() => handleLike(b.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#f43f5e',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'transform 0.15s'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  >
                    ❤️ {likes[b.id] || 0}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

