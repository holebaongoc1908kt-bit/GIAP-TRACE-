import React from 'react';
import { Home, GitCommitVertical, Layers, BookOpen, Sparkles, Settings, Scroll, Radar, Award, Shield } from 'lucide-react';
import { NavTab } from '../types';
import { playRadarPing, playGiaiMaTransitionSound } from '../utils/soundEffects';
import { AppLanguage, translations } from '../utils/i18n';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  isDark: boolean;
  language?: AppLanguage;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDark,
  language = 'vi',
}) => {
  const t = translations[language].nav;

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'timeline', label: t.timeline, icon: GitCommitVertical },
    { id: 'decisions', label: t.decisions, icon: Award },
    { id: 'archives', label: language === 'vi' ? 'Tư liệu' : 'Archives', icon: Layers },
    { id: 'radar', label: language === 'vi' ? 'Radar' : 'Radar', icon: Radar },
    { id: 'biography', label: language === 'vi' ? 'Hồ sơ' : 'Dossier', icon: Scroll },
    { id: 'my-space', label: t.mySpace, icon: BookOpen },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Điều hướng di động"
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl transition-colors duration-200 safe-area-pb ${
        isDark
          ? 'bg-[#0F172A]/95 border-[#D4A017]/40 text-[#E2E8F0]'
          : 'bg-[#FFF8EC]/95 border-[#D4A017]/40 text-[#1E293B] shadow-lg'
      }`}
    >
      <div className="flex items-center justify-around h-16 px-1 max-w-xl mx-auto overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => {
                if (item.id === 'decisions') {
                  playGiaiMaTransitionSound();
                } else {
                  playRadarPing();
                }
                onSelectTab(item.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] py-1 px-1 transition-all cursor-pointer relative whitespace-nowrap ${
                isActive
                  ? 'text-[#B91C1C] dark:text-[#D4A017] font-bold'
                  : 'text-stone-700 dark:text-slate-300 hover:text-[#B91C1C] dark:hover:text-[#FFFFFF]'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-[#B91C1C] dark:bg-[#D4A017] rounded-b-full shadow-md shadow-red-500/50" />
              )}
              
              <Icon 
                className={`w-4 h-4 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-[#B91C1C] dark:text-[#D4A017]' : ''
                }`}
              />
              <span className="text-[10px] mt-0.5 font-medium leading-tight truncate max-w-[60px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
