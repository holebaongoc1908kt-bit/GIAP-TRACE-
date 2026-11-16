import { BrowsingHistoryItem, RelatedRecommendation, NavTab } from '../types';
import { TIMELINE_MILESTONES, ARCHIVE_ITEMS, MAP_LOCATIONS, INSIGHT_CARDS } from '../data/museumData';
import { DECISION_SCENARIOS, ONE_MINUTE_STORIES } from '../data/learningData';

const HISTORY_STORAGE_KEY = 'giap_trace_browsing_history_v1';
const MAX_HISTORY_ITEMS = 30;

// Khởi tạo một số mục lịch sử mặc định phong phú nếu người dùng mới vào lần đầu
const INITIAL_DEMO_HISTORY: BrowsingHistoryItem[] = [
  {
    id: 'hist-init-1',
    type: 'decision',
    itemId: 'dec-dbp-1954',
    title: 'Quyết định chuyển phương châm Điện Biên Phủ 1954',
    subtitle: 'Đánh chắc, tiến chắc - Bảo toàn lực lượng',
    category: 'Điện Biên Phủ',
    tags: ['Điện Biên Phủ', '1954', 'Bản lĩnh', 'Quân sự', 'Mường Phăng'],
    timestamp: Date.now() - 1000 * 60 * 15, // 15 phút trước
  },
  {
    id: 'hist-init-2',
    type: 'archive',
    itemId: 'arc-09-sig',
    title: 'Bút tích chữ ký gốc Đại tướng Võ Nguyên Giáp',
    subtitle: 'Trung tâm Lưu trữ Quốc gia & Bảo tàng Lịch sử Quân sự',
    category: 'Bút tích & Sắc lệnh',
    tags: ['Bút tích', 'Lưu trữ', 'Sắc lệnh', '1945'],
    timestamp: Date.now() - 1000 * 60 * 35, // 35 phút trước
  },
  {
    id: 'hist-init-3',
    type: 'milestone',
    itemId: 'm2',
    title: 'Thành lập Đội VN Tuyên truyền Giải phóng quân (1944)',
    subtitle: '34 chiến sĩ đầu tiên tại rừng Trần Hưng Đạo',
    category: 'Khai sinh Quân đội',
    tags: ['Cao Bằng', '1944', 'Quân đội', 'Trần Hưng Đạo'],
    timestamp: Date.now() - 1000 * 60 * 60, // 1 giờ trước
  }
];

/**
 * Lấy danh sách lịch sử duyệt của người dùng từ localStorage
 */
export function getBrowsingHistory(): BrowsingHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      // Lưu demo mặc định để người dùng thấy ngay trải nghiệm
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_HISTORY));
      return INITIAL_DEMO_HISTORY;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_DEMO_HISTORY;
  } catch (err) {
    console.warn('Không thể đọc lịch sử duyệt từ localStorage:', err);
    return INITIAL_DEMO_HISTORY;
  }
}

/**
 * Ghi nhận một mục vừa duyệt vào lịch sử
 */
export function recordBrowsingHistory(item: Omit<BrowsingHistoryItem, 'id' | 'timestamp'>): void {
  try {
    const current = getBrowsingHistory();
    // Lọc bỏ mục trùng nếu có để đưa lên đầu
    const filtered = current.filter(h => !(h.type === item.type && h.itemId === item.itemId));
    
    const newItem: BrowsingHistoryItem = {
      ...item,
      id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };

    const updated = [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    // Phát event cho component tự động đồng bộ nếu đang mở tab My Space
    window.dispatchEvent(new CustomEvent('giap_trace_history_updated'));
  } catch (err) {
    console.warn('Không thể lưu lịch sử duyệt:', err);
  }
}

/**
 * Xóa toàn bộ lịch sử duyệt
 */
export function clearBrowsingHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('giap_trace_history_updated'));
  } catch (err) {
    console.warn('Lỗi khi xóa lịch sử duyệt:', err);
  }
}

/**
 * Thuật toán phân tích sở thích & sinh đề xuất cá nhân hóa
 * Dựa trên tần suất từ khóa, chủ đề (Điện Biên Phủ, 1944, Bút tích, v.v.), loại hình đã xem
 */
