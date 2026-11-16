import React from 'react';
import { 
  Moon, 
  Sun, 
  Bot, 
  Compass, 
  Home, 
  GitCommitVertical, 
  MapPin,
  ShieldAlert,
  Layers, 
  Award,
  Volume2,
  VolumeX, 
  Sparkles,
  BookOpen,
  Settings,
  Globe,
  Scroll,
  Stamp,
  Radar
} from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { ThemeMode, NavTab } from '../types';
import { toggleMute, getIsMuted, playRadarPing, playGiaiMaTransitionSound } from '../utils/soundEffects';
import { AppLanguage, translations } from '../utils/i18n';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAiChat: () => void;
  onOpenSplash: () => void;
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  language: AppLanguage;
  onToggleLanguage: () => void;
  searchKeyword?: string;
  onSearchChange?: (val: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenAiChat,
  onOpenSplash,
  currentTab,
  onSelectTab,
  language,
  onToggleLanguage,
  searchKeyword = '',
  onSearchChange,
}) => {
  const isDark = theme === 'dark';
  const [isMuted, setIsMuted] = React.useState(getIsMuted());
  const t = translations[language];

  const handleToggleSound = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (!muted) {
      playRadarPing();
    }
  };

  // Hệ thống Tab điều hướng: 
  // - Có mục riêng "Tìm kiếm" (Search) nổi bật với icon kính lúp màu vàng
  // - Gợi ý (Recommendations) là phần riêng biệt ở phía trên
  const navItems = [
    { id: 'home' as NavTab, label: t.nav.home, icon: Home },
    { id: 'timeline' as NavTab, label: t.nav.timeline, icon: GitCommitVertical },
    { id: 'decisions' as NavTab, label: t.nav.decisions, icon: Award },
    { 
      id: 'archives' as NavTab, 
      label: language === 'vi' ? 'Cá nhân hóa & Tư liệu' : 'Personalized Archives', 
      icon: Layers,
      highlight: true
    },
    { 
      id: 'radar' as NavTab, 
      label: language === 'vi' ? 'Radar Mật lệnh' : 'Tactical Radar', 
      icon: Radar, 
      radarHighlight: true 
    },
    { 
      id: 'biography' as NavTab, 
      label: language === 'vi' ? 'Hồ sơ Đại tướng' : 'General Dossier', 
      icon: Scroll, 
      specialVintageHighlight: true 
    },
    { id: 'my-space' as NavTab, label: t.nav.mySpace, icon: BookOpen },
    { id: 'settings' as NavTab, label: t.nav.settings, icon: Settings },
  ];

  return (
    <header 
      id="main-app-header"
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        isDark 
          ? 'bg-[#0F172A]/95 border-[#D4A017]/40 text-[#FFFFFF]' 
          : 'bg-[#FFF8EC]/95 border-[#D4A017]/40 text-[#1E293B]'
      } backdrop-blur-md px-3 sm:px-4 lg:px-6 py-2.5 shadow-md`}
    >
      <div className="w-full flex items-center justify-between gap-3">
        {/* Brand Identity */}
        <div 
          onClick={onOpenSplash}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          title="Xem lại màn hình mở đầu"
        >
          <div className="relative w-10 h-10 rounded-2xl overflow-hidden border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30 flex-shrink-0 shadow-md bg-black/40">
            <img 
              src={getCuratedImage('Navbar__001__PORTRAIT_GENERAL')} 
              alt="Đại tướng Võ Nguyên Giáp" 
              className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = getCuratedImage('Navbar__002__HERO_FLAG_GENERAL');
              }}
            />
            <div className="absolute bottom-0 right-0 w-3.5 h-3 bg-[#DA251D] border-t border-l border-yellow-300 flex items-center justify-center rounded-tl-xs shadow-xs">
              <svg viewBox="0 0 24 24" className="w-2 h-2 text-[#FFFF00] fill-current">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm sm:text-base tracking-tight text-[#B91C1C] dark:text-[#D4A017]">
                {t.brand.title}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#B91C1C] text-white shadow-xs">
                {t.brand.badge}
              </span>
            </div>
            <span className="text-[11px] text-stone-600 dark:text-[#CBD5E1] font-medium line-clamp-1">
              {t.brand.subtitle}
            </span>
          </div>
        </div>

        {/* Laptop / Desktop Horizontal Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-2xl border border-black/10 dark:border-white/10 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'decisions') {
                    playGiaiMaTransitionSound();
                  } else {
                    playRadarPing();
                  }
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#B91C1C] text-white shadow-md ring-2 ring-[#D4A017]'
                    : (item as any).campaignBoardHighlight
                    ? 'bg-[#991b1b]/15 dark:bg-[#991b1b]/35 border border-[#991b1b]/50 dark:border-[#dc2626]/60 text-[#991b1b] dark:text-[#fca5a5] hover:border-[#991b1b] hover:scale-105 shadow-xs font-black'
                    : (item as any).radarHighlight
                    ? 'bg-[#355E3B]/20 dark:bg-[#355E3B]/40 border border-[#355E3B]/60 text-[#355E3B] dark:text-[#86EFAC] hover:border-[#86EFAC] hover:scale-105 shadow-xs'
                    : item.specialVintageHighlight
                    ? 'bg-gradient-to-r from-red-600/20 via-amber-500/25 to-red-600/20 border-2 border-[#B91C1C]/60 dark:border-[#D4A017]/60 text-[#B91C1C] dark:text-[#D4A017] hover:border-[#D4A017] hover:scale-105 shadow-md animate-pulse'
                    : (item as any).highlight
                    ? 'text-[#B45309] dark:text-[#D4A017] bg-amber-500/10 hover:bg-amber-500/20'
                    : 'text-stone-700 dark:text-[#E2E8F0] hover:bg-black/10 dark:hover:bg-white/10 hover:text-[#B91C1C] dark:hover:text-[#D4A017]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  (item as any).campaignBoardHighlight && !isActive
                    ? 'text-[#991b1b] dark:text-[#f87171]'
                    : item.specialVintageHighlight && !isActive 
                    ? 'text-[#B91C1C] dark:text-[#D4A017]' 
                    : ''
                }`} />
                <span>{item.label}</span>
                {(item as any).campaignBoardHighlight && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#991b1b] text-white font-extrabold uppercase tracking-tight shadow-xs">
                    HOT
                  </span>
                )}
                {item.specialVintageHighlight && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#B91C1C] text-white font-extrabold uppercase tracking-tight shadow-xs">
                    MỚI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">

          {/* Quick Language Toggle Button (VN / EN) */}
          <button
            id="btn-nav-language-toggle"
            onClick={onToggleLanguage}
            title={language === 'vi' ? 'Chuyển sang English' : 'Switch to Tiếng Việt'}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold border border-gray-300 dark:border-gray-700 bg-black/5 dark:bg-white/5 hover:border-[#D4AF37] hover:bg-black/10 dark:hover:bg-white/10 transition-all cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'vi' ? 'VI' : 'EN'}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            id="btn-nav-audio-toggle"
            onClick={handleToggleSound}
            aria-label={isMuted ? t.brand.audioOn : t.brand.audioOff}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isMuted 
                ? 'bg-gray-100 dark:bg-[#162A45] border-gray-200 dark:border-[#1E3A5F] text-gray-400' 
                : 'bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-500/50 text-amber-600 dark:text-amber-400'
            }`}
            title={isMuted ? t.brand.audioOn : t.brand.audioOff}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* AI Assistant "GIAP TRACE" Button (Phần trên đỉnh) */}
          <button
            id="btn-open-ai-chat"
            onClick={onOpenAiChat}
            aria-label="Mở trợ lý GIAP TRACE"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#C41E24] to-[#991B1B] text-white border border-yellow-400/50 shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <div className="w-4 h-4 rounded-full overflow-hidden border border-yellow-300 flex-shrink-0 bg-black">
              <img 
                src={ASSET_PATHS.GIAP_TRACE_LOGO} 
                alt="GIAP TRACE" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:inline">{t.brand.aiBtn}</span>
          </button>

          {/* Dark/Light Mode Toggle */}
          <button
            id="btn-toggle-theme"
            onClick={onToggleTheme}
            aria-label={isDark ? t.brand.lightMode : t.brand.darkMode}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-[#162A45] border-[#1E3A5F] text-[#F59E0B] hover:bg-[#1E3A5F]' 
                : 'bg-gray-100 border-gray-200 text-[#0F2747] hover:bg-gray-200'
            }`}
            title={isDark ? t.brand.lightMode : t.brand.darkMode}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
