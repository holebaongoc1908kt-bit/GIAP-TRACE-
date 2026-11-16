import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  RotateCcw,
  Compass,
  MapPin,
  Flame,
  Award,
  ArrowLeft,
  Undo2
} from 'lucide-react';
import { NavTab } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playRadarPing, playCabinetClick } from '../utils/soundEffects';
import { recordBrowsingHistory } from '../utils/browsingHistory';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface JourneyMilestone {
  id: string;
  name: string;
  year: string;
  timeLabel: string;
  site: string;
  significance: string;
  image: string;
  milestoneId: string;
  // SVG canvas coordinates (0 to 1000, 0 to 620)
  x: number;
  y: number;
  textSide: 'left' | 'right';
  badgeColor: string;
}

const HISTORICAL_FLOW_MILESTONES: JourneyMilestone[] = [
  {
    id: 'caobang-1944',
    name: 'Cao Bằng',
    year: '1944',
    timeLabel: '22/12/1944',
    site: 'Rừng Trần Hưng Đạo',
    significance: 'Nơi khai sinh 34 chiến sĩ đầu tiên của Đội Việt Nam Tuyên truyền Giải phóng quân, khởi đầu trang sử bách chiến bách thắng của Quân đội nhân dân Việt Nam.',
    image: getCuratedImage('MapView__001__VIETNAM_PEOPLES_ARMY'),
    milestoneId: 'm2',
    x: 410,
    y: 65,
    textSide: 'left',
    badgeColor: '#EF4444',
  },
  {
    id: 'vietbac-1947',
    name: 'Việt Bắc',
    year: '1947',
    timeLabel: '1947 – 1954',
    site: 'Căn cứ ATK Định Hóa',
    significance: 'Thủ đô kháng chiến "Rừng che bộ đội, rừng vây quân thù", căn cứ địa bảo vệ an toàn cơ quan đầu não cách mạng qua muôn trùng bão lửa.',
    image: getCuratedImage('MapView__002__GIAP_WITH_UNCLE_HO'),
    milestoneId: 'm3',
    x: 630,
    y: 155,
    textSide: 'right',
    badgeColor: '#F59E0B',
  },
  {
    id: 'dienbienphu-1954',
    name: 'Điện Biên Phủ',
    year: '1954',
    timeLabel: '07/05/1954',
    site: 'Sở chỉ huy Mường Phăng',
    significance: 'Nơi ghi dấu bước ngoặt lịch sử "Lừng lẫy năm châu, chấn động địa cầu" với quyết định lịch sử chuyển sang "Đánh chắc tiến chắc".',
    image: getCuratedImage('MapView__003__DIEN_BIEN_FLAG_WIN'),
    milestoneId: 'm4',
    x: 270,
    y: 250,
    textSide: 'left',
    badgeColor: '#DC2626',
  },
  {
    id: 'hanoi-1954',
    name: 'Hà Nội',
    year: '1954 – 1972',
    timeLabel: '1954 – 1975',
    site: 'Tổng hành dinh Hầm D67',
    significance: 'Đầu não chỉ huy tác chiến chiến lược, nơi Đại tướng cùng Quân ủy Trung ương chỉ đạo đánh thắng không quân Mỹ và các chiến dịch lớn.',
    image: getCuratedImage('MapView__004__D67_BUNKER_COMMAND'),
    milestoneId: 'm5',
    x: 680,
    y: 345,
    textSide: 'right',
    badgeColor: '#EA580C',
  },
  {
    id: 'miennam-1975',
    name: 'Trường Sơn',
    year: '1975',
    timeLabel: 'Mùa xuân 1975',
    site: 'Tuyến chi viện Trường Sơn',
    significance: 'Tuyến chi viện chiến lược huyền thoại và bức mật lệnh lịch sử: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; chắc thắng".',
    image: getCuratedImage('MapView__005__MUSEUM_TANK_HALL'),
    milestoneId: 'm5',
    x: 340,
    y: 435,
    textSide: 'left',
    badgeColor: '#E11D48',
  },
  {
    id: 'tphcm-1975',
    name: 'TP. Hồ Chí Minh',
    year: '1975',
    timeLabel: '30/04/1975',
    site: 'Dinh Độc Lập',
    significance: 'Giờ phút toàn thắng trưa ngày 30/4/1975, cờ giải phóng tung bay trên Dinh Độc Lập, non sông nối liền một dải độc lập tự do.',
    image: getCuratedImage('MapView__006__TACTICAL_BRIEFING_MAP'),
    milestoneId: 'm5',
    x: 660,
    y: 520,
    textSide: 'right',
    badgeColor: '#EAB308',
  },
  {
    id: 'quangbinh-2013',
    name: 'Quảng Bình',
    year: '2013',
    timeLabel: '13/10/2013',
    site: 'Vũng Chùa – Đảo Yến',
    significance: 'Vị Đại tướng của lòng dân trở về yên nghỉ vĩnh hằng giữa vòng tay non sông đất mẹ và niềm tiếc thương vô hạn của toàn thể nhân dân.',
    image: getCuratedImage('MapView__007__GIAP_ANCESTRAL_ALTAR'),
    milestoneId: 'm6',
    x: 420,
    y: 590,
    textSide: 'left',
    badgeColor: '#10B981',
  },
];

