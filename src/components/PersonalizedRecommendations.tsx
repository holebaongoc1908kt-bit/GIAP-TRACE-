import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  ArrowRight, 
  Compass, 
  Layers, 
  MapPin, 
  BookOpen, 
  Award,
  Clock
} from 'lucide-react';
import { NavTab } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playCabinetClick, playRadarPing } from '../utils/soundEffects';
import { recordBrowsingHistory } from '../utils/browsingHistory';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

export interface CompactRecommendationItem {
  id: string;
  title: string;
  tag: string;
  category: 'event' | 'document' | 'photo' | 'location' | 'artifact';
  image: string;
  targetTab: NavTab;
  targetArchiveId?: string;
  targetMilestoneId?: string;
}

// 18 tư liệu đa dạng thuộc nhiều danh mục (Sự kiện, Tư liệu, Ảnh, Địa danh, Bảo vật)
const RECOMMENDATION_POOL: CompactRecommendationItem[] = [
  {
    id: 'rec-dbp-1954',
    title: 'ĐIỆN BIÊN PHỦ',
    tag: '1954 · Bước ngoặt lịch sử',
    category: 'event',
    image: getCuratedImage('PersonalizedRecommendations__001__DIEN_BIEN_FLAG_WIN'),
    targetTab: 'radar',
  },
  {
    id: 'rec-army-1944',
    title: '34 CHIẾN SĨ ĐẦU TIÊN',
    tag: '1944 · Khai sinh quân đội',
    category: 'event',
    image: getCuratedImage('PersonalizedRecommendations__002__VIETNAM_PEOPLES_ARMY'),
    targetTab: 'timeline',
    targetMilestoneId: 'm2',
  },
  {
    id: 'rec-tank-843',
    title: 'XE TĂNG 843',
    tag: '1975 · Thống nhất non sông',
    category: 'artifact',
    image: getCuratedImage('PersonalizedRecommendations__003__MUSEUM_TANK_HALL'),
    targetTab: 'archives',
    targetArchiveId: 'arc-11-tank',
  },
  {
    id: 'rec-sig-giap',
    title: 'BÚT TÍCH CHỮ KÝ',
    tag: '1945 · Bảo vật lưu trữ',
    category: 'document',
    image: getCuratedImage('PersonalizedRecommendations__004__GIAP_SIGNATURE'),
    targetTab: 'archives',
    targetArchiveId: 'arc-09-sig',
  },
  {
    id: 'rec-decree-1945',
    title: 'SẮC LỆNH SỐ 21',
    tag: '1945 · Kiến tạo thể chế',
    category: 'document',
    image: getCuratedImage('PersonalizedRecommendations__005__GIAP_DECREE_1945'),
    targetTab: 'archives',
    targetArchiveId: 'arc-10-decree',
  },
  {
    id: 'rec-uncle-ho-atk',
    title: 'BÁC HỒ & ĐẠI TƯỚNG',
    tag: '1948 · Chiến khu Việt Bắc',
    category: 'photo',
    image: getCuratedImage('PersonalizedRecommendations__006__GIAP_WITH_UNCLE_HO'),
    targetTab: 'archives',
    targetArchiveId: 'arc-08-uncle-ho',
  },
  {
    id: 'rec-young-scholar',
    title: 'THẦY GIÁO DẠY SỬ',
    tag: '1930 · Trường Thăng Long',
    category: 'photo',
    image: getCuratedImage('PersonalizedRecommendations__007__GIAP_YOUNG_SCHOLAR'),
    targetTab: 'biography',
    targetArchiveId: 'arc-14-young-scholar',
  },
  {
    id: 'rec-muong-phang',
    title: 'SỞ CHỈ HUY MƯỜNG PHĂNG',
    tag: '1954 · Quyết định lịch sử',
    category: 'location',
    image: getCuratedImage('PersonalizedRecommendations__008__GIAP_MUONG_PHANG_HQ'),
    targetTab: 'map',
  },
  {
    id: 'rec-bunker-d67',
    title: 'HẦM D67 THĂNG LONG',
    tag: '1968 · Đầu não tác chiến',
    category: 'location',
    image: getCuratedImage('PersonalizedRecommendations__009__D67_BUNKER_COMMAND'),
    targetTab: 'archives',
    targetArchiveId: 'arc-13-d67',
  },
  {
    id: 'rec-le-thuy',
    title: 'QUÊ HƯƠNG LỆ THỦY',
    tag: '1911 · Dòng sông Kiến Giang',
    category: 'location',
    image: getCuratedImage('PersonalizedRecommendations__010__GIAP_BIRTHPLACE_ROOM'),
    targetTab: 'timeline',
    targetMilestoneId: 'm1',
  },
  {
    id: 'rec-vung-chua',
    title: 'VŨNG CHÙA – ĐẢO YẾN',
    tag: '2013 · Vị tướng nhân dân',
    category: 'location',
    image: getCuratedImage('PersonalizedRecommendations__011__GIAP_ANCESTRAL_ALTAR'),
    targetTab: 'map',
  },
  {
    id: 'rec-tactical-map',
    title: 'MẬT LỆNH THẦN TỐC',
    tag: '1975 · Giải phóng miền Nam',
    category: 'event',
    image: getCuratedImage('PersonalizedRecommendations__012__TACTICAL_BRIEFING_MAP'),
    targetTab: 'radar',
  },
  {
    id: 'rec-review-troops',
    title: 'ĐỘI QUÂN TIÊN PHONG',
    tag: '1945 · Quảng trường Ba Đình',
    category: 'photo',
    image: getCuratedImage('PersonalizedRecommendations__013__GIAP_REVIEW_TROOPS'),
    targetTab: 'archives',
    targetArchiveId: 'arc-16-review-troops',
  },
  {
    id: 'rec-deer-team',
    title: 'ĐỘI CON NAI CAO BẰNG',
    tag: '1945 · Hợp tác quốc tế',
    category: 'artifact',
    image: getCuratedImage('PersonalizedRecommendations__014__GIAP_DEER_TEAM'),
    targetTab: 'archives',
    targetArchiveId: 'arc-17-deer-team',
  },
  {
    id: 'rec-portrait-warm',
    title: 'NỤ CƯỜI DUNG DỊ',
    tag: 'Hòa bình · Tình cảm nhân dân',
    category: 'photo',
    image: getCuratedImage('PersonalizedRecommendations__015__PORTRAIT_GENERAL'),
    targetTab: 'biography',
  },
];

