import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Volume2, 
  VolumeX, 
  Flame, 
  ChevronRight, 
  ChevronLeft, 
  ArrowRight, 
  Medal, 
  X, 
  Sparkles, 
  Radio, 
  Quote, 
  Radar, 
  ShieldAlert, 
  GitCommitVertical, 
  Layers,
  Flag,
  Swords,
  Award,
  Play,
  Square,
  Clock,
  CheckCircle2,
  Shield
} from 'lucide-react';
import { NavTab } from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { 
  playTrumpetSalute, 
  playRadarPing, 
  playSuccessChime, 
  toggleMute, 
  getIsMuted, 
  playCabinetClick 
} from '../utils/soundEffects';

import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

interface HomeDashboardProps {
  onNavigate: (tab: NavTab) => void;
  onOpenAi: () => void;
  isDark: boolean;
  onQuickSearch?: (query: string) => void;
  language?: 'vi' | 'en';
  onOpenArchiveDetail?: (archiveId: string) => void;
}

export type NumberCategory = 'all' | 'victory' | 'life' | 'military';

export interface MilestoneProgressStep {
  date: string;
  title: string;
  desc: string;
}

export interface LegendNumberItem {
  id: string;
  number: number;
  numberDisplay: string;
  unit: string;
  timeLabel: string;
  title: string;
  subtitle: string;
  category: 'victory' | 'life' | 'military';
  categoryLabel: string;
  bgImage: string;
  featuredImage: string;
  quote: string;
  shortDesc: string; // under 100 words
  audioAiScript: string;
  progressSteps: MilestoneProgressStep[];
  targetTab: NavTab;
  tabLabel: string;
}

// 8 Câu nói truyền cảm hứng dạng bản tin thời sự
const BULLETIN_QUOTES = [
  {
    id: 'b-1',
    category: 'MỆNH LỆNH THẦN TỐC',
    time: 'Bản tin khẩn 07/04/1975',
    text: 'Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút; xốc tới mặt trận, giải phóng miền Nam; quyết chiến và toàn thắng!',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'campaign' as NavTab,
    tabLabel: 'Mở Sa bàn Mùa Xuân 1975'
  },
  {
    id: 'b-2',
    category: 'BẢN LĨNH TƯỚNG LĨNH',
    time: 'Bản tin lịch sử 1954',
    text: 'Một người cầm quân tài ba trước hết phải là một người biết quý trọng từng giọt máu của chiến sĩ.',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'decisions' as NavTab,
    tabLabel: 'Giải mã Quyết định Điện Biên'
  },
  {
    id: 'b-3',
    category: 'LÝ TƯỞNG VÌ DÂN',
    time: 'Lời thề phụng sự Tổ quốc',
    text: 'Tôi sống ngày nào, cũng là vì đất nước ngày đó. Hạnh phúc lớn nhất của người cầm quân là thấy chiến sĩ mình toàn thắng và bình yên trở về.',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'biography' as NavTab,
    tabLabel: 'Xem Hồ sơ 103 năm'
  },
  {
    id: 'b-4',
    category: 'NGUYÊN TẮC THÉP',
    time: 'Kim chỉ nam tác chiến',
    text: 'Chắc thắng mới đánh, không chắc thắng không đánh! Đôi khi, thay đổi cách đánh cũng chính là thay đổi cách nhìn về chiến thắng.',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'radar' as NavTab,
    tabLabel: 'Mở Radar Tác chiến Mật lệnh'
  },
  {
    id: 'b-5',
    category: 'CHIẾN TRANH NHÂN DÂN',
    time: 'Sức mạnh dân tộc',
    text: 'Vũ khí tối tân đến mấy cũng do con người điều khiển. Con người có lý tưởng, có niềm tin và tình yêu Tổ quốc thì sẽ tìm ra cách chiến thắng.',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'archives' as NavTab,
    tabLabel: 'Xem Kho Tư liệu Quốc gia'
  },
  {
    id: 'b-6',
    category: 'KHIÊM NHƯỜNG DUNG DỊ',
    time: 'Tri ân nhân dân',
    text: 'Tôi chỉ là một giọt nước trong biển cả nhân dân. Chiến thắng vĩ đại này thuộc về toàn thể đồng bào và Quân đội anh hùng.',
    author: 'ĐẠI TƯỚNG VÕ NGUYÊN GIÁP',
    targetTab: 'insights' as NavTab,
    tabLabel: 'Khám phá Triết lý Vì Dân'
  }
];

