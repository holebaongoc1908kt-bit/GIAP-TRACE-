/**
 * GIAP TRACE - Type Definitions
 * Hệ thống kiểu dữ liệu bảo tàng số tương tác
 */

export type ThemeMode = 'light' | 'dark';

export type NavTab = 
  | 'home'             // 1. Trang chủ
  | 'search'           // Mục Tra cứu & Tìm kiếm toàn diện riêng biệt
  | 'timeline'         // 2. Hành trình (Dòng thời gian + Bản đồ)
  | 'map'              // Bản đồ tọa độ
  | 'decisions'        // 3. Giải mã (Bản lĩnh + Quyết định + Góc nhìn + Nếu là tôi + Quiz)
  | 'campaign'         // Tác chiến
  | 'archives'         // 4. Tư liệu (Kho tư liệu + Kiểm chứng + AI Sử gia)
  | 'radar'            // ◉ RADAR TÁC CHIẾN MẬT LỆNH (Mục riêng cạnh Tư liệu)
  | 'biography'        // Mục Hồ sơ & Tiểu sử Võ Nguyên Giáp (Cổ điển, chữ ký, mũi tên trẻ tới già)
  | 'recommendations'  // Phần Gợi ý tư liệu & bài viết riêng biệt ở trên cao
  | 'my-space'         // 5. Của tôi (Nhật ký + Huy hiệu + Khảo sát trước/sau)
  | 'settings'         // Cài đặt cạnh của tôi để đổi chế độ sáng, ngôn ngữ Anh/Việt
  // Các sub-view tương thích
  | 'challenges'   
  | 'insights';    

// Dòng chảy cuộc đời cải tiến (Yêu cầu 3)
export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  shortDesc: string; // Tối đa 2 dòng
  fullDesc: string;  // Mô tả ngắn gọn
  image: string;
  location: string;
  period: string;
  roleOfGeneral: string;     // Vai trò của Đại tướng
  memorablePoint: string;    // "Điều đáng nhớ"
  courageLesson: string;     // "Bài học bản lĩnh"
  relatedArchiveIds: string[];
}

// 4. "ĐẰNG SAU MỘT QUYẾT ĐỊNH"
export interface HistoricalDecisionScenario {
  id: string;
  title: string;
  event: string;
  year: string;
  context: string;
  problem: string;
  challenges: string[];
  options: {
    id: string;
    text: string;
    analysis: string;
  }[];
  actualDecision: string;
  historicalOutcome: string;
  reflectionLesson: string;
}

// 5. "GIẢI MÃ BẢN LĨNH"
export type CouragePillarType = 
  | 'thinking'       // Tư duy
  | 'will'           // Ý chí
  | 'learning'       // Khả năng học hỏi
  | 'decision'       // Khả năng ra quyết định
  | 'responsibility' // Tinh thần trách nhiệm
  | 'adaptation'     // Khả năng thích ứng
  | 'vision'         // Tầm nhìn
  | 'community';     // Tinh thần vì cộng đồng

export interface CouragePillar {
  id: CouragePillarType;
  title: string;
  iconName: string;
  definition: string;
  concreteEvents: {
    eventName: string;
    year: string;
    manifestation: string;
    quoteOrEvidence: string;
  }[];
  studentTakeaway: string;
}

// 6. "MỘT SỰ KIỆN – NHIỀU GÓC NHÌN"
export interface MultiPerspectiveEvent {
  id: string;
  title: string;
  historicalContext: string;
  commanderView: string;
  soldierView: string;
  citizenView: string;
  vietnamSignificance: string;
  youthLesson: string;
}

// 10. "NẾU LÀ TÔI?" (Mô phỏng tình huống)
export interface IfItWereMeSimulation {
  id: string;
  title: string;
  context: string;
  dilemma: string;
  choices: {
    id: string;
    label: string;
    reflection: string;
  }[];
  historicalTieIn: {
    event: string;
    year: string;
    howGiapHandled: string;
    coreValue: string;
  };
}

// 11. NHẬT KÝ KHÁM PHÁ
export interface LearningJournalEntry {
  id: string;
  date: string;
  impressiveEvent: string;
  newKnowledge: string;
  qualityToLearn: string;
  wantToExploreMore: string;
}

