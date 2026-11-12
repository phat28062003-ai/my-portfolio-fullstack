import React, { useState, useEffect, useRef } from 'react';
import { sendAIChatMessage } from './api';

export interface AIChatWidgetProps {
  activeTab: 'profile' | 'skills' | 'experience' | 'blog' | 'contact';
  setActiveTab: (tab: 'profile' | 'skills' | 'experience' | 'blog' | 'contact') => void;
  setSelectedTech: (tech: string) => void;
  toggleTheme: () => void;
  theme: 'dark' | 'light';
  scrollToTop: () => void;
}

interface MessageAction {
  label: string;
  type: 'tab' | 'filter' | 'theme' | 'link';
  target?: string;
  actionFn?: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  action?: MessageAction;
  timestamp: string;
}

// Bộ nhớ đệm Client giúp phản hồi siêu tốc tức thì
const CLIENT_CACHE: Record<string, { text: string; action?: MessageAction }> = {
  'dự án': {
    text: 'Dưới đây là 2 dự án Full-stack tiêu biểu nhất của Tiến Phát:\n\n1. Ứng Dụng Todo Quản Lý Công Việc: TypeScript/Vite & FastAPI/Django REST (xác thực JWT bảo mật).\n2. Personal Portfolio & AI Assistant: Web Cyberpunk tích hợp Gemini AI và GitHub Live Dashboard.\n\nTôi đã mở ngay danh sách dự án cho bạn rồi nhé!',
    action: { label: 'Xem Danh Sách Dự Án 🚀', type: 'tab', target: 'profile' }
  },
  'kỹ năng': {
    text: 'Tiến Phát có thế mạnh chuyên sâu về:\n• Backend: Python (FastAPI, Django REST Framework), PostgreSQL, SQLite.\n• Frontend: TypeScript, JavaScript, React, Vite, CSS/Responsive.\n• AI: Tích hợp Google Gemini API, Xử lý ngôn ngữ tự nhiên.\n• DevOps: Git, GitHub Actions, Vercel, Render.\n\nTôi đã đưa bạn đến bảng chi tiết kỹ năng!',
    action: { label: 'Xem Chi Tiết Kỹ Năng ⚡', type: 'tab', target: 'skills' }
  },
  'kinh nghiệm': {
    text: 'Tiến Phát có hơn 2 năm kinh nghiệm thực chiến tự xây dựng và vận hành các sản phẩm Full-stack kết hợp AI, làm chủ quy trình từ thiết kế API đến giao diện tối ưu trải nghiệm người dùng.',
    action: { label: 'Xem Chi Tiết Kinh Nghiệm 💼', type: 'tab', target: 'experience' }
  },
  'nhật ký': {
    text: 'Mục Nhật Ký là nơi Tiến Phát lưu lại các kiến thức công nghệ mới và chia sẻ kinh nghiệm lập trình thực tế. Tôi đã chuyển bạn đến trang Nhật Ký!',
    action: { label: 'Đọc Nhật Ký Học Tập 📝', type: 'tab', target: 'blog' }
  },
  'liên hệ': {
    text: 'Rất hoan nghênh bạn! Bạn có thể gửi tin nhắn qua Form bên dưới hoặc liên hệ trực tiếp:\n• Email: phat28062003@gmail.com\n• GitHub: github.com/phat28062003-ai\n\nTôi đã mở sẵn Form liên hệ cho bạn!',
    action: { label: 'Đến Form Liên Hệ 📬', type: 'tab', target: 'contact' }
  },
  'giao diện': {
    text: 'Đã chuyển đổi giao diện Sáng / Tối cho bạn! Bạn thấy giao diện này thế nào?',
    action: { label: 'Đã Đổi Giao Diện 🌓', type: 'theme' }
  }
};

