import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  Stamp, 
  Award, 
  Calendar, 
  MapPin, 
  Shield, 
  BookOpen, 
  Sparkles, 
  Printer, 
  Search, 
  Eye, 
  Share2, 
  CheckCircle2, 
  Maximize2, 
  Volume2, 
  VolumeX,
  Scroll,
  Layers,
  ChevronRight,
  Bookmark,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { 
  playCabinetClick, 
  playVictoryFanfare,
  playPaperTurn,
  playHistoricalStamp
} from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface BiographyDossierViewProps {
  isDark: boolean;
  onNavigateToTab?: (tab: any) => void;
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export const BiographyDossierView: React.FC<BiographyDossierViewProps> = ({
  isDark,
  onNavigateToTab,
  onOpenArchiveDetail,
}) => {
  // Bộ lọc / chế độ xem trong hồ sơ
  const [activeDossierSection, setActiveDossierSection] = useState<'all' | 'chronology' | 'profile' | 'signature' | 'tributes'>('all');
  const [signatureInkColor, setSignatureInkColor] = useState<'black' | 'red' | 'blue' | 'gold'>('black');
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{ url: string; title: string; period: string; caption: string } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Danh sách các chuỗi ảnh theo dòng thời gian "TỪ TRẺ TỚI GIÀ" có mũi tên đánh dấu
  const chronologicalStages = [
    {
      step: '01',
      period: '1911 - 1939',
      stageTitle: 'Thời Niên Thiếu & Thầy Giáo Trường Thăng Long',
      ageSpan: '0 - 28 tuổi',
      mainImage: getCuratedImage('BiographyDossierView__001__GIAP_YOUNG_SCHOLAR'),
      secondaryImage: getCuratedImage('BiographyDossierView__002__GIAP_FAMILY_PORTRAIT'),
      imageLabel: 'Thầy giáo Võ Nguyên Giáp bên bàn đèn sách',
      context: 'Sinh ngày 25/8/1911 tại làng An Xá, xã Lộc Thủy, Lệ Thủy, Quảng Bình. Học Quốc học Huế, tốt nghiệp Cử nhân Luật (Đại học Luật Đông Dương). Dạy lịch sử - địa lý tại trường Tư thục Thăng Long (Hà Nội), gieo mầm lòng yêu nước và ý thức độc lập cho học sinh.',
      highlightQuote: 'Trước khi cầm súng, tôi là một thầy giáo dạy sử. Lịch sử dân tộc đã tôi luyện nên ý chí cầm quân của tôi.',
      tags: ['An Xá', 'Quốc học Huế', 'Cử nhân Luật', 'Trường Thăng Long'],
    },
    {
      step: '02',
      period: '1940 - 1945',
      stageTitle: 'Núi Rừng Việt Bắc & Khởi Nguồn Binh Nghiệp',
      ageSpan: '29 - 34 tuổi',
      mainImage: getCuratedImage('BiographyDossierView__003__GIAP_ORIGIN_INSIGHTS'),
      secondaryImage: getCuratedImage('BiographyDossierView__004__VIETNAM_PEOPLES_ARMY'),
      imageLabel: 'Đồng chí Võ Nguyên Giáp nụ cười trẻ trung nơi căn cứ địa Việt Bắc',
      context: 'Gặp Bác Hồ tại Côn Minh (1940). Ngày 22/12/1944, thừa ủy quyền của Lãnh tụ Hồ Chí Minh, đồng chí chỉ huy lễ thành lập Đội Việt Nam Tuyên truyền Giải phóng quân với 34 chiến sĩ tại khu rừng Trần Hưng Đạo (Cao Bằng), lập nên chiến công đầu Phai Khắt, Nà Ngần.',
      highlightQuote: 'Đội Việt Nam Tuyên truyền Giải phóng quân tuy lúc đầu quy mô nhỏ nhưng tiền đồ của nó rất vẻ vang.',
      tags: ['Côn Minh', 'Việt Bắc', '34 chiến sĩ', 'Khu rừng Trần Hưng Đạo'],
    },
    {
      step: '03',
      period: '1946 - 1954',
      stageTitle: 'Đại Tướng 37 Tuổi & Chiến Thắng Điện Biên Phủ',
      ageSpan: '35 - 43 tuổi',
      mainImage: getCuratedImage('BiographyDossierView__005__GIAP_PORTRAIT_OFFICIAL'),
      secondaryImage: getCuratedImage('BiographyDossierView__006__DIEN_BIEN_FLAG_WIN'),
      imageLabel: 'Chân dung Đại tướng quân phục khuy cao, huân chương trên ngực áo',
      context: 'Năm 1948, thụ phong quân hàm Đại tướng đầu tiên và trẻ nhất trong lịch sử khi mới 37 tuổi. Là Tổng Tư lệnh kiêm Chỉ huy trưởng Chiến dịch Điện Biên Phủ (1954). Đưa ra quyết định chuyển phương châm từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc", đập tan tập đoàn cứ điểm của Pháp.',
      highlightQuote: 'Đây là quyết định khó khăn nhất trong cuộc đời chỉ huy của tôi.',
      tags: ['Đại tướng 1948', 'Điện Biên Phủ', 'Mường Phăng', 'Đánh chắc tiến chắc'],
    },
    {
      step: '04',
      period: '1955 - 1975',
      stageTitle: 'Tổng Tư Lệnh Kháng Chiến Chống Mỹ & Đại Thắng Mùa Xuân',
      ageSpan: '44 - 64 tuổi',
      mainImage: getCuratedImage('BiographyDossierView__007__GIAP_COMMEMORATIVE_PLATE'),
      secondaryImage: getCuratedImage('BiographyDossierView__008__D67_BUNKER_COMMAND'),
      imageLabel: 'Chân dung Người Anh Cả mũ kê-pi chỉ huy oai nghiêm',
      context: 'Chỉ đạo quân đội qua các chiến dịch lớn: Đường 9 - Khe Sanh, Đường 9 - Nam Lào, Điện Biên Phủ trên không (1972). Ngày 7/4/1975, từ Tổng hành dinh Hầm D67 (Hoàng thành Hà Nội), Đại tướng phát đi bức điện mật lịch sử: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa", mở đường cho đại thắng 30/4/1975.',
      highlightQuote: 'Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút xông lên phía trước.',
      tags: ['Hầm D67', 'Điện Biên Phủ trên không', 'Điện mật thần tốc', 'Đại thắng mùa Xuân 1975'],
    },
    {
      step: '05',
      period: '1976 - 2013',
      stageTitle: 'Vị Tướng Của Nhân Dân & Tượng Đài Bất Tử Trong Lòng Dân',
      ageSpan: '65 - 103 tuổi',
      mainImage: getCuratedImage('BiographyDossierView__009__GIAP_SENIOR_SPEAKING'),
      secondaryImage: getCuratedImage('BiographyDossierView__010__GIAP_WARM_SMILE_UNIFORM'),
      imageLabel: 'Đại tướng lớn tuổi đĩnh đạc phát biểu và nụ cười hiền hậu vì nhân dân',
      context: 'Đảm nhiệm cương vị Phó Chủ tịch Hội đồng Bộ trưởng, phụ trách phát triển khoa học - kỹ thuật, giáo dục và kinh tế biển. Luôn quan tâm đến cựu chiến binh, đồng bào nghèo và thế hệ trẻ. Đại tướng từ trần ngày 04/10/2013 (thọ 103 tuổi) trong niềm tiếc thương vô hạn của hàng triệu người dân cả nước.',
      highlightQuote: 'Tôi sống ngày nào, cũng là vì đất nước ngày đó.',
      tags: ['Khoa học giáo dục', 'Vị tướng của Hòa bình', 'Vũng Chùa - Đảo Yến', 'Đại thọ 103 tuổi'],
    },
  ];

  // Bản sao chép thông tin hồ sơ
  const handleShare = () => {
    navigator.clipboard.writeText(
      `HỒ SƠ TIỂU SỬ ĐẠI TƯỚNG VÕ NGUYÊN GIÁP (1911 - 2013)\nNgười Anh Cả của Quân đội Nhân dân Việt Nam\nKhám phá tại: ${window.location.href}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in font-sans">
      {/* BANNER ĐẶC BIỆT CỔ ĐIỂN: TIÊU ĐỀ HỒ SƠ QUÂN SỰ LƯU TRỮ */}
      <div 
        className={`relative overflow-hidden rounded-3xl border-2 transition-all p-6 sm:p-8 md:p-10 shadow-2xl ${
          isDark 
            ? 'bg-[#1a1815] border-[#b8860b]/40 text-[#f5ebd7]' 
            : 'bg-[#faf5e8] border-[#c29b38]/50 text-[#2b2118]'
        }`}
        style={{
          backgroundImage: `radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
                            radial-gradient(circle at 90% 80%, rgba(196, 30, 36, 0.08) 0%, transparent 40%)`
        }}
      >
        {/* Họa tiết tem mác, ghim bấm cổ xưa & Con dấu đỏ mật */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
          {/* Ghim tài liệu cổ điển */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#8c6d31]/20 border border-[#b8860b]/40 text-xs font-mono tracking-wider">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span>MÃ LƯU TRỮ: HS-QĐND-1911-2013</span>
          </div>

          {/* Con dấu tròn mực đỏ xoay nghiêng phong cách thời xưa */}
          <div className="relative transform -rotate-12 border-2 border-red-600/80 rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center p-1 bg-red-500/10 text-red-600 dark:text-red-400 select-none shadow-sm pointer-events-none">
            <span className="text-[7px] sm:text-[8px] font-extrabold tracking-widest uppercase text-center leading-tight">
              BỘ TỔNG TƯ LỆNH
            </span>
            <div className="w-10 sm:w-14 h-px bg-red-600/60 my-0.5" />
            <span className="text-[9px] sm:text-[11px] font-black tracking-wider text-center">
              TUYỆT MẬT
            </span>
            <span className="text-[6px] sm:text-[7px] font-bold tracking-tight text-center">
              BẢO VẬT QUỐC GIA
            </span>
          </div>
        </div>

        {/* Tiêu ngữ Quốc gia thời xưa */}
        <div className="text-center pb-6 border-b border-[#c29b38]/30 max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-red-700 dark:text-red-400">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </p>
          <p className="text-[11px] sm:text-xs font-semibold tracking-wider italic text-gray-700 dark:text-gray-300">
            Độc lập - Tự do - Hạnh phúc
          </p>
          <div className="w-32 h-0.5 bg-[#b8860b]/50 mx-auto mt-2 mb-3" />
          <p className="text-xs font-mono font-bold tracking-widest text-[#8c6d31] dark:text-[#d4af37]">
            BỘ QUỐC PHÒNG – BAN LỊCH SỬ QUÂN SỰ TRUNG ƯƠNG
          </p>
        </div>

        {/* Tiêu đề chính Hồ sơ Tiểu sử */}
        <div className="mt-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#B91C1C]/10 border border-[#B91C1C]/30 text-[#B91C1C] dark:text-[#D4A017] text-xs sm:text-sm font-bold uppercase tracking-wider">
            <Scroll className="w-4 h-4" />
            Hồ sơ Nhân vật Lịch sử Đặc biệt
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-normal text-[#B91C1C] dark:text-[#D4A017] uppercase font-serif drop-shadow-xs leading-snug">
            HỒ SƠ TIỂU SỬ ĐẠI TƯỚNG VÕ NGUYÊN GIÁP
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-medium max-w-3xl mx-auto text-stone-800 dark:text-[#CBD5E1] italic">
            "Người Anh Cả của Quân đội Nhân dân Việt Nam – Vị Thống soái quân sự kiệt xuất thế kỷ XX – Người học trò xuất sắc của Chủ tịch Hồ Chí Minh"
          </p>
        </div>

        {/* Thanh công cụ tương tác: Chuyển mục, In, Chia sẻ */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#D4A017]/30">
          {/* Tabs con trong hồ sơ */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'Toàn cảnh Hồ sơ', icon: Layers },
              { id: 'chronology', label: 'Dòng ảnh từ Trẻ tới Già ➔', icon: ArrowRight },
              { id: 'profile', label: 'Lý lịch & Chiến công', icon: Shield },
              { id: 'signature', label: 'Bút tích & Chữ ký', icon: Stamp },
              { id: 'tributes', label: 'Thế giới Tôn vinh', icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeDossierSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playPaperTurn();
                    setActiveDossierSection(tab.id as any);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#B91C1C] text-white shadow-md ring-2 ring-[#D4A017]'
                      : isDark
                      ? 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-xs'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4A017]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Nút hành động */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#D4A017]/40 bg-amber-500/10 hover:bg-amber-500/20 text-[#B45309] dark:text-[#D4A017] transition-all cursor-pointer"
              title="In bản hồ sơ cổ điển"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Hồ sơ</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#B91C1C]/10 hover:bg-[#B91C1C]/20 text-[#B91C1C] dark:text-red-300 border border-[#B91C1C]/30 transition-all cursor-pointer"
              title="Sao chép trích dẫn hồ sơ"
            >
              {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MỤC TRỌNG TÂM 1: HÌNH ẢNH ĐÁNH DẤU MŨI TÊN TỪ TRẺ TỚI GIÀ (THEO YÊU CẦU NGƯỜI DÙNG) */}
      {(activeDossierSection === 'all' || activeDossierSection === 'chronology') && (
        <section className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
                <ArrowRight className="w-5 h-5 text-red-600 dark:text-amber-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-normal font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase">
                  DÒNG CHẢY HÌNH ẢNH TỪ TRẺ TỚI GIÀ (1911 – 2013)
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Chuỗi tư liệu lịch sử nối tiếp bằng mũi tên chỉ hướng qua từng giai đoạn then chốt của cuộc đời Đại tướng
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-600/10 text-red-700 dark:text-red-400 border border-red-600/30">
              5 Giai đoạn lịch sử
            </span>
          </div>

          {/* DÃY MŨI TÊN LIÊN TIẾP CHUỖI 5 GIAI ĐOẠN */}
          <div className="space-y-8">
            {chronologicalStages.map((stage, idx) => {
              const isLast = idx === chronologicalStages.length - 1;
              return (
                <div key={stage.step} className="relative">
                  {/* Thẻ giai đoạn phong cách cổ xưa */}
                  <div 
                    className={`rounded-3xl transition-all p-5 sm:p-7 shadow-lg relative overflow-hidden ${
                      isDark
                        ? 'museum-card-dark text-[#F8FAFC]'
                        : 'museum-card-light text-[#0F172A]'
                    }`}
                  >
                    {/* Tem đánh dấu bước thời gian */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D4A017]/30">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#B91C1C] text-white flex items-center justify-center font-mono font-black text-sm shadow-md border border-yellow-300/40">
                          {stage.step}
                        </span>
                        <div>
                          <span className="text-xs font-mono font-bold tracking-wider text-[#B45309] dark:text-[#D4A017] uppercase">
                            GIAI ĐOẠN {stage.step} • {stage.ageSpan}
                          </span>
                          <h3 className="text-lg sm:text-xl font-bold font-serif text-[#B91C1C] dark:text-[#D4A017]">
                            {stage.stageTitle}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#D4A017]/15 border border-[#D4A017]/40 text-xs font-bold font-mono text-[#B45309] dark:text-yellow-300">
                        <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                        <span>{stage.period}</span>
                      </div>
                    </div>

                    {/* Nội dung ảnh và diễn giải */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Cụm ảnh lịch sử phong cách tráng phim cổ điển */}
                      <div className="lg:col-span-5 grid grid-cols-2 gap-3">
                        {/* Ảnh chính */}
                        <div 
                          onClick={() => {
                            playPaperTurn();
                            setSelectedPhotoModal({
                              url: stage.mainImage,
                              title: stage.stageTitle,
                              period: stage.period,
                              caption: stage.imageLabel
                            });
                          }}
                          className="group relative rounded-xl overflow-hidden border-2 border-[#b8860b]/40 bg-black/30 shadow-md cursor-pointer aspect-4/5"
                        >
                          <img 
                            src={stage.mainImage} 
                            alt={stage.imageLabel} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter sepia-20"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCuratedImage('BiographyDossierView__011__HERO_FLAG_GENERAL');
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[11px] font-bold text-white line-clamp-2 drop-shadow-sm flex items-center gap-1">
                              <Eye className="w-3 h-3 text-amber-400 flex-shrink-0" />
                              {stage.imageLabel}
                            </span>
                          </div>
                          {/* Góc gài ảnh cổ điển */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300" />
                          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300" />
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300" />
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300" />
                        </div>

                        {/* Ảnh phụ tư liệu liên kết */}
                        <div 
                          onClick={() => {
                            playPaperTurn();
                            setSelectedPhotoModal({
                              url: stage.secondaryImage,
                              title: `${stage.stageTitle} (Tư liệu mở rộng)`,
                              period: stage.period,
                              caption: `Tư liệu lịch sử tiêu biểu giai đoạn ${stage.period}`
                            });
                          }}
                          className="group relative rounded-xl overflow-hidden border-2 border-[#b8860b]/40 bg-black/30 shadow-md cursor-pointer aspect-4/5"
                        >
                          <img 
                            src={stage.secondaryImage} 
                            alt={stage.stageTitle} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter sepia-20"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = getCuratedImage('BiographyDossierView__012__HERO_FLAG_GENERAL');
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                            <span className="text-[11px] font-bold text-amber-200 line-clamp-2 drop-shadow-sm">
                              Tư liệu hiện vật & bối cảnh
                            </span>
                          </div>
                          {/* Góc gài ảnh cổ điển */}
                          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-amber-300" />
                          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-amber-300" />
                          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-amber-300" />
                          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-amber-300" />
                        </div>
                      </div>

                      {/* Diễn giải lịch sử & trích dẫn */}
                      <div className="lg:col-span-7 space-y-3.5">
                        <p className="text-xs sm:text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-medium">
                          {stage.context}
                        </p>

                        {/* Trích dẫn lịch sử đóng khung giấy dó */}
                        <blockquote className="p-3 sm:p-4 rounded-xl border-l-4 border-[#8b1d1d] bg-[#8c6d31]/10 text-xs sm:text-sm italic font-serif text-gray-900 dark:text-gray-100 shadow-xs">
                          "{stage.highlightQuote}"
                        </blockquote>

                        {/* Thẻ gắn liền */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {stage.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-300 border border-black/10 dark:border-white/10"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MŨI TÊN KẾT NỐI SANG GIAI ĐOẠN TIẾP THEO (YÊU CẦU ĐÁNH DẤU MŨI TÊN TỪ TRẺ TỚI GIÀ) */}
                  {!isLast && (
                    <div className="py-4 flex flex-col items-center justify-center">
                      <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#8b1d1d]/15 border-2 border-[#8b1d1d]/50 text-[#8b1d1d] dark:text-[#f39c12] font-mono font-bold text-xs shadow-md">
                        <span className="tracking-widest uppercase">BƯỚC TIẾP THEO THEO DÒNG THỜI GIAN</span>
                        <div className="flex items-center">
                          <span className="w-6 h-0.5 bg-[#8b1d1d] dark:bg-[#f39c12]" />
                          <ArrowRight className="w-5 h-5 animate-bounce-x" />
                        </div>
                      </div>
                      <div className="w-0.5 h-6 bg-gradient-to-b from-[#8b1d1d] to-transparent mt-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MỤC TRỌNG TÂM 2: CHỮ KÝ VÀ BÚT TÍCH CHÍNH THỨC CỦA ĐẠI TƯỚNG (THEO YÊU CẦU NGƯỜI DÙNG) */}
      {(activeDossierSection === 'all' || activeDossierSection === 'signature') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-700 dark:text-red-400 font-bold">
              <Stamp className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-normal font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase">
                BÚT TÍCH & CHỮ KÝ CHÍNH THỨC CỦA ĐẠI TƯỚNG VÕ NGUYÊN GIÁP
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Chữ ký nguyên bản được trích xuất từ các sắc lệnh lịch sử và mệnh lệnh quân sự tối cao
              </p>
            </div>
          </div>

          <div 
            className={`rounded-3xl border-2 transition-all p-6 sm:p-8 md:p-10 shadow-xl relative overflow-hidden ${
              isDark 
                ? 'bg-[#1c1a17] border-[#b8860b]/40 text-[#f5ebd7]' 
                : 'bg-[#faf4e6] border-[#cfb87c] text-[#2b2118]'
            }`}
          >
            {/* Tùy chọn đổi màu mực chữ ký */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#c29b38]/30">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-mono uppercase text-gray-700 dark:text-gray-300">
                  Chọn màu mực bút ký:
                </span>
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'black', label: 'Mực đen bút máy', colorClass: 'bg-black text-white' },
                    { id: 'red', label: 'Mực son phê duyệt', colorClass: 'bg-red-700 text-white' },
                    { id: 'blue', label: 'Mực xanh than', colorClass: 'bg-blue-800 text-white' },
                    { id: 'gold', label: 'Mực nhũ vàng', colorClass: 'bg-amber-600 text-white' },
                  ].map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => {
                        playHistoricalStamp();
                        setSignatureInkColor(ink.id as any);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        signatureInkColor === ink.id
                          ? 'ring-2 ring-amber-400 scale-105 shadow-sm'
                          : 'opacity-70 hover:opacity-100'
                      } ${ink.colorClass}`}
                    >
                      {ink.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Đã xác thực nguyên bản lưu trữ</span>
              </div>
            </div>

            {/* KHUNG HIỂN THỊ CHỮ KÝ CHÍNH THỨC CỦA ĐẠI TƯỚNG (TỪ ẢNH UPLOAD 1) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Vùng hiển thị chữ ký lớn trên nền giấy dó cổ điển */}
              <div className="md:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl border-2 border-dashed border-[#b8860b]/50 bg-[#fffdf7] dark:bg-[#121110] shadow-inner relative">
                {/* Con dấu chìm phía sau */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <div className="w-48 h-48 rounded-full border-8 border-red-600 flex items-center justify-center font-serif font-black text-3xl text-red-600">
                    QUÂN ĐỘI NHÂN DÂN
                  </div>
                </div>

                {/* Chữ ký dạng Vector sắc nét nguyên bản */}
                <div 
                  className={`w-full max-w-md h-40 sm:h-52 flex items-center justify-center transition-colors duration-300 ${
                    signatureInkColor === 'black'
                      ? 'text-[#111111]'
                      : signatureInkColor === 'red'
                      ? 'text-[#b91c1c]'
                      : signatureInkColor === 'blue'
                      ? 'text-[#1e3a8a]'
                      : 'text-[#d97706]'
                  }`}
                >
                  <img 
                    src={getCuratedImage('BiographyDossierView__013__GIAP_SIGNATURE_AUTHENTIC')} 
                    alt="Chữ ký Đại tướng Võ Nguyên Giáp"
                    className="max-h-full max-w-full object-contain filter drop-shadow-md select-none transition-transform hover:scale-105 duration-300"
                    style={{
                      filter: signatureInkColor === 'red' 
                        ? 'invert(19%) sepia(85%) saturate(3048%) hue-rotate(349deg) brightness(85%) contrast(98%)'
                        : signatureInkColor === 'blue'
                        ? 'invert(19%) sepia(89%) saturate(2250%) hue-rotate(218deg) brightness(92%) contrast(101%)'
                        : signatureInkColor === 'gold'
                        ? 'invert(65%) sepia(80%) saturate(1500%) hue-rotate(5deg) brightness(95%) contrast(95%)'
                        : undefined
                    }}
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-base sm:text-lg font-serif font-black text-red-700 dark:text-amber-400">
                    Võ Nguyên Giáp
                  </p>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400 tracking-wider">
                    ĐẠI TƯỚNG TỔNG TƯ LỆNH – BỘ TRƯỞNG BỘ QUỐC PHÒNG
                  </p>
                </div>
              </div>

              {/* Bối cảnh và ý nghĩa lịch sử của chữ ký */}
              <div className="md:col-span-5 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold font-serif text-[#8b1d1d] dark:text-[#f39c12]">
                    Đặc điểm & Phong cách Bút tích
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    Nét chữ khoáng đạt, dứt khoát nhưng vô cùng uyển chuyển. Khởi đầu bằng chữ cái <strong>"V"</strong> vút cao vững chãi, các nét nối liền mạch thể hiện tư duy chiến lược thông suốt, kiên định và quyết đoán của vị Tổng Tư lệnh quân đội.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/30 space-y-2 text-xs">
                  <p className="font-bold text-[#8b1d1d] dark:text-amber-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4" />
                    Các văn bản lịch sử mang bút tích Đại tướng:
                  </p>
                  <ul className="space-y-1.5 text-gray-700 dark:text-gray-300 pl-4 list-disc">
                    <li><strong>Sắc lệnh số 21 (1945):</strong> Kiến tạo bộ máy hành chính nhà nước Việt Nam mới.</li>
                    <li><strong>Mệnh lệnh tác chiến Điện Biên Phủ (1954):</strong> Quyết định hoãn giờ nổ súng để chuyển phương châm "đánh chắc tiến chắc".</li>
                    <li><strong>Bức điện mật ngày 7/4/1975:</strong> <em>"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa..."</em> gửi các cánh quân giải phóng miền Nam.</li>
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (onOpenArchiveDetail) {
                        onOpenArchiveDetail('arc-06');
                      } else if (onNavigateToTab) {
                        onNavigateToTab('archives');
                      }
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#8b1d1d] hover:bg-red-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-amber-300" />
                    <span>Xem Văn bản Bút tích gốc trong Kho Tư liệu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MỤC TRỌNG TÂM 3: TOÀN BỘ THÔNG TIN TIỂU SỬ ĐẦY ĐỦ (HIỆN HẾT THÔNG TIN RA) */}
      {(activeDossierSection === 'all' || activeDossierSection === 'profile') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-400 font-bold">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-normal font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase">
                BẢNG LÝ LỊCH QUÂN SỰ & THÔNG TIN TOÀN DIỆN
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Toàn bộ dữ liệu hồ sơ cá nhân, học vấn, chức vụ, chiến công và huân huy chương
              </p>
            </div>
          </div>

          <div 
            className={`rounded-3xl border-2 transition-all p-6 sm:p-8 md:p-10 shadow-xl ${
              isDark 
                ? 'bg-[#1b1916] border-[#b8860b]/40 text-[#f5ebd7]' 
                : 'bg-[#faf5e9] border-[#cfb87c] text-[#2b2118]'
            }`}
          >
            {/* Cấu trúc Bảng Hồ Sơ Quân Sự Thời Xưa */}
            <div className="space-y-6">
              {/* PHẦN 1: THÔNG TIN NHÂN THÂN & CỘI NGUỒN */}
              <div className="border border-[#b8860b]/40 rounded-2xl p-5 bg-black/5 dark:bg-white/5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase border-b border-[#b8860b]/30 pb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  I. Thông tin Nhân thân & Xuất thân
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Họ và tên khai sinh:</span>
                    <strong className="text-base font-serif text-[#8b1d1d] dark:text-amber-400">VÕ NGUYÊN GIÁP</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Bí danh hoạt động:</span>
                    <strong className="font-semibold">Anh Văn, Dương Hoài Nam</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Tôn vinh của Quân đội & Nhân dân:</span>
                    <strong className="font-semibold text-red-700 dark:text-red-400">Người Anh Cả của Quân đội Nhân dân Việt Nam</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Ngày sinh:</span>
                    <strong className="font-semibold">25 tháng 8 năm 1911 (Tân Hợi)</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Quê quán:</span>
                    <strong className="font-semibold">Làng An Xá, xã Lộc Thủy, huyện Lệ Thủy, tỉnh Quảng Bình</strong>
                  </div>

                  <div className="p-3 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block">Ngày từ trần & Nơi an nghỉ:</span>
                    <strong className="font-semibold">04/10/2013 (Hưởng thọ 103 tuổi) • Vũng Chùa - Đảo Yến (Quảng Bình)</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">Gia đình & Thân sinh:</span>
                    <ul className="space-y-1 text-gray-800 dark:text-gray-200">
                      <li>• Thân phụ: Cụ <strong>Võ Quang Nghiêm</strong> (nhà nho đức độ, liệt sĩ cách mạng)</li>
                      <li>• Thân mẫu: Cụ bà <strong>Nguyễn Thị Kiên</strong> (người mẹ tảo tần, hiền thục)</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                    <span className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase block mb-1">Người bạn đời:</span>
                    <ul className="space-y-1 text-gray-800 dark:text-gray-200">
                      <li>• Liệt sĩ <strong>Nguyễn Thị Quang Thái</strong> (kết hôn 1935, hy sinh trong tù Hỏa Lò năm 1944)</li>
                      <li>• PGS. <strong>Đặng Bích Hà</strong> (kết hôn 1946, con gái Giáo sư Đặng Thai Mai)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* PHẦN 2: HỌC VẤN & BƯỚC NGOẶT CHÍNH TRỊ */}
              <div className="border border-[#b8860b]/40 rounded-2xl p-5 bg-black/5 dark:bg-white/5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase border-b border-[#b8860b]/30 pb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  II. Học Vấn & Nền Tảng Trí Tuệ
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20 space-y-1">
                    <strong className="text-amber-700 dark:text-amber-400 block font-serif">Trường Quốc học Huế</strong>
                    <p className="text-gray-700 dark:text-gray-300">
                      Sớm tham gia phong trào bãi khóa của học sinh yêu nước năm 1927, bị đuổi học và bắt đầu con đường hoạt động cách mạng kiên trung.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20 space-y-1">
                    <strong className="text-amber-700 dark:text-amber-400 block font-serif">Cử nhân Luật Khoa (1937)</strong>
                    <p className="text-gray-700 dark:text-gray-300">
                      Tốt nghiệp Cử nhân Luật tại Đại học Luật Đông Dương và có bằng Tú tài toàn phần Triết học, tinh thông tiếng Pháp và luật học quốc tế.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#8c6d31]/10 border border-[#b8860b]/20 space-y-1">
                    <strong className="text-amber-700 dark:text-amber-400 block font-serif">Thầy giáo Trường Thăng Long</strong>
                    <p className="text-gray-700 dark:text-gray-300">
                      Giảng dạy lịch sử thế giới và lịch sử chống ngoại xâm Việt Nam, khơi dậy tinh thần tự tôn dân tộc cho thanh niên Hà Nội thời kỳ 1936-1939.
                    </p>
                  </div>
                </div>
              </div>

              {/* PHẦN 3: BẢNG CHỨC VỤ LỊCH SỬ TRỌNG YẾU TỪNG ĐẢM NHIỆM */}
              <div className="border border-[#b8860b]/40 rounded-2xl p-5 bg-black/5 dark:bg-white/5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase border-b border-[#b8860b]/30 pb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  III. Các Cương Vị Quân Sự & Lãnh Đạo Trọng Yếu
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead>
                      <tr className="border-b-2 border-[#b8860b]/40 bg-[#8c6d31]/20 font-bold font-mono text-[#8b1d1d] dark:text-amber-300">
                        <th className="py-2.5 px-3">Thời gian</th>
                        <th className="py-2.5 px-3">Cương vị & Chức trách</th>
                        <th className="py-2.5 px-3">Cơ quan / Tổ chức</th>
                        <th className="py-2.5 px-3">Dấu ấn then chốt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#b8860b]/20 text-gray-800 dark:text-gray-200">
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1944</td>
                        <td className="py-2 px-3 font-semibold">Chỉ huy trưởng</td>
                        <td className="py-2 px-3">Đội Việt Nam Tuyên truyền Giải phóng quân</td>
                        <td className="py-2 px-3">Chỉ huy 34 chiến sĩ đầu tiên, tiền thân QĐND Việt Nam</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1945</td>
                        <td className="py-2 px-3 font-semibold">Bộ trưởng Bộ Nội vụ</td>
                        <td className="py-2 px-3">Chính phủ Cách mạng Lâm thời</td>
                        <td className="py-2 px-3">Ký nhiều sắc lệnh nền tảng xây dựng chính quyền non trẻ</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1946 – 1975</td>
                        <td className="py-2 px-3 font-semibold text-red-700 dark:text-red-400">Tổng Tư lệnh Quân đội</td>
                        <td className="py-2 px-3">Quân đội Nhân dân Việt Nam</td>
                        <td className="py-2 px-3 font-bold">29 năm liên tục chỉ huy toàn quân đánh thắng 2 đế quốc lớn</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1946 – 1980</td>
                        <td className="py-2 px-3 font-semibold">Bộ trưởng Bộ Quốc phòng</td>
                        <td className="py-2 px-3">Chính phủ Việt Nam</td>
                        <td className="py-2 px-3">Gần 35 năm lãnh đạo xây dựng lực lượng quốc phòng toàn dân</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1948</td>
                        <td className="py-2 px-3 font-semibold text-red-700 dark:text-red-400">Đại tướng đầu tiên</td>
                        <td className="py-2 px-3">Sắc lệnh số 110/SL do Chủ tịch Hồ Chí Minh ký</td>
                        <td className="py-2 px-3">Thụ phong quân hàm Đại tướng khi mới 37 tuổi</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-3 font-mono font-bold text-amber-700 dark:text-amber-400">1955 – 1991</td>
                        <td className="py-2 px-3 font-semibold">Phó Thủ tướng / Phó Chủ tịch HĐBT</td>
                        <td className="py-2 px-3">Chính phủ nước CHXHCN Việt Nam</td>
                        <td className="py-2 px-3">Phụ trách khoa học công nghệ, giáo dục đào tạo, kinh tế biển</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PHẦN 4: HUÂN HUY CHƯƠNG & VINH DANH CAO QUÝ */}
              <div className="border border-[#b8860b]/40 rounded-2xl p-5 bg-black/5 dark:bg-white/5 space-y-4">
                <h3 className="text-sm sm:text-base font-bold font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase border-b border-[#b8860b]/30 pb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  IV. Huân Huy Chương & Phần Thưởng Cao Quý
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong className="block text-amber-800 dark:text-amber-300">Huân chương Sao Vàng</strong>
                      <span className="text-[11px] text-gray-500">Phần thưởng cao quý nhất</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong className="block text-amber-800 dark:text-amber-300">Huân chương Hồ Chí Minh</strong>
                      <span className="text-[11px] text-gray-500">2 lần được trao tặng</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong className="block text-amber-800 dark:text-amber-300">Huân chương Quân công</strong>
                      <span className="text-[11px] text-gray-500">Hạng Nhất cao quý</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <div>
                      <strong className="block text-amber-800 dark:text-amber-300">Huy hiệu 70 năm tuổi Đảng</strong>
                      <span className="text-[11px] text-gray-500">Trọn đời cống hiến</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MỤC TRỌNG TÂM 4: THẾ GIỚI TÔN VINH VỊ TƯỚNG HUYỀN THOẠI */}
      {(activeDossierSection === 'all' || activeDossierSection === 'tributes') && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-700 dark:text-red-400 font-bold">
              <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-normal font-serif text-[#8b1d1d] dark:text-[#f39c12] uppercase">
                ĐÁNH GIÁ CỦA CÁC SỬ GIA & TƯỚNG LĨNH THẾ GIỚI
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Nhận định khách quan từ các học giả quân sự quốc tế và cả những đối thủ bên kia chiến tuyến
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              className={`rounded-2xl border-2 p-5 space-y-3 shadow-md ${
                isDark 
                  ? 'bg-[#1e1c18] border-[#b8860b]/30 text-[#f5ebd7]' 
                  : 'bg-[#faf6ed] border-[#d8c48a] text-[#2b2118]'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">Sử gia Peter Macdonald (Anh)</span>
              </div>
              <blockquote className="text-xs sm:text-sm italic leading-relaxed font-serif">
                "Trong suốt 30 năm, Tướng Giáp đã lãnh đạo một đội quân đánh thắng hai cường quốc quân sự hàng đầu thế giới... Ông là vị tướng duy nhất trong lịch sử nhân loại từng làm được điều kỳ diệu này."
              </blockquote>
            </div>

            <div 
              className={`rounded-2xl border-2 p-5 space-y-3 shadow-md ${
                isDark 
                  ? 'bg-[#1e1c18] border-[#b8860b]/30 text-[#f5ebd7]' 
                  : 'bg-[#faf6ed] border-[#d8c48a] text-[#2b2118]'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">GS. Cecil B. Currey (Mỹ)</span>
              </div>
              <blockquote className="text-xs sm:text-sm italic leading-relaxed font-serif">
                "Tài thao lược của Tướng Giáp đã đặt ông vào hàng ngũ những nhà chỉ huy quân sự kiệt xuất nhất mọi thời đại, sánh ngang Alexander Đại đế, Napoleon và Zhukov."
              </blockquote>
            </div>

            <div 
              className={`rounded-2xl border-2 p-5 space-y-3 shadow-md ${
                isDark 
                  ? 'bg-[#1e1c18] border-[#b8860b]/30 text-[#f5ebd7]' 
                  : 'bg-[#faf6ed] border-[#d8c48a] text-[#2b2118]'
              }`}
            >
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase">Đại tướng Marcel Bigeard (Pháp)</span>
              </div>
              <blockquote className="text-xs sm:text-sm italic leading-relaxed font-serif">
                "Tướng Giáp là một đối thủ phi thường, một thiên tài quân sự. Ông đã dạy cho chúng tôi những bài học lịch sử sâu sắc nhất."
              </blockquote>
            </div>
          </div>
        </section>
      )}

      {/* MODAL XEM ẢNH TƯ LIỆU PHÓNG TO VỚI KHUNG KÍNH HIỂN VI */}
      {selectedPhotoModal && (
        <div 
          onClick={() => setSelectedPhotoModal(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className={`max-w-2xl w-full rounded-3xl border-2 overflow-hidden shadow-2xl p-6 space-y-4 ${
              isDark ? 'bg-[#1c1a17] border-[#b8860b] text-white' : 'bg-[#faf6ec] border-[#b8860b] text-[#1c1a17]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#b8860b]/40 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-amber-500 uppercase">{selectedPhotoModal.period}</span>
                <h3 className="text-lg font-bold font-serif">{selectedPhotoModal.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedPhotoModal(null)}
                className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#b8860b]/40 max-h-[60vh] flex items-center justify-center bg-black/40">
              <img 
                src={selectedPhotoModal.url} 
                alt={selectedPhotoModal.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 italic font-medium text-center">
              "{selectedPhotoModal.caption}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
