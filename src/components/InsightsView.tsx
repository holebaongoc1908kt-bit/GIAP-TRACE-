import React, { useState } from 'react';
import { Sparkles, ChevronRight, X, BookOpen, Clock, HeartHandshake, Quote } from 'lucide-react';
import { INSIGHT_CARDS } from '../data/museumData';
import { InsightCard } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface InsightsViewProps {
  isDark: boolean;
  onBackToHome: () => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  isDark,
  onBackToHome,
}) => {
  const [selectedStory, setSelectedStory] = useState<InsightCard | null>(null);

  return (
    <div id="insights-vertical-cards-view" className="space-y-6 pb-28 pt-2">
      {/* Top Bar with Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        >
          ← Về trang chủ
        </button>
        <span className="text-xs px-3 py-1.5 rounded-full bg-purple-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{INSIGHT_CARDS.length} Câu chuyện</span>
        </span>
      </div>

      {/* Top Hero Banner with User Provided Historical Poster */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-[#D4AF37]/60 shadow-xl bg-black min-h-[180px] sm:min-h-[220px] flex items-center">
        <img 
          src={getCuratedImage('InsightsView__001__INSIGHTS_GENERAL_ORIGIN')}
          alt="Đại tướng Võ Nguyên Giáp - Dấu son từ cội nguồn cách mạng"
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCuratedImage('InsightsView__002__HERO_FLAG_GENERAL');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 max-w-xl">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#C41E24] text-yellow-300 border border-yellow-400/40 inline-block mb-2">
            TRIẾT LÝ VÌ DÂN
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            Ký ức Huyền thoại & Triết lý Vì Dân
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 mt-2 leading-relaxed drop-shadow-xs">
            Những mẩu chuyện dung dị, nhân cách cao đẹp và tình yêu thương vô bờ bến của vị Tướng vì hòa bình dành cho nhân dân và chiến sĩ.
          </p>
        </div>
      </div>

      {/* Grid of Stories: 1 col on mobile, 2 cols on laptop/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {INSIGHT_CARDS.map((card) => (
          <div
            key={card.id}
            id={`insight-card-${card.id}`}
            className={`rounded-3xl border-2 overflow-hidden flex flex-col justify-between transition-all duration-300 ${
              isDark
                ? 'bg-[#112239] border-[#1E3A5F] text-white hover:border-purple-400'
                : 'bg-white border-gray-200 text-[#1F2937] shadow-sm hover:shadow-xl hover:border-purple-500'
            }`}
          >
            <div>
              {/* Ảnh */}
              <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-gray-900">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCuratedImage('InsightsView__003__PORTRAIT_GENERAL');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Category tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-[#0F2747]/90 backdrop-blur-md text-amber-300 border border-amber-400/40">
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-300" />
                    {card.category}
                  </span>
                </div>

                <div className="absolute bottom-3 right-3 text-xs text-white/90 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-yellow-300" />
                  <span>{card.readTime}</span>
                </div>
              </div>

              {/* Nội dung card */}
              <div className="p-5 space-y-2">
                <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#0F2747] dark:text-white leading-snug">
                  {card.title}
                </h3>
                
                {/* Đoạn trích dưới 50 từ theo yêu cầu */}
                <div className="relative pl-3 border-l-2 border-[#C41E24] dark:border-[#F59E0B] italic text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>"{card.briefExcerpt}"</p>
                </div>
              </div>
            </div>

            {/* Nút bấm Đọc chi tiết */}
            <div className="p-5 pt-0">
              <button
                id={`btn-read-insight-${card.id}`}
                onClick={() => setSelectedStory(card)}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-[#C41E24] dark:hover:border-[#F59E0B] text-xs font-bold text-[#0F2747] dark:text-white flex items-center justify-between transition-colors cursor-pointer group"
              >
                <span>Đọc toàn văn suy ngẫm</span>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C41E24] dark:group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Đọc chi tiết câu chuyện */}
      {selectedStory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-[#0A182D] rounded-3xl p-6 border-2 border-yellow-400/50 shadow-2xl text-[#1F2937] dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#C41E24] text-white text-xs font-bold">
                  {selectedStory.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">{selectedStory.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedStory(null)}
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <h3 className="text-lg font-bold text-[#0F2747] dark:text-white leading-tight">
                {selectedStory.title}
              </h3>
              
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                <Quote className="w-6 h-6 text-[#C41E24] dark:text-[#F59E0B] mb-2 opacity-60" />
                <p>{selectedStory.briefExcerpt}</p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400">
                <p className="font-semibold text-gray-700 dark:text-gray-300">Ghi chú giám tuyển:</p>
                <p className="mt-0.5">{selectedStory.curatorNote}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedStory(null)}
              className="w-full py-2.5 rounded-xl bg-[#0F2747] dark:bg-[#1E3A5F] text-white font-bold text-xs hover:brightness-110 cursor-pointer"
            >
              Đóng lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
