import React, { useState, useEffect, useRef } from 'react';
import { 
  Film, 
  Sparkles, 
  Play, 
  Pause, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  Sliders, 
  Wand2, 
  ShieldCheck, 
  History, 
  Share2, 
  Layers, 
  RotateCcw,
  Volume2,
  VolumeX,
  Mic,
  Music,
  BookOpen,
  Compass,
  ArrowRight,
  Maximize2,
  Minimize2,
  Eye,
  Clock,
  Sparkle,
  Split,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Award,
  Zap,
  Check
} from 'lucide-react';
import { AppLanguage } from '../utils/i18n';
import { playCabinetClick } from '../utils/soundEffects';

interface HistoryVideoStudioProps {
  isDark: boolean;
  language?: AppLanguage;
}

// Data structures
export type StudioWorkspace = 'film-video' | 'history-painter' | 'photo-restoration';
export type StartScriptMode = 'quick-idea' | 'suggested-themes' | 'custom-script';

export interface SceneItem {
  sceneNumber: number;
  title: string;
  durationSec: number;
  cameraAngle: string;
  motionType: string;
  visualPrompt: string;
  voiceover: string;
  soundFx: string;
  matchedArchiveImage: string;
}

export interface VerificationIssue {
  id: string;
  title: string;
  category: string;
  reason: string;
  citation?: string;
  suggestion: string;
  severity: 'green' | 'yellow' | 'red';
}

export interface VerificationReport {
  status: 'suitable' | 'review_needed' | 'unsuitable';
  statusLabel: string;
  badgeColor: 'green' | 'yellow' | 'red';
  score: number;
  summary: string;
  issues: VerificationIssue[];
  correctedScript: string;
  educationalDisclaimer?: string;
}

export interface GeneratedCreationItem {
  id: string;
  type: 'video' | 'image' | 'restoration';
  url: string;
  beforeUrl?: string; // For restoration comparison
  prompt: string;
  title?: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  createdAt: string;
  model: string;
  engine?: string;
  scenes?: SceneItem[];
}

// 10 Suggested Script Themes
const SUGGESTED_THEMES = [
  {
    id: 'theme-1',
    category: 'Mốc son',
    title: 'Theo dấu thời gian',
    shortDesc: 'Hành trình 56 ngày đêm từ tiếng súng Him Lam đến cờ chiến thắng Mường Thanh.',
    prompt: 'Hành trình 56 ngày đêm của Chiến dịch Điện Biên Phủ từ phát súng mở màn cứ điểm Him Lam 13/3/1954 đến giây phút lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries chiều 7/5/1954.',
    duration: 45
  },
  {
    id: 'theme-2',
    category: 'Tốc độ',
    title: 'Một phút lịch sử',
    shortDesc: 'Tổng kết 60 giây tinh hoa: Tại sao Điện Biên Phủ là chiến thắng lừng lẫy năm châu?',
    prompt: 'Một phút lịch sử giải thích vì sao quân đội non trẻ Việt Nam với gậy tầm vông và xe đạp thồ lại đánh bại tập đoàn cứ điểm bất khả xâm phạm của thực dân Pháp tại Điện Biên Phủ 1954.',
    duration: 60
  },
  {
    id: 'theme-3',
    category: 'Bất ngờ',
    title: 'Bạn có biết?',
    shortDesc: 'Bí mật con đường hầm chỉ huy dài 69 mét xuyên lòng núi đồi Pu Cà Mường Phăng.',
    prompt: 'Bạn có biết: Đường hầm bí mật dài 69m tại Mường Phăng được đào hoàn toàn thủ công xuyên qua lòng núi đá Pu Cà để bảo vệ an toàn tuyệt đối cho Đại tướng Võ Nguyên Giáp năm 1954.',
    duration: 30
  },
  {
    id: 'theme-4',
    category: 'Trọng điểm',
    title: 'Khoảnh khắc quyết định',
    shortDesc: 'Đêm 26/01/1954: Quyết định chuyển từ Đánh nhanh sang Đánh chắc tiến chắc.',
    prompt: 'Đêm 26 tháng 1 năm 1954 tại Mường Phăng, khoảnh khắc quyết định khó khăn nhất trong cuộc đời chỉ huy của Đại tướng Võ Nguyên Giáp: Ra lệnh hoãn nổ súng và kéo pháo ra để chuyển sang đánh chắc tiến chắc.',
    duration: 45
  },
  {
    id: 'theme-5',
    category: 'Tri ân',
    title: 'Dấu ấn còn mãi',
    shortDesc: 'Khu rừng Mường Phăng hôm nay và tấm lòng của đồng bào các dân tộc Tây Bắc.',
    prompt: 'Khu rừng nguyên sinh Mường Phăng Điện Biên hôm nay, nơi người dân bản địa thành kính gọi là Rừng Đại tướng, khắc ghi dấu ấn lịch sử không bao giờ phai mờ.',
    duration: 30
  },
  {
    id: 'theme-6',
    category: 'Khám phá',
    title: 'Một ngày làm nhà nghiên cứu lịch sử',
    shortDesc: 'Giải mã tấm bản đồ tác chiến và những dòng nhật ký chỉ huy của Đại tướng.',
    prompt: 'Theo chân nhà nghiên cứu trẻ tuổi đối chiếu tấm bản đồ tác chiến Điện Biên Phủ năm 1954 với địa hình thực địa thung lũng Mường Thanh và cứ điểm Đồi A1.',
    duration: 45
  },
  {
    id: 'theme-7',
    category: 'Góc nhìn',
    title: 'Tôi là người kể chuyện lịch sử',
    shortDesc: 'Kể lại chuyện kéo pháo qua dốc sương mù bằng giọng điệu hào hùng xúc động.',
    prompt: 'Tôi là người kể chuyện lịch sử: Khắc họa hình ảnh người chiến sĩ Điện Biên gồng mình kéo pháo 105mm vượt đèo Pha Đin trong gió rét sương mù Tây Bắc.',
    duration: 45
  },
  {
    id: 'theme-8',
    category: 'Giả định',
    title: 'Nếu tôi đứng trước quyết định ấy',
    shortDesc: 'Tình huống giả định giáo dục: Thách thức quân sự khi pháo địch vượt trội hỏa lực.',
    prompt: 'Tình huống giả định phục vụ giáo dục: Đặt mình vào vị trí người chỉ huy quân sự trước lưới lửa cứ điểm Him Lam và bài toán bảo toàn sinh mạng cho hàng vạn bộ đội.',
    duration: 45
  },
  {
    id: 'theme-9',
    category: 'Di tích',
    title: 'Hành trình khám phá một di tích',
    shortDesc: 'Tham quan Sở chỉ huy Mường Phăng: Từ lán ở, hầm thông tin đến đài quan sát.',
    prompt: 'Hành trình khám phá di tích Sở chỉ huy chiến dịch Mường Phăng: Lán tác chiến đơn sơ, đường hầm xuyên núi 69m và bếp Hoàng Cầm không khói huyền thoại.',
    duration: 45
  },
  {
    id: 'theme-10',
    category: 'Chân dung',
    title: 'Chân dung Đại tướng Võ Nguyên Giáp',
    shortDesc: 'Nhân cách lớn: Vị tướng huyền thoại có trái tim nhân văn luôn thương xót từng giọt máu chiến sĩ.',
    prompt: 'Chân dung Đại tướng Võ Nguyên Giáp năm 1954: Phong thái điềm đạm, ánh mắt kiên định, sự mộc mạc giản dị và tấm lòng nhân văn sâu sắc vì tính mạng của từng người lính.',
    duration: 45
  }
];

// Curated 8 Audio Themes
const AUDIO_THEMES = [
  { id: 'hanh-quan', name: 'Hành quân Điện Biên', vibe: 'Hùng tráng, nhịp trống dồn dập, đồng ca cổ động' },
  { id: 'tien-buoc', name: 'Tiến bước dưới quân kỳ', vibe: 'Trang nghiêm, hào sảng, kèn đồng vang vọng' },
  { id: 'hao-khi', name: 'Hào khí Tây Bắc', vibe: 'Khúc tráng ca núi rừng, sáo mèo đan xen nhạc giao hưởng' },
  { id: 'dem-tinh-lang', name: 'Đêm Mường Phăng tĩnh lặng', vibe: 'Trầm tư, ngẫm nghĩ, piano và đàn dây sâu lắng' },
  { id: 'trang-ca', name: 'Khúc tráng ca ngàn năm', vibe: 'Sử thi điện ảnh Hollywood, kịch tính, dồn dập' },
  { id: 'loi-the', name: 'Lời thề quyết tử', vibe: 'Căng thẳng, quyết liệt, âm thanh chiến trường khói lửa' },
  { id: 'tu-hao', name: 'Giai điệu tự hào', vibe: 'Hào hùng, xúc động, tràn đầy niềm tin giải phóng' },
  { id: 'toan-thang', name: 'Khúc khải hoàn 7/5', vibe: 'Tươi sáng, chiến thắng rực rỡ, pháo hoa mừng công' }
];

