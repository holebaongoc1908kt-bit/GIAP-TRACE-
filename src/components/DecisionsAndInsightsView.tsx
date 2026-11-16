import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Sparkles, 
  Trophy, 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  Award, 
  Zap, 
  ChevronRight,
  Target,
  Swords,
  Compass,
  Play,
  HelpCircle,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Send,
  UserCheck,
  Search,
  BookOpen,
  Sliders,
  History,
  Maximize2,
  Minimize2,
  GripVertical,
  Lightbulb,
  Check,
  X,
  Info,
  Layers
} from 'lucide-react';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { 
  playSuccessChime, 
  playRadarPing, 
  playVictoryFanfare, 
  playCabinetClick,
  playGiaiMaTransitionSound 
} from '../utils/soundEffects';
import { recordBrowsingHistory } from '../utils/browsingHistory';
import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';

// 6 Distinct Game Modes + Lobby
type GameMode = 
  | 'lobby'
  | 'mode-4-answers'      // 1. 4 ĐÁP ÁN — Trắc nghiệm nhanh
  | 'mode-if-you'         // 2. NẾU LÀ TÔI — Quyết định cá nhân
  | 'mode-clue-decode'    // 3. GIẢI MÃ — Suy luận từ manh mối
  | 'mode-timeline-order' // 4. XẾP LẠI DÒNG CHẢY
  | 'mode-one-minute-gen' // 5. MỘT PHÚT LÀM TƯỚNG
  | 'mode-mystery-trace'; // 6. ĐOÁN DẤU VẾT

