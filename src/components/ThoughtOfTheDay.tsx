import React, { useState, useEffect, useMemo } from 'react';
import { 
  Quote, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  Calendar, 
  Sparkles,
  Scroll,
  Info
} from 'lucide-react';
import { NavTab } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { playCabinetClick, playRadarPing } from '../utils/soundEffects';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

export interface DailyThought {
  id: string;
  quoteVi: string;
  quoteEn: string;
  contextVi: string;
  contextEn: string;
  themeVi: string;
  themeEn: string;
  year: string;
  sourceVi: string;
  sourceEn: string;
  targetTab: NavTab;
  tabLabelVi: string;
  tabLabelEn: string;
}

export const GENERAL_GIAP_THOUGHTS: DailyThought[] = [
  {
    id: 'thought-1',
    quoteVi: 'Một người cầm quân tài ba trước hết phải là một người biết quý trọng từng giọt máu của chiến sĩ.',
    quoteEn: 'A capable commander must, first and foremost, cherish every single drop of blood of his soldiers.',
    contextVi: 'Trăn trở của Đại tướng đêm trước giờ nổ súng tại lòng chảo Điện Biên Phủ, dẫn đến quyết định lịch sử chuyển từ "đánh nhanh thắng nhanh" sang "đánh chắc tiến chắc" để bảo toàn sinh mệnh cho hàng vạn bộ đội.',
    contextEn: 'The General\'s profound contemplation on the eve of the Battle of Dien Bien Phu, leading to the fateful decision to shift strategy to "steady attack, steady advance" to preserve the lives of tens of thousands of troops.',
    themeVi: 'Nhân văn quân sự & Trách nhiệm tối thượng',
    themeEn: 'Military Humanism & Supreme Responsibility',
    year: '1954',
    sourceVi: 'Hồi ký "Điện Biên Phủ - Điểm hẹn lịch sử", NXB Quân đội Nhân dân',
    sourceEn: 'Memoir "Dien Bien Phu - The Historic Rendezvous"',
    targetTab: 'decisions',
    tabLabelVi: 'Giải mã quyết định 1954',
    tabLabelEn: 'Explore 1954 Decision'
  },
  {
    id: 'thought-2',
    quoteVi: 'Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút xông lên phía trước...',
    quoteEn: 'Lightning speed, even more lightning speed; audacity, even greater audacity; seize every single hour, every single minute to advance...',
    contextVi: 'Bức điện mật lịch sử ngày 07/4/1975 từ Tổng hành dinh Hầm D67 (Hoàng thành Thăng Long) gửi các cánh quân giải phóng miền Nam, mở đường cho Chiến dịch Hồ Chí Minh toàn thắng.',
    contextEn: 'The historic secret telegraph on April 7, 1975 from Command Bunker D67 to liberation units advancing toward Saigon, culminating in the historic victory on April 30, 1975.',
    themeVi: 'Nghệ thuật nắm bắt thời cơ lịch sử',
    themeEn: 'The Art of Seizing Historical Momentum',
    year: '1975',
    sourceVi: 'Bức điện khẩn số 157/TK, Tổng hành dinh Quân đội Nhân dân Việt Nam',
    sourceEn: 'Urgent Telegraph No. 157/TK, General Headquarters',
    targetTab: 'campaign',
    tabLabelVi: 'Xem Bản đồ Tác chiến 1975',
    tabLabelEn: 'View 1975 Campaign Map'
  },
  {
    id: 'thought-3',
    quoteVi: 'Tôi sống ngày nào, cũng là vì đất nước ngày đó.',
    quoteEn: 'As long as I live, every day is lived for the nation.',
    contextVi: 'Lời tâm sự mộc mạc mà thiêng liêng của Đại tướng với đồng bào và chiến sĩ cả nước trong những năm tháng thanh thản về sau, thể hiện trọn vẹn lý tưởng phụng sự Tổ quốc đến hơi thở cuối cùng.',
    contextEn: 'The General\'s humble yet solemn words to his compatriots in his later years, encapsulating a lifelong dedication to the service of his people and motherland.',
    themeVi: 'Lý tưởng phụng sự & Lòng trung kiên',
    themeEn: 'Ideals of Service & Steadfast Loyalty',
    year: '1998',
    sourceVi: 'Trích phát biểu nhân dịp kỷ niệm 50 năm ngày phong quân hàm Đại tướng',
    sourceEn: 'Address on the 50th Anniversary of General Rank',
    targetTab: 'biography',
    tabLabelVi: 'Xem Hồ sơ Tiểu sử Đại tướng',
    tabLabelEn: 'View General\'s Dossier'
  },
  {
    id: 'thought-4',
    quoteVi: 'Trước khi cầm súng, tôi là một thầy giáo dạy sử. Lịch sử dân tộc đánh giặc giữ nước chính là pho sách giáo khoa quân sự sống động nhất.',
    quoteEn: 'Before taking up arms, I was a history teacher. Our nation\'s history of defending independence is the most vibrant military textbook.',
    contextVi: 'Ký ức về những năm tháng giảng dạy lịch sử tại trường Tư thục Thăng Long (Hà Nội), nơi thầy giáo trẻ Võ Nguyên Giáp đã hun đúc tinh thần độc lập và lòng tự hào dân tộc cho bao thế hệ học sinh.',
    contextEn: 'Reflections on his years teaching history at Thang Long Academy in Hanoi, where young scholar Vo Nguyen Giap nurtured patriotism and national pride among generations of students.',
    themeVi: 'Cội nguồn tri thức & Giáo dục truyền thống',
    themeEn: 'Roots of Knowledge & Heritage Education',
    year: '1938',
    sourceVi: 'Tư liệu lịch sử Trường Tư thục Thăng Long & Viện Lịch sử Quân sự Việt Nam',
    sourceEn: 'Archives of Thang Long Academy & Institute of Military History',
    targetTab: 'biography',
    tabLabelVi: 'Xem thời kỳ Thầy giáo Thăng Long',
    tabLabelEn: 'View Young Scholar Era'
  },
  {
    id: 'thought-5',
    quoteVi: 'Chắc thắng mới đánh, không chắc thắng không đánh.',
    quoteEn: 'Attack only when certain of victory; do not attack if victory is not assured.',
    contextVi: 'Lời căn dặn thiêng liêng của Chủ tịch Hồ Chí Minh giao trọn quyền chỉ huy mặt trận cho Đại tướng, đã trở thành phương châm thép và kim chỉ nam xuyên suốt mọi chiến dịch quân sự.',
    contextEn: 'President Ho Chi Minh\'s sacred counsel granting full frontline command authority, which became the ironclad doctrine across every strategic military operation.',
    themeVi: 'Nguyên tắc tác chiến thép & Bản lĩnh chỉ huy',
    themeEn: 'Iron Operational Principles & Command Fortitude',
    year: '1954',
    sourceVi: 'Chỉ thị của Chủ tịch Hồ Chí Minh giao nhiệm vụ Chỉ huy trưởng Chiến dịch Điện Biên Phủ',
    sourceEn: 'President Ho Chi Minh\'s Directive for Dien Bien Phu Command',
    targetTab: 'decisions',
    tabLabelVi: 'Khám phá Bản lĩnh Điện Biên',
    tabLabelEn: 'Explore Dien Bien Fortitude'
  },
  {
    id: 'thought-6',
    quoteVi: 'Vũ khí tối tân đến mấy cũng do con người điều khiển. Con người có lý tưởng, có niềm tin và tình yêu Tổ quốc thì sẽ tìm ra cách chiến thắng.',
    quoteEn: 'No matter how advanced modern weapons are, they are commanded by humans. People with convictions, faith, and love for their country will always find a path to victory.',
    contextVi: 'Phân tích của Đại tướng về nhân tố quyết định trong chiến tranh nhân dân Việt Nam trước các đối thủ có ưu thế vượt trội về hỏa lực công nghệ.',
    contextEn: 'The General\'s analysis of the decisive factor in Vietnamese people\'s warfare against adversaries with overwhelming technological and firepower superiority.',
    themeVi: 'Sức mạnh con người & Chiến tranh nhân dân',
    themeEn: 'Human Spirit & People\'s Warfare',
    year: '1972',
    sourceVi: 'Bài giảng Tổng kết nghệ thuật quân sự kháng chiến chống Mỹ cứu nước',
    sourceEn: 'Lectures on Military Art Summary of the Resistance War',
    targetTab: 'archives',
    tabLabelVi: 'Tra cứu Kho Tư liệu',
    tabLabelEn: 'Explore Archives'
  },
  {
    id: 'thought-7',
    quoteVi: 'Tôi chỉ là một giọt nước trong biển cả nhân dân. Chiến thắng thuộc về nhân dân và Quân đội anh hùng.',
    quoteEn: 'I am merely a single drop in the vast ocean of the people. Victory belongs to the people and our heroic army.',
    contextVi: 'Đức tính khiêm nhường dung dị của Đại tướng khi các học giả, chính khách và nhà báo quốc tế ca ngợi ông là một trong những danh tướng kiệt xuất nhất của mọi thời đại.',
    contextEn: 'The General\'s profound humility when world scholars, statesmen, and international journalists hailed him among the greatest military strategists in history.',
    themeVi: 'Đức tính khiêm nhường & Tri ân nhân dân',
    themeEn: 'Profound Humility & Gratitude to the People',
    year: '1984',
    sourceVi: 'Trả lời phỏng vấn báo chí quốc tế nhân kỷ niệm 30 năm chiến thắng Điện Biên Phủ',
    sourceEn: 'International Press Interview on 30th Anniversary of Dien Bien Phu',
    targetTab: 'biography',
    tabLabelVi: 'Khám phá Hồ sơ Danh dự',
    tabLabelEn: 'Explore Dossier'
  },
  {
    id: 'thought-8',
    quoteVi: 'Hòa bình và độc lập tự do không tự nhiên mà có, đó là mồ hôi, xương máu và ý chí của muôn triệu đồng bào.',
    quoteEn: 'Peace, independence, and freedom do not come by chance; they are forged with the sweat, blood, and unbroken willpower of millions of citizens.',
    contextVi: 'Thông điệp sâu sắc Đại tướng gửi gắm tới thế hệ trẻ về giá trị thiêng liêng của nền độc lập hòa bình hôm nay, nhắc nhở trách nhiệm gìn giữ và dựng xây non sông.',
    contextEn: 'The General\'s heartfelt message to the youth on the sacred price of peace and sovereignty, urging future generations to safeguard and cultivate the nation.',
    themeVi: 'Giá trị của hòa bình & Lời dặn thế hệ trẻ',
    themeEn: 'The Sacred Price of Peace & Message to Youth',
    year: '2004',
    sourceVi: 'Gặp gỡ đại biểu thanh niên tiêu biểu toàn quốc nhân kỷ niệm 50 năm Điện Biên Phủ',
    sourceEn: 'Address to National Youth Delegates on the 50th Anniversary',
    targetTab: 'my-space',
    tabLabelVi: 'Ghi nhật ký học tập',
    tabLabelEn: 'Record in My Journal'
  },
  {
    id: 'thought-9',
    quoteVi: 'Người làm tướng phải có đủ Dũng, Trí, Nhân, Tín, Liêm, Trung. Nhưng trên hết là tấm lòng vì dân, vì nước.',
    quoteEn: 'A general must embody Courage, Wisdom, Benevolence, Trustworthiness, Integrity, and Loyalty. But above all, an unwavering heart for the people and the nation.',
    contextVi: 'Triết lý cầm quân kết tinh từ tinh hoa văn hóa truyền thống phương Đông và tư tưởng cách mạng Hồ Chí Minh về phẩm chất đạo đức của người chỉ huy quân sự.',
    contextEn: 'Military ethics synthesizing traditional Eastern philosophical tenets and Ho Chi Minh\'s ideology on the moral excellence demanded of military commanders.',
    themeVi: 'Đạo làm tướng & Phẩm chất chỉ huy',
    themeEn: 'Command Ethics & Leadership Virtues',
    year: '1965',
    sourceVi: 'Bài giảng tại Học viện Quân sự Cấp cao (nay là Học viện Quốc phòng)',
    sourceEn: 'Lectures at High Military Academy (National Defense Academy)',
    targetTab: 'decisions',
    tabLabelVi: 'Tìm hiểu 5 Trụ cột Bản lĩnh',
    tabLabelEn: 'Explore 5 Courage Pillars'
  },
  {
    id: 'thought-10',
    quoteVi: 'Mỗi tấc đất thiêng liêng của Tổ quốc nơi biên cương, hải đảo đều thấm đẫm mồ hôi và máu của tiền nhân; bảo vệ Tổ quốc là mệnh lệnh từ trái tim.',
    quoteEn: 'Every sacred inch of our motherland along the borders and maritime islands is soaked with the sweat and blood of our ancestors; defending sovereignty is a command from the heart.',
    contextVi: 'Tầm nhìn chiến lược của Đại tướng khi phụ trách chương trình biển Đông và phát triển khoa học kinh tế biển quốc gia, khẳng định chủ quyền bất khả xâm phạm.',
    contextEn: 'Strategic vision formulated while directing national maritime strategy and marine scientific development, asserting inviolable territorial integrity.',
    themeVi: 'Chủ quyền biển đảo & Biên cương thiêng liêng',
    themeEn: 'Maritime Sovereignty & Sacred Borders',
    year: '1987',
    sourceVi: 'Chỉ đạo tại Hội nghị Khoa học và Kinh tế Biển Quốc gia',
    sourceEn: 'Keynote at National Maritime Science & Economic Conference',
    targetTab: 'timeline',
    tabLabelVi: 'Xem Dấu mốc Biên niên sử',
    tabLabelEn: 'View Chronicle Timeline'
  },
  {
    id: 'thought-11',
    quoteVi: 'Thời cơ là sức mạnh. Trong chiến tranh cũng như trong dựng xây đất nước, bỏ lỡ thời cơ là có tội với lịch sử.',
    quoteEn: 'Momentum is strength. In war as in nation-building, missing the historical moment is a grave failure before history.',
    contextVi: 'Tổng kết của vị Tổng Tư lệnh về nghệ thuật chớp thời cơ trong cuộc Tổng khởi nghĩa Tháng Tám năm 1945 và Chiến dịch Hồ Chí Minh mùa xuân năm 1975.',
    contextEn: 'The Supreme Commander\'s reflection on seizing decisive opportunities during the August Revolution of 1945 and the Spring 1975 Liberation Campaign.',
    themeVi: 'Nghệ thuật chớp thời cơ & Nhãn quan chiến lược',
    themeEn: 'Seizing Momentum & Strategic Vision',
    year: '1975',
    sourceVi: 'Báo cáo tổng kết chiến lược quân sự Bộ Tổng Tư lệnh',
    sourceEn: 'General Headquarters Strategic Review Report',
    targetTab: 'campaign',
    tabLabelVi: 'Xem Diễn biến Chiến dịch',
    tabLabelEn: 'View Campaign Briefing'
  },
  {
    id: 'thought-12',
    quoteVi: 'Thế hệ trẻ phải học tập, làm chủ khoa học kỹ thuật hiện đại, vì một Việt Nam độc lập, tự cường và văn minh.',
    quoteEn: 'The youth must study relentlessly and master modern science and technology, striving for an independent, resilient, and civilized Vietnam.',
    contextVi: 'Tâm huyết của Đại tướng khi đảm nhiệm cương vị Phó Chủ tịch Hội đồng Bộ trưởng phụ trách khoa học, công nghệ và giáo dục trong giai đoạn tái thiết đất nước.',
    contextEn: 'The General\'s passionate dedication while serving as Deputy Chairman of the Council of Ministers in charge of science, technology, and education.',
    themeVi: 'Trọng dụng nhân tài & Làm chủ khoa học',
    themeEn: 'Fostering Talent & Mastering Science',
    year: '1983',
    sourceVi: 'Phát biểu tại Đại hội Thanh niên Tiêu biểu Khối Khoa học và Công nghệ',
    sourceEn: 'Address at Science & Technology Youth Congress',
    targetTab: 'biography',
    tabLabelVi: 'Xem Giai đoạn Đổi mới & Khoa học',
    tabLabelEn: 'View Science & Reforms Era'
  }
];