// Curated 5 Voice Styles
const VOICE_STYLES = [
  { id: 'nam-tram', name: 'Giọng Nam Trầm Ấm (Trang nghiêm)', sample: 'Mường Phăng, nơi ghi dấu những quyết định sinh tử của lịch sử dân tộc.' },
  { id: 'nu-truyen-cam', name: 'Giọng Nữ Truyền Cảm (Hào hùng)', sample: 'Dưới tán rừng già Tây Bắc, hào khí Điện Biên vẫn rực sáng muôn đời.' },
  { id: 'tai-lieu-kinh-dien', name: 'Giọng Phim Tài Liệu Kinh Điển', sample: 'Năm mươi sáu ngày đêm khoét núi ngủ hầm, làm nên một kỳ tích chấn động địa cầu.' },
  { id: 'duong-dai', name: 'Giọng Kể Chuyện Đương Đại (Tự nhiên)', sample: 'Hôm nay chúng ta cùng trở lại căn hầm chỉ huy huyền thoại năm 1954.' },
  { id: 'thu-am-rieng', name: 'Tự Thu Âm / Lồng Tiếng Riêng', sample: 'Ghi âm trực tiếp giọng đọc của chính bạn cho bộ phim.' }
];

// Historical Art Styles (For Painter)
const HISTORICAL_ART_STYLES = [
  { id: 'oil-painting', name: 'Sơn dầu cổ điển', desc: 'Nét cọ sơn dầu hàn lâm, ánh sáng Rembrandt cổ kính' },
  { id: 'authentic-doc', name: 'Nhiếp ảnh tư liệu chân thực', desc: 'Độ sắc nét cao, hạt phim analog, màu sắc trầm ấm thời chiến' },
  { id: 'propaganda-poster', name: 'Tranh cổ động kháng chiến', desc: 'Đồ họa khối mạnh mẽ, khẩu hiệu sắc sảo, màu đỏ vàng chủ đạo' },
  { id: 'battlefield-sketch', name: 'Ký họa chiến trường bút chì', desc: 'Nét chì ký họa mộc mạc của họa sĩ chiến sĩ ngay tại chiến hào' },
  { id: 'woodcut', name: 'Tranh khắc gỗ dân gian', desc: 'Đường nét gãy gọn, hoài niệm văn hóa dân tộc Việt Nam' }
];

// Archival Photos for Restoration
const ARCHIVAL_PHOTOS_FOR_RESTORE = [
  {
    id: 'muong_phang_hq',
    title: 'Sở chỉ huy Mường Phăng 1954',
    url: '/assets/giap-curated/tu-anh-goc/giap_muong_phang_hq_1790321420287.webp',
    year: '1954',
    description: 'Ảnh tư liệu gốc chụp lán và rừng Mường Phăng thời kỳ chiến dịch.'
  },
  {
    id: 'flag_dien_bien',
    title: 'Cờ Quyết chiến trên nóc hầm',
    url: '/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp',
    year: '07/05/1954',
    description: 'Khoảnh khắc lịch sử bộ đội ta phất cờ chiến thắng thung lũng Mường Thanh.'
  },
  {
    id: 'soldiers_combat',
    title: 'Chiến sĩ tiến công dưới chiến hào',
    url: '/assets/giap-curated/tu-anh-goc/soldiers_combat_bw_1789891334717.webp',
    year: '1954',
    description: 'Bộ đội ta áp sát vây lấn phân khu trung tâm.'
  },
  {
    id: 'general_portrait_doc',
    title: 'Chân dung Đại tướng thời chiến',
    url: '/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_1789889827160.webp',
    year: '1954',
    description: 'Đại tướng Võ Nguyên Giáp 43 tuổi tại mặt trận.'
  },
  {
    id: 'lan_muong_phang_hq',
    title: 'Lán làm việc của Đại tướng',
    url: '/assets/aistudio/image_2f0495f9.png',
    year: '1954',
    description: 'Căn lán mộc mạc bằng tranh tre nứa lá tại Mường Phăng.'
  }
];

// Initial Masterpiece Movie Spec
const MASTERPIECE_MOVIE: GeneratedCreationItem = {
  id: 'masterpiece_muong_phang',
  type: 'video',
  title: 'Khám Phá Sở Chỉ Huy Mường Phăng – Dấu Ấn Điện Biên Phủ',
  url: '/generated_videos/muong_phang_masterpiece.mp4',
  prompt: 'Phim tài liệu điện ảnh 4 cảnh quay: Rừng đại ngàn Mường Phăng -> Lán làm việc đơn sơ Đại tướng Võ Nguyên Giáp -> Đường hầm chỉ huy xuyên núi 69 mét -> Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries chiều 7/5/1954.',
  aspectRatio: '16:9',
  createdAt: 'Phim Mẫu Kiệt Tác 40s',
  model: 'GIAP-TRACE-CINEMATIC-MULTISCENE-STUDIO',
  engine: 'Hệ thống dựng phim đa cảnh tài liệu lịch sử Việt Nam',
  scenes: [
    {
      sceneNumber: 1,
      title: 'Đại ngàn Mường Phăng nguyên sinh',
      durationSec: 10,
      cameraAngle: 'Toàn cảnh flycam từ trên cao',
      motionType: 'Slow Zoom-In tiến vào rừng',
      visualPrompt: 'Khu rừng Mường Phăng che chở Sở chỉ huy tối cao trong làn sương sớm Tây Bắc.',
      voiceover: 'Mường Phăng - nơi đặt Sở chỉ huy tối cao của Chiến dịch Điện Biên Phủ, ẩn mình kín đáo dưới tán rừng già Tây Bắc.',
      soundFx: 'Tiếng suối reo xa xa, tiếng chim rừng đại ngàn, nhịp trống hành quân trầm ấm',
      matchedArchiveImage: '/assets/giap-curated/tu-anh-goc/giap_muong_phang_hq_1790321420287.webp'
    },
    {
      sceneNumber: 2,
      title: 'Lán làm việc đơn sơ của Đại tướng',
      durationSec: 10,
      cameraAngle: 'Trung cận cảnh bàn tác chiến',
      motionType: 'Pan ngang nhẹ sang ngọn đèn bão',
      visualPrompt: 'Bên trong căn lán tre mộc mạc trải bản đồ tác chiến và chiếc bàn tre đơn sơ.',
      voiceover: 'Chính tại căn lán mộc mạc này, những đêm không ngủ trăn trở đã đưa đến quyết định mang tính bước ngoặt của cả chiến dịch.',
      soundFx: 'Tiếng xào xạc lật bản đồ giấy bản, tiếng gió ngàn rít qua khe liếp',
      matchedArchiveImage: '/assets/aistudio/image_2f0495f9.png'
    },
    {
      sceneNumber: 3,
      title: 'Đường hầm chỉ huy xuyên lòng núi 69m',
      durationSec: 10,
      cameraAngle: 'Góc nhìn chiều sâu xuyên lòng núi',
      motionType: 'Push-In dọc vách hầm kiên cố',
      visualPrompt: 'Đường hầm chỉ huy dài 69 mét xuyên qua đồi Pu Cà gia cố bằng gỗ rừng vững chắc.',
      voiceover: 'Đường hầm xuyên núi dài 69 mét, cầu nối thông tin liên lạc thông suốt chỉ huy mọi mũi tiến công đánh chắc, tiến chắc vững vàng.',
      soundFx: 'Tiếng tích tắc của máy vô tuyến điện đàm, tiếng bước chân quân lệnh gấp gáp',
      matchedArchiveImage: '/assets/giap-curated/tu-anh-goc/d67_bunker_command_1790321434308.webp'
    },
    {
      sceneNumber: 4,
      title: 'Toàn thắng - Cờ đỏ sao vàng trên nóc hầm',
      durationSec: 10,
      cameraAngle: 'Góc thấp hào hùng hướng lên trời',
      motionType: 'Zoom-Out hé lộ cờ bay ngạo nghễ',
      visualPrompt: 'Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries chiều 7/5/1954.',
      voiceover: 'Ngày 7 tháng 5 năm 1954, lá cờ chiến thắng tung bay kiêu hãnh. Mường Phăng hoàn thành sứ mệnh lịch sử chấn động địa cầu.',
      soundFx: 'Khúc ca ca khúc giải phóng quân, tiếng hò reo khải hoàn vang dội núi đồi',
      matchedArchiveImage: '/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp'
    }
  ]
};

