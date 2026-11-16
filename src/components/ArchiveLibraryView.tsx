import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Image as ImageIcon, 
  FileText, 
  Map, 
  Package, 
  Film, 
  ExternalLink, 
  X, 
  Filter, 
  BookOpen, 
  Calendar, 
  Share2, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles,
  GitCommitVertical,
  ArrowRight,
  Clock,
  Layers,
  Award,
  Tag,
  Scroll,
  Stamp,
  Radar
} from 'lucide-react';
import { ArchiveItem, ArchiveType, TimelineMilestone, NavTab } from '../types';
import { ARCHIVE_ITEMS, TIMELINE_MILESTONES } from '../data/museumData';
import { VERIFICATION_DATABASE } from '../data/learningData';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { recordBrowsingHistory } from '../utils/browsingHistory';
import { playRadarPing } from '../utils/soundEffects';
import { AppLanguage, translations } from '../utils/i18n';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface ArchiveLibraryViewProps {
  isDark: boolean;
  language?: AppLanguage;
  selectedArchiveId?: string | null;
  onClearSelectedArchive?: () => void;
  onNavigateToTab?: (tab: NavTab) => void;
  onSelectMilestone?: (milestoneId: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
}

type SearchScope = 'all' | 'documents' | 'images' | 'milestones' | 'artifacts' | 'verification';

export const ArchiveLibraryView: React.FC<ArchiveLibraryViewProps> = ({
  isDark,
  language = 'vi',
  selectedArchiveId,
  onClearSelectedArchive,
  onNavigateToTab,
  onSelectMilestone,
  searchQuery: externalSearchQuery,
  onSearchQueryChange: setExternalSearchQuery,
}) => {
  const t = translations[language].archiveSearch;

  // Mode and Search State
  const [activeTabMode, setActiveTabMode] = useState<'archives' | 'verification'>('archives');
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = (val: string) => {
    if (setExternalSearchQuery) {
      setExternalSearchQuery(val);
    } else {
      setInternalSearchQuery(val);
    }
  };

  const [searchScope, setSearchScope] = useState<SearchScope>('all');
  const [selectedCategory, setSelectedCategory] = useState<ArchiveType | 'all'>('all');
  
  // Selected Detail Modal State
  const [activeArchiveItem, setActiveArchiveItem] = useState<ArchiveItem | null>(
    selectedArchiveId ? ARCHIVE_ITEMS.find((a) => a.id === selectedArchiveId) || null : null
  );
  const [activeMilestoneItem, setActiveMilestoneItem] = useState<TimelineMilestone | null>(null);

  // Quick search keywords recommended for users
  const quickKeywords = [
    { label: 'Điện Biên Phủ', query: 'Điện Biên Phủ' },
    { label: 'Sắc lệnh 1945', query: 'Sắc lệnh' },
    { label: 'Bút tích chữ ký', query: 'Bút tích' },
    { label: '34 chiến sĩ', query: '34' },
    { label: 'Xe tăng 843', query: '843' },
    { label: '1954', query: '1954' },
    { label: 'Hầm D67', query: 'D67' },
  ];

  // Helper mapping category icons
  const categories: { id: ArchiveType | 'all'; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: language === 'vi' ? 'Tất cả tư liệu' : 'All Media', icon: BookOpen },
    { id: 'document', label: language === 'vi' ? 'Tài liệu & Sắc lệnh' : 'Documents & Decrees', icon: FileText },
    { id: 'image', label: language === 'vi' ? 'Hình ảnh lịch sử' : 'Photographs', icon: ImageIcon },
    { id: 'map', label: language === 'vi' ? 'Bản đồ quân sự' : 'Maps', icon: Map },
    { id: 'artifact', label: language === 'vi' ? 'Hiện vật bảo vật' : 'Artifacts', icon: Package },
    { id: 'video', label: language === 'vi' ? 'Phim tài liệu' : 'Videos', icon: Film },
  ];

  const getTypeIcon = (type: ArchiveType) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'document': return FileText;
      case 'map': return Map;
      case 'artifact': return Package;
      case 'video': return Film;
    }
  };

  const getTypeName = (type: ArchiveType) => {
    switch (type) {
      case 'image': return language === 'vi' ? 'Hình ảnh' : 'Photograph';
      case 'document': return language === 'vi' ? 'Tài liệu' : 'Document';
      case 'map': return language === 'vi' ? 'Bản đồ' : 'Map';
      case 'artifact': return language === 'vi' ? 'Hiện vật' : 'Artifact';
      case 'video': return language === 'vi' ? 'Video' : 'Video';
    }
  };

  // 1. Search in Archives
  const filteredArchives = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return ARCHIVE_ITEMS.filter((item) => {
      // Category filter check (only if inside archives scope)
      if (selectedCategory !== 'all' && item.type !== selectedCategory) {
        return false;
      }
      // Scope filter check
      if (searchScope === 'documents' && item.type !== 'document') return false;
      if (searchScope === 'images' && item.type !== 'image') return false;
      if (searchScope === 'artifacts' && !['artifact', 'map', 'video'].includes(item.type)) return false;
      if (searchScope === 'milestones') return false;
      if (searchScope === 'verification') return false;

      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.source.toLowerCase().includes(q) ||
        item.catalogNumber.toLowerCase().includes(q) ||
        item.details.toLowerCase().includes(q) ||
        item.yearPlaceholder.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory, searchScope]);

  // 2. Search in Milestones
  const filteredMilestones = useMemo(() => {
    if (searchScope === 'documents' || searchScope === 'images' || searchScope === 'artifacts' || searchScope === 'verification') {
      return [];
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q && searchScope !== 'milestones') {
      // If no query and not explicitly in milestones scope, don't show milestones to keep archive view clean
      return [];
    }

    return TIMELINE_MILESTONES.filter((m) => {
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.year.toLowerCase().includes(q) ||
        m.shortDesc.toLowerCase().includes(q) ||
        m.fullDesc.toLowerCase().includes(q) ||
        m.location.toLowerCase().includes(q) ||
        m.period.toLowerCase().includes(q) ||
        m.roleOfGeneral.toLowerCase().includes(q) ||
        m.memorablePoint.toLowerCase().includes(q) ||
        m.courageLesson.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, searchScope]);

  // 3. Search in Verification Sources
  const filteredVerification = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (searchScope !== 'all' && searchScope !== 'verification') return [];

    return VERIFICATION_DATABASE.filter((item) => {
      if (!q) return true;
      return (
        item.subjectTitle.toLowerCase().includes(q) ||
        item.sourceDocName.toLowerCase().includes(q) ||
        item.publisherOrAuthor.toLowerCase().includes(q) ||
        item.verifiedContent.toLowerCase().includes(q) ||
        item.verificationQuote.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, searchScope]);

  const totalResultsCount = filteredArchives.length + filteredMilestones.length + (searchScope === 'verification' || (searchQuery && searchScope === 'all') ? filteredVerification.length : 0);

  const handleOpenMilestone = (milestone: TimelineMilestone) => {
    setActiveMilestoneItem(milestone);
    recordBrowsingHistory({
      type: 'milestone',
      itemId: milestone.id,
      title: milestone.title,
      subtitle: `${milestone.year} • ${milestone.location}`,
      category: milestone.period,
      tags: [milestone.year, milestone.location, 'Hành trình', 'Dấu mốc'],
      image: milestone.image
    });
  };

  const handleOpenArchive = (item: ArchiveItem) => {
    setActiveArchiveItem(item);
    recordBrowsingHistory({
      type: 'archive',
      itemId: item.id,
      title: item.title,
      subtitle: item.source,
      category: item.type,
      tags: [item.type, item.yearPlaceholder, item.catalogNumber, 'Tư liệu'],
      image: item.thumbnail
    });
  };

  return (
    <div id="archive-digital-library" className="space-y-5 pb-28 px-2 sm:px-4 pt-3">
      {/* 1. Header & Title with Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
              {language === 'vi' ? 'HỆ THỐNG TRA CỨU DI SẢN' : 'HERITAGE REPOSITORY'}
            </span>
            <span className="text-xs text-gray-400">
              {ARCHIVE_ITEMS.length} {language === 'vi' ? 'tư liệu số hóa' : 'archived items'} • {TIMELINE_MILESTONES.length} {language === 'vi' ? 'dấu mốc' : 'milestones'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#0F2747] dark:text-[#F3F4F6]">
            {t.headerTitle}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl">
            {t.headerDesc}
          </p>
        </div>

        {/* Tab Switcher: Archives vs Verification vs Biography Dossier */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-2xs">
          <button
            onClick={() => {
              playRadarPing();
              setActiveTabMode('archives');
              if (searchScope === 'verification') setSearchScope('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabMode === 'archives'
                ? 'bg-[#C41E24] text-white shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-red-600'
            }`}
          >
            {language === 'vi' ? `Kho Di sản (${ARCHIVE_ITEMS.length})` : `Archives (${ARCHIVE_ITEMS.length})`}
          </button>
          <button
            onClick={() => {
              playRadarPing();
              setActiveTabMode('verification');
              setSearchScope('verification');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTabMode === 'verification'
                ? 'bg-[#0F2747] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs'
                : 'text-gray-600 dark:text-gray-300 hover:text-amber-500'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? `Khu Kiểm chứng (${VERIFICATION_DATABASE.length})` : `Verification (${VERIFICATION_DATABASE.length})`}</span>
          </button>
          <button
            onClick={() => {
              playRadarPing();
              if (onNavigateToTab) onNavigateToTab('radar');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-emerald-950/20 dark:bg-emerald-950/60 border-2 border-emerald-500/50 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400 shadow-xs"
            title="Mở Radar Tác chiến Mật lệnh Điện Biên Phủ 1954"
          >
            <Radar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'vi' ? '◉ Radar Tác chiến' : '◉ Tactical Radar'}</span>
          </button>
          <button
            onClick={() => {
              playRadarPing();
              if (onNavigateToTab) onNavigateToTab('biography');
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer bg-gradient-to-r from-red-600/15 via-amber-500/25 to-red-600/15 border-2 border-red-600/50 text-red-700 dark:text-amber-300 hover:border-amber-400 shadow-xs"
            title="Xem hồ sơ tiểu sử cổ điển, chữ ký và chuỗi ảnh mũi tên từ trẻ tới già"
          >
            <Scroll className="w-3.5 h-3.5 text-red-600 dark:text-amber-400" />
            <span>{language === 'vi' ? '★ Hồ sơ Cổ điển' : '★ Classic Dossier'}</span>
          </button>
        </div>
      </div>

      {/* BANNER NỔI BẬT ĐẶC BIỆT CẠNH PHẦN TƯ LIỆU: HỒ SƠ TIỂU SỬ ĐẠI TƯỚNG VÕ NGUYÊN GIÁP */}
      <div 
        onClick={() => {
          playRadarPing();
          if (onNavigateToTab) onNavigateToTab('biography');
        }}
        className={`group p-4 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-[#1E293B] via-[#2A241E] to-[#1E293B] border-[#D4A017]/60 hover:border-[#D4A017] text-white shadow-xl'
            : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-[#D4A017]/50 hover:border-[#B91C1C] text-[#0F172A] shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-[#D4A017] shadow-md flex-shrink-0 bg-black/40">
              <img 
                src={getCuratedImage('ArchiveLibraryView__001__GIAP_YOUNG_SCHOLAR')} 
                alt="Đại tướng thời trẻ"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#B91C1C] rounded-bl-sm" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#B91C1C] text-white shadow-xs">
                  MỤC TÍNH NĂNG MỚI NỔI BẬT
                </span>
                <span className="text-xs font-mono font-bold text-[#D4A017]">
                  LƯU TRỮ CỔ ĐIỂN 1911 – 2013
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-[#B91C1C] dark:text-[#D4A017] group-hover:underline">
                Hồ Sơ & Tiểu Sử Toàn Diện Đại Tướng Võ Nguyên Giáp
              </h3>
              <p className="text-xs text-stone-700 dark:text-[#CBD5E1] line-clamp-1 font-medium">
                Trình bày dạng hồ sơ lưu trữ hồi xưa, bút tích chữ ký nguyên bản, và chuỗi ảnh đánh dấu mũi tên từ trẻ tới già.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="px-4 py-2 rounded-xl bg-[#B91C1C] hover:bg-red-800 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md group-hover:translate-x-1 transition-all">
              <Scroll className="w-4 h-4 text-amber-300" />
              <span>{language === 'vi' ? 'Mở Xem Hồ Sơ Ngay' : 'Open Dossier'}</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. GLOBAL SEARCH BAR (TÌM KIẾM TOÀN DIỆN MỌI TÀI LIỆU, HÌNH ẢNH, DẤU MỐC) */}
      <div className={`p-4 sm:p-5 rounded-3xl border-2 shadow-sm transition-all ${
        isDark ? 'bg-[#1E293B] border-slate-700 shadow-xl' : 'bg-white border-[#D4A017]/40 shadow-md'
      }`}>
        <div className="space-y-3">
          {/* Main Input Box */}
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4A017]" />
            <input
              id="archive-global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-10 pr-24 py-3 rounded-2xl text-xs sm:text-sm font-medium border transition-all outline-hidden focus:ring-2 focus:ring-[#D4A017] ${
                isDark
                  ? 'bg-[#0F172A] border-slate-700 text-white placeholder-slate-400 focus:border-[#D4A017]'
                  : 'bg-[#FFFDF9] border-stone-300 text-stone-900 placeholder-stone-400 focus:border-[#D4A017]'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-lg bg-black/10 dark:bg-white/10 hover:bg-black/20 text-gray-500 dark:text-gray-300 flex items-center gap-1 cursor-pointer transition-colors"
                title={t.clearSearch}
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Xóa' : 'Clear'}</span>
              </button>
            )}
          </div>

          {/* Search Scopes: All, Documents, Images, Milestones, Artifacts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{language === 'vi' ? 'Phạm vi:' : 'Scope:'}</span>
            </span>
            {[
              { id: 'all', label: t.tabAll, count: ARCHIVE_ITEMS.length + (searchQuery ? TIMELINE_MILESTONES.length : 0) },
              { id: 'documents', label: t.tabDocuments, count: ARCHIVE_ITEMS.filter(i => i.type === 'document').length },
              { id: 'images', label: t.tabImages, count: ARCHIVE_ITEMS.filter(i => i.type === 'image').length },
              { id: 'milestones', label: t.tabMilestones, count: TIMELINE_MILESTONES.length },
              { id: 'artifacts', label: t.tabArtifacts, count: ARCHIVE_ITEMS.filter(i => ['artifact', 'map', 'video'].includes(i.type)).length },
              { id: 'verification', label: t.tabVerification, count: VERIFICATION_DATABASE.length },
            ].map((scope) => {
              const isActive = searchScope === scope.id;
              return (
                <button
                  key={scope.id}
                  onClick={() => {
                    playRadarPing();
                    setSearchScope(scope.id as SearchScope);
                    if (scope.id === 'verification') {
                      setActiveTabMode('verification');
                    } else if (activeTabMode === 'verification') {
                      setActiveTabMode('archives');
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#C41E24] text-white shadow-xs'
                      : isDark
                      ? 'bg-[#112239] text-gray-300 border border-[#1E3A5F] hover:border-amber-500/50'
                      : 'bg-black/5 text-gray-700 hover:bg-black/10'
                  }`}
                >
                  <span>{scope.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-black/20 text-white' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                  }`}>
                    {scope.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              {t.quickSuggestions}
            </span>
            {quickKeywords.map((kw, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playRadarPing();
                  setSearchQuery(kw.query);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  searchQuery.toLowerCase() === kw.query.toLowerCase()
                    ? 'bg-amber-500 text-[#0F2747] font-bold shadow-2xs'
                    : isDark
                    ? 'bg-[#112239] text-amber-300/90 border border-amber-500/20 hover:border-amber-400'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                #{kw.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Search Results Count & Active Category Filters if in Archives tab */}
      {activeTabMode === 'archives' && searchScope !== 'verification' && (
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 font-semibold">
            <span>
              {language === 'vi' ? 'Kết quả tìm kiếm:' : 'Search results:'}{' '}
              <strong className="text-[#C41E24] dark:text-amber-400 font-bold">{totalResultsCount}</strong> {t.resultsSuffix}
            </span>
            {searchQuery && (
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-300 border border-amber-500/20">
                "{searchQuery}"
              </span>
            )}
          </div>

          {/* Category Filter Chips for Archives (Image, Document, Map, etc.) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    playRadarPing();
                    setSelectedCategory(cat.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F2747] text-[#D4AF37] border border-[#D4AF37] shadow-xs'
                      : isDark
                      ? 'bg-[#112239] text-gray-300 border border-[#1E3A5F] hover:bg-[#1A3456]'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. MAIN CONTENT AREA */}
      {activeTabMode === 'archives' && searchScope !== 'verification' ? (
        <div className="space-y-6">
          {/* A. DẤU MỐC LỊCH SỬ TÌM THẤY (NẾU CÓ KHỚP VỚI TỪ KHÓA) */}
          {filteredMilestones.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#0F2747] dark:text-white flex items-center gap-2">
                  <GitCommitVertical className="w-4 h-4 text-[#C41E24]" />
                  <span>{language === 'vi' ? `Dấu mốc Lịch sử phù hợp (${filteredMilestones.length})` : `Matching Historical Milestones (${filteredMilestones.length})`}</span>
                </h3>
                {onNavigateToTab && (
                  <button
                    onClick={() => onNavigateToTab('timeline')}
                    className="text-xs text-[#C41E24] dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{language === 'vi' ? 'Xem trọn vẹn Hành trình' : 'View Full Journey'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    onClick={() => handleOpenMilestone(milestone)}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3.5 transition-all cursor-pointer active:scale-[0.99] ${
                      isDark 
                        ? 'bg-[#112239] border-[#1E3A5F] hover:border-amber-400/60 text-white shadow-xs' 
                        : 'bg-white border-amber-200/70 hover:border-[#D4AF37] text-gray-900 shadow-xs hover:shadow-md'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-black relative border border-gray-700">
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCuratedImage('ArchiveLibraryView__002__PORTRAIT_GENERAL');
                        }}
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-[#C41E24] text-white">
                        {milestone.year}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0F2747] text-amber-300 border border-amber-400/30">
                          {milestone.period}
                        </span>
                        <span className="text-[11px] text-gray-400 truncate">
                          {milestone.location}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white truncate">
                        {milestone.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                        {milestone.shortDesc}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-[#C41E24] dark:text-amber-400 font-bold">
                        <span>{t.viewTimelineMilestone}</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* B. KHO TƯ LIỆU SỐ HÓA (HÌNH ẢNH, VĂN BẢN, SẮC LỆNH, BẢN ĐỒ, HIỆN VẬT) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-[#0F2747] dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D4AF37]" />
                <span>{language === 'vi' ? `Tài liệu & Hình ảnh Di sản (${filteredArchives.length})` : `Archived Documents & Images (${filteredArchives.length})`}</span>
              </h3>
            </div>

            {filteredArchives.length === 0 && filteredMilestones.length === 0 ? (
              <div className={`p-10 rounded-3xl border text-center space-y-3 ${
                isDark ? 'bg-[#0F2747]/60 border-[#1E3A5F]' : 'bg-white border-gray-200'
              }`}>
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  {t.noResultsTitle}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  {t.noResultsDesc}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSearchScope('all');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#C41E24] text-white hover:bg-red-700 transition-colors cursor-pointer"
                >
                  {language === 'vi' ? 'Xem toàn bộ kho tư liệu' : 'Reset and view all archives'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredArchives.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <div
                      key={item.id}
                      id={`archive-card-${item.id}`}
                      onClick={() => handleOpenArchive(item)}
                      className={`group relative rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer active:scale-[0.99] hover:-translate-y-0.5 ${
                        isDark
                          ? 'museum-card-dark text-[#F8FAFC]'
                          : 'museum-card-light text-[#0F172A]'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gray-900 border-b border-[#D4A017]/30">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCuratedImage('ArchiveLibraryView__003__PORTRAIT_GENERAL');
                          }}
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#B91C1C] text-white text-[10px] font-bold border border-yellow-300/40 shadow-xs">
                          <Icon className="w-3 h-3 text-yellow-300" />
                          <span>{getTypeName(item.type)}</span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-yellow-300 border border-yellow-400/30">
                          {item.yearPlaceholder}
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <h4 className="text-xs sm:text-sm font-black leading-snug line-clamp-2 group-hover:text-[#B91C1C] dark:group-hover:text-yellow-300 transition-colors font-serif">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 dark:text-[#CBD5E1] truncate mt-1 font-medium">
                            {item.source}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-stone-200/80 dark:border-slate-700/80 flex items-center justify-between text-[10px] text-stone-500 dark:text-[#CBD5E1]">
                          <span className="font-mono font-bold truncate max-w-[100px] text-[#B91C1C] dark:text-[#D4A017]">{item.catalogNumber}</span>
                          <span className="text-[#B91C1C] dark:text-yellow-400 font-bold flex items-center gap-0.5">
                            {t.viewDetail} <ExternalLink className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* KHU VỰC KIỂM CHỨNG TƯ LIỆU VỚI TÌM KIẾM THEO TỪ KHÓA */
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs sm:text-sm text-gray-700 dark:text-gray-200 space-y-1">
            <h3 className="font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cơ sở Dữ liệu Kiểm chứng & Nguồn gốc Lịch sử ({filteredVerification.length} mục)</span>
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Mỗi luận điểm, trích dẫn hay quyết định của Đại tướng đều được đối chiếu trực tiếp với các tài liệu lưu trữ quốc gia, hồi ký chính thống và văn bản gốc.
            </p>
          </div>

          <div className="space-y-3">
            {filteredVerification.map((item) => (
              <div
                key={item.id}
                className={`p-5 rounded-3xl border ${
                  isDark ? 'bg-[#0F2747] border-[#1E3A5F]' : 'bg-white border-gray-200'
                } shadow-sm space-y-2`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-gray-200 dark:border-gray-700 pb-2">
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 dark:text-white">
                    {item.subjectTitle}
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                    {t.verifiedBadge}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <p>
                    <strong className="text-gray-600 dark:text-gray-400">Nguồn tài liệu:</strong>{' '}
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{item.sourceDocName}</span>
                  </p>
                  <p>
                    <strong className="text-gray-600 dark:text-gray-400">Đơn vị lưu trữ / Xuất bản:</strong>{' '}
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{item.publisherOrAuthor} ({item.publicationYear})</span>
                  </p>
                </div>

                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong>Nội dung xác thực:</strong> {item.verifiedContent}
                </p>

                <div className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 border-l-2 border-[#D4AF37] text-xs text-gray-600 dark:text-gray-300 italic">
                  {item.verificationQuote}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: CHI TIẾT TƯ LIỆU SỐ HÓA */}
      {activeArchiveItem && (
        <div 
          id="archive-item-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div 
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border p-5 shadow-2xl ${
              isDark ? 'bg-[#0F2747] border-[#1E3A5F] text-white' : 'bg-white border-gray-200 text-[#1F2937]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37] text-[#0F2747] text-xs font-bold shadow-xs">
                  {getTypeName(activeArchiveItem.type)}
                </span>
                <span className="text-xs font-mono text-gray-400 font-semibold">
                  {activeArchiveItem.catalogNumber}
                </span>
              </div>
              <button
                onClick={() => {
                  setActiveArchiveItem(null);
                  if (onClearSelectedArchive) onClearSelectedArchive();
                }}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail preview */}
            <div className="relative aspect-video max-h-56 sm:max-h-64 w-full rounded-2xl overflow-hidden mt-4 bg-black border border-gray-800">
              <img
                src={activeArchiveItem.thumbnail}
                alt={activeArchiveItem.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('ArchiveLibraryView__004__PORTRAIT_GENERAL');
                }}
              />
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0F2747] dark:text-white leading-snug">
                {activeArchiveItem.title}
              </h3>

              <div className="p-3 rounded-2xl bg-gray-50 dark:bg-[#112239] border border-gray-200 dark:border-[#1E3A5F] text-xs space-y-1.5">
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-[#D4AF37]">{t.sourcePrefix} </span>
                  {activeArchiveItem.source}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-[#D4AF37]">Thời kỳ: </span>
                  {activeArchiveItem.yearPlaceholder}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-bold text-[#D4AF37]">{t.catalogPrefix} </span>
                  <span className="font-mono">{activeArchiveItem.catalogNumber}</span>
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {language === 'vi' ? 'Mô tả & Bối cảnh Lịch sử:' : 'Historical Description:'}
                </span>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {activeArchiveItem.details}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <button
                onClick={() => {
                  setActiveArchiveItem(null);
                  if (onClearSelectedArchive) onClearSelectedArchive();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0F2747] text-[#D4AF37] font-bold text-xs border border-[#D4AF37]/50 hover:brightness-110 cursor-pointer shadow-xs"
              >
                {t.closeModal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CHI TIẾT DẤU MỐC LỊCH SỬ KHI TÌM KIẾM */}
      {activeMilestoneItem && (
        <div 
          id="milestone-search-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div 
            className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border p-5 shadow-2xl ${
              isDark ? 'bg-[#0F2747] border-[#1E3A5F] text-white' : 'bg-white border-gray-200 text-[#1F2937]'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#C41E24] text-white text-xs font-bold font-mono">
                  {activeMilestoneItem.year}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  {activeMilestoneItem.period}
                </span>
              </div>
              <button
                onClick={() => setActiveMilestoneItem(null)}
                className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video max-h-52 sm:max-h-60 w-full rounded-2xl overflow-hidden mt-4 bg-black border border-gray-800">
              <img
                src={activeMilestoneItem.image}
                alt={activeMilestoneItem.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('ArchiveLibraryView__005__PORTRAIT_GENERAL');
                }}
              />
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/70 text-amber-300 text-xs font-bold backdrop-blur-xs">
                {activeMilestoneItem.location}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h3 className="text-base sm:text-lg font-bold text-[#0F2747] dark:text-white leading-snug">
                {activeMilestoneItem.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                {activeMilestoneItem.fullDesc}
              </p>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {language === 'vi' ? 'Bài học bản lĩnh của Đại tướng:' : 'Courage & Strategic Lesson:'}
                </span>
                <p className="text-gray-700 dark:text-gray-200 italic">
                  "{activeMilestoneItem.courageLesson}"
                </p>
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              {onNavigateToTab && (
                <button
                  onClick={() => {
                    setActiveMilestoneItem(null);
                    onNavigateToTab('timeline');
                  }}
                  className="w-full py-2.5 rounded-xl bg-[#C41E24] text-white font-bold text-xs hover:bg-red-700 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{language === 'vi' ? 'Mở trong Dòng chảy Hành trình' : 'Open in Journey Timeline'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setActiveMilestoneItem(null)}
                className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-xs hover:bg-gray-300 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
