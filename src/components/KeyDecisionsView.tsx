import React, { useState } from 'react';
import { 
  Shield, 
  Flag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Award, 
  Volume2, 
  VolumeX, 
  Compass, 
  RotateCcw,
  Check,
  Flame,
  ArrowRight
} from 'lucide-react';
import { getCuratedImage } from '../data/giapImageMap.generated';
import { 
  playPaperTurn, 
  playHistoricalStamp, 
  playSuccessChime, 
  playTrumpetSalute 
} from '../utils/soundEffects';

interface KeyDecisionsViewProps {
  isDark: boolean;
  onBackToHome: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const KeyDecisionsView: React.FC<KeyDecisionsViewProps> = ({
  isDark,
  onBackToHome,
  onNavigateToTab,
}) => {
  const [activeStepId, setActiveStepId] = useState<'before' | 'decision' | 'after'>('decision');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  const quoteAudioScript = 
    'Đêm ngày 25 tháng 1, tôi không sao chợp mắt. Đánh nhanh thắng nhanh thì không nắm chắc 100% thắng lợi. Tôi đã quyết định hoãn nổ súng và ra lệnh kéo pháo ra để chuyển sang đánh chắc tiến chắc.';

  const handleToggleAiSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isAiSpeaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(quoteAudioScript);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.96;
      utterance.pitch = 0.95;
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsAiSpeaking(true);
    }
  };

  return (
    <div 
      id="key-decision-turning-point-view" 
      className="w-full max-w-5xl mx-auto space-y-8 pb-28 pt-2 px-3 sm:px-5"
    >
      {/* 1. CINEMATIC HERO HEADER */}
      <section 
        className={`rounded-3xl border-2 p-6 sm:p-9 relative overflow-hidden transition-all shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-[#1c0f0f] via-[#161d18] to-[#0a120d] border-red-500/50 text-white' 
            : 'bg-gradient-to-br from-[#fff7ed] via-[#fef2f2] to-[#fefce8] border-red-600/40 text-stone-900 shadow-xl'
        }`}
      >
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 dark:opacity-10 pointer-events-none font-serif text-[180px] sm:text-[220px] font-black select-none text-red-900 dark:text-amber-200">
          1954
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            {/* Classification Stamp / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-700 to-rose-700 text-white text-[11px] font-mono font-black uppercase tracking-widest shadow-md border border-amber-300/40">
                <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse fill-yellow-300" />
                QUYẾT ĐỊNH KHÓ KHĂN NHẤT
              </span>
              <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-stone-900/10 dark:bg-black/50 border border-amber-500/30 text-red-700 dark:text-amber-300">
                Sở Chỉ huy Mường Phăng • 26/01/1954
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-serif uppercase text-red-700 dark:text-amber-300 drop-shadow-sm">
              QUYẾT ĐỊNH THEN CHỐT
            </h1>
            <p className="text-base sm:text-xl font-bold tracking-wide mt-1 text-stone-800 dark:text-emerald-200 font-serif">
              ĐIỆN BIÊN PHỦ: BƯỚC NGOẶT CHUYỂN ĐỔI PHƯƠNG CHÂM TÁC CHIẾN
            </p>
            <p className="text-xs sm:text-sm font-medium mt-2 text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
              Khám phá thời khắc lịch sử quyết định vận mệnh toàn chiến dịch: Hoãn nổ súng, kéo pháo ra, chuyển từ &ldquo;Đánh nhanh, thắng nhanh&rdquo; sang &ldquo;Đánh chắc, tiến chắc&rdquo;.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 flex-shrink-0">
            <button
              onClick={() => {
                playTrumpetSalute();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg border border-yellow-300/40 cursor-pointer active:scale-95 transition-all"
            >
              <Flag className="w-4 h-4 text-yellow-300" />
              <span>Hiệu Lệnh Xuất Quân</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border border-stone-400/40 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
            >
              ← Về Trang chủ
            </button>
          </div>
        </div>
      </section>

      {/* 2. ARCHIVAL PHOTO & DOCUMENTED HISTORIC QUOTE */}
      <section 
        className={`rounded-3xl border-2 p-6 sm:p-8 relative overflow-hidden transition-all shadow-xl ${
          isDark 
            ? 'bg-[#152219]/90 border-amber-500/40 text-white' 
            : 'bg-white border-amber-500/40 text-stone-900 shadow-lg'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Archival Photograph of General Giap at Mường Phăng HQ */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-black border-2 border-amber-500/50 shadow-lg min-h-[260px] group">
            <img 
              src={getCuratedImage('DecisionsAndInsightsView__001__GIAP_MUONG_PHANG_HQ')} 
              alt="Đại tướng Võ Nguyên Giáp tại Sở chỉ huy Mường Phăng"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-black block">
                ẢNH TƯ LIỆU GỐC
              </span>
              <p className="text-xs text-white font-medium line-clamp-2 mt-0.5">
                Lán tác chiến Đại tướng Võ Nguyên Giáp tại rừng Mường Phăng, Điện Biên.
              </p>
            </div>
          </div>

          {/* Historic Quote & Mandate */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className={`p-5 rounded-2xl border-l-4 border-red-600 shadow-sm ${
              isDark ? 'bg-stone-900/90 border-stone-700' : 'bg-amber-50/90 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-600 dark:text-amber-400 mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>LỜI NÓI LỊCH SỬ CỦA ĐẠI TƯỚNG VÕ NGUYÊN GIÁP:</span>
              </div>
              <blockquote className="text-sm sm:text-base font-serif italic text-stone-900 dark:text-stone-100 leading-relaxed font-vietnamese-quote">
                &ldquo;Đêm ngày 25 tháng 1, tôi không sao chợp mắt... Đánh nhanh thắng nhanh thì không nắm chắc thắng lợi 100%. Nếu đánh nhanh mà thất bại thì toàn bộ vốn liếng của cuộc kháng chiến sẽ tiêu tan. Vì vậy, tôi đã quyết định hoãn nổ súng và ra lệnh kéo pháo ra.&rdquo;
              </blockquote>

              {/* AI Voice Narration Button */}
              <div className="mt-3.5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isAiSpeaking ? 'bg-red-600 text-white animate-pulse' : 'bg-emerald-700 text-white'
                  }`}>
                    <Volume2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300">
                    Thuyết minh trích dẫn lịch sử
                  </span>
                </div>

                <button
                  onClick={handleToggleAiSpeech}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAiSpeaking 
                      ? 'bg-amber-600 text-white animate-pulse' 
                      : 'bg-red-700 hover:bg-red-600 text-white shadow-xs'
                  }`}
                >
                  {isAiSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAiSpeaking ? 'Dừng đọc' : 'Phát giọng đọc'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold block">
                  Thời gian trăn trở trước giờ G
                </span>
                <span className="text-base sm:text-lg font-black text-red-600 dark:text-amber-400 font-mono">
                  11 Ngày Đêm
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold block">
                  Kim chỉ nam của Chủ tịch Hồ Chí Minh
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">
                  Chắc thắng mới đánh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE BEFORE ➔ DECISION ➔ AFTER VISUAL FLOW */}
      <section className="space-y-4">
        <div className="text-center">
          <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-red-600/10 via-amber-500/20 to-red-600/10 text-xs font-mono font-black tracking-widest text-red-700 dark:text-amber-300 uppercase border border-red-500/30">
            SƠ ĐỒ TRỰC QUAN 3 BƯỚC THAY ĐỔI CỤC DIỆN
          </span>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-medium">
            Chạm vào từng giai đoạn để nghe hiệu ứng lật tài liệu và đóng dấu chứng thực
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch relative">
          {/* Step 1: TRƯỚC (BEFORE) */}
          <div 
            onClick={() => {
              playPaperTurn();
              setActiveStepId('before');
            }}
            className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              activeStepId === 'before'
                ? isDark
                  ? 'bg-stone-900 border-amber-400 shadow-xl ring-2 ring-amber-400/40 text-stone-100'
                  : 'bg-white border-amber-500 shadow-xl ring-2 ring-amber-500/30 text-stone-900'
                : isDark 
                ? 'bg-stone-900/80 border-stone-700 hover:border-amber-500/60 text-stone-200' 
                : 'bg-white/90 border-stone-300 hover:border-amber-400 text-stone-800 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-stone-200 dark:border-stone-800">
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-black uppercase">
                  01. TRƯỚC (BEFORE)
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              
              <h4 className="text-base font-black text-red-700 dark:text-amber-400 font-serif mb-2">
                Phương án &ldquo;Đánh nhanh, thắng nhanh&rdquo;
              </h4>

              <ul className="space-y-2 text-xs font-medium leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span>Dự kiến tác chiến tập trung dốc toàn lực trong <strong>3 ngày 2 đêm</strong>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span>Pháo binh kéo vào lòng chảo, đặt lộ thiên trên sườn đồi dốc.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span><strong>Nguy cơ cực lớn:</strong> Pháp kịp tăng viện; hỏa lực pháo binh và không quân địch dễ dàng bắn phá tiêu diệt pháo ta.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 block">
                Đánh giá: Rất mạo hiểm, không chắc thắng
              </span>
              <span className="text-[10px] font-mono text-stone-400">📜 Chạm xem</span>
            </div>
          </div>

          {/* Step 2: QUYẾT ĐỊNH (DECISION) */}
          <div 
            onClick={() => {
              playHistoricalStamp();
              setActiveStepId('decision');
            }}
            className={`rounded-2xl border-2 p-5 flex flex-col justify-between relative transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.99] ${
              activeStepId === 'decision'
                ? isDark
                  ? 'bg-gradient-to-b from-[#2e1414] to-[#1e0d0d] border-red-500 ring-2 ring-red-500/50 text-white shadow-2xl'
                  : 'bg-gradient-to-b from-[#fff5f5] to-[#ffe8e8] border-red-600 ring-2 ring-red-600/30 text-stone-900 shadow-xl'
                : isDark 
                ? 'bg-stone-900/90 border-red-900/50 hover:border-red-500/60 text-white' 
                : 'bg-red-50/50 border-red-300 hover:border-red-500 text-stone-900 shadow-xs'
            }`}
          >
            {/* Central Stamp */}
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-red-700 text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm border border-yellow-300/40">
              LỆNH KHẨN 26/01
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-red-300 dark:border-red-900/60">
                <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-xs font-mono font-black uppercase shadow-xs">
                  02. QUYẾT ĐỊNH (DECISION)
                </span>
                <Flag className="w-4 h-4 text-yellow-400" />
              </div>

              <h4 className="text-base font-black text-red-700 dark:text-red-400 font-serif mb-2">
                Hoãn nổ súng &bull; Kéo pháo ra
              </h4>

              <ul className="space-y-2 text-xs font-medium leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>Đại tướng chủ trì họp Đảng ủy mặt trận sáng 26/01/1954 để thay đổi nhận thức toàn quân.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>Quyết định hoãn giờ nổ súng chỉ vài tiếng trước thời điểm xuất kích.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span><strong>Mệnh lệnh thép:</strong> Kéo pháo ra củng cố công sự kiên cố, chuyển sang phương châm &ldquo;Đánh chắc, tiến chắc&rdquo;.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-red-200 dark:border-red-900/60 flex items-center justify-between">
              <span className="text-[11px] font-mono font-black text-red-700 dark:text-yellow-400 block">
                Bản lĩnh: Chịu trách nhiệm bảo toàn xương máu
              </span>
              <span className="text-[10px] font-mono text-amber-400 font-bold">🔴 Đóng dấu</span>
            </div>
          </div>

          {/* Step 3: SAU ĐÓ (AFTER) */}
          <div 
            onClick={() => {
              playHistoricalStamp();
              setActiveStepId('after');
            }}
            className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              activeStepId === 'after'
                ? isDark
                  ? 'bg-stone-900 border-emerald-400 ring-2 ring-emerald-400/40 text-stone-100 shadow-xl'
                  : 'bg-white border-emerald-600 ring-2 ring-emerald-600/30 text-stone-900 shadow-xl'
                : isDark 
                ? 'bg-stone-900/80 border-stone-700 hover:border-emerald-500/60 text-stone-200' 
                : 'bg-white/90 border-stone-300 hover:border-emerald-500 text-stone-800 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-stone-200 dark:border-stone-800">
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-black uppercase">
                  03. SAU ĐÓ (AFTER)
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>

              <h4 className="text-base font-black text-emerald-700 dark:text-emerald-400 font-serif mb-2">
                Phương án &ldquo;Đánh chắc, tiến chắc&rdquo;
              </h4>

              <ul className="space-y-2 text-xs font-medium leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>Khoét sâu lòng núi làm hầm pháo kiên cố, pháo địch không thể phản pháo.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span>Đào hàng trăm km giao thông hào siết chặt sân bay Mường Thanh, cắt đứt dù tiếp tế.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold mt-0.5">•</span>
                  <span><strong>Kết quả vẻ vang:</strong> Toàn thắng 07/05/1954, bắt sống De Castries, bảo tồn tối đa lực lượng bộ đội.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 block">
                Ý nghĩa: Thắng lợi hoàn toàn, chấn động địa cầu
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">✓ Toàn thắng</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CALLOUT TO RADAR & ARCHIVES */}
      <section className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-300 dark:border-stone-800">
        <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
          Khám phá thêm các góc nhìn tác chiến & di sản lưu trữ:
        </span>
        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('radar')}
              className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-600 text-white font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Mở Radar Tác Chiến Mật Lệnh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