// ==========================================
// 1. DỮ LIỆU GAME 1: 4 ĐÁP ÁN (QUICK QUIZ)
// ==========================================
interface FourOptionQuestion {
  id: string;
  yearBadge: string;
  question: string;
  options: { letter: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctLetter: 'A' | 'B' | 'C' | 'D';
  shortFact: string;
  clueHint: string;
}

const FOUR_OPTION_QUESTIONS: FourOptionQuestion[] = [
  {
    id: 'fo-1',
    yearBadge: '1954',
    question: 'Chiến thắng lịch sử Điện Biên Phủ "chấn động địa cầu" diễn ra vào ngày tháng năm nào?',
    options: [
      { letter: 'A', text: '07 tháng 05 năm 1954' },
      { letter: 'B', text: '13 tháng 03 năm 1954' },
      { letter: 'C', text: '22 tháng 12 năm 1954' },
      { letter: 'D', text: '30 tháng 04 năm 1954' }
    ],
    correctLetter: 'A',
    shortFact: 'Chiều 07/05/1954, lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries, kết thúc 56 ngày đêm chiến dịch.',
    clueHint: 'Chiến dịch Điện Biên Phủ kéo dài 56 ngày đêm, mở màn từ ngày 13/03/1954 và toàn thắng vang dội vào tuần đầu tiên của tháng 5 năm 1954.'
  },
  {
    id: 'fo-2',
    yearBadge: '1944',
    question: 'Đội Việt Nam Tuyên truyền Giải phóng quân thành lập ngày 22/12/1944 gồm bao nhiêu chiến sĩ đầu tiên?',
    options: [
      { letter: 'A', text: '12 chiến sĩ' },
      { letter: 'B', text: '34 chiến sĩ đầu tiên' },
      { letter: 'C', text: '56 chiến sĩ' },
      { letter: 'D', text: '80 chiến sĩ' }
    ],
    correctLetter: 'B',
    shortFact: '34 chiến sĩ đầu tiên dưới sự chỉ huy của đồng chí Võ Nguyên Giáp tại rừng Trần Hưng Đạo (Cao Bằng).',
    clueHint: 'Đội quân tiền thân ban đầu có quy mô tinh gọn gồm hơn 30 chiến sĩ, số lượng là một số chẵn có hai chữ số (gấp đôi số 17).'
  },
  {
    id: 'fo-3',
    yearBadge: '1975',
    question: 'Bức điện mật khẩn cấp ngày 07/04/1975 của Đại tướng mở đầu bằng câu khẩu lệnh nào?',
    options: [
      { letter: 'A', text: '"Kiên trì, kiên trì hơn nữa"' },
      { letter: 'B', text: '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa"' },
      { letter: 'C', text: '"Đánh chắc, tiến chắc từng bước"' },
      { letter: 'D', text: '"Bảo toàn lực lượng là trên hết"' }
    ],
    correctLetter: 'B',
    shortFact: 'Mật lệnh lịch sử thôi thúc 5 cánh quân giải phóng tiến nhanh về Sài Gòn, làm nên đại thắng mùa Xuân 1975.',
    clueHint: 'Khẩu lệnh lịch sử mùa Xuân 1975 nhấn mạnh yếu tố thời gian và tốc độ hành quân như vũ bão, bắt đầu bằng từ "Thần tốc...".'
  },
  {
    id: 'fo-4',
    yearBadge: '1911',
    question: 'Quê hương của Đại tướng Võ Nguyên Giáp nằm bên dòng sông thơ mộng nào?',
    options: [
      { letter: 'A', text: 'Dòng sông Kiến Giang (Lệ Thủy, Quảng Bình)' },
      { letter: 'B', text: 'Dòng sông Thạch Hãn (Quảng Trị)' },
      { letter: 'C', text: 'Dòng sông Hương (Thừa Thiên Huế)' },
      { letter: 'D', text: 'Dòng sông Lam (Nghệ An)' }
    ],
    correctLetter: 'A',
    shortFact: 'Làng An Xá, xã Lộc Thủy bên dòng Kiến Giang hiền hòa là nơi nuôi dưỡng tâm hồn và nhân cách của Đại tướng.',
    clueHint: 'Dòng sông quê hương của Đại tướng chảy qua huyện Lệ Thủy, tỉnh Quảng Bình, hàng năm vào dịp 2/9 đều có lễ hội đua bơi thuyền truyền thống náo nhiệt.'
  }
];

// ==========================================
// 2. DỮ LIỆU GAME 2: NẾU LÀ TÔI (PERSONAL DECISION)
// Không có A/B/C/D bắt buộc, người chơi chọn hành động & viết lý do
// ==========================================
interface IfYouScenario {
  id: string;
  badge: string;
  title: string;
  situation: string;
  actionIdeas: {
    id: string;
    label: string;
    styleTag: string;
  }[];
  historicalContext: string;
  generalGiapChoice: string;
  reflectionPrompt: string;
}

const IF_YOU_SCENARIOS: IfYouScenario[] = [
  {
    id: 'iy-1',
    badge: 'ĐIỆN BIÊN PHỦ • 1954',
    title: 'Đêm trắng trước giờ khai hỏa',
    situation: 'Bạn là Tư lệnh chiến dịch. Phương án ban đầu "Đánh nhanh thắng nhanh" đã được phổ biến. Nhưng khi đi thực địa, bạn nhận thấy pháo binh địch đã gia cố công sự kiên cố, còn pháo ta kéo vào chậm chưa ngụy trang xong. Giờ nổ súng chỉ còn tính bằng giờ.',
    actionIdeas: [
      { id: 'act-1', label: '🛡️ Hoãn giờ nổ súng, kéo pháo ra, chuyển sang "Đánh chắc tiến chắc"', styleTag: 'Bản lĩnh & Trách nhiệm cao nhất' },
      { id: 'act-2', label: '⚡ Tiến công ngay như kế hoạch cũ để tận dụng sĩ khí bộ đội', styleTag: 'Táo bạo nhưng rủi ro tổn thất lớn' },
      { id: 'act-3', label: '📡 Xin ý kiến thêm từ cố vấn và cơ quan trung ương', styleTag: 'Cẩn trọng nhưng dễ lỡ thời cơ chiến trường' },
      { id: 'act-4', label: '⛰️ Giữ nguyên pháo tại chỗ, chỉ dùng bộ binh thăm dò', styleTag: 'Phân tán lực lượng, dễ bị địch phát hiện' }
    ],
    historicalContext: 'Đại tướng Võ Nguyên Giáp đã trải qua 11 ngày đêm trăn trở, đầu quấn khăn ngải cứu chống đau đầu. Sáng 26/01/1954, trong cuộc họp Đảng ủy mặt trận, Đại tướng đã kết luận: Hoãn nổ súng, ra lệnh kéo pháo ra.',
    generalGiapChoice: 'Đây là quyết định khó khăn nhất trong cuộc đời chỉ huy của Đại tướng. Quyết định đã cứu hàng vạn sinh mạng bộ đội và bảo đảm chắc thắng trọn vẹn cho trận quyết chiến chiến lược.',
    reflectionPrompt: 'Theo bạn, người chỉ huy cần dũng khí gì lớn nhất khi phải đảo ngược một quyết định đã được toàn quân chuẩn bị?'
  },
  {
    id: 'iy-2',
    badge: 'CAO BẰNG • 1944',
    title: 'Khai sinh đội quân từ hai bàn tay trắng',
    situation: 'Cuối năm 1944, phong trào đấu tranh sục sôi. Ta chỉ có vài chục khẩu súng kíp thô sơ. Một số đồng chí nóng lòng muốn phát động khởi nghĩa vũ trang rộng khắp ngay.',
    actionIdeas: [
      { id: 'act-1', label: '🌾 Lấy chính trị làm gốc, xây dựng đội quân "Tuyên truyền trọng hơn tác chiến"', styleTag: 'Tầm nhìn căn cơ, dựa vào lòng dân' },
      { id: 'act-2', label: '⚔️ Phát động đánh đồn bốt lớn ngay để tạo tiếng vang', styleTag: 'Hăng hái nhưng dễ bộc lộ non yếu' },
      { id: 'act-3', label: '📦 Chờ gom đủ vũ khí hiện đại từ bên ngoài rồi mới xuất quân', styleTag: 'Bị động, bỏ lỡ thời cơ cách mạng' }
    ],
    historicalContext: 'Thực hiện chỉ thị của Bác Hồ, đồng chí Võ Nguyên Giáp chọn 34 chiến sĩ ưu tú, tổ chức lễ thành lập Đội Việt Nam Tuyên truyền Giải phóng quân với nguyên tắc: Chính trị trọng hơn quân sự.',
    generalGiapChoice: 'Nhờ dựa chắc vào dân, ngay sau lễ tuyên thệ, đội quân đã mưu trí hạ đồn Phai Khắt và Nà Ngần mà không tốn một viên đạn, giữ trọn vẹn lực lượng non trẻ.',
    reflectionPrompt: 'Khi bắt đầu từ số 0, bạn sẽ đặt nền móng sức mạnh của mình vào điều gì trước tiên?'
  }
];

// ==========================================
// 3. DỮ LIỆU GAME 3: GIẢI MÃ — MANH MỐI & SUY LUẬN
// 3-4 manh mối tiết lộ dần, người chơi tự nhập hoặc chọn
// ==========================================
interface ClueDecoderPuzzle {
  id: string;
  title: string;
  category: string;
  targetAnswer: string;
  normalizedKeywords: string[];
  clues: string[];
  imageReveal: string;
  historicalRevelation: string;
}

const CLUE_PUZZLES: ClueDecoderPuzzle[] = [
  {
    id: 'clue-1',
    title: 'Căn cứ bí mật giữa rừng già',
    category: 'ĐỊA DANH LỊCH SỬ',
    targetAnswer: 'Mường Phăng',
    normalizedKeywords: ['muong phang', 'mường phăng', 'so chi huy muong phang'],
    clues: [
      'Manh mối 1: Nằm dưới chân núi Pú Đồn, ẩn mình dưới tán rừng nguyên sinh xanh thẳm.',
      'Manh mối 2: Nơi đây có căn hầm xuyên núi dài 96 mét dẫn đến lán làm việc của vị Tổng Tư lệnh.',
      'Manh mối 3: Nơi đưa ra quyết định lịch sử chuyển phương châm tác chiến ngày 26/01/1954.'
    ],
    imageReveal: getCuratedImage('DecisionsAndInsightsView__001__GIAP_MUONG_PHANG_HQ'),
    historicalRevelation: 'Sở chỉ huy Mường Phăng (Điện Biên) là trung tâm đầu não của chiến dịch, nơi ghi dấu những đêm trắng trăn trở của Đại tướng Võ Nguyên Giáp.'
  },
  {
    id: 'clue-2',
    title: 'Bảo vật gắn liền ngày thống nhất',
    category: 'HIỆN VẬT LỊCH SỬ',
    targetAnswer: 'Xe tăng 843',
    normalizedKeywords: ['843', 'xe tang 843', 'xe tăng 843', 'tank 843'],
    clues: [
      'Manh mối 1: Là chiến xa dẫn đầu đội hình Đại đội 4 thuộc Lữ đoàn Tăng thiết giáp 203.',
      'Manh mối 2: Trưa ngày 30/4/1975, cỗ xe húc nghiêng cổng phụ Dinh Độc Lập.',
      'Manh mối 3: Đại đội trưởng Bùi Quang Thận trên xe đã chạy lên nóc Dinh cắm lá cờ chiến thắng.'
    ],
    imageReveal: getCuratedImage('DecisionsAndInsightsView__002__MUSEUM_TANK_HALL'),
    historicalRevelation: 'Xe tăng T-54B số hiệu 843 hiện là Bảo vật Quốc gia vô giá, lưu giữ tinh thần "Thần tốc, quyết thắng" của chiến dịch Hồ Chí Minh.'
  },
  {
    id: 'clue-3',
    title: 'Công trình chỉ huy trong lòng đất Thăng Long',
    category: 'DI TÍCH LỊCH SỬ',
    targetAnswer: 'Hầm D67',
    normalizedKeywords: ['d67', 'ham d67', 'hầm d67', 'nha d67', 'nha va ham d67'],
    clues: [
      'Manh mối 1: Nằm sâu dưới lòng đất Hoàng thành Thăng Long, xây dựng năm 1967.',
      'Manh mối 2: Có hệ thống lọc độc, chống bom đạn và thông tin liên lạc hiện đại nhất thời bấy giờ.',
      'Manh mối 3: Nơi Bộ Chính trị và Quân ủy Trung ương họp bàn các kế hoạch giải phóng hoàn toàn miền Nam.'
    ],
    imageReveal: getCuratedImage('DecisionsAndInsightsView__003__D67_BUNKER_COMMAND'),
    historicalRevelation: 'Nhà và Hầm D67 là Tổng hành dinh chỉ huy tác chiến của Quân đội nhân dân Việt Nam trong kháng chiến chống Mỹ cứu nước.'
  }
];

// ==========================================
// 4. DỮ LIỆU GAME 4: XẾP LẠI DÒNG CHẢY (TIMELINE ORDER)
// Kéo thả hoặc nút bấm đảo vị trí sự kiện
// ==========================================
interface TimelineOrderItem {
  id: string;
  year: string;
  title: string;
  shortDesc: string;
}

const TIMELINE_CHALLENGE_EVENTS: TimelineOrderItem[] = [
  {
    id: 'tl-1',
    year: '1944',
    title: 'Thành lập Đội VN Tuyên truyền Giải phóng quân',
    shortDesc: '34 chiến sĩ đầu tiên tuyên thệ tại rừng Trần Hưng Đạo (Cao Bằng).'
  },
  {
    id: 'tl-2',
    year: '1950',
    title: 'Chiến dịch Biên Giới Thu - Đông',
    shortDesc: 'Chiến dịch tiến công lớn đầu tiên khai thông biên giới Việt - Trung.'
  },
  {
    id: 'tl-3',
    year: '1954',
    title: 'Chiến thắng lịch sử Điện Biên Phủ',
    shortDesc: '56 ngày đêm đập tan tập đoàn cứ điểm của thực dân Pháp.'
  },
  {
    id: 'tl-4',
    year: '1975',
    title: 'Đại thắng mùa Xuân & Chiến dịch Hồ Chí Minh',
    shortDesc: 'Mật lệnh thần tốc đưa các cánh quân tiến vào Sài Gòn thống nhất non sông.'
  }
];

// ==========================================
// 5. DỮ LIỆU GAME 5: MỘT PHÚT LÀM TƯỚNG (PRIORITY LEADERSHIP)
// Chọn ưu tiên tối thượng + suy luận cá nhân, không có đúng/sai tuyệt đối
// ==========================================
interface GeneralPriorityChoice {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  perspectiveAnalysis: string;
}

const GENERAL_PRIORITIES: GeneralPriorityChoice[] = [
  {
    id: 'p-1',
    title: '🛡️ Bảo toàn sinh mệnh bộ đội',
    subtitle: '"Chắc thắng mới đánh, không chắc thắng không đánh"',
    iconName: 'shield',
    perspectiveAnalysis: 'Đây chính là linh hồn trong tư tưởng quân sự của Đại tướng Võ Nguyên Giáp. Người từng nói: "Một vị tướng giỏi là người biết giành thắng lợi với sự hy sinh xương máu ít nhất của chiến sĩ."'
  },
  {
    id: 'p-2',
    title: '⚡ Tốc độ và yếu tố bất ngờ',
    subtitle: '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa"',
    iconName: 'zap',
    perspectiveAnalysis: 'Ưu tiên then chốt trong thời cơ chiến lược. Khi đối phương hoang mang tan rã, tốc độ tiến công chớp nhoáng sẽ tước đi khả năng phòng ngự của kẻ thù mà không tốn nhiều tổn thất.'
  },
  {
    id: 'p-3',
    title: '🌾 Hậu cần và sự đồng lòng của nhân dân',
    subtitle: '"Dân là gốc, hậu cần thông suốt thì tiền tuyến tất thắng"',
    iconName: 'heart',
    perspectiveAnalysis: 'Không có hàng vạn dân công hỏa tuyến, hàng vạn chiếc xe đạp thồ vượt đèo lội suối thì không thể có kỳ tích Điện Biên Phủ. Lòng dân là thành lũy vững chãi nhất.'
  },
  {
    id: 'p-4',
    title: '🎯 Kỷ luật chiến trường và sự tập trung',
    subtitle: '"Quân lệnh như sơn, chấp hành triệt để mệnh lệnh cấp trên"',
    iconName: 'target',
    perspectiveAnalysis: 'Kỷ luật thép là sức mạnh vô địch của Quân đội nhân dân Việt Nam. Dù chuyển phương châm đầy khó khăn, toàn quân vẫn đồng lòng kéo pháo ra an toàn tuyệt đối.'
  }
];

// ==========================================
// 6. DỮ LIỆU GAME 6: ĐOÁN DẤU VẾT (MYSTERY TRACE)
// Hình ảnh mờ che phủ, mở từng lớp gợi ý
// ==========================================
interface MysteryTraceItem {
  id: string;
  title: string;
  image: string;
  layers: {
    level: number;
    blurAmount: number;
    clueText: string;
  }[];
  candidates: string[];
  correctCandidate: string;
  contextFact: string;
}

const MYSTERY_TRACES: MysteryTraceItem[] = [
  {
    id: 'mt-1',
    title: 'Dấu vết thời gian: Bức ảnh lịch sử',
    image: getCuratedImage('DecisionsAndInsightsView__004__GIAP_WITH_UNCLE_HO'),
    layers: [
      { level: 1, blurAmount: 18, clueText: '🔍 Lớp 1: Bức ảnh chụp tại căn cứ địa kháng chiến trong một cuộc họp tối mật.' },
      { level: 2, blurAmount: 9, clueText: '🔍 Lớp 2: Có hình ảnh Bác Hồ kính yêu và Đại tướng Võ Nguyên Giáp trao đổi kế hoạch tác chiến.' },
      { level: 3, blurAmount: 0, clueText: '🔍 Lớp 3: Bối cảnh chiến khu Việt Bắc thời kỳ kháng chiến chống thực dân Pháp.' }
    ],
    candidates: [
      'Bác Hồ cùng Đại tướng tại ATK Định Hóa (Việt Bắc)',
      'Lễ thành lập Đội VN Tuyên truyền Giải phóng quân',
      'Đại tướng đọc nhật lệnh tại sân bay Mường Thanh',
      'Đại tướng ký sắc lệnh tại Bắc Bộ Phủ'
    ],
    correctCandidate: 'Bác Hồ cùng Đại tướng tại ATK Định Hóa (Việt Bắc)',
    contextFact: 'Bức ảnh lịch sử ghi lại khoảnh khắc Chủ tịch Hồ Chí Minh cùng Đại tướng Võ Nguyên Giáp tại chiến khu Việt Bắc - nơi đưa ra các quyết sách làm thay đổi vận mệnh dân tộc.'
  },
  {
    id: 'mt-2',
    title: 'Dấu vết quân sử: Lá cờ trên nóc hầm',
    image: getCuratedImage('DecisionsAndInsightsView__005__DIEN_BIEN_FLAG_WIN'),
    layers: [
      { level: 1, blurAmount: 18, clueText: '🔍 Lớp 1: Khói lửa chiến hào và một ngọn cờ đang tung bay.' },
      { level: 2, blurAmount: 9, clueText: '🔍 Lớp 2: Khoảnh khắc chiều ngày 07/05/1954 tại lòng chảo Điện Biên.' },
      { level: 3, blurAmount: 0, clueText: '🔍 Lớp 3: Lá cờ "Quyết chiến Quyết thắng" cắm trên nóc hầm tướng De Castries.' }
    ],
    candidates: [
      'Cắm cờ chiến thắng trên nóc hầm De Castries (Điện Biên Phủ)',
      'Xe tăng húc cổng Dinh Độc Lập 1975',
      'Đội danh dự kéo cờ tại Quảng trường Ba Đình 1945',
      'Trận đánh đồn Phai Khắt 1944'
    ],
    correctCandidate: 'Cắm cờ chiến thắng trên nóc hầm De Castries (Điện Biên Phủ)',
    contextFact: 'Hình ảnh chiến sĩ cắm cờ trên nóc hầm De Castries là biểu tượng bất diệt cho ý chí kiên cường và nghệ thuật quân sự tài tình của Việt Nam.'
  }
];

interface DecisionsAndInsightsViewProps {
  isDark: boolean;
  onNavigateToTab?: (tab: any) => void;
}

export const DecisionsAndInsightsView: React.FC<DecisionsAndInsightsViewProps> = ({
  isDark,
}) => {
  // Current game mode
  const [currentMode, setCurrentMode] = useState<GameMode>('lobby');

  // Transition overlay state ("whoosh -> click -> metallic resonance")
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionTargetMode, setTransitionTargetMode] = useState<GameMode | null>(null);

