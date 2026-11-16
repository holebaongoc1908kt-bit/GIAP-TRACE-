import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { ThemeMode, NavTab } from './types';
import { AppLanguage } from './utils/i18n';
import { SplashView } from './components/SplashView';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { TimelineView } from './components/TimelineView';
import { MapView } from './components/MapView';
import { CampaignCommandView } from './components/CampaignCommandView';
import { KeyDecisionsView } from './components/KeyDecisionsView';
import { RadarTacticalView } from './components/RadarTacticalView';
import { BiographyDossierView } from './components/BiographyDossierView';
import { InsightsView } from './components/InsightsView';
import { ChallengesView } from './components/ChallengesView';
import { DecisionsAndInsightsView } from './components/DecisionsAndInsightsView';
import { MySpaceView } from './components/MySpaceView';
import { PersonalizedArchivesView } from './components/PersonalizedArchivesView';
import { SettingsView } from './components/SettingsView';
import { MiniAiAssistant } from './components/MiniAiAssistant';
import { AiAssistantModal } from './components/AiAssistantModal';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<AppLanguage>('vi');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [previousTab, setPreviousTab] = useState<NavTab>('timeline');
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [targetArchiveId, setTargetArchiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateToTab = (tab: NavTab) => {
    if (tab !== currentTab) {
      setPreviousTab(currentTab);
      setCurrentTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync dark class on document root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  };

  const isDark = theme === 'dark';

  const handleOpenArchiveFromMilestone = (archiveId: string) => {
    setTargetArchiveId(archiveId);
    setCurrentTab('archives');
  };

  return (
    <div 
      className={`min-h-screen transition-colors duration-200 font-sans overflow-x-hidden w-full max-w-full ${
        isDark ? 'museum-dark-bg text-[#FFFFFF]' : 'museum-light-bg text-[#1E293B]'
      }`}
    >
      {/* 1. Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <SplashView 
            onStart={() => setShowSplash(false)} 
            isDark={isDark} 
          />
        )}
      </AnimatePresence>

      {/* Main Responsive Layout: Optimized horizontally for laptop and mobile */}
      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col relative px-2 sm:px-4 lg:px-6 overflow-x-hidden">
        {/* 2. Top Header Navbar with Laptop Horizontal Navigation */}
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAiChat={() => setIsAiOpen(true)}
          onOpenSplash={() => setShowSplash(true)}
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          language={language}
          onToggleLanguage={toggleLanguage}
          searchKeyword={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* 3. Main Dynamic Content Area */}
        <main id="main-content-view-container" className="flex-1 w-full mt-4">
          {/* TAB 1: TRANG CHỦ (TỔNG QUAN BẢO TÀNG SỐ) */}
          {currentTab === 'home' && (
            <HomeDashboard
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAi={() => setIsAiOpen(true)}
              isDark={isDark}
              language={language}
              onOpenArchiveDetail={handleOpenArchiveFromMilestone}
              onQuickSearch={(query) => {
                setSearchQuery(query);
                setCurrentTab('archives');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* TAB 2: HÀNH TRÌNH (Dòng chảy mốc lịch sử + Bản đồ) */}
          {currentTab === 'timeline' && (
            <TimelineView
              isDark={isDark}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenArchiveDetail={handleOpenArchiveFromMilestone}
            />
          )}

          {/* TAB 3: GIẢI MÃ (Bản lĩnh + Quyết định + Góc nhìn + Nếu là tôi + Quiz) */}
          {currentTab === 'decisions' && (
            <DecisionsAndInsightsView
              isDark={isDark}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {/* TAB 4 HỢP NHẤT: CÁ NHÂN HÓA & TƯ LIỆU (TÌM KIẾM + TƯ LIỆU + GỢI Ý CÁ NHÂN HÓA) */}
          {(currentTab === 'archives' || currentTab === 'search' || currentTab === 'recommendations') && (
            <PersonalizedArchivesView
              isDark={isDark}
              language={language}
              selectedArchiveId={targetArchiveId}
              onClearSelectedArchive={() => setTargetArchiveId(null)}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onNavigateToTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenArchiveDetail={handleOpenArchiveFromMilestone}
            />
          )}

          {/* MỤC RIÊNG CẠNH TƯ LIỆU: RADAR TÁC CHIẾN MẬT LỆNH (ĐIỆN BIÊN PHỦ 1954) */}
          {currentTab === 'radar' && (
            <RadarTacticalView
              isDark={isDark}
              language={language}
              onNavigate={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {/* MỤC NỔI BẬT CẠNH TƯ LIỆU: HỒ SƠ TIỂU SỬ ĐẠI TƯỚNG (CỔ ĐIỂN, CHỮ KÝ, MŨI TÊN TỪ TRẺ TỚI GIÀ) */}
          {currentTab === 'biography' && (
            <BiographyDossierView
              isDark={isDark}
              onNavigateToTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenArchiveDetail={handleOpenArchiveFromMilestone}
            />
          )}


          {/* TAB 5: CỦA TÔI (Nhật ký học tập + Bộ sưu tập Huy hiệu + Khảo sát nhận thức) */}
          {currentTab === 'my-space' && (
            <MySpaceView
              isDark={isDark}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
              onOpenArchiveDetail={handleOpenArchiveFromMilestone}
            />
          )}

          {/* PHẦN RIÊNG BIỆT: CÀI ĐẶT CẠNH CỦA TÔI (ĐỔI CHẾ ĐỘ SÁNG / TỐI & NGÔN NGỮ TIẾNG ANH / VIỆT) */}
          {currentTab === 'settings' && (
            <SettingsView
              isDark={isDark}
              theme={theme}
              onToggleTheme={toggleTheme}
              language={language}
              onSelectLanguage={(lang) => setLanguage(lang)}
            />
          )}

          {/* KHU VỰC: QUYẾT ĐỊNH THEN CHỐT (BẢN LĨNH LỊCH SỬ ĐẠI TƯỚNG 1954) */}
          {(currentTab === 'map' || currentTab === 'campaign') && (
            <KeyDecisionsView
              isDark={isDark}
              onBackToHome={() => setCurrentTab('home')}
              onNavigateToTab={(tab) => {
                setCurrentTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}

          {currentTab === 'insights' && (
            <InsightsView
              isDark={isDark}
              onBackToHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'challenges' && (
            <ChallengesView
              isDark={isDark}
              onBackToHome={() => setCurrentTab('home')}
            />
          )}

          {/* PHẦN GIAP TRACE CHATBOT NHỎ PHÍA DƯỚI RIÊNG LẺ */}
          <MiniAiAssistant
            isDark={isDark}
            language={language}
            onOpenFullChat={() => setIsAiOpen(true)}
          />
        </main>

        {/* 4. Bottom Tab Navigation (Mobile & Small screens) */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isDark={isDark}
          language={language}
        />

        {/* 5. AI Assistant "HỎI DẤU CHÂN" Modal Toàn diện */}
        <AiAssistantModal
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
          isDark={isDark}
        />
      </div>
    </div>
  );
}