export function generateSmartRecommendations(history: BrowsingHistoryItem[]): RelatedRecommendation[] {
  if (!history || history.length === 0) {
    history = INITIAL_DEMO_HISTORY;
  }

  // 1. Thu thập điểm số sở thích chủ đề (Interest Tags Weighting)
  const tagScores: Record<string, number> = {};
  const viewedItemIds = new Set<string>();

  history.forEach((h, index) => {
    // Trọng số giảm dần theo độ cũ (gần đây được điểm cao hơn)
    const recencyWeight = Math.max(1, 5 - index * 0.3);
    viewedItemIds.add(`${h.type}:${h.itemId}`);

    if (h.tags && h.tags.length > 0) {
      h.tags.forEach(t => {
        const lower = t.toLowerCase();
        tagScores[lower] = (tagScores[lower] || 0) + recencyWeight;
      });
    }

    if (h.category) {
      const lower = h.category.toLowerCase();
      tagScores[lower] = (tagScores[lower] || 0) + recencyWeight * 1.5;
    }
  });

  const recommendations: RelatedRecommendation[] = [];

  // Helper tính độ trùng khớp
  const calculateMatch = (textPool: string[], tags: string[] = []): { score: number; matchedReason: string } => {
    let score = 30; // Điểm nền tảng
    const matchedKeywords: string[] = [];

    const allCandidateWords = [...textPool, ...tags].join(' ').toLowerCase();

    Object.entries(tagScores).forEach(([tag, weight]) => {
      if (allCandidateWords.includes(tag)) {
        score += weight * 8;
        if (!matchedKeywords.includes(tag)) {
          matchedKeywords.push(tag);
        }
      }
    });

    const primaryReason = matchedKeywords.length > 0
      ? `Liên quan đến chủ đề "${matchedKeywords.slice(0, 2).join('", "')}" bạn vừa khám phá`
      : 'Gợi ý tiêu biểu cho hành trình bản lĩnh';

    return {
      score: Math.min(99, Math.round(score)),
      matchedReason: primaryReason
    };
  };

  // 2. Đề xuất từ KHO TƯ LIỆU SỐ (ARCHIVES)
  ARCHIVE_ITEMS.forEach(arc => {
    if (viewedItemIds.has(`archive:${arc.id}`)) return;

    const { score, matchedReason } = calculateMatch(
      [arc.title, arc.details, arc.source],
      [arc.type, arc.yearPlaceholder]
    );

    if (score >= 45) {
      recommendations.push({
        id: `rec-arc-${arc.id}`,
        targetType: 'archive',
        targetTab: 'archives',
        targetId: arc.id,
        title: arc.title,
        reason: matchedReason,
        matchScore: score,
        category: `Tư liệu (${arc.type === 'document' ? 'Tài liệu' : arc.type === 'artifact' ? 'Hiện vật' : 'Hình ảnh'})`,
        image: arc.thumbnail,
        actionText: 'Mở xem tư liệu gốc',
      });
    }
  });

  // 3. Đề xuất từ DÒNG DẤU MỐC LỊCH SỬ (TIMELINE)
  TIMELINE_MILESTONES.forEach(m => {
    if (viewedItemIds.has(`milestone:${m.id}`)) return;

    const { score, matchedReason } = calculateMatch(
      [m.title, m.shortDesc, m.fullDesc, m.location, m.courageLesson],
      [m.year, m.period]
    );

    if (score >= 40) {
      recommendations.push({
        id: `rec-m-${m.id}`,
        targetType: 'milestone',
        targetTab: 'timeline',
        targetId: m.id,
        title: `${m.year}: ${m.title}`,
        reason: matchedReason,
        matchScore: score,
        category: 'Dấu mốc Hành trình',
        image: m.image,
        actionText: 'Đến dấu mốc thời gian',
      });
    }
  });

  // 4. Đề xuất từ GIẢI MÃ BẢN LĨNH & TÌNH THẾ QUYẾT ĐỊNH (DECISIONS)
  DECISION_SCENARIOS.forEach(ds => {
    if (viewedItemIds.has(`decision:${ds.id}`)) return;

    const { score, matchedReason } = calculateMatch(
      [ds.title, ds.event, ds.context, ds.problem, ds.reflectionLesson],
      [ds.year, 'bản lĩnh', 'quyết định']
    );

    if (score >= 40) {
      recommendations.push({
        id: `rec-ds-${ds.id}`,
        targetType: 'decision',
        targetTab: 'decisions',
        targetId: ds.id,
        title: ds.title,
        reason: matchedReason,
        matchScore: score,
        category: 'Giải mã Bản lĩnh',
        actionText: 'Khám phá bối cảnh quyết định',
      });
    }
  });

  // 5. Đề xuất từ GÓC NHÌN & KÝ ỨC DUNG DỊ (INSIGHTS)
  INSIGHT_CARDS.forEach(ins => {
    if (viewedItemIds.has(`insight:${ins.id}`)) return;

    const { score, matchedReason } = calculateMatch(
      [ins.title, ins.briefExcerpt, ins.curatorNote],
      [ins.category]
    );

    if (score >= 38) {
      recommendations.push({
        id: `rec-ins-${ins.id}`,
        targetType: 'insight',
        targetTab: 'insights',
        targetId: ins.id,
        title: ins.title,
        reason: matchedReason,
        matchScore: score,
        category: ins.category,
        image: ins.image,
        actionText: 'Đọc chi tiết (1 phút)',
      });
    }
  });

  // 6. Đề xuất BẢN ĐỒ TỌA ĐỘ CHIẾN TÍCH (MAP)
  MAP_LOCATIONS.forEach(loc => {
    if (viewedItemIds.has(`map_location:${loc.id}`)) return;

    const { score, matchedReason } = calculateMatch(
      [loc.name, loc.region, loc.shortDesc],
      loc.tags
    );

    if (score >= 42) {
      recommendations.push({
        id: `rec-loc-${loc.id}`,
        targetType: 'map',
        targetTab: 'map',
        targetId: loc.id,
        title: `Tọa độ: ${loc.name} (${loc.region})`,
        reason: matchedReason,
        matchScore: score,
        category: 'Tọa độ Lịch sử',
        image: loc.image,
        actionText: 'Xem trên sa bàn số',
      });
    }
  });

  // Sắp xếp theo matchScore giảm dần
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  // Nếu ít hơn 4 gợi ý, lấy bổ sung các mục đặc sắc nhất
  if (recommendations.length < 4) {
    const fallbackArchive = ARCHIVE_ITEMS[0];
    if (fallbackArchive && !recommendations.some(r => r.targetId === fallbackArchive.id)) {
      recommendations.push({
        id: 'rec-fallback-1',
        targetType: 'archive',
        targetTab: 'archives',
        targetId: fallbackArchive.id,
        title: fallbackArchive.title,
        reason: 'Tư liệu quý được nhiều người đọc quan tâm nhất',
        matchScore: 85,
        category: 'Tư liệu Số',
        image: fallbackArchive.thumbnail,
        actionText: 'Mở xem tư liệu gốc',
      });
    }
  }

  return recommendations.slice(0, 6);
}
