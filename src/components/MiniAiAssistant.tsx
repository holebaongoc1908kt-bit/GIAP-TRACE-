import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playRadarPing } from '../utils/soundEffects';
import { AppLanguage, translations } from '../utils/i18n';

interface MiniAiAssistantProps {
  isDark: boolean;
  language: AppLanguage;
  onOpenFullChat: () => void;
}

export const MiniAiAssistant: React.FC<MiniAiAssistantProps> = ({
  isDark,
  language,
  onOpenFullChat,
}) => {
  const t = translations[language].miniAi;
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [quickReply, setQuickReply] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const handleQuickAsk = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputQuery.trim();
    if (!query) return;

    setIsAnswering(true);
    playRadarPing();

    setTimeout(() => {
      setIsAnswering(false);
      const lower = query.toLowerCase();

      if (lower.includes('điện biên phủ') || lower.includes('dien bien phu') || lower.includes('1954')) {
        setQuickReply(
          language === 'vi'
            ? 'Chiến dịch Điện Biên Phủ (13/3 - 07/5/1954) toàn thắng sau 56 ngày đêm với quyết định lịch sử "Đánh chắc tiến chắc" ngày 26/01/1954.'
            : 'The Dien Bien Phu Campaign culminated in historic victory on May 7, 1954, decided by General Giap’s strategic pivot to "Steady Attack, Steady Advance".'
        );
      } else if (lower.includes('1944') || lower.includes('thành lập') || lower.includes('34')) {
        setQuickReply(
          language === 'vi'
            ? 'Ngày 22/12/1944 tại khu rừng Trần Hưng Đạo (Cao Bằng), Đội Việt Nam Tuyên truyền Giải phóng quân gồm 34 chiến sĩ được thành lập do đồng chí Võ Nguyên Giáp chỉ huy.'
            : 'On Dec 22, 1944, in Tran Hung Dao forest (Cao Bang), the Vietnam Propaganda and Liberation Army was founded with 34 soldiers under General Giap.'
        );
      } else if (lower.includes('thần tốc') || lower.includes('1975')) {
        setQuickReply(
          language === 'vi'
            ? 'Bức điện mật ngày 7/4/1975: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút..."'
            : 'Historic telegram of April 7, 1975: "Lightning speed, even greater lightning speed; audacity, even greater audacity; seize every hour, every minute..."'
        );
      } else {
        setQuickReply(
          language === 'vi'
            ? `Dữ liệu lịch sử đã được ghi nhận: "${query}". Bạn có thể mở trợ lý toàn màn hình để xem phân tích sử học sâu sắc hơn.`
            : `Query noted: "${query}". Please open the full AI historian window for deep document analysis.`
        );
      }
    }, 400);
  };

  return (
    <aside 
      id="mini-giap-trace-bot" 
      aria-label="GIAP TRACE Mini AI Assistant"
      className="w-full my-6 transition-all"
    >
      <div className={`rounded-2xl border-2 transition-all ${
        isDark 
          ? 'bg-[#1E293B] border-[#D4A017]/40 text-white shadow-xl' 
          : 'bg-white border-[#D4A017]/40 text-[#0F172A] shadow-lg'
      } overflow-hidden`}>
        {/* Header Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#B91C1C] via-[#0F172A] to-[#1E293B] text-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl overflow-hidden border border-yellow-300 flex-shrink-0 bg-black">
              <img 
                src={ASSET_PATHS.GIAP_TRACE_LOGO} 
                alt="GIAP TRACE" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black tracking-wide text-yellow-400">
                  {t.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-stone-300 font-medium">
                {t.status}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenFullChat}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#D4A017] hover:bg-yellow-400 text-[#0F172A] transition-all cursor-pointer shadow-xs"
              title={t.openFull}
            >
              <span>{language === 'vi' ? 'Mở cửa sổ lớn' : 'Full Chat'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quick Input Form */}
        <div className="p-3 sm:p-4 bg-black/5 dark:bg-black/20">
          <form onSubmit={handleQuickAsk} className="flex items-center gap-2">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.placeholder}
              className={`flex-1 px-3.5 py-2 rounded-xl text-xs border outline-none focus:ring-1 focus:ring-[#D4A017] ${
                isDark 
                  ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-[#FFFDF9] border-stone-300 text-stone-900 placeholder-stone-400'
              }`}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isAnswering}
              className="px-3.5 py-2 rounded-xl bg-[#B91C1C] hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-40 transition-all cursor-pointer flex-shrink-0 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.ask}</span>
            </button>
          </form>

          {/* Quick Answering State or Response */}
          {isAnswering && (
            <div className="mt-2.5 flex items-center gap-2 text-xs text-amber-500 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Đang tra cứu cơ sở dữ liệu lịch sử...' : 'Searching historical database...'}</span>
            </div>
          )}

          {quickReply && !isAnswering && (
            <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 leading-relaxed relative animate-in fade-in">
              <button
                onClick={() => setQuickReply(null)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
              <p className="pr-4">{quickReply}</p>
            </div>
          )}

          {/* Expandable Fast Questions */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700/60 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                {language === 'vi' ? 'Hỏi nhanh:' : 'Quick Prompts:'}
              </span>
              {[
                language === 'vi' ? 'Điện Biên Phủ 1954' : 'Dien Bien Phu 1954',
                language === 'vi' ? '34 chiến sĩ đầu tiên 1944' : 'First 34 soldiers 1944',
                language === 'vi' ? 'Bức điện thần tốc 1975' : '1975 Telegram',
                language === 'vi' ? 'Bản đồ di tích lịch sử' : 'Heritage Map',
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputQuery(item);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] bg-white dark:bg-[#112239] border border-gray-300 dark:border-gray-700 hover:border-[#D4AF37] text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
