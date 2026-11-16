import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  MapPin, 
  Lightbulb, 
  Volume2, 
  Square, 
  Play, 
  Image as ImageIcon, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  ArrowDown, 
  Compass, 
  Sliders, 
  ExternalLink,
  Award,
  Radio,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { MilestoneExhibitionData } from '../data/milestoneExhibitionsData';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playSuccessChime, playRadarPing, playCabinetClick } from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface MilestoneInteractiveExhibitionProps {
  data: MilestoneExhibitionData;
  isDark: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const MilestoneInteractiveExhibition: React.FC<MilestoneInteractiveExhibitionProps> = ({
  data,
  isDark,
  onClose,
  onNavigateToTab,
}) => {
  // Voice storytelling state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Gallery slider state
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Before / After slider state (0 - 100)
  const [sliderPosition, setSliderPosition] = useState(50);

  // Interactive Quiz state
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Clean speech on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Audio Speech toggle
  const toggleSpeechAudio = () => {
    playCabinetClick();
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt không hỗ trợ giọng đọc AI trực tiếp.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setAudioProgress(0);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(data.historicalVoiceScript);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(100);
      setTimeout(() => setAudioProgress(0), 1000);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);

    // Simulated progress bar
    const interval = setInterval(() => {
      setAudioProgress((prev) => {
        if (prev >= 98 || !isPlayingAudio) {
          clearInterval(interval);
          return prev;
        }
        return prev + 2.5;
      });
    }, 1000);
  };

  const handleSelectQuiz = (index: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswer(index);
    setQuizSubmitted(true);
    if (index === data.interactiveChallenge.correctIndex) {
      playSuccessChime();
    } else {
      playRadarPing();
    }
  };

  return (
    <div 
      id="milestone-exhibition-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/95 text-white animate-fade-in flex flex-col items-center select-none"
    >
      {/* Floating Close Button Top-Right */}
      <button
        onClick={() => {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
          onClose();
        }}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-black/70 hover:bg-red-700 text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all hover:scale-110 cursor-pointer"
        title="Đóng triển lãm"
      >
        <X className="w-6 h-6" />
      </button>

      {/* ========================================================================= */}
      {/* 1. FULLSCREEN HERO SECTION: ẢNH SỰ KIỆN TOÀN MÀN HÌNH + NĂM CỰC LỚN      */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] flex flex-col justify-between items-center px-4 py-8 overflow-hidden bg-black">
        {/* Fullscreen Background Event Image with Cinematic Vignette */}
        <div className="absolute inset-0 z-0">
          <img 
            src={data.heroImage} 
            alt={data.title}
            className="w-full h-full object-cover object-center scale-105 animate-[zoom-in_25s_ease-out_infinite] transition-transform duration-1000"
            onError={(e) => {
              (e.target as HTMLImageElement).src = getCuratedImage('MilestoneInteractiveExhibition__001__HERO_FLAG_GENERAL');
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none" />
        </div>

        {/* Top Historical Tag */}
        <div className="relative z-10 pt-4 flex flex-col items-center text-center space-y-1">
          <span className="px-4 py-1 rounded-full bg-[#DC2626] text-white font-mono text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg border border-yellow-300/40">
            ★ DẤU MỐC LỊCH SỬ VIỆT NAM ★
          </span>
          <span className="text-xs sm:text-sm font-mono text-yellow-300 font-bold tracking-wider">
            {data.period}
          </span>
        </div>

        {/* Center: GIANT YEAR + TITLE (Không phải ảnh chân dung) */}
        <div className="relative z-10 text-center max-w-4xl px-3 my-auto flex flex-col items-center">
          {/* Chữ năm cực lớn */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-serif tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 drop-shadow-[0_8px_30px_rgba(245,158,11,0.6)] leading-none select-none">
            {data.year}
          </h1>

          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-normal sm:tracking-tight text-white font-serif mt-3 sm:mt-4 drop-shadow-lg leading-snug sm:leading-tight">
            {data.title}
          </h2>

          <p className="text-sm sm:text-lg md:text-xl font-bold text-yellow-300 mt-2 sm:mt-3 max-w-2xl mx-auto drop-shadow-md font-serif leading-relaxed">
            {data.subtitle}
          </p>

          <p className="text-xs sm:text-sm md:text-base text-stone-200 italic mt-2.5 sm:mt-3 max-w-xl mx-auto drop-shadow-sm font-medium leading-relaxed px-2">
            &ldquo;{data.poeticTagline}&rdquo;
          </p>
        </div>

        {/* Bottom Hint: Cuộn xuống để bước vào không gian */}
        <div className="relative z-10 pb-4 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs font-mono uppercase tracking-widest text-stone-300 font-bold">
            ▼ Cuộn xuống để khám phá triển lãm
          </span>
          <div className="w-7 h-10 rounded-full border-2 border-yellow-400 flex items-start justify-center p-1.5 shadow-lg">
            <div className="w-1.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Main Flow: Max-w-3xl Container with visual blocks */}
      <main className="w-full max-w-4xl px-4 sm:px-6 py-10 space-y-12 pb-32">
        {/* ========================================================================= */}
        {/* 2. BLOCK: 📍 ĐỊA DANH LỊCH SỬ & MAP MINI                                   */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#D4A017]/40 pb-2">
            <span className="p-2 rounded-xl bg-[#B91C1C]/25 text-[#F87171] border border-[#B91C1C]/40">
              <MapPin className="w-5 h-5 text-[#F87171]" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4A017] block">
                KHÔNG GIAN LỊCH SỬ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                📍 {data.locationName.split(',')[0]}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl border-2 border-[#D4A017]/40 bg-gradient-to-br from-[#1E293B] via-[#162238] to-[#0F172A] shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-stone-300 font-mono">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D4A017] flex-shrink-0" />
                <span>{data.locationCoordinates}</span>
              </span>
              <span className="text-[#CBD5E1]">{data.locationName}</span>
            </div>

            {/* Interactive Map Mini Visual */}
            <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden border border-[#D4A017]/30 bg-stone-900 group">
              <img 
                src={getCuratedImage('MilestoneInteractiveExhibition__002__CAMPAIGN_MAP')} 
                alt="Bản đồ tọa độ lịch sử"
                className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

              {/* Pulsing Target Radar Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <span className="relative flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-80" />
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-[#B91C1C] border-2 border-yellow-300 items-center justify-center shadow-lg">
                    <MapPin className="w-4 h-4 text-white" />
                  </span>
                </span>
                <span className="mt-2 px-3 py-1 rounded-full bg-black/90 text-yellow-300 text-xs font-mono font-black border border-[#D4A017]/50 shadow-xl whitespace-nowrap">
                  {data.locationName.split(',')[0]}
                </span>
              </div>

              {/* Action Button: Mở bản đồ toàn cảnh */}
              <button
                onClick={() => {
                  onClose();
                  if (onNavigateToTab) onNavigateToTab('map');
                }}
                className="absolute bottom-3 right-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] hover:brightness-110 text-white font-mono font-black text-xs sm:text-sm flex items-center gap-2 shadow-2xl border border-yellow-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-2 ring-red-400/30"
              >
                <span>Mở Bản đồ số toàn cảnh</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. BLOCK: 💡 BẠN CÓ BIẾT? (FACT CARD ĐẬM NÉT - KHÔNG VĂN DÀI)              */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#D4A017]/40 pb-2">
            <span className="p-2 rounded-xl bg-[#D4A017]/20 text-yellow-400 border border-[#D4A017]/40">
              <Lightbulb className="w-5 h-5 text-yellow-300" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4A017] block">
                CHI TIẾT ĐẮC GIÁ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                💡 BẠN CÓ BIẾT?
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl border-2 border-[#D4A017]/50 bg-gradient-to-r from-[#1E293B] via-[#24334A] to-[#1E293B] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-base sm:text-lg font-medium text-amber-100 leading-relaxed font-sans">
              {data.didYouKnowFact}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. BLOCK: 🎙️ NGHE KỂ CHUYỆN (AI HISTORICAL VOICE NARRATION)               */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#D4A017]/40 pb-2">
            <span className="p-2 rounded-xl bg-[#355E3B]/30 text-[#86EFAC] border border-[#355E3B]/50">
              <Radio className="w-5 h-5 text-[#86EFAC] animate-pulse" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#86EFAC] block">
                THUYẾT MINH BẢO TÀNG SỐ
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                🎙️ NGHE KỂ CHUYỆN LỊCH SỬ
              </h3>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#355E3B]/50 bg-gradient-to-r from-[#1E293B] via-[#162F22] to-[#1E293B] shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-black text-[#86EFAC] tracking-wider uppercase block">
                  GIỌNG THUYẾT MINH AI • THỜI LƯỢNG ~{data.audioDurationSeconds} GIÂY
                </span>
                <p className="text-xs sm:text-sm text-[#E2E8F0] font-medium line-clamp-2">
                  {data.historicalVoiceScript}
                </p>
              </div>

              {/* Big Play / Stop Button */}
              <button
                onClick={toggleSpeechAudio}
                className={`p-4 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shadow-xl flex-shrink-0 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-600 hover:bg-amber-500 text-white animate-pulse ring-4 ring-amber-400/40'
                    : 'bg-[#355E3B] hover:bg-emerald-700 text-white hover:scale-105 border border-yellow-300/40'
                }`}
                title={isPlayingAudio ? 'Dừng giọng đọc' : 'Phát lời kể lịch sử'}
              >
                {isPlayingAudio ? (
                  <Square className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current translate-x-0.5" />
                )}
              </button>
            </div>

            {/* Audio Progress Bar */}
            <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-[#355E3B]/40">
              <div 
                className="bg-gradient-to-r from-[#86EFAC] to-[#D4A017] h-full transition-all duration-300"
                style={{ width: `${audioProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. BLOCK: 📷 THƯ VIỆN ẢNH TƯ LIỆU (CAROUSEL / GALLERY VIEW)               */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center justify-between border-b-2 border-yellow-500/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-600/30 text-purple-400 border border-purple-500/40">
                <ImageIcon className="w-5 h-5 text-purple-400" />
              </span>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 block">
                  KHO LƯU TRỮ HÌNH ẢNH
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                  📷 THƯ VIỆN ẢNH TƯ LIỆU ({data.gallery.length})
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-stone-400">
              <span>{activeGalleryIndex + 1}</span>
              <span>/</span>
              <span>{data.gallery.length}</span>
            </div>
          </div>

          {/* Large Focused Gallery Card */}
          <div className="rounded-3xl border-2 border-[#D4AF37]/50 bg-black/80 overflow-hidden shadow-2xl space-y-3">
            <div className="relative w-full h-72 sm:h-96 bg-black flex items-center justify-center group">
              <img 
                src={data.gallery[activeGalleryIndex].url}
                alt={data.gallery[activeGalleryIndex].caption}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('MilestoneInteractiveExhibition__003__HERO_FLAG_GENERAL');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

              {/* Prev / Next controls */}
              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : data.gallery.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-xl cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveGalleryIndex((prev) => (prev < data.gallery.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-black text-white border border-white/20 shadow-xl cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Photo Badge */}
              <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-xs font-mono font-black uppercase tracking-wider bg-[#DC2626] text-white border border-yellow-300/40">
                {data.gallery[activeGalleryIndex].badge}
              </span>
            </div>

            {/* Caption */}
            <div className="p-4 pt-1">
              <p className="text-sm sm:text-base font-bold text-yellow-200">
                {data.gallery[activeGalleryIndex].caption}
              </p>
            </div>

            {/* Thumbnail selector */}
            <div className="px-4 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {data.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`w-16 h-12 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                    activeGalleryIndex === idx
                      ? 'border-yellow-400 scale-105 shadow-md'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. BLOCK: BEFORE / AFTER SLIDER (NẾU CÓ DỮ LIỆU SO SÁNH)                  */}
        {/* ========================================================================= */}
        {data.comparisonBeforeAfter && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-yellow-500/40 pb-2">
              <span className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
                <Sliders className="w-5 h-5 text-blue-400" />
              </span>
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block">
                  ĐỐI CHIẾU LỊCH SỬ
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                  KÉO THANH TRƯỢT SO SÁNH
                </h3>
              </div>
            </div>

            <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden border-2 border-yellow-400/40 shadow-2xl bg-black">
              {/* After Image (Background) */}
              <img 
                src={data.comparisonBeforeAfter.afterImage}
                alt={data.comparisonBeforeAfter.afterLabel}
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 text-yellow-300 font-mono text-xs font-bold border border-yellow-400/40">
                {data.comparisonBeforeAfter.afterLabel}
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={data.comparisonBeforeAfter.beforeImage}
                  alt={data.comparisonBeforeAfter.beforeLabel}
                  className="absolute inset-0 w-full h-full object-cover object-center max-w-none"
                  style={{ width: '100%', minWidth: '100%' }}
                />
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-xl bg-black/80 text-white font-mono text-xs font-bold border border-white/40">
                  {data.comparisonBeforeAfter.beforeLabel}
                </div>
              </div>

              {/* Vertical Divider Line */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-yellow-400 shadow-[0_0_15px_#F59E0B] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              />

              {/* Range Input on top for dragging */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={sliderPosition}
                onChange={(e) => setSliderPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                aria-label="Kéo thanh trượt so sánh trước và sau"
              />
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 7. BLOCK: 🎯 THỬ THÁCH NHANH (QUIZ CARD)                                   */}
        {/* ========================================================================= */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b-2 border-[#D4A017]/40 pb-2">
            <span className="p-2 rounded-xl bg-[#B91C1C]/25 text-[#F87171] border border-[#B91C1C]/40">
              <Award className="w-5 h-5 text-[#F87171]" />
            </span>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#D4A017] block">
                TƯƠNG TÁC THỬ THÁCH
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white font-serif uppercase">
                🎯 THỬ THÁCH BẢN LĨNH
              </h3>
            </div>
          </div>

          <div className="p-6 rounded-3xl border-2 border-[#B91C1C]/50 bg-gradient-to-br from-[#1E293B] via-[#2A1616] to-[#1E293B] shadow-xl space-y-4">
            <h4 className="text-lg sm:text-xl font-black text-white font-serif">
              {data.interactiveChallenge.question}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {data.interactiveChallenge.options.map((opt, idx) => {
                const isSelected = selectedQuizAnswer === idx;
                const isCorrect = idx === data.interactiveChallenge.correctIndex;

                let btnStyle = 'bg-black/60 border-slate-700 hover:border-yellow-400 text-[#E2E8F0]';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-[#355E3B] text-white border-[#86EFAC] ring-2 ring-[#86EFAC]/50';
                  } else if (isSelected) {
                    btnStyle = 'bg-[#B91C1C] text-white border-red-400';
                  } else {
                    btnStyle = 'opacity-40 border-stone-800 text-stone-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => handleSelectQuiz(idx)}
                    className={`p-4 rounded-2xl border-2 text-left text-sm sm:text-base font-bold transition-all shadow-md cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-300 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submit */}
            {quizSubmitted && (
              <div className="p-4 rounded-2xl bg-black/75 border border-[#D4A017]/50 text-[#E2E8F0] text-xs sm:text-sm animate-in fade-in duration-300">
                <span className="font-black text-yellow-300 block mb-1 text-sm">
                  {selectedQuizAnswer === data.interactiveChallenge.correctIndex ? '✓ CHÍNH XÁC!' : '✕ CHƯA CHÍNH XÁC!'}
                </span>
                <p className="leading-relaxed">{data.interactiveChallenge.explanation}</p>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* BOTTOM NAVIGATION ACTIONS                                                  */}
        {/* ========================================================================= */}
        <div className="pt-6 border-t border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
            }}
            className="px-6 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-sm transition-all border border-stone-600 hover:border-yellow-400 cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Hành trình lịch sử</span>
          </button>

          <button
            onClick={() => {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
              onClose();
              if (onNavigateToTab) onNavigateToTab('decisions');
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 text-white font-black text-sm flex items-center gap-2 shadow-xl border border-yellow-300/40 cursor-pointer"
          >
            <span>Thử thách Quyết định lịch sử</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};