// 12. HUY HIỆU KHÁM PHÁ
export interface DiscoveryBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'timeline' | 'archive' | 'courage' | 'quiz' | 'journal';
}

// 13. "MỘT PHÚT LỊCH SỬ"
export interface OneMinuteHistoryCard {
  id: string;
  category: 'Sự kiện' | 'Nhân vật' | 'Địa điểm' | 'Tư liệu' | 'Bài học';
  title: string;
  shortSummary: string; // Đọc trong 1 phút
  quoteOrHighlight: string;
  sourceRef: string;
}

// 14. KHU VỰC “KIỂM CHỨNG”
export interface VerificationSource {
  id: string;
  subjectTitle: string;
  sourceDocName: string;
  publisherOrAuthor: string;
  publicationYear?: string;
  verifiedContent: string;
  verificationQuote: string;
  archiveLink?: string;
}

// 15 & 16. KHẢO SÁT NHẬN THỨC & TRƯỚC - SAU
export interface PerceptionSurveyData {
  preExperience: {
    knowledgeLevel: number;    // 1-5
    interestLevel: number;     // 1-5
    memoryMilestones: number;  // 1-5
    courageAwareness: number;  // 1-5
  };
  postExperience: {
    knowledgeLevel: number;    // 1-5
    interestLevel: number;     // 1-5
    memoryMilestones: number;  // 1-5
    courageAwareness: number;  // 1-5
    favoriteMethod: string;
    keyGrowthReflection: string;
  };
  isPreCompleted: boolean;
  isPostCompleted: boolean;
}

// Dòng chảy cuộc đời
export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  shortDesc: string; // Tối đa 2 dòng
  fullDesc: string;  // Mô tả ngắn gọn
  image: string;
  location: string;
  period: string;
  relatedArchiveIds: string[];
}

// Dấu chân lịch sử (Bản đồ tương tác)
export interface MapLocation {
  id: string;
  name: string;
  region: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  mapCoordinates: {
    x: number; // Tỉ lệ phần trăm trên bản đồ (0-100)
    y: number; // Tỉ lệ phần trăm trên bản đồ (0-100)
  };
  associatedYear: string;
  milestoneId?: string;
  tags: string[];
}

// Giải mã chiến dịch (Trung tâm chỉ huy)
export interface CampaignStage {
  id: string;
  code: string;
  title: string;
  timeframe: string;
  brief: string;
  tacticalPoints: string[];
  keyDecision: string;
}

export interface CampaignData {
  id: string;
  name: string;
  strategicParadigm: {
    initial: {
      title: string;
      description: string;
    };
    revised: {
      title: string;
      description: string;
      historicalSignificance: string;
    };
  };
  stages: CampaignStage[];
  commandBrief: string;
}

// Kho tư liệu số
export type ArchiveType = 'image' | 'document' | 'map' | 'artifact' | 'video';

export interface ArchiveItem {
  id: string;
  title: string;
  type: ArchiveType;
  source: string; // Nguồn dữ liệu mẫu
  thumbnail: string;
  details: string;
  catalogNumber: string;
  yearPlaceholder: string;
}

// Góc chưa biết
export interface InsightCard {
  id: string;
  title: string;
  briefExcerpt: string; // Tối đa 50 từ theo yêu cầu
  image: string;
  category: string;
  readTime: string;
  curatorNote: string;
}

// Thử thách lịch sử
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchPairItem {
  id: string;
  leftTitle: string;
  rightMatch: string;
}

export interface TimelineOrderMilestone {
  id: string;
  title: string;
  placeholderYear: string;
  correctIndex: number;
}

// Trợ lý AI: Hỏi Dấu Chân
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// Lịch sử duyệt & Gợi ý đề xuất cá nhân hóa
export interface BrowsingHistoryItem {
  id: string;
  type: 'milestone' | 'archive' | 'decision' | 'insight' | 'map_location';
  itemId: string;
  title: string;
  subtitle?: string;
  category?: string;
  tags?: string[];
  image?: string;
  timestamp: number;
}

export interface RelatedRecommendation {
  id: string;
  targetType: 'milestone' | 'archive' | 'decision' | 'insight' | 'map';
  targetTab: NavTab;
  targetId?: string;
  title: string;
  reason: string;
  matchScore: number;
  category: string;
  image?: string;
  actionText: string;
}
