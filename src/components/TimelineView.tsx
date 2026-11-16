import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  ChevronRight, 
  X, 
  Layers, 
  ExternalLink, 
  Sparkles,
  ArrowLeft,
  Target,
  Star,
  Lightbulb,
  Flag,
  ArrowRight,
  Compass
} from 'lucide-react';
import { TimelineMilestone, NavTab } from '../types';
import { TIMELINE_MILESTONES, ARCHIVE_ITEMS } from '../data/museumData';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playRadarPing } from '../utils/soundEffects';
import { recordBrowsingHistory } from '../utils/browsingHistory';
import { MILESTONE_EXHIBITIONS, MilestoneExhibitionData } from '../data/milestoneExhibitionsData';
import { MilestoneInteractiveExhibition } from './MilestoneInteractiveExhibition';
import { KeyDecisionsView } from './KeyDecisionsView';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface TimelineViewProps {
  isDark: boolean;
  onNavigateToTab?: (tab: NavTab) => void;
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  isDark,
  onNavigateToTab,
  onOpenArchiveDetail,
}) => {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<'journey' | 'decision'>('journey');

  const filterOptions = [
    { id: 'all', label: 'Tất cả mốc' },
    { id: '1911-1944', label: '1911 - 1944' },
    { id: '1945-1954', label: '1945 - 1954' },
    { id: '1955-1975', label: '1955 - 1975' },
    { id: 'post-1975', label: 'Sau 1975' },
  ];

  const filteredMilestones = TIMELINE_MILESTONES.filter((m) => {
    const yr = parseInt(m.year, 10);
    if (activeFilter === '1911-1944') return yr <= 1944;
    if (activeFilter === '1945-1954') return yr >= 1945 && yr <= 1954;
    if (activeFilter === '1955-1975') return yr >= 1955 && yr <= 1975;
    if (activeFilter === 'post-1975') return yr > 1975;
    return true;
  });

  return (
    <div id="timeline-interactive-view" className="space-y-6 pb-28 px-2 sm:px-4 pt-2">
      {/* 1. SECTION SWITCHER TABS: GỘP "HÀNH TRÌNH CUỘC ĐỜI" & "QUYẾT ĐỊNH THEN CHỐT" */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-black/5 dark:bg-white/5 border border-amber-500/30">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSection('journey')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'journey'
                ? 'bg-gradient-to-r from-red-700 to-red-600 text-white shadow-md ring-2 ring-amber-400'
                : 'text-stone-700 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-300" />
            <span>Dòng chảy Hành trình (1911 – 2013)</span>
          </button>

          <button
            onClick={() => setActiveSection('decision')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSection === 'decision'
                ? 'bg-gradient-to-r from-red-700 to-rose-700 text-white shadow-md ring-2 ring-amber-400'
                : 'text-stone-700 dark:text-stone-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Quyết định Then chốt (Điện Biên 1954)</span>
            <span className="px-1.5 py-0.2 rounded bg-red-800 text-white text-[10px] font-mono font-black uppercase">
              BƯỚC NGOẶT
            </span>
          </button>
        </div>

        <span className="text-xs font-mono text-stone-500 dark:text-stone-400 font-bold hidden md:inline">
          {activeSection === 'journey' ? `${filteredMilestones.length} Dấu mốc lịch sử` : 'Hồ sơ quyết định 26/01/1954'}
        </span>
      </div>

      {/* 2. NỘI DUNG HIỂN THỊ THEO TAB ĐƯỢC CHỌN */}
      {activeSection === 'decision' ? (
        <KeyDecisionsView
          isDark={isDark}
          onBackToHome={() => setActiveSection('journey')}
          onNavigateToTab={onNavigateToTab}
        />
      ) : (
        <>
          {/* Header Bar */}
          <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#B22222] text-white shadow-xs">
              <Compass className="w-4 h-4 text-yellow-300" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-[#1E293B] dark:text-white">
              Hành Trình Cuộc Đời & Dấu Mốc Lịch Sử
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-[#D4A017]/20 text-[#B45309] dark:text-[#D4A017] font-bold border border-[#D4A017]/40 shadow-xs">
            {TIMELINE_MILESTONES.length} Dấu mốc
          </span>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 dark:text-[#CBD5E1] font-medium">
          Khám phá biên niên sử cuộc đời Đại tướng qua từng thời kỳ • Nhấn vào từng mốc để mở Triển lãm số đa giác quan
        </p>
      </div>

      {/* Horizontal Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveFilter(opt.id)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-bold transition-all cursor-pointer shadow-xs ${
              activeFilter === opt.id
                ? 'bg-[#B91C1C] text-white border-2 border-yellow-300 shadow-md scale-105'
                : isDark
                ? 'bg-[#1E293B] text-[#E2E8F0] border border-slate-700 hover:border-[#D4A017]'
                : 'bg-white text-[#1E293B] border border-amber-900/20 hover:border-[#B91C1C]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Interactive Scrollable Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 mt-4 before:absolute before:left-[11px] sm:before:left-[15px] before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#0F2747]/40 dark:before:via-[#D4AF37]/40 before:to-[#0F2747]/10">
        {filteredMilestones.map((milestone) => (
          <div
            key={milestone.id}
            id={`milestone-${milestone.id}`}
            onClick={() => {
              playRadarPing();
              setSelectedMilestone(milestone);
              recordBrowsingHistory({
                type: 'milestone',
                itemId: milestone.id,
                title: `${milestone.year}: ${milestone.title}`,
                subtitle: milestone.shortDesc,
                category: milestone.period,
                tags: [milestone.location, milestone.year, milestone.period, 'Dấu mốc'],
                image: milestone.image
              });
            }}
            className={`relative group rounded-3xl p-4 sm:p-5 transition-all duration-300 cursor-pointer active:scale-[0.99] hover:-translate-y-1 ${
              isDark
                ? 'museum-card-dark text-[#F8FAFC]'
                : 'museum-card-light text-[#0F172A]'
            }`}
          >
            {/* Timeline Dot on line */}
            <div className="absolute -left-[31px] sm:-left-[39px] top-6 w-4 h-4 rounded-full bg-[#B91C1C] border-2 border-[#D4A017] shadow-sm group-hover:scale-125 transition-transform flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4A017]" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Milestone Thumbnail */}
              <div className="relative w-full sm:w-40 h-40 sm:h-32 rounded-2xl overflow-hidden bg-black flex-shrink-0 group border border-[#D4A017]/30 shadow-md">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCuratedImage('TimelineView__001__PORTRAIT_GENERAL');
                  }}
                />
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-[#B91C1C] text-white text-xs font-black shadow-md border border-yellow-300/40">
                  {milestone.year}
                </div>
              </div>

              {/* Milestone Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#B45309] dark:text-[#D4A017] font-bold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#B91C1C] dark:text-[#D4A017]" />
                    <span>{milestone.location}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-[#0F172A] dark:text-white leading-snug group-hover:text-[#B91C1C] dark:group-hover:text-yellow-300 transition-colors font-serif">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-700 dark:text-[#CBD5E1] line-clamp-2 mt-1.5 leading-relaxed font-medium">
                    {milestone.shortDesc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#355E3B]/10 dark:bg-[#355E3B]/25 text-[#355E3B] dark:text-[#86EFAC] font-bold text-[11px] border border-[#355E3B]/30">
                    {milestone.period}
                  </span>
                  <span className="text-[#B91C1C] dark:text-[#D4A017] font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    🏛️ Khám phá triển lãm →
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

          {/* DETAIL MODAL / EXHIBITION VIEW AS REQUESTED: 80% VISUAL & INTERACTIVE STORYTELLING */}
          {selectedMilestone && (() => {
            const exhibitionData = MILESTONE_EXHIBITIONS[selectedMilestone.id] || {
              id: selectedMilestone.id,
              year: selectedMilestone.year,
              title: selectedMilestone.title,
              subtitle: selectedMilestone.shortDesc,
              poeticTagline: 'Mỗi bước chân lịch sử là một trang sử vàng của dân tộc.',
              locationName: selectedMilestone.location,
              locationCoordinates: 'Việt Nam • Bản đồ lịch sử',
              period: selectedMilestone.period,
              heroImage: selectedMilestone.image,
              didYouKnowFact: selectedMilestone.memorablePoint || selectedMilestone.shortDesc,
              historicalVoiceScript: selectedMilestone.fullDesc,
              audioDurationSeconds: 40,
              gallery: [
                {
                  url: selectedMilestone.image,
                  caption: selectedMilestone.title,
                  badge: 'Tư liệu lịch sử'
                }
              ],
              interactiveChallenge: {
                question: `Sự kiện "${selectedMilestone.title}" diễn ra vào năm nào?`,
                options: [
                  `Năm ${selectedMilestone.year}`,
                  'Năm 1945',
                  'Năm 1954',
                  'Năm 1975'
                ],
                correctIndex: 0,
                explanation: `Chính xác! Dấu mốc lịch sử "${selectedMilestone.title}" ghi dấu ấn sâu sắc vào năm ${selectedMilestone.year}.`
              }
            };

            return (
              <MilestoneInteractiveExhibition
                data={exhibitionData}
                isDark={isDark}
                onClose={() => setSelectedMilestone(null)}
                onNavigateToTab={onNavigateToTab}
              />
            );
          })()}
        </>
      )}
    </div>
  );
};
