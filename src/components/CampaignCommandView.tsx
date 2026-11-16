import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Flag, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  X, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FileText, 
  Award, 
  Compass, 
  Eye,
  RotateCcw,
  BookOpen,
  MapPin,
  Check,
  CornerDownRight
} from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { 
  playCabinetClick, 
  playSuccessChime, 
  playTrumpetSalute, 
  playRadarPing,
  playPaperTurn,
  playHistoricalStamp
} from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface CampaignCommandViewProps {
  isDark: boolean;
  onBackToHome: () => void;
}

export interface CampaignBoardStage {
  id: string;
  stepNumber: string;
  code: string;
  name: string;
  timeMarker: string;
  shortSummary: string;
  image: string;
  stampText: string;
  stampColor: 'red' | 'gold' | 'green';
  points: string[];
  archivalDoc: {
    source: string;
    quote: string;
    date: string;
  };
  aiNarration: string;
}

const CAMPAIGN_STAGES: CampaignBoardStage[] = [
  {
    id: 'stage-01',
    stepNumber: '01',
    code: '01 — NHẬN ĐỊNH',
    name: 'NHẬN ĐỊNH',
    timeMarker: 'Cuối năm 1953 — Tháng 01/1954',
    shortSummary: 'Pháp xây dựng tập đoàn cứ điểm Điện Biên Phủ với 16.200 quân hòng biến nơi đây thành "cỗ máy nghiền nát Việt Minh".',
    image: getCuratedImage('CampaignCommandView__001__TACTICAL_BRIEFING_MAP'),
    stampText: 'TỐI MẬT • THÁM BÁO',
    stampColor: 'red',
    points: [
      'Tướng Navarre tập trung 16.200 lính tinh nhuệ và xây dựng 49 cứ điểm liên hoàn tại lòng chảo Điện Biên Phủ.',
      'Pháp tự tin pháo đài này là "bất khả xâm phạm", thách thức quân ta chủ động tấn công.',
      'Bộ Chính trị và Bác Hồ giao Đại tướng Võ Nguyên Giáp trực tiếp chỉ huy với nguyên tắc: "Chắc thắng mới đánh, không chắc thắng không đánh".'
    ],
    archivalDoc: {
      source: 'Lời căn dặn của Chủ tịch Hồ Chí Minh khi trao quyền Tổng tư lệnh',
      quote: 'Trận này rất quan trọng, phải đánh cho thắng. Chắc thắng mới đánh, không chắc thắng không đánh.',
      date: 'Tháng 12/1953'
    },
    aiNarration: 'Giai đoạn nhận định: Thực dân Pháp biến Điện Biên Phủ thành cỗ máy nghiền quân ta. Đại tướng Võ Nguyên Giáp nhận nhiệm vụ từ Bác Hồ với mệnh lệnh sống còn: Chắc thắng mới đánh, không chắc thắng không đánh.'
  },
  {
    id: 'stage-02',
    stepNumber: '02',
    code: '02 — CHUẨN BỊ',
    name: 'CHUẨN BỊ',
    timeMarker: 'Tháng 01/1954',
    shortSummary: 'Hàng vạn dân công xẻ núi mở đường, bộ đội dùng sức người kéo những cỗ pháo nặng hàng tấn vào sườn núi.',
    image: getCuratedImage('CampaignCommandView__002__CAMPAIGN_MAP'),
    stampText: 'QUÂN LỆNH KÉO PHÁO',
    stampColor: 'gold',
    points: [
      'Hơn 260.000 dân công cùng 20.000 xe đạp thồ vượt hàng trăm km đèo dốc bảo đảm hậu cần.',
      'Bộ đội dùng dây chão và cơ bắp kéo lựu pháo 105mm vượt dốc cao vực sâu suốt nhiều tuần lễ.',
      'Kế hoạch tác chiến ban đầu dự kiến nổ súng ngày 25/1 theo phương án "Đánh nhanh thắng nhanh" trong 3 ngày 2 đêm.'
    ],
    archivalDoc: {
      source: 'Tư liệu Sở chỉ huy mặt trận',
      quote: 'Dốc đứng vực sâu, mỗi mét đường kéo pháo là thử thách phi thường của ý chí con người.',
      date: 'Tháng 01/1954'
    },
    aiNarration: 'Giai đoạn chuẩn bị: Nhân dân cả nước dồn sức cho mặt trận. Hàng vạn chiến sĩ kéo những khẩu pháo nặng hàng tấn lên đỉnh dốc sương mù, sẵn sàng cho trận quyết chiến.'
  },
  {
    id: 'stage-03',
    stepNumber: '03',
    code: '03 — QUYẾT ĐỊNH',
    name: 'QUYẾT ĐỊNH',
    timeMarker: 'Sáng 26/01/1954',
    shortSummary: 'Quyết định khó khăn nhất đời cầm quân: Hoãn nổ súng, kéo pháo ra, chuyển sang "Đánh chắc tiến chắc".',
    image: getCuratedImage('CampaignCommandView__003__CAMPAIGN_MAP'),
    stampText: 'BƯỚC NGOẶT LỊCH SỬ',
    stampColor: 'red',
    points: [
      'Phát hiện địch đã tăng cường công sự kiên cố, phương án đánh nhanh không đảm bảo 100% phần thắng.',
      'Đại tướng Võ Nguyên Giáp trải qua 11 ngày đêm trăn trở, quyết định hoãn giờ nổ súng trước giờ G.',
      'Hạ lệnh lui quân về vị trí an toàn, kéo pháo ra để đào hầm ngầm kiên cố, chuẩn bị thế trận vây hãm dài ngày.'
    ],
    archivalDoc: {
      source: 'Mệnh lệnh lịch sử tại Sở Chỉ huy Mường Phăng',
      quote: 'Các đơn vị tạm đình chỉ nổ súng, lui về vị trí tập kết, kéo pháo ra để chuẩn bị thế trận chắc thắng.',
      date: 'Sáng 26/01/1954'
    },
    aiNarration: 'Giai đoạn quyết định then chốt: Sáng 26 tháng 1 năm 1954, Đại tướng đưa ra quyết định khó khăn nhất cuộc đời: Hoãn nổ súng, kéo pháo ra, chuyển sang Đánh chắc tiến chắc để bảo đảm toàn thắng.'
  },
  {
    id: 'stage-04',
    stepNumber: '04',
    code: '04 — TRIỂN KHAI',
    name: 'TRIỂN KHAI',
    timeMarker: '13/03 — 06/05/1954 (55 ngày đêm)',
    shortSummary: 'Chiến thuật "vây lấn bóc vỏ", đào giao thông hào siết chặt sân bay và tiêu diệt từng cụm cứ điểm.',
    image: getCuratedImage('CampaignCommandView__004__TACTICAL_BRIEFING_MAP'),
    stampText: 'TIẾN CÔNG 3 ĐỢT',
    stampColor: 'gold',
    points: [
      'Đợt 1 (13 - 17/3): Tiêu diệt cụm cứ điểm Him Lam, Độc Lập; xóa sổ hoàn toàn phân khu Bắc.',
      'Đợt 2 (30/3 - 30/4): Đào hàng trăm cây số chiến hào siết chặt lòng chảo, bóp nghẹt đường bay tiếp tế.',
      'Đợt 3 (01 - 06/5): Tổng kích các cứ điểm phía Đông, làm chủ đồi A1 và khép chặt vòng vây trung tâm.'
    ],
    archivalDoc: {
      source: 'Báo cáo tác chiến mặt trận Điện Biên Phủ',
      quote: 'Hệ thống chiến hào của ta như những sợi dây thừng khổng lồ siết chặt cổ địch tại thung lũng Mường Thanh.',
      date: 'Tháng 04/1954'
    },
    aiNarration: 'Giai đoạn triển khai: Trong 55 ngày đêm, quân ta kiên cường đào chiến hào vây lấn bóc vỏ, lần lượt san bằng các cứ điểm Him Lam, Độc Lập, đồi A1, dồn địch vào bước đường cùng.'
  },
  {
    id: 'stage-05',
    stepNumber: '05',
    code: '05 — KẾT QUẢ',
    name: 'KẾT QUẢ',
    timeMarker: '17h30 ngày 07/05/1954',
    shortSummary: 'Bắt sống tướng De Castries, tiêu diệt toàn bộ tập đoàn cứ điểm, làm nên chiến thắng lừng lẫy năm châu.',
    image: getCuratedImage('CampaignCommandView__005__GIAP_MUONG_PHANG_HQ'),
    stampText: 'TOÀN THẮNG • LỪNG LẪY',
    stampColor: 'green',
    points: [
      '17h30 ngày 07/05/1954: Lá cờ "Quyết chiến Quyết thắng" tung bay kiêu hãnh trên nóc hầm De Castries.',
      'Bắt sống toàn bộ Bộ Chỉ huy địch, xóa sổ và bắt sống 16.200 quân viễn chinh Pháp tại mặt trận.',
      'Đập tan kế hoạch Navarre, buộc Pháp ký Hiệp định Geneva, chấm dứt hoàn toàn ách thống trị thực dân.'
    ],
    archivalDoc: {
      source: 'Điện báo toàn thắng gửi Bác Hồ và Trung ương Đảng',
      quote: 'Mặt trận Điện Biên Phủ đã hoàn toàn giải phóng. Toàn bộ quân địch đã đầu hàng vô điều kiện.',
      date: '17h30 ngày 07/05/1954'
    },
    aiNarration: 'Giai đoạn kết quả: Chiều ngày 7 tháng 5 năm 1954, lá cờ Quyết chiến Quyết thắng tung bay trên hầm De Castries. Toàn bộ tập đoàn cứ điểm bị xóa sổ, kết thúc 56 ngày đêm chấn động địa cầu.'
  }
];