  // Player stats & personalization
  const [playerScore, setPlayerScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('giap_trace_game_score');
      return saved ? parseInt(saved, 10) : 150;
    } catch {
      return 150;
    }
  });

  const [completedGames, setCompletedGames] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('giap_trace_completed_games');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [leadershipTag, setLeadershipTag] = useState<string>(() => {
    try {
      return localStorage.getItem('giap_trace_leadership_style') || 'Tư lệnh Cẩn trọng & Nhân văn';
    } catch {
      return 'Tư lệnh Cẩn trọng & Nhân văn';
    }
  });

  // Save score to local storage
  const updatePlayerScore = (delta: number) => {
    setPlayerScore((prev) => {
      const updated = prev + delta;
      try {
        localStorage.setItem('giap_trace_game_score', updated.toString());
      } catch {}
      return updated;
    });
  };

  // Trigger Cinematic "GIẢI MÃ" transition (0.9s duration)
  const triggerTransitionTo = (target: GameMode) => {
    playGiaiMaTransitionSound();
    setIsTransitioning(true);
    setTransitionTargetMode(target);

    setTimeout(() => {
      setCurrentMode(target);
      setIsTransitioning(false);
      setTransitionTargetMode(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 950);
  };

  // ==========================================
  // STATES FOR GAME 1: 4 ĐÁP ÁN (QUICK QUIZ - 2 ATTEMPTS)
  // ==========================================
  const [foIndex, setFoIndex] = useState<number>(0);
  const [foSelectedLetter, setFoSelectedLetter] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [foRevealed, setFoRevealed] = useState<boolean>(false);
  const [foRoundScore, setFoRoundScore] = useState<number>(0);
  const [foFinished, setFoFinished] = useState<boolean>(false);
  const [foAttemptCount, setFoAttemptCount] = useState<number>(1);
  const [foWrongLetters, setFoWrongLetters] = useState<('A' | 'B' | 'C' | 'D')[]>([]);
  const [foShowClue, setFoShowClue] = useState<boolean>(false);
  const [foLastAttemptCorrect, setFoLastAttemptCorrect] = useState<boolean>(false);

  const currentFo = FOUR_OPTION_QUESTIONS[foIndex];

  const handleSelectFo = (letter: 'A' | 'B' | 'C' | 'D') => {
    if (foRevealed || foWrongLetters.includes(letter)) return;
    setFoSelectedLetter(letter);

    const isCorrect = letter === currentFo.correctLetter;

    if (isCorrect) {
      playSuccessChime();
      const points = foAttemptCount === 1 ? 100 : 60;
      updatePlayerScore(points);
      setFoRoundScore((prev) => prev + points);
      setFoRevealed(true);
      setFoLastAttemptCorrect(true);
    } else {
      playRadarPing();
      if (foAttemptCount === 1) {
        // Lần 1 chọn sai: cho phép chọn lần 2 & hiển thị manh mối lịch sử
        setFoWrongLetters((prev) => [...prev, letter]);
        setFoAttemptCount(2);
        setFoShowClue(true);
      } else {
        // Lần 2 chọn sai: khóa câu hỏi và hiện đáp án đúng cùng giải thích
        setFoWrongLetters((prev) => [...prev, letter]);
        setFoRevealed(true);
        setFoLastAttemptCorrect(false);
      }
    }
  };

  const handleNextFo = () => {
    playCabinetClick();
    if (foIndex < FOUR_OPTION_QUESTIONS.length - 1) {
      setFoIndex((prev) => prev + 1);
      setFoSelectedLetter(null);
      setFoRevealed(false);
      setFoAttemptCount(1);
      setFoWrongLetters([]);
      setFoShowClue(false);
      setFoLastAttemptCorrect(false);
    } else {
      playVictoryFanfare();
      setFoFinished(true);
      markGameCompleted('4-dap-an');
    }
  };

  // ==========================================
  // STATES FOR GAME 2: NẾU LÀ TÔI (PERSONAL DECISION)
  // ==========================================
  const [iyIndex, setIyIndex] = useState<number>(0);
  const [iySelectedActionId, setIySelectedActionId] = useState<string | null>(null);
  const [iyReasoningText, setIyReasoningText] = useState<string>('');
  const [iySubmitted, setIySubmitted] = useState<boolean>(false);

  const currentIy = IF_YOU_SCENARIOS[iyIndex];

  const handleSubmitIy = () => {
    if (!iySelectedActionId) return;
    playSuccessChime();
    setIySubmitted(true);
    updatePlayerScore(150);
    markGameCompleted('neu-la-toi');

    // Update player style tag
    const selectedAction = currentIy.actionIdeas.find(a => a.id === iySelectedActionId);
    if (selectedAction) {
      setLeadershipTag(selectedAction.styleTag);
      try {
        localStorage.setItem('giap_trace_leadership_style', selectedAction.styleTag);
      } catch {}
    }
  };

  const handleNextIy = () => {
    playCabinetClick();
    if (iyIndex < IF_YOU_SCENARIOS.length - 1) {
      setIyIndex((prev) => prev + 1);
      setIySelectedActionId(null);
      setIyReasoningText('');
      setIySubmitted(false);
    } else {
      playVictoryFanfare();
      triggerTransitionTo('lobby');
    }
  };

  // ==========================================
  // STATES FOR GAME 3: GIẢI MÃ — MANH MỐI
  // ==========================================
  const [clueIndex, setClueIndex] = useState<number>(0);
  const [unlockedClueCount, setUnlockedClueCount] = useState<number>(1);
  const [typedAnswer, setTypedAnswer] = useState<string>('');
  const [clueSolved, setClueSolved] = useState<boolean>(false);
  const [clueError, setClueError] = useState<boolean>(false);

  const currentCluePuzzle = CLUE_PUZZLES[clueIndex];

  const handleUnlockNextClue = () => {
    playCabinetClick();
    if (unlockedClueCount < currentCluePuzzle.clues.length) {
      setUnlockedClueCount((prev) => prev + 1);
    }
  };

  const handleVerifyClueAnswer = (answerToCheck?: string) => {
    const raw = (answerToCheck || typedAnswer).trim().toLowerCase();
    if (!raw) return;

    const isMatch = currentCluePuzzle.normalizedKeywords.some(kw => 
      raw.includes(kw) || kw.includes(raw)
    );

    if (isMatch) {
      playSuccessChime();
      setClueSolved(true);
      setClueError(false);
      updatePlayerScore(120);
      markGameCompleted('giai-ma-manh-moi');
    } else {
      playRadarPing();
      setClueError(true);
      setTimeout(() => setClueError(false), 2000);
    }
  };

  const handleNextCluePuzzle = () => {
    playCabinetClick();
    if (clueIndex < CLUE_PUZZLES.length - 1) {
      setClueIndex((prev) => prev + 1);
      setUnlockedClueCount(1);
      setTypedAnswer('');
      setClueSolved(false);
    } else {
      playVictoryFanfare();
      triggerTransitionTo('lobby');
    }
  };

  // ==========================================
  // STATES FOR GAME 4: XẾP LẠI DÒNG CHẢY (TIMELINE - DRAG & DROP SLOTS 1 2 3 4)
  // ==========================================
  const [placedSlots, setPlacedSlots] = useState<(TimelineOrderItem | null)[]>([
    null, null, null, null
  ]);
  const [unplacedEvents, setUnplacedEvents] = useState<TimelineOrderItem[]>(() => [
    TIMELINE_CHALLENGE_EVENTS[2],
    TIMELINE_CHALLENGE_EVENTS[0],
    TIMELINE_CHALLENGE_EVENTS[3],
    TIMELINE_CHALLENGE_EVENTS[1]
  ]);
  const [timelineAttempt, setTimelineAttempt] = useState<number>(1);
  const [timelineChecked, setTimelineChecked] = useState<boolean>(false);
  const [timelineSuccess, setTimelineSuccess] = useState<boolean>(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [activeDropSlot, setActiveDropSlot] = useState<number | null>(null);
  const [slotFeedback, setSlotFeedback] = useState<boolean[]>([]);

  // Drag & Drop / Tap-to-place Handlers
  const handleDragStartItem = (id: string, e?: React.DragEvent) => {
    if (timelineChecked && timelineSuccess) return;
    setDraggedItemId(id);
    if (e && e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDropOnSlot = (targetSlotIdx: number, e?: React.DragEvent) => {
    if (e) {
      e.preventDefault();
    }
    setActiveDropSlot(null);
    if (!draggedItemId || (timelineChecked && timelineSuccess)) return;

    // Check if dragged item is in unplacedEvents
    const unplacedItem = unplacedEvents.find(it => it.id === draggedItemId);
    // Or check if it is in an existing slot
    const fromSlotIdx = placedSlots.findIndex(s => s?.id === draggedItemId);

    const itemToPlace = unplacedItem || (fromSlotIdx !== -1 ? placedSlots[fromSlotIdx] : null);
    if (!itemToPlace) {
      setDraggedItemId(null);
      return;
    }

    playCabinetClick();
    const newPlacedSlots = [...placedSlots];
    const newUnplaced = [...unplacedEvents];

    const currentItemInTarget = newPlacedSlots[targetSlotIdx];

    if (unplacedItem) {
      // Remove from unplaced
      const filteredUnplaced = newUnplaced.filter(it => it.id !== draggedItemId);
      if (currentItemInTarget) {
        // Return existing target item to unplaced
        filteredUnplaced.push(currentItemInTarget);
      }
      newPlacedSlots[targetSlotIdx] = itemToPlace;
      setUnplacedEvents(filteredUnplaced);
      setPlacedSlots(newPlacedSlots);
    } else if (fromSlotIdx !== -1) {
      // Swapping slots
      newPlacedSlots[fromSlotIdx] = currentItemInTarget;
      newPlacedSlots[targetSlotIdx] = itemToPlace;
      setPlacedSlots(newPlacedSlots);
    }

    setDraggedItemId(null);
  };

  const handleQuickPlaceItem = (item: TimelineOrderItem) => {
    if (timelineChecked && timelineSuccess) return;
    const firstEmptyIdx = placedSlots.findIndex(s => s === null);
    if (firstEmptyIdx === -1) return;

    playCabinetClick();
    const newSlots = [...placedSlots];
    newSlots[firstEmptyIdx] = item;
    setPlacedSlots(newSlots);
    setUnplacedEvents(prev => prev.filter(it => it.id !== item.id));
  };

  const handleRemoveFromSlot = (slotIdx: number) => {
    if (timelineChecked && timelineSuccess) return;
    const item = placedSlots[slotIdx];
    if (!item) return;

    playCabinetClick();
    const newSlots = [...placedSlots];
    newSlots[slotIdx] = null;
    setPlacedSlots(newSlots);
    setUnplacedEvents(prev => [...prev, item]);
  };

  const checkTimelineOrder = () => {
    const isAllFilled = placedSlots.every(s => s !== null);
    if (!isAllFilled) {
      playRadarPing();
      return;
    }

    const feedbacks = placedSlots.map((item, idx) => item?.id === TIMELINE_CHALLENGE_EVENTS[idx].id);
    const isCorrect = feedbacks.every(Boolean);

    setSlotFeedback(feedbacks);
    setTimelineChecked(true);
    setTimelineSuccess(isCorrect);

    if (isCorrect) {
      playSuccessChime();
      const points = timelineAttempt === 1 ? 150 : 100;
      updatePlayerScore(points);
      markGameCompleted('xep-dong-chay');
    } else {
      playRadarPing();
    }
  };

  const retryTimelineSecondAttempt = () => {
    playCabinetClick();
    setTimelineAttempt(2);
    setTimelineChecked(false);
    setSlotFeedback([]);
  };

  const resetTimelineChallenge = () => {
    playCabinetClick();
    setPlacedSlots([null, null, null, null]);
    setUnplacedEvents([
      TIMELINE_CHALLENGE_EVENTS[2],
      TIMELINE_CHALLENGE_EVENTS[0],
      TIMELINE_CHALLENGE_EVENTS[3],
      TIMELINE_CHALLENGE_EVENTS[1]
    ]);
    setTimelineAttempt(1);
    setTimelineChecked(false);
    setTimelineSuccess(false);
    setSlotFeedback([]);
    setDraggedItemId(null);
    setActiveDropSlot(null);
  };

  // ==========================================
  // STATES FOR GAME 5: MỘT PHÚT LÀM TƯỚNG (PRIORITY)
  // ==========================================
  const [selectedPriorityId, setSelectedPriorityId] = useState<string | null>(null);
  const [priorityNote, setPriorityNote] = useState<string>('');
  const [prioritySubmitted, setPrioritySubmitted] = useState<boolean>(false);

  const handleSubmitPriority = () => {
    if (!selectedPriorityId) return;
    playSuccessChime();
    setPrioritySubmitted(true);
    updatePlayerScore(120);
    markGameCompleted('mot-phut-lam-tuong');
  };

  // ==========================================
  // STATES FOR GAME 6: ĐOÁN DẤU VẾT (MYSTERY TRACE & FULLSCREEN ZOOM)
  // ==========================================
  const [traceIndex, setTraceIndex] = useState<number>(0);
  const [unlockedLayerLevel, setUnlockedLayerLevel] = useState<number>(1);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [traceRevealed, setTraceRevealed] = useState<boolean>(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState<boolean>(false);
  const [zoomShowOriginal, setZoomShowOriginal] = useState<boolean>(false);

  const currentMysteryTrace = MYSTERY_TRACES[traceIndex];

  const handleSelectCandidate = (candidate: string) => {
    if (traceRevealed) return;
    setSelectedCandidate(candidate);
    setTraceRevealed(true);
    setUnlockedLayerLevel(3); // fully unblur

    if (candidate === currentMysteryTrace.correctCandidate) {
      playSuccessChime();
      updatePlayerScore(120);
      markGameCompleted('doan-dau-vet');
    } else {
      playRadarPing();
    }
  };

  const handleNextTrace = () => {
    playCabinetClick();
    if (traceIndex < MYSTERY_TRACES.length - 1) {
      setTraceIndex((prev) => prev + 1);
      setUnlockedLayerLevel(1);
      setSelectedCandidate(null);
      setTraceRevealed(false);
      setIsZoomModalOpen(false);
      setZoomShowOriginal(false);
    } else {
      playVictoryFanfare();
      triggerTransitionTo('lobby');
    }
  };

  // Close zoom modal on ESC key
  useEffect(() => {
    if (!isZoomModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomModalOpen]);

  const markGameCompleted = (gameKey: string) => {
    setCompletedGames((prev) => {
      if (!prev.includes(gameKey)) {
        const next = [...prev, gameKey];
        try {
          localStorage.setItem('giap_trace_completed_games', JSON.stringify(next));
        } catch {}
        return next;
      }
      return prev;
    });
  };

  return (
    <div id="game-center-container" className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-4 space-y-6 pb-28">
      {/* ======================================================== */}
      {/* 0. TRANSITION OVERLAY KHI BẤM "GIẢI MÃ" (0.9s CINEMATIC) */}
      {/* Screen darkens, golden light streak, text GIẢI MÃ emerges */}
      {/* ======================================================== */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in pointer-events-auto">
          {/* Luminous light streak running horizontally */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#F59E0B] to-transparent animate-pulse shadow-[0_0_24px_#F59E0B]" />
          <div className="absolute top-1/2 left-0 w-32 h-1 bg-white blur-xs animate-[ping_0.9s_ease-out_infinite]" />

          {/* Historical/Mechanical grid texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          {/* Emblem & GIẢI MÃ text */}
          <div className="relative flex flex-col items-center text-center space-y-3 z-10 animate-in zoom-in-95 duration-400">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#991B1B] p-3 shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center border-2 border-[#D4AF37]">
              <Sparkles className="w-9 h-9 text-yellow-300 animate-spin" />
            </div>

            <h1 className="text-4xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 font-serif drop-shadow-[0_4px_12px_rgba(245,158,11,0.5)]">
              GIẢI MÃ
            </h1>

            <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-stone-300 font-bold">
              • KHỞI TẠO BƯỚC NGOẶT LỊCH SỬ •
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. LOBBY: SẢNH TRÒ CHƠI CHÍNH (6 GAME MODES ĐA DẠNG)     */}
      {/* ======================================================== */}
      {currentMode === 'lobby' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Header Banner: Tiêu đề cực lớn, phong cách Game Hub */}
          <div 
            className={`p-6 sm:p-8 rounded-3xl border-2 transition-all shadow-xl relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-[#0F2417] via-[#162E20] to-[#0A160F] border-[#D4AF37]/40 text-white' 
                : 'bg-gradient-to-br from-[#FAF5E8] via-[#F4EBD9] to-[#EFE2C8] border-[#D4AF37]/50 text-[#1F2937]'
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider bg-[#DC2626] text-white shadow-md">
                <Flame className="w-4 h-4 text-yellow-300 animate-pulse" />
                GAME HUB • GIAP TRACE
              </span>

              {/* Player Score & Personal Style Tag */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 text-yellow-300 font-mono text-xs sm:text-sm font-black border border-yellow-400/30">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>{playerScore} ĐIỂM</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#DC2626]/20 text-[#DC2626] dark:text-red-300 font-mono text-xs font-bold border border-red-500/30">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[170px]">{leadershipTag}</span>
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase font-serif text-[#0F2417] dark:text-white mt-1">
              GIẢI MÃ BẢN LĨNH
            </h1>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 font-medium mt-1 max-w-2xl leading-relaxed">
              Bạn sẽ quyết định thế nào trong những bước ngoặt lịch sử?
            </p>
          </div>

          {/* Section: 6 DẠNG TRÒ CHƠI ĐỘC LẬP THEO CƠ CHẾ KHÁC BIỆT */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F2417] dark:text-white font-serif flex items-center gap-2">
                <Award className="w-6 h-6 text-[#DC2626] dark:text-yellow-400" />
                6 THỬ THÁCH TƯƠNG TÁC
              </h2>
              <span className="text-xs font-mono font-bold text-stone-500">
                Đã mở: {completedGames.length} / 6
              </span>
            </div>

            {/* Quick Game Navigation Shortcut Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => triggerTransitionTo('mode-mystery-trace')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#355E3B]/20 border-2 border-emerald-500 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/30 whitespace-nowrap cursor-pointer shadow-xs animate-pulse"
              >
                <Eye className="w-4 h-4 text-emerald-500" />
                <span>🔍 Đoán manh mối ảnh mờ (Mới)</span>
              </button>
              <button
                onClick={() => triggerTransitionTo('mode-timeline-order')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-orange-500/15 border border-orange-500/40 text-orange-700 dark:text-orange-300 hover:bg-orange-500/25 whitespace-nowrap cursor-pointer"
              >
                <History className="w-4 h-4 text-orange-500" />
                <span>🔄 Xếp lại dòng chảy (Kéo thả 1-2-3-4)</span>
              </button>
              <button
                onClick={() => triggerTransitionTo('mode-4-answers')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500/15 border border-amber-500/40 text-amber-800 dark:text-amber-300 hover:bg-amber-500/25 whitespace-nowrap cursor-pointer"
              >
                <Zap className="w-4 h-4 text-amber-500" />
                <span>⚡ 4 Đáp án (Trắc nghiệm 2 lần)</span>
              </button>
              <button
                onClick={() => triggerTransitionTo('mode-if-you')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-red-500/15 border border-red-500/40 text-red-700 dark:text-red-300 hover:bg-red-500/25 whitespace-nowrap cursor-pointer"
              >
                <Flame className="w-4 h-4 text-red-500" />
                <span>🔥 Nếu là tôi</span>
              </button>
              <button
                onClick={() => triggerTransitionTo('mode-clue-decode')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-500/15 border border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-500/25 whitespace-nowrap cursor-pointer"
              >
                <Search className="w-4 h-4 text-blue-500" />
                <span>💡 Giải mã từ khóa</span>
              </button>
              <button
                onClick={() => triggerTransitionTo('mode-one-minute-gen')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-purple-500/15 border border-purple-500/40 text-purple-700 dark:text-purple-300 hover:bg-purple-500/25 whitespace-nowrap cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-purple-500" />
                <span>⏱️ Một phút làm tướng</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 1. 4 ĐÁP ÁN — Trắc nghiệm nhanh */}
              <div 
                className={`p-6 rounded-3xl transition-all shadow-md hover:shadow-xl group cursor-pointer ${
                  isDark
                    ? 'museum-card-dark text-[#F8FAFC]'
                    : 'museum-card-light text-[#0F172A]'
                }`}
                onClick={() => triggerTransitionTo('mode-4-answers')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-amber-500/15 text-[#B45309] dark:text-[#D4A017] border border-[#D4A017]/40">
                    01 • TRẮC NGHIỆM
                  </span>
                  <span className="text-xs font-bold text-[#B91C1C] flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    Chớp nhoáng (2 lượt)
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3">
                  4 ĐÁP ÁN
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Kiểm tra kiến thức lịch sử thực tế với 4 đáp án dạng card lớn. Được chọn tối đa 2 lần kèm manh mối gợi ý.
                </p>

                <div className="mt-5 pt-3 border-t border-stone-200/70 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">Kiến thức lịch sử chuẩn</span>
                  <button className="px-4 py-2 rounded-xl bg-[#B91C1C] text-white text-xs sm:text-sm font-bold group-hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-sm">
                    <span>GIẢI MÃ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 2. NẾU LÀ TÔI — Quyết định cá nhân (Signature Feature) */}
              <div 
                className={`p-6 rounded-3xl border-2 transition-all shadow-lg hover:shadow-2xl group cursor-pointer ${
                  isDark
                    ? 'bg-gradient-to-r from-[#1E293B] via-[#2A1E1E] to-[#1E293B] border-[#D4A017] hover:border-yellow-400 text-white shadow-xl'
                    : 'bg-gradient-to-r from-amber-50/80 via-white to-red-50/50 border-[#D4A017] hover:border-[#B91C1C] text-[#0F172A] shadow-md'
                }`}
                onClick={() => triggerTransitionTo('mode-if-you')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3.5 py-1 rounded-xl bg-[#B91C1C] text-white shadow-xs">
                    02 • TRÒ CHỦ LỰC
                  </span>
                  <span className="text-xs font-black text-[#B91C1C] dark:text-[#D4A017] flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-current" />
                    Đặc trưng nhất
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3">
                  NẾU LÀ TÔI
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Không ép buộc A/B/C/D. Tự chọn ý tưởng hành động, viết suy luận và đối chiếu với quyết định lịch sử thực tế.
                </p>

                <div className="mt-5 pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">
                    Phản hồi theo bối cảnh
                  </span>
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white text-xs sm:text-sm font-black group-hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md">
                    <span>GIẢI MÃ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3. GIẢI MÃ TỪ KHÓA LỊCH SỬ */}
              <div 
                className={`p-6 rounded-3xl transition-all shadow-md hover:shadow-xl group cursor-pointer ${
                  isDark
                    ? 'museum-card-dark text-[#F8FAFC]'
                    : 'museum-card-light text-[#0F172A]'
                }`}
                onClick={() => triggerTransitionTo('mode-clue-decode')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                    03 • TÌM TỪ KHÓA
                  </span>
                  <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                    <Search className="w-3.5 h-3.5" />
                    Gợi ý chữ
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3">
                  GIẢI MÃ TỪ KHÓA LỊCH SỬ
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Đọc các manh mối chữ để tìm ra địa danh, chiến hào, hầm chỉ huy hoặc hiện vật quân sự lịch sử.
                </p>

                <div className="mt-5 pt-3 border-t border-stone-200/70 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">Tự nhập hoặc chọn từ khóa</span>
                  <button className="px-4 py-2 rounded-xl bg-[#B91C1C] text-white text-xs sm:text-sm font-bold group-hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-sm">
                    <span>GIẢI MÃ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 4. XẾP LẠI DÒNG CHẢY (KÉO THẢ 1 2 3 4) */}
              <div 
                className={`p-6 rounded-3xl transition-all shadow-md hover:shadow-xl group cursor-pointer ${
                  isDark
                    ? 'museum-card-dark text-[#F8FAFC]'
                    : 'museum-card-light text-[#0F172A]'
                }`}
                onClick={() => triggerTransitionTo('mode-timeline-order')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                    04 • TRÌNH TỰ
                  </span>
                  <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    Kéo thả vào ô 1-2-3-4
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3">
                  XẾP LẠI DÒNG CHẢY
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Kéo thả các sự kiện lịch sử vào các khung 1, 2, 3, 4 ở trên. Hỗ trợ xếp 2 lần với manh mối dòng thời gian.
                </p>

                <div className="mt-5 pt-3 border-t border-stone-200/70 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">4 chặng then chốt</span>
                  <button className="px-4 py-2 rounded-xl bg-[#B91C1C] text-white text-xs sm:text-sm font-bold group-hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-sm">
                    <span>GIẢI MÃ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 5. MỘT PHÚT LÀM TƯỚNG */}
              <div 
                className={`p-6 rounded-3xl transition-all shadow-md hover:shadow-xl group cursor-pointer ${
                  isDark
                    ? 'museum-card-dark text-[#F8FAFC]'
                    : 'museum-card-light text-[#0F172A]'
                }`}
                onClick={() => triggerTransitionTo('mode-one-minute-gen')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                    05 • QUAN ĐIỂM
                  </span>
                  <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" />
                    Ưu tiên tối thượng
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3">
                  MỘT PHÚT LÀM TƯỚNG
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Đứng trước tình thế ngàn cân treo sợi tóc: bạn sẽ chọn ưu tiên chiến lược nào?
                </p>

                <div className="mt-5 pt-3 border-t border-stone-200/70 dark:border-slate-700/80 flex items-center justify-between">
                  <span className="text-xs font-mono text-stone-500 dark:text-slate-400">Không có đúng/sai tuyệt đối</span>
                  <button className="px-4 py-2 rounded-xl bg-[#B91C1C] text-white text-xs sm:text-sm font-bold group-hover:bg-red-800 transition-colors flex items-center gap-1.5 shadow-sm">
                    <span>GIẢI MÃ</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 6. MANH MỐI ẢNH MỜ (ĐOÁN ẢNH MỜ LỊCH SỬ) */}
              <div 
                className={`p-6 rounded-3xl border-2 transition-all shadow-lg hover:shadow-2xl group cursor-pointer relative overflow-hidden ${
                  isDark
                    ? 'bg-gradient-to-br from-[#122419] via-[#0E1F15] to-[#162E20] border-emerald-500/60 hover:border-emerald-400 text-[#F8FAFC]'
                    : 'bg-gradient-to-br from-emerald-50/90 via-white to-amber-50/50 border-emerald-500/60 hover:border-emerald-600 text-[#0F172A]'
                }`}
                onClick={() => triggerTransitionTo('mode-mystery-trace')}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-mono font-black px-3 py-1 rounded-xl bg-emerald-600 text-white shadow-xs">
                    06 • MANH MỐI ẢNH MỜ
                  </span>
                  <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 flex items-center gap-1 animate-pulse">
                    <Eye className="w-4 h-4" />
                    Bấm phóng to ảnh 🔍
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A] dark:text-white font-serif mt-3 flex items-center gap-2">
                  <span>ĐOÁN MANH MỐI ẢNH MỜ</span>
                </h3>
                <p className="text-sm sm:text-base text-stone-700 dark:text-[#CBD5E1] font-medium mt-1">
                  Bức ảnh lịch sử bị che mờ. Mở từng lớp manh mối, <strong>bấm trực tiếp vào ảnh để mở kính lúp phóng to toàn màn hình</strong> và đoán sự kiện.
                </p>

                <div className="mt-5 pt-3 border-t border-emerald-500/30 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    Bố cục 2 nửa dọc • Phóng to 100%
                  </span>
                  <button className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black group-hover:scale-105 transition-transform flex items-center gap-1.5 shadow-md">
                    <span>CHƠI NGAY</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GAME 1: 4 ĐÁP ÁN (QUICK QUIZ FACTUAL)                 */}
      {/* ======================================================== */}
      {currentMode === 'mode-4-answers' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <div className="flex items-center gap-3 font-mono text-xs sm:text-sm">
              <span className="font-bold text-stone-500">Câu {foIndex + 1}/{FOUR_OPTION_QUESTIONS.length}</span>
              <span className="font-black text-[#DC2626] dark:text-yellow-400">+{foRoundScore} ĐIỂM</span>
            </div>
          </div>

          {!foFinished ? (
            <div className="space-y-5">
              {/* Question Card & Attempt Badge */}
              <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
                    NĂM {currentFo.yearBadge}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-xs font-mono font-bold">
                    <span>LƯỢT CHỌN:</span>
                    <span className={`px-2 py-0.5 rounded-md font-black ${
                      foAttemptCount === 1 ? 'bg-amber-500 text-black' : 'bg-red-600 text-white animate-pulse'
                    }`}>
                      {foAttemptCount}/2
                    </span>
                  </div>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0F2417] dark:text-white font-serif mt-3">
                  {currentFo.question}
                </h3>
              </div>

              {/* CLUE BANNER: Displayed when attempt 1 was wrong, before attempt 2 */}
              {foShowClue && !foRevealed && (
                <div className={`p-5 rounded-2xl border-2 animate-in slide-in-from-top-3 duration-300 shadow-md ${
                  isDark ? 'bg-amber-950/40 border-amber-500/70 text-amber-100' : 'bg-amber-50 border-amber-400 text-amber-900'
                }`}>
                  <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse flex-shrink-0" />
                    <span>MANH MỐI LỊCH SỬ (DÀNH CHO LẦN CHỌN THỨ 2):</span>
                  </div>
                  <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed italic">
                    "{currentFo.clueHint}"
                  </p>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-300 mt-2">
                    💡 Bạn đã chọn chưa đúng ở lần 1. Hãy đọc kỹ manh mối trên và chọn 1 trong các đáp án còn lại!
                  </p>
                </div>
              )}

              {/* 4 LARGE Answer Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentFo.options.map((opt) => {
                  const isWrongAttempt = foWrongLetters.includes(opt.letter);
                  const isSelected = foSelectedLetter === opt.letter;
                  const isCorrect = currentFo.correctLetter === opt.letter;

                  let style = isDark 
                    ? 'bg-[#122419] border-[#2A5235] text-white hover:border-[#D4AF37]' 
                    : 'bg-white border-stone-300 text-stone-800 hover:border-[#DC2626]';

                  if (isWrongAttempt && !foRevealed) {
                    // Disabled from first wrong attempt
                    style = 'opacity-40 bg-red-950/20 border-red-500/40 text-stone-400 line-through cursor-not-allowed';
                  } else if (foRevealed) {
                    if (isCorrect) {
                      style = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/30';
                    } else if (isSelected) {
                      style = 'bg-red-600 text-white border-red-400 ring-4 ring-red-500/30';
                    } else if (isWrongAttempt) {
                      style = 'opacity-40 border-red-500/30 line-through';
                    } else {
                      style = 'opacity-40 border-stone-300 dark:border-stone-800';
                    }
                  }

                  return (
                    <button
                      key={opt.letter}
                      disabled={foRevealed || isWrongAttempt}
                      onClick={() => handleSelectFo(opt.letter)}
                      className={`p-5 rounded-2xl border-2 text-left font-bold transition-all shadow-md flex items-center justify-between gap-3.5 cursor-pointer ${style}`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-base flex-shrink-0">
                          {opt.letter}
                        </span>
                        <span className="text-base sm:text-lg leading-snug">
                          {opt.text}
                        </span>
                      </div>
                      {isWrongAttempt && !foRevealed && (
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-600/80 text-white whitespace-nowrap">
                          Sai lần 1
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback after answer */}
              {foRevealed && (
                <div className={`p-5 rounded-2xl border-2 animate-in fade-in duration-300 ${
                  foLastAttemptCorrect 
                    ? isDark ? 'bg-[#0B1710] border-emerald-500/50 text-white' : 'bg-emerald-50 border-emerald-400 text-stone-800'
                    : isDark ? 'bg-red-950/30 border-red-500/50 text-white' : 'bg-red-50 border-red-400 text-stone-800'
                }`}>
                  <div className="flex items-center gap-2">
                    {foLastAttemptCorrect ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400 uppercase">
                          {foAttemptCount === 1 ? '✓ CHÍNH XÁC NGAY LẦN ĐẦU (+100 ĐIỂM)' : '✓ CHÍNH XÁC Ở LẦN 2 NHỜ MANH MỐI (+60 ĐIỂM)'}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                        <span className="text-base font-black text-red-600 dark:text-red-400 uppercase">
                          CHƯA CHÍNH XÁC SAU 2 LẦN • ĐÁP ÁN ĐÚNG LÀ {currentFo.correctLetter}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-2 font-medium">
                    {currentFo.shortFact}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleNextFo}
                      className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                    >
                      <span>{foIndex < FOUR_OPTION_QUESTIONS.length - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Round Finished Screen */
            <div className={`p-8 rounded-3xl border-2 text-center space-y-4 shadow-xl ${isDark ? 'bg-[#0E1F15] border-[#D4AF37]/50 text-white' : 'bg-white border-amber-900/20'}`}>
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto animate-bounce" />
              <h3 className="text-2xl sm:text-3xl font-black font-serif">HOÀN THÀNH 4 ĐÁP ÁN!</h3>
              <p className="text-lg text-stone-600 dark:text-stone-300">
                Bạn đã ghi được <strong className="text-[#DC2626] dark:text-yellow-400">+{foRoundScore} Điểm</strong> bản lĩnh!
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setFoIndex(0);
                    setFoSelectedLetter(null);
                    setFoRevealed(false);
                    setFoRoundScore(0);
                    setFoFinished(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-stone-400 text-sm font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi lại</span>
                </button>
                <button
                  onClick={() => triggerTransitionTo('lobby')}
                  className="px-6 py-2.5 rounded-xl bg-[#DC2626] text-white text-sm font-black shadow-md cursor-pointer"
                >
                  Trở về Sảnh
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. GAME 2: NẾU LÀ TÔI (PERSONAL REASONING DECISION)        */}
      {/* ======================================================== */}
      {currentMode === 'mode-if-you' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-[#DC2626] dark:text-yellow-400">
              TÌNH HUỐNG {iyIndex + 1}/{IF_YOU_SCENARIOS.length}
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-xl ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
              {currentIy.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#0F2417] dark:text-white mt-3">
              {currentIy.title}
            </h2>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-200 mt-2 leading-relaxed font-medium">
              {currentIy.situation}
            </p>
          </div>

          {/* Action Ideas Selection (Not A/B/C/D) */}
          <div className="space-y-3">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-[#DC2626] dark:text-yellow-400">
              NẾU LÀ BẠN, BẠN SẼ LÀM GÌ? (CHỌN HƯỚNG HÀNH ĐỘNG):
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {currentIy.actionIdeas.map((act) => {
                const isSelected = iySelectedActionId === act.id;
                return (
                  <button
                    key={act.id}
                    disabled={iySubmitted}
                    onClick={() => {
                      playCabinetClick();
                      setIySelectedActionId(act.id);
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border-2 text-left transition-all shadow-sm cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-[#DC2626] text-white border-red-400 ring-4 ring-red-500/30'
                        : isDark
                        ? 'bg-[#122419] border-[#2A5235] text-stone-200 hover:border-[#D4AF37]'
                        : 'bg-white border-stone-300 text-stone-800 hover:border-[#DC2626]'
                    }`}
                  >
                    <span className="text-base sm:text-lg font-bold">{act.label}</span>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-lg flex-shrink-0 ${isSelected ? 'bg-black/30 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                      {act.styleTag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional: Player writes personal reasoning */}
          {!iySubmitted && (
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#DC2626]" />
                Lý do hoặc suy nghĩ thêm của bạn (không bắt buộc):
              </label>
              <textarea
                value={iyReasoningText}
                onChange={(e) => setIyReasoningText(e.target.value)}
                placeholder="Ví dụ: Tôi ưu tiên bảo toàn lực lượng vì người lính là vốn quý nhất của cách mạng..."
                rows={2}
                className="w-full p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#122419] text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
              />

              <div className="flex justify-end pt-2">
                <button
                  disabled={!iySelectedActionId}
                  onClick={handleSubmitIy}
                  className={`px-7 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all ${
                    iySelectedActionId
                      ? 'bg-[#DC2626] hover:bg-red-700 text-white cursor-pointer'
                      : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>XÁC NHẬN LỰA CHỌN</span>
                </button>
              </div>
            </div>
          )}

          {/* Contextual Feedback & Historical Revelation */}
          {iySubmitted && (
            <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-xl animate-in fade-in duration-300 ${isDark ? 'bg-[#0B1710] border-[#D4AF37]/50 text-white' : 'bg-amber-50 border-amber-300 text-stone-900'}`}>
              <div className="p-4 rounded-2xl bg-black/20 border border-stone-400/30">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 block mb-1">
                  ĐỐI CHIẾU LỰA CHỌN CỦA BẠN:
                </span>
                <p className="text-base font-bold">
                  {currentIy.actionIdeas.find(a => a.id === iySelectedActionId)?.label}
                </p>
                {iyReasoningText && (
                  <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-1">
                    "{iyReasoningText}"
                  </p>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-emerald-600/15 border border-emerald-500/40 space-y-2">
                <span className="text-xs font-mono font-black uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  QUYẾT ĐỊNH THỰC TẾ TRONG LỊCH SỬ CỦA ĐẠI TƯỚNG:
                </span>
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  {currentIy.historicalContext}
                </p>
                <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 italic pt-1 border-t border-emerald-500/20">
                  {currentIy.generalGiapChoice}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextIy}
                  className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{iyIndex < IF_YOU_SCENARIOS.length - 1 ? 'Tình huống tiếp theo' : 'Hoàn thành thử thách'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. GAME 3: GIẢI MÃ MANH MỐI (CLUE & DEDUCTION)            */}
      {/* ======================================================== */}
      {currentMode === 'mode-clue-decode' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-[#DC2626] dark:text-yellow-400">
              CÂU ĐỐ {clueIndex + 1}/{CLUE_PUZZLES.length}
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
              {currentCluePuzzle.category}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#0F2417] dark:text-white mt-3">
              {currentCluePuzzle.title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
              Đọc các manh mối để tìm ra sự kiện, nhân vật hoặc địa danh ẩn giấu.
            </p>
          </div>

          {/* Progressive Clue Cards */}
          <div className="space-y-3">
            {currentCluePuzzle.clues.slice(0, unlockedClueCount).map((clue, idx) => (
              <div 
                key={idx} 
                className={`p-4 sm:p-5 rounded-2xl border-2 animate-in slide-in-from-left duration-300 shadow-sm ${
                  isDark ? 'bg-[#122419] border-[#2A5235] text-white' : 'bg-white border-stone-300 text-stone-800'
                }`}
              >
                <span className="text-xs font-mono font-black text-[#DC2626] dark:text-yellow-400 uppercase block mb-1">
                  MANH MỐI SỐ 0{idx + 1}:
                </span>
                <p className="text-base sm:text-lg font-medium">{clue}</p>
              </div>
            ))}

            {unlockedClueCount < currentCluePuzzle.clues.length && !clueSolved && (
              <button
                onClick={handleUnlockNextClue}
                className="px-4 py-2 rounded-xl border border-[#DC2626] text-[#DC2626] dark:text-yellow-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer hover:bg-red-500/10"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Mở thêm manh mối tiếp theo ({unlockedClueCount}/{currentCluePuzzle.clues.length})</span>
              </button>
            )}
          </div>

          {/* Answer Input or Keyword Selection */}
          {!clueSolved ? (
            <div className="space-y-3 pt-2">
              <label className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
                Nhập câu trả lời của bạn:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyClueAnswer()}
                  placeholder="Ví dụ: Mường Phăng, Xe tăng 843, Hầm D67..."
                  className="flex-1 p-3.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-[#122419] text-stone-900 dark:text-white text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                />
                <button
                  onClick={() => handleVerifyClueAnswer()}
                  className="px-6 py-3.5 rounded-2xl bg-[#DC2626] hover:bg-red-700 text-white font-black text-sm sm:text-base cursor-pointer shadow-md"
                >
                  GIẢI MÃ
                </button>
              </div>

              {clueError && (
                <p className="text-xs sm:text-sm text-red-500 font-bold animate-pulse">
                  Chưa chính xác! Hãy đọc kỹ manh mối hoặc thử cụm từ ngắn gọn hơn.
                </p>
              )}
            </div>
          ) : (
            /* Solved Card with Archival Photo */
            <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-xl animate-in zoom-in-95 duration-300 ${isDark ? 'bg-[#0B1710] border-emerald-500 text-white' : 'bg-emerald-50 border-emerald-400 text-stone-900'}`}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 uppercase">
                  CHÍNH XÁC: {currentCluePuzzle.targetAnswer.toUpperCase()} (+120 ĐIỂM)
                </span>
              </div>

              <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-emerald-400/40 relative">
                <img
                  src={currentCluePuzzle.imageReveal}
                  alt={currentCluePuzzle.targetAnswer}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <p className="text-sm sm:text-base font-medium leading-relaxed">
                {currentCluePuzzle.historicalRevelation}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNextCluePuzzle}
                  className="px-6 py-2.5 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-black text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{clueIndex < CLUE_PUZZLES.length - 1 ? 'Câu tiếp theo' : 'Hoàn thành thử thách'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. GAME 4: XẾP LẠI DÒNG CHẢY (TIMELINE ORDER)            */}
      {/* ======================================================== */}
      {currentMode === 'mode-timeline-order' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-orange-500">
              THỬ THÁCH SẮP XẾP
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
                DÒNG CHẢY LỊCH SỬ • KÉO THẢ VÀO Ô
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-xs font-mono font-bold">
                <span>LẦN XẾP:</span>
                <span className={`px-2 py-0.5 rounded-md font-black ${
                  timelineAttempt === 1 ? 'bg-amber-500 text-black' : 'bg-red-600 text-white animate-pulse'
                }`}>
                  {timelineAttempt}/2
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#0F2417] dark:text-white mt-3">
              KÉO THẢ VÀO 4 Ô THEO TRÌNH TỰ THỜI GIAN
            </h2>
            <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 mt-1">
              Nhấn giữ và kéo các tình huống sự kiện ở bên dưới thả vào các ô <strong className="text-[#DC2626] dark:text-yellow-400">1, 2, 3, 4</strong> ở trên (hoặc bấm trực tiếp vào thẻ sự kiện để xếp nhanh). Bạn có tối đa 2 lần xếp.
            </p>
          </div>

          {/* SECTION 1 (TOP): 4 TARGET SLOTS (KHUNG 1, 2, 3, 4) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-[#DC2626] dark:text-yellow-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>BÀN SẮP XẾP CHÍNH (CÁC KHUNG 1 — 2 — 3 — 4):</span>
              </span>
              <span className="text-xs font-mono text-stone-500">
                Đã đặt: {placedSlots.filter(s => s !== null).length}/4 ô
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {[0, 1, 2, 3].map((slotIdx) => {
                const item = placedSlots[slotIdx];
                const isHovered = activeDropSlot === slotIdx;
                const slotTitles = [
                  'CHẶNG 01 — KHỞI ĐẦU',
                  'CHẶNG 02 — PHÁT TRIỂN',
                  'CHẶNG 03 — BƯỚC NGOẶT',
                  'CHẶNG 04 — TOÀN THẮNG'
                ];

                const isFeedbackCorrect = timelineChecked ? slotFeedback[slotIdx] : null;

                let borderStyle = isDark 
                  ? 'bg-[#122419]/70 border-[#2A5235]' 
                  : 'bg-white/80 border-stone-300';

                if (isHovered) {
                  borderStyle = 'border-amber-400 bg-amber-500/10 ring-4 ring-amber-400/30 scale-[1.01]';
                }

                if (timelineChecked && item) {
                  if (isFeedbackCorrect) {
                    borderStyle = 'bg-emerald-600/15 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/40';
                  } else {
                    borderStyle = 'bg-red-600/15 border-red-500 text-red-800 dark:text-red-200 ring-2 ring-red-500/40';
                  }
                }

                return (
                  <div
                    key={slotIdx}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = 'move';
                      if (activeDropSlot !== slotIdx) setActiveDropSlot(slotIdx);
                    }}
                    onDragLeave={() => {
                      if (activeDropSlot === slotIdx) setActiveDropSlot(null);
                    }}
                    onDrop={(e) => handleDropOnSlot(slotIdx, e)}
                    className={`min-h-[110px] sm:min-h-[125px] p-4 rounded-2xl border-2 transition-all shadow-md flex flex-col justify-between relative ${borderStyle}`}
                  >
                    {/* Header of Slot */}
                    <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                          timelineChecked && item
                            ? isFeedbackCorrect 
                              ? 'bg-emerald-600 text-white' 
                              : 'bg-red-600 text-white'
                            : isDark ? 'bg-amber-500/20 text-yellow-300' : 'bg-amber-500 text-white'
                        }`}>
                          {slotIdx + 1}
                        </span>
                        <span className="text-xs font-mono font-bold tracking-tight opacity-75">
                          {slotTitles[slotIdx]}
                        </span>
                      </div>

                      {/* Status indicator on slot */}
                      {timelineChecked && item ? (
                        <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded ${
                          isFeedbackCorrect ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                        }`}>
                          {isFeedbackCorrect ? '✓ ĐÚNG VỊ TRÍ' : '✗ CHƯA ĐÚNG'}
                        </span>
                      ) : item && !timelineChecked ? (
                        <button
                          onClick={() => handleRemoveFromSlot(slotIdx)}
                          className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-stone-500 hover:text-red-500 transition-colors cursor-pointer"
                          title="Gỡ sự kiện ra khỏi ô"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : null}
                    </div>

                    {/* Content of Slot */}
                    {item ? (
                      <div 
                        draggable={!timelineChecked}
                        onDragStart={(e) => handleDragStartItem(item.id, e)}
                        className={`pt-2.5 flex items-start justify-between gap-3 ${!timelineChecked ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      >
                        <div>
                          <h4 className="text-sm sm:text-base font-black font-serif text-[#0F2417] dark:text-white leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-xs text-stone-600 dark:text-stone-300 mt-1 line-clamp-2">
                            {item.shortDesc}
                          </p>
                          {timelineChecked && (
                            <span className="text-xs font-mono font-black text-[#DC2626] dark:text-yellow-400 mt-1 block">
                              Mốc lịch sử: Năm {item.year}
                            </span>
                          )}
                        </div>
                        {!timelineChecked && (
                          <GripVertical className="w-5 h-5 text-stone-400 flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    ) : (
                      /* Empty Slot Placeholder */
                      <div className="py-4 flex flex-col items-center justify-center text-center opacity-60">
                        <span className="text-xs font-mono font-semibold">
                          Ô {slotIdx + 1} đang trống — Thả tình huống vào đây
                        </span>
                        <span className="text-[11px] text-stone-400 mt-0.5">
                          (Hoặc bấm vào sự kiện ở dưới)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CLUE BANNER: Displayed when attempt 1 failed, encouraging attempt 2 */}
          {timelineChecked && !timelineSuccess && timelineAttempt === 1 && (
            <div className={`p-5 rounded-2xl border-2 animate-in slide-in-from-top-3 duration-300 shadow-md ${
              isDark ? 'bg-amber-950/40 border-amber-500/70 text-amber-100' : 'bg-amber-50 border-amber-400 text-amber-900'
            }`}>
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-5 h-5 text-yellow-500 animate-pulse flex-shrink-0" />
                <span>GỢI Ý CHIẾN DỊCH (CHO LẦN XẾP THỨ 2):</span>
              </div>
              <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed">
                Lần 1 chưa đúng hoàn toàn! Hãy quan sát các ô viền đỏ ở trên và sắp xếp lại theo tiến trình:
                <br />
                <span className="font-bold text-[#DC2626] dark:text-yellow-400">
                  1944 (Đội vũ trang 34 chiến sĩ) ➔ 1950 (Chiến dịch Biên giới) ➔ 1954 (Điện Biên Phủ) ➔ 1975 (Đại thắng mùa Xuân).
                </span>
              </p>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={retryTimelineSecondAttempt}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>XẾP LẠI LẦN 2 (CƠ HỘI CUỐI CÙNG)</span>
                </button>
              </div>
            </div>
          )}

          {/* SECTION 2 (BOTTOM): AVAILABLE SITUATION POOL (CÁC TÌNH HUỐNG Ô RIÊNG Ở DƯỚI) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-500" />
                <span>CÁC TÌNH HUỐNG LỊCH SỬ CHỜ SẮP XẾP ({unplacedEvents.length} sự kiện):</span>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Kéo chuột hoặc bấm trực tiếp
              </span>
            </div>

            {unplacedEvents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unplacedEvents.map((item) => (
                  <div
                    key={item.id}
                    draggable={!timelineChecked}
                    onDragStart={(e) => handleDragStartItem(item.id, e)}
                    onClick={() => handleQuickPlaceItem(item)}
                    className={`p-4 rounded-2xl border-2 transition-all shadow-sm flex items-center justify-between gap-3 cursor-grab active:cursor-grabbing hover:border-amber-400 hover:shadow-md ${
                      isDark ? 'bg-[#122419] border-[#2A5235] text-white' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mt-0.5">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black font-serif leading-snug">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-500 dark:text-stone-300 mt-1 line-clamp-2">
                          {item.shortDesc}
                        </p>
                        <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 mt-1.5 inline-block">
                          👆 Bấm để xếp vào ô trống
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl border border-dashed border-stone-400/40 text-center text-xs sm:text-sm font-mono text-stone-500">
                ✓ Đã xếp toàn bộ 4 sự kiện vào 4 ô ở trên. Hãy bấm nút "Kiểm tra trình tự" bên dưới!
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex justify-end gap-3">
            {!timelineChecked ? (
              <button
                disabled={placedSlots.some(s => s === null)}
                onClick={checkTimelineOrder}
                className="px-7 py-3 rounded-2xl bg-[#DC2626] hover:bg-red-700 disabled:opacity-40 text-white font-black text-sm sm:text-base shadow-lg cursor-pointer flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>KIỂM TRA TRÌNH TỰ (LẦN {timelineAttempt}/2)</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-between">
                <span className="text-sm font-black font-mono">
                  {timelineSuccess 
                    ? `✓ CHÍNH XÁC HOÀN TOÀN (+${timelineAttempt === 1 ? '150' : '100'} ĐIỂM)` 
                    : timelineAttempt === 1 
                    ? 'CHƯA ĐÚNG Ở LẦN 1 • BẠN CÒN 1 CƠ HỘI'
                    : 'KẾT THÚC 2 LẦN XẾP'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={resetTimelineChallenge}
                    className="px-4 py-2 rounded-xl border border-stone-400 text-xs sm:text-sm font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Làm lại từ đầu</span>
                  </button>
                  <button
                    onClick={() => triggerTransitionTo('lobby')}
                    className="px-5 py-2 rounded-xl bg-[#DC2626] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                  >
                    Về Sảnh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. GAME 5: MỘT PHÚT LÀM TƯỚNG (PRIORITY SELECTION)        */}
      {/* ======================================================== */}
      {currentMode === 'mode-one-minute-gen' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-purple-500">
              BẢN LĨNH LÃNH ĐẠO
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
              TÌNH HUỐNG CHỈ HUY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#0F2417] dark:text-white mt-3">
              MỘT PHÚT LÀM TƯỚNG
            </h2>
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-200 mt-2 leading-relaxed font-medium">
              Trong chiến tranh, mọi quyết định đều phải trả giá. Đứng trước một chiến dịch mang tính sống còn của dân tộc, bạn sẽ đặt <strong className="text-[#DC2626] dark:text-yellow-400">ƯU TIÊN TỐI THƯỢNG</strong> vào đâu?
            </p>
          </div>

          {/* 4 Priorities Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GENERAL_PRIORITIES.map((p) => {
              const isSelected = selectedPriorityId === p.id;
              return (
                <button
                  key={p.id}
                  disabled={prioritySubmitted}
                  onClick={() => {
                    playCabinetClick();
                    setSelectedPriorityId(p.id);
                  }}
                  className={`p-5 rounded-2xl border-2 text-left transition-all shadow-md cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#DC2626] text-white border-red-400 ring-4 ring-red-500/30'
                      : isDark
                      ? 'bg-[#122419] border-[#2A5235] text-stone-200 hover:border-[#D4AF37]'
                      : 'bg-white border-stone-300 text-stone-800 hover:border-[#DC2626]'
                  }`}
                >
                  <div>
                    <h3 className="text-lg sm:text-xl font-black font-serif">{p.title}</h3>
                    <p className={`text-xs sm:text-sm mt-1 italic ${isSelected ? 'text-white/90' : 'text-stone-500 dark:text-stone-400'}`}>
                      {p.subtitle}
                    </p>
                  </div>
                  <span className={`text-[11px] font-mono mt-3 px-2 py-0.5 rounded self-start ${isSelected ? 'bg-black/30 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                    Ưu tiên chiến lược
                  </span>
                </button>
              );
            })}
          </div>

          {!prioritySubmitted ? (
            <div className="flex justify-end pt-2">
              <button
                disabled={!selectedPriorityId}
                onClick={handleSubmitPriority}
                className={`px-7 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 shadow-lg transition-all ${
                  selectedPriorityId
                    ? 'bg-[#DC2626] hover:bg-red-700 text-white cursor-pointer'
                    : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <span>XÁC NHẬN BẢN LĨNH</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Perspective Feedback */
            <div className={`p-6 rounded-3xl border-2 space-y-4 shadow-xl animate-in fade-in duration-300 ${isDark ? 'bg-[#0B1710] border-[#D4AF37]/50 text-white' : 'bg-purple-50 border-purple-300 text-stone-900'}`}>
              <span className="text-xs font-mono font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 block">
                GÓC NHÌN BẢN LĨNH CỦA ĐẠI TƯỚNG VÕ NGUYÊN GIÁP:
              </span>
              <p className="text-base sm:text-lg font-medium leading-relaxed">
                {GENERAL_PRIORITIES.find(p => p.id === selectedPriorityId)?.perspectiveAnalysis}
              </p>
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => triggerTransitionTo('lobby')}
                  className="px-6 py-2.5 rounded-xl bg-[#DC2626] text-white font-black text-sm shadow-md cursor-pointer"
                >
                  Trở về Sảnh
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. GAME 6: ĐOÁN DẤU VẾT (MYSTERY TRACE WITH IMAGE BLUR)   */}
      {/* ======================================================== */}
      {currentMode === 'mode-mystery-trace' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-stone-200 dark:border-stone-800">
            <button
              onClick={() => triggerTransitionTo('lobby')}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sảnh trò chơi</span>
            </button>
            <span className="text-xs sm:text-sm font-mono font-black text-emerald-500">
              TƯ LIỆU {traceIndex + 1}/{MYSTERY_TRACES.length}
            </span>
          </div>

          <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-lg ${isDark ? 'bg-[#0E1F15] border-[#2A5235]' : 'bg-white border-amber-900/15'}`}>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black uppercase bg-[#DC2626] text-white">
                TRÒ CHƠI: ĐOÁN MANH MỐI ẢNH MỜ
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                BÍ ẨN QUÂN SỬ
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-serif text-[#0F2417] dark:text-white mt-3">
              {currentMysteryTrace.title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 mt-1">
              Bức ảnh đang bị che mờ. Hãy bấm mở từng lớp gợi ý, <strong>bấm trực tiếp vào ảnh để phóng to toàn màn hình</strong> và tìm ra đáp án chính xác!
            </p>
          </div>

          {/* TWO VERTICAL HALVES (2 NỬA DỌC) LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT HALF (NỬA TRÁI): KHUNG ẢNH TƯ LIỆU VỚI TÍNH NĂNG NHẤN ĐỂ PHÓNG TO */}
            <div className="lg:col-span-7 flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-mono font-black uppercase text-amber-500 flex items-center gap-1.5">
                  <Search className="w-4 h-4" />
                  <span>KÍNH QUAN SÁT TƯ LIỆU GỐC</span>
                </span>
                <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
                  Click để phóng to
                </span>
              </div>

              {/* Clickable Image Box - object-contain ensures photo is NEVER cropped */}
              <div 
                onClick={() => setIsZoomModalOpen(true)}
                className="group relative w-full h-[360px] sm:h-[440px] md:h-[480px] rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 bg-black/90 shadow-2xl flex items-center justify-center p-3 cursor-zoom-in transition-all hover:border-[#D4AF37] hover:ring-4 hover:ring-amber-500/20"
                title="Bấm vào ảnh để phóng to toàn màn hình chi tiết"
              >
                <img
                  src={currentMysteryTrace.image}
                  alt={currentMysteryTrace.title}
                  style={{
                    filter: `blur(${currentMysteryTrace.layers[unlockedLayerLevel - 1]?.blurAmount || 0}px)`
                  }}
                  className="max-h-full max-w-full object-contain transition-all duration-700 select-none drop-shadow-xl"
                />

                {/* Top-Left: Blur Level Badge */}
                <div className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-yellow-300 font-mono text-xs font-black border border-yellow-400/30 shadow-md">
                  ĐỘ RÕ: {unlockedLayerLevel === 1 ? 'MỜ 70%' : unlockedLayerLevel === 2 ? 'MỜ 40%' : 'RÕ 100%'}
                </div>

                {/* Top-Right: Zoom Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomModalOpen(true);
                  }}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white hover:text-yellow-300 font-mono text-xs font-bold border border-white/20 shadow-lg flex items-center gap-1.5 transition-all group-hover:scale-105"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Phóng to</span>
                </button>

                {/* Bottom Center: Hover Instruction Banner */}
                <div className="absolute bottom-3 inset-x-4 py-2 px-3 rounded-2xl bg-black/85 backdrop-blur-md border border-white/15 text-center text-xs text-stone-200 font-medium opacity-90 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Search className="w-4 h-4 text-yellow-400 animate-pulse flex-shrink-0" />
                  <span>Bấm vào ảnh để mở kính lúp phóng to toàn cảnh</span>
                </div>
              </div>
            </div>

            {/* RIGHT HALF (NỬA PHẢI): CÁC LỚP MANH MỐI & 4 LỰA CHỌN TRẢ LỜI */}
            <div className="lg:col-span-5 flex flex-col space-y-4">
              {/* Clue layers unlocked */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-black uppercase tracking-wider text-[#DC2626] dark:text-yellow-400 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4" />
                  <span>MANH MỐI ĐÃ MỞ ({unlockedLayerLevel}/3 LỚP):</span>
                </span>

                {currentMysteryTrace.layers.slice(0, unlockedLayerLevel).map((l, i) => (
                  <div 
                    key={i} 
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-medium leading-relaxed animate-in fade-in duration-200 ${
                      isDark ? 'bg-[#122419] border-[#2A5235] text-stone-200' : 'bg-white border-stone-300 text-stone-800'
                    }`}
                  >
                    {l.clueText}
                  </div>
                ))}

                {unlockedLayerLevel < 3 && !traceRevealed && (
                  <button
                    onClick={() => {
                      playCabinetClick();
                      setUnlockedLayerLevel((prev) => prev + 1);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span>Mở thêm lớp làm rõ ảnh (Lớp {unlockedLayerLevel + 1}/3)</span>
                  </button>
                )}
              </div>

              {/* Candidate Options */}
              <div className="space-y-2.5 pt-1">
                <h3 className="text-xs font-black font-mono uppercase text-[#DC2626] dark:text-yellow-400">
                  CHỌN SỰ KIỆN / TƯ LIỆU ĐƯỢC CHỤP:
                </h3>
                <div className="space-y-2">
                  {currentMysteryTrace.candidates.map((c) => {
                    const isSelected = selectedCandidate === c;
                    const isCorrect = c === currentMysteryTrace.correctCandidate;

                    let style = isDark 
                      ? 'bg-[#122419] border-[#2A5235] text-white hover:border-[#D4AF37]' 
                      : 'bg-white border-stone-300 text-stone-800 hover:border-[#DC2626]';

                    if (traceRevealed) {
                      if (isCorrect) {
                        style = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/30';
                      } else if (isSelected) {
                        style = 'bg-red-600 text-white border-red-400 ring-4 ring-red-500/30';
                      } else {
                        style = 'opacity-40 border-stone-300 dark:border-stone-800';
                      }
                    }

                    return (
                      <button
                        key={c}
                        disabled={traceRevealed}
                        onClick={() => handleSelectCandidate(c)}
                        className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer ${style}`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trace Historical Fact */}
              {traceRevealed && (
                <div className={`p-4 sm:p-5 rounded-2xl border-2 space-y-2 animate-in fade-in duration-300 shadow-lg ${
                  isDark ? 'bg-[#0B1710] border-emerald-500 text-white' : 'bg-emerald-50 border-emerald-400 text-stone-900'
                }`}>
                  <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-300 block">
                    {selectedCandidate === currentMysteryTrace.correctCandidate ? '✓ CHÍNH XÁC (+120 ĐIỂM)' : 'CHƯA CHÍNH XÁC'}
                  </span>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed">
                    {currentMysteryTrace.contextFact}
                  </p>
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleNextTrace}
                      className="px-5 py-2 rounded-xl bg-[#DC2626] hover:bg-red-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <span>{traceIndex < MYSTERY_TRACES.length - 1 ? 'Ảnh tiếp theo' : 'Hoàn thành thử thách'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LIGHTBOX FULLSCREEN ZOOM MODAL */}
          {isZoomModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-md animate-in fade-in duration-200"
              onClick={() => setIsZoomModalOpen(false)}
            >
              {/* Modal Top Bar */}
              <div 
                className="w-full max-w-5xl flex items-center justify-between pb-3 text-white border-b border-white/20"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500 text-black font-mono font-black text-xs uppercase">
                    Kính Lúp Phóng To
                  </span>
                  <h4 className="text-sm sm:text-base font-bold font-serif text-yellow-300 truncate max-w-xs sm:max-w-md">
                    {currentMysteryTrace.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomShowOriginal(prev => !prev)}
                    className="px-3 py-1.5 rounded-xl border border-white/30 hover:border-yellow-400 text-xs font-bold text-stone-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{zoomShowOriginal ? 'Bật lại độ mờ vòng thi' : 'Tạm soi ảnh nét 100%'}</span>
                  </button>

                  <button
                    onClick={() => setIsZoomModalOpen(false)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Đóng kính lúp (ESC)"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Center Image */}
              <div 
                className="my-auto py-3 max-w-5xl max-h-[75vh] flex items-center justify-center overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={currentMysteryTrace.image}
                  alt={currentMysteryTrace.title}
                  style={{
                    filter: zoomShowOriginal 
                      ? 'none' 
                      : `blur(${currentMysteryTrace.layers[unlockedLayerLevel - 1]?.blurAmount || 0}px)`
                  }}
                  className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/20 select-none transition-all duration-300"
                />
              </div>

              {/* Modal Bottom Footer */}
              <div 
                className="w-full max-w-5xl text-center text-xs text-stone-300 font-mono py-2 opacity-80"
                onClick={(e) => e.stopPropagation()}
              >
                💡 Tư liệu ảnh lịch sử gốc — Nhấn phím ESC hoặc bấm bất kỳ đâu bên ngoài để đóng lại.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