export const AIChatWidget: React.FC<AIChatWidgetProps> = ({
  setActiveTab,
  setSelectedTech,
  toggleTheme,
  scrollToTop
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'ai',
      text: '⚡ Chào bạn! Tôi là Naruto - Trợ lý AI kiêm Điều phối viên thông minh của Lữ Tiến Phát.\n\nTôi có thể trả lời mọi câu hỏi về kỹ năng, dự án hoặc tự động điều khiển giao diện website theo yêu cầu của bạn!',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const quickPrompts = [
    '🚀 Xem các dự án nổi bật',
    '⚡ Kỹ năng & công nghệ chuyên môn',
    '💼 Kinh nghiệm lập trình thực tế',
    '📝 Xem nhật ký & blog học tập',
    '📬 Tôi muốn liên hệ / phỏng vấn',
    '🌓 Chuyển đổi giao diện Sáng / Tối'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Text-to-Speech (Đọc câu trả lời bằng giọng nói tiếng Việt)
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/\[ACTION:[^\]]+\]/g, '')
        .replace(/[*_#`>]/g, '')
        .trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Lỗi Text-to-Speech:', err);
    }
  };

  // Speech-to-Text (Nhận diện giọng nói tiếng Việt qua Micro)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech. Vui lòng sử dụng Google Chrome hoặc Microsoft Edge!');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
          sendMessage(transcript);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Hiệu ứng Typewriter Streaming siêu tốc (giúp câu trả lời tuôn ra mượt mà tức thì)
  const streamResponse = (fullText: string, action?: MessageAction) => {
    const aiMsgId = `ai-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    // Tạo tin nhắn AI ban đầu
    setMessages((prev) => [
      ...prev,
      {
        id: aiMsgId,
        sender: 'ai',
        text: '',
        action: action,
        timestamp: timeStr
      }
    ]);

    const words = fullText.split(' ');
    let currentIndex = 0;

    const interval = setInterval(() => {
      currentIndex += 3; // Hiện mỗi lần 3 từ để tốc độ cực nhanh mà vẫn mượt
      if (currentIndex >= words.length) {
        clearInterval(interval);
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: fullText } : m))
        );
        setLoading(false);
        if (autoSpeak) speakText(fullText);
      } else {
        const partialText = words.slice(0, currentIndex).join(' ');
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, text: partialText } : m))
        );
      }
    }, 20); // 20ms mỗi bước -> Cực nhanh và mượt mà
  };

  // Điều phối hành động giao diện ngay lập tức (0ms Instant Action Pre-dispatch)
  const executeInstantIntent = (lowerQuery: string) => {
    if (lowerQuery.includes('kỹ năng') || lowerQuery.includes('skill') || lowerQuery.includes('công nghệ')) {
      setActiveTab('skills');
      scrollToTop();
      return { label: 'Xem Tab Kỹ Năng ⚡', type: 'tab' as const, target: 'skills' };
    }
    if (lowerQuery.includes('dự án') || lowerQuery.includes('project') || lowerQuery.includes('todo')) {
      setActiveTab('profile');
      setTimeout(() => {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }, 100);
      return { label: 'Xem Các Dự Án 🚀', type: 'tab' as const, target: 'profile' };
    }
    if (lowerQuery.includes('kinh nghiệm') || lowerQuery.includes('experience')) {
      setActiveTab('experience');
      scrollToTop();
      return { label: 'Xem Kinh Nghiệm 💼', type: 'tab' as const, target: 'experience' };
    }
    if (lowerQuery.includes('nhật ký') || lowerQuery.includes('blog')) {
      setActiveTab('blog');
      scrollToTop();
      return { label: 'Đọc Nhật Ký Học Tập 📝', type: 'tab' as const, target: 'blog' };
    }
    if (lowerQuery.includes('liên hệ') || lowerQuery.includes('contact') || lowerQuery.includes('phỏng vấn') || lowerQuery.includes('email')) {
      setActiveTab('contact');
      scrollToTop();
      return { label: 'Đến Form Liên Hệ 📬', type: 'tab' as const, target: 'contact' };
    }
    if (lowerQuery.includes('giao diện') || lowerQuery.includes('sáng') || lowerQuery.includes('tối') || lowerQuery.includes('theme')) {
      toggleTheme();
      return { label: 'Đã đổi giao diện Sáng/Tối 🌓', type: 'theme' as const };
    }
    if (lowerQuery.includes('typescript')) {
      setActiveTab('profile');
      setSelectedTech('TypeScript');
      setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100);
      return { label: 'Đang lọc dự án: TypeScript 🛠️', type: 'filter' as const };
    }
    if (lowerQuery.includes('react') || lowerQuery.includes('fastapi')) {
      setActiveTab('profile');
      setSelectedTech('React / Vite / FastAPI');
      setTimeout(() => window.scrollTo({ top: 400, behavior: 'smooth' }), 100);
      return { label: 'Đang lọc dự án: React/FastAPI ⚛️', type: 'filter' as const };
    }
    return undefined;
  };

  // Xử lý gửi tin nhắn & Điều phối hành động tốc độ cao
  const sendMessage = async (contentToSend?: string) => {
    const textToSend = (contentToSend || input).trim();
    if (!textToSend || loading) return;

    const lowerQuery = textToSend.toLowerCase();
    const timeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: timeStr
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // 1. KÍCH HOẠT HÀNH ĐỘNG GIAO DIỆN TỨC THÌ (0ms INSTANT ACTION)
    const preAction = executeInstantIntent(lowerQuery);

    // 2. KIỂM TRA BỘ NHỚ ĐỆM TỨC THÌ (INSTANT CLIENT CACHE)
    for (const [key, cached] of Object.entries(CLIENT_CACHE)) {
      if (lowerQuery.includes(key)) {
        setTimeout(() => {
          streamResponse(cached.text, preAction || cached.action);
        }, 50);
        return;
      }
    }

    // 3. GỌI GEMINI LITE API VỚI TỐC ĐỘ CAO
    try {
      const data = await sendAIChatMessage(textToSend);

      if (data && data.reply) {
        let replyText = data.reply;
        let action: MessageAction | undefined = preAction;

        // Phân tích thẻ hành động bổ sung nếu có
        if (replyText.includes('[ACTION:NAVIGATE_SKILLS]')) {
          setActiveTab('skills');
          scrollToTop();
          action = { label: 'Xem Tab Kỹ Năng ⚡', type: 'tab', target: 'skills' };
        } else if (replyText.includes('[ACTION:NAVIGATE_PROJECTS]')) {
          setActiveTab('profile');
          action = { label: 'Xem Các Dự Án 🚀', type: 'tab', target: 'profile' };
          setTimeout(() => window.scrollTo({ top: 380, behavior: 'smooth' }), 100);
        } else if (replyText.includes('[ACTION:NAVIGATE_EXPERIENCE]')) {
          setActiveTab('experience');
          scrollToTop();
          action = { label: 'Xem Kinh Nghiệm 💼', type: 'tab', target: 'experience' };
        } else if (replyText.includes('[ACTION:NAVIGATE_BLOG]')) {
          setActiveTab('blog');
          scrollToTop();
          action = { label: 'Đọc Nhật Ký Học Tập 📝', type: 'tab', target: 'blog' };
        } else if (replyText.includes('[ACTION:NAVIGATE_CONTACT]')) {
          setActiveTab('contact');
          scrollToTop();
          action = { label: 'Đến Form Liên Hệ 📬', type: 'tab', target: 'contact' };
        } else if (replyText.includes('[ACTION:DOWNLOAD_CV]')) {
          action = {
            label: 'Mở GitHub Profile & CV 📄',
            type: 'link',
            target: 'https://github.com/phat28062003-ai'
          };
        }

        // Loại bỏ thẻ action khỏi nội dung hiển thị
        replyText = replyText.replace(/\[ACTION:[^\]]+\]/g, '').trim();

        // Lưu vào bộ nhớ đệm client để lần sau phản hồi tức thì
        CLIENT_CACHE[lowerQuery] = { text: replyText, action };

        // Hiển thị mượt mà với hiệu ứng chữ chạy siêu tốc
        streamResponse(replyText, action);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'ai',
            text: '⚠️ Không nhận được phản hồi từ AI. Vui lòng thử lại sau giây lát.',
            timestamp: timeStr
          }
        ]);
        setLoading(false);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: '🔌 Mất kết nối tới máy chủ AI. Đang tự động kết nối lại...',
          timestamp: timeStr
        }
      ]);
      setLoading(false);
    }
  };

  const handleActionClick = (action: MessageAction) => {
    if (action.type === 'tab' && action.target) {
      setActiveTab(action.target as any);
      scrollToTop();
    } else if (action.type === 'theme') {
      toggleTheme();
    } else if (action.type === 'link' && action.target) {
      window.open(action.target, '_blank');
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'ai',
        text: '⚡ Lịch sử hội thoại đã được làm mới. Tôi sẵn sàng hỗ trợ bạn!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
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
          💬 Trợ Lý AI Co-Pilot
        </button>
      )}

      {/* Cửa sổ khung chat Agentic */}
      {isOpen && (
        <div style={{
          width: '400px',
          height: '560px',
          maxWidth: 'calc(100vw - 32px)',
          backgroundColor: '#090d16',
          color: '#f8fafc',
          borderRadius: '20px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(56, 189, 248, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: '#0f172a',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(56, 189, 248, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #38bdf8, #6366f1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
              }}>
                🥷
              </div>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', letterSpacing: '0.5px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Naruto Co-Pilot
                  <span style={{
                    fontSize: '0.65rem',
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: '#38bdf8',
                    padding: '1px 6px',
                    borderRadius: '8px',
                    fontWeight: 600
                  }}>⚡ Fast Gemini</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', backgroundColor: '#22c55e', borderRadius: '50%' }}></span>
                  Phản hồi siêu tốc • Điều khiển trực tiếp
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Bật / Tắt đọc giọng nói */}
              <button
                onClick={() => setAutoSpeak(!autoSpeak)}
                title={autoSpeak ? 'Tắt đọc giọng nói tự động' : 'Bật đọc giọng nói tự động'}
                style={{
                  background: autoSpeak ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: autoSpeak ? '#38bdf8' : '#94a3b8',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px'
                }}
              >
                {autoSpeak ? '🔊' : '🔇'}
              </button>

              {/* Làm mới hội thoại */}
              <button
                onClick={clearChat}
                title="Xóa lịch sử chat"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px'
                }}
              >
                🗑️
              </button>

              {/* Đóng khung chat */}
              <button
                onClick={() => setIsOpen(false)}
                title="Đóng chat"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  width: '28px',
                  height: '28px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Vùng tin nhắn */}
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
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.sender === 'user' ? '#0284c7' : '#111827',
                    color: msg.sender === 'user' ? '#f8fafc' : '#e2e8f0',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '0.88rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    border: msg.sender === 'ai' ? '1px solid rgba(56, 189, 248, 0.2)' : 'none',
                    boxShadow: msg.sender === 'user' ? '0 4px 12px rgba(2, 132, 199, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {msg.text || (loading && msg.sender === 'ai' ? '...' : '')}

                  {/* Nút hành động tương tác (Interactive Action Button) */}
                  {msg.action && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <button
                        onClick={() => msg.action && handleActionClick(msg.action)}
                        style={{
                          background: 'linear-gradient(135deg, #0284c7, #6366f1)',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                          transition: 'transform 0.15s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      >
                        <span>⚡</span> {msg.action.label}
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer tin nhắn: thời gian & nút phát âm */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  padding: '0 4px'
                }}>
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'ai' && msg.text && (
                    <button
                      onClick={() => speakText(msg.text)}
                      title="Nghe tin nhắn này"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '0.75rem'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#38bdf8'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.82rem', paddingLeft: '4px' }}>
                <span style={{ display: 'inline-block', animation: 'spin 1s infinite linear' }}>⚡</span>
                Đang xử lý siêu tốc...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Dãy gợi ý câu hỏi thông minh 1 chạm (Quick Prompts) */}
          <div style={{
            padding: '8px 12px',
            backgroundColor: '#0c1322',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => sendMessage(prompt)}
                disabled={loading}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  color: '#94a3b8',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#38bdf8';
                  e.currentTarget.style.color = '#38bdf8';
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.2)';
                  e.currentTarget.style.color = '#94a3b8';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Ô nhập tin nhắn & Micro tương tác */}
          <div style={{
            padding: '12px',
            borderTop: '1px solid rgba(56, 189, 248, 0.15)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            backgroundColor: '#0f172a'
          }}>
            {/* Nút Micro nói tiếng Việt */}
            <button
              onClick={toggleListening}
              title={isListening ? 'Dừng lắng nghe' : 'Nói trực tiếp bằng giọng nói (Tiếng Việt)'}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                border: isListening ? '2px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.3)',
                background: isListening ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                color: isListening ? '#ef4444' : '#38bdf8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s',
                animation: isListening ? 'pulse 1s infinite' : 'none'
              }}
            >
              {isListening ? '🔴' : '🎙️'}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={isListening ? 'Đang lắng nghe bạn nói...' : 'Hỏi AI hoặc yêu cầu mở tab...'}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '10px',
                border: isListening ? '1px solid #ef4444' : '1px solid rgba(56, 189, 248, 0.3)',
                backgroundColor: '#050811',
                color: '#fff',
                outline: 'none',
                fontSize: '0.88rem',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.3)'}
            />

            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                background: input.trim() && !loading ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : 'rgba(255, 255, 255, 0.08)',
                color: input.trim() && !loading ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                borderRadius: '10px',
                cursor: input.trim() && !loading ? 'pointer' : 'default',
                fontWeight: 'bold',
                fontSize: '0.88rem',
                boxShadow: input.trim() && !loading ? '0 0 15px rgba(14, 165, 233, 0.4)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