export const HistoryVideoStudio: React.FC<HistoryVideoStudioProps> = ({
  isDark,
  language = 'vi',
}) => {
  // Main Studio Navigation Tabs
  const [activeWorkspace, setActiveWorkspace] = useState<StudioWorkspace>('film-video');
  const [showDirectorAssistant, setShowDirectorAssistant] = useState<boolean>(false);

  // --- WORKSPACE 1: FILM VIDEO STATE ---
  const [scriptStartMode, setScriptStartMode] = useState<StartScriptMode>('suggested-themes');
  const [videoDuration, setVideoDuration] = useState<number>(45);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [videoStyle, setVideoStyle] = useState<string>('Phim tài liệu lịch sử');
  const [motionLevel, setMotionLevel] = useState<string>('Điện ảnh');
  const [creativeMode, setCreativeMode] = useState<'strict' | 'verified_recreation' | 'educational_fiction'>('strict');
  
  // Script content inputs
  const [filmTitle, setFilmTitle] = useState<string>('Khám phá Sở chỉ huy Mường Phăng – Dấu ấn Điện Biên Phủ');
  const [filmCoreIdea, setFilmCoreIdea] = useState<string>(SUGGESTED_THEMES[3].prompt);
  const [filmThemeMessage, setFilmThemeMessage] = useState<string>('Tôn vinh trí tuệ quân sự và quyết định chuyển phương châm tác chiến lịch sử của Đại tướng Võ Nguyên Giáp.');
  const [filmCharacters, setFilmCharacters] = useState<string>('Đại tướng Võ Nguyên Giáp, Bộ Tham mưu Chiến dịch, các chiến sĩ kéo pháo Điện Biên');
  const [filmNarrationText, setFilmNarrationText] = useState<string>(SUGGESTED_THEMES[3].prompt);

  // Script Verification
  const [isVerifyingScript, setIsVerifyingScript] = useState<boolean>(false);
  const [verificationReport, setVerificationReport] = useState<VerificationReport | null>({
    status: 'suitable',
    statusLabel: 'PHÙ HỢP',
    badgeColor: 'green',
    score: 95,
    summary: 'Kịch bản đạt chuẩn tư liệu lịch sử Việt Nam, sẵn sàng bước sang giai đoạn phân cảnh và dựng phim.',
    issues: [],
    correctedScript: filmNarrationText
  });

  // Storyboard breakdown
  const [storyboardScenes, setStoryboardScenes] = useState<SceneItem[]>(MASTERPIECE_MOVIE.scenes || []);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState<boolean>(false);

  // Audio & Voiceover
  const [selectedMusicTheme, setSelectedMusicTheme] = useState<string>('hanh-quan');
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState<string>('nam-tram');
  const [isPlayingAudioPreview, setIsPlayingAudioPreview] = useState<boolean>(false);
  const [isRecordingMic, setIsRecordingMic] = useState<boolean>(false);

  // Video Output & Player
  const [isRenderingVideo, setIsRenderingVideo] = useState<boolean>(false);
  const [renderProgressStep, setRenderProgressStep] = useState<string>('');
  const [activeVideoCreation, setActiveVideoCreation] = useState<GeneratedCreationItem>(MASTERPIECE_MOVIE);
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  // --- WORKSPACE 2: HISTORY PAINTER STATE ---
  const [painterPrompt, setPainterPrompt] = useState<string>('Bức tranh sơn dầu Đại tướng Võ Nguyên Giáp bên bàn tác chiến lán Mường Phăng, ánh đèn bão vàng ấm, phong cách hàn lâm cổ điển chân thực.');
  const [painterStyle, setPainterStyle] = useState<string>('oil-painting');
  const [painterAspectRatio, setPainterAspectRatio] = useState<'16:9' | '1:1' | '9:16'>('16:9');
  const [isPainting, setIsPainting] = useState<boolean>(false);
  const [activePainting, setActivePainting] = useState<GeneratedCreationItem | null>({
    id: 'paint_sample_1',
    type: 'image',
    title: 'Đại tướng Võ Nguyên Giáp bên bản đồ Mường Phăng',
    url: '/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_1789889827160.webp',
    prompt: 'Bức tranh sơn dầu Đại tướng Võ Nguyên Giáp bên bàn tác chiến lán Mường Phăng 1954.',
    aspectRatio: '16:9',
    createdAt: 'Tác phẩm mỹ thuật mẫu',
    model: 'gemini-3.1-flash-lite-image'
  });

  // --- WORKSPACE 3: PHOTO RESTORATION STATE ---
  const [selectedArchivalPhoto, setSelectedArchivalPhoto] = useState(ARCHIVAL_PHOTOS_FOR_RESTORE[0]);
  const [restorationMode, setRestorationMode] = useState<'faithful' | 'creative_color'>('creative_color');
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [restoredPhotoResult, setRestoredPhotoResult] = useState<{
    originalUrl: string;
    restoredUrl: string;
    modeLabel: string;
    ethicsNote: string;
  }>({
    originalUrl: ARCHIVAL_PHOTOS_FOR_RESTORE[0].url,
    restoredUrl: ARCHIVAL_PHOTOS_FOR_RESTORE[0].url,
    modeLabel: 'Chế độ B – Tái hiện sáng tạo có kiểm chứng',
    ethicsNote: 'Tác phẩm được dán nhãn phục dựng kỹ thuật số theo đúng quy chuẩn bảo tồn di sản tư liệu.'
  });

  // --- DIRECTOR ASSISTANT CHATBOT STATE ---
  const [directorQuestion, setDirectorQuestion] = useState<string>('');
  const [directorChatHistory, setDirectorChatHistory] = useState<Array<{ sender: 'user' | 'director'; text: string; actionTip?: string; snippet?: string }>>([
    {
      sender: 'director',
      text: 'Chào bạn! Tôi là Đạo diễn AI GIAP TRACE. Tôi có thể giúp bạn cấu trúc các cảnh quay, đẩy cao trào kịch tính cho thời điểm kéo pháo, hay kết nối bài học lịch sử hào hùng cho học sinh. Bạn muốn tư vấn phần nào?'
    }
  ]);
  const [isDirectorThinking, setIsDirectorThinking] = useState<boolean>(false);

  // Gallery History in LocalStorage
  const [studioCreationsHistory, setStudioCreationsHistory] = useState<GeneratedCreationItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('giap_trace_video_studio_history');
      if (saved) {
        setStudioCreationsHistory(JSON.parse(saved));
      } else {
        setStudioCreationsHistory([MASTERPIECE_MOVIE]);
      }
    } catch (e) {
      console.warn('Could not read history:', e);
    }
  }, []);

  const saveCreationToHistory = (item: GeneratedCreationItem) => {
    setStudioCreationsHistory(prev => {
      const updated = [item, ...prev.filter(x => x.id !== item.id).slice(0, 24)];
      try {
        localStorage.setItem('giap_trace_video_studio_history', JSON.stringify(updated));
        window.dispatchEvent(new Event('giap_trace_creations_updated'));
      } catch (e) {}
      return updated;
    });
  };

  // Video subtitle updater based on currentTime
  useEffect(() => {
    const video = videoPlayerRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentT = video.currentTime;
      if (activeVideoCreation?.scenes && activeVideoCreation.scenes.length > 0) {
        let accumulated = 0;
        let matched = false;
        for (const s of activeVideoCreation.scenes) {
          if (currentT >= accumulated && currentT < accumulated + s.durationSec) {
            setCurrentSubtitle(s.voiceover);
            matched = true;
            break;
          }
          accumulated += s.durationSec;
        }
        if (!matched && activeVideoCreation.scenes[activeVideoCreation.scenes.length - 1]) {
          setCurrentSubtitle(activeVideoCreation.scenes[activeVideoCreation.scenes.length - 1].voiceover);
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [activeVideoCreation]);

  // Voiceover TTS Synthesizer using Web Speech API (Vietnamese Natural Voice)
  const handlePreviewVoiceover = (textToSpeak: string) => {
    playCabinetClick();
    if (!('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc thuyết minh tự động.');
      return;
    }

    if (isPlayingAudioPreview) {
      window.speechSynthesis.cancel();
      setIsPlayingAudioPreview(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'vi-VN';
    utterance.rate = selectedVoiceStyle === 'nam-tram' ? 0.9 : 0.95;
    utterance.pitch = selectedVoiceStyle === 'nam-tram' ? 0.85 : (selectedVoiceStyle === 'nu-truyen-cam' ? 1.1 : 1.0);

    utterance.onstart = () => setIsPlayingAudioPreview(true);
    utterance.onend = () => setIsPlayingAudioPreview(false);
    utterance.onerror = () => setIsPlayingAudioPreview(false);

    window.speechSynthesis.speak(utterance);
  };

  // 1. Action: Historical Script Verification
  const handleVerifyScript = async () => {
    playCabinetClick();
    setIsVerifyingScript(true);
    try {
      const res = await fetch('/api/verify-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: filmNarrationText || filmCoreIdea,
          title: filmTitle,
          creativeMode
        })
      });
      const data: VerificationReport = await res.json();
      setVerificationReport(data);
    } catch (e) {
      console.error('Verify script error:', e);
    } finally {
      setIsVerifyingScript(false);
    }
  };

  // 2. Action: Generate Storyboard
  const handleGenerateStoryboard = async () => {
    playCabinetClick();
    setIsGeneratingStoryboard(true);
    try {
      const res = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: filmNarrationText || filmCoreIdea,
          duration: videoDuration,
          title: filmTitle
        })
      });
      const data = await res.json();
      if (data.scenes && data.scenes.length > 0) {
        setStoryboardScenes(data.scenes);
        setSelectedSceneIndex(0);
      }
    } catch (e) {
      console.error('Storyboard error:', e);
    } finally {
      setIsGeneratingStoryboard(false);
    }
  };

  // 3. Action: Render Multi-Scene Video
  const handleRenderMultiSceneVideo = async () => {
    playCabinetClick();
    setIsRenderingVideo(true);
    setRenderProgressStep('Thẩm định dữ liệu kịch bản & phân cảnh...');

    const timer1 = setTimeout(() => {
      setRenderProgressStep('Đang kết xuất các chuyển động ống kính điện ảnh (Ken Burns)...');
    }, 1500);

    const timer2 = setTimeout(() => {
      setRenderProgressStep('Hòa âm đa tầng: Nhạc nền hào hùng + Tiếng động chiến trường + Thuyết minh...');
    }, 3500);

    const timer3 = setTimeout(() => {
      setRenderProgressStep('Gắn phụ đề động & Xuất bản tệp phim tài liệu MP4...');
    }, 5500);

    try {
      const res = await fetch('/api/render-multiscene-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: storyboardScenes,
          duration: videoDuration,
          aspectRatio: videoAspectRatio,
          title: filmTitle,
          musicTheme: selectedMusicTheme
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Lỗi khi dựng phim.');

      const newCreation: GeneratedCreationItem = {
        id: `film_${Date.now()}`,
        type: 'video',
        title: filmTitle,
        url: data.videoUrl,
        prompt: filmNarrationText || filmCoreIdea,
        aspectRatio: videoAspectRatio,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'GIAP-TRACE-CINEMATIC-MULTISCENE-STUDIO',
        engine: data.engine,
        scenes: storyboardScenes
      };

      setActiveVideoCreation(newCreation);
      saveCreationToHistory(newCreation);

      setTimeout(() => {
        if (videoPlayerRef.current) {
          videoPlayerRef.current.currentTime = 0;
          videoPlayerRef.current.play().catch(() => {});
          setIsVideoPlaying(true);
        }
      }, 300);

    } catch (e: any) {
      alert(e.message || 'Không thể dựng phim. Vui lòng kiểm tra lại kịch bản.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsRenderingVideo(false);
      setRenderProgressStep('');
    }
  };

  // 4. Action: Paint Image
  const handleGenerateHistoricalImage = async () => {
    if (!painterPrompt.trim()) return;
    playCabinetClick();
    setIsPainting(true);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: painterPrompt,
          aspectRatio: painterAspectRatio
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Lỗi khi tạo ảnh.');

      const newPaintItem: GeneratedCreationItem = {
        id: `paint_${Date.now()}`,
        type: 'image',
        title: 'Họa phẩm lịch sử AI',
        url: data.imageUrl,
        prompt: painterPrompt,
        aspectRatio: painterAspectRatio,
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        model: data.model || 'gemini-3.1-flash-lite-image'
      };

      setActivePainting(newPaintItem);
      saveCreationToHistory(newPaintItem);

    } catch (e: any) {
      alert(e.message || 'Lỗi khi tạo hình ảnh.');
    } finally {
      setIsPainting(false);
    }
  };

  // 5. Action: Restore Photo
  const handleExecutePhotoRestoration = async (photoItem = selectedArchivalPhoto, mode = restorationMode) => {
    playCabinetClick();
    setIsRestoring(true);

    try {
      const res = await fetch('/api/restore-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photoUrl: photoItem.url,
          mode
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Lỗi khi phục chế ảnh.');

      setRestoredPhotoResult({
        originalUrl: photoItem.url,
        restoredUrl: data.restoredUrl,
        modeLabel: data.modeLabel,
        ethicsNote: data.ethicsNote
      });

      const restoredItem: GeneratedCreationItem = {
        id: `restore_${Date.now()}`,
        type: 'restoration',
        title: `Phục chế: ${photoItem.title}`,
        url: data.restoredUrl,
        beforeUrl: photoItem.url,
        prompt: `${photoItem.title} (${photoItem.year}) - ${data.modeLabel}`,
        aspectRatio: '16:9',
        createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        model: 'GIAP-TRACE-RESTORATION-ENGINE'
      };

      saveCreationToHistory(restoredItem);

    } catch (e: any) {
      alert(e.message || 'Lỗi khi phục chế ảnh tư liệu.');
    } finally {
      setIsRestoring(false);
    }
  };

  // 6. Action: Director Assistant Query
  const handleAskDirector = async (presetQuestion?: string) => {
    const q = presetQuestion || directorQuestion;
    if (!q.trim()) return;

    playCabinetClick();
    setDirectorChatHistory(prev => [...prev, { sender: 'user', text: q }]);
    setDirectorQuestion('');
    setIsDirectorThinking(true);

    try {
      const res = await fetch('/api/director-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          currentScript: filmNarrationText || filmCoreIdea
        })
      });

      const data = await res.json();
      setDirectorChatHistory(prev => [
        ...prev, 
        {
          sender: 'director',
          text: data.answer || 'Tôi đã phân tích kịch bản của bạn và sẵn sàng đưa ra phương án tối ưu.',
          actionTip: data.actionTip,
          snippet: data.suggestedSnippet
        }
      ]);
    } catch (e) {
      setDirectorChatHistory(prev => [
        ...prev,
        {
          sender: 'director',
          text: 'Rất tiếc, kết nối đến phòng đạo diễn tạm thời gián đoạn. Bạn có thể sử dụng các gợi ý kịch bản có sẵn ở thanh điều khiển.'
        }
      ]);
    } finally {
      setIsDirectorThinking(false);
    }
  };

  return (
    <div className="space-y-6 text-white pb-12">
      {/* 1. STUDIO MASTER BANNER */}
      <div className="p-6 sm:p-8 rounded-3xl border-2 border-[#D4A017] bg-gradient-to-br from-[#0B1426] via-[#1A0B0E] to-[#0B1426] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#DC2626]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#D4A017]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider px-3.5 py-1 rounded-full bg-[#991B1B] text-white shadow-md border border-red-400">
                <Film className="w-4 h-4 text-[#FDE047]" />
                XƯỞNG PHIM LỊCH SỬ AI – GIAP TRACE
              </span>
              <span className="text-xs font-bold text-[#FDE047] px-3 py-1 rounded-full bg-[#78350F]/50 border border-[#D4A017]">
                Đại tướng Võ Nguyên Giáp • Điện Biên Phủ 1954
              </span>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-400">
                Thẩm Định Chuẩn Mực Lịch Sử
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-serif tracking-tight drop-shadow-md">
              Studio Sáng Tạo & Tái Hiện Di Sản Lịch Sử Điện Ảnh
            </h1>
            <p className="text-sm sm:text-base text-stone-100 leading-relaxed font-medium">
              Không gian sáng tạo phim tài liệu đa cảnh quay, vẽ tranh lịch sử chân thực và phục dựng ảnh tư liệu đen trắng. Được kiểm chứng chặt chẽ theo 8 tiêu chuẩn lịch sử Việt Nam, giúp thế hệ trẻ cảm nhận sâu sắc khí phách anh hùng của dân tộc.
            </p>
          </div>

          {/* Quick Actions & Director Assistant Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                playCabinetClick();
                setShowDirectorAssistant(prev => !prev);
              }}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl border-2 font-black text-sm tracking-wider uppercase transition-all shadow-xl cursor-pointer ${
                showDirectorAssistant
                  ? 'bg-[#FDE047] text-stone-950 border-white ring-4 ring-[#D4A017]/50'
                  : 'bg-[#991B1B] text-white border-[#FDE047] hover:brightness-110'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{showDirectorAssistant ? 'Đóng Trợ Lý Đạo Diễn' : 'Trợ Lý Đạo Diễn AI'}</span>
            </button>
          </div>
        </div>

        {/* 3 WORKSPACES NAVIGATION BAR */}
        <div className="mt-8 pt-6 border-t border-[#D4A017]/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => { playCabinetClick(); setActiveWorkspace('film-video'); }}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all cursor-pointer text-left ${
              activeWorkspace === 'film-video'
                ? 'bg-[#991B1B] border-[#FDE047] shadow-xl ring-2 ring-[#D4A017]'
                : 'bg-[#0F172A]/80 border-stone-700 hover:border-amber-400'
            }`}
          >
            <div className={`p-3 rounded-xl ${activeWorkspace === 'film-video' ? 'bg-[#7F1D1D] text-[#FDE047]' : 'bg-stone-800 text-stone-300'}`}>
              <VideoIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-black uppercase text-[#FDE047]">Chức năng 1</div>
              <div className="text-sm font-black text-white">XƯỞNG PHIM – TẠO VIDEO AI</div>
              <div className="text-xs text-stone-200">Video đa cảnh • Chuyển động • Thuyết minh</div>
            </div>
          </button>

          <button
            onClick={() => { playCabinetClick(); setActiveWorkspace('history-painter'); }}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all cursor-pointer text-left ${
              activeWorkspace === 'history-painter'
                ? 'bg-[#991B1B] border-[#FDE047] shadow-xl ring-2 ring-[#D4A017]'
                : 'bg-[#0F172A]/80 border-stone-700 hover:border-amber-400'
            }`}
          >
            <div className={`p-3 rounded-xl ${activeWorkspace === 'history-painter' ? 'bg-[#7F1D1D] text-[#FDE047]' : 'bg-stone-800 text-stone-300'}`}>
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-black uppercase text-[#FDE047]">Chức năng 2</div>
              <div className="text-sm font-black text-white">HỌA SĨ LỊCH SỬ – TẠO ẢNH AI</div>
              <div className="text-xs text-stone-200">Tranh sơn dầu • Ký họa • Bản đồ tác chiến</div>
            </div>
          </button>

          <button
            onClick={() => { playCabinetClick(); setActiveWorkspace('photo-restoration'); }}
            className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all cursor-pointer text-left ${
              activeWorkspace === 'photo-restoration'
                ? 'bg-[#991B1B] border-[#FDE047] shadow-xl ring-2 ring-[#D4A017]'
                : 'bg-[#0F172A]/80 border-stone-700 hover:border-amber-400'
            }`}
          >
            <div className={`p-3 rounded-xl ${activeWorkspace === 'photo-restoration' ? 'bg-[#7F1D1D] text-[#FDE047]' : 'bg-stone-800 text-stone-300'}`}>
              <Split className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono font-black uppercase text-[#FDE047]">Chức năng 3</div>
              <div className="text-sm font-black text-white">PHỤC DỰNG KÝ ỨC – PHỤC CHẾ</div>
              <div className="text-xs text-stone-200">So sánh Trước/Sau • Tô màu lịch sử</div>
            </div>
          </button>
        </div>
      </div>

      {/* FLOATING / EXPANDABLE AI DIRECTOR ASSISTANT PANEL */}
      {showDirectorAssistant && (
        <div className="p-6 rounded-3xl border-2 border-[#D4A017] bg-[#111827] shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-stone-700 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-black text-white shadow-md">
                ĐD
              </div>
              <div>
                <h3 className="text-base font-black text-white">TRỢ LÝ ĐẠO DIỄN LỊCH SỬ AI – GIAP TRACE</h3>
                <p className="text-xs text-amber-200">Tư vấn phân cảnh, tạo cao trào kịch tính, kết nối bài học lịch sử</p>
              </div>
            </div>
            <button
              onClick={() => setShowDirectorAssistant(false)}
              className="text-stone-400 hover:text-white text-xs font-bold px-3 py-1 rounded-lg bg-stone-800 cursor-pointer"
            >
              Thu nhỏ
            </button>
          </div>

          {/* Chat scroll box */}
          <div className="max-h-72 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#090D16] border border-stone-700 font-medium">
            {directorChatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#991B1B] text-white rounded-br-xs'
                      : 'bg-[#1F2937] text-stone-100 border border-stone-600 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.actionTip && (
                    <div className="mt-2 pt-2 border-t border-stone-600 text-amber-300 font-bold text-xs flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Gợi ý đạo diễn: {msg.actionTip}</span>
                    </div>
                  )}
                  {msg.snippet && (
                    <div className="mt-2 p-2 rounded-lg bg-black/50 border border-amber-500/30 font-serif italic text-amber-100 text-xs">
                      “{msg.snippet}”
                      <button
                        onClick={() => {
                          playCabinetClick();
                          setFilmNarrationText(prev => `${prev}\n\n${msg.snippet}`);
                          setFilmCoreIdea(msg.snippet || '');
                        }}
                        className="mt-1 block text-amber-400 font-sans font-bold not-italic hover:underline cursor-pointer"
                      >
                        + Chèn ngay vào kịch bản phim
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isDirectorThinking && (
              <div className="flex items-center gap-2 text-xs text-amber-300">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đạo diễn đang suy ngẫm giải pháp nghệ thuật...</span>
              </div>
            )}
          </div>

          {/* Quick Director Suggestions */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="text-stone-400 self-center font-bold">Hỏi nhanh:</span>
            <button
              onClick={() => handleAskDirector('Gợi ý cách mở đầu phim xúc động')}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 cursor-pointer"
            >
              🎬 Mở đầu xúc động
            </button>
            <button
              onClick={() => handleAskDirector('Làm sao tăng kịch tính cho thời điểm kéo pháo?')}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 cursor-pointer"
            >
              ⚡ Tăng kịch tính kéo pháo
            </button>
            <button
              onClick={() => handleAskDirector('Kết nối bài học lịch sử cho học sinh')}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 cursor-pointer"
            >
              🎓 Bài học lịch sử học sinh
            </button>
          </div>

          {/* Input Box */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={directorQuestion}
              onChange={(e) => setDirectorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskDirector()}
              placeholder="Nhập câu hỏi nhờ Đạo diễn AI tư vấn (ví dụ: Cần góc quay nào để làm nổi bật sự mộc mạc của Đại tướng?)..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#060D1A] border border-stone-600 focus:border-[#D4A017] text-white text-xs sm:text-sm focus:outline-hidden"
            />
            <button
              onClick={() => handleAskDirector()}
              disabled={isDirectorThinking || !directorQuestion.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#991B1B] hover:bg-red-700 text-white font-bold text-xs sm:text-sm border border-[#FDE047] cursor-pointer"
            >
              Gửi Đạo Diễn
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 1: XƯỞNG PHIM – TẠO VIDEO AI                                   */}
      {/* ========================================================================= */}
      {activeWorkspace === 'film-video' && (
        <div className="space-y-6">
          
          {/* MASTERPIECE SHOWCASE BANNER */}
          <div className="p-5 sm:p-6 rounded-3xl border-2 border-[#D4A017]/70 bg-gradient-to-r from-[#180A0E] via-[#0E1726] to-[#0A101D] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#991B1B] border border-[#FDE047] flex items-center justify-center text-[#FDE047] shrink-0 shadow-lg">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-black text-[#FDE047] uppercase bg-red-950/80 px-2.5 py-0.5 rounded-sm border border-red-500/50">
                    BỘ PHIM MẪU SẴN SÀNG
                  </span>
                  <span className="text-xs text-stone-300 font-bold">4 Cảnh Quay • 40 Giây • Âm Thanh Hòa Quyện</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white font-serif">
                  “Khám phá Sở chỉ huy Mường Phăng – Dấu ấn Điện Biên Phủ”
                </h3>
                <p className="text-xs sm:text-sm text-stone-200 max-w-2xl font-medium">
                  Trải nghiệm ngay bộ phim mẫu hoàn chỉnh với 4 cảnh quay liên hoàn chân thực, giọng đọc hào hùng, phụ đề khớp dòng và nhạc nền điện ảnh.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
              <button
                onClick={() => {
                  playCabinetClick();
                  setActiveVideoCreation(MASTERPIECE_MOVIE);
                  setStoryboardScenes(MASTERPIECE_MOVIE.scenes || []);
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.currentTime = 0;
                    videoPlayerRef.current.play().catch(() => {});
                    setIsVideoPlaying(true);
                  }
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#991B1B] text-white font-black text-xs sm:text-sm border-2 border-[#FDE047] shadow-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#FDE047]" />
                <span>Xem Phim Mẫu Ngay</span>
              </button>
            </div>
          </div>

          {/* MAIN 2-COLUMN STUDIO WORKBENCH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: SCRIPT WRITING & CONTROLS (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. START MODES */}
              <div className="p-5 rounded-2xl bg-[#0F172A] border-2 border-stone-700 shadow-xl space-y-3">
                <div className="text-xs font-mono font-black uppercase tracking-wider text-[#FDE047] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />
                  BƯỚC 1: CHỌN CÁCH KHỞI TẠO KỊCH BẢN
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => { playCabinetClick(); setScriptStartMode('quick-idea'); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      scriptStartMode === 'quick-idea'
                        ? 'bg-[#991B1B] text-white border-[#FDE047] shadow-lg ring-2 ring-[#D4A017]'
                        : 'bg-[#1E293B] text-stone-200 border-stone-600 hover:border-amber-400'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">Cách 1: Ý Tưởng Nhanh</div>
                    <div className="text-[11px] text-amber-200">Nhập 1 ý tưởng ngắn</div>
                  </button>

                  <button
                    onClick={() => { playCabinetClick(); setScriptStartMode('suggested-themes'); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      scriptStartMode === 'suggested-themes'
                        ? 'bg-[#991B1B] text-white border-[#FDE047] shadow-lg ring-2 ring-[#D4A017]'
                        : 'bg-[#1E293B] text-stone-200 border-stone-600 hover:border-amber-400'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">Cách 2: Kịch Bản Gợi Ý</div>
                    <div className="text-[11px] text-amber-200">10 chủ đề thư viện</div>
                  </button>

                  <button
                    onClick={() => { playCabinetClick(); setScriptStartMode('custom-script'); }}
                    className={`p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                      scriptStartMode === 'custom-script'
                        ? 'bg-[#991B1B] text-white border-[#FDE047] shadow-lg ring-2 ring-[#D4A017]'
                        : 'bg-[#1E293B] text-stone-200 border-stone-600 hover:border-amber-400'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-black">Cách 3: Tự Viết Đầy Đủ</div>
                    <div className="text-[11px] text-amber-200">Nhập phân cảnh & thoại</div>
                  </button>
                </div>
              </div>

              {/* 2. SCRIPT BUILDER ACCORDING TO SELECTED START MODE */}
              <div className="p-5 rounded-2xl bg-[#0F172A] border-2 border-stone-700 shadow-xl space-y-4">
                
                {/* Cách 1: Ý tưởng nhanh */}
                {scriptStartMode === 'quick-idea' && (
                  <div className="space-y-3">
                    <label className="text-xs font-mono font-bold text-amber-300 uppercase block">
                      Nhập ý tưởng cốt lõi của bạn (AI sẽ tự động đề xuất phân cảnh & âm thanh):
                    </label>
                    <textarea
                      rows={3}
                      value={filmCoreIdea}
                      onChange={(e) => {
                        setFilmCoreIdea(e.target.value);
                        setFilmNarrationText(e.target.value);
                      }}
                      placeholder="Ví dụ: Làm video 45 giây giới thiệu sở chỉ huy Mường Phăng và vai trò quyết định trong Chiến dịch Điện Biên Phủ..."
                      className="w-full p-4 rounded-xl bg-[#060D1A] border-2 border-stone-600 text-white text-xs sm:text-sm focus:border-[#FDE047] focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Cách 2: Kịch bản gợi ý (10 chủ đề) */}
                {scriptStartMode === 'suggested-themes' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono font-bold text-amber-300 uppercase">
                        Chọn 1 trong 10 kịch bản lịch sử tiêu biểu:
                      </label>
                      <span className="text-[11px] text-stone-300 font-bold">Bấm để tự động điền</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto p-1">
                      {SUGGESTED_THEMES.map(t => (
                        <div
                          key={t.id}
                          onClick={() => {
                            playCabinetClick();
                            setFilmTitle(t.title);
                            setFilmCoreIdea(t.prompt);
                            setFilmNarrationText(t.prompt);
                            setVideoDuration(t.duration);
                          }}
                          className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                            filmTitle === t.title
                              ? 'bg-[#1E293B] border-[#FDE047] ring-2 ring-[#D4A017]'
                              : 'bg-[#090D16] border-stone-700 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-white">{t.title}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-200 border border-red-500/40">
                              {t.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-200 mt-1 line-clamp-2">{t.shortDesc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cách 3: Tự viết kịch bản chi tiết */}
                {scriptStartMode === 'custom-script' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-stone-300 mb-1 block">Tên bộ phim:</label>
                        <input
                          type="text"
                          value={filmTitle}
                          onChange={(e) => setFilmTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#060D1A] border border-stone-600 text-white text-xs font-bold focus:border-[#FDE047] focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-stone-300 mb-1 block">Nhân vật trung tâm:</label>
                        <input
                          type="text"
                          value={filmCharacters}
                          onChange={(e) => setFilmCharacters(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#060D1A] border border-stone-600 text-white text-xs font-bold focus:border-[#FDE047] focus:outline-hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-300 mb-1 block">Chủ đề & Thông điệp giáo dục:</label>
                      <input
                        type="text"
                        value={filmThemeMessage}
                        onChange={(e) => setFilmThemeMessage(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#060D1A] border border-stone-600 text-white text-xs focus:border-[#FDE047] focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-stone-300 mb-1 block">Nội dung kịch bản & Lời dẫn chuyện chi tiết:</label>
                      <textarea
                        rows={4}
                        value={filmNarrationText}
                        onChange={(e) => setFilmNarrationText(e.target.value)}
                        className="w-full p-3 rounded-xl bg-[#060D1A] border-2 border-stone-600 text-white text-xs leading-relaxed focus:border-[#FDE047] focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}

                {/* 3. BẢNG LỰA CHỌN TRƯỚC KHI TẠO PHIM (THỜI LƯỢNG, TỶ LỆ, PHONG CÁCH, CHUYỂN ĐỘNG, SÁNG TẠO) */}
                <div className="pt-3 border-t border-stone-700 space-y-3">
                  <div className="text-xs font-mono font-bold text-[#FDE047] uppercase">
                    BẢNG THIẾT LẬP ĐIỆN ẢNH:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* Duration */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Thời lượng:</label>
                      <select
                        value={videoDuration}
                        onChange={(e) => setVideoDuration(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        <option value={15}>15 giây (Mở đầu)</option>
                        <option value={30}>30 giây (Súc tích)</option>
                        <option value={40}>40 giây (Tiêu chuẩn)</option>
                        <option value={45}>45 giây (Chi tiết)</option>
                        <option value={60}>60 giây (Toàn diện)</option>
                      </select>
                    </div>

                    {/* Aspect Ratio */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Tỷ lệ khung hình:</label>
                      <select
                        value={videoAspectRatio}
                        onChange={(e) => setVideoAspectRatio(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        <option value="16:9">16:9 (YouTube / Chiếu màn ảnh)</option>
                        <option value="9:16">9:16 (TikTok / Reels / Shorts)</option>
                        <option value="1:1">1:1 (Mạng xã hội)</option>
                      </select>
                    </div>

                    {/* Style */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Phong cách:</label>
                      <select
                        value={videoStyle}
                        onChange={(e) => setVideoStyle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        <option value="Phim tài liệu lịch sử">Phim tài liệu lịch sử</option>
                        <option value="Phim điện ảnh tái hiện">Phim điện ảnh tái hiện</option>
                        <option value="Tranh lịch sử chuyển động">Tranh lịch sử chuyển động</option>
                        <option value="Tư liệu đen trắng">Tư liệu đen trắng 1954</option>
                        <option value="Ký ức màu phim cũ">Ký ức màu phim cũ</option>
                      </select>
                    </div>

                    {/* Creative Mode */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Chế độ sáng tạo:</label>
                      <select
                        value={creativeMode}
                        onChange={(e) => setCreativeMode(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        <option value="strict">Bám sát tư liệu gốc</option>
                        <option value="verified_recreation">Tái hiện có kiểm chứng</option>
                        <option value="educational_fiction">Tình huống giả định giáo dục</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. AI THẨM ĐỊNH KỊCH BẢN LỊCH SỬ (🟢/🟡/🔴) */}
                <div className="pt-3 border-t border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FDE047] uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      BƯỚC 2: AI THẨM ĐỊNH KỊCH BẢN (8 TIÊU CHUẨN LỊCH SỬ)
                    </span>
                    <button
                      onClick={handleVerifyScript}
                      disabled={isVerifyingScript}
                      className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-400 text-emerald-200 text-xs font-bold hover:bg-emerald-900 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {isVerifyingScript ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>Kiểm tra thẩm định ngay</span>
                    </button>
                  </div>

                  {verificationReport && (
                    <div className={`p-4 rounded-xl border-2 space-y-3 ${
                      verificationReport.badgeColor === 'green'
                        ? 'bg-[#062618] border-emerald-400 text-emerald-100'
                        : (verificationReport.badgeColor === 'yellow'
                          ? 'bg-[#2E1C06] border-amber-400 text-amber-100'
                          : 'bg-[#2E0B0B] border-red-500 text-red-100')
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            verificationReport.badgeColor === 'green' ? 'bg-emerald-400' : (verificationReport.badgeColor === 'yellow' ? 'bg-amber-400' : 'bg-red-500')
                          }`} />
                          <span className="font-mono font-black text-sm uppercase">
                            TRẠNG THÁI: {verificationReport.statusLabel}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-black/50 border border-white/20">
                          Độ tin cậy: {verificationReport.score}/100
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed font-medium">
                        {verificationReport.summary}
                      </p>

                      {/* Issues list if any */}
                      {verificationReport.issues.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/10">
                          {verificationReport.issues.map((iss) => (
                            <div key={iss.id} className="p-2.5 rounded-lg bg-black/40 border border-white/10 text-xs space-y-1">
                              <div className="font-bold flex items-center justify-between">
                                <span className="text-[#FDE047]">{iss.title} ({iss.category})</span>
                                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-900 text-amber-200">
                                  Cần chỉnh sửa
                                </span>
                              </div>
                              <p className="text-stone-300">{iss.reason}</p>
                              {iss.citation && (
                                <p className="text-[11px] text-amber-200 font-serif italic">Nguồn: {iss.citation}</p>
                              )}
                              <p className="text-emerald-300 font-bold">Đề xuất: {iss.suggestion}</p>
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              playCabinetClick();
                              if (verificationReport.correctedScript) {
                                setFilmNarrationText(verificationReport.correctedScript);
                                setFilmCoreIdea(verificationReport.correctedScript);
                              }
                            }}
                            className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
                          >
                            Áp Dụng Chỉnh Sửa Đề Xuất Của AI
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 5. PHÂN CHIA PHÂN CẢNH (STORYBOARD MULTI-SCENE) */}
                <div className="pt-3 border-t border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#FDE047] uppercase flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#FDE047]" />
                      BƯỚC 3: PHÂN CẢNH STORYBOARD ({storyboardScenes.length} CẢNH QUAY ĐA GÓC)
                    </span>
                    <button
                      onClick={handleGenerateStoryboard}
                      disabled={isGeneratingStoryboard}
                      className="px-3 py-1 rounded-lg bg-red-950 border border-red-400 text-red-200 text-xs font-bold hover:bg-red-900 transition-all cursor-pointer flex items-center gap-1"
                    >
                      {isGeneratingStoryboard ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}
                      <span>Tự động phân cảnh AI</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {storyboardScenes.map((sc, idx) => (
                      <div
                        key={idx}
                        onClick={() => { playCabinetClick(); setSelectedSceneIndex(idx); }}
                        className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                          selectedSceneIndex === idx
                            ? 'bg-[#1E293B] border-[#FDE047] ring-2 ring-[#D4A017]'
                            : 'bg-[#090D16] border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-1.5 border border-stone-800">
                          <img src={sc.matchedArchiveImage} alt={sc.title} className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold text-[#FDE047]">
                            Cảnh {sc.sceneNumber} • {sc.durationSec}s
                          </div>
                        </div>
                        <div className="text-xs font-bold text-white truncate">{sc.title}</div>
                        <div className="text-[10px] text-amber-300 truncate">{sc.cameraAngle}</div>
                      </div>
                    ))}
                  </div>

                  {/* Scene details editor */}
                  {storyboardScenes[selectedSceneIndex] && (
                    <div className="p-3.5 rounded-xl bg-[#08101F] border border-stone-700 text-xs space-y-2">
                      <div className="flex items-center justify-between text-amber-300 font-bold">
                        <span>Chi tiết Phân cảnh {storyboardScenes[selectedSceneIndex].sceneNumber}: {storyboardScenes[selectedSceneIndex].title}</span>
                        <span>Thời lượng: {storyboardScenes[selectedSceneIndex].durationSec} giây</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-300">
                        <div>
                          <strong className="text-white">Góc quay:</strong> {storyboardScenes[selectedSceneIndex].cameraAngle}
                        </div>
                        <div>
                          <strong className="text-white">Chuyển động:</strong> {storyboardScenes[selectedSceneIndex].motionType}
                        </div>
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Lời thuyết minh:</strong>
                        <div className="p-2 rounded bg-black/50 border border-stone-700 text-stone-200 font-serif italic text-xs flex items-center justify-between gap-2">
                          <span>“{storyboardScenes[selectedSceneIndex].voiceover}”</span>
                          <button
                            onClick={() => handlePreviewVoiceover(storyboardScenes[selectedSceneIndex].voiceover)}
                            className="px-2.5 py-1 rounded bg-[#991B1B] text-white font-bold text-[10px] hover:bg-red-700 cursor-pointer shrink-0"
                          >
                            {isPlayingAudioPreview ? 'Dừng đọc' : 'Nghe thử giọng'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. THƯ VIỆN ÂM THANH & GIỌNG ĐỌC */}
                <div className="pt-3 border-t border-stone-700 space-y-3">
                  <div className="text-xs font-mono font-bold text-[#FDE047] uppercase flex items-center gap-1.5">
                    <Music className="w-4 h-4 text-[#FDE047]" />
                    BƯỚC 4: THƯ VIỆN NHẠC NỀN & GIỌNG THUYẾT MINH
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Music selector */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Giai điệu hào hùng (8 chủ đề):</label>
                      <select
                        value={selectedMusicTheme}
                        onChange={(e) => setSelectedMusicTheme(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        {AUDIO_THEMES.map(m => (
                          <option key={m.id} value={m.id}>🎵 {m.name} - {m.vibe}</option>
                        ))}
                      </select>
                    </div>

                    {/* Voice selector */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-300 block mb-1">Giọng đọc lịch sử Việt Nam:</label>
                      <select
                        value={selectedVoiceStyle}
                        onChange={(e) => setSelectedVoiceStyle(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#060D1A] border border-stone-600 text-white text-xs font-bold"
                      >
                        {VOICE_STYLES.map(v => (
                          <option key={v.id} value={v.id}>🎙️ {v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* MAIN ACTION BUTTON: DỰNG PHIM ĐA CẢNH */}
                <button
                  onClick={handleRenderMultiSceneVideo}
                  disabled={isRenderingVideo}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-2xl flex items-center justify-center gap-3 cursor-pointer ${
                    isRenderingVideo
                      ? 'bg-stone-800 text-stone-500 cursor-not-allowed border-2 border-stone-700'
                      : 'bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#991B1B] text-white hover:brightness-110 active:scale-[0.99] border-2 border-[#FDE047] shadow-red-900/60'
                  }`}
                >
                  {isRenderingVideo ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin text-[#FDE047]" />
                      <span>{renderProgressStep || 'Đang dựng phim tài liệu điện ảnh...'}</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-5 h-5 text-[#FDE047]" />
                      <span>TIẾN HÀNH DỰNG PHIM ĐA CẢNH ({videoDuration} GIÂY)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: CINEMATIC SCREEN & PLAYER (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-5 sm:p-6 rounded-3xl border-2 border-stone-700 bg-[#0F172A] shadow-2xl h-full flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-700">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-white">
                      MÀN HÌNH CHIẾU PHIM TÀI LIỆU
                    </span>
                  </div>
                  <span className="text-xs font-mono font-black px-2.5 py-1 rounded-full bg-[#D4A017] text-stone-950 border border-white">
                    {activeVideoCreation.aspectRatio}
                  </span>
                </div>

                {/* VIDEO PLAYER SCREEN WITH DYNAMIC SUBTITLES */}
                <div className="relative flex-1 flex flex-col items-center justify-center bg-black rounded-2xl overflow-hidden min-h-[380px] border-2 border-stone-800 shadow-inner group">
                  <video
                    ref={videoPlayerRef}
                    src={activeVideoCreation.url}
                    controls
                    autoPlay
                    loop
                    playsInline
                    className={`w-full max-h-[460px] object-contain rounded-xl ${
                      activeVideoCreation.aspectRatio === '9:16' ? 'max-w-[280px]' : 'w-full'
                    }`}
                  />

                  {/* Synchronized dynamic subtitle overlay */}
                  {currentSubtitle && (
                    <div className="absolute bottom-12 inset-x-4 pointer-events-none text-center">
                      <span className="inline-block px-4 py-1.5 rounded-lg bg-black/85 text-[#FDE047] font-serif font-bold text-xs sm:text-sm shadow-2xl border border-amber-500/30">
                        {currentSubtitle}
                      </span>
                    </div>
                  )}
                </div>

                {/* FILM INFO & DOWNLOAD CONTROLS */}
                <div className="mt-4 pt-4 border-t border-stone-700 space-y-3">
                  <div>
                    <h4 className="text-sm font-black text-white font-serif">{activeVideoCreation.title}</h4>
                    <p className="text-xs text-stone-300 line-clamp-2 italic font-serif mt-0.5">“{activeVideoCreation.prompt}”</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2">
                    <a
                      href={activeVideoCreation.url}
                      download={`giap_trace_film_${Date.now()}.mp4`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4A017] text-stone-950 text-xs sm:text-sm font-black shadow-lg hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-stone-950" />
                      <span>Tải Phim MP4 Về Máy</span>
                    </a>

                    <button
                      onClick={() => {
                        if (videoPlayerRef.current) {
                          videoPlayerRef.current.currentTime = 0;
                          videoPlayerRef.current.play();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E293B] text-white border border-stone-600 text-xs font-bold hover:bg-stone-700 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#FDE047]" />
                      <span>Phát Lại Từ Đầu</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: activeVideoCreation.title,
                            text: activeVideoCreation.prompt,
                            url: window.location.href
                          }).catch(() => {});
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1E293B] text-white border border-stone-600 text-xs font-bold hover:bg-stone-700 cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-stone-300" />
                      <span>Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 2: HỌA SĨ LỊCH SỬ – TẠO ẢNH AI                                 */}
      {/* ========================================================================= */}
      {activeWorkspace === 'history-painter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-stone-700 shadow-xl space-y-4">
              <div className="text-xs font-mono font-black uppercase tracking-wider text-[#FDE047] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />
                HỌA SĨ LỊCH SỬ: TẠO TRANH & MINH HỌA DI SẢN
              </div>

              {/* Style selector */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-2">Chọn phong cách mỹ thuật lịch sử:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {HISTORICAL_ART_STYLES.map(st => (
                    <button
                      key={st.id}
                      onClick={() => { playCabinetClick(); setPainterStyle(st.id); }}
                      className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                        painterStyle === st.id
                          ? 'bg-[#991B1B] border-[#FDE047] shadow-lg ring-2 ring-[#D4A017]'
                          : 'bg-[#1E293B] border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="text-xs font-black text-white">{st.name}</div>
                      <div className="text-[10px] text-stone-300 mt-1 line-clamp-2">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-stone-300">Tỷ lệ ảnh:</span>
                {(['16:9', '1:1', '9:16'] as const).map(ar => (
                  <button
                    key={ar}
                    onClick={() => { playCabinetClick(); setPainterAspectRatio(ar); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      painterAspectRatio === ar
                        ? 'bg-[#D4A017] text-stone-950 font-black'
                        : 'bg-stone-800 text-stone-300 border border-stone-600'
                    }`}
                  >
                    {ar}
                  </button>
                ))}
              </div>

              {/* Prompt Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-300 block">Mô tả bức tranh lịch sử cần tái hiện:</label>
                <textarea
                  rows={4}
                  value={painterPrompt}
                  onChange={(e) => setPainterPrompt(e.target.value)}
                  placeholder="Ví dụ: Bức tranh sơn dầu Đại tướng Võ Nguyên Giáp bên bàn tác chiến lán Mường Phăng, ánh đèn bão vàng ấm, phong cách hàn lâm cổ điển chân thực..."
                  className="w-full p-4 rounded-xl bg-[#060D1A] border-2 border-stone-600 text-white text-xs sm:text-sm focus:border-[#FDE047] focus:outline-hidden"
                />
              </div>

              {/* Quick Prompt Presets */}
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="text-stone-400 self-center font-bold">Chủ đề gợi ý:</span>
                <button
                  onClick={() => setPainterPrompt('Chân dung sơn dầu Đại tướng Võ Nguyên Giáp năm 1954, nét mặt cương nghị, ánh mắt quắc thước đầy nhân văn, phong cách cổ điển hàn lâm.')}
                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                >
                  Chân dung Đại tướng
                </button>
                <button
                  onClick={() => setPainterPrompt('Bản đồ tác chiến Chiến dịch Điện Biên Phủ vẽ tay trên nền giấy ố vàng thời chiến, chi tiết các phân khu Him Lam, Độc Lập, Bản Kéo và Mường Thanh.')}
                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                >
                  Bản đồ tác chiến
                </button>
                <button
                  onClick={() => setPainterPrompt('Tranh cổ động kháng chiến: Toàn dân một lòng hướng về Điện Biên Phủ, đoàn xe thồ và dân công hỏa tuyến rầm rộ tiến bước.')}
                  className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                >
                  Tranh cổ động
                </button>
              </div>

              {/* Generate Image Button */}
              <button
                onClick={handleGenerateHistoricalImage}
                disabled={isPainting || !painterPrompt.trim()}
                className="w-full py-3.5 rounded-xl bg-[#991B1B] hover:bg-red-700 border-2 border-[#FDE047] text-white font-black text-sm uppercase tracking-wider shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPainting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#FDE047]" />
                    <span>Họa sĩ AI đang phác họa bức tranh...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5 text-[#FDE047]" />
                    <span>Khởi Tạo Họa Phẩm Lịch Sử AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: PAINTING CANVAS PREVIEW */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-stone-700 shadow-xl flex flex-col justify-between h-full">
              <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                <span className="text-xs font-mono font-black text-white uppercase">KHUNG TRANH KỸ THUẬT SỐ</span>
                {activePainting && (
                  <span className="text-xs font-mono text-[#FDE047]">{activePainting.aspectRatio}</span>
                )}
              </div>

              <div className="relative flex-1 flex items-center justify-center bg-black rounded-2xl overflow-hidden min-h-[360px] my-4 border border-stone-800">
                {activePainting ? (
                  <img
                    src={activePainting.url}
                    alt={activePainting.prompt}
                    className="w-full h-full object-contain max-h-[460px] rounded-xl"
                  />
                ) : (
                  <div className="text-center p-6 text-stone-400">
                    <ImageIcon className="w-16 h-16 mx-auto stroke-1 mb-2 text-stone-600" />
                    <p className="text-xs">Chưa có tác phẩm nào. Hãy bấm "Khởi Tạo Họa Phẩm Lịch Sử AI" để chiêm ngưỡng.</p>
                  </div>
                )}
              </div>

              {activePainting && (
                <div className="space-y-3 pt-3 border-t border-stone-700">
                  <p className="text-xs text-stone-300 italic font-serif">“{activePainting.prompt}”</p>
                  
                  {/* Fine-tuning buttons */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="text-stone-400 self-center">Tinh chỉnh:</span>
                    <button
                      onClick={() => setPainterPrompt(prev => `${prev}, tăng ánh nắng vàng hoài niệm của hoàng hôn Tây Bắc`)}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                    >
                      + Ánh hoàng hôn
                    </button>
                    <button
                      onClick={() => setPainterPrompt(prev => `${prev}, mở rộng góc nhìn toàn cảnh rộng hơn (wide cinematic shot)`)}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                    >
                      + Góc rộng hơn
                    </button>
                    <button
                      onClick={() => setPainterPrompt(prev => `${prev}, tăng chi tiết sương mờ núi rừng Tây Bắc`)}
                      className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 cursor-pointer"
                    >
                      + Thêm sương mờ
                    </button>
                  </div>

                  <a
                    href={activePainting.url}
                    download={`giap_trace_art_${Date.now()}.png`}
                    className="w-full py-2.5 rounded-xl bg-[#D4A017] hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Họa Phẩm Về Máy</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 3: PHỤC DỰNG KÝ ỨC – PHỤC CHẾ ẢNH (BEFORE / AFTER SLIDER)       */}
      {/* ========================================================================= */}
      {activeWorkspace === 'photo-restoration' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT COLUMN: ARCHIVE PHOTO SELECTOR & RESTORATION SETTINGS (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-stone-700 shadow-xl space-y-4">
                <div className="text-xs font-mono font-black uppercase tracking-wider text-[#FDE047] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D4A017]" />
                  1. CHỌN ẢNH TƯ LIỆU GỐC CẦN PHỤC HỒI
                </div>

                <div className="space-y-2.5">
                  {ARCHIVAL_PHOTOS_FOR_RESTORE.map(ph => {
                    const isSelected = selectedArchivalPhoto.id === ph.id;
                    return (
                      <div
                        key={ph.id}
                        onClick={() => {
                          playCabinetClick();
                          setSelectedArchivalPhoto(ph);
                          handleExecutePhotoRestoration(ph, restorationMode);
                        }}
                        className={`p-3 rounded-xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#1E293B] border-[#FDE047] ring-2 ring-[#D4A017]'
                            : 'bg-[#090D16] border-stone-700 hover:border-amber-400'
                        }`}
                      >
                        <img src={ph.url} alt={ph.title} className="w-16 h-12 object-cover rounded-lg border border-stone-700 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-white truncate">{ph.title}</h4>
                            <span className="text-[10px] font-mono font-bold text-amber-300">{ph.year}</span>
                          </div>
                          <p className="text-[11px] text-stone-300 truncate mt-0.5">{ph.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Restoration Modes: Chế độ A vs Chế độ B */}
                <div className="pt-3 border-t border-stone-700 space-y-3">
                  <label className="text-xs font-bold text-stone-300 block">Chọn chế độ phục dựng di sản:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        playCabinetClick();
                        setRestorationMode('faithful');
                        handleExecutePhotoRestoration(selectedArchivalPhoto, 'faithful');
                      }}
                      className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                        restorationMode === 'faithful'
                          ? 'bg-[#991B1B] border-[#FDE047] ring-2 ring-[#D4A017]'
                          : 'bg-[#1E293B] border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="text-xs font-black text-white">Chế độ A: Trung Thực</div>
                      <div className="text-[10px] text-stone-300 mt-1">Làm rõ nét, khử xước, giữ nguyên đen trắng</div>
                    </button>

                    <button
                      onClick={() => {
                        playCabinetClick();
                        setRestorationMode('creative_color');
                        handleExecutePhotoRestoration(selectedArchivalPhoto, 'creative_color');
                      }}
                      className={`p-3 rounded-xl border-2 text-left cursor-pointer transition-all ${
                        restorationMode === 'creative_color'
                          ? 'bg-[#991B1B] border-[#FDE047] ring-2 ring-[#D4A017]'
                          : 'bg-[#1E293B] border-stone-700 hover:border-amber-400'
                      }`}
                    >
                      <div className="text-xs font-black text-white">Chế độ B: Tái Hiện Màu</div>
                      <div className="text-[10px] text-stone-300 mt-1">Tô màu lịch sử có kiểm chứng, màu ấm</div>
                    </button>
                  </div>
                </div>

                {/* Ethics Badge */}
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 leading-relaxed font-medium">
                  ⚖️ <strong>Quy chuẩn bảo tồn di sản:</strong> Bản phục dựng kỹ thuật số được gắn nhãn minh bạch, không thay thế tài liệu lịch sử gốc đã được lưu trữ quốc gia.
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE BEFORE/AFTER SLIDER (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-3xl bg-[#0F172A] border-2 border-stone-700 shadow-xl space-y-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                  <div className="flex items-center gap-2">
                    <Split className="w-5 h-5 text-[#FDE047]" />
                    <span className="text-xs sm:text-sm font-mono font-black text-white uppercase">
                      SO SÁNH TƯƠNG TÁC TRƯỚC / SAU PHỤC CHẾ
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-300">
                    Kéo thanh trượt để so sánh
                  </span>
                </div>

                {/* SLIDER CONTAINER */}
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black select-none border-2 border-stone-800 shadow-2xl">
                  {/* Restored Layer (Underneath / Right) */}
                  <img
                    src={restoredPhotoResult.restoredUrl}
                    alt="Restored Photo"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-600/90 text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-black shadow-md border border-emerald-400">
                    SAU PHỤC DỰNG ({restorationMode === 'creative_color' ? 'MÀU TỰ NHIÊN' : 'RÕ NÉT B&W'})
                  </div>

                  {/* Original Layer (Top with clip-path / Left) */}
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                  >
                    <img
                      src={restoredPhotoResult.originalUrl}
                      alt="Original Photo"
                      className="absolute inset-0 w-full h-full object-cover filter grayscale contrast-125"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/90 text-white px-2.5 py-1 rounded-md text-[11px] font-mono font-black shadow-md border border-stone-600">
                      ẢNH GỐC 1954
                    </div>
                  </div>

                  {/* Drag Line Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-[#FDE047] shadow-[0_0_15px_rgba(253,224,71,0.8)] pointer-events-none"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D4A017] border-2 border-white flex items-center justify-center shadow-2xl">
                      <Split className="w-4 h-4 text-stone-950" />
                    </div>
                  </div>

                  {/* Invisible Range Input for 60fps buttery smooth dragging */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  />
                </div>

                {/* Metadata & Download Bar */}
                <div className="pt-3 border-t border-stone-700 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-black text-white">{selectedArchivalPhoto.title}</h4>
                    <p className="text-xs text-amber-200">{restoredPhotoResult.modeLabel}</p>
                  </div>

                  <a
                    href={restoredPhotoResult.restoredUrl}
                    download={`giap_trace_restored_${Date.now()}.png`}
                    className="px-4 py-2.5 rounded-xl bg-[#D4A017] text-stone-950 font-black text-xs sm:text-sm hover:brightness-110 flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải Ảnh Đã Phục Chế</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. RECENT CREATIONS STUDIO GALLERY */}
      {studioCreationsHistory.length > 0 && (
        <div className="p-6 rounded-3xl border-2 border-stone-700 bg-[#0F172A] shadow-xl space-y-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-[#FDE047]" />
              <h3 className="text-sm sm:text-base font-black text-white">
                Bộ Sưu Tập Tác Phẩm Studio Đã Sáng Tạo ({studioCreationsHistory.length})
              </h3>
            </div>
            <span className="text-xs text-amber-300 font-bold">
              Đồng bộ tự động với mục “Của tôi”
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3.5">
            {studioCreationsHistory.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  playCabinetClick();
                  if (item.type === 'video') {
                    setActiveWorkspace('film-video');
                    setActiveVideoCreation(item);
                  } else if (item.type === 'image') {
                    setActiveWorkspace('history-painter');
                    setActivePainting(item);
                  }
                }}
                className="p-2.5 rounded-xl border-2 border-stone-700 bg-[#08101F] hover:border-[#D4A017] transition-all cursor-pointer group"
              >
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black mb-2 border border-stone-800">
                  {item.type === 'video' ? (
                    <video src={item.url} className="w-full h-full object-cover" />
                  ) : (
                    <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-1 left-1 bg-black/80 px-1.5 py-0.5 rounded-sm text-[9px] font-mono font-black text-[#FDE047]">
                    {item.type.toUpperCase()}
                  </div>
                </div>
                <div className="text-xs font-bold text-white truncate group-hover:text-[#FDE047] transition-colors">
                  {item.title || item.prompt}
                </div>
                <div className="text-[10px] font-mono font-bold text-amber-300 mt-0.5">
                  {item.createdAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
