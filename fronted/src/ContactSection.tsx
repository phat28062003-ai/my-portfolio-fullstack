import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface ContactSectionProps {
  initialEmail?: string;
  initialGithub?: string;
  initialLocation?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  initialEmail = 'phat28062003@gmail.com',
  initialGithub = 'https://github.com/phat28062003-ai',
  initialLocation = 'Mỹ Tho, Tiền Giang, Việt Nam'
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Tuyển Dụng Full-stack',
    message: ''
  });

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const quickTopics = [
    'Tuyển Dụng Full-stack',
    'Hợp Tác Dự Án Web/AI',
    'Trao Đổi Kỹ Thuật',
    'Freelance Project'
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(initialEmail).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatusMsg('Vui lòng điền đầy đủ Tên, Email và Nội dung!');
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setStatusMsg('');

    try {
      const response = await fetch('https://formspree.io/f/xnppryjl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message
        })
      });

      if (response.ok) {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSubmitStatus('success');
        setStatusMsg('🚀 Tuyệt vời! Tin nhắn của bạn đã được gửi thành công đến hộp thư của tôi. Tôi sẽ phản hồi sớm nhất!');
        setForm({ name: '', email: '', subject: 'Tuyển Dụng Full-stack', message: '' });
      } else {
        setSubmitStatus('error');
        setStatusMsg('❌ Có lỗi xảy ra trong quá trình gửi. Vui lòng thử lại hoặc gửi trực tiếp qua email!');
      }
    } catch {
      setSubmitStatus('error');
      setStatusMsg('❌ Lỗi kết nối mạng. Vui lòng kiểm tra lại đường truyền!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="tab-content" style={{ animation: 'fadeIn 0.4s ease-out' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(192, 132, 252, 0.12) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        borderRadius: '16px',
        padding: '28px 24px',
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 8px 32px rgba(56, 189, 248, 0.1)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(74, 222, 128, 0.15)', border: '1px solid rgba(74, 222, 128, 0.4)', borderRadius: '20px', padding: '4px 14px', marginBottom: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 10px #4ade80', animation: 'pulse 1.8s infinite' }}></span>
            <span style={{ color: '#4ade80', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.5px' }}>
              OPEN TO WORK • SẴN SÀNG NHẬN CƠ HỘI
            </span>
          </div>
          <h2 style={{ fontSize: '1.9rem', margin: '6px 0 8px', color: 'var(--text-main)', fontWeight: 800 }}>
            📬 Hộp Thư Liên Hệ & Kết Nối Kỹ Thuật
          </h2>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.98rem', maxWidth: '620px', lineHeight: '1.6' }}>
            Bạn đang tìm kiếm một lập trình viên Full-stack nhiệt huyết, có tư duy AI và sẵn sàng bứt phá? Hãy để lại lời nhắn hoặc kết nối trực tiếp với tôi ngay hôm nay!
          </p>
        </div>

        <button
          onClick={handleCopyEmail}
          style={{
            background: copied ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #38bdf8, #818cf8)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 20px',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: copied ? '0 0 20px rgba(16, 185, 129, 0.4)' : '0 4px 16px rgba(56, 189, 248, 0.3)'
          }}
        >
          {copied ? '✅ Đã Sao Chép Email!' : '📋 Sao Chép Email Nhanh'}
        </button>
      </div>

      {/* Main Grid: 2 Columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Left Column: Direct Info Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Card 1: Email */}
          <div className="card animated-card-hover" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                ✉️
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Email Trực Tiếp</span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#38bdf8', wordBreak: 'break-all' }}>{initialEmail}</h4>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: '1.5' }}>
              Kênh liên lạc ưu tiên nhất cho các cơ hội tuyển dụng và trao đổi kỹ thuật.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href={`mailto:${initialEmail}`}
                style={{
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}
              >
                Gửi Mail Trực Tiếp ↗
              </a>
              <button
                onClick={handleCopyEmail}
                style={{
                  background: 'transparent',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--card-border)',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                {copied ? 'Đã chép' : 'Sao chép'}
              </button>
            </div>
          </div>

          {/* Card 2: GitHub */}
          <div className="card animated-card-hover" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(192, 132, 252, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                🐙
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Kho Mã Nguồn</span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1.05rem', color: '#c084fc' }}>phat28062003-ai</h4>
              </div>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0 0 14px', lineHeight: '1.5' }}>
              Xem toàn bộ commit history, kiến trúc backend Django và frontend React/TypeScript.
            </p>
            <a
              href={initialGithub}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(192, 132, 252, 0.12)',
                color: '#c084fc',
                border: '1px solid rgba(192, 132, 252, 0.3)',
                padding: '7px 14px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}
            >
              Truy cập GitHub Profile ↗
            </a>
          </div>

          {/* Card 3: Location & SLA */}
          <div className="card animated-card-hover" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(251, 191, 36, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem'
              }}>
                📍
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Địa Điểm & Hình Thức</span>
                <h4 style={{ margin: '2px 0 0', fontSize: '1rem', color: 'var(--text-main)' }}>{initialLocation}</h4>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              <div>🏢 <strong>Hình thức:</strong> Full-time Remote / Hybrid / On-site</div>
              <div>⚡ <strong>Thời gian phản hồi:</strong> Thường dưới 2-4 giờ</div>
              <div>🌐 <strong>Múi giờ:</strong> GMT+7 (Việt Nam)</div>
            </div>
          </div>
        </div>

        {/* Right Column: Cyberpunk Contact Form */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-main)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>✉️</span> Gửi Lời Nhắn Nhanh
          </h3>

          {/* Quick topic pills */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
              Chọn chủ đề cần trao đổi:
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {quickTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, subject: topic }))}
                  style={{
                    background: form.subject === topic ? 'linear-gradient(135deg, #38bdf8, #818cf8)' : 'rgba(255, 255, 255, 0.04)',
                    color: form.subject === topic ? '#fff' : 'var(--text-muted)',
                    border: '1px solid var(--card-border)',
                    padding: '5px 12px',
                    borderRadius: '16px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Họ và Tên của bạn *
              </label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A (Công ty ABC)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Địa chỉ Email phản hồi *
              </label>
              <input
                type="email"
                placeholder="VD: hr@congty.com hoặc your.email@gmail.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>
                Nội dung tin nhắn *
              </label>
              <textarea
                rows={5}
                placeholder="Xin chào Phát, chúng tôi đang tuyển dụng vị trí Full-stack Developer hoặc có dự án muốn trao đổi..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-main)',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {statusMsg && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '0.88rem',
                lineHeight: '1.5',
                background: submitStatus === 'success' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)',
                color: submitStatus === 'success' ? '#4ade80' : '#f87171',
                border: `1px solid ${submitStatus === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`
              }}>
                {statusMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                padding: '14px 24px',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(56, 189, 248, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
                  Đang gửi tin nhắn...
                </>
              ) : (
                <>
                  <span>🚀</span> Gửi Tin Nhắn Ngay
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