// Danh sách con số huyền thoại phân theo 3 khu vực: Chiến thắng, Cuộc đời, Quân sự
const LEGENDARY_NUMBERS: LegendNumberItem[] = [
  // ================= 🔥 CON SỐ CHIẾN THẮNG =================
  {
    id: 'num-56',
    number: 56,
    numberDisplay: '56',
    unit: 'Ngày đêm',
    timeLabel: '13/3 – 07/05/1954',
    title: 'Ngày đêm Điện Biên Phủ',
    subtitle: '56 ngày đêm chấn động địa cầu',
    category: 'victory',
    categoryLabel: '🔥 Con số chiến thắng',
    bgImage: getCuratedImage('HomeDashboard__001__DIEN_BIEN_FLAG_WIN'),
    featuredImage: getCuratedImage('HomeDashboard__002__DIEN_BIEN_FLAG_WIN'),
    quote: 'Khoét núi, ngủ hầm, mưa dầm, cơm vắt, máu trộn bùn non, gan không núng, chí không mòn...',
    shortDesc: '56 ngày đêm quân và dân ta kiên cường chiến đấu, đập tan hoàn toàn tập đoàn cứ điểm Điện Biên Phủ - pháo đài bất khả xâm phạm của thực dân Pháp, buộc Pháp phải ký Hiệp định Geneva lập lại hòa bình tại Đông Dương.',
    audioAiScript: '56 ngày đêm Điện Biên Phủ, quân và dân ta dưới sự chỉ huy của Đại tướng Võ Nguyên Giáp đã làm nên chiến thắng lừng lẫy năm châu, chấn động địa cầu.',
    progressSteps: [
      { date: '13/03/1954', title: 'Khai hỏa chiến dịch', desc: 'Đại bác nã vào cụm cứ điểm Him Lam' },
      { date: '15/03/1954', title: 'Đánh Him Lam & Độc Lập', desc: 'Làm chủ phân khu Bắc, mở đường thọc sâu' },
      { date: '30/03/1954', title: 'Siết vòng vây, đồi A1', desc: 'Đào giao thông hào bao vây siết chặt' },
      { date: '07/05/1954', title: 'Cắm cờ chiến thắng', desc: 'Tướng De Castries đầu hàng, toàn thắng' }
    ],
    targetTab: 'radar',
    tabLabel: 'Mở Radar Điện Biên Phủ 1954'
  },
  {
    id: 'num-1954',
    number: 1954,
    numberDisplay: '1954',
    unit: 'Năm',
    timeLabel: '07/05/1954',
    title: 'Chiến thắng Điện Biên Phủ',
    subtitle: 'Mốc son chấn động địa cầu',
    category: 'victory',
    categoryLabel: '🔥 Con số chiến thắng',
    bgImage: getCuratedImage('HomeDashboard__003__GIAP_MUONG_PHANG_HQ'),
    featuredImage: getCuratedImage('HomeDashboard__004__TACTICAL_BRIEFING_MAP'),
    quote: 'Đôi khi, thay đổi cách đánh cũng chính là thay đổi cách nhìn về chiến thắng.',
    shortDesc: 'Năm 1954 ghi dấu mốc son chói lọi trong lịch sử dân tộc. Lần đầu tiên quân đội của một nước thuộc địa nhỏ bé đánh bại hoàn toàn đội quân viễn chinh hiện đại, cổ vũ phong trào giải phóng dân tộc trên toàn thế giới.',
    audioAiScript: 'Năm 1954, mốc son Điện Biên Phủ mãi mãi đi vào lịch sử dân tộc như một Bạch Đằng, Chi Lăng của thế kỷ hai mươi.',
    progressSteps: [
      { date: '26/01/1954', title: 'Quyết định lịch sử', desc: 'Chuyển sang Đánh chắc tiến chắc' },
      { date: '13/03/1954', title: 'Phát lệnh mở màn', desc: 'Bắn loạt đạn pháo mở màn chiến dịch' },
      { date: '07/05/1954', title: 'Bắt sống Bộ chỉ huy', desc: 'Bắt sống Tướng De Castries' },
      { date: '21/07/1954', title: 'Ký Hiệp định Geneva', desc: 'Pháp công nhận độc lập của Việt Nam' }
    ],
    targetTab: 'radar',
    tabLabel: 'Xem Sa bàn Điện Biên Phủ'
  },
  {
    id: 'num-1975',
    number: 1975,
    numberDisplay: '1975',
    unit: 'Năm',
    timeLabel: 'Mùa xuân 1975',
    title: 'Mùa xuân toàn thắng',
    subtitle: 'Đại thắng mùa Xuân non sông liền một dải',
    category: 'victory',
    categoryLabel: '🔥 Con số chiến thắng',
    bgImage: getCuratedImage('HomeDashboard__005__MUSEUM_TANK_HALL'),
    featuredImage: getCuratedImage('HomeDashboard__006__MUSEUM_TANK_HALL'),
    quote: 'Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút... giải phóng miền Nam!',
    shortDesc: 'Cuộc Tổng tiến công và nổi dậy Mùa Xuân 1975 đỉnh cao là Chiến dịch Hồ Chí Minh lịch sử. Đúng 11 giờ 30 ngày 30/4/1975, lá cờ Mặt trận tung bay trên nóc Dinh Độc Lập, kết thúc vẻ vang 30 năm chiến tranh giải phóng dân tộc.',
    audioAiScript: 'Mùa xuân năm 1975, với tốc độ thần tốc táo bạo, non sông Việt Nam đã thu về một mối trọn vẹn.',
    progressSteps: [
      { date: '10/03/1975', title: 'Điểm huyệt Buôn Ma Thuột', desc: 'Đập tan Quân đoàn 2 đối phương' },
      { date: '26/03/1975', title: 'Giải phóng Cố đô Huế', desc: 'Cắt đứt đường tháo lui ra biển' },
      { date: '29/03/1975', title: 'Giải phóng Đà Nẵng', desc: 'Hạ căn cứ liên hợp trong 32 giờ' },
      { date: '30/04/1975', title: 'Dinh Độc Lập toàn thắng', desc: '11h30 lá cờ chiến thắng tung bay' }
    ],
    targetTab: 'campaign',
    tabLabel: 'Xem Sa bàn Mùa Xuân 1975'
  },
  {
    id: 'num-2',
    number: 2,
    numberDisplay: '2',
    unit: 'Cuộc kháng chiến',
    timeLabel: '1945 – 1975',
    title: 'Hai cuộc kháng chiến lớn',
    subtitle: 'Đánh thắng hai đế quốc to',
    category: 'victory',
    categoryLabel: '🔥 Con số chiến thắng',
    bgImage: getCuratedImage('HomeDashboard__007__HERO_FLAG_GENERAL'),
    featuredImage: getCuratedImage('HomeDashboard__008__HERO_FLAG_GENERAL'),
    quote: 'Dân tộc ta là một dân tộc anh hùng, không chịu khuất phục trước bất kỳ thế lực xâm lăng nào.',
    shortDesc: 'Đại tướng Võ Nguyên Giáp là vị tướng duy nhất trong lịch sử đương đại trực tiếp chỉ huy đánh bại hai đế quốc hùng mạnh: thực dân Pháp và đế quốc Mỹ, bảo vệ vững chắc nền độc lập tự do của Tổ quốc.',
    audioAiScript: 'Đại tướng Võ Nguyên Giáp là vị tướng huyền thoại chỉ huy thắng lợi cả hai cuộc kháng chiến vĩ đại chống Pháp và chống Mỹ.',
    progressSteps: [
      { date: '1946 - 1954', title: 'Kháng chiến chống Pháp', desc: '9 năm trường kỳ kháng chiến' },
      { date: '1954', title: 'Điện Biên Phủ', desc: 'Chiến thắng lừng lẫy địa cầu' },
      { date: '1954 - 1975', title: 'Kháng chiến chống Mỹ', desc: 'Đánh cho Mỹ cút, đánh cho Ngụy nhào' },
      { date: '1975', title: 'Đại thắng Mùa Xuân', desc: 'Thống nhất trọn vẹn non sông' }
    ],
    targetTab: 'campaign',
    tabLabel: 'Xem Diễn tập Tác chiến'
  },

  // ================= 🏅 CON SỐ CUỘC ĐỜI =================
  {
    id: 'num-30',
    number: 30,
    numberDisplay: '30',
    unit: 'Tuổi',
    timeLabel: 'Năm 1945',
    title: 'Tuổi làm Bộ trưởng Nội vụ',
    subtitle: 'Bộ trưởng Nội vụ đầu tiên của nước VNDCCH',
    category: 'life',
    categoryLabel: '🏅 Con số cuộc đời',
    bgImage: getCuratedImage('HomeDashboard__009__GIAP_PROVISIONAL_GOV'),
    featuredImage: getCuratedImage('HomeDashboard__010__GIAP_PROVISIONAL_GOV'),
    quote: 'Gánh vác trọng trách quốc gia khi tuổi đời còn trẻ, tôi nguyện dốc hết sức lực vì chính quyền non trẻ của nhân dân.',
    shortDesc: 'Năm 1945, ở độ tuổi ngoài 30, đồng chí Võ Nguyên Giáp được Bác Hồ tin cậy giao giữ chức Bộ trưởng Bộ Nội vụ đầu tiên kiêm Thứ trưởng Bộ Quốc phòng trong Chính phủ lâm thời nước Việt Nam Dân chủ Cộng hòa.',
    audioAiScript: 'Ở tuổi ba mươi, người thanh niên trí thức Võ Nguyên Giáp đã được Bác Hồ tin cẩn giao trọng trách Bộ trưởng Nội vụ đầu tiên của nước Việt Nam mới.',
    progressSteps: [
      { date: '1938', title: 'Thầy giáo Thăng Long', desc: 'Dạy sử và truyền bá lòng yêu nước' },
      { date: 'Tháng 8/1945', title: 'Ủy ban Khởi nghĩa', desc: 'Chỉ huy giải phóng thị xã Thái Nguyên' },
      { date: '28/08/1945', title: 'Bộ trưởng Nội vụ', desc: 'Ký các sắc lệnh đầu tiên xây dựng chính quyền' },
      { date: '02/09/1945', title: 'Tuyên ngôn Độc lập', desc: 'Đứng cạnh Bác Hồ tại Quảng trường Ba Đình' }
    ],
    targetTab: 'biography',
    tabLabel: 'Xem Hồ sơ Tiểu sử Cổ điển'
  },
  {
    id: 'num-37',
    number: 37,
    numberDisplay: '37',
    unit: 'Tuổi',
    timeLabel: '28/05/1948',
    title: 'Tuổi thụ phong Đại tướng',
    subtitle: 'Đại tướng Tổng tư lệnh đầu tiên',
    category: 'life',
    categoryLabel: '🏅 Con số cuộc đời',
    bgImage: getCuratedImage('HomeDashboard__011__GIAP_DECREE_1945'),
    featuredImage: getCuratedImage('HomeDashboard__012__GIAP_DECREE_1945'),
    quote: 'Bác Hồ nói: Đánh thắng đại tá phong đại tá, đánh thắng đại tướng phong đại tướng. Đó là niềm tin của Bác và nhân dân giao phó.',
    shortDesc: 'Năm 1948, Chủ tịch Hồ Chí Minh ký Sắc lệnh 110/SL phong quân hàm Đại tướng cho đồng chí Võ Nguyên Giáp khi ông mới 37 tuổi - vị Tổng tư lệnh đầu tiên và trẻ tuổi nhất trong lịch sử Quân đội nhân dân Việt Nam.',
    audioAiScript: 'Khi mới 37 tuổi, Đại tướng Võ Nguyên Giáp đã nhận trọng trách Tổng tư lệnh lãnh đạo toàn quân kháng chiến bảo vệ Tổ quốc.',
    progressSteps: [
      { date: '20/01/1948', title: 'Sắc lệnh cấp bậc quân hàm', desc: 'Quy định hệ thống cấp bậc Quân đội' },
      { date: '28/05/1948', title: 'Lễ thụ phong tại ATK', desc: 'Bác Hồ trực tiếp trao sắc lệnh phong tướng' },
      { date: '1950', title: 'Chiến dịch Biên giới', desc: 'Chỉ huy thắng lợi mở màn thế phản công' },
      { date: '1954', title: 'Điện Biên Phủ', desc: 'Chỉ huy chiến thắng vang dội toàn cầu' }
    ],
    targetTab: 'archives',
    tabLabel: 'Xem Sắc lệnh Thụ phong 1948'
  },
  {
    id: 'num-80',
    number: 80,
    numberDisplay: '80',
    unit: 'Năm',
    timeLabel: '1930 – 2013',
    title: 'Năm gắn với sự nghiệp cách mạng',
    subtitle: 'Trọn vẹn một thế kỷ kiên trung',
    category: 'life',
    categoryLabel: '🏅 Con số cuộc đời',
    bgImage: getCuratedImage('HomeDashboard__013__PORTRAIT_GENERAL'),
    featuredImage: getCuratedImage('HomeDashboard__014__PORTRAIT_GENERAL'),
    quote: 'Tôi sống ngày nào, cũng là vì đất nước ngày đó.',
    shortDesc: 'Hơn 80 năm liên tục hoạt động cách mạng từ phong trào học sinh yêu nước, Thăng Long đến Tổng tư lệnh quân đội và lãnh đạo Đảng, Nhà nước. Suốt cuộc đời, Đại tướng luôn trọn vẹn đức khiêm nhường và lòng vì Dân.',
    audioAiScript: 'Hơn 80 năm gắn liền với sự nghiệp cách mạng giải phóng dân tộc, Đại tướng Võ Nguyên Giáp luôn là biểu tượng sáng ngời về lòng yêu nước.',
    progressSteps: [
      { date: '1930', title: 'Tham gia Cách mạng', desc: 'Bị địch bắt giam ở nhà lao Thừa Phủ' },
      { date: '1940', title: 'Gặp Bác Hồ ở Côn Minh', desc: 'Bắt đầu bước ngoặt quân sự lịch sử' },
      { date: '1945 - 1975', title: '30 năm cầm quân', desc: 'Tổng tư lệnh quân đội bách chiến bách thắng' },
      { date: '1975 - 2013', title: 'Cống hiến vì dân', desc: 'Cống hiến trọn đời cho khoa học và giáo dục' }
    ],
    targetTab: 'biography',
    tabLabel: 'Xem Biên niên sử 80 năm'
  },
  {
    id: 'num-103',
    number: 103,
    numberDisplay: '103',
    unit: 'Tuổi',
    timeLabel: '1911 – 2013',
    title: 'Tuổi thọ của Đại tướng',
    subtitle: 'Đại tướng Thế kỷ - Vị Tướng của Lòng Dân',
    category: 'life',
    categoryLabel: '🏅 Con số cuộc đời',
    bgImage: getCuratedImage('HomeDashboard__015__GIAP_WARM_SMILE_UNIFORM'),
    featuredImage: getCuratedImage('HomeDashboard__016__GIAP_WARM_SMILE_UNIFORM'),
    quote: 'Hạnh phúc lớn nhất của người cầm quân là thấy chiến sĩ mình toàn thắng và bình yên trở về.',
    shortDesc: 'Đại tướng Võ Nguyên Giáp sống trọn 103 mùa xuân cống hiến cho độc lập dân tộc. Khi Người thanh thản về cõi vĩnh hằng, hàng triệu người dân trên cả nước đã tự nguyện xếp hàng nhiều ngày đêm để nghiêng mình tiễn biệt Vị Tướng Nhân Dân.',
    audioAiScript: 'Trọn vẹn 103 mùa xuân cuộc đời, Đại tướng Võ Nguyên Giáp sống mãi trong tâm khảm của muôn triệu người dân Việt Nam.',
    progressSteps: [
      { date: '25/08/1911', title: 'Sinh ra tại Quảng Bình', desc: 'Làng An Xá, xã Lộc Thủy, huyện Lệ Thủy' },
      { date: '1948', title: 'Thụ phong Đại tướng', desc: 'Vị tướng đầu tiên ở tuổi 37' },
      { date: '1954 & 1975', title: 'Hai chiến công thế kỷ', desc: 'Điện Biên Phủ & Đại thắng Mùa Xuân' },
      { date: '04/10/2013', title: 'Về với Đất Mẹ', desc: 'Yên nghỉ ngàn thu tại Vũng Chùa - Đảo Yến' }
    ],
    targetTab: 'timeline',
    tabLabel: 'Xem Hành trình 103 năm'
  },

  // ================= ⚔️ CON SỐ QUÂN SỰ =================
  {
    id: 'num-34',
    number: 34,
    numberDisplay: '34',
    unit: 'Chiến sĩ',
    timeLabel: '22/12/1944',
    title: 'Chiến sĩ đầu tiên của Đội',
    subtitle: 'Đội VN Tuyên truyền Giải phóng quân',
    category: 'military',
    categoryLabel: '⚔️ Con số quân sự',
    bgImage: getCuratedImage('HomeDashboard__017__VIETNAM_PEOPLES_ARMY'),
    featuredImage: getCuratedImage('HomeDashboard__018__VIETNAM_PEOPLES_ARMY'),
    quote: 'Tên Đội nghĩa là chính trị trọng hơn quân sự. Tuy lúc đầu quy mô nhỏ, nhưng tiền đồ rất vẻ vang.',
    shortDesc: 'Ngày 22/12/1944 tại rừng Trần Hưng Đạo (Cao Bằng), 34 chiến sĩ đầu tiên dưới sự chỉ huy của đồng chí Võ Nguyên Giáp đã đọc 10 Lời thề danh dự, đặt nền móng cho học thuyết chiến tranh nhân dân độc đáo của Việt Nam.',
    audioAiScript: 'Từ 34 chiến sĩ đầu tiên với 34 khẩu súng thô sơ, một đội quân anh hùng bách chiến bách thắng đã ra đời và lớn mạnh.',
    progressSteps: [
      { date: '22/12/1944', title: 'Thành lập Đội', desc: '34 chiến sĩ tuyên thệ dưới cờ đỏ sao vàng' },
      { date: '25/12/1944', title: 'Trận đầu Phai Khắt', desc: 'Hạ đồn giặc không tốn một giọt máu' },
      { date: '26/12/1944', title: 'Trận hạ đồn Nà Ngần', desc: 'Bắt sống chỉ huy giặc, thu toàn bộ vũ khí' },
      { date: '1945', title: 'Phát triển toàn quân', desc: 'Đội quân nòng cốt Tổng khởi nghĩa' }
    ],
    targetTab: 'archives',
    tabLabel: 'Xem Sắc lệnh Thành lập Đội'
  },
  {
    id: 'num-1944',
    number: 1944,
    numberDisplay: '1944',
    unit: 'Năm',
    timeLabel: '22/12/1944',
    title: 'Năm thành lập Quân đội',
    subtitle: 'Khai sinh Quân đội nhân dân Việt Nam',
    category: 'military',
    categoryLabel: '⚔️ Con số quân sự',
    bgImage: getCuratedImage('HomeDashboard__019__GIAP_REVIEW_TROOPS'),
    featuredImage: getCuratedImage('HomeDashboard__020__GIAP_REVIEW_TROOPS'),
    quote: 'Quân đội ta trung với Đảng, hiếu với dân, sẵn sàng chiến đấu hy sinh vì độc lập tự do của Tổ quốc.',
    shortDesc: 'Năm 1944 đánh dấu sự ra đời của lực lượng vũ trang cách mạng nòng cốt. Dưới sự dìu dắt của Bác Hồ và Đại tướng Võ Nguyên Giáp, quân đội ta từ nhân dân mà ra, vì nhân dân mà chiến đấu.',
    audioAiScript: 'Năm 1944, Đội Việt Nam Tuyên truyền Giải phóng quân ra đời, mở ra trang sử vẻ vang của Quân đội nhân dân Việt Nam.',
    progressSteps: [
      { date: 'Tháng 12/1944', title: 'Chỉ thị của Bác Hồ', desc: 'Giao đồng chí Võ Nguyên Giáp thành lập Đội' },
      { date: '22/12/1944', title: 'Khai sinh Quân đội', desc: 'Lễ thành lập tại khu rừng Nguyên Bình' },
      { date: '1945', title: 'Việt Nam Giải phóng quân', desc: 'Lực lượng vũ trang của Cách mạng Tháng Tám' },
      { date: '1950', title: 'Thành lập các Đại đoàn', desc: 'Xây dựng các đại đoàn chủ lực tinh nhuệ' }
    ],
    targetTab: 'timeline',
    tabLabel: 'Khám phá Mốc son 1944'
  },
  {
    id: 'num-750',
    number: 750,
    numberDisplay: '750',
    unit: 'Km',
    timeLabel: 'Thu Đông 1950',
    title: 'Km Biên giới khai thông',
    subtitle: 'Chiến dịch Biên giới Đường số 4',
    category: 'military',
    categoryLabel: '⚔️ Con số quân sự',
    bgImage: getCuratedImage('HomeDashboard__021__CAMPAIGN_MAP'),
    featuredImage: getCuratedImage('HomeDashboard__022__CAMPAIGN_MAP'),
    quote: 'Chiến dịch này chỉ được phép thắng, không được phép thua!',
    shortDesc: 'Chiến dịch Biên giới 1950 khai thông 750km tuyến biên giới Việt - Trung, phá vỡ hoàn toàn thế bao vây cô lập của thực dân Pháp, nối liền căn cứ địa cách mạng Việt Nam với các nước Xã hội Chủ nghĩa anh em.',
    audioAiScript: 'Chiến dịch Biên giới 1950 khai thông 750 kilômét biên cương, mở toang thế trận chủ động phản công chiến lược.',
    progressSteps: [
      { date: '16/09/1950', title: 'Mở màn Đông Khê', desc: 'Đột phá mắt xích then chốt phòng ngự của địch' },
      { date: '01/10/1950', title: 'Hợp vây Đường số 4', desc: 'Chặn đánh hai binh đoàn Charton và Le Page' },
      { date: '08/10/1950', title: 'Bắt sống quan tư Pháp', desc: 'Bắt sống hai chỉ huy cấp cao của địch' },
      { date: '14/10/1950', title: 'Khai thông 750km', desc: 'Giải phóng toàn tuyến biên giới Đông Bắc' }
    ],
    targetTab: 'radar',
    tabLabel: 'Mở Radar Biên Giới 1950'
  }
];

