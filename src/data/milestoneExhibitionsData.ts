import { ASSET_PATHS } from '../assets/images/imageAssets';
import { getCuratedImage, SLOT_IMAGE_URLS } from './giapImageMap.generated';

export interface ExhibitionGalleryPhoto {
  url: string;
  caption: string;
  badge: string;
}

export interface MilestoneExhibitionData {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  poeticTagline: string;
  locationName: string;
  locationCoordinates: string;
  period: string;
  heroImage: string;
  didYouKnowFact: string;
  historicalVoiceScript: string;
  audioDurationSeconds: number;
  gallery: ExhibitionGalleryPhoto[];
  interactiveChallenge: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  comparisonBeforeAfter?: {
    beforeLabel: string;
    beforeDesc: string;
    beforeImage: string;
    afterLabel: string;
    afterDesc: string;
    afterImage: string;
  };
}

export const MILESTONE_EXHIBITIONS: Record<string, MilestoneExhibitionData> = {
  m1: {
    id: 'm1',
    year: '1911',
    title: 'CỘI NGUỒN AN XÁ',
    subtitle: 'Nơi Dòng Sông Kiến Giang Nuôi Dưỡng Bản Lĩnh',
    poeticTagline: 'Mọi hành trình vĩ đại đều bắt đầu từ một dòng sông quê hương.',
    locationName: 'Làng An Xá, xã Lộc Thủy, huyện Lệ Thủy, Quảng Bình',
    locationCoordinates: '17°13\'N 106°47\'E • Tọa độ bên bờ sông Kiến Giang',
    period: 'Thời niên thiếu & Cội nguồn',
    heroImage: getCuratedImage('milestoneExhibitionsData__001__GIAP_BIRTHPLACE_ROOM'),
    didYouKnowFact: 'Làng An Xá nằm kẹp giữa dòng sông Kiến Giang êm đềm và dải cát trắng miền Trung. Người dân nơi đây từ đời này qua đời khác nổi tiếng với tinh thần hiếu học, chuộng đạo lý và lòng quật cường chống giặc xâm lăng.',
    historicalVoiceScript: 'Chào bạn, chúng ta đang đứng bên dòng sông Kiến Giang, quê hương Lệ Thủy năm 1911. Nơi đây, trong ngôi nhà gỗ ba gian bình dị bên hàng cau xanh ngắt, cậu bé Võ Nguyên Giáp đã cất tiếng khóc chào đời. Bầu sữa mát lành của câu hò khoan Lệ Thủy và lòng yêu nước sâu thẳm của người cha - một nhà nho đức độ - đã đặt những viên gạch nhân cách đầu tiên.',
    audioDurationSeconds: 45,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__002__GIAP_BIRTHPLACE_ROOM'),
        caption: 'Gian phòng mộc mạc nơi cất tiếng khóc chào đời tại làng An Xá',
        badge: 'Căn phòng lịch sử'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__003__GIAP_HOUSE_CABINET'),
        caption: 'Chiếc tủ sách và hiện vật gỗ mộc mạc lưu giữ sách vở gia đình',
        badge: 'Hiện vật gia đình'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__004__GIAP_FAMILY_PORTRAIT'),
        caption: 'Bức ảnh tư liệu gia đình Đại tướng thời kỳ đầu tại quê hương',
        badge: 'Tư liệu quý'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__005__INSIGHTS_GENERAL_ORIGIN'),
        caption: 'Dấu son cội nguồn cách mạng tại mảnh đất Quảng Bình anh hùng',
        badge: 'Di sản quê hương'
      }
    ],
    interactiveChallenge: {
      question: 'Quê hương Lệ Thủy của Đại tướng Võ Nguyên Giáp gắn liền với dòng sông lịch sử nào?',
      options: [
        'Sông Hương thơ mộng',
        'Dòng sông Kiến Giang hiền hòa',
        'Sông Thạch Hãn kiên cường',
        'Sông Gianh hào hùng'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Dòng sông Kiến Giang và lễ hội đua thuyền truyền thống là cái nôi nuôi dưỡng tâm hồn và ý chí kiên định của Đại tướng từ thuở thiếu thời.'
    },
    comparisonBeforeAfter: {
      beforeLabel: 'THỜI NIÊN THIẾU',
      beforeDesc: 'Mảnh đất nghèo khó, nhân dân chịu áp bức thực dân phong kiến, nung nấu ý chí tự do.',
      beforeImage: getCuratedImage('milestoneExhibitionsData__006__GIAP_BIRTHPLACE_ROOM'),
      afterLabel: 'DI SẢN HÔM NAY',
      afterDesc: 'Khu lưu niệm Quốc gia bên dòng Kiến Giang, nơi hàng triệu đồng bào về tưởng niệm vị Tướng nhân dân.',
      afterImage: getCuratedImage('milestoneExhibitionsData__007__GIAP_HOUSE_CABINET')
    }
  },

  'm-thanglong': {
    id: 'm-thanglong',
    year: '1930 - 1939',
    title: 'THẦY GIÁO TRƯỜNG THĂNG LONG',
    subtitle: 'Gieo Mầm Lòng Yêu Nước Vào Trái Tim Thanh Niên',
    poeticTagline: 'Trước khi cầm quân trận mạc, Người từng là người thầy gieo mầm lý tưởng độc lập.',
    locationName: 'Trường Tư thục Thăng Long, Phố Hàng Bút, Hà Nội',
    locationCoordinates: '21°02\'N 105°51\'E • Hà Nội 36 phố phường',
    period: 'Thời kỳ hoạt động dân chủ',
    heroImage: getCuratedImage('milestoneExhibitionsData__008__GIAP_YOUNG_SCHOLAR'),
    didYouKnowFact: 'Thầy giáo Võ Nguyên Giáp dạy môn Lịch sử và Địa lý. Thầy không dạy theo sách giáo khoa khô khan của thực dân Pháp mà say sưa truyền cho học sinh hào khí chống ngoại xâm từ thời Hai Bà Trưng, Ngô Quyền, Trần Hưng Đạo và tư tưởng cách mạng Pháp 1789.',
    historicalVoiceScript: 'Những năm 1930 tại Hà Nội, trên bục giảng trường Thăng Long, thầy giáo trẻ Võ Nguyên Giáp đã dùng chính lịch sử dân tộc để thức tỉnh tinh thần tự tôn của thế hệ trẻ. Nhiều học trò của thầy sau này đã trở thành những chiến sĩ cách mạng kiên trung của dân tộc.',
    audioDurationSeconds: 40,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__009__GIAP_YOUNG_SCHOLAR'),
        caption: 'Chân dung thầy giáo trẻ Võ Nguyên Giáp uyên bác thời trường Thăng Long',
        badge: 'Thầy giáo Thăng Long'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__010__GIAP_DECREE_1945'),
        caption: 'Bản sắc lệnh lưu giữ tư tưởng kiến tạo giáo dục và dân trí',
        badge: 'Tư liệu sắc lệnh'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__011__GIAP_PROVISIONAL_GOV'),
        caption: 'Thế hệ trí thức trẻ tham gia phong trào Mặt trận Dân chủ',
        badge: 'Trí thức cách mạng'
      }
    ],
    interactiveChallenge: {
      question: 'Tại trường Tư thục Thăng Long, thầy giáo Võ Nguyên Giáp trực tiếp giảng dạy môn học nào?',
      options: [
        'Môn Lịch sử và Địa lý',
        'Môn Toán và Vật lý',
        'Môn Hóa học và Sinh học',
        'Môn Hội họa quân sự'
      ],
      correctIndex: 0,
      explanation: 'Chính xác! Thầy giáo Võ Nguyên Giáp dạy môn Lịch sử - Địa lý, truyền ngọn lửa yêu nước và sự hiểu biết sâu sắc về giang sơn gấm vóc cho các thế hệ học sinh.'
    }
  },

  m2: {
    id: 'm2',
    year: '1944',
    title: 'RỪNG TRẦN HƯNG ĐẠO',
    subtitle: 'Khai Sinh Quân Đội Nhân Dân Từ 34 Chiến Sĩ',
    poeticTagline: 'Từ 34 khẩu súng kíp thô sơ đến đội quân bách chiến bách thắng của dân tộc anh hùng.',
    locationName: 'Khu rừng Trần Hưng Đạo, Châu Nguyên Bình, Cao Bằng',
    locationCoordinates: '22°37\'N 105°55\'E • Căn cứ địa Việt Bắc',
    period: 'Chuẩn bị Tổng khởi nghĩa',
    heroImage: getCuratedImage('milestoneExhibitionsData__012__VIETNAM_PEOPLES_ARMY'),
    didYouKnowFact: 'Theo chỉ thị của Bác Hồ: "Tên Đội Việt Nam Tuyên truyền Giải phóng quân, nghĩa là chính trị trọng hơn quân sự, tuyên truyền trọng hơn tác chiến". 34 chiến sĩ đầu tiên tuyên thệ dưới lá cờ đỏ sao vàng giữa rừng già đại ngàn.',
    historicalVoiceScript: 'Chiều ngày 22 tháng 12 năm 1944, giữa khu rừng Trần Hưng Đạo sương mù bao phủ, 34 chiến sĩ áo chàm mộc mạc đã làm lễ xuất quân. Đồng chí Võ Nguyên Giáp thay mặt đoàn thể đọc lời tuyên thệ lịch sử mười điều danh dự, mở đầu trang sử vẻ vang của Quân đội nhân dân Việt Nam.',
    audioDurationSeconds: 42,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__013__VIETNAM_PEOPLES_ARMY'),
        caption: 'Đội hình Quân đội nhân dân Việt Nam oai hùng tiếp nối truyền thống 34 chiến sĩ',
        badge: 'Quân đội anh hùng'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__014__CHALLENGES_COMBAT_BW'),
        caption: 'Tư liệu chiến sĩ xung trận dũng cảm thời kỳ kháng chiến gian khổ',
        badge: 'Khói lửa chiến hào'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__015__GIAP_REVIEW_TROOPS'),
        caption: 'Đồng chí Võ Nguyên Giáp duyệt đội ngũ quân đội sau ngày thành lập',
        badge: 'Duyệt đội ngũ'
      }
    ],
    interactiveChallenge: {
      question: 'Chiến công đầu tiên của Đội Việt Nam Tuyên truyền Giải phóng quân diễn ra tại đâu?',
      options: [
        'Trận Điện Biên Phủ',
        'Hai đồn Phai Khắt và Nà Ngần',
        'Chiến khu Tân Trào',
        'Đèo Pha Đin'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Ngay sau ngày thành lập, đội quân non trẻ đã mưu trí hạ hai đồn Phai Khắt và Nà Ngần, giữ đúng lời thề "trận đầu phải thắng".'
    }
  },

  'm-1945': {
    id: 'm-1945',
    year: '1945',
    title: 'BẮC BỘ PHỦ & LẬP QUỐC',
    subtitle: 'Bộ Trưởng Nội Vụ Đầu Tiên Của Nước Việt Nam Mới',
    poeticTagline: 'Khi độc lập mở ra, người chỉ huy quân sự cũng là người kiến tạo nền tảng chính thể.',
    locationName: 'Quảng trường Ba Đình & Bắc Bộ Phủ, Hà Nội',
    locationCoordinates: '21°02\'N 105°50\'E • Trụ sở Chính phủ Lâm thời',
    period: 'Cách mạng Tháng Tám & Lập quốc',
    heroImage: getCuratedImage('milestoneExhibitionsData__016__GIAP_PROVISIONAL_GOV'),
    didYouKnowFact: 'Ở tuổi 34, đồng chí Võ Nguyên Giáp được Bác Hồ trao trọng trách Bộ trưởng Nội vụ đầu tiên. Đồng chí đã ký hơn 100 sắc lệnh kiến tạo nhà nước, trong đó có Sắc lệnh Tổng tuyển cử tự do đầu tiên của dân tộc.',
    historicalVoiceScript: 'Mùa thu năm 1945, tại Hà Nội, nước Việt Nam Dân chủ Cộng hòa non trẻ phải đương đầu với muôn vàn khó khăn của thù trong giặc ngoài. Với cương vị Bộ trưởng Bộ Nội vụ, đồng chí Võ Nguyên Giáp đã đóng góp to lớn vào việc bảo vệ chính quyền nhân dân vừa giành được.',
    audioDurationSeconds: 40,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__017__GIAP_PROVISIONAL_GOV'),
        caption: 'Chính phủ Cách mạng Lâm thời nước Việt Nam Dân chủ Cộng hòa 1945',
        badge: 'Chính phủ Lâm thời'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__018__GIAP_DECREE_1945'),
        caption: 'Bút tích sắc lệnh do Bộ trưởng Nội vụ Võ Nguyên Giáp ký năm 1945',
        badge: 'Sắc lệnh lịch sử'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__019__GIAP_SIGNATURE'),
        caption: 'Chữ ký chữ bút tích sắt son của vị Tổng Tư lệnh',
        badge: 'Bút tích bảo vật'
      }
    ],
    interactiveChallenge: {
      question: 'Trong Chính phủ Cách mạng Lâm thời năm 1945, đồng chí Võ Nguyên Giáp giữ chức vụ gì?',
      options: [
        'Bộ trưởng Bộ Ngoại giao',
        'Bộ trưởng Bộ Nội vụ đầu tiên',
        'Bộ trưởng Bộ Tài chính',
        'Chủ tịch Ủy ban Ngân hàng'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đồng chí là Bộ trưởng Bộ Nội vụ đầu tiên kiêm Thứ trưởng Bộ Quốc phòng trong Chính phủ lâm thời.'
    }
  },

  m4: {
    id: 'm4',
    year: '1954',
    title: 'CHIẾN THẮNG ĐIỆN BIÊN PHỦ',
    subtitle: '56 Ngày Đêm "Khoét Núi Ngủ Hầm" Chấn Động Địa Cầu',
    poeticTagline: 'Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries chiều 7/5/1954.',
    locationName: 'Sở chỉ huy Mường Phăng & Thung lũng Điện Biên',
    locationCoordinates: '21°23\'N 103°01\'E • Cứ điểm lòng chảo Điện Biên',
    period: 'Đỉnh cao chiến thắng 1954',
    heroImage: getCuratedImage('milestoneExhibitionsData__020__DIEN_BIEN_FLAG_WIN'),
    didYouKnowFact: 'Quyết định hoãn giờ nổ súng ngày 26/1/1954 để chuyển từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc" là quyết định khó khăn nhất cuộc đời Đại tướng, cứu hàng vạn chiến sĩ và nắm chắc toàn thắng.',
    historicalVoiceScript: 'Chiều ngày 7 tháng 5 năm 1954, sau 56 ngày đêm chiến đấu ngoan cường, lá cờ Quyết chiến Quyết thắng đã kiêu hãnh tung bay trên nóc hầm tướng De Castries. Toàn bộ tập đoàn cứ điểm Điện Biên Phủ bị tiêu diệt hoàn toàn, kết thúc vẻ vang 9 năm kháng chiến trường kỳ chống thực dân Pháp.',
    audioDurationSeconds: 46,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__021__DIEN_BIEN_FLAG_WIN'),
        caption: 'Khoảnh khắc lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm chỉ huy Pháp',
        badge: 'Cờ toàn thắng'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__022__GIAP_MUONG_PHANG_HQ'),
        caption: 'Hầm Sở chỉ huy Mường Phăng - nơi Đại tướng đưa ra quyết định lịch sử',
        badge: 'Sở chỉ huy'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__023__TACTICAL_BRIEFING_MAP'),
        caption: 'Bản đồ kế hoạch tác chiến 3 đợt tiến công tiêu diệt 49 cứ điểm',
        badge: 'Bản đồ tác chiến'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__024__GIAP_WITH_UNCLE_HO'),
        caption: 'Đại tướng báo cáo kế hoạch tác chiến với Chủ tịch Hồ Chí Minh tại ATK',
        badge: 'Họp bàn tác chiến'
      }
    ],
    interactiveChallenge: {
      question: 'Phương châm tác chiến đã được Đại tướng Võ Nguyên Giáp quyết định chuyển đổi tại Điện Biên Phủ là gì?',
      options: [
        'Từ "Vây hãm" sang "Tập kích"',
        'Từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc"',
        'Từ "Đánh du kích" sang "Phòng ngự khu vực"',
        'Từ "Tiến công biên giới" sang "Đánh úp"'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Phương châm "Đánh chắc tiến chắc" là mấu chốt quyết định làm nên thắng lợi Điện Biên Phủ lừng lẫy năm châu.'
    },
    comparisonBeforeAfter: {
      beforeLabel: 'THÁNG 1/1954: NỖI LO TỔN THẤT',
      beforeDesc: 'Trận địa pháo hở, thế trận địch kiên cố bê tông cốt thép, đánh nhanh dễ chịu thương vong nặng nề.',
      beforeImage: getCuratedImage('milestoneExhibitionsData__025__TACTICAL_BRIEFING_MAP'),
      afterLabel: 'THÁNG 5/1954: TOÀN THẮNG CHẤN ĐỘNG',
      afterDesc: 'Đánh chắc tiến chắc, siết chặt vòng vây, hầm De Castries đầu hàng vô điều kiện.',
      afterImage: getCuratedImage('milestoneExhibitionsData__026__DIEN_BIEN_FLAG_WIN')
    }
  },

  m5: {
    id: 'm5',
    year: '1975',
    title: 'MÙA XUÂN 1975 TOÀN THẮNG',
    subtitle: 'Xe Tăng Húc Cổng Dinh Độc Lập - Thống Nhất Non Sông',
    poeticTagline: '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút... giải phóng miền Nam!"',
    locationName: 'Dinh Độc Lập, Sài Gòn & Tổng Hành Dinh D67, Hà Nội',
    locationCoordinates: '10°46\'N 106°41\'E • Trưa 30/4/1975',
    period: 'Kháng chiến chống Mỹ thống nhất đất nước',
    heroImage: getCuratedImage('milestoneExhibitionsData__027__MUSEUM_TANK_HALL'),
    didYouKnowFact: 'Bức điện mật ngày 7/4/1975 của Đại tướng được phát đi bằng sóng vô tuyến mật mã đã thắp lửa cho 5 cánh quân băng qua hàng ngàn cây số, giải phóng Sài Gòn trưa 30/4/1975 mà thành phố vẫn nguyên vẹn.',
    historicalVoiceScript: 'Trưa ngày 30 tháng 4 năm 1975, cỗ xe tăng lịch sử đã húc đổ cánh cổng Dinh Độc Lập. Lá cờ Mặt trận Dân tộc Giải phóng tung bay trên nóc Dinh lúc 11 giờ 30 phút. Chiến dịch Hồ Chí Minh toàn thắng, non sông thu về một mối sau 21 năm trường kỳ khát vọng.',
    audioDurationSeconds: 44,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__028__MUSEUM_TANK_HALL'),
        caption: 'Cỗ xe tăng lịch sử mang số hiệu đại thắng trưng bày trang trọng tại bảo tàng',
        badge: 'Bảo vật Quốc gia'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__029__D67_BUNKER_COMMAND'),
        caption: 'Hầm Tổng hành dinh D67 nơi Đại tướng cùng Quân ủy chỉ huy chiến dịch',
        badge: 'Tổng hành dinh'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__030__HERO_FLAG_GENERAL'),
        caption: 'Đại tướng và biểu tượng Cờ đỏ Sao vàng toàn thắng rực rỡ',
        badge: 'Non sông liền dải'
      }
    ],
    interactiveChallenge: {
      question: 'Thời khắc lá cờ chiến thắng tung bay trên nóc Dinh Độc Lập ngày 30/4/1975 là vào mấy giờ?',
      options: [
        '09 giờ 00 phút sáng',
        '11 giờ 30 phút trưa',
        '15 giờ 00 phút chiều',
        '17 giờ 30 phút hoàng hôn'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đúng 11 giờ 30 phút trưa ngày 30/4/1975, lá cờ Mặt trận tung bay trên nóc Dinh Độc Lập, kết thúc thắng lợi cuộc kháng chiến chống Mỹ cứu nước.'
    }
  },

  m6: {
    id: 'm6',
    year: '2013',
    title: 'VŨNG CHÙA - ĐẢO YẾN',
    subtitle: 'Vị Tướng Của Nhân Dân Yên Nghỉ Trong Lòng Đất Mẹ',
    poeticTagline: 'Người sống mãi trong lòng dân là người đã sống trọn vẹn vì Độc lập và Tự do của Nhân dân.',
    locationName: 'Vũng Chùa - Đảo Yến, Quảng Đông, Quảng Trạch, Quảng Bình',
    locationCoordinates: '17°55\'N 106°29\'E • Mũi Rồng trông ra Biển Đông',
    period: 'Dấu ấn trường tồn',
    heroImage: getCuratedImage('milestoneExhibitionsData__031__GIAP_MEMORIAL_ALTAR'),
    didYouKnowFact: 'Hàng triệu đồng bào từ khắp mọi miền đất nước đã nghiêng mình xếp hàng thâu đêm để tiễn biệt Đại tướng. Nơi người an nghỉ tại Vũng Chùa - Đảo Yến có thế tựa núi rồng hướng ra biển Đông, canh giữ chủ quyền non sông muôn đời.',
    historicalVoiceScript: 'Tháng 10 năm 2013, vị Tổng Tư lệnh huyền thoại đã thanh thản về với đất mẹ Quảng Bình. Tình yêu kính của triệu triệu người dân dành cho Đại tướng là minh chứng bất tử: Danh hiệu cao quý nhất của một vị tướng chính là vị tướng trong lòng nhân dân.',
    audioDurationSeconds: 42,
    gallery: [
      {
        url: getCuratedImage('milestoneExhibitionsData__032__GIAP_MEMORIAL_ALTAR'),
        caption: 'Khu tưởng niệm trang nghiêm tại quê nhà Quảng Bình bên bờ biển biếc',
        badge: 'Nơi tưởng niệm'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__033__GIAP_ANCESTRAL_ALTAR'),
        caption: 'Gian thờ cội nguồn gia tộc lưu giữ hồn thiêng sông núi',
        badge: 'Cội nguồn'
      },
      {
        url: getCuratedImage('milestoneExhibitionsData__034__PORTRAIT_GENERAL'),
        caption: 'Nụ cười dung dị, đôn hậu của Đại tướng mãi mãi khắc sâu trong trái tim người Việt Nam',
        badge: 'Vị tướng nhân dân'
      }
    ],
    interactiveChallenge: {
      question: 'Khu vực an nghỉ vĩnh hằng của Đại tướng Võ Nguyên Giáp mang tên là gì?',
      options: [
        'Nghĩa trang Trường Sơn',
        'Vũng Chùa - Đảo Yến (Quảng Bình)',
        'Đèo Ngang danh thắng',
        'Bến phà Xuân Sơn'
      ],
      correctIndex: 1,
      explanation: 'Chính xác! Đại tướng an nghỉ tại Vũng Chùa - Đảo Yến (xã Quảng Đông, huyện Quảng Trạch, tỉnh Quảng Bình), lưng tựa núi, mặt trông ra biển Đông.'
    }
  }
};