// Helper to compute a smooth cubic bezier SVG curve through arbitrary points
function getSmoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 5;
    const cp1y = p1.y + (p2.y - p0.y) / 5;
    const cp2x = p2.x - (p3.x - p1.x) / 5;
    const cp2y = p2.y - (p3.y - p1.y) / 5;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

interface MapViewProps {
  isDark: boolean;
  onSelectMilestone?: (milestoneId: string) => void;
  onNavigateToTab?: (tab: NavTab) => void;
  onBackToPrevious?: () => void;
  previousTabName?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  isDark,
  onNavigateToTab,
  onSelectMilestone,
  onBackToPrevious,
  previousTabName = 'Hành trình',
}) => {
  // Start on milestone index 2: Điện Biên Phủ (1954)
  const [activeIndex, setActiveIndex] = useState<number>(2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const activeMilestone = HISTORICAL_FLOW_MILESTONES[activeIndex];

  // Record browsing history when active milestone changes
  useEffect(() => {
    if (activeMilestone) {
      recordBrowsingHistory({
        type: 'map_location',
        itemId: activeMilestone.id,
        title: `${activeMilestone.name} (${activeMilestone.year})`,
        subtitle: activeMilestone.site,
        category: 'Dòng chảy lịch sử',
        tags: [activeMilestone.name, activeMilestone.year, 'Dòng chảy không gian', 'Bảo tàng số'],
        image: activeMilestone.image,
      });
    }
  }, [activeIndex, activeMilestone]);

  // Handle Autoplay progression
  useEffect(() => {
    if (isPlaying) {
      autoPlayTimerRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          playRadarPing();
          if (prev >= HISTORICAL_FLOW_MILESTONES.length - 1) {
            return 0; // Loop back
          }
          return prev + 1;
        });
      }, 4500);
    } else if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [isPlaying]);

  const handleSelectIndex = (idx: number) => {
    if (idx < 0 || idx >= HISTORICAL_FLOW_MILESTONES.length) return;
    playRadarPing();
    setActiveIndex(idx);
  };

  const handleNext = () => {
    if (activeIndex < HISTORICAL_FLOW_MILESTONES.length - 1) {
      handleSelectIndex(activeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      handleSelectIndex(activeIndex - 1);
    }
  };

  // Full path coordinates
  const fullPathData = getSmoothPath(HISTORICAL_FLOW_MILESTONES);
  // Active glowing path up to active milestone
  const activePathData = getSmoothPath(HISTORICAL_FLOW_MILESTONES.slice(0, activeIndex + 1));

  return (
    <div id="historical-flow-container" className="space-y-6 pb-28 pt-2 max-w-5xl mx-auto px-2 sm:px-4">
      {/* 0. PROMINENT BACK BUTTON TO PREVIOUS TAB (HÀNH TRÌNH / DẤU MỐC) */}
      <div className="flex items-center justify-between gap-3">
        <button
          id="btn-back-to-journey"
          onClick={() => {
            playCabinetClick();
            if (onBackToPrevious) {
              onBackToPrevious();
            } else if (onNavigateToTab) {
              onNavigateToTab('timeline');
            }
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] hover:from-red-600 hover:to-red-700 text-white font-serif font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-red-950/40 border-2 border-yellow-300 hover:scale-105 active:scale-95 transition-all cursor-pointer ring-4 ring-red-500/20"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>QUAY LẠI {previousTabName.toUpperCase()}</span>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-stone-500 dark:text-stone-400 font-bold">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          <span>Bản đồ số hóa toàn cảnh 7 tọa độ</span>
        </span>
      </div>

      {/* 1. Header: Chữ to rõ, màu sắc bắt mắt, hào hùng */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b-2 border-[#D4AF37]/30">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs sm:text-sm font-extrabold tracking-wide uppercase bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-md">
              <Flame className="w-4 h-4 text-yellow-300 animate-bounce" />
              Dòng chảy qua không gian
            </span>
            <span className="px-3 py-0.5 rounded-full text-xs sm:text-sm font-mono font-bold bg-[#F59E0B]/20 text-[#D97706] dark:text-yellow-300 border border-[#F59E0B]/40">
              Mốc {activeIndex + 1} / {HISTORICAL_FLOW_MILESTONES.length}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#0F2417] dark:text-[#F3F4F6] font-serif">
            BẢO TÀNG SỐ & DI TÍCH LỊCH SỬ QUÂN SỰ
          </h2>
          <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium mt-1">
            Hành trình xuyên qua không gian và thời gian theo dấu chân Đại tướng Võ Nguyên Giáp.
          </p>
        </div>

        {/* Action Controls: Chữ to rõ, nút bấm nổi bật */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-shrink-0">
          <button
            id="btn-toggle-autoplay-flow"
            onClick={() => {
              playRadarPing();
              setIsPlaying(!isPlaying);
            }}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 transition-all cursor-pointer shadow-md ${
              isPlaying
                ? 'bg-[#DC2626] text-white ring-4 ring-red-400/40 animate-pulse'
                : isDark
                ? 'bg-gradient-to-r from-[#1A3824] to-[#122618] hover:from-[#244E32] hover:to-[#1A3824] text-yellow-300 border-2 border-[#D4AF37]/50'
                : 'bg-gradient-to-r from-amber-100 to-amber-200 hover:from-amber-200 hover:to-amber-300 text-[#162E20] border-2 border-amber-400/60 shadow-sm'
            }`}
            title={isPlaying ? 'Tạm dừng tự động' : 'Bật tự động chuyển mốc'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isPlaying ? 'Tạm dừng' : 'Tự động chạy'}</span>
          </button>

          <button
            onClick={() => handleSelectIndex(0)}
            className="p-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white transition-all cursor-pointer border-2 border-stone-300 dark:border-stone-700 hover:border-[#D4AF37]"
            title="Quay về mốc đầu tiên (1944)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Main Visual Stage: The Flowing Historical River (Màu sắc bắt mắt, chữ to rõ) */}
      <div 
        className={`relative w-full rounded-3xl overflow-hidden border-2 transition-all shadow-2xl ${
          isDark
            ? 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#1E293B] border-[#D4A017]/40'
            : 'bg-gradient-to-b from-[#FFFDF8] via-[#FFF8EC] to-[#FFF3D6] border-[#D4A017]/50 shadow-xl'
        }`}
      >
        {/* Dynamic Warm Ambient Light that follows the active milestone */}
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-700" 
          style={{
            backgroundImage: `radial-gradient(circle at ${activeMilestone.x / 10}% ${activeMilestone.y / 6.2}%, rgba(245, 158, 11, 0.35) 0%, rgba(220, 38, 38, 0.15) 30%, transparent 65%)`
          }}
        />

        {/* Vintage Topography Grid Accent */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Compass Rose Watermark */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex flex-col items-center pointer-events-none opacity-40">
          <Compass className="w-8 h-8 sm:w-10 sm:h-10 text-[#D4AF37]" />
          <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D4AF37] font-black mt-1">BẮC • NAM</span>
        </div>

        {/* River Stage Canvas SVG */}
        <div className="relative w-full h-[460px] sm:h-[540px] md:h-[580px]">
          <svg
            viewBox="0 0 1000 620"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full select-none"
          >
            <defs>
              {/* Vibrant Multi-Stop Gradient for Glowing River */}
              <linearGradient id="vibrantRiverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="60%" stopColor="#EF4444" />
                <stop offset="85%" stopColor="#DC2626" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>

              {/* Strong Drop Shadow Glow Filter */}
              <filter id="strongGoldGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* 1. Base Stream Path (Faded Track of Vietnamese History) */}
            <path
              d={fullPathData}
              fill="none"
              stroke={isDark ? '#1C3825' : '#D1C4AD'}
              strokeWidth="5"
              strokeDasharray="8 8"
              className="opacity-70 transition-all duration-500"
            />

            {/* 2. Active Glowing River: Outer Ambient Glow Layer */}
            <path
              d={activePathData}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="14"
              strokeLinecap="round"
              className="opacity-35 transition-all duration-700 ease-out"
              filter="url(#strongGoldGlow)"
            />

            {/* 3. Active Glowing River: Main Vibrant Radiant Beam */}
            <path
              d={activePathData}
              fill="none"
              stroke="url(#vibrantRiverGrad)"
              strokeWidth="7"
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />

            {/* 4. Active Glowing River: Bright Golden Core Centerline */}
            <path
              d={activePathData}
              fill="none"
              stroke="#FFFBEB"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-90 transition-all duration-700 ease-out"
            />

            {/* 5. Milestone Waypoints & Large Readable Badges on Path */}
            {HISTORICAL_FLOW_MILESTONES.map((m, idx) => {
              const isPast = idx < activeIndex;
              const isActive = idx === activeIndex;
              const isFuture = idx > activeIndex;

              return (
                <g 
                  key={m.id}
                  onClick={() => handleSelectIndex(idx)}
                  className="cursor-pointer group"
                >
                  {/* Expanding Pulsing Wave for Active Milestone */}
                  {isActive && (
                    <>
                      <circle
                        cx={m.x}
                        cy={m.y}
                        r="28"
                        fill="none"
                        stroke="#EF4444"
                        strokeWidth="2.5"
                        className="animate-ping opacity-75 pointer-events-none"
                      />
                      <circle
                        cx={m.x}
                        cy={m.y}
                        r="18"
                        fill="#FEF08A"
                        className="opacity-30 animate-pulse pointer-events-none"
                      />
                    </>
                  )}

                  {/* Waypoint Outer Circle */}
                  <circle
                    cx={m.x}
                    cy={m.y}
                    r={isActive ? '16' : isPast ? '10' : '7'}
                    fill={
                      isActive
                        ? '#DC2626'
                        : isPast
                        ? '#D97706'
                        : isDark
                        ? '#173322'
                        : '#C4B9A7'
                    }
                    stroke={
                      isActive
                        ? '#FFFFFF'
                        : isPast
                        ? '#FEF08A'
                        : isDark
                        ? '#2E5A3C'
                        : '#AFA390'
                    }
                    strokeWidth={isActive ? '3.5' : '2'}
                    className="transition-all duration-300 group-hover:scale-125"
                  />

                  {/* Core Star / Gold Dot */}
                  {isActive ? (
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="6"
                      fill="#FFF"
                      className="animate-pulse"
                    />
                  ) : isPast ? (
                    <circle
                      cx={m.x}
                      cy={m.y}
                      r="3.5"
                      fill="#FFF"
                    />
                  ) : null}

                  {/* Large, Beautiful, Readable Location Label Plaque */}
                  {(!isFuture || isActive) && (
                    <g
                      transform={`translate(${m.textSide === 'left' ? m.x - 22 : m.x + 22}, ${m.y})`}
                      className="transition-all duration-500"
                    >
                      {/* Background Plaque for Crystal Clear Readability */}
                      <rect
                        x={m.textSide === 'left' ? -150 : 0}
                        y="-26"
                        width="150"
                        height="52"
                        rx="12"
                        fill={
                          isActive
                            ? isDark ? 'rgba(15, 36, 23, 0.95)' : 'rgba(255, 255, 255, 0.98)'
                            : isDark ? 'rgba(11, 23, 16, 0.85)' : 'rgba(255, 255, 255, 0.9)'
                        }
                        stroke={
                          isActive
                            ? '#DC2626'
                            : isPast
                            ? '#D97706'
                            : 'rgba(180, 160, 130, 0.4)'
                        }
                        strokeWidth={isActive ? '2.5' : '1.5'}
                        filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25))"
                        className="transition-all duration-300"
                      />

                      {/* Location Name: BOLD, LARGE, EYE-CATCHING */}
                      <text
                        x={m.textSide === 'left' ? -12 : 12}
                        y="-4"
                        textAnchor={m.textSide === 'left' ? 'end' : 'start'}
                        className={`text-[17px] sm:text-[19px] font-black tracking-wide select-none font-serif transition-colors ${
                          isActive
                            ? 'fill-[#DC2626] dark:fill-[#FBBF24]'
                            : isPast
                            ? 'fill-stone-900 dark:fill-stone-100'
                            : 'fill-stone-500 dark:fill-stone-400'
                        }`}
                      >
                        {m.name.toUpperCase()}
                      </text>

                      {/* Year: BOLD, MONO, CRISP */}
                      <text
                        x={m.textSide === 'left' ? -12 : 12}
                        y="16"
                        textAnchor={m.textSide === 'left' ? 'end' : 'start'}
                        className={`text-[13px] sm:text-[14px] font-mono font-black select-none ${
                          isActive
                            ? 'fill-[#B91C1C] dark:fill-white'
                            : 'fill-stone-600 dark:fill-stone-300'
                        }`}
                      >
                        NĂM {m.year}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 3. The Compact Information Card: Chữ to rõ, màu sắc bắt mắt, KHÔNG CÓ NÚT DÒNG THỜI GIAN */}
          <div 
            id="flow-compact-card"
            className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-30 transition-all duration-400 ease-out"
          >
            <div 
              className={`rounded-2xl p-4 sm:p-5 shadow-2xl border-2 backdrop-blur-xl transition-all ${
                isDark
                  ? 'museum-card-dark text-[#F8FAFC]'
                  : 'museum-card-light text-[#0F172A]'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Historical Photo Thumbnail with Gilded Gold Frame */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#D4AF37] bg-black/60 shadow-lg relative group">
                  <img
                    src={activeMilestone.image}
                    alt={activeMilestone.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getCuratedImage('MapView__008__PORTRAIT_GENERAL');
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-1 left-1 right-1 text-center text-[10px] sm:text-xs font-mono text-yellow-300 font-extrabold px-1 py-0.5 rounded bg-black/75">
                    {activeMilestone.year}
                  </span>
                </div>

                {/* Content: Chữ to hơn, rõ ràng, màu sắc nổi bật */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <span className="text-xs sm:text-sm font-mono font-extrabold uppercase tracking-wide text-[#DC2626] dark:text-[#FBBF24]">
                      {activeMilestone.site}
                    </span>
                    <span className="text-xs font-mono font-bold text-stone-500 dark:text-stone-400">
                      {activeMilestone.timeLabel}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black tracking-wide text-[#0F2417] dark:text-white uppercase font-serif mt-0.5">
                    {activeMilestone.name}
                  </h3>

                  {/* Single Short Significance Sentence: Chữ to rõ, dễ đọc */}
                  <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 mt-1.5 leading-relaxed font-medium">
                    {activeMilestone.significance}
                  </p>
                </div>
              </div>

              {/* Navigation Controls: Rõ ràng, kèm nút Quay lại Hành trình trực tiếp */}
              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrev}
                    disabled={activeIndex === 0}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeIndex === 0
                        ? 'opacity-30 cursor-not-allowed text-stone-400 border border-stone-300 dark:border-stone-700'
                        : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-600'
                    }`}
                    title="Mốc trước"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Mốc trước</span>
                  </button>

                  <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-black text-[#DC2626] dark:text-yellow-400">
                    <span>MỐC {activeIndex + 1}</span>
                    <span className="text-stone-400">/</span>
                    <span className="text-stone-500 dark:text-stone-400">{HISTORICAL_FLOW_MILESTONES.length}</span>
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={activeIndex === HISTORICAL_FLOW_MILESTONES.length - 1}
                    className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeIndex === HISTORICAL_FLOW_MILESTONES.length - 1
                        ? 'opacity-30 cursor-not-allowed text-stone-400 border border-stone-300 dark:border-stone-700'
                        : 'bg-[#DC2626] hover:bg-red-700 text-white shadow-md'
                    }`}
                    title="Mốc kế tiếp"
                  >
                    <span>Mốc sau</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Nút to quay về hành trình / bài đang đọc ngay trên card */}
                <button
                  onClick={() => {
                    playCabinetClick();
                    if (onBackToPrevious) {
                      onBackToPrevious();
                    } else if (onNavigateToTab) {
                      onNavigateToTab('timeline');
                    }
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-yellow-300 dark:text-yellow-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-yellow-400/40 shadow-md active:scale-98 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Quay lại {previousTabName} đang đọc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Scrubber / Slider: "← KÉO ĐỂ KHÁM PHÁ →" (Chữ to, rõ ràng) */}
      <div 
        id="historical-flow-scrubber"
        className={`p-4 sm:p-6 rounded-2xl border-2 transition-all shadow-md ${
          isDark
            ? 'museum-card-dark text-[#F8FAFC]'
            : 'museum-card-light text-[#0F172A]'
        }`}
      >
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-stone-700 dark:text-stone-300 flex items-center gap-2">
            <span className="text-[#DC2626] text-base font-black">←</span>
            <span>KÉO ĐỂ KHÁM PHÁ DÒNG CHẢY LỊCH SỬ</span>
            <span className="text-[#DC2626] text-base font-black">→</span>
          </span>
          <span className="text-sm sm:text-base font-mono font-black px-3 py-1 rounded-lg bg-amber-500/20 text-[#DC2626] dark:text-yellow-300 border border-amber-500/40">
            Năm {activeMilestone.year}
          </span>
        </div>

        {/* Range Slider Track */}
        <div className="relative py-2">
          <input
            id="flow-journey-slider"
            type="range"
            min={0}
            max={HISTORICAL_FLOW_MILESTONES.length - 1}
            step={1}
            value={activeIndex}
            onChange={(e) => handleSelectIndex(parseInt(e.target.value, 10))}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-[#DC2626] bg-stone-300 dark:bg-stone-700"
          />

          {/* Milestone Step Buttons / Ticks under slider (Chữ to rõ, màu sắc tươi sáng) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mt-3 text-center">
            {HISTORICAL_FLOW_MILESTONES.map((item, idx) => {
              const isSelected = idx === activeIndex;
              const isReached = idx <= activeIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectIndex(idx)}
                  className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#DC2626]/20 to-[#DC2626]/35 border-2 border-[#DC2626] scale-105 shadow-md'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-800/70 border border-transparent'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full mb-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#DC2626] ring-4 ring-red-400/50 scale-125'
                        : isReached
                        ? 'bg-[#D97706]'
                        : 'bg-stone-300 dark:bg-stone-700'
                    }`}
                  />
                  <span
                    className={`text-xs sm:text-sm font-mono font-black transition-colors truncate max-w-full ${
                      isSelected
                        ? 'text-[#DC2626] dark:text-yellow-300 font-extrabold'
                        : isReached
                        ? 'text-stone-800 dark:text-stone-200'
                        : 'text-stone-400 dark:text-stone-600'
                    }`}
                  >
                    {item.year.split('–')[0].trim()}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-bold hidden sm:block truncate max-w-full ${
                      isSelected
                        ? 'text-[#0F2417] dark:text-white font-black'
                        : 'text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
