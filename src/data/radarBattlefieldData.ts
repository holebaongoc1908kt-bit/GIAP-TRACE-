import { RadarPOI } from '../types/radar3d';

export const DIEN_BIEN_PHU_POIS: RadarPOI[] = [
  {
    id: 'ham_de_castries',
    name: 'Hầm Đờ Cát-xơ-ri',
    shortName: 'Hầm Đờ Cát',
    frenchName: 'PC GONO - De Castries',
    category: 'bunker',
    subSector: 'Phân khu Trung tâm',
    elevation: '~ 480 m',
    constructionDate: 'Đầu năm 1954',
    forces: 'Tập đoàn cứ điểm Pháp',
    coordinates: { x: -8, y: 1.2, z: 4 },
    mapPercent: { x: 38, y: 58 },
    thumbnail: '/assets/aistudio/image_0a97384e.png',
    gallery: [
      {
        url: '/assets/aistudio/image_0a97384e.png',
        caption: 'Bên trong hầm chỉ huy: Bàn làm việc và bản đồ tác chiến của De Castries',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/aistudio/image_ea43dd9f.png',
        caption: 'Lối vào hầm vòm thép lượn sóng kiên cố và hào cát sâu bảo vệ',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/aistudio/image_d9cc4d90.png',
        caption: 'Mái che bảo tồn di tích hầm tướng De Castries',
        tag: 'Hiện trạng di tích'
      }
    ],
    description: 'Nơi ở và làm việc của tướng Christian de Castries, Tổng chỉ huy tập đoàn cứ điểm Điện Biên Phủ, được bao bọc bởi vòm thép lượn sóng và hàng ngàn bao cát kiên cố.',
    historicalSignificance: 'Vào lúc 17h30 ngày 07/05/1954, tổ xung kích của ta xông vào bắt sống tướng De Castries cùng ban tham mưu, toàn thắng 56 ngày đêm chiến dịch.',
    historicalQuote: '“Tôi xin đầu hàng không điều kiện. Tôi khâm phục lòng quả cảm và tài thao lược của Đại tướng Võ Nguyên Giáp.” — Tướng De Castries',
    status1954: 'Bị đánh chiếm lúc 17h30 ngày 07/05/1954'
  },
  {
    id: 'doi_a1',
    name: 'Đồi A1',
    shortName: 'Đồi A1',
    frenchName: 'Éliane 2',
    category: 'hill',
    subSector: 'Phân khu Trung tâm',
    elevation: '~ 493 m',
    constructionDate: 'Cuối năm 1953',
    forces: 'Bán lữ đoàn Lê dương 13 (13e DBLE)',
    coordinates: { x: 5, y: 2.5, z: -2 },
    mapPercent: { x: 58, y: 38 },
    thumbnail: '/assets/aistudio/image_35bb7042.png',
    gallery: [
      {
        url: '/assets/aistudio/image_35bb7042.png',
        caption: 'Đỉnh đồi A1 với hố bộc phá nghìn cân và hệ thống chiến hào vây lấn',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp',
        caption: 'Chiến sĩ xung kích cắm cờ chiến thắng làm chủ trận địa',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Cứ điểm then chốt bảo vệ phân khu trung tâm Mường Thanh, được Pháp trang bị hệ thống hầm ngầm bê tông cốt thép nhiều tầng kiên cố bậc nhất.',
    historicalSignificance: 'Sau 39 ngày đêm giằng co khốc liệt, đêm 06/05/1954 tiếng nổ khối bộc phá nghìn cân đã xé toạc sườn đồi, mở đường giải phóng đồi A1 rạng sáng 07/05.',
    historicalQuote: '“Khối thuốc nổ gần một tấn dưới lòng đồi A1 đã làm rung chuyển lòng chảo Mường Thanh, mở toang cánh cửa vào sào huyệt cuối cùng.”',
    status1954: 'Giải phóng rạng sáng ngày 07/05/1954'
  },
  {
    id: 'him_lam',
    name: 'Him Lam',
    shortName: 'Him Lam',
    frenchName: 'Béatrice',
    category: 'stronghold',
    subSector: 'Phân khu Bắc',
    elevation: '~ 510 m',
    constructionDate: 'Cuối năm 1953',
    forces: 'Tiểu đoàn 3 Lê dương 13 (3/13e DBLE)',
    coordinates: { x: 18, y: 3.2, z: -10 },
    mapPercent: { x: 74, y: 22 },
    thumbnail: '/assets/aistudio/image_dc5a9c43.png',
    gallery: [
      {
        url: '/assets/aistudio/image_dc5a9c43.png',
        caption: 'Mặt trận Điện Biên Phủ tấn công cứ điểm Him Lam - Độc Lập',
        tag: 'Tư liệu lịch sử'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/vietnam_peoples_army_1789877565340.webp',
        caption: 'Bộ đội ta đồng loạt xung phong mở màn chiến dịch chiều 13/03/1954',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Cụm cứ điểm đột xuất án ngữ cửa ngõ Đông Bắc Điện Biên Phủ, khống chế đường Tuần Giáo vào thung lũng, từng được Pháp coi là pháo đài bất khả xâm phạm.',
    historicalSignificance: 'Trận mở màn chiến dịch chiều 13/03/1954. Anh hùng Phan Đình Giót lấy thân mình lấp lỗ châu mai, quân ta tiêu diệt hoàn toàn cứ điểm chỉ sau vài giờ.',
    historicalQuote: '“Trận đánh mở màn Him Lam là đòn sấm sét giáng vào tinh thần quân viễn chinh Pháp.”',
    status1954: 'Tiêu diệt lúc 23h30 ngày 13/03/1954 (Mở màn đợt 1)'
  },
  {
    id: 'doc_lap',
    name: 'Độc Lập',
    shortName: 'Độc Lập',
    frenchName: 'Gabrielle',
    category: 'stronghold',
    subSector: 'Phân khu Bắc',
    elevation: '~ 530 m',
    constructionDate: 'Tháng 12/1953',
    forces: 'Tiểu đoàn 5 Trung đoàn Bộ binh Algeria số 7 (5/7e RTA)',
    coordinates: { x: -6, y: 3.8, z: -16 },
    mapPercent: { x: 44, y: 14 },
    thumbnail: '/assets/aistudio/image_f4dcf6e7.png',
    gallery: [
      {
        url: '/assets/aistudio/image_f4dcf6e7.png',
        caption: 'Hỏa lực pháo binh Điện Biên Phủ tập trung chi viện hạ cứ điểm Độc Lập',
        tag: 'Tư liệu lịch sử'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/campaign_map_tactical.webp',
        caption: 'Thế trận bao vây của Đại đoàn 308 và 312 siết chặt đồi Độc Lập',
        tag: 'Bản đồ chiến sự'
      }
    ],
    description: 'Cứ điểm Độc Lập nằm trên ngọn đồi dài khoảng 700 mét ở phía Bắc lòng chảo, được mệnh danh là "con mắt bảo vệ" của tập đoàn cứ điểm, khống chế hướng tiến công từ Lai Châu xuống.',
    historicalSignificance: 'Đêm 14 rạng sáng 15/3/1954, Đại đoàn 308 và 312 hiệp đồng tác chiến tấn công Độc Lập. Hỏa lực lựu pháo 105mm chính xác đã áp chế pháo binh địch, tiêu diệt toàn bộ cứ điểm sau những giờ chiến đấu quả cảm.',
    historicalQuote: '“Mất Độc Lập, viên chỉ huy pháo binh Pháp Piroth nhận ra sai lầm chết người và tự sát trong hầm pháo.”',
    status1954: 'Giải phóng sáng ngày 15/03/1954'
  },
  {
    id: 'ban_keo',
    name: 'Bản Kéo',
    shortName: 'Bản Kéo',
    frenchName: 'Anne-Marie',
    category: 'stronghold',
    subSector: 'Phân khu Bắc',
    elevation: '~ 465 m',
    constructionDate: 'Tháng 12/1953',
    forces: 'Tiểu đoàn Thái số 3 (3e BTL)',
    coordinates: { x: -18, y: 1.8, z: -6 },
    mapPercent: { x: 26, y: 32 },
    thumbnail: '/assets/aistudio/image_9d059f57.png',
    gallery: [
      {
        url: '/assets/aistudio/image_9d059f57.png',
        caption: 'Chiến hào tiếp cận bao vây cứ điểm Bản Kéo',
        tag: 'Tư liệu lịch sử'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/tactical_briefing_map_1789877546424.webp',
        caption: 'Binh vận sắc bén làm tan rã toàn bộ binh lính địch tại Bản Kéo',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Cứ điểm Bản Kéo nằm ở Tây Bắc lòng chảo, bảo vệ sân bay phụ Bản Kéo và khống chế con đường mòn về phía Lai Châu.',
    historicalSignificance: 'Ngày 17/3/1954, sau thắng lợi tại Him Lam và Độc Lập, bằng công tác binh vận sắc bén của ta, toàn bộ binh lính ngụy Thái tại Bản Kéo đã buông súng đầu hàng tập thể, mở toang toàn bộ cánh cửa phía Bắc Điện Biên Phủ.',
    historicalQuote: '“Bản Kéo tan rã không tốn một viên đạn — thắng lợi tuyệt vời của chiến thuật kết hợp quân sự và chính trị binh vận.”',
    status1954: 'Đầu hàng tập thể ngày 17/03/1954'
  },
  {
    id: 'muong_phang',
    name: 'Sở chỉ huy Mường Phăng',
    shortName: 'Mường Phăng',
    frenchName: 'Bộ Chỉ huy Chiến dịch',
    category: 'hq',
    subSector: 'Đại bản doanh',
    elevation: '~ 980 m',
    constructionDate: 'Tháng 01/1954',
    forces: 'Bộ Chỉ huy Chiến dịch Điện Biên Phủ',
    coordinates: { x: 26, y: 5.5, z: 2 },
    mapPercent: { x: 68, y: 46 },
    thumbnail: '/assets/aistudio/image_2f0495f9.png',
    gallery: [
      {
        url: '/assets/aistudio/image_2f0495f9.png',
        caption: 'Lán làm việc đơn sơ lợp tranh tre của Đại tướng Võ Nguyên Giáp dưới tán rừng cổ thụ',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/giap_muong_phang_hq_1790321420287.webp',
        caption: 'Cửa hầm xuyên núi dài 69m nối liền lán Đại tướng với lán Tham mưu trưởng',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_1789889827160.webp',
        caption: 'Đại tướng Võ Nguyên Giáp — Tổng tư lệnh chiến dịch Điện Biên Phủ',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Đại bản doanh Bộ Chỉ huy Chiến dịch nằm ẩn mình dưới tán rừng nguyên sinh Mường Phăng, cách thung lũng Mường Thanh 15 km theo đường chim bay.',
    historicalSignificance: 'Nơi Đại tướng Võ Nguyên Giáp đưa ra quyết định lịch sử: chuyển phương châm tác chiến sang "Đánh chắc, tiến chắc", bảo đảm thắng lợi trọn vẹn.',
    historicalQuote: '“Ngày hôm đó tôi đã đưa ra một quyết định khó khăn nhất trong đời chỉ huy của mình.” — Đại tướng Võ Nguyên Giáp',
    status1954: 'Đầu não chỉ đạo toàn diện chiến dịch (31/01 - 15/05/1954)'
  },
  {
    id: 'doi_c1',
    name: 'Đồi C1 (Eliane 1)',
    shortName: 'Đồi C1',
    frenchName: 'Éliane 1',
    category: 'hill',
    subSector: 'Phân khu Trung tâm',
    elevation: '~ 490 m',
    constructionDate: 'Cuối năm 1953',
    forces: 'Tiểu đoàn 1 Trung đoàn 4 Bán lữ đoàn Lê dương (1/13e DBLE)',
    coordinates: { x: 12, y: 2.2, z: 2 },
    mapPercent: { x: 66, y: 52 },
    thumbnail: '/assets/aistudio/image_6fe182a2.png',
    gallery: [
      {
        url: '/assets/aistudio/image_6fe182a2.png',
        caption: 'Tượng đài Chiến thắng và di tích các điểm cao đồi C1, D1',
        tag: 'Hiện trạng di tích'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/soldiers_combat_bw_1789891334717.webp',
        caption: 'Chiến đấu dũng cảm giành giật từng thước hào suốt đợt 2',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Cùng với đồi A1, đồi C1 án ngữ dãy đồi phía Đông khống chế trực tiếp lòng chảo và đường giao thông chính dẫn vào khu trung tâm.',
    historicalSignificance: 'Chiến sự tại Đồi C1 diễn ra giằng co từng tấc đất suốt đợt tiến công thứ 2 và thứ 3. Bộ đội ta dùng hệ thống giao thông hào vây lấn, bẻ gãy mọi đợt phản kích của xe tăng và quân nhảy dù Pháp.',
    historicalQuote: '“Từng mét giao thông hào đào sâu dưới làn đạn pháo là từng mũi dao bóp nghẹt yết hầu quân xâm lược.”',
    status1954: 'Làm chủ hoàn toàn ngày 01/05/1954'
  },
  {
    id: 'hong_cum',
    name: 'Hồng Cúm',
    shortName: 'Hồng Cúm',
    frenchName: 'Isabelle',
    category: 'stronghold',
    subSector: 'Phân khu Nam',
    elevation: '~ 470 m',
    constructionDate: 'Tháng 12/1953',
    forces: 'Cụm cứ điểm Nam gồm Tiểu đoàn 3 Trung đoàn Bộ binh Hải ngoại số 3 (3/3e REI)',
    coordinates: { x: -4, y: 1.0, z: 18 },
    mapPercent: { x: 48, y: 82 },
    thumbnail: '/assets/aistudio/image_dc7302a1.png',
    gallery: [
      {
        url: '/assets/aistudio/image_dc7302a1.png',
        caption: 'Hệ thống hầm ngầm, công sự kiên cố của Pháp bị ta đánh chiếm',
        tag: 'Tư liệu lịch sử'
      },
      {
        url: '/assets/giap-curated/tu-anh-goc/museum_tank_hall_1789877482333.webp',
        caption: 'Sơ đồ chia cắt cô lập hoàn toàn Hồng Cúm với phân khu trung tâm',
        tag: 'Bản đồ chiến sự'
      }
    ],
    description: 'Phân khu Nam Hồng Cúm cách trung tâm 6km về phía Nam, có sân bay phụ và cụm trọng pháo chi viện cho Mường Thanh. Được Pháp bố trí làm bàn đạp giải nguy cho khu trung tâm nếu bị uy hiếp.',
    historicalSignificance: 'Đại đoàn 304 đã tiến hành vây hãm nghiêm ngặt, cắt đứt hoàn toàn liên lạc giữa Hồng Cúm và Mường Thanh. Đêm 7/5/1954, khi khu trung tâm đầu hàng, toàn bộ lực lượng địch tại Hồng Cúm tìm đường tháo chạy sang Lào nhưng đều bị quân ta truy kích và bắt sống.',
    historicalQuote: '“Chiến thuật chia cắt cô lập Hồng Cúm khiến tập đoàn cứ điểm bị chặt đứt liên hoàn, không thể tương trợ lẫn nhau.”',
    status1954: 'Bị bắt sống hoàn toàn đêm 07/05/1954'
  },
  {
    id: 'hong_lum',
    name: 'Hồng Lụm',
    shortName: 'Hồng Lụm',
    frenchName: 'Vị trí hỗ trợ pháo binh',
    category: 'stronghold',
    subSector: 'Phân khu Nam',
    elevation: '~ 468 m',
    constructionDate: 'Đầu năm 1954',
    forces: 'Đơn vị chốt chặn phối thuộc phân khu Nam',
    coordinates: { x: 10, y: 1.1, z: 16 },
    mapPercent: { x: 62, y: 78 },
    thumbnail: '/assets/aistudio/image_8c1c76f9.png',
    gallery: [
      {
        url: '/assets/aistudio/image_8c1c76f9.png',
        caption: 'Hầm ngầm và giao thông hào vây lấn siết chặt phân khu Nam',
        tag: 'Tư liệu lịch sử'
      },
      {
        url: '/assets/aistudio/image_5efce523.png',
        caption: 'Lưới lửa phòng không và chiến hào bao vây chặt chẽ',
        tag: 'Tư liệu lịch sử'
      }
    ],
    description: 'Vị trí phòng thủ vệ tinh nằm ở sườn Đông Nam lòng chảo, kiểm soát các lối mòn từ thung lũng thoát ra rừng rậm.',
    historicalSignificance: 'Bị phong tỏa bởi hệ thống chiến hào vây lấn của ta, không thể tiếp viện cho khu trung tâm hay đón nhận hàng tiếp tế bằng dù.',
    historicalQuote: '“Lưới lửa phòng không và chiến hào đã biến mọi vị trí phòng thủ của Pháp thành những hòn đảo cô lập trên cạn.”',
    status1954: 'Bị cô lập và đầu hàng ngày 07/05/1954'
  }
];

export const AUDIO_SETTINGS_KEY = 'giap_trace_radar_audio_settings_v4';

export interface RadarAudioSettings {
  voiceIndex: number;
  voiceName: string;
  voiceGender: 'male' | 'female';
  rate: number;      // 0.8 to 1.2
  pitch: number;     // 0.85 to 1.15
  volume: number;    // 0 to 1
  enableBgm: boolean;
  enableRadarSfx: boolean;
  showSubtitles: boolean;
}

export const DEFAULT_AUDIO_SETTINGS: RadarAudioSettings = {
  voiceIndex: -1, // -1 means auto-select best Vietnamese voice
  voiceName: '',
  voiceGender: 'male',
  rate: 0.95,
  pitch: 0.98,
  volume: 1.0,
  enableBgm: true,
  enableRadarSfx: true,
  showSubtitles: true
};

/**
 * Chuẩn hóa văn bản tiếng Việt cho giọng đọc phát thanh tài liệu tự nhiên:
 * - Chuyển năm số thành chữ
 * - Chuyển tên viết tắt quân sự thành ngữ âm tiếng Việt
 * - Chuyển tên tiếng Pháp sang phiên âm lịch sử Việt Nam chuẩn mực
 * - Chèn ngắt nghỉ tự nhiên
 */
export function normalizeVietnameseForSpeech(rawText: string): string {
  let text = rawText;

  // Thay thế tên và phiên âm lịch sử
  text = text.replace(/De Castries|Đờ Cát-xơ-ri|De-Castries/gi, 'Đờ Cát');
  text = text.replace(/Béatrice|Beatrice/gi, 'Be-a-trix');
  text = text.replace(/Gabrielle/gi, 'Ga-bri-en');
  text = text.replace(/Anne-Marie/gi, 'An-na Ma-ri');
  text = text.replace(/Éliane|Eliane/gi, 'Ê-li-an');
  text = text.replace(/Isabelle/gi, 'I-da-ben');
  text = text.replace(/GONO/g, 'Gô-nô');
  text = text.replace(/RC4/gi, 'Đường số bốn');

  // Mốc thời gian & ngày tháng
  text = text.replace(/1954/g, 'năm một nghìn chín trăm năm mươi tư');
  text = text.replace(/1947/g, 'năm một nghìn chín trăm bốn mươi bảy');
  text = text.replace(/1950/g, 'năm một nghìn chín trăm năm mươi');
  text = text.replace(/1975/g, 'năm một nghìn chín trăm bảy mươi lăm');
  text = text.replace(/1944/g, 'năm một nghìn chín trăm bốn mươi tư');
  text = text.replace(/1959/g, 'năm một nghìn chín trăm năm mươi chín');

  text = text.replace(/13\/3/g, 'ngày mười ba tháng ba');
  text = text.replace(/14\/3/g, 'ngày mười bốn tháng ba');
  text = text.replace(/15\/3/g, 'ngày mười lăm tháng ba');
  text = text.replace(/17\/3/g, 'ngày mười bảy tháng ba');
  text = text.replace(/26\/1/g, 'ngày hai mươi sáu tháng một');
  text = text.replace(/07\/05|7\/5/g, 'ngày mùng bảy tháng năm');
  text = text.replace(/30\/4/g, 'ngày ba mươi tháng tư');
  text = text.replace(/17h30/g, 'mười bảy giờ ba mươi phút');
  text = text.replace(/11h30/g, 'mười một giờ ba mươi phút');

  // Đơn vị đo lường
  text = text.replace(/(\d+)\s*km/gi, '$1 ki-lô-mét');
  text = text.replace(/(\d+)\s*m/gi, '$1 mét');
  text = text.replace(/(\d+)\s*kg/gi, '$1 ki-lô-gam');
  text = text.replace(/50\.000/g, 'năm mươi nghìn');
  text = text.replace(/16\.200/g, 'mười sáu nghìn hai trăm');
  text = text.replace(/1\.000/g, 'một nghìn');
  text = text.replace(/20\.000/g, 'hai mươi nghìn');
  text = text.replace(/750km/g, 'bảy trăm năm mươi ki-lô-mét');

  // Ngắt nghỉ rõ ràng
  text = text.replace(/—/g, ', ');
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}
