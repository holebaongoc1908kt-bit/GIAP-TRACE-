import React from 'react';
import { 
  Settings, 
  Globe, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Trash2, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Info,
  Layers,
  Heart
} from 'lucide-react';
import { ThemeMode } from '../types';
import { AppLanguage, translations } from '../utils/i18n';
import { getIsMuted, toggleMute, playRadarPing } from '../utils/soundEffects';
import { clearBrowsingHistory } from '../utils/browsingHistory';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface SettingsViewProps {
  isDark: boolean;
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: AppLanguage;
  onSelectLanguage: (lang: AppLanguage) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDark,
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
}) => {
  const t = translations[language];
  const [isMuted, setIsMuted] = React.useState(getIsMuted());
  const [clearedNotice, setClearedNotice] = React.useState(false);

  const handleToggleSound = () => {
    const muted = toggleMute();
    setIsMuted(muted);
    if (!muted) {
      playRadarPing();
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'vi' 
      ? 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử duyệt để làm mới gợi ý cá nhân?' 
      : 'Are you sure you want to clear all browsing history to reset recommendations?')) {
      clearBrowsingHistory();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div id="settings-view-container" className="space-y-6 pb-24 pt-2 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 ${
        isDark 
          ? 'bg-gradient-to-r from-[#1E293B] via-[#162238] to-[#0F172A] border-[#D4A017]/40 text-white shadow-xl' 
          : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF8EC] to-[#FEF3D6] border-[#D4A017]/50 text-[#0F172A] shadow-md'
      } relative overflow-hidden`}>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-[#B91C1C] text-white border border-yellow-400/40 shadow-xs">
                <Settings className="w-3.5 h-3.5" />
                {t.nav.settings.toUpperCase()}
              </span>
              <span className="text-xs font-mono text-[#D4A017] font-bold">GIAP TRACE PREFERENCES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#D4A017] font-serif">
              {t.settings.title}
            </h1>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-[#CBD5E1] max-w-2xl leading-relaxed font-medium">
              {t.settings.subtitle}
            </p>
          </div>

          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-[#D4A017] ring-2 ring-[#D4A017]/30 shadow-md flex-shrink-0 bg-black">
            <img 
              src={getCuratedImage('SettingsView__001__PORTRAIT_GENERAL')} 
              alt="Đại tướng Võ Nguyên Giáp" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SETTING: NGÔN NGỮ (LANGUAGE) */}
        <div className={`p-6 rounded-3xl flex flex-col justify-between ${
          isDark ? 'museum-card-dark text-[#F8FAFC]' : 'museum-card-light text-[#0F172A]'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white font-serif">
                  {t.settings.languageTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-[#CBD5E1]">
                  {t.settings.languageDesc}
                </p>
              </div>
            </div>

            {/* Language Options */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {/* Vietnamese Option */}
              <button
                onClick={() => {
                  playRadarPing();
                  onSelectLanguage('vi');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                  language === 'vi'
                    ? 'border-[#B91C1C] bg-red-500/10 text-[#B91C1C] dark:text-red-400 shadow-md ring-2 ring-red-500/20'
                    : isDark
                    ? 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-[#D4A017]'
                    : 'border-stone-200 bg-white text-stone-800 hover:border-[#D4A017]'
                }`}
              >
                {language === 'vi' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#B91C1C] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="text-xl mb-1">🇻🇳</div>
                <div className="font-extrabold text-sm">Tiếng Việt</div>
                <div className="text-[11px] opacity-75">Ngôn ngữ mặc định</div>
              </button>

              {/* English Option */}
              <button
                onClick={() => {
                  playRadarPing();
                  onSelectLanguage('en');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                  language === 'en'
                    ? 'border-[#D4A017] bg-amber-500/10 text-[#B45309] dark:text-yellow-400 shadow-md ring-2 ring-amber-500/20'
                    : isDark
                    ? 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-[#D4A017]'
                    : 'border-stone-200 bg-white text-stone-800 hover:border-[#D4A017]'
                }`}
              >
                {language === 'en' && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4A017] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className="text-xl mb-1">🇬🇧</div>
                <div className="font-extrabold text-sm">English</div>
                <div className="text-[11px] opacity-75">International Edition</div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/80 text-[11px] text-stone-500 dark:text-[#CBD5E1] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>
              {language === 'vi' 
                ? 'Đã áp dụng chuẩn hóa thuật ngữ học thuật lịch sử quân sự.' 
                : 'Scholarly military history terminology applied across views.'}
            </span>
          </div>
        </div>

        {/* SETTING: CHẾ ĐỘ SÁNG / TỐI (THEME MODE) */}
        <div className={`p-6 rounded-3xl flex flex-col justify-between ${
          isDark ? 'museum-card-dark text-[#F8FAFC]' : 'museum-card-light text-[#0F172A]'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white font-serif">
                  {t.settings.themeTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-[#CBD5E1]">
                  {t.settings.themeDesc}
                </p>
              </div>
            </div>

            {/* Theme Toggle Cards */}
            <div className="grid grid-cols-2 gap-3 mt-5">
              {/* Light Mode Option */}
              <button
                onClick={() => {
                  if (theme !== 'light') onToggleTheme();
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                  !isDark
                    ? 'border-[#B91C1C] bg-red-500/10 text-[#B91C1C] shadow-md ring-2 ring-red-500/20'
                    : 'border-slate-700 bg-slate-900/40 text-slate-300 hover:border-[#D4A017]'
                }`}
              >
                {!isDark && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#B91C1C] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <Sun className="w-5 h-5 text-amber-500 mb-1" />
                <div className="font-extrabold text-sm">{t.settings.lightName}</div>
                <div className="text-[11px] opacity-75">Vàng ngà bảo tàng</div>
              </button>

              {/* Dark Mode Option */}
              <button
                onClick={() => {
                  if (theme !== 'dark') onToggleTheme();
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                  isDark
                    ? 'border-[#D4A017] bg-amber-500/10 text-[#D4A017] shadow-md ring-2 ring-amber-500/20'
                    : 'border-stone-200 bg-white text-stone-800 hover:border-[#D4A017]'
                }`}
              >
                {isDark && (
                  <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#D4A017] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <Moon className="w-5 h-5 text-yellow-400 mb-1" />
                <div className="font-extrabold text-sm">{t.settings.darkName}</div>
                <div className="text-[11px] opacity-75">Tối sâu & Tương phản cao</div>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/80 text-[11px] text-stone-500 dark:text-[#CBD5E1] flex items-center justify-between">
            <span>Đồng bộ chế độ bảo tàng số</span>
            <span className="font-mono font-bold text-[#D4A017]">{isDark ? 'DARK (#0F172A)' : 'LIGHT (#FFF8EC)'}</span>
          </div>
        </div>

        {/* SETTING: ÂM THANH QUÂN SỰ (AUDIO EFFECTS) */}
        <div className={`p-6 rounded-3xl flex flex-col justify-between ${
          isDark ? 'museum-card-dark text-[#F8FAFC]' : 'museum-card-light text-[#0F172A]'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white font-serif">
                  {t.settings.soundTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-[#CBD5E1]">
                  {t.settings.soundDesc}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between p-4 rounded-2xl bg-black/5 dark:bg-slate-900/60 border border-stone-200 dark:border-slate-700">
              <span className="text-xs font-bold text-stone-800 dark:text-slate-200">
                {isMuted ? t.settings.soundStatusOff : t.settings.soundStatusOn}
              </span>
              <button
                onClick={handleToggleSound}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !isMuted
                    ? 'bg-[#B91C1C] text-white shadow-md'
                    : 'bg-stone-300 dark:bg-slate-700 text-stone-800 dark:text-slate-200'
                }`}
              >
                {!isMuted ? 'BẬT (ON)' : 'TẮT (MUTE)'}
              </button>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-stone-500 dark:text-[#CBD5E1]">
            Âm thanh kèn hiệu lệnh và tiếng sonar radar giúp trải nghiệm bảo tàng sống động hơn.
          </p>
        </div>

        {/* SETTING: DỮ LIỆU & LỊCH SỬ DUYỆT (DATA & PRIVACY) */}
        <div className={`p-6 rounded-3xl flex flex-col justify-between ${
          isDark ? 'museum-card-dark text-[#F8FAFC]' : 'museum-card-light text-[#0F172A]'
        }`}>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#0F172A] dark:text-white font-serif">
                  {t.settings.dataTitle}
                </h3>
                <p className="text-xs text-stone-500 dark:text-[#CBD5E1]">
                  {t.settings.dataDesc}
                </p>
              </div>
            </div>

            <div className="mt-5">
              <button
                onClick={handleClearHistory}
                className="w-full py-3 px-4 rounded-2xl border border-red-500/40 text-[#B91C1C] dark:text-red-300 hover:bg-red-500/10 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>{t.settings.clearHistoryBtn}</span>
              </button>
              {clearedNotice && (
                <p className="mt-2 text-center text-xs text-emerald-600 dark:text-emerald-400 font-semibold animate-in fade-in">
                  ✓ {t.settings.clearSuccess}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-200/60 dark:border-slate-700/80 text-[11px] text-stone-500 dark:text-[#CBD5E1] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Dữ liệu hoàn toàn bảo mật cục bộ, không gửi ra ngoài.</span>
          </div>
        </div>
      </div>

      {/* 3. System Heritage Information */}
      <div className={`p-6 rounded-3xl border-2 ${
        isDark ? 'bg-[#1E293B] border-slate-700 text-[#CBD5E1]' : 'bg-white border-[#D4A017]/40 text-stone-700 shadow-md'
      } text-xs space-y-2`}>
        <div className="flex items-center gap-2 font-bold text-[#0F172A] dark:text-[#D4A017]">
          <Info className="w-4 h-4" />
          <span>{t.settings.systemInfoTitle}</span>
        </div>
        <p className="font-semibold text-stone-900 dark:text-white">
          {t.settings.appName}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-[11px] pt-1">
          <span>{t.settings.appVersion}</span>
          <span>•</span>
          <span>{t.settings.heritageOrg}</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-[#B91C1C] dark:text-[#D4A017] font-bold">
            <Heart className="w-3 h-3 fill-current" /> Trân trọng lịch sử dân tộc
          </span>
        </div>
      </div>
    </div>
  );
};