// Component Animated Number Counter
const AnimatedCounter: React.FC<{ target: number; displayValue: string }> = ({ target, displayValue }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 750; // ms
    const stepTime = 25;
    const totalSteps = duration / stepTime;
    const increment = Math.ceil(target / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCurrent(target);
        clearInterval(timer);
      } else {
        setCurrent(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  // If numberDisplay has dots or special format (e.g. '1944'), format appropriately
  if (current >= target) return <span>{displayValue}</span>;
  return <span>{current}</span>;
};

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigate,
  onOpenAi,
  isDark,
  language,
  onOpenArchiveDetail,
}) => {
  const [isMuted, setIsMuted] = useState(getIsMuted());

  // Category Filter for Legendary Numbers
  const [activeCategory, setActiveCategory] = useState<NumberCategory>('all');

  // Selected Number Card for Detail Modal
  const [selectedNumberItem, setSelectedNumberItem] = useState<LegendNumberItem | null>(null);

  // AI Audio Playback in Modal
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);

  // Bulletin ticker active state
  const [currentBulletinIndex, setCurrentBulletinIndex] = useState(0);

  // Auto-rotate bulletin quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBulletinIndex((prev) => (prev + 1) % BULLETIN_QUOTES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNextBulletin = () => {
    playCabinetClick();
    setCurrentBulletinIndex((prev) => (prev + 1) % BULLETIN_QUOTES.length);
  };

  const handlePrevBulletin = () => {
    playCabinetClick();
    setCurrentBulletinIndex((prev) => (prev - 1 + BULLETIN_QUOTES.length) % BULLETIN_QUOTES.length);
  };

  // Filtered numbers
  const filteredNumbers = useMemo(() => {
    if (activeCategory === 'all') return LEGENDARY_NUMBERS;
    return LEGENDARY_NUMBERS.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Speech synthesis for AI summary in modal (approx 15 seconds)
  const handleToggleAiSpeech = (script: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isAiSpeaking) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.pitch = 0.95;

      utterance.onend = () => setIsAiSpeaking(false);
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
      setIsAiSpeaking(true);
    }
  };

  // Clean speech when modal closes
  useEffect(() => {
    if (!selectedNumberItem && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  }, [selectedNumberItem]);

  const currentBulletin = BULLETIN_QUOTES[currentBulletinIndex];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-20 px-2 sm:px-4">
      {/* 1. HERO HEADER: GỌN GÀNG, TRANG NGHIÊM, KHÔNG CHỮ DÀI THƯỢN THƯỢT */}
      <section 
        id="hero-general-section" 
        className={`rounded-3xl border-2 transition-all relative overflow-hidden shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-[#0A192F] via-[#0F2747] to-[#051124] border-[#D4AF37]/50 text-white'
            : 'bg-gradient-to-br from-[#0F2747] via-[#1E3A5F] to-[#0A192F] border-[#D4AF37]/60 text-white shadow-2xl'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Title & Quick Actions */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Star Badge */}
              <div className="flex items-center gap-1.5 text-yellow-400 mb-2">
                <span className="text-sm tracking-widest">★★★★★</span>
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-widest ml-1">
                  Đại tướng Tổng tư lệnh đầu tiên
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                GIAP TRACE
              </h1>
              <p className="text-sm sm:text-base font-extrabold text-[#F59E0B] tracking-wide mt-1">
                DẤU CHÂN ĐẠI TƯỚNG VÕ NGUYÊN GIÁP
              </p>
              <p className="text-xs sm:text-sm text-gray-200 mt-2 font-medium max-w-lg">
                Bảo tàng số hóa di sản quân sự, lưu giữ bản lĩnh lịch sử và triết lý vì Dân của vị Tướng huyền thoại.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-6 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  playRadarPing();
                  onNavigate('archives');
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:brightness-110 text-[#0F2747] font-black text-xs sm:text-sm flex items-center gap-2 border border-yellow-200 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#0F2747]" />
                <span>Tra cứu Di sản</span>
              </button>

              <button
                onClick={() => {
                  playTrumpetSalute();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C41E24] to-[#B91C1C] hover:from-[#DC2626] text-white font-bold text-xs sm:text-sm flex items-center gap-2 border border-yellow-400/60 shadow-md active:scale-95 transition-all cursor-pointer"
                title="Phát kèn quân lệnh trang nghiêm"
              >
                <Flame className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span>Hiệu lệnh Xuất quân</span>
              </button>

              <button
                onClick={onOpenAi}
                className="px-4 py-2.5 rounded-xl bg-[#0F2747] hover:bg-[#1E3A5F] text-[#F59E0B] font-bold text-xs sm:text-sm flex items-center gap-2 border border-[#F59E0B]/60 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Trợ lý GIAP TRACE</span>
              </button>

              <button
                onClick={() => {
                  const muted = toggleMute();
                  setIsMuted(muted);
                }}
                className="p-2.5 rounded-xl bg-black/40 border border-gray-600 text-gray-300 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              </button>
            </div>
          </div>

          {/* Right Column: General with Vietnamese Flag */}
          <div className="lg:col-span-5 relative overflow-hidden bg-black flex items-center justify-center min-h-[220px] lg:min-h-full">
            <img 
              src={getCuratedImage('HomeDashboard__023__HERO_FLAG_GENERAL')} 
              alt="Đại tướng Võ Nguyên Giáp và Cờ đỏ Sao vàng"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-[#F59E0B]/50 text-xs font-bold text-[#F59E0B] flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-red-500 fill-red-500" />
              <span>Cờ Đỏ Sao Vàng Bất Tử</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CÂU NÓI TRUYỀN CẢM HỨNG GHI DẠNG BẢN TIN (NEWS BULLETIN TICKER) */}
      <section 
        id="section-bulletin-quotes"
        className={`rounded-2xl border-2 p-4 sm:p-5 transition-all shadow-md relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-[#1E293B] via-[#162238] to-[#1E293B] border-[#D4A017]/40 text-white'
            : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF3D6] to-[#FFF8EC] border-[#D4A017]/50 text-[#0F172A] shadow-sm'
        }`}
      >
        {/* News Flash Header */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-[#D4A017]/30">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B91C1C] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B91C1C]" />
            </span>
            <span className="text-[11px] font-mono font-black uppercase tracking-widest text-[#B91C1C] dark:text-[#F87171]">
              🔴 BẢN TIN TRUYỀN CẢM HỨNG
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-xs">|</span>
            <span className="text-[10px] font-mono font-bold text-[#B45309] dark:text-yellow-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              {currentBulletin.category} • {currentBulletin.time}
            </span>
          </div>

          {/* Prev / Next controls */}
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold text-gray-500 dark:text-gray-400 mr-1.5">
              {currentBulletinIndex + 1}/{BULLETIN_QUOTES.length}
            </span>
            <button
              onClick={handlePrevBulletin}
              className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#B91C1C] hover:text-white transition-colors cursor-pointer"
              title="Bản tin trước"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextBulletin}
              className="p-1 rounded-lg bg-black/5 dark:bg-white/10 hover:bg-[#B91C1C] hover:text-white transition-colors cursor-pointer"
              title="Bản tin tiếp theo"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The Quote formatted cleanly like a news flash */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="font-vietnamese-quote text-sm sm:text-base md:text-lg italic font-semibold leading-relaxed text-[#0F172A] dark:text-amber-100">
              &ldquo;{currentBulletin.text}&rdquo;
            </p>
            <p className="text-[11px] font-mono font-extrabold text-[#B91C1C] dark:text-yellow-400 mt-1 uppercase tracking-wider">
              — {currentBulletin.author}
            </p>
          </div>

          <button
            onClick={() => {
              playRadarPing();
              onNavigate(currentBulletin.targetTab);
            }}
            className="flex-shrink-0 self-start sm:self-center px-4 py-2 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] hover:from-red-600 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer whitespace-nowrap border border-yellow-300/40"
          >
            <span>{currentBulletin.tabLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2.5 CÁ NHÂN HÓA HÀNH TRÌNH (CỤM GỢI Ý 2-3 THẺ NGANG VỚI ẢNH LỚN & CƠ CHẾ CHỐNG LẶP) */}
      <PersonalizedRecommendations
        isDark={isDark}
        language={language}
        onNavigateToTab={(tab) => {
          onNavigate(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenArchiveDetail={onOpenArchiveDetail}
      />

      {/* 3. NHỮNG CON SỐ HUYỀN THOẠI (THIẾT KẾ BẢO TÀNG SỐ: Ô LỚN CÓ SỐ NỔI BẬT + HÌNH NỀN MỜ + 3 KHU VỰC) */}
      <section 
        id="historical-milestones-ticker-section"
        className={`rounded-3xl border-2 p-5 sm:p-6 transition-all shadow-xl relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] border-[#D4A017]/40 text-white' 
            : 'bg-gradient-to-r from-[#FFFDF8] via-[#FFF8EC] to-[#FFF3D6] border-[#D4A017]/50 text-[#0F172A] shadow-lg'
        }`}
      >
        {/* Header & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-[#D4A017]/30">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider shadow-xs border border-yellow-300/40">
                <Medal className="w-3.5 h-3.5 text-yellow-300" />
                Bảo tàng số Di sản
              </span>
              <span className="text-xs font-mono font-bold text-[#B91C1C] dark:text-[#D4A017]">
                {filteredNumbers.length} Con số lịch sử
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-[#0F172A] dark:text-white flex items-center gap-2 font-serif">
              <span>NHỮNG CON SỐ HUYỀN THOẠI</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-[#CBD5E1] mt-0.5 font-medium">
              Số nổi bật chiếm 60% thẻ • Hình nền tư liệu mờ phía sau • Chạm vào từng ô để xem chi tiết
            </p>
          </div>

          {/* 3 Khu vực phân loại: Con số chiến thắng, Cuộc đời, Quân sự */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'all' as NumberCategory, label: 'Tất cả' },
              { id: 'victory' as NumberCategory, label: '🔥 Chiến thắng' },
              { id: 'life' as NumberCategory, label: '🏅 Cuộc đời' },
              { id: 'military' as NumberCategory, label: '⚔️ Quân sự' },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playCabinetClick();
                    setActiveCategory(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-[#B91C1C] to-[#D4A017] text-white ring-1 ring-yellow-300 shadow-md'
                      : isDark
                      ? 'bg-[#1E293B] hover:bg-[#334155] text-slate-200 border border-slate-700'
                      : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 shadow-xs'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid các ô Number Card với số chiếm 60% diện tích và hình nền mờ phía sau */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredNumbers.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                playRadarPing();
                setSelectedNumberItem(item);
              }}
              className="relative overflow-hidden rounded-2xl border-2 border-[#D4A017]/40 hover:border-[#B91C1C] group cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-2xl h-44 sm:h-48 flex flex-col justify-between p-3.5 bg-black"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playRadarPing();
                  setSelectedNumberItem(item);
                }
              }}
            >
              {/* Ảnh tư liệu lịch sử làm nền mờ phía sau */}
              <img 
                src={item.bgImage} 
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:opacity-45 transition-opacity duration-500 filter blur-[0.6px] group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getCuratedImage('HomeDashboard__024__HERO_FLAG_GENERAL');
                }}
              />
              {/* Lớp phủ chuyển sắc bảo đảm tương phản sắc nét */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 pointer-events-none" />

              {/* Tag phân loại nhỏ phía trên góc */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-amber-300/90">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-amber-400/30 truncate max-w-[120px]">
                  {item.categoryLabel}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:animate-ping" />
              </div>

              {/* SỐ THẬT LỚN Ở GIỮA (CHIẾM ~60% DIỆN TÍCH THẺ) */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center my-1">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-tighter text-[#D4A017] drop-shadow-[0_2px_12px_rgba(212,160,23,0.6)] group-hover:text-yellow-200 transition-colors">
                  <AnimatedCounter target={item.number} displayValue={item.numberDisplay} />
                </div>
                <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-200/90 mt-0.5 font-mono drop-shadow-xs">
                  {item.unit}
                </div>
              </div>

              {/* Tiêu đề ngắn gọn phía dưới - KHÔNG CÓ ĐOẠN VĂN DÀI */}
              <div className="relative z-10 border-t border-white/15 pt-2 text-center">
                <h4 className="text-xs sm:text-[13px] font-extrabold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[10px] text-gray-300/80 font-mono mt-0.5 truncate">
                  {item.timeLabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. MỘT PHÚT CÙNG LỊCH SỬ: NGẮN GỌN + ĐÚNG 1 HÌNH ẢNH KHÔNG CÓ CHỮ + NÚT TO CHUYỂN TỚI MỤC ĐÓ */}
      <section 
        id="section-one-minute-spotlight"
        className={`rounded-3xl border-2 p-5 sm:p-7 transition-all shadow-xl relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-b from-[#1E293B] via-[#16271E] to-[#1E293B] border-[#355E3B]/80 text-white'
            : 'bg-gradient-to-b from-[#FFFFFF] via-[#FFFDF9] to-[#F1F7F2] border-2 border-[#355E3B]/80 text-[#0F172A] shadow-xl'
        }`}
      >
        {/* Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#355E3B] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-sm border border-yellow-300/40">
            <Radio className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            MỘT PHÚT CÙNG LỊCH SỬ
          </span>
          <span className="text-xs font-mono text-[#355E3B] dark:text-[#86EFAC] font-black">
            Thời lượng: 60 Giây
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white leading-snug font-serif">
          Quyết Định Lịch Sử Chuyển Đổi Cách Đánh: Đánh Chắc, Tiến Chắc
        </h3>
        <p className="text-xs sm:text-sm text-stone-700 dark:text-[#CBD5E1] mt-2 leading-relaxed max-w-3xl font-medium">
          Rạng sáng ngày 26/1/1954 tại Mường Phăng, trước giờ nổ súng, Đại tướng Võ Nguyên Giáp đã đưa ra quyết định khó khăn nhất cuộc đời: Hoãn nổ súng, kéo pháo ra, chuyển phương châm tác chiến để bảo toàn lực lượng và nắm chắc 100% phần thắng.
        </p>

        {/* ĐÚNG 1 HÌNH ẢNH LỊCH SỬ DUY NHẤT - NGUYÊN BẢN, SẠCH ĐẸP, HOÀN TOÀN KHÔNG CÓ CHỮ TRÊN ẢNH */}
        <div className="my-5 w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-black shadow-lg border-2 border-[#D4A017]/40">
          <img 
            src={getCuratedImage('HomeDashboard__025__TACTICAL_BRIEFING_MAP')} 
            alt="Hình ảnh diễn tập thuyết minh bản đồ tác chiến"
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* NÚT TO CHUYỂN TỚI MỤC ĐÓ (QUYẾT ĐỊNH THEN CHỐT: ĐIỆN BIÊN PHỦ 1954) & CÁC LỰA CHỌN TRỌNG TÂM */}
        <div className="space-y-3 pt-1">
          {/* NÚT TO CHÍNH */}
          <button
            onClick={() => {
              playRadarPing();
              onNavigate('campaign');
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-700 via-rose-600 to-red-700 hover:brightness-110 text-white font-mono font-black text-sm sm:text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-xl shadow-red-950/40 border-2 border-amber-300 active:scale-[0.98] transition-all cursor-pointer ring-4 ring-red-500/20"
          >
            <Shield className="w-5 h-5 text-yellow-300 animate-pulse" />
            <span>MỞ QUYẾT ĐỊNH THEN CHỐT: ĐIỆN BIÊN PHỦ (BƯỚC NGOẶT LỊCH SỬ)</span>
            <ArrowRight className="w-5 h-5 text-yellow-300" />
          </button>

          {/* CÁC NÚT ĐIỀU HƯỚNG NHANH GỌN GÀNG ĐẾN CÁC MỤC TRỌNG TÂM */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => {
                playRadarPing();
                onNavigate('timeline');
              }}
              className="py-3 px-4 rounded-xl bg-white dark:bg-[#131E2B] hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white border border-amber-400/40 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <GitCommitVertical className="w-4 h-4 text-[#D4A017]" />
              <span>Hành trình 103 năm (Có Quyết định)</span>
            </button>

            <button
              onClick={() => {
                playRadarPing();
                onNavigate('radar');
              }}
              className="py-3 px-4 rounded-xl bg-white dark:bg-[#131E2B] hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white border border-amber-400/40 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Radar className="w-4 h-4 text-amber-500" />
              <span>Radar Tác chiến Mật lệnh</span>
            </button>

            <button
              onClick={() => {
                playRadarPing();
                onNavigate('archives');
              }}
              className="py-3 px-4 rounded-xl bg-white dark:bg-[#131E2B] hover:bg-red-700 hover:text-white dark:hover:bg-red-700 dark:hover:text-white border border-amber-400/40 dark:border-slate-700 text-stone-800 dark:text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Kho Tư liệu & Sắc lệnh</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. POPUP TRIỂN LÃM SỐ CHI TIẾT CON SỐ HUYỀN THOẠI KHI BẤM VÀO */}
      {selectedNumberItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNumberItem(null);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className={`w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl border-2 border-[#D4A017] shadow-2xl p-5 sm:p-7 relative transition-all ${
              isDark ? 'bg-[#1E293B] text-white border-[#D4A017]/70 shadow-black' : 'bg-white text-[#0F172A] border-[#D4A017]'
            }`}
          >
            {/* Top Bar: Category, Badge and Close */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D4A017]/30">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs border border-yellow-300/40">
                  <Medal className="w-3.5 h-3.5 text-yellow-300" />
                  {selectedNumberItem.categoryLabel}
                </span>
                <span className="text-xs font-mono font-bold text-[#D4A017] bg-black/10 dark:bg-black/30 px-2.5 py-1 rounded-lg border border-[#D4A017]/30">
                  {selectedNumberItem.timeLabel}
                </span>
              </div>
              <button
                onClick={() => setSelectedNumberItem(null)}
                className="p-1.5 rounded-xl hover:bg-black/10 dark:hover:bg-white/10 text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer"
                title="Đóng chi tiết"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4">
              {/* 📸 Large Sharp Historical Photo */}
              <div className="relative aspect-video max-h-56 sm:max-h-64 w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-[#D4A017]/40 group">
                <img 
                  src={selectedNumberItem.featuredImage} 
                  alt={selectedNumberItem.title} 
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getCuratedImage('HomeDashboard__026__HERO_FLAG_GENERAL');
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Big Number Badge on Photo */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                  <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#D4A017] text-white font-mono font-black text-xl shadow-lg border border-yellow-300/60">
                    {selectedNumberItem.numberDisplay}
                  </div>
                  <span className="text-xs font-bold text-amber-200 uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg">
                    {selectedNumberItem.unit}
                  </span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white leading-tight font-serif">
                  {selectedNumberItem.numberDisplay} {selectedNumberItem.unit.toUpperCase()} — {selectedNumberItem.title.toUpperCase()}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-[#B91C1C] dark:text-[#D4A017] mt-1">
                  {selectedNumberItem.subtitle}
                </p>
              </div>

              {/* Famous Quote */}
              {selectedNumberItem.quote && (
                <div className={`p-3.5 rounded-2xl border-l-4 border-[#B91C1C] text-xs sm:text-sm italic ${
                  isDark ? 'bg-slate-900/80 border-slate-700 text-amber-100' : 'bg-amber-50/90 border-amber-200 text-stone-800'
                }`}>
                  <div className="flex items-start gap-2">
                    <Quote className="w-4 h-4 text-[#B91C1C] dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="font-vietnamese-quote leading-relaxed">&ldquo;{selectedNumberItem.quote}&rdquo;</p>
                  </div>
                </div>
              )}

              {/* Concise Description (< 100 words) */}
              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                isDark ? 'bg-slate-900/60 border-slate-700 text-slate-200' : 'bg-stone-50 border-stone-200 text-stone-800'
              }`}>
                {selectedNumberItem.shortDesc}
              </div>

              {/* THANH TIẾN TRÌNH TRỰC QUAN (TIMELINE PROGRESS BAR) */}
              <div className={`p-4 rounded-2xl border ${
                isDark ? 'bg-slate-900/60 border-slate-700' : 'bg-stone-50 border-stone-200'
              }`}>
                <div className="flex items-center gap-2 mb-3 text-xs font-mono font-bold text-[#D4A017] uppercase tracking-wider">
                  <Clock className="w-4 h-4 text-[#D4A017]" />
                  <span>DÒNG THỜI GIAN TIẾN TRÌNH LỊCH SỬ</span>
                </div>

                <div className="relative pl-6 space-y-3.5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D4A017]/40">
                  {selectedNumberItem.progressSteps.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Milestone glowing dot */}
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-amber-400/20 group-hover:scale-125 transition-transform" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold text-[#C41E24] dark:text-amber-400">
                            {step.date}:
                          </span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#0F2747] dark:text-white">
                            {step.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 🎙 GIỌNG ĐỌC AI TỰ ĐỘNG (15 GIÂY) */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark ? 'bg-emerald-950/30 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isAiSpeaking ? 'bg-emerald-500 text-white animate-pulse' : 'bg-emerald-700 text-white'
                  }`}>
                    {isAiSpeaking ? <Radio className="w-4 h-4 animate-spin" /> : <Volume2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 block">
                      🎙 Lời thuyết minh AI (15 giây)
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">
                      {selectedNumberItem.audioAiScript}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleAiSpeech(selectedNumberItem.audioAiScript)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 flex-shrink-0 ${
                    isAiSpeaking 
                      ? 'bg-amber-600 text-white animate-pulse' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isAiSpeaking ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3 fill-white" />}
                  <span>{isAiSpeaking ? 'Dừng đọc' : 'Phát AI'}</span>
                </button>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="mt-6 pt-4 border-t border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setSelectedNumberItem(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-400/40 text-xs sm:text-sm font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  playSuccessChime();
                  const tab = selectedNumberItem.targetTab;
                  setSelectedNumberItem(null);
                  onNavigate(tab);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C41E24] to-[#B91C1C] hover:from-[#DC2626] text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-red-900/30 border border-yellow-300/40 active:scale-95 transition-all cursor-pointer"
              >
                <span>{selectedNumberItem.tabLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
