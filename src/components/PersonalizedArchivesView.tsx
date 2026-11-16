import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Search, 
  BookOpen, 
  Compass, 
  CheckCircle2,
  Filter,
  Film
} from 'lucide-react';
import { NavTab } from '../types';
import { AppLanguage, translations } from '../utils/i18n';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { ArchiveLibraryView } from './ArchiveLibraryView';
import { HistoryVideoStudio } from './HistoryVideoStudio';
import { playCabinetClick } from '../utils/soundEffects';

interface PersonalizedArchivesViewProps {
  isDark: boolean;
  language?: AppLanguage;
  selectedArchiveId?: string | null;
  onClearSelectedArchive?: () => void;
  searchQuery?: string;
  onSearchQueryChange?: (val: string) => void;
  onNavigateToTab?: (tab: NavTab) => void;
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export const PersonalizedArchivesView: React.FC<PersonalizedArchivesViewProps> = ({
  isDark,
  language = 'vi',
  selectedArchiveId,
  onClearSelectedArchive,
  searchQuery,
  onSearchQueryChange,
  onNavigateToTab,
  onOpenArchiveDetail,
}) => {
  // Sub-view tab mode inside the combined feature:
  // 'studio': AI Historical Cinema Studio (Gemini Omni Flash)
  // 'all': Displays Studio + Recommendations + Archives
  // 'recommendations': Focuses on personalized journey recommendations
  // 'archives': Focuses directly on comprehensive archive search and document catalog
  const [subTab, setSubTab] = useState<'studio' | 'all' | 'recommendations' | 'archives'>('studio');

  const handleSubTabChange = (mode: 'studio' | 'all' | 'recommendations' | 'archives') => {
    playCabinetClick();
    setSubTab(mode);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16">
      {/* 1. UNIFIED FEATURE BANNER & SUB-TAB SWITCHER */}
      <div 
        className={`p-4 sm:p-6 rounded-3xl border-2 transition-all shadow-lg ${
          isDark
            ? 'bg-gradient-to-r from-[#0F172A] via-[#162720] to-[#0F172A] border-[#D4A017]/40 shadow-xl'
            : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-[#D4A017]/50 shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#B91C1C] text-white shadow-xs">
                {language === 'vi' ? 'KHÔNG GIAN HỢP NHẤT' : 'UNIFIED ARCHIVES'}
              </span>
              <span className="text-xs font-mono font-bold text-[#D4A017]">
                GIAP TRACE • ARCHIVE & PERSONALIZATION
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0F172A] dark:text-white font-serif">
              {language === 'vi' ? 'Cá Nhân Hóa & Kho Tư Liệu Di Sản' : 'Personalized Archives & Search Hub'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-2xl mt-1 leading-relaxed">
              {language === 'vi' 
                ? 'Hệ thống tra cứu thông minh gộp chung kho tư liệu lịch sử, sắc lệnh, bút tích với các gợi ý học tập cá nhân hóa dành riêng cho bạn.'
                : 'Intelligent heritage hub combining archival documents, decrees, and verified artifacts with your personalized exploration journey.'}
            </p>
          </div>

          {/* Clean Segmented Sub-View Toggle (High contrast) */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#08101F] border-2 border-stone-700 shrink-0 self-start md:self-center shadow-lg">
            <button
              onClick={() => handleSubTabChange('studio')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'studio'
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-xl ring-2 ring-[#FDE047]'
                  : 'bg-[#1E293B] text-stone-100 hover:text-white hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <Film className="w-4 h-4 text-[#FDE047]" />
              <span>{language === 'vi' ? 'Xưởng Phim Lịch Sử AI' : 'AI Video Studio'}</span>
            </button>

            <button
              onClick={() => handleSubTabChange('recommendations')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'recommendations'
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-xl ring-2 ring-[#FDE047]'
                  : 'bg-[#1E293B] text-stone-100 hover:text-white hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{language === 'vi' ? 'Gợi ý cá nhân hóa' : 'Personalized'}</span>
            </button>

            <button
              onClick={() => handleSubTabChange('archives')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'archives'
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-xl ring-2 ring-[#FDE047]'
                  : 'bg-[#1E293B] text-stone-100 hover:text-white hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-400" />
              <span>{language === 'vi' ? 'Kho tư liệu & Tra cứu' : 'Archive Catalog'}</span>
            </button>

            <button
              onClick={() => handleSubTabChange('all')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap ${
                subTab === 'all'
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white shadow-xl ring-2 ring-[#FDE047]'
                  : 'bg-[#1E293B] text-stone-100 hover:text-white hover:bg-stone-700 border border-stone-700'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-300" />
              <span>{language === 'vi' ? 'Toàn diện' : 'All'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AI HISTORICAL CINEMA STUDIO SECTION */}
      {(subTab === 'studio' || subTab === 'all') && (
        <section aria-label="Xưởng phim lịch sử AI">
          <HistoryVideoStudio
            isDark={isDark}
            language={language}
          />
        </section>
      )}

      {/* 3. PERSONALIZED RECOMMENDATIONS SECTION */}
      {(subTab === 'all' || subTab === 'recommendations') && (
        <section aria-label="Gợi ý cá nhân hóa">
          <PersonalizedRecommendations
            isDark={isDark}
            language={language}
            onNavigateToTab={onNavigateToTab || (() => {})}
            onOpenArchiveDetail={onOpenArchiveDetail}
          />
        </section>
      )}

      {/* 4. COMPREHENSIVE ARCHIVE LIBRARY & SEARCH CATALOG */}
      {(subTab === 'all' || subTab === 'archives') && (
        <section aria-label="Kho tư liệu và tra cứu">
          <ArchiveLibraryView
            isDark={isDark}
            language={language}
            selectedArchiveId={selectedArchiveId}
            onClearSelectedArchive={onClearSelectedArchive}
            searchQuery={searchQuery}
            onSearchQueryChange={onSearchQueryChange}
            onNavigateToTab={onNavigateToTab}
          />
        </section>
      )}
    </div>
  );
};
