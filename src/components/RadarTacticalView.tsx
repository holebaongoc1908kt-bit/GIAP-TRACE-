import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Radar, 
  Crosshair, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Radio, 
  Clock, 
  Repeat, 
  Sparkles,
  TreePine,
  Shield,
  Truck,
  Anchor,
  Compass,
  Building,
  Flag,
  X,
  ExternalLink,
  Mic,
  Box,
  Map as MapIcon,
  Search,
  Eye,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Image as ImageIcon,
  MapPin,
  Settings,
  Flame,
  HelpCircle,
  FileText,
  Sun,
  ShieldAlert,
  Sliders,
  ChevronUp,
  Mountain,
  ZoomIn
} from 'lucide-react';
import { NavTab } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { 
  playRadarPing, 
  playTelegraphBeep, 
  playRadioStatic, 
  playVictoryFanfare, 
  playCabinetClick,
  playPaperTurn,
  playHistoricalStamp
} from '../utils/soundEffects';
import { 
  DIEN_BIEN_PHU_POIS, 
  RadarAudioSettings, 
  DEFAULT_AUDIO_SETTINGS, 
  AUDIO_SETTINGS_KEY,
  normalizeVietnameseForSpeech
} from '../data/radarBattlefieldData';
import { 
  RadarPOI, 
  RadarViewMode, 
  CameraPreset, 
  TacticalLayers,
  VisualRenderMode,
  GalleryItem 
} from '../types/radar3d';
import { Radar3DScene } from './radar/Radar3DScene';
import { RadarAudioSettingsModal } from './radar/RadarAudioSettingsModal';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

export type RadarId = 
  | '01_dien_bien' 
  | '02_viet_bac' 
  | '03_bien_gioi' 
  | '04_truong_son' 
  | '05_xuan_1975' 
  | '06_truong_sa';

export interface NarrationStep {
  timeSec: number;
  durationSec: number;
  text: string;
  tacticalAction: string;
  focusPoiId?: string;
  cameraPreset?: CameraPreset;
}

export interface RadarConfig {
  id: RadarId;
  code: string;
  title: string;
  year: string;
  theme: string;
  narrationSteps: NarrationStep[];
  conclusionQuote: string;
}

