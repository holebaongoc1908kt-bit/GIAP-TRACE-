import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Compass, Shield, Sparkles, Flag, Volume2 } from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playTrumpetSalute } from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface SplashViewProps {
  onStart: () => void;
  isDark: boolean;
}

export const SplashView: React.FC<SplashViewProps> = ({ onStart, isDark }) => {
  const handleStartWithSound = () => {
    playTrumpetSalute();
    onStart();
  };

  return (
    <motion.div 
      id="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden ${
        isDark ? 'bg-[#0A1322] text-[#F3F4F6]' : 'bg-[#0F2747] text-white'
      }`}
    >
      {/* Background Image: General Vo Nguyen Giap with the Vietnamese National Flag */}
      <div className="absolute inset-0 z-0">
        <img 
          src={getCuratedImage('SplashView__001__HERO_FLAG_GENERAL')} 
          alt="Đại tướng Võ Nguyên Giáp và cờ Tổ quốc Việt Nam"
          className="w-full h-full object-cover object-center opacity-40 scale-105 transition-transform duration-1000"
          onError={(e) => {
            (e.target as HTMLImageElement).src = getCuratedImage('SplashView__002__PORTRAIT_GENERAL');
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1322] via-[#0F2747]/80 to-[#991B1B]/40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.2),transparent_60%)]" />
      </div>

      {/* Top Heritage Badge */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-yellow-400/40 bg-black/60 backdrop-blur-md text-yellow-300 text-xs font-bold uppercase tracking-wider shadow-lg">
          <Flag className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          <span>Bảo tàng số Di sản Quân sự Quốc gia</span>
        </div>
      </div>

      {/* Center Identity */}
      <div className="relative z-10 my-auto py-6 max-w-2xl">
        {/* Portrait Medallion: Hình vuông của Bác góc rộng vừa phải, thấy huân chương trên ngực, giữ nguyên nét mặt nụ cười dung dị, không đội mũ */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 rounded-3xl overflow-hidden border-2 border-yellow-400 shadow-2xl shadow-yellow-500/30 group bg-black/40">
          <img 
            src={getCuratedImage('SplashView__003__PORTRAIT_GENERAL')} 
            alt="Đại tướng Võ Nguyên Giáp nụ cười dung dị, huân chương trên ngực áo"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 border border-yellow-400/50 rounded-3xl pointer-events-none" />
          {/* Góc hình là Lá cờ Việt Nam cờ đỏ sao vàng */}
          <div 
            className="absolute bottom-1.5 right-1.5 px-2 py-1 bg-[#C41E24] rounded-lg border border-yellow-300 text-yellow-300 shadow-lg flex items-center gap-1.5"
            title="Lá cờ Việt Nam Cờ đỏ Sao vàng"
          >
            <div className="w-4 h-3 bg-[#DA251D] flex items-center justify-center rounded-xs shadow-xs">
              <svg viewBox="0 0 24 24" className="w-3 h-3 text-[#FFFF00] fill-current">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-yellow-300 tracking-wider">VN</span>
          </div>
        </div>

        {/* Brand Name exactly as requested */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight drop-shadow-md">
          GIAP TRACE
        </h1>

        {/* Tagline */}
        <div className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-yellow-400 tracking-wide mb-4">
          <span className="w-8 h-[3px] bg-yellow-400 rounded-full" />
          <span>DẤU CHÂN ĐẠI TƯỚNG VÕ NGUYÊN GIÁP</span>
        </div>

        {/* Brief Concept Note */}
        <p className="text-sm sm:text-base text-gray-200 leading-relaxed max-w-xl font-normal drop-shadow-sm">
          Bảo tàng số tương tác mở ra hành trình kiến tạo bản lĩnh, tái hiện các dấu mốc lịch sử, 
          chiến dịch oanh liệt và khí phách của Quân đội Nhân dân Việt Nam anh hùng.
        </p>
      </div>

      {/* Bottom Action */}
      <div className="relative z-10 pb-4 flex flex-col gap-3 max-w-xl">
        <button
          id="btn-start-journey"
          onClick={handleStartWithSound}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#C41E24] via-[#DC2626] to-[#B91C1C] hover:from-[#EF4444] hover:to-[#991B1B] text-white font-extrabold text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 shadow-xl shadow-red-900/50 border border-yellow-300/60 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Compass className="w-5 h-5 text-yellow-300" />
          <span>Bắt đầu hành trình</span>
          <ArrowRight className="w-5 h-5 text-yellow-300" />
        </button>

        <div className="flex items-center justify-end text-[11px] text-gray-300 px-2 font-mono">
          <span className="flex items-center gap-1 text-yellow-400">
            <Volume2 className="w-3.5 h-3.5" />
            Âm thanh hiệu lệnh quân vụ
          </span>
        </div>
      </div>
    </motion.div>
  );
};
