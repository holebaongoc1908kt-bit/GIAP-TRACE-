import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Award, 
  BarChart3, 
  CheckCircle, 
  Sparkles, 
  Save, 
  Trash2, 
  Compass, 
  FileText, 
  ShieldCheck, 
  MapPin, 
  HelpCircle,
  TrendingUp,
  Flame,
  ArrowRight,
  Info,
  Film,
  Video,
  Download,
  Play,
  Pause,
  RotateCcw,
  X,
  Maximize2,
  ExternalLink,
  Share2,
  Sliders,
  Filter
} from 'lucide-react';
import { 
  LearningJournalEntry, 
  PerceptionSurveyData, 
  DiscoveryBadge 
} from '../types';
import { 
  DISCOVERY_BADGES, 
  DEFAULT_SURVEY_DATA 
} from '../data/learningData';
import { playSuccessChime, playRadarPing, playCabinetClick } from '../utils/soundEffects';

export interface SavedCreation {
  id: string;
  type: 'video' | 'image';
  url: string;
  prompt: string;
  aspectRatio: '16:9' | '9:16';
  createdAt: string;
  model: string;
  engine?: string;
}

interface MySpaceViewProps {
  isDark: boolean;
  onNavigateToTab: (tab: any) => void;
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export const MySpaceView: React.FC<MySpaceViewProps> = ({
  isDark,
  onNavigateToTab,
  onOpenArchiveDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'creations' | 'journal' | 'badges' | 'survey'>('creations');

  // AI Film Studio Creations State
  const [creations, setCreations] = useState<SavedCreation[]>([]);
  const [creationFilter, setCreationFilter] = useState<'all' | 'video' | 'image'>('all');
  const [selectedCreation, setSelectedCreation] = useState<SavedCreation | null>(null);
  const [isPlayingModalVideo, setIsPlayingModalVideo] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  // Load creations from localStorage with live event synchronization
  useEffect(() => {
    const loadCreations = () => {
      try {
        const saved = localStorage.getItem('giap_trace_video_studio_history');
        if (saved) {
          setCreations(JSON.parse(saved));
        } else {
          // Fallback default demo creation
          const defaultList: SavedCreation[] = [
            {
              id: 'demo_dienbien_phao',
              type: 'video',
              url: '/generated_videos/cinematic_1794309576927_disyh.mp4',
              prompt: 'Khung cảnh các chiến sĩ Điện Biên Phủ và dân công kéo pháo hạng nặng 105mm vượt qua đèo dốc hiểm trở trong màn sương mù Tây Bắc năm 1954. Phong cách phim tài liệu điện ảnh hào hùng chân thực.',
              aspectRatio: '16:9',
              createdAt: 'Hôm nay',
              model: 'gemini-omni-1.2-flash',
              engine: 'Bộ dựng phim tài liệu điện ảnh GIAP TRACE'
            }
          ];
          setCreations(defaultList);
        }
      } catch (e) {
        console.warn('Could not read studio history in MySpaceView:', e);
      }
    };

    loadCreations();
    window.addEventListener('giap_trace_creations_updated', loadCreations);
    window.addEventListener('storage', loadCreations);
    return () => {
      window.removeEventListener('giap_trace_creations_updated', loadCreations);
      window.removeEventListener('storage', loadCreations);
    };
  }, []);

  const handleDeleteCreation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    playCabinetClick();
    setCreations(prev => {
      const updated = prev.filter(c => c.id !== id);
      try {
        localStorage.setItem('giap_trace_video_studio_history', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
    if (selectedCreation?.id === id) {
      setSelectedCreation(null);
    }
  };

  // Journal State
  const [journalEntries, setJournalEntries] = useState<LearningJournalEntry[]>([
    {
      id: 'j-init-1',
      date: 'Hôm nay',
      impressiveEvent: 'Quyết định chuyển phương châm Điện Biên Phủ từ Đánh nhanh thắng nhanh sang Đánh chắc tiến chắc',
      newKnowledge: 'Em bất ngờ khi biết Đại tướng từng là thầy giáo dạy môn lịch sử và tự học nghệ thuật quân sự',
      qualityToLearn: 'Bản lĩnh trách nhiệm, tôn trọng thực tiễn khách quan và xót thương từng giọt máu chiến sĩ',
      wantToExploreMore: 'Tìm hiểu thêm về chiến dịch Biên Giới 1950 và các văn bản sắc lệnh thời 1945'
    }
  ]);

  // Form input state
  const [impressiveEvent, setImpressiveEvent] = useState('');
  const [newKnowledge, setNewKnowledge] = useState('');
  const [qualityToLearn, setQualityToLearn] = useState('');
  const [wantToExploreMore, setWantToExploreMore] = useState('');

  // Survey State
  const [surveyData, setSurveyData] = useState<PerceptionSurveyData>(DEFAULT_SURVEY_DATA);
  const [isEditingPreSurvey, setIsEditingPreSurvey] = useState(false);
  const [isEditingPostSurvey, setIsEditingPostSurvey] = useState(false);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!impressiveEvent.trim() && !newKnowledge.trim()) return;

    playSuccessChime();
    const newEntry: LearningJournalEntry = {
      id: 'j-' + Date.now(),
      date: 'Vừa xong',
      impressiveEvent: impressiveEvent.trim(),
      newKnowledge: newKnowledge.trim(),
      qualityToLearn: qualityToLearn.trim(),
      wantToExploreMore: wantToExploreMore.trim()
    };

    setJournalEntries([newEntry, ...journalEntries]);
    setImpressiveEvent('');
    setNewKnowledge('');
    setQualityToLearn('');
    setWantToExploreMore('');
  };

  const handleDeleteJournal = (id: string) => {
    setJournalEntries(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-6 animate-in fade-in duration-300">
      {/* Space Header */}
      <div className={`p-6 rounded-3xl border-2 ${
        isDark 
          ? 'bg-gradient-to-br from-[#1E293B] via-[#162238] to-[#0F172A] border-[#D4A017]/50 text-white shadow-xl' 
          : 'bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-[#D4A017]/50 text-[#0F172A] shadow-md'
      } relative overflow-hidden`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#B91C1C] text-white border border-yellow-400/40 shadow-xs">
                KHÔNG GIAN CÁ NHÂN
              </span>
              <span className="text-xs text-stone-500 dark:text-[#CBD5E1] font-mono">HÀNH TRÌNH TRƯỞNG THÀNH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#B91C1C] dark:text-[#D4A017] tracking-tight font-serif">
              Của Tôi: Nhật ký, Tiến trình & Nhận thức
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-[#CBD5E1] leading-relaxed font-medium">
              Ghi lại những điều bạn học được hôm nay, theo dõi bộ sưu tập huy hiệu khám phá và đối chiếu sự thay đổi nhận thức trước - sau quá trình trải nghiệm.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-2xl bg-amber-500/10 text-[#B45309] dark:text-[#D4A017] border border-[#D4A017]/40">
              {creations.length} tác phẩm AI
            </span>
            <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30">
              {journalEntries.length} bài ghi chép
            </span>
          </div>
        </div>

        {/* 4 Sub-tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-5 mt-4 border-t border-[#D4A017]/30 no-scrollbar">
          {[
            { id: 'creations', label: 'Bộ Sưu Tập Tác Phẩm AI', icon: Film, count: creations.length },
            { id: 'journal', label: 'Nhật ký Khám phá', icon: BookOpen, count: journalEntries.length },
            { id: 'badges', label: 'Huy hiệu Khám phá', icon: Award },
            { id: 'survey', label: 'Khảo sát Nhận thức', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playRadarPing();
                  setActiveTab(item.id as any);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#B91C1C] text-white shadow-md ring-2 ring-[#D4A017]'
                    : isDark
                    ? 'bg-slate-800 text-slate-200 hover:border-[#D4A017] border border-slate-700'
                    : 'bg-white text-stone-800 border border-stone-300 shadow-xs hover:border-[#D4A017]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#D4A017]" />
                <span>{item.label}</span>
                {typeof item.count === 'number' && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-black/30 text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 0. BỘ SƯU TẬP TÁC PHẨM LỊCH SỬ AI (TỪ XƯỞNG PHIM AI) */}
      {activeTab === 'creations' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Section Banner & Filter Header */}
          <div className={`p-5 sm:p-6 rounded-3xl border-2 ${
            isDark 
              ? 'bg-gradient-to-br from-[#0F172A] via-[#10221A] to-[#0A101D] border-[#D4A017]/50 text-white shadow-xl' 
              : 'bg-gradient-to-br from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-[#D4A017]/50 text-[#0F172A] shadow-md'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-mono font-black uppercase tracking-wider px-3 py-0.5 rounded-full bg-[#B91C1C] text-white shadow-xs">
                    <Film className="w-3.5 h-3.5" />
                    BỘ SƯU TẬP CÁ NHÂN
                  </span>
                  <span className="text-xs font-mono font-bold text-[#D4A017]">
                    TÁC PHẨM ĐIỆN ẢNH LỊCH SỬ AI
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
                  Các Video & Hình Ảnh Do Bạn Sáng Tạo
                </h2>
                <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl leading-relaxed font-medium">
                  Toàn bộ các thước phim điện ảnh và tranh ảnh lịch sử bạn đã khởi tạo từ Xưởng phim AI được lưu trữ an toàn tại đây để bạn có thể xem lại, phát toàn màn hình hoặc tải về bất cứ lúc nào.
                </p>
              </div>

              {/* Action: Open Studio */}
              <button
                onClick={() => {
                  playRadarPing();
                  onNavigateToTab('archives');
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white text-xs sm:text-sm font-black shadow-lg hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer border border-[#FDE047] shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#FDE047]" />
                <span>Đến Xưởng Phim AI Tạo Mới</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Chips Bar */}
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-stone-700/60 overflow-x-auto">
              <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#D4A017]" />
                Lọc tác phẩm:
              </span>
              {[
                { id: 'all', label: 'Tất cả tác phẩm', count: creations.length },
                { id: 'video', label: 'Chỉ Video Điện Ảnh', count: creations.filter(c => c.type === 'video').length },
                { id: 'image', label: 'Chỉ Hình Ảnh', count: creations.filter(c => c.type === 'image').length }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => {
                    playCabinetClick();
                    setCreationFilter(f.id as any);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    creationFilter === f.id
                      ? 'bg-[#F59E0B] text-stone-950 shadow-md font-black ring-1 ring-white'
                      : 'bg-[#1E293B] text-stone-200 hover:text-white border border-stone-600'
                  }`}
                >
                  <span>{f.label}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-black/30 text-white font-bold">
                    {f.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Creations Grid */}
          {(() => {
            const filtered = creations.filter(item => {
              if (creationFilter === 'video') return item.type === 'video';
              if (creationFilter === 'image') return item.type === 'image';
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="p-8 sm:p-12 text-center rounded-3xl border-2 border-dashed border-stone-700 bg-[#0F172A] space-y-4">
                  <Film className="w-16 h-16 mx-auto stroke-1 text-stone-500" />
                  <div className="space-y-1 max-w-md mx-auto">
                    <h4 className="text-base font-bold text-white">Chưa có tác phẩm nào phù hợp</h4>
                    <p className="text-xs text-stone-300 leading-relaxed font-medium">
                      Hãy ghé thăm Xưởng phim Lịch sử AI để tái hiện các thước phim hào hùng về Điện Biên Phủ và dấu mốc của Đại tướng!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playRadarPing();
                      onNavigateToTab('archives');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#DC2626] text-white text-xs sm:text-sm font-black shadow-lg hover:brightness-110 transition-all cursor-pointer border border-[#FDE047]"
                  >
                    <Sparkles className="w-4 h-4 text-[#FDE047]" />
                    <span>Mở Xưởng Phim AI Ngay</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      playCabinetClick();
                      setSelectedCreation(item);
                      setIsPlayingModalVideo(true);
                    }}
                    className="p-4 rounded-2xl bg-[#0F172A] border-2 border-stone-700 hover:border-[#F59E0B] shadow-xl hover:shadow-2xl transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      {/* Media Thumbnail Container */}
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-3 border border-stone-800">
                        {item.type === 'video' ? (
                          <video 
                            src={item.url} 
                            className="w-full h-full object-cover" 
                            muted 
                            playsInline 
                          />
                        ) : (
                          <img 
                            src={item.url} 
                            alt={item.prompt} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        )}

                        {/* Top badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="bg-[#DC2626] text-white px-2 py-0.5 rounded-md text-[10px] font-mono font-black border border-red-300 shadow-md">
                            {item.type === 'video' ? 'VIDEO 10S' : 'HÌNH ẢNH'}
                          </span>
                          <span className="bg-black/80 text-[#FDE047] px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border border-stone-600">
                            {item.aspectRatio}
                          </span>
                        </div>

                        {/* Play Hover Overlay for Videos */}
                        {item.type === 'video' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                            <div className="w-12 h-12 rounded-full bg-[#F59E0B] text-stone-950 flex items-center justify-center shadow-xl">
                              <Play className="w-6 h-6 fill-current ml-0.5" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Prompt Description */}
                      <p className="text-xs sm:text-sm font-bold text-white line-clamp-3 leading-relaxed group-hover:text-[#FDE047] transition-colors">
                        “{item.prompt}”
                      </p>
                    </div>

                    {/* Metadata & Actions Bar */}
                    <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono font-bold text-amber-300 block">
                          {item.createdAt}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400 block truncate max-w-[140px]">
                          {item.model}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <a
                          href={item.url}
                          download={`giap_trace_creation_${item.id}.${item.type === 'video' ? 'mp4' : 'png'}`}
                          title="Tải về máy"
                          className="p-2 rounded-xl bg-[#1E293B] text-[#FDE047] hover:bg-[#F59E0B] hover:text-stone-950 border border-stone-700 transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={(e) => handleDeleteCreation(item.id, e)}
                          title="Xóa khỏi bộ sưu tập"
                          className="p-2 rounded-xl bg-[#1E293B] text-stone-400 hover:text-red-400 hover:bg-red-950/40 border border-stone-700 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* LIGHTBOX MODAL PLAYER FOR SELECTED CREATION */}
          {selectedCreation && (
            <div 
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
              onClick={() => setSelectedCreation(null)}
            >
              <div 
                className="relative w-full max-w-3xl rounded-3xl bg-[#0F172A] border-2 border-[#F59E0B] shadow-2xl overflow-hidden p-5 sm:p-6 text-white space-y-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-700">
                  <div className="flex items-center gap-2.5">
                    <span className="bg-[#DC2626] text-white px-2.5 py-1 rounded-lg text-xs font-mono font-black">
                      {selectedCreation.type === 'video' ? 'VIDEO ĐIỆN ẢNH' : 'HÌNH ẢNH LỊCH SỬ'}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#FDE047]">
                      {selectedCreation.aspectRatio} • {selectedCreation.createdAt}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCreation(null)}
                    className="p-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Media Screen */}
                <div className="relative w-full bg-black rounded-2xl overflow-hidden flex items-center justify-center max-h-[500px] border border-stone-800">
                  {selectedCreation.type === 'video' ? (
                    <video
                      ref={modalVideoRef}
                      src={selectedCreation.url}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className={`w-full max-h-[480px] object-contain rounded-xl ${
                        selectedCreation.aspectRatio === '9:16' ? 'max-w-[280px]' : 'w-full'
                      }`}
                    />
                  ) : (
                    <img
                      src={selectedCreation.url}
                      alt={selectedCreation.prompt}
                      className="w-full max-h-[480px] object-contain rounded-xl"
                    />
                  )}
                </div>

                {/* Prompt & Actions */}
                <div className="space-y-3">
                  <p className="text-xs sm:text-sm text-stone-200 font-serif italic leading-relaxed bg-[#08101F] p-3.5 rounded-xl border border-stone-800">
                    “{selectedCreation.prompt}”
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <span className="text-xs font-mono font-medium text-stone-400">
                      Mô hình: <strong className="text-emerald-400">{selectedCreation.model}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <a
                        href={selectedCreation.url}
                        download={`giap_trace_creation_${selectedCreation.id}.${selectedCreation.type === 'video' ? 'mp4' : 'png'}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F59E0B] text-stone-950 text-xs sm:text-sm font-black shadow-lg hover:brightness-110 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Tải về máy ({selectedCreation.type === 'video' ? 'MP4' : 'PNG'})</span>
                      </a>

                      <button
                        onClick={() => handleDeleteCreation(selectedCreation.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 text-red-300 border border-red-700 hover:bg-red-900 text-xs font-bold transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. NHẬT KÝ KHÁM PHÁ (Yêu cầu 11) */}
      {activeTab === 'journal' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* New Entry Form */}
          <div className={`p-6 rounded-3xl ${
            isDark ? 'museum-card-dark text-[#F8FAFC]' : 'museum-card-light text-[#0F172A]'
          } space-y-4`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <span>Viết cảm nhận: "Điều tôi học được hôm nay"</span>
              </h3>
              <span className="text-[11px] text-gray-400">Dành cho học sinh lưu lại suy ngẫm</span>
            </div>

            <form onSubmit={handleAddJournal} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  1. Sự kiện khiến tôi ấn tượng nhất:
                </label>
                <input
                  type="text"
                  value={impressiveEvent}
                  onChange={(e) => setImpressiveEvent(e.target.value)}
                  placeholder="Ví dụ: Kéo pháo vào rồi kéo pháo ra tại Điện Biên Phủ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#1E3A5F] bg-white dark:bg-[#112239] text-xs sm:text-sm text-gray-800 dark:text-gray-100 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    2. Điều tôi chưa biết trước đây:
                  </label>
                  <input
                    type="text"
                    value={newKnowledge}
                    onChange={(e) => setNewKnowledge(e.target.value)}
                    placeholder="Ví dụ: Đại tướng từng là thầy giáo dạy sử..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#1E3A5F] bg-white dark:bg-[#112239] text-xs sm:text-sm text-gray-800 dark:text-gray-100 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    3. Phẩm chất bản lĩnh tôi muốn học hỏi:
                  </label>
                  <input
                    type="text"
                    value={qualityToLearn}
                    onChange={(e) => setQualityToLearn(e.target.value)}
                    placeholder="Ví dụ: Tinh thần trách nhiệm, khả năng tự học..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#1E3A5F] bg-white dark:bg-[#112239] text-xs sm:text-sm text-gray-800 dark:text-gray-100 focus:outline-hidden focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  4. Điều tôi muốn tìm hiểu thêm:
                </label>
                <input
                  type="text"
                  value={wantToExploreMore}
                  onChange={(e) => setWantToExploreMore(e.target.value)}
                  placeholder="Ví dụ: Tìm hiểu về các văn bản sắc lệnh năm 1945..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-[#1E3A5F] bg-white dark:bg-[#112239] text-xs sm:text-sm text-gray-800 dark:text-gray-100 focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C41E24] to-[#991B1B] text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu vào "Hành trình của tôi"</span>
                </button>
              </div>
            </form>
          </div>

          {/* List of Journal Entries */}
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
              Các bài ghi chép đã lưu ({journalEntries.length})
            </h3>

            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className={`p-5 rounded-3xl border ${
                  isDark ? 'bg-[#0F2747] border-[#1E3A5F]' : 'bg-white border-gray-200'
                } shadow-sm space-y-3 relative group`}
              >
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="text-[11px] font-mono text-gray-400">
                    Thời gian: {entry.date}
                  </span>
                  <button
                    onClick={() => handleDeleteJournal(entry.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-[#C41E24] dark:text-amber-400">
                      Sự kiện ấn tượng:
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">{entry.impressiveEvent || '(Chưa ghi)'}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                      Điều mới biết:
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">{entry.newKnowledge || '(Chưa ghi)'}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                      Phẩm chất muốn học:
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">{entry.qualityToLearn || '(Chưa ghi)'}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400">
                      Muốn tìm hiểu thêm:
                    </span>
                    <p className="text-gray-800 dark:text-gray-200">{entry.wantToExploreMore || '(Chưa ghi)'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. HUY HIỆU KHÁM PHÁ (Yêu cầu 12) */}
      {activeTab === 'badges' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
            <Info className="w-4 h-4 flex-shrink-0 text-amber-500" />
            <span>
              <strong>Nguyên tắc sư phạm:</strong> Huy hiệu chỉ phản ánh tiến trình nỗ lực học tập và khám phá tư liệu, không biến ứng dụng thành trò chơi thuần túy.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {DISCOVERY_BADGES.map((badge) => {
              return (
                <div
                  key={badge.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    badge.unlocked
                      ? isDark 
                        ? 'bg-gradient-to-br from-[#0F2747] to-[#1E3A5F] border-[#D4AF37] text-white shadow-md' 
                        : 'bg-white border-[#D4AF37] text-gray-900 shadow-md'
                      : isDark
                        ? 'bg-[#0A182D]/60 border-[#1E3A5F]/50 text-gray-500 opacity-60'
                        : 'bg-gray-100 border-gray-200 text-gray-400 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-[#C41E24] text-yellow-300 shadow-md'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-400'
                    }`}>
                      <Award className="w-5 h-5" />
                    </div>
                    {badge.unlocked ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Đã đạt được
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-gray-400">
                        Đang mở khóa
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-extrabold text-gray-900 dark:text-white">
                    {badge.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. KHẢO SÁT NHẬN THỨC TRƯỚC - SAU (Yêu cầu 15 & 16) */}
      {activeTab === 'survey' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-900 dark:text-blue-300 text-xs space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Dự án Khoa học Hành vi & Đánh giá Giáo dục Lịch sử:</span>
            </p>
            <p className="leading-relaxed">
              Dữ liệu khảo sát trước – sau được sử dụng để đánh giá sự thay đổi về mức độ hiểu biết, hứng thú và nhận thức của học sinh đối với lịch sử. Hệ thống hiển thị khách quan dữ liệu quan sát được, không khẳng định một chiều.
            </p>
          </div>

          {/* Comparative Chart / Table */}
          <div className={`p-6 rounded-3xl border ${
            isDark ? 'bg-[#0F2747] border-[#1E3A5F]' : 'bg-white border-gray-200'
          } shadow-lg space-y-6`}>
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                Biểu đồ Thay đổi Nhận thức (Thang đo 1 - 5 Điểm)
              </h3>
              <span className="text-xs font-mono text-emerald-500 font-bold">
                Mức tiến bộ trung bình: +2.0 điểm
              </span>
            </div>

            {/* 4 Metrics Compare */}
            <div className="space-y-4">
              {[
                {
                  label: 'Mức độ hiểu biết về Đại tướng',
                  pre: surveyData.preExperience.knowledgeLevel,
                  post: surveyData.postExperience.knowledgeLevel
                },
                {
                  label: 'Mức độ hứng thú với môn Lịch sử',
                  pre: surveyData.preExperience.interestLevel,
                  post: surveyData.postExperience.interestLevel
                },
                {
                  label: 'Khả năng ghi nhớ các dấu mốc quan trọng',
                  pre: surveyData.preExperience.memoryMilestones,
                  post: surveyData.postExperience.memoryMilestones
                },
                {
                  label: 'Nhận thức về phẩm chất & bản lĩnh',
                  pre: surveyData.preExperience.courageAwareness,
                  post: surveyData.postExperience.courageAwareness
                },
              ].map((metric, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                    <span>{metric.label}</span>
                    <span className="font-mono text-emerald-500">
                      Trước: {metric.pre}/5 → Sau: {metric.post}/5 (+{metric.post - metric.pre})
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex">
                    {/* Pre bar */}
                    <div 
                      style={{ width: `${(metric.pre / 5) * 100}%` }}
                      className="h-full bg-gray-400 dark:bg-gray-500"
                      title={`Trước: ${metric.pre}/5`}
                    />
                    {/* Gain bar */}
                    <div 
                      style={{ width: `${((metric.post - metric.pre) / 5) * 100}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                      title={`Tiến bộ: +${metric.post - metric.pre}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Qualitative Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1 text-xs">
                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                  Phương pháp học được học sinh yêu thích nhất:
                </span>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {surveyData.postExperience.favoriteMethod}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 space-y-1 text-xs">
                <span className="font-bold text-gray-500 dark:text-gray-400 uppercase text-[10px]">
                  Suy ngẫm phát triển cá nhân:
                </span>
                <p className="text-gray-700 dark:text-gray-200 italic">
                  "{surveyData.postExperience.keyGrowthReflection}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