const STORAGE_VIEWED_KEY = 'giap_trace_viewed_recs_v2';

interface PersonalizedRecommendationsProps {
  isDark: boolean;
  language?: string;
  onNavigateToTab: (tab: NavTab) => void;
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  isDark,
  onNavigateToTab,
  onOpenArchiveDetail,
}) => {
  // Viewed item IDs stored locally to guarantee anti-repetition
  const [viewedIds, setViewedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_VIEWED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [currentItems, setCurrentItems] = useState<CompactRecommendationItem[]>([]);
  const [isRotating, setIsRotating] = useState<boolean>(false);

  // Pick 2-3 items from pool with anti-repetition mechanism
  const pickFreshRecommendations = (
    currentList: CompactRecommendationItem[] = [], 
    alreadyViewed: string[] = viewedIds
  ): CompactRecommendationItem[] => {
    const currentIds = new Set(currentList.map(item => item.id));
    const viewedSet = new Set(alreadyViewed);

    // Candidates: not currently shown, and not yet viewed
    let candidates = RECOMMENDATION_POOL.filter(
      item => !currentIds.has(item.id) && !viewedSet.has(item.id)
    );

    // If candidate pool is exhausted, reset the viewed cycle so user can keep exploring
    if (candidates.length < 3) {
      candidates = RECOMMENDATION_POOL.filter(item => !currentIds.has(item.id));
      try {
        localStorage.removeItem(STORAGE_VIEWED_KEY);
      } catch {}
      setViewedIds([]);
    }

    // Shuffle candidates
    const shuffled = [...candidates].sort(() => Math.random() - 0.5);

    // Pick 3 items from different categories to ensure diversity
    const chosen: CompactRecommendationItem[] = [];
    const usedCategories = new Set<string>();

    for (const item of shuffled) {
      if (!usedCategories.has(item.category)) {
        chosen.push(item);
        usedCategories.add(item.category);
        if (chosen.length === 3) break;
      }
    }

    // If we couldn't get 3 with distinct categories, fill up with remaining candidates
    if (chosen.length < 3) {
      for (const item of shuffled) {
        if (!chosen.some(c => c.id === item.id)) {
          chosen.push(item);
          if (chosen.length === 3) break;
        }
      }
    }

    return chosen;
  };

  // Initial load
  useEffect(() => {
    const initial = pickFreshRecommendations([], viewedIds);
    setCurrentItems(initial);
  }, []);

  // Handle user tapping "↻ GỢI Ý KHÁC"
  const handleRotateRecommendations = () => {
    playCabinetClick();
    setIsRotating(true);

    setTimeout(() => {
      const nextBatch = pickFreshRecommendations(currentItems, viewedIds);
      setCurrentItems(nextBatch);
      setIsRotating(false);
    }, 220);
  };

  // Handle card click
  const handleCardClick = (item: CompactRecommendationItem) => {
    playRadarPing();

    // Mark as viewed
    const nextViewed = [...viewedIds, item.id];
    setViewedIds(nextViewed);
    try {
      localStorage.setItem(STORAGE_VIEWED_KEY, JSON.stringify(nextViewed));
    } catch {}

    recordBrowsingHistory({
      type: item.category === 'document' ? 'archive' : 'milestone',
      itemId: item.id,
      title: item.title,
      subtitle: item.tag,
      category: 'Gợi ý cá nhân hóa',
      tags: [item.title, item.tag, 'Dành cho bạn'],
      image: item.image,
    });

    // Navigate to target
    if (item.targetArchiveId && onOpenArchiveDetail) {
      onOpenArchiveDetail(item.targetArchiveId);
    } else {
      onNavigateToTab(item.targetTab);
    }
  };

  if (currentItems.length === 0) return null;

  return (
    <div 
      id="personalized-recommendations-compact"
      className={`p-4 sm:p-5 rounded-3xl border-2 transition-all shadow-md ${
        isDark
          ? 'bg-gradient-to-r from-[#1E293B] via-[#162720] to-[#1E293B] border-2 border-[#355E3B]/60 shadow-xl'
          : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-2 border-[#D4A017]/50 shadow-md'
      }`}
    >
      {/* 1. Header: Nhỏ gọn, phong cách GIAP TRACE AI, kèm nút ↻ GỢI Ý KHÁC */}
      <div className="flex items-center justify-between gap-3 mb-3 pb-2.5 border-b border-stone-300/40 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-mono font-black uppercase tracking-wider text-[#B91C1C] dark:text-[#D4A017] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              CÁ NHÂN HÓA HÀNH TRÌNH • GIAP TRACE AI
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#0F172A] dark:text-white font-serif mt-0.5">
            Dành cho bạn
          </h3>
        </div>

        {/* Nút ↻ GỢI Ý KHÁC rất nhỏ ở góc */}
        <button
          id="btn-rotate-recommendations"
          onClick={handleRotateRecommendations}
          disabled={isRotating}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isDark
              ? 'bg-[#1E293B] hover:bg-[#334155] text-amber-300 border-[#D4A017]/40 shadow-xs'
              : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300 shadow-xs'
          }`}
          title="Đổi nhóm gợi ý khác chưa từng xem"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Gợi ý khác</span>
          <span className="sm:hidden">Đổi</span>
        </button>
      </div>

      {/* 2. Cụm 2-3 thẻ ngang: Ảnh chiếm 65% card, chữ to, rất ngắn */}
      <div 
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 transition-opacity duration-200 ${
          isRotating ? 'opacity-40' : 'opacity-100'
        }`}
      >
        {currentItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`group rounded-2xl overflow-hidden transition-all cursor-pointer flex flex-col hover:scale-[1.02] ${
              isDark
                ? 'museum-card-dark text-[#F8FAFC]'
                : 'museum-card-light text-[#0F172A]'
            }`}
          >
            {/* Ảnh chiếm 65% diện tích thẻ */}
            <div className="relative w-full h-36 sm:h-40 overflow-hidden bg-black/40 border-b border-[#D4A017]/30">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('PersonalizedRecommendations__016__PORTRAIT_GENERAL');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
              
              {/* Category mini-badge */}
              <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-[#B91C1C] text-white border border-yellow-300/40 shadow-sm">
                {item.category === 'event' ? 'Sự kiện' : item.category === 'document' ? 'Tư liệu' : item.category === 'location' ? 'Địa danh' : item.category === 'photo' ? 'Hình ảnh' : 'Bảo vật'}
              </span>
            </div>

            {/* Chữ nằm bên dưới và rất ngắn (Không có đoạn mô tả dài) */}
            <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-black tracking-wide text-[#0F172A] dark:text-white font-serif uppercase group-hover:text-[#B91C1C] dark:group-hover:text-yellow-300 transition-colors line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-xs font-mono font-bold text-[#B91C1C] dark:text-[#D4A017] mt-0.5 truncate">
                  {item.tag}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-stone-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-black text-stone-600 dark:text-[#CBD5E1] group-hover:text-[#B91C1C] dark:group-hover:text-yellow-300 transition-colors">
                <span>Khám phá ngay</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