export const CampaignCommandView: React.FC<CampaignCommandViewProps> = ({
  isDark,
  onBackToHome,
}) => {
  const [selectedStage, setSelectedStage] = useState<CampaignBoardStage | null>(null);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(['stage-01']);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState<'board' | 'key-decision'>('board');

  // Cancel speech synthesis when unmounting or switching stages
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleOpenStage = (stage: CampaignBoardStage) => {
    // Hiệu ứng âm thanh tinh tế: tiếng lật giấy hồ sơ kết hợp tiếng đóng dấu lịch sử
    playPaperTurn();
    setTimeout(() => {
      playHistoricalStamp();
    }, 120);

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsAiSpeaking(false);
    setSelectedStage(stage);

    if (!completedStageIds.includes(stage.id)) {
      setCompletedStageIds((prev) => [...prev, stage.id]);
    }
  };

  const handleNextStage = () => {
    if (!selectedStage) return;
    const currentIndex = CAMPAIGN_STAGES.findIndex((s) => s.id === selectedStage.id);
    if (currentIndex < CAMPAIGN_STAGES.length - 1) {
      const nextStage = CAMPAIGN_STAGES[currentIndex + 1];
      handleOpenStage(nextStage);
    } else {
      // Completed all
      playHistoricalStamp();
      setTimeout(() => {
        playSuccessChime();
      }, 150);
      setSelectedStage(null);
    }
  };

  const handleToggleAiSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isAiSpeaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsAiSpeaking(true);
    }
  };

  return (
    <div 
      id="campaign-planning-board-view" 
      className="w-full max-w-6xl mx-auto space-y-8 pb-28 pt-2 px-2 sm:px-4"
    >
      {/* 1. TOP HEADER: BÀN CỜ CHIẾN DỊCH • ĐIỆN BIÊN PHỦ 1954 */}
      <section 
        className={`rounded-3xl border-2 p-6 sm:p-8 relative overflow-hidden transition-all shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-[#1b3323] via-[#16271e] to-[#0d1812] border-[#D4A017]/60 text-white' 
            : 'bg-gradient-to-br from-[#fbf5e8] via-[#f7ecd6] to-[#eddcc2] border-[#991b1b]/50 text-[#1b3323] shadow-xl'
        }`}
      >
        {/* Archival Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-amber-500/10 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 opacity-5 dark:opacity-10 pointer-events-none font-serif text-[180px] font-black select-none text-stone-900 dark:text-white">
          1954
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            {/* Classification Stamp / Badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#991b1b] text-white text-[11px] font-mono font-black uppercase tracking-widest shadow-md border border-yellow-300/40">
                <Shield className="w-3.5 h-3.5 text-yellow-300" />
                HỒ SƠ TÁC CHIẾN TỐI MẬT
              </span>
              <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-stone-900/10 dark:bg-black/40 border border-[#D4A017]/40 text-[#991b1b] dark:text-[#d4af37]">
                SỞ CHỈ HUY MƯỜNG PHĂNG • 1954
              </span>
              <span className="text-[11px] font-mono font-bold text-stone-600 dark:text-stone-300 hidden sm:inline">
                Tiến độ: {completedStageIds.length}/05 Chặng
              </span>
            </div>

            {/* Main Title according to prompt */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-serif uppercase text-[#991b1b] dark:text-[#fbbf24] drop-shadow-xs">
              BÀN CỜ CHIẾN DỊCH
            </h1>
            <p className="text-base sm:text-xl font-bold tracking-wide mt-1 text-[#1b3323] dark:text-emerald-100 font-serif">
              CHIẾN DỊCH ĐIỆN BIÊN PHỦ — 1954
            </p>
            <p className="text-xs sm:text-sm font-medium mt-2 text-stone-700 dark:text-stone-300 max-w-2xl leading-relaxed">
              Khám phá những quyết định làm thay đổi cục diện. Mỗi chặng là một bước ngoặt lịch sử mở ra thắng lợi chấn động địa cầu.
            </p>
          </div>

          {/* Quick Actions & Navigation Controls */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 flex-shrink-0">
            <button
              onClick={() => {
                playTrumpetSalute();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#b91c1c] hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg border border-yellow-300/40 cursor-pointer active:scale-95 transition-all"
            >
              <Flag className="w-4 h-4 text-yellow-300" />
              <span>Hiệu lệnh Toàn quân</span>
            </button>

            <button
              onClick={onBackToHome}
              className="px-3.5 py-2 rounded-xl bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 border border-stone-400/40 text-xs font-bold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
            >
              ← Về Trang chủ
            </button>
          </div>
        </div>
      </section>

      {/* 2. KHU VỰC BÀN CỜ 5 CHẶNG NHIỆM VỤ (CONNECTED CAMPAIGN PLANNING BOARD) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-300 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#991b1b] text-white flex items-center justify-center font-mono font-black text-xs shadow-md">
              05
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#1b3323] dark:text-white font-serif tracking-tight">
                5 CHẶNG TÁC CHIẾN THEN CHỐT
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                Chạm vào từng thẻ nhiệm vụ để mở hồ sơ tư liệu đã kiểm chứng
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
            <span>Đã mở:</span>
            <span className="text-[#991b1b] dark:text-[#d4af37] font-black">{completedStageIds.length}/5</span>
            <div className="w-24 h-2 bg-stone-300 dark:bg-stone-700 rounded-full overflow-hidden ml-1">
              <div 
                className="h-full bg-gradient-to-r from-[#991b1b] to-[#d4af37] transition-all duration-500"
                style={{ width: `${(completedStageIds.length / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Desktop Connected Progress Ribbon */}
        <div className="hidden lg:grid grid-cols-5 gap-4 relative py-2">
          {/* Subtle Connecting Background Line */}
          <div className="absolute top-[88px] left-12 right-12 h-1 bg-stone-300 dark:bg-stone-700/80 -z-0" />

          {CAMPAIGN_STAGES.map((stage, idx) => {
            const isCompleted = completedStageIds.includes(stage.id);
            const isSelected = selectedStage?.id === stage.id;
            const isTurnPoint = stage.id === 'stage-03';

            return (
              <div
                key={stage.id}
                onClick={() => handleOpenStage(stage)}
                className={`group relative flex flex-col justify-between rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden p-3.5 z-10 ${
                  isTurnPoint
                    ? isDark
                      ? 'bg-[#1e2e22] border-[#dc2626] shadow-xl shadow-red-950/30 ring-2 ring-red-500/40 hover:scale-[1.03]'
                      : 'bg-[#fffaf0] border-[#991b1b] shadow-xl ring-2 ring-red-500/20 hover:scale-[1.03]'
                    : isDark
                    ? 'bg-[#142318] hover:bg-[#1a2e20] border-stone-700 hover:border-[#d4af37] shadow-lg hover:scale-[1.02]'
                    : 'bg-[#fdfaf3] hover:bg-[#fbf4e4] border-stone-300 hover:border-[#991b1b] shadow-md hover:scale-[1.02]'
                }`}
              >
                {/* Top Badge: Code + Date Marker */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-black ${
                    isTurnPoint 
                      ? 'bg-[#991b1b] text-white' 
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                  }`}>
                    {stage.code}
                  </span>

                  {isCompleted && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]" title="Đã xem">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Archival Image */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black mb-3 border border-stone-300/40 dark:border-stone-700">
                  <img 
                    src={stage.image} 
                    alt={stage.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Stamp Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-amber-300 border border-amber-400/40">
                      {stage.stampText}
                    </span>
                  </div>
                </div>

                {/* Date marker */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#991b1b] dark:text-[#fbbf24] font-bold mb-1">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{stage.timeMarker}</span>
                </div>

                {/* Exactly 1 Short Sentence */}
                <p className="text-xs font-semibold text-stone-800 dark:text-stone-200 line-clamp-2 min-h-[32px] leading-snug">
                  {stage.shortSummary}
                </p>

                {/* Action button */}
                <div className="pt-3 mt-2 border-t border-stone-200 dark:border-stone-800/80 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-stone-500 dark:text-stone-400">
                    {stage.stepNumber} / 05
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-[#991b1b] dark:text-[#fbbf24] group-hover:translate-x-1 transition-transform">
                    <span>KHÁM PHÁ</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile & Tablet Vertical Connected Chain */}
        <div className="lg:hidden space-y-4 relative pl-5 before:absolute before:left-2.5 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#991b1b]/40 dark:before:bg-[#d4af37]/40">
          {CAMPAIGN_STAGES.map((stage) => {
            const isCompleted = completedStageIds.includes(stage.id);
            const isTurnPoint = stage.id === 'stage-03';

            return (
              <div 
                key={stage.id} 
                onClick={() => handleOpenStage(stage)}
                className={`relative rounded-2xl border-2 p-4 transition-all cursor-pointer shadow-md active:scale-[0.99] ${
                  isTurnPoint
                    ? isDark
                      ? 'bg-[#1e2e22] border-[#dc2626] ring-1 ring-red-500/50'
                      : 'bg-[#fffaf0] border-[#991b1b] ring-1 ring-red-500/30'
                    : isDark
                    ? 'bg-[#142318] border-stone-700'
                    : 'bg-[#fdfaf3] border-stone-300'
                }`}
              >
                {/* Node Dot on Timeline */}
                <div className={`absolute -left-[27px] top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-emerald-600 border-white text-white' 
                    : isTurnPoint 
                    ? 'bg-[#991b1b] border-yellow-300 text-white animate-pulse'
                    : 'bg-stone-300 dark:bg-stone-700 border-stone-500'
                }`}>
                  {isCompleted ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3.5 items-stretch">
                  <div className="w-full sm:w-40 h-32 rounded-xl overflow-hidden bg-black flex-shrink-0 relative border border-stone-300/40 dark:border-stone-700">
                    <img 
                      src={stage.image} 
                      alt={stage.name}
                      className="w-full h-full object-cover object-center" 
                    />
                    <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-amber-300 font-bold border border-amber-400/40">
                      {stage.stampText}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-black ${
                          isTurnPoint ? 'bg-[#991b1b] text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                        }`}>
                          {stage.code}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500 dark:text-stone-400 font-bold">
                          {stage.stepNumber} / 05
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-mono text-[#991b1b] dark:text-[#fbbf24] font-bold mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{stage.timeMarker}</span>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200 mt-1.5 leading-snug">
                        {stage.shortSummary}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end">
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-black text-[#991b1b] dark:text-[#fbbf24]">
                        <span>KHÁM PHÁ HỒ SƠ</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. KHU VỰC ĐẶC BIỆT NỔI BẬT: QUYẾT ĐỊNH THEN CHỐT (TURNING POINT) */}
      <section 
        id="key-decision-turning-point-section"
        className={`rounded-3xl border-2 p-6 sm:p-8 relative overflow-hidden transition-all shadow-2xl ${
          isDark 
            ? 'bg-gradient-to-br from-[#241a1a] via-[#1a211b] to-[#121a15] border-[#dc2626]/80 text-white' 
            : 'bg-gradient-to-br from-[#fffdf8] via-[#fff3f0] to-[#fae8e4] border-[#991b1b]/70 text-[#1b3323] shadow-xl'
        }`}
      >
        {/* Archival Red Seal */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-300 dark:border-stone-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#991b1b] text-white flex items-center justify-center font-black shadow-md border border-yellow-300/40">
              <Award className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-black tracking-widest uppercase text-[#991b1b] dark:text-[#f87171]">
                  ★ BƯỚC NGOẶT THAY ĐỔI CỤC DIỆN
                </span>
                <span className="px-2 py-0.5 rounded bg-red-600/10 text-red-700 dark:text-red-300 text-[10px] font-mono font-bold border border-red-500/30">
                  26/01/1954
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-serif text-[#991b1b] dark:text-white mt-0.5">
                QUYẾT ĐỊNH THEN CHỐT
              </h2>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-black/10 dark:bg-black/40 border border-[#D4A017]/40 text-xs font-mono font-bold text-[#991b1b] dark:text-[#d4af37]">
            Sở Chỉ huy Mường Phăng
          </div>
        </div>

        {/* Top Grid: General at HQ + Documented Historic Quote */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch mb-8">
          {/* Archival Photograph of General Giap at Command */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-black border-2 border-[#D4A017]/50 shadow-lg min-h-[240px]">
            <img 
              src={getCuratedImage('CampaignCommandView__006__DIEN_BIEN_FLAG_WIN')} 
              alt="Đại tướng Võ Nguyên Giáp tại Sở chỉ huy Mường Phăng Điện Biên Phủ"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = getCuratedImage('CampaignCommandView__007__TACTICAL_BRIEFING_MAP');
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-black block">
                ẢNH TƯ LIỆU GỐC
              </span>
              <p className="text-xs text-white font-medium line-clamp-2 mt-0.5">
                Lán tác chiến Đại tướng Võ Nguyên Giáp tại rừng Mường Phăng, tỉnh Điện Biên.
              </p>
            </div>
          </div>

          {/* Historic Quote & Core Mandate */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className={`p-4 sm:p-5 rounded-2xl border-l-4 border-[#991b1b] shadow-sm ${
              isDark ? 'bg-stone-900/80 border-stone-700' : 'bg-amber-50/90 border-amber-200'
            }`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#991b1b] dark:text-amber-400 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>LỜI NÓI LỊCH SỬ CỦA ĐẠI TƯỚNG VÕ NGUYÊN GIÁP:</span>
              </div>
              <blockquote className="text-sm sm:text-base font-serif italic text-stone-900 dark:text-stone-100 leading-relaxed font-vietnamese-quote">
                &ldquo;Đêm ngày 25 tháng 1, tôi không sao chợp mắt... Đánh nhanh thắng nhanh thì không nắm chắc thắng lợi 100%. Nếu đánh nhanh mà thất bại thì toàn bộ vốn liếng của cuộc kháng chiến sẽ tiêu tan. Vì vậy, tôi đã quyết định hoãn nổ súng và ra lệnh kéo pháo ra.&rdquo;
              </blockquote>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold block">
                  Thời gian trăn trở
                </span>
                <span className="text-base sm:text-lg font-black text-[#991b1b] dark:text-amber-400 font-mono">
                  11 Ngày Đêm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-stone-300 dark:border-stone-700">
                <span className="text-[11px] font-mono text-stone-500 dark:text-stone-400 font-bold block">
                  Nguyên tắc chỉ đạo
                </span>
                <span className="text-xs sm:text-sm font-black text-emerald-700 dark:text-emerald-400">
                  Chắc thắng mới đánh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SIMPLE BEFORE → DECISION → AFTER VISUAL FLOW (THE FLOW DEMANDED BY USER) */}
        <div>
          <div className="text-center mb-4">
            <span className="px-3 py-1 rounded-full bg-stone-200 dark:bg-stone-800 text-[11px] font-mono font-black tracking-widest text-[#991b1b] dark:text-[#fbbf24] uppercase border border-stone-300 dark:border-stone-700">
              TIẾN TRÌNH THAY ĐỔI CỤC DIỆN CHIẾN TRƯỜNG
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch relative">
            {/* Step 1: TRƯỚC (BEFORE) */}
            <div 
              onClick={() => {
                playPaperTurn();
              }}
              className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              isDark 
                ? 'bg-stone-900/90 border-amber-600/40 hover:border-amber-500 text-stone-200' 
                : 'bg-white border-amber-300 hover:border-amber-400 text-stone-800 shadow-sm'
            }`}>
              <div>
                <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-stone-200 dark:border-stone-800">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-mono font-black uppercase">
                    01. TRƯỚC (BEFORE)
                  </span>
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                </div>
                
                <h4 className="text-base font-black text-[#991b1b] dark:text-amber-400 font-serif mb-2">
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
              }}
              className={`rounded-2xl border-2 p-5 flex flex-col justify-between relative transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.99] ${
              isDark 
                ? 'bg-gradient-to-b from-[#2a1313] to-[#1c0f0f] border-[#dc2626] ring-2 ring-red-500/30 text-white' 
                : 'bg-gradient-to-b from-[#fff5f5] to-[#ffebeb] border-[#991b1b] ring-2 ring-red-500/20 text-stone-900 shadow-md'
            }`}>
              {/* Central Stamp */}
              <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#991b1b] text-white text-[10px] font-mono font-black uppercase tracking-wider shadow-sm border border-yellow-300/40">
                LỆNH KHẨN 26/01
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-red-300 dark:border-red-900/60">
                  <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-xs font-mono font-black uppercase shadow-xs">
                    02. QUYẾT ĐỊNH (DECISION)
                  </span>
                  <Flag className="w-4 h-4 text-yellow-400" />
                </div>

                <h4 className="text-base font-black text-[#991b1b] dark:text-red-400 font-serif mb-2">
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
                <span className="text-[11px] font-mono font-black text-[#991b1b] dark:text-yellow-400 block">
                  Bản lĩnh: Chịu trách nhiệm bảo toàn xương máu
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">🔴 Đóng dấu</span>
              </div>
            </div>

            {/* Step 3: SAU ĐÓ (AFTER) */}
            <div 
              onClick={() => {
                playHistoricalStamp();
              }}
              className={`rounded-2xl border-2 p-5 flex flex-col justify-between transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
              isDark 
                ? 'bg-stone-900/90 border-emerald-600/40 hover:border-emerald-500 text-stone-200' 
                : 'bg-white border-emerald-400 hover:border-emerald-500 text-stone-800 shadow-sm'
            }`}>
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
        </div>
      </section>

      {/* 5. CINEMATIC DETAIL PANEL / MODAL (KHI BẤM VÀO TỪNG THẺ) */}
      {selectedStage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedStage(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className={`w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 shadow-2xl p-5 sm:p-7 relative transition-all ${
              isDark 
                ? 'bg-[#142318] border-[#D4A017]/80 text-white shadow-black' 
                : 'bg-[#fffcf7] border-[#991b1b] text-stone-900 shadow-2xl'
            }`}
          >
            {/* Top Bar: Progress, Stamp & Close */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-300 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-md bg-[#991b1b] text-white text-xs font-mono font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-yellow-300/40">
                  <Shield className="w-3.5 h-3.5 text-yellow-300" />
                  HỒ SƠ {selectedStage.stepNumber} / 05
                </span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-stone-200 dark:bg-stone-800 text-[#991b1b] dark:text-[#fbbf24] border border-stone-300 dark:border-stone-700">
                  {selectedStage.stampText}
                </span>
              </div>

              <button
                onClick={() => setSelectedStage(null)}
                className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Đóng hồ sơ"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4">
              {/* Large Historical Photograph */}
              <div className="relative aspect-video max-h-64 sm:max-h-72 w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-stone-300/50 dark:border-stone-700 group">
                <img 
                  src={selectedStage.image} 
                  alt={selectedStage.name} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded border border-amber-400/40">
                    {selectedStage.timeMarker}
                  </span>
                  <span className="text-[11px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded">
                    Tư liệu lưu trữ Quốc gia
                  </span>
                </div>
              </div>

              {/* Short Title & 1 Short Sentence */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black font-serif text-[#991b1b] dark:text-[#fbbf24] leading-tight">
                  CHẶNG {selectedStage.code}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300 mt-1 leading-relaxed">
                  {selectedStage.shortSummary}
                </p>
              </div>

              {/* 2-4 Concise Factual Points (NO theory jargon) */}
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-stone-900/70 border-stone-700' : 'bg-stone-100/80 border-stone-300'
              }`}>
                <span className="text-xs font-mono font-bold text-[#991b1b] dark:text-amber-400 uppercase tracking-wider block mb-2">
                  DỮ LIỆU SỰ THỰC LỊCH SỬ CHÍNH XÁC:
                </span>
                <ul className="space-y-2 text-xs sm:text-sm font-medium leading-relaxed">
                  {selectedStage.points.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#991b1b]/15 text-[#991b1b] dark:bg-amber-400/20 dark:text-amber-300 text-xs font-mono font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span className="text-stone-800 dark:text-stone-200">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Optional Archival Document Snippet */}
              {selectedStage.archivalDoc && (
                <div className={`p-4 rounded-2xl border-l-4 border-[#991b1b] text-xs sm:text-sm ${
                  isDark ? 'bg-stone-900/90 border-stone-700 text-amber-100' : 'bg-amber-50 border-amber-300 text-stone-800'
                }`}>
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#991b1b] dark:text-amber-400 mb-1">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{selectedStage.archivalDoc.source}</span>
                    </div>
                    <span>{selectedStage.archivalDoc.date}</span>
                  </div>
                  <p className="font-vietnamese-quote italic leading-relaxed">
                    &ldquo;{selectedStage.archivalDoc.quote}&rdquo;
                  </p>
                </div>
              )}

              {/* Short AI Narration Button */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-emerald-950/40 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAiSpeaking ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-700 text-white'
                  }`}>
                    <Volume2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 block">
                      Giọng đọc tóm lược tư liệu
                    </span>
                    <span className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1">
                      {selectedStage.aiNarration}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAiSpeech(selectedStage.aiNarration)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    isAiSpeaking 
                      ? 'bg-amber-600 text-white animate-pulse' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isAiSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  <span>{isAiSpeaking ? 'Dừng đọc' : 'Phát thuyết minh'}</span>
                </button>
              </div>
            </div>

            {/* Modal Actions Footer: Đóng & TIẾP TỤC SANG CHẶNG TIẾP THEO */}
            <div className="mt-6 pt-4 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedStage(null)}
                className="px-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Đóng hồ sơ
              </button>

              <button
                onClick={handleNextStage}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#991b1b] to-[#b91c1c] hover:brightness-110 text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-lg shadow-red-950/30 border border-yellow-300/40 active:scale-95 transition-all cursor-pointer"
              >
                <span>
                  {selectedStage.id === 'stage-05' ? 'Hoàn thành bàn cờ chiến dịch' : 'Tiếp tục sang chặng tiếp theo'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