export const ThoughtOfTheDay: React.FC<{
  isDark: boolean;
  onNavigate?: (tab: NavTab) => void;
  language?: 'vi' | 'en';
}> = ({ isDark, onNavigate, language = 'vi' }) => {
  // Deterministic daily index based on current calendar date
  const dailyIndex = useMemo(() => {
    const today = new Date();
    const dayHash = today.getFullYear() * 372 + (today.getMonth() + 1) * 31 + today.getDate();
    return dayHash % GENERAL_GIAP_THOUGHTS.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(dailyIndex);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('giap_trace_favorite_quotes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const activeThought = GENERAL_GIAP_THOUGHTS[currentIndex] || GENERAL_GIAP_THOUGHTS[0];
  const isBookmarked = bookmarkedIds.includes(activeThought.id);

  // Formatted date string
  const todayFormatted = useMemo(() => {
    const now = new Date();
    if (language === 'vi') {
      return `Hôm nay, ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
    }
    return `Today, ${now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
  }, [language]);

  // Handle cycle through other thoughts
  const handleNextThought = () => {
    playCabinetClick();
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setCurrentIndex((prev) => (prev + 1) % GENERAL_GIAP_THOUGHTS.length);
  };

  const handleResetToDaily = () => {
    playCabinetClick();
    setCurrentIndex(dailyIndex);
  };

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    playRadarPing();
    const newBookmarks = isBookmarked
      ? bookmarkedIds.filter((id) => id !== activeThought.id)
      : [...bookmarkedIds, activeThought.id];
    setBookmarkedIds(newBookmarks);
    try {
      localStorage.setItem('giap_trace_favorite_quotes', JSON.stringify(newBookmarks));
    } catch {
      // Ignore localStorage quotas
    }
  };

  // Copy quote to clipboard
  const handleCopyQuote = async () => {
    playCabinetClick();
    const textToCopy = `"${language === 'vi' ? activeThought.quoteVi : activeThought.quoteEn}"\n\n— Đại tướng Võ Nguyên Giáp (${activeThought.year})\n${language === 'vi' ? activeThought.contextVi : activeThought.contextEn}\n\n[Trích từ Bảo tàng số GIAP TRACE]`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    } catch {
      // Fallback
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2400);
    }
  };

  // Text-to-Speech audio read
  const handleToggleSpeech = () => {
    playCabinetClick();
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = language === 'vi'
      ? `${activeThought.quoteVi}. Lời của Đại tướng Võ Nguyên Giáp năm ${activeThought.year}. ${activeThought.contextVi}`
      : `${activeThought.quoteEn}. Words of General Vo Nguyen Giap, ${activeThought.year}. ${activeThought.contextEn}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when unmounted
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <section 
      id="thought-of-the-day-section"
      aria-label="Thought of the Day - General Vo Nguyen Giap"
      className={`relative overflow-hidden rounded-3xl border-2 transition-all p-5 sm:p-7 md:p-8 shadow-xl ${
        isDark
          ? 'bg-[#181614] border-[#B8860B]/40 text-[#F5EBD7]'
          : 'bg-[#FDF9F0] border-[#CFB87C] text-[#2B2118]'
      }`}
      style={{
        backgroundImage: `radial-gradient(circle at 5% 10%, rgba(212, 175, 55, 0.07) 0%, transparent 45%),
                          radial-gradient(circle at 95% 90%, rgba(196, 30, 36, 0.06) 0%, transparent 50%)`
      }}
    >
      {/* Antique Document Corner Flourishes */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#B8860B]/60 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#B8860B]/60 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#B8860B]/60 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#B8860B]/60 pointer-events-none" />

      {/* Header Bar: Clean unboxed metadata with typographic separators (Frontend-Design Skill Rule) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#C29B38]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-700 dark:text-amber-400">
            <span className="uppercase flex items-center gap-1.5 text-red-700 dark:text-red-400 font-extrabold">
              <Scroll className="w-3.5 h-3.5" />
              {language === 'vi' ? 'Suy ngẫm hôm nay' : 'Thought of the Day'}
            </span>
            <span aria-hidden="true" className="text-gray-400">·</span>
            <span>{todayFormatted}</span>
            {currentIndex !== dailyIndex && (
              <>
                <span aria-hidden="true" className="text-gray-400">·</span>
                <button
                  onClick={handleResetToDaily}
                  className="text-xs text-amber-600 hover:underline cursor-pointer font-medium"
                >
                  ({language === 'vi' ? 'Xem lại câu hôm nay' : 'Back to Today'})
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {language === 'vi' ? activeThought.themeVi : activeThought.themeEn}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">Năm {activeThought.year}</span>
            <span aria-hidden="true">·</span>
            <span>Mã trích dẫn #{activeThought.id.replace('thought-', '0')}</span>
          </div>
        </div>

        {/* Action Controls: Refresh/Shuffle, Bookmark, Audio, Copy */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          {/* Read Aloud Voice Button */}
          {'speechSynthesis' in window && (
            <button
              onClick={handleToggleSpeech}
              className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isSpeaking
                  ? 'bg-red-600 text-white border-red-700 shadow-md animate-pulse'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border-[#B8860B]/30 text-gray-700 dark:text-gray-200'
              }`}
              title={isSpeaking ? (language === 'vi' ? 'Dừng đọc' : 'Stop reading') : (language === 'vi' ? 'Lắng nghe giọng đọc suy ngẫm' : 'Listen to thought')}
              aria-label={isSpeaking ? 'Stop voice reading' : 'Voice reading'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-yellow-300" /> : <Volume2 className="w-4 h-4 text-amber-500" />}
              <span className="hidden md:inline">{isSpeaking ? (language === 'vi' ? 'Đang đọc' : 'Playing') : (language === 'vi' ? 'Nghe đọc' : 'Listen')}</span>
            </button>
          )}

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              isBookmarked
                ? 'bg-amber-500/20 border-amber-500 text-amber-700 dark:text-amber-300 shadow-xs'
                : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 border-[#B8860B]/30 text-gray-700 dark:text-gray-200'
            }`}
            title={isBookmarked ? (language === 'vi' ? 'Đã lưu vào danh sách yêu thích' : 'Saved to favorites') : (language === 'vi' ? 'Lưu vào suy ngẫm tâm đắc' : 'Save to favorites')}
            aria-label="Bookmark thought"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-500" /> : <Bookmark className="w-4 h-4 text-gray-500 dark:text-gray-400" />}
            <span className="hidden md:inline">{isBookmarked ? (language === 'vi' ? 'Đã lưu' : 'Saved') : (language === 'vi' ? 'Lưu lại' : 'Save')}</span>
          </button>

          {/* Copy Quote Button */}
          <button
            onClick={handleCopyQuote}
            className="p-2 rounded-xl border border-[#B8860B]/30 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title={language === 'vi' ? 'Sao chép trích dẫn câu nói' : 'Copy quote'}
            aria-label="Copy quote to clipboard"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-amber-500" />}
            <span className="hidden md:inline">{isCopied ? (language === 'vi' ? 'Đã chép!' : 'Copied!') : (language === 'vi' ? 'Sao chép' : 'Copy')}</span>
          </button>

          {/* Next / Explore Other Quotes Button */}
          <button
            onClick={handleNextThought}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#8B1D1D] to-[#A32222] hover:brightness-110 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
            title={language === 'vi' ? 'Khám phá câu nói khác của Đại tướng' : 'Explore another thought'}
            aria-label="Next thought"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'vi' ? 'Đổi câu khác' : 'Next Thought'}</span>
          </button>
        </div>
      </div>

      {/* Main Quote Showcase */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Large Quote with Typography & Signature */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative pl-7 sm:pl-9">
            {/* Giant Antique Quote Icon */}
            <div className="absolute top-0 left-0 text-[#C29B38]/40 dark:text-[#D4AF37]/30 select-none pointer-events-none">
              <Quote className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>

            {/* The Quote Itself */}
            <blockquote className="text-lg sm:text-xl md:text-2xl font-serif font-bold leading-relaxed text-[#8B1D1D] dark:text-[#F39C12] drop-shadow-2xs">
              "{language === 'vi' ? activeThought.quoteVi : activeThought.quoteEn}"
            </blockquote>
          </div>

          {/* Attribution & Official Signature */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 pl-7 sm:pl-9">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-serif font-extrabold text-sm sm:text-base text-gray-900 dark:text-amber-100 uppercase tracking-wide">
                  Đại tướng Võ Nguyên Giáp
                </span>
                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                  (1911 – 2013)
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                {language === 'vi' ? activeThought.sourceVi : activeThought.sourceEn}
              </p>
            </div>

            {/* General's Vector Signature Seal */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-28 h-10 flex items-center justify-center opacity-85 hover:opacity-100 transition-opacity filter drop-shadow-xs">
                <img 
                  src={getCuratedImage('ThoughtOfTheDay__001__GIAP_SIGNATURE_AUTHENTIC')} 
                  alt="Chữ ký Đại tướng Võ Nguyên Giáp" 
                  className="max-h-full max-w-full object-contain filter invert dark:invert-0 brightness-90"
                  style={{
                    filter: isDark 
                      ? 'invert(19%) sepia(85%) saturate(3048%) hue-rotate(349deg) brightness(120%) contrast(98%)' 
                      : 'brightness(0.15)'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Historical Context & Exploration Link */}
        <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-[#C29B38]/30 pt-4 lg:pt-0 lg:pl-6 space-y-3.5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono uppercase text-amber-700 dark:text-amber-400">
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Bối cảnh lịch sử' : 'Historical Context'}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
              {language === 'vi' ? activeThought.contextVi : activeThought.contextEn}
            </p>
          </div>

          {/* Navigation Action Link */}
          {onNavigate && (
            <div className="pt-1">
              <button
                onClick={() => {
                  playCabinetClick();
                  onNavigate(activeThought.targetTab);
                }}
                className="w-full py-2.5 px-3.5 rounded-xl border border-[#B8860B]/50 bg-[#8C6D31]/10 hover:bg-[#8B1D1D] hover:text-white dark:hover:bg-[#8B1D1D] text-xs font-bold transition-all cursor-pointer flex items-center justify-between group shadow-xs"
              >
                <span className="group-hover:translate-x-0.5 transition-transform">
                  {language === 'vi' ? activeThought.tabLabelVi : activeThought.tabLabelEn}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
