import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, Shield, Compass, RefreshCw } from 'lucide-react';
import { ChatMessage } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  isDark,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init-1',
      sender: 'assistant',
      text: 'Xin chào! Tôi là trợ lý GIAP TRACE - DẤU CHÂN ĐẠI TƯỚNG của bảo tàng số. Tôi luôn sẵn sàng đồng hành cùng bạn khám phá dòng chảy cuộc đời, bản đồ tác chiến và kho tư liệu số.',
      timestamp: 'Vừa xong',
    },
    {
      id: 'm-init-2',
      sender: 'assistant',
      text: 'Lưu ý: Nhằm bảo đảm tính xác thực lịch sử, trợ lý tuân thủ nguyên tắc không tự sinh dữ liệu ngoài hồ sơ đã kiểm định. Nếu chưa có dữ liệu chính thức, hệ thống sẽ thông báo rõ ràng.',
      timestamp: 'Vừa xong',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Cấu trúc bảo tàng số GIAP TRACE gồm những phần nào?',
    'Giải mã chiến dịch Điện Biên Phủ thể hiện nội dung gì?',
    'Làm thế nào để cập nhật dữ liệu lịch sử chính thức?',
    'Ý nghĩa của tên gọi "Dấu chân Đại tướng"?'
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Vừa xong',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Controlled response evaluation strictly according to prompt
    setTimeout(() => {
      let replyText = 'Dữ liệu lịch sử chưa được cập nhật.';

      const lower = query.toLowerCase();

      if (lower.includes('cấu trúc') || lower.includes('phần nào') || lower.includes('khám phá')) {
        replyText = 'Hệ thống bảo tàng số GIAP TRACE gồm 6 không gian chính: Dòng chảy cuộc đời (Timeline), Dấu chân lịch sử (Bản đồ tương tác), Giải mã chiến dịch (Trung tâm chỉ huy), Kho tư liệu số, Góc chưa biết và Thử thách lịch sử.';
      } else if (lower.includes('chiến dịch') || lower.includes('điện biên phủ') || lower.includes('đánh chắc')) {
        replyText = 'Phần "Giải mã chiến dịch" tái hiện quyết định lịch sử chuyển từ phương châm "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc" ngày 26/01/1954, cùng sơ đồ bố phòng và 3 đợt tiến công thung lũng Mường Thanh.';
      } else if (lower.includes('cập nhật') || lower.includes('thay thế') || lower.includes('dữ liệu thật')) {
        replyText = 'Hệ thống đã thiết kế sẵn cấu trúc dữ liệu chuẩn hóa trong kho lưu trữ mã nguồn. Các nhà nghiên cứu và ban biên tập có thể dễ dàng thay thế các placeholder bằng văn bản, hình ảnh và tư liệu lịch sử chính thức đã được Hội đồng khoa học thẩm định.';
      } else if (lower.includes('dấu chân') || lower.includes('tên gọi') || lower.includes('ý nghĩa')) {
        replyText = '"Dấu chân Đại tướng" là biểu tượng cho hành trình kiến tạo bản lĩnh của Đại tướng Võ Nguyên Giáp qua từng địa danh lịch sử, từ cội nguồn Lệ Thủy, rừng Trần Hưng Đạo, ATK Định Hóa, Mường Phăng đến Tổng hành dinh thống nhất non sông.';
      } else {
        // Strict prompt requirement: "Nếu chưa có dữ liệu: Hiển thị: 'Dữ liệu lịch sử chưa được cập nhật.'"
        replyText = 'Dữ liệu lịch sử chưa được cập nhật.';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Vừa xong',
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div 
      id="ai-assistant-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className={`w-full max-w-lg h-[82vh] max-h-[640px] flex flex-col rounded-3xl border-2 shadow-2xl overflow-hidden ${
          isDark ? 'bg-[#0F2747] border-[#D4AF37]/50 text-white' : 'bg-[#F7F5EF] border-[#D4AF37]/60 text-[#1F2937]'
        }`}
      >
        {/* Chatbot Header */}
        <div className="px-4 py-3.5 border-b border-[#D4AF37]/30 flex items-center justify-between bg-gradient-to-r from-[#0F2747] via-[#162A45] to-[#0A182D] text-white">
          <div className="flex items-center gap-3">
            {/* Dedicated GIAP TRACE Logo Avatar */}
            <div className="relative w-11 h-11 rounded-full border-2 border-[#D4AF37] overflow-hidden bg-black flex items-center justify-center flex-shrink-0 shadow-md">
              <img 
                src={ASSET_PATHS.GIAP_TRACE_LOGO} 
                alt="GIAP TRACE - Dấu chân Đại tướng"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('AiAssistantModal__001__PORTRAIT_GENERAL');
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-extrabold text-[#D4AF37] tracking-tight leading-none">
                  GIAP TRACE
                </h3>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C41E24] text-yellow-300 border border-yellow-400/40">
                  DẤU CHÂN ĐẠI TƯỚNG
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Trợ lý hướng dẫn bảo tàng số
              </p>
            </div>
          </div>

          <button
            id="btn-close-ai-chat"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-[#D4AF37] flex-shrink-0 mt-0.5 bg-black shadow-xs">
                    <img 
                      src={ASSET_PATHS.GIAP_TRACE_LOGO} 
                      alt="GIAP TRACE"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? isDark
                        ? 'bg-[#112239] text-gray-100 border border-[#1E3A5F] rounded-tl-xs shadow-xs'
                        : 'bg-white text-[#1F2937] border border-gray-200 rounded-tl-xs shadow-xs'
                      : 'bg-gradient-to-r from-[#C41E24] to-[#991B1B] text-white border border-yellow-400/30 rounded-tr-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] opacity-70 block text-right mt-1.5 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-2 items-center text-xs text-gray-400 pl-10">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] ml-1 text-gray-400">GIAP TRACE đang tra cứu tư liệu...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        <div className="px-3 py-2.5 border-t border-gray-200 dark:border-gray-800 bg-black/5 dark:bg-black/25 flex-shrink-0">
          <p className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1.5 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            Gợi ý câu hỏi nhanh:
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1.5 rounded-full whitespace-nowrap bg-white dark:bg-[#112239] text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-[#1E3A5F] hover:border-[#D4AF37] hover:text-[#C41E24] dark:hover:text-[#F59E0B] cursor-pointer transition-colors flex-shrink-0 font-medium shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input Bar */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0F2747] flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="ai-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Đặt câu hỏi về bảo tàng số..."
              className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border outline-none focus:ring-1 focus:ring-[#D4AF37] ${
                isDark
                  ? 'bg-[#112239] border-[#1E3A5F] text-white placeholder-gray-400'
                  : 'bg-[#F7F5EF] border-gray-300 text-[#1F2937] placeholder-gray-500'
              }`}
            />
            <button
              id="btn-send-ai-message"
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-[#0F2747] text-[#D4AF37] border border-[#D4AF37]/50 disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all cursor-pointer flex-shrink-0"
              title="Gửi câu hỏi"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