const RADAR_CONFIGS: Record<RadarId, RadarConfig> = {
  '01_dien_bien': {
    id: '01_dien_bien',
    code: '01',
    title: 'RADAR ĐIỆN BIÊN PHỦ',
    year: '1954',
    theme: 'Quyết định làm thay đổi cục diện chiến dịch',
    narrationSteps: [
      { 
        timeSec: 0, 
        durationSec: 4.0, 
        text: 'Tháng một năm một nghìn chín trăm năm mươi tư, Chiến dịch Điện Biên Phủ bước vào thời khắc quyết định.', 
        tacticalAction: 'KHÓA MỤC TIÊU LÒNG CHẢO ĐIỆN BIÊN PHỦ',
        cameraPreset: 'overview'
      },
      { 
        timeSec: 4.0, 
        durationSec: 4.5, 
        text: 'Trước trận địa kiên cố của tập đoàn cứ điểm Pháp gồm cụm cứ điểm Him Lam, Độc Lập và phân khu trung tâm,', 
        tacticalAction: 'NHẬN DIỆN HỆ THỐNG CỨ ĐIỂM BẮC & TRUNG TÂM',
        focusPoiId: 'him_lam'
      },
      { 
        timeSec: 8.5, 
        durationSec: 5.5, 
        text: 'Tại Sở chỉ huy Mường Phăng, Đại tướng Võ Nguyên Giáp phải đưa ra quyết định khó khăn nhất trong cuộc đời chỉ huy.', 
        tacticalAction: 'KẾT NỐI TỔNG HÀNH DINH MƯỜNG PHĂNG',
        focusPoiId: 'muong_phang'
      },
      { 
        timeSec: 14.0, 
        durationSec: 5.0, 
        text: 'Đó là chuyển đổi phương châm tác chiến, từ "Đánh nhanh, thắng nhanh" sang "Đánh chắc, tiến chắc", kéo pháo ra chuẩn bị trận địa vững chắc.', 
        tacticalAction: 'BƯỚC NGOẶT CHIẾN DỊCH: ĐÁNH NHANH → ĐÁNH CHẮC',
        cameraPreset: 'cinematic'
      },
      { 
        timeSec: 19.0, 
        durationSec: 5.5, 
        text: 'Trải qua năm mươi sáu ngày đêm khoét núi, ngủ hầm, đồi A1 và các cứ điểm then chốt lần lượt bị tiêu diệt.', 
        tacticalAction: 'TỔNG CÔNG KÍCH TỬ HUYỆT ĐỒI A1',
        focusPoiId: 'doi_a1'
      },
      { 
        timeSec: 24.5, 
        durationSec: 6.0, 
        text: 'Mười bảy giờ ba mươi phút ngày mùng bảy tháng năm, cờ Quyết chiến Quyết thắng tung bay trên nóc hầm Đờ Cát, toàn thắng về ta.', 
        tacticalAction: 'GIẢI PHÓNG HOÀN TOÀN HẦM ĐỜ CÁT',
        focusPoiId: 'ham_de_castries'
      }
    ],
    conclusionQuote: '“Đôi khi, thay đổi cách đánh cũng chính là thay đổi cách nhìn về chiến thắng.”'
  },
  '02_viet_bac': {
    id: '02_viet_bac',
    code: '02',
    title: 'RADAR VIỆT BẮC',
    year: '1947',
    theme: 'Từ những ngày đầu xây dựng lực lượng',
    narrationSteps: [
      { timeSec: 0, durationSec: 4.0, text: 'Năm một nghìn chín trăm bốn mươi bảy, căn cứ địa đầu não Việt Bắc đứng trước hai gọng kìm tấn công nguy hiểm của thực dân Pháp.', tacticalAction: 'CĂN CỨ ĐỊA ĐẦU NÃO RỪNG NÚI' },
      { timeSec: 4.0, durationSec: 5.0, text: 'Đại tướng Võ Nguyên Giáp chỉ đạo bẻ gãy gọng kìm Sông Lô và Đường số bốn, bảo vệ tuyệt đối an toàn Trung ương Đảng và Bác Hồ.', tacticalAction: 'BẺ GÃY HAI GỌNG KÌM SÔNG LÔ & ĐƯỜNG 4' },
      { timeSec: 9.0, durationSec: 5.0, text: 'Việt Bắc Thu Đông toàn thắng, khẳng định sự trưởng thành vượt bậc của Quân đội nhân dân Việt Nam.', tacticalAction: 'VIỆT BẮC MỒ CHÔN GIẶC PHÁP' }
    ],
    conclusionQuote: '“Việt Bắc là nơi Đại tướng đặt nền móng cho học thuyết chiến tranh nhân dân Việt Nam.”'
  },
  '03_bien_gioi': {
    id: '03_bien_gioi',
    code: '03',
    title: 'RADAR BIÊN GIỚI 1950',
    year: '1950',
    theme: 'Chiến dịch Biên giới và sự thay đổi thế trận',
    narrationSteps: [
      { timeSec: 0, durationSec: 4.5, text: 'Chiến dịch Biên giới năm một nghìn chín trăm năm mươi mở ra bước ngoặt phản công chiến lược.', tacticalAction: 'CHUYỂN SANG THẾ PHẢN CÔNG' },
      { timeSec: 4.5, durationSec: 5.0, text: 'Trận đánh then chốt Đông Khê và chiến thuật đánh điểm diệt viện đã đập tan phòng tuyến Đường số bốn của địch.', tacticalAction: 'ĐỘT PHÁ CỨ ĐIỂM ĐÔNG KHÊ' },
      { timeSec: 9.5, durationSec: 5.0, text: 'Khai thông bảy trăm năm mươi ki-lô-mét biên giới Việt Trung, nối liền hậu phương quốc tế với kháng chiến.', tacticalAction: 'KHAI THÔNG 750KM ĐƯỜNG BIÊN GIỚI' }
    ],
    conclusionQuote: '“Từ thế giữ gìn lực lượng, ta đã giành quyền chủ động hoàn toàn trên chiến trường chính Bắc Bộ.”'
  },
  '04_truong_son': {
    id: '04_truong_son',
    code: '04',
    title: 'RADAR ĐƯỜNG TRƯỜNG SƠN',
    year: '1959 - 1975',
    theme: 'Hậu cần và sức mạnh của cả một hệ thống',
    narrationSteps: [
      { timeSec: 0, durationSec: 4.5, text: 'Tuyến đường huyết mạch Trường Sơn với hơn hai mươi nghìn ki-lô-mét vắt qua đại ngàn bom đạn.', tacticalAction: 'HUYẾT MẠCH CHI VIỆN CHIẾN TRƯỜNG MIỀN NAM' },
      { timeSec: 4.5, durationSec: 5.0, text: 'Sức mạnh hậu phương miền Bắc chi viện thần kỳ sức người, sức của cho tiền tuyến lớn miền Nam.', tacticalAction: 'KỲ TÍCH HẬU CẦN THẾ KỶ' }
    ],
    conclusionQuote: '“Xẻ dọc Trường Sơn đi cứu nước — Con đường nối liền ý chí của cả dân tộc.”'
  },
  '05_xuan_1975': {
    id: '05_xuan_1975',
    code: '05',
    title: 'RADAR XUÂN 1975',
    year: '1975',
    theme: 'Những ngày cuối cùng của cuộc chiến',
    narrationSteps: [
      { timeSec: 0, durationSec: 4.0, text: 'Mùa xuân năm một nghìn chín trăm bảy mươi lăm, cuộc Tổng tiến công và nổi dậy diễn ra với tốc độ vũ bão.', tacticalAction: 'THẦN TỐC TỔNG TIẾN CÔNG VÀ NỔI DẬY' },
      { timeSec: 4.0, durationSec: 5.0, text: 'Bức điện lịch sử của Đại tướng: Thần tốc, thần tốc hơn nữa, táo bạo, táo bạo hơn nữa xốc tới chiến trường.', tacticalAction: 'MỆNH LỆNH THẦN TỐC CỦA ĐẠI TƯỚNG' },
      { timeSec: 9.0, durationSec: 5.5, text: 'Mười một giờ ba mươi phút ngày ba mươi tháng tư, Dinh Độc Lập giải phóng, non sông thu về một mối.', tacticalAction: 'DINH ĐỘC LẬP TOÀN THẮNG 30/04' }
    ],
    conclusionQuote: '“Đại thắng Mùa Xuân 1975 — Khúc khải hoàn vĩ đại của sức mạnh đại đoàn kết toàn dân tộc.”'
  },
  '06_truong_sa': {
    id: '06_truong_sa',
    code: '06',
    title: 'RADAR TRƯỜNG SA 1975',
    year: '1975',
    theme: 'Mệnh lệnh bảo vệ chủ quyền biển đảo thiêng liêng',
    narrationSteps: [
      { timeSec: 0, durationSec: 4.5, text: 'Tháng tư năm một nghìn chín trăm bảy mươi lăm, Đại tướng Võ Nguyên Giáp ra mật lệnh giải phóng các đảo thuộc quần đảo Trường Sa.', tacticalAction: 'MẬT LỆNH GIẢI PHÓNG QUẦN ĐẢO TRƯỜNG SA' },
      { timeSec: 4.5, durationSec: 5.0, text: 'Các đơn vị đặc công nước chớp thời cơ vàng, giải phóng toàn bộ các đảo tiền tiêu, giữ vững chủ quyền biển đảo thiêng liêng.', tacticalAction: 'CHỦ QUYỀN BIỂN ĐẢO BẤT KHẢ XÂM PHẠM' }
    ],
    conclusionQuote: '“Biển bạc đảo vàng là giang sơn của tổ tiên — Quyết không để mất dù một tấc biển thiêng liêng.”'
  }
};

