/**
 * CẤU TRÚC HÌNH ẢNH BẢO TÀNG SỐ - GIAP TRACE
 * Toàn bộ ảnh được quản lý tập trung tại đây.
 * Dễ dàng thay thế bằng ảnh tư liệu lịch sử thật khi có kiểm định.
 */

export interface ImageAsset {
  id: string;
  url: string;
  title: string;
  captionPlaceholder: string;
  creditPlaceholder: string;
}

export const ASSET_PATHS = {
  // Ảnh Đại tướng Võ Nguyên Giáp trên nền cờ Tổ quốc đỏ sao vàng
  HERO_FLAG_GENERAL: '/assets/images/flag_general_hero_1789877465162.jpg',
  
  // Ảnh chân dung Đại tướng Võ Nguyên Giáp cười dung dị, góc rộng thấy huân chương trên ngực áo, không đội mũ
  PORTRAIT_GENERAL: '/assets/images/general_giap_medals_square_1789890356568.jpg',
  
  // Nền Splash Bảo tàng số
  SPLASH_BACKGROUND: '/assets/images/flag_general_hero_1789877465162.jpg',

  // Ảnh bảo tàng số - xe tăng 843 trong sảnh bảo tàng
  MUSEUM_TANK_HALL: '/assets/images/museum_tank_hall_1789877482333.jpg',

  // Ảnh sĩ quan diễn tập thuyết minh bản đồ tác chiến
  TACTICAL_BRIEFING_MAP: '/assets/images/tactical_briefing_map_1789877546424.jpg',

  // Ảnh Quân đội Nhân dân Việt Nam oai hùng
  VIETNAM_PEOPLES_ARMY: '/assets/images/vietnam_peoples_army_1789877565340.jpg',

  // Bản đồ tác chiến chiến dịch
  CAMPAIGN_MAP: '/assets/images/campaign_map_tactical.jpg',

  // Ảnh poster "Đại tướng Võ Nguyên Giáp - Dấu son từ cội nguồn cách mạng" (Ký ức huyền thoại & triết lý vì dân)
  INSIGHTS_GENERAL_ORIGIN: '/assets/images/giap_origin_insights_1789891318216.jpg',
  GIAP_ORIGIN_INSIGHTS: '/assets/images/giap_origin_insights_1789891318216.jpg',

  // Ảnh trắng đen chiến sĩ xung trận khói lửa (Đấu trường trí tuệ & thao trường)
  CHALLENGES_COMBAT_BW: '/assets/images/soldiers_combat_bw_1789891334717.jpg',

  // Logo GIAP TRACE - Dấu chân Đại tướng (Avatar chính thức của trợ lý)
  GIAP_TRACE_LOGO: '/assets/images/giap_trace_logo_1789892511251.jpg',

  // Ảnh tư liệu lịch sử bổ sung chuẩn xác
  GIAP_SIGNATURE: '/assets/images/giap_signature_doc_1790057044097.jpg',
  GIAP_SIGNATURE_AUTHENTIC: '/assets/images/giap_signature_authentic.svg',
  GIAP_WITH_UNCLE_HO: '/assets/images/giap_with_uncle_ho_1790057066944.jpg',
  GIAP_DECREE_1945: '/assets/images/giap_decree_1945_1790057086547.jpg',
  GIAP_SENIOR_UNIFORM: '/assets/images/giap_senior_uniform_1790057107137.jpg',
  GIAP_MEMORIAL_ALTAR: '/assets/images/giap_memorial_altar_1790057151794.jpg',

  // Bộ ảnh tư liệu lịch sử độc bản không trùng lặp (17 ảnh di sản)
  GIAP_REVIEW_TROOPS: '/assets/images/giap_review_troops_1790319939265.jpg',
  GIAP_PROVISIONAL_GOV: '/assets/images/giap_provisional_gov_1790319952464.jpg',
  GIAP_DEER_TEAM: '/assets/images/giap_deer_team_1790319965248.jpg',
  GIAP_FAMILY_PORTRAIT: '/assets/images/giap_family_portrait_1790319982315.jpg',
  GIAP_CONDAO_GUILLOTINE: '/assets/images/giap_condao_guillotine_1790319993880.jpg',
  GIAP_COMMEMORATIVE_PLATE: '/assets/images/giap_commemorative_plate_1790320005586.jpg',
  GIAP_MEETING_1946: '/assets/images/giap_meeting_1946_1790320019102.jpg',
  GIAP_SENIOR_SPEAKING: '/assets/images/giap_senior_speaking_1790320033644.jpg',
  GIAP_PORTRAIT_OFFICIAL: '/assets/images/general_vo_nguyen_giap_portrait_1789889827160.jpg',
  GIAP_PORTRAIT_WARM: '/assets/images/general_vo_nguyen_giap_portrait_likeness_1789890142145.jpg',
  MUSEUM_SPLASH_BG: '/assets/images/museum_splash_bg_1789876662810.jpg',

  // 7 Ảnh tư liệu bổ sung mới nhất do người dùng cung cấp
  GIAP_BIRTHPLACE_ROOM: '/assets/images/giap_birthplace_room_1790321178925.jpg',
  GIAP_ANCESTRAL_ALTAR: '/assets/images/giap_ancestral_altar_1790321191487.jpg',
  GIAP_HOUSE_CABINET: '/assets/images/giap_house_cabinet_1790321201277.jpg',
  GIAP_BRONZE_BUST: '/assets/images/giap_bronze_bust_1790321213814.jpg',
  GIAP_HANOI_FLAG_REVIEW: '/assets/images/giap_hanoi_flag_review_1790321226200.jpg',
  GIAP_WARM_SMILE_UNIFORM: '/assets/images/giap_warm_smile_uniform_1790321237395.jpg',
  GIAP_GOLDEN_BUST_DIENBIEN: '/assets/images/giap_golden_bust_dienbien_1790321249666.jpg',

  // 5 Ảnh tư liệu lịch sử chuyên đề mới bổ sung độc bản
  GIAP_MUONG_PHANG_HQ: '/assets/images/giap_muong_phang_hq_1790321420287.jpg',
  D67_BUNKER_COMMAND: '/assets/images/d67_bunker_command_1790321434308.jpg',
  DIEN_BIEN_FLAG_WIN: '/assets/images/dien_bien_flag_win_1790321448552.jpg',
  GIAP_WITH_YOUTH: '/assets/images/giap_with_youth_1790321463059.jpg',
  GIAP_YOUNG_SCHOLAR: '/assets/images/giap_young_scholar_1790322297398.jpg',

  // Placeholder theo chủ đề bảo tàng số
  PLACEHOLDER_CANVAS: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
  PLACEHOLDER_DOCUMENT: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80',
  PLACEHOLDER_ARTIFACT: 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&auto=format&fit=crop&q=80',
  PLACEHOLDER_HEADQUARTERS: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
  PLACEHOLDER_NATURE: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  PLACEHOLDER_PHOTO: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
};

export const FALLBACK_IMAGE = '/assets/images/flag_general_hero_1789877465162.jpg';