export const RadarTacticalView: React.FC<{
  isDark: boolean;
  onNavigate?: (tab: NavTab) => void;
  language?: 'vi' | 'en';
}> = ({ isDark, onNavigate }) => {
  // Campaign Selection
  const [selectedRadarId, setSelectedRadarId] = useState<RadarId>('01_dien_bien');

  // Sub Tab Navigation
  const [activeSubTab, setActiveSubTab] = useState<'radar' | 'events' | 'terrain' | 'forces' | 'campaign' | 'library'>('radar');

  // 3D View Mode (3D / 2D / 360)
  const [viewMode, setViewMode] = useState<RadarViewMode>('3d');

  // Visual Render Mode (Realistic / Tactical / History)
  const [visualMode, setVisualMode] = useState<VisualRenderMode>('realistic');

  // Camera Preset
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('current');

  // Selected POI for 3D & Sidebar
  const [selectedPoi, setSelectedPoi] = useState<RadarPOI | null>(DIEN_BIEN_PHU_POIS[0]);

  // Sidebar detail panel open state (Desktop) or Mobile Bottom Sheet
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState<boolean>(false);
  const [sidebarTab, setSidebarTab] = useState<'info' | 'images'>('info');

  // Lightbox Fullscreen Modal State
  const [lightboxItem, setLightboxItem] = useState<{ url: string; caption: string; tag: string } | null>(null);

  // Tactical Layers State (Chú giải)
  const [layers, setLayers] = useState<TacticalLayers>({
    strongholds: true,
    bunkers: true,
    hq: true,
    attackArrows: true,
    defenseLines: true,
    maneuverLines: true,
    rivers: true,
    highTerrain: true,
    valley: true,
    labels: true,
    contourLines: false
  });

  // Audio & Voice Narration Settings
  const [isAudioModalOpen, setIsAudioModalOpen] = useState<boolean>(false);
  const [audioSettings, setAudioSettings] = useState<RadarAudioSettings>(() => {
    try {
      const saved = localStorage.getItem(AUDIO_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_AUDIO_SETTINGS;
    } catch {
      return DEFAULT_AUDIO_SETTINGS;
    }
  });

  // Timeline Narration Playback States
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeSpeechSubtitle, setActiveSpeechSubtitle] = useState<string>('');

  // References
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastStepIndexRef = useRef<number>(-1);
  const bottomThumbnailsRef = useRef<HTMLDivElement>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Active Radar Configuration Object
  const currentRadar = RADAR_CONFIGS[selectedRadarId];

  // Calculate current total duration of the narration
  const totalDuration = useMemo(() => {
    const lastStep = currentRadar.narrationSteps[currentRadar.narrationSteps.length - 1];
    return (lastStep?.timeSec || 0) + (lastStep?.durationSec || 4);
  }, [currentRadar]);

  // Current active step index based on playbackTime
  const activeStepIndex = useMemo(() => {
    const idx = currentRadar.narrationSteps.findIndex((step, i) => {
      const nextTime = currentRadar.narrationSteps[i + 1]?.timeSec ?? 999;
      return playbackTime >= step.timeSec && playbackTime < nextTime;
    });
    return idx !== -1 ? idx : (playbackTime >= totalDuration ? currentRadar.narrationSteps.length - 1 : 0);
  }, [playbackTime, currentRadar, totalDuration]);

  const activeStep = currentRadar.narrationSteps[activeStepIndex] || currentRadar.narrationSteps[0];

  // Search input for Radar POIs
  const [searchQuery, setSearchQuery] = useState<string>('');

  // POIs dataset with search filtering
  const filteredPois = useMemo(() => {
    if (!searchQuery.trim()) return DIEN_BIEN_PHU_POIS;
    const q = searchQuery.toLowerCase().trim();
    return DIEN_BIEN_PHU_POIS.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortName.toLowerCase().includes(q) ||
      (p.frenchName && p.frenchName.toLowerCase().includes(q)) ||
      p.subSector.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Stop any active speech immediately
  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeUtteranceRef.current = null;
  }, []);

  // Professional Vietnamese Narration Engine with Natural Cadence
  const speakNarratorVoice = useCallback((rawText: string) => {
    if (isMuted) return;
    if (!('speechSynthesis' in window)) return;

    stopSpeech();

    const normalizedText = normalizeVietnameseForSpeech(rawText);
    setActiveSpeechSubtitle(rawText);

    const voices = window.speechSynthesis.getVoices();
    const viVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith('vi') || 
      v.lang.toLowerCase().includes('vn') ||
      v.name.toLowerCase().includes('vietnam') ||
      v.name.toLowerCase().includes('tiếng việt')
    );

    if (viVoices.length === 0) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(normalizedText);
    utterance.lang = 'vi-VN';
    utterance.rate = audioSettings.rate;
    utterance.pitch = audioSettings.pitch;
    utterance.volume = audioSettings.volume;

    if (audioSettings.voiceIndex >= 0 && voices[audioSettings.voiceIndex]) {
      utterance.voice = voices[audioSettings.voiceIndex];
    } else {
      const maleVoice = viVoices.find(v => 
        v.name.toLowerCase().includes('nam') || 
        v.name.toLowerCase().includes('male') ||
        v.name.toLowerCase().includes('minh') ||
        !v.name.toLowerCase().includes('female')
      );
      utterance.voice = maleVoice || viVoices[0];
    }

    activeUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isMuted, audioSettings, stopSpeech]);

  // Switch campaign handler
  const handleSelectRadar = (id: RadarId) => {
    playPaperTurn();
    stopSpeech();
    setSelectedRadarId(id);
    setPlaybackTime(0);
    lastStepIndexRef.current = 0;
    setIsPlaying(true);

    setTimeout(() => {
      if (audioSettings.enableRadarSfx) playRadarPing();
    }, 100);
    speakNarratorVoice(RADAR_CONFIGS[id].narrationSteps[0]?.text || '');
  };

  // Select POI from 3D map or bottom thumbnails
  const handleSelectPoi = (poi: RadarPOI) => {
    playHistoricalStamp();
    setSelectedPoi(poi);
    setIsSidebarOpen(true);
    setIsMobileSheetOpen(true);
    setSidebarTab('info');
  };

  // Playback timer loop & synchronization with 3D map
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = null;
      return;
    }

    const tick = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setPlaybackTime(prev => {
        const next = prev + deltaSec;

        const stepIdx = currentRadar.narrationSteps.findIndex((s, i) => {
          const nextS = currentRadar.narrationSteps[i + 1]?.timeSec ?? 999;
          return next >= s.timeSec && next < nextS;
        });

        if (stepIdx !== -1 && stepIdx !== lastStepIndexRef.current) {
          lastStepIndexRef.current = stepIdx;
          const step = currentRadar.narrationSteps[stepIdx];

          if (step.focusPoiId) {
            const targetPoi = DIEN_BIEN_PHU_POIS.find(p => p.id === step.focusPoiId);
            if (targetPoi) {
              setSelectedPoi(targetPoi);
            }
          } else if (step.cameraPreset) {
            setCameraPreset(step.cameraPreset);
          }

          if (audioSettings.enableRadarSfx) {
            if (stepIdx === 0) playRadarPing();
            else if (stepIdx === 2 || stepIdx === 3) playTelegraphBeep();
            else if (stepIdx === currentRadar.narrationSteps.length - 1) playVictoryFanfare();
            else playRadioStatic();
          }

          speakNarratorVoice(step.text);
        }

        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, currentRadar, totalDuration, audioSettings, speakNarratorVoice]);

  // Toggle Play / Pause
  const handleTogglePlay = () => {
    playCabinetClick();
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      if (playbackTime >= totalDuration - 0.5) {
        setPlaybackTime(0);
        lastStepIndexRef.current = -1;
      }
      if (audioSettings.enableRadarSfx) playRadioStatic();
      setIsPlaying(true);
      speakNarratorVoice(activeStep.text);
    }
  };

  // Replay
  const handleReplay = () => {
    playCabinetClick();
    stopSpeech();
    setPlaybackTime(0);
    lastStepIndexRef.current = 0;
    setIsPlaying(true);
    if (audioSettings.enableRadarSfx) playRadarPing();
    speakNarratorVoice(currentRadar.narrationSteps[0]?.text || '');
  };

  // Scroll bottom thumbnails
  const scrollThumbnails = (dir: 'left' | 'right') => {
    if (bottomThumbnailsRef.current) {
      bottomThumbnailsRef.current.scrollBy({
        left: dir === 'left' ? -260 : 260,
        behavior: 'smooth'
      });
    }
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [stopSpeech]);

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-3 pb-12 px-1 sm:px-3 text-emerald-100 font-sans">
      {/* 1. TOP HEADER: TITLE + OPERATION TABS + CTA CONTROLS (CHỮ TO, RÕ RÀNG) */}
      <header className="flex flex-wrap items-center justify-between gap-3 px-3.5 sm:px-5 py-3 rounded-2xl bg-[#07130C] border border-[#10B981]/40 shadow-xl">
        {/* Left: Brand & Radar Title (CHỮ TO) */}
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-emerald-400 bg-emerald-950 flex items-center justify-center text-emerald-300 shadow-md shadow-emerald-500/30 shrink-0">
            <Radar className="w-5 h-5 animate-spin" style={{ animationDuration: '14s' }} />
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2 truncate">
              <span className="text-sm sm:text-base md:text-lg lg:text-xl font-mono font-black tracking-wider uppercase text-emerald-300 truncate">
                {currentRadar.title}
              </span>
              <span className="text-emerald-500/50 text-sm">|</span>
              <span className="text-sm sm:text-base font-mono font-black text-amber-300">
                {currentRadar.year}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-400 font-medium hidden md:block truncate">
              Bản đồ 3D tương tác & Thuyết minh phát thanh lịch sử
            </p>
          </div>
        </div>

        {/* Center: Tactical Tabs (CHỮ RÕ RÀNG) */}
        <div className="hidden xl:flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-emerald-500/30">
          <button
            onClick={() => { playCabinetClick(); setActiveSubTab('radar'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'radar'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Radar className="w-4 h-4 text-emerald-400" />
            Radar 3D
          </button>

          <button
            onClick={() => { playCabinetClick(); setActiveSubTab('events'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'events'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            Sự kiện
          </button>

          <button
            onClick={() => { 
              playCabinetClick(); 
              setActiveSubTab('terrain'); 
              setLayers(prev => ({ ...prev, highTerrain: true, valley: true, rivers: true }));
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'terrain'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <TreePine className="w-4 h-4 text-emerald-400" />
            Địa hình
          </button>

          <button
            onClick={() => { playCabinetClick(); setActiveSubTab('forces'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
              activeSubTab === 'forces'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-4 h-4 text-blue-400" />
            Lực lượng
          </button>

          {/* Campaign Selector dropdown */}
          <div className="relative group">
            <button
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer ${
                activeSubTab === 'campaign'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-emerald-200/90 hover:text-white hover:bg-white/10'
              }`}
            >
              <Flag className="w-4 h-4 text-red-400" />
              Chiến dịch ▾
            </button>
            <div className="absolute top-full left-0 mt-1.5 w-60 p-2 bg-[#07130C] border-2 border-emerald-500/50 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              {[
                { id: '01_dien_bien' as RadarId, label: '01. Điện Biên Phủ 1954' },
                { id: '02_viet_bac' as RadarId, label: '02. Việt Bắc 1947' },
                { id: '03_bien_gioi' as RadarId, label: '03. Biên Giới 1950' },
                { id: '04_truong_son' as RadarId, label: '04. Đường Trường Sơn' },
                { id: '05_xuan_1975' as RadarId, label: '05. Đại thắng Xuân 1975' },
                { id: '06_truong_sa' as RadarId, label: '06. Giải phóng Trường Sa' },
              ].map(c => (
                <button
                  key={c.id}
                  onClick={() => handleSelectRadar(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-mono font-medium transition-all cursor-pointer ${
                    selectedRadarId === c.id
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-emerald-100 hover:bg-emerald-950/80 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Audio Modal, Replay & CTA KÍCH HOẠT */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              playCabinetClick();
              setIsAudioModalOpen(true);
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all cursor-pointer"
            title="Cài đặt giọng đọc & âm thanh"
          >
            <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => {
              const nm = !isMuted;
              setIsMuted(nm);
              if (nm) stopSpeech();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all cursor-pointer"
            title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />}
          </button>

          <button
            onClick={handleReplay}
            className="p-2 sm:p-2.5 rounded-xl bg-black/60 border border-emerald-500/30 text-emerald-300 hover:text-white hover:border-emerald-400 transition-all cursor-pointer"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`flex items-center gap-2 px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-xl font-mono font-black text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black border border-amber-300 shadow-amber-500/40 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 shadow-emerald-500/40'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-white" />}
            <span>{isPlaying ? 'DỪNG' : 'KÍCH HOẠT'}</span>
          </button>
        </div>
      </header>

      {/* 2. SIMPLE 3D VIEW CONTROLS (Ít chế độ, dễ nhìn, trực quan) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: 3 Simple Camera Presets (Toàn cảnh / Cận cảnh / Trên xuống) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07130C] border border-[#10B981]/40 overflow-x-auto no-scrollbar max-w-full shadow-md">
          <button
            onClick={() => { 
              playCabinetClick(); 
              setViewMode('3d'); 
              setCameraPreset('overview'); 
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              cameraPreset === 'overview'
                ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-300'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🌐 Toàn cảnh</span>
          </button>

          <button
            onClick={() => { 
              playCabinetClick(); 
              setViewMode('3d'); 
              setCameraPreset('cinematic'); 
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              cameraPreset === 'cinematic'
                ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-300'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>🎯 Cận cảnh</span>
          </button>

          <button
            onClick={() => { 
              playCabinetClick(); 
              setViewMode('3d'); 
              setCameraPreset('topdown'); 
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              cameraPreset === 'topdown'
                ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-300'
                : 'text-emerald-200/90 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>📐 Trên xuống</span>
          </button>
        </div>

        {/* Right: Search Box for Radar POIs */}
        <div className="relative flex-1 min-w-[200px] max-w-xs sm:max-w-sm">
          <Search className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm cứ điểm, hầm hào, địa danh..."
            className="w-full pl-10 pr-8 py-2 bg-[#07130C] border border-emerald-500/40 rounded-xl text-xs sm:text-sm font-sans text-emerald-100 placeholder-emerald-400/60 focus:outline-none focus:border-amber-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 3. MAIN WORKSPACE: MAP VIEWPORT + DESKTOP DETAIL PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch h-[calc(100vh-220px)] min-h-[520px] max-h-[780px] overflow-hidden">
        {/* CENTER 3D MAP VIEWPORT */}
        <div className={`relative flex flex-col h-full overflow-hidden transition-all ${
          isSidebarOpen ? 'lg:col-span-8 xl:col-span-8 2xl:col-span-9' : 'lg:col-span-12'
        }`}>
          {/* 3D Canvas Scene */}
          <div className="relative flex-1 w-full h-full min-h-[390px] overflow-hidden rounded-2xl border-2 border-emerald-500/40 shadow-2xl bg-[#040C07]">
            <Radar3DScene
              pois={filteredPois}
              selectedPoi={selectedPoi}
              onSelectPoi={handleSelectPoi}
              viewMode={viewMode}
              onChangeViewMode={setViewMode}
              cameraPreset={cameraPreset}
              onChangeCameraPreset={setCameraPreset}
              layers={layers}
              visualMode={visualMode}
              onChangeVisualMode={setVisualMode}
              isDark={isDark}
              radarSweepActive={isPlaying}
            />

            {/* FLOATING LEFT: COLLAPSIBLE LEGEND PANEL ("CHÚ GIẢI" - CHỮ TO) */}
            <div className="absolute top-14 left-3 z-20 max-w-[170px] sm:max-w-[200px] p-2.5 rounded-xl bg-black/90 border border-emerald-500/50 backdrop-blur-md shadow-2xl text-left pointer-events-auto">
              <div className="text-xs sm:text-sm font-mono font-black text-amber-300 pb-1.5 border-b border-emerald-500/20 mb-2 flex items-center justify-between">
                <span>Chú giải</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>

              <div className="space-y-1.5 text-xs font-mono text-emerald-100 font-medium">
                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 shadow-xs shadow-red-500" />
                  <span className="truncate">Cứ điểm / Đồn</span>
                  <input
                    type="checkbox"
                    checked={layers.strongholds}
                    onChange={(e) => setLayers({ ...layers, strongholds: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 shadow-xs shadow-sky-400" />
                  <span className="truncate">Hầm chỉ huy</span>
                  <input
                    type="checkbox"
                    checked={layers.bunkers}
                    onChange={(e) => setLayers({ ...layers, bunkers: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0 shadow-xs shadow-amber-400" />
                  <span className="truncate">Sở chỉ huy</span>
                  <input
                    type="checkbox"
                    checked={layers.hq}
                    onChange={(e) => setLayers({ ...layers, hq: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-3 h-1 bg-sky-400 shrink-0 rounded-full" />
                  <span className="truncate">Mũi tiến công</span>
                  <input
                    type="checkbox"
                    checked={layers.attackArrows}
                    onChange={(e) => setLayers({ ...layers, attackArrows: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-3 h-0.5 border-b-2 border-dashed border-red-500 shrink-0" />
                  <span className="truncate">Tuyến phòng thủ</span>
                  <input
                    type="checkbox"
                    checked={layers.defenseLines}
                    onChange={(e) => setLayers({ ...layers, defenseLines: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                  <span className="w-3 h-1 bg-blue-400 shrink-0 rounded-full" />
                  <span className="truncate">Sông Nậm Rốm</span>
                  <input
                    type="checkbox"
                    checked={layers.rivers}
                    onChange={(e) => setLayers({ ...layers, rivers: e.target.checked })}
                    className="ml-auto w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Toggle switch: Nhãn tên */}
              <div className="pt-2 mt-2 border-t border-emerald-500/20 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-300">Nhãn tên:</span>
                <button
                  onClick={() => setLayers({ ...layers, labels: !layers.labels })}
                  className={`w-8 h-4 rounded-full transition-colors relative cursor-pointer ${
                    layers.labels ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                >
                  <span className={`block w-3 h-3 rounded-full bg-white transition-transform ${
                    layers.labels ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>

            {/* BOTTOM HORIZONTAL THUMBNAIL STRIP (BỔ SUNG HÌNH TO RÕ, CHỮ RÕ) */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 z-20 pointer-events-auto">
              <div className="relative flex items-center bg-black/90 border border-emerald-500/50 rounded-2xl p-1.5 backdrop-blur-md shadow-2xl">
                <button
                  onClick={() => scrollThumbnails('left')}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-300 hover:text-white shrink-0 cursor-pointer"
                  title="Trượt sang trái"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div
                  ref={bottomThumbnailsRef}
                  className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5 px-2 scroll-smooth overscroll-x-contain touch-pan-x"
                >
                  {filteredPois.map(poi => {
                    const isSelected = selectedPoi?.id === poi.id;
                    return (
                      <button
                        key={poi.id}
                        onClick={() => handleSelectPoi(poi)}
                        className={`group flex flex-col items-center shrink-0 w-28 sm:w-36 rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-emerald-400 ring-2 ring-emerald-400/80 bg-emerald-950 scale-102 shadow-lg shadow-emerald-500/30'
                            : 'border-emerald-500/40 hover:border-emerald-300 bg-black/70'
                        }`}
                      >
                        <div className="w-full h-14 sm:h-18 overflow-hidden bg-black relative">
                          <img
                            src={poi.thumbnail}
                            alt={poi.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCuratedImage('RadarTacticalView__001__TACTICAL_BRIEFING_MAP');
                            }}
                          />
                        </div>
                        <div className="w-full p-1 text-center truncate bg-black/40">
                          <span className={`text-xs sm:text-sm font-sans font-bold truncate block ${
                            isSelected ? 'text-amber-300' : 'text-emerald-100 group-hover:text-emerald-300'
                          }`}>
                            {poi.shortName}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => scrollThumbnails('right')}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-300 hover:text-white shrink-0 cursor-pointer"
                  title="Trượt sang phải"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* SYNCHRONIZED TIMELINE BAR & SUBTITLES (CHỮ TO, DỄ ĐỌC) */}
          {audioSettings.showSubtitles && (
            <div className="mt-2 p-2.5 sm:p-3 rounded-2xl bg-[#07130C] border border-[#10B981]/40 text-emerald-100 flex items-center gap-3 shadow-md">
              <Radio className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div className="flex-1 truncate">
                <span className="text-[10px] sm:text-xs font-mono font-black text-amber-400 uppercase tracking-widest block leading-tight">
                  {activeStep.tacticalAction}
                </span>
                <p className="text-xs sm:text-sm md:text-base font-sans font-semibold text-white leading-snug truncate mt-0.5">
                  {activeStep.text}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 shrink-0">
                <span>{Math.floor(playbackTime / 60)}:{(Math.floor(playbackTime % 60)).toString().padStart(2, '0')}</span>
                <span>/</span>
                <span>{Math.floor(totalDuration / 60)}:{(Math.floor(totalDuration % 60)).toString().padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT DESKTOP SIDEBAR: GOOGLE MAPS STYLE DETAIL PANEL (CHỮ TO, HÌNH ẢNH RÕ NÉT) */}
        {isSidebarOpen && selectedPoi && (
          <aside className="hidden lg:flex lg:col-span-4 xl:col-span-4 2xl:col-span-3 rounded-2xl border-2 border-emerald-500/40 bg-[#07130C] text-emerald-100 shadow-2xl overflow-hidden flex-col h-full max-h-full">
            {/* Panel Header (CHỮ TO) */}
            <div className="flex items-center justify-between p-3.5 border-b border-emerald-500/30 bg-emerald-950/60 shrink-0">
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-md bg-emerald-900 border border-emerald-400/60 flex items-center justify-center text-emerald-300 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-mono font-black text-amber-300 truncate">
                  {selectedPoi.name}
                </h3>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
                title="Thu gọn bảng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Internal Scrollable Content (CHỮ TO & HÌNH RÕ) */}
            <div className="p-3.5 space-y-3.5 overflow-y-auto flex-1 min-h-0">
              {/* Hero Image with Click to Fullscreen Lightbox */}
              <div 
                onClick={() => setLightboxItem({
                  url: selectedPoi.thumbnail,
                  caption: selectedPoi.name + ' — ' + selectedPoi.subSector,
                  tag: 'Hiện trạng di tích'
                })}
                className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-black shrink-0 cursor-pointer group"
                title="Bấm để xem ảnh phóng to toàn màn hình"
              >
                <img
                  src={selectedPoi.thumbnail}
                  alt={selectedPoi.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCuratedImage('RadarTacticalView__002__GIAP_HANOI_FLAG_REVIEW');
                  }}
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/85 text-emerald-300 text-xs font-mono font-semibold">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Xem ảnh lớn
                </div>
              </div>

              {/* Sub-Tabs: Thông tin | Ảnh tư liệu (ĐƠN GIẢN, GỌN GÀNG) */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 border border-emerald-500/30 shrink-0">
                <button
                  onClick={() => setSidebarTab('info')}
                  className={`flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    sidebarTab === 'info'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Info className="w-3.5 h-3.5" />
                  Thông tin
                </button>

                <button
                  onClick={() => setSidebarTab('images')}
                  className={`flex-1 py-1.5 rounded-lg text-xs sm:text-sm font-mono font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                    sidebarTab === 'images'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-200/80 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  Ảnh tư liệu ({selectedPoi.gallery.length})
                </button>
              </div>

              {/* TAB 1: THÔNG TIN (CHỮ TO, RÕ RÀNG, DỄ ĐỌC) */}
              {sidebarTab === 'info' && (
                <div className="space-y-3 text-left">
                  {/* Main Description */}
                  <p className="text-gray-100 leading-relaxed font-sans text-xs sm:text-sm">
                    {selectedPoi.description}
                  </p>

                  {/* Historical Significance */}
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 space-y-1.5">
                    <span className="text-xs font-mono font-black text-amber-300 uppercase block tracking-wider">
                      Ý NGHĨA LỊCH SỬ:
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                      {selectedPoi.historicalSignificance}
                    </p>
                  </div>

                  {/* Quote if available */}
                  {selectedPoi.historicalQuote && (
                    <blockquote className="p-3 rounded-xl bg-black/50 border-l-3 border-amber-400 text-xs sm:text-sm italic text-amber-200/95 font-serif leading-relaxed">
                      {selectedPoi.historicalQuote}
                    </blockquote>
                  )}

                  {/* Metadata Specs Table */}
                  <div className="space-y-2 pt-2 border-t border-emerald-500/20 text-xs sm:text-sm font-mono">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-400">Vị trí: </strong>
                        <span className="text-emerald-100 font-semibold">{selectedPoi.subSector}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Mountain className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-400">Độ cao: </strong>
                        <span className="text-amber-300 font-bold">{selectedPoi.elevation}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-400">Lực lượng: </strong>
                        <span className="text-emerald-100">{selectedPoi.forces}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-gray-400">Thời gian xây dựng: </strong>
                        <span className="text-emerald-200">{selectedPoi.constructionDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HÌNH ẢNH (BỔ SUNG HÌNH VỚI CHỨC NĂNG PHÓNG TO) */}
              {sidebarTab === 'images' && (
                <div className="space-y-3">
                  <p className="text-xs text-emerald-400/80 font-mono">
                    💡 Bấm vào ảnh bất kỳ để xem toàn màn hình độ phân giải cao:
                  </p>
                  {selectedPoi.gallery.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setLightboxItem(item)}
                      className="rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-black/70 cursor-pointer group hover:border-amber-400 transition-all shadow-md"
                    >
                      <div className="h-32 sm:h-36 overflow-hidden relative">
                        <img 
                          src={item.url} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCuratedImage('RadarTacticalView__003__VIETNAM_PEOPLES_ARMY');
                          }}
                        />
                        <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/85 border border-emerald-400/60 text-emerald-300 text-[10px] font-mono font-bold">
                          {item.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Action Footer (CHỮ TO) */}
            <div className="p-3 border-t border-emerald-500/30 bg-black/50 space-y-2 shrink-0">
              <button
                onClick={() => {
                  playCabinetClick();
                  setViewMode('3d');
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
              >
                <MapPin className="w-4 h-4" />
                <span>Xem vị trí trên bản đồ 3D</span>
              </button>

              <button
                onClick={() => speakNarratorVoice(selectedPoi.description)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-mono text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Mic className="w-4 h-4 text-amber-400" />
                <span>Nghe thuyết minh di tích này</span>
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* 4. MOBILE / TABLET BOTTOM SHEET DETAIL DRAWER (SLIDES UP FROM BOTTOM, CHỮ TO) */}
      {isMobileSheetOpen && selectedPoi && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-[#07130C] border-t-2 border-emerald-500/60 rounded-t-2xl shadow-2xl max-h-[70vh] flex flex-col animate-in slide-in-from-bottom duration-200">
          <div className="p-3 border-b border-emerald-500/30 flex items-center justify-between shrink-0 bg-emerald-950/70">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <h3 className="text-sm font-mono font-bold text-amber-300 truncate">
                {selectedPoi.name}
              </h3>
            </div>
            <button
              onClick={() => setIsMobileSheetOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <div 
              onClick={() => setLightboxItem({
                url: selectedPoi.thumbnail,
                caption: selectedPoi.name,
                tag: 'Hiện trạng di tích'
              })}
              className="relative w-full h-36 rounded-xl overflow-hidden border border-emerald-500/40 cursor-pointer"
            >
              <img
                src={selectedPoi.thumbnail}
                alt={selectedPoi.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('RadarTacticalView__004__MUSEUM_TANK_HALL');
                }}
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-emerald-300 text-[10px] font-mono">
                Bấm để phóng to
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-100 leading-relaxed font-sans">
              {selectedPoi.description}
            </p>

            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs">
              <strong className="text-amber-300 block mb-0.5">Ý NGHĨA LỊCH SỬ:</strong>
              {selectedPoi.historicalSignificance}
            </div>

            <button
              onClick={() => speakNarratorVoice(selectedPoi.description)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-mono font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              Nghe thuyết minh tiếng Việt
            </button>
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE IMAGE LIGHTBOX MODAL (BỔ SUNG HÌNH TO, RÕ NÉT) */}
      {lightboxItem && (
        <div 
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in"
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxItem(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer z-50 transition-all"
            title="Đóng xem ảnh"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Fullscreen Image Container */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center bg-[#07130C] border-2 border-emerald-500/50 rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="w-full max-h-[70vh] overflow-hidden flex items-center justify-center bg-black">
              <img
                src={lightboxItem.url}
                alt=""
                className="max-w-full max-h-[70vh] object-contain select-none"
              />
            </div>
            <div className="w-full p-4 bg-black/80 border-t border-emerald-500/30 flex items-center justify-between gap-3 text-left">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold mr-2">
                  {lightboxItem.tag}
                </span>
                <span className="text-sm sm:text-base font-sans font-medium text-white">
                  {lightboxItem.caption}
                </span>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs cursor-pointer shrink-0"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AUDIO SETTINGS MODAL */}
      <RadarAudioSettingsModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        settings={audioSettings}
        onSaveSettings={setAudioSettings}
      />
    </div>
  );
};
