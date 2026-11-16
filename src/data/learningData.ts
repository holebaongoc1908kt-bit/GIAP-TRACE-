import { 
  HistoricalDecisionScenario, 
  CouragePillar, 
  MultiPerspectiveEvent, 
  IfItWereMeSimulation, 
  DiscoveryBadge, 
  OneMinuteHistoryCard, 
  VerificationSource, 
  PerceptionSurveyData 
} from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';

/**
 * DỮ LIỆU CHUẨN XÁC DÀNH CHO GIAP TRACE
 * Phục vụ trải nghiệm học tập, can thiệp khoa học hành vi và nghiên cứu lịch sử
 */

// 1. MỘT PHÚT LỊCH SỬ (Yêu cầu 13)
export const ONE_MINUTE_STORIES: OneMinuteHistoryCard[] = [
  {
    id: 'om-1',
    category: 'Bài học',
    title: 'Nghệ thuật xót thương từng giọt máu chiến sĩ',
    shortSummary: 'Trước giờ nổ súng tại Điện Biên Phủ, Đại tướng thao thức thấu đêm. Quyết định rút pháo, chuyển phương châm đánh chắc không phải vì nao núng, mà xuất phát từ trách nhiệm tối thượng bảo toàn sinh mạng cho hàng vạn bộ đội.',
    quoteOrHighlight: 'Một người cầm quân tài ba trước hết phải là một người biết quý trọng từng giọt máu của đồng đội.',
    sourceRef: 'Hồi ký "Điện Biên Phủ - Điểm hẹn lịch sử", NXB Quân đội Nhân dân'
  },
  {
    id: 'om-2',
    category: 'Nhân vật',
    title: 'Thầy giáo dạy sử thành vị Tổng Tư lệnh',
    shortSummary: 'Trước khi cầm quân, đồng chí Võ Nguyên Giáp là thầy giáo dạy lịch sử tại trường Tư thục Thăng Long (Hà Nội). Tinh thần yêu nước và vốn hiểu biết lịch sử sâu sắc đã tôi luyện nên tầm nhìn chiến lược của vị Đại tướng huyền thoại.',
    quoteOrHighlight: 'Lịch sử dân tộc đánh giặc giữ nước chính là pho sách giáo khoa quân sự sống động nhất.',
    sourceRef: 'Viện Lịch sử Quân sự Việt Nam'
  },
  {
    id: 'om-3',
    category: 'Tư liệu',
    title: 'Sắc lệnh lịch sử số 21 năm 1945',
    shortSummary: 'Ngày 08/01/1945 (âm lịch/dương lịch chuyển tiếp), trong cương vị Bộ trưởng Bộ Nội vụ Chính phủ Lâm thời, đồng chí Võ Nguyên Giáp đã ký nhiều sắc lệnh quan trọng kiến tạo bộ máy nhà nước non trẻ, đặt nền móng quản lý công văn và thư viện quốc gia.',
    quoteOrHighlight: 'Chữ ký kiên định trên từng văn bản pháp lý khẳng định tính chính danh và quyền tự quyết của nước Việt Nam mới.',
    sourceRef: 'Trung tâm Lưu trữ Quốc gia III'
  },
  {
    id: 'om-4',
    category: 'Sự kiện',
    title: 'Điện mật: "Thần tốc, thần tốc hơn nữa..."',
    shortSummary: 'Ngày 7/4/1975, bức điện mật chỉ đạo Chiến dịch Hồ Chí Minh mang bút tích Đại tướng vang vọng khắp các mặt trận: "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút xông lên phía trước...".',
    quoteOrHighlight: 'Thời cơ là sức mạnh. Nắm bắt thời cơ lịch sử chính là chìa khóa mở toang cánh cửa toàn thắng.',
    sourceRef: 'Bảo tàng Lịch sử Quân sự Việt Nam'
  }
];

// 2. ĐẰNG SAU MỘT QUYẾT ĐỊNH (Yêu cầu 4)
export const DECISION_SCENARIOS: HistoricalDecisionScenario[] = [
  {
    id: 'dec-dbp-1954',
    title: 'Quyết định khó khăn nhất trong cuộc đời cầm quân',
    event: 'Chiến dịch Điện Biên Phủ',
    year: 'Tháng 1/1954',
    context: 'Thực dân Pháp xây dựng tập đoàn cứ điểm Điện Biên Phủ với 49 cứ điểm, sân bay, xe tăng và hỏa lực pháo binh dày đặc, được các tướng lĩnh phương Tây ca ngợi là "pháo đài bất khả xâm phạm". Bộ Tổng chỉ huy ban đầu dự kiến kế hoạch "Đánh nhanh thắng nhanh" trong 3 đêm 2 ngày.',
    problem: 'Tình hình thực địa thay đổi: Địch đã tăng cường công sự kiên cố, tập trung pháo binh và lực lượng; trong khi pháo binh ta vào trận địa khó khăn, chưa chuẩn bị kỹ thế trận bao vây.',
    challenges: [
      'Pháp đã tăng viện lớn, công sự bê tông cốt thép dày đặc.',
      'Bộ đội ta chỉ quen đánh công kiên quy mô nhỏ, chưa từng đánh một tập đoàn cứ điểm kiên cố lớn.',
      'Nếu đánh nhanh không dứt điểm, nguy cơ tiêu hao lực lượng chủ lực và mất thế chủ động chiến lược là rất cao.',
      'Tâm lý tướng lĩnh và cố vấn khi đó phần lớn đang muốn đánh nhanh để chớp thời cơ.'
    ],
    options: [
      {
        id: 'opt-fast',
        text: 'Phương án A: Tiếp tục phương châm "Đánh nhanh thắng nhanh"',
        analysis: 'Có thể tạo yếu tố bất ngờ về thời điểm, nhưng độ rủi ro cực lớn vì hỏa lực địch áp đảo và bộ đội ta chưa quen đánh công sự bê tông cốt thép.'
      },
      {
        id: 'opt-steady',
        text: 'Phương án B: Hoãn nổ súng, kéo pháo ra, chuyển sang "Đánh chắc tiến chắc"',
        analysis: 'Bảo đảm chắc thắng tuyệt đối, chuẩn bị kỹ giao thông hào vây lấn, bóp nghẹt sân bay địch, song đòi hỏi công sức kéo pháo ra vô cùng gian khổ và thử thách bản lĩnh người chỉ huy.'
      },
      {
        id: 'opt-retreat',
        text: 'Phương án C: Hủy bỏ chiến dịch, lui quân về hậu phương',
        analysis: 'Làm mất đi thời cơ chiến lược ngàn năm có một để kết thúc cuộc kháng chiến trường kỳ chống Pháp.'
      }
    ],
    actualDecision: 'Sáng ngày 26/1/1954, sau đêm trắng trăn trở, Đại tướng Võ Nguyên Giáp đã đưa ra quyết định lịch sử: Ra lệnh hoãn nổ súng, kéo pháo ra vị trí an toàn, chuẩn bị lại thế trận theo phương châm "Đánh chắc, tiến chắc".',
    historicalOutcome: 'Sau 56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt", quân ta đã đập tan tập đoàn cứ điểm Điện Biên Phủ vào chiều 7/5/1954, bắt sống tướng De Castries, lập nên chiến thắng "lừng lẫy năm châu, chấn động địa cầu".',
    reflectionLesson: 'Bài học về sự dũng cảm vượt qua áp lực dư luận, tôn trọng thực tiễn khách quan và tinh thần trách nhiệm bảo vệ xương máu của cán bộ, chiến sĩ.'
  },
  {
    id: 'dec-1944-formation',
    title: 'Thành lập đội vũ trang: Tuyên truyền trọng hơn quân sự',
    event: 'Thành lập Đội VN Tuyên truyền Giải phóng quân',
    year: 'Tháng 12/1944',
    context: 'Cuối năm 1944, phong trào cách mạng sục sôi tại Cao - Bắc - Lạng. Nhiều cán bộ nóng lòng muốn phát động khởi nghĩa vũ trang ngay lập tức.',
    problem: 'Nên chú trọng quân sự thuần túy để đánh lớn ngay, hay đặt chính trị - vận động quần chúng làm nền tảng?',
    challenges: [
      'Vũ khí còn rất thô sơ (chỉ có súng kíp, súng trường cũ).',
      'Đế quốc và tay sai truy lùng gắt gao.',
      'Nếu manh động bộc lộ lực lượng sớm sẽ bị kẻ thù đàn áp khốc liệt.'
    ],
    options: [
      {
        id: 'opt-military-first',
        text: 'Phương án A: Tập trung mua sắm vũ khí, tổ chức giao tranh trực diện',
        analysis: 'Dễ rơi vào thế manh động, bị cô lập và tổn thất trước hỏa lực vượt trội của địch.'
      },
      {
        id: 'opt-propaganda-first',
        text: 'Phương án B: "Tuyên truyền trọng hơn tác chiến", lấy dân làm gốc',
        analysis: 'Xây dựng cơ sở chính trị vững chắc trong quần chúng, đánh thắng hai trận đầu Phai Khắt, Nà Ngần để gây tiếng vang và cổ vũ phong trào toàn quốc.'
      }
    ],
    actualDecision: 'Thực hiện chỉ thị của Bác Hồ, đồng chí Võ Nguyên Giáp đặt tên đội là "Việt Nam Tuyên truyền Giải phóng quân", chỉ rõ: "Chính trị trọng hơn quân sự, tuyên truyền trọng hơn tác chiến".',
    historicalOutcome: 'Đội quân 34 người đã lập công xuất sắc diệt đồn Phai Khắt và Nà Ngần, nhanh chóng lớn mạnh thành Quân đội Nhân dân Việt Nam bách chiến bách thắng.',
    reflectionLesson: 'Bài học: Muốn làm nên việc lớn, phải bắt đầu từ cội nguồn nhân dân, xây dựng nền tảng tư tưởng vững chắc trước khi hành động.'
  }
];

// 3. GIẢI MÃ BẢN LĨNH (Yêu cầu 5 - 8 Phẩm chất then chốt)
export const COURAGE_PILLARS: CouragePillar[] = [
  {
    id: 'thinking',
    title: 'Tư duy chiến lược sắc bén',
    iconName: 'Brain',
    definition: 'Khả năng phân tích sâu sắc cục diện, nhìn thấu điểm mạnh - điểm yếu của đối phương, phát triển nghệ thuật quân sự độc đáo của chiến tranh nhân dân.',
    concreteEvents: [
      {
        eventName: 'Đánh bại các học thuyết quân sự của phương Tây',
        year: '1950 - 1954',
        manifestation: 'Nhận diện điểm yếu chí tử của tập đoàn cứ điểm Điện Biên Phủ là sự phụ thuộc tuyệt đối vào tiếp tế đường hàng không, từ đó chỉ đạo đào chiến hào thắt chặt cổ họng tiếp tế của địch.',
        quoteOrEvidence: '"Chiến tranh nhân dân Việt Nam lấy nhỏ thắng lớn, lấy yếu thắng mạnh bằng mưu lược và thế trận lòng dân."'
      }
    ],
    studentTakeaway: 'Học cách tư duy đa chiều, không nhìn nhận vấn đề phiến diện và luôn tìm kiếm giải pháp dựa trên quy luật thực tế.'
  },
  {
    id: 'will',
    title: 'Ý chí sắt đá & Kiên định',
    iconName: 'Flame',
    definition: 'Lòng kiên trì phi thường, không khuất phục trước gian nguy, luôn giữ vững niềm tin sắt son vào thắng lợi cuối cùng của dân tộc.',
    concreteEvents: [
      {
        eventName: 'Những năm tháng gian lao xây dựng căn cứ Việt Bắc',
        year: '1941 - 1945',
        manifestation: 'Cùng đồng bào các dân tộc thiểu số nếm mật nằm gai, ăn cháo ngô rau rừng, vượt qua muôn vàn gian khổ để gây dựng hạt giống vũ trang đầu tiên.',
        quoteOrEvidence: 'Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập.'
      }
    ],
    studentTakeaway: 'Ý chí giúp ta không bỏ cuộc khi gặp bài toán khó hay thử thách cuộc sống, bền bỉ đến cùng với mục tiêu cao đẹp.'
  },
  {
    id: 'learning',
    title: 'Khả năng tự học & Cầu thị',
    iconName: 'BookOpen',
    definition: 'Không qua bất kỳ trường lớp quân sự chính quy nào nhưng tự học qua thực tiễn, qua lịch sử đánh giặc của cha ông và tri thức quân sự thế giới.',
    concreteEvents: [
      {
        eventName: 'Tự học nghệ thuật quân sự qua thư tịch cổ và thực tế chiến trường',
        year: '1940 - 1948',
        manifestation: 'Từng là thầy giáo dạy lịch sử, đồng chí say mê nghiên cứu nghệ thuật đánh giặc của Trần Hưng Đạo, Nguyễn Trãi, Quang Trung và các học giả phương Tây, đúc kết thành cẩm nang tác chiến phù hợp với người lính Việt Nam.',
        quoteOrEvidence: 'Các tướng lĩnh phương Tây gọi Đại tướng là "vị tướng tự học" vĩ đại nhất thế kỷ XX.'
      }
    ],
    studentTakeaway: 'Tinh thần tự học suốt đời là chìa khóa giúp con người bứt phá mọi giới hạn hoàn cảnh xuất thân.'
  },
  {
    id: 'decision',
    title: 'Bản lĩnh ra quyết định',
    iconName: 'Compass',
    definition: 'Dám chịu trách nhiệm cá nhân trước lịch sử, quyết định dựa trên thực tiễn khách quan thay vì chạy theo cảm tính hay áp lực đám đông.',
    concreteEvents: [
      {
        eventName: 'Chuyển phương châm tại Mường Phăng',
        year: '1954',
        manifestation: 'Đối diện với những bất đồng ý kiến, Đại tướng đã bình tĩnh lập luận, bảo vệ quan điểm chắc thắng và ra mệnh lệnh kéo pháo ra, cứu cả chiến dịch khỏi thảm họa.',
        quoteOrEvidence: '"Đó là quyết định khó khăn nhất trong cuộc đời chỉ huy của tôi."'
      }
    ],
    studentTakeaway: 'Rèn luyện sự bình tĩnh để đưa ra quyết định đúng đắn vào những thời điểm bước ngoặt của cuộc đời.'
  },
  {
    id: 'responsibility',
    title: 'Tinh thần trách nhiệm tối thượng',
    iconName: 'ShieldCheck',
    definition: 'Đặt lợi ích của Tổ quốc và sinh mạng của nhân dân, chiến sĩ lên trên tất cả; luôn dũng cảm nhận phần việc khó khăn nhất.',
    concreteEvents: [
      {
        eventName: 'Lời dặn dò của Bác Hồ và lời hứa danh dự',
        year: '1954',
        manifestation: 'Ghi khắc lời dặn của Bác Hồ: "Trận này rất quan trọng, phải đánh cho thắng, chắc thắng mới đánh, không chắc thắng không đánh", Đại tướng kiên quyết giữ lời hứa son sắt với dân tộc.',
        quoteOrEvidence: 'Mỗi mệnh lệnh ban ra là sinh mạng của hàng vạn đồng bào, chiến sĩ, không thể mạo hiểm.'
      }
    ],
    studentTakeaway: 'Sống có trách nhiệm với lời nói, hành động của bản thân và với tập thể xung quanh.'
  },
  {
    id: 'adaptation',
    title: 'Khả năng thích ứng linh hoạt',
    iconName: 'RefreshCw',
    definition: 'Không giáo điều rập khuôn; luôn biến hóa chiến thuật theo điều kiện địa hình, thời tiết và tương quan lực lượng.',
    concreteEvents: [
      {
        eventName: 'Sáng tạo chiến thuật đào hầm và vây lấn bóc vỏ',
        year: '1954',
        manifestation: 'Khi chuyển sang đánh chắc tiến chắc, Đại tướng chỉ đạo bộ đội đào hàng trăm km chiến hào siết chặt vòng vây, hóa giải sức mạnh phi cơ và trọng pháo của đối phương.',
        quoteOrEvidence: 'Chiến hào trở thành sợi thòng lọng siết chặt quân viễn chinh Pháp tại Mường Thanh.'
      }
    ],
    studentTakeaway: 'Biết linh hoạt thay đổi phương pháp học tập và ứng biến tích cực khi hoàn cảnh biến đổi.'
  },
  {
    id: 'vision',
    title: 'Tầm nhìn thời đại sâu rộng',
    iconName: 'Eye',
    definition: 'Dự báo chính xác chiều hướng phát triển của cục diện cách mạng trong nước và quốc tế để đón đầu thời cơ.',
    concreteEvents: [
      {
        eventName: 'Đề xuất xây dựng Quân chủng Phòng không - Không quân và Hải quân',
        year: '1955 - 1965',
        manifestation: 'Sớm nhìn thấy âm mưu leo thang đánh phá miền Bắc bằng không quân hiện đại của Mỹ, Đại tướng đã chủ động chỉ đạo xây dựng lực lượng tên lửa, radar và phòng không nhiều tầng.',
        quoteOrEvidence: 'Góp phần làm nên chiến thắng "Hà Nội - Điện Biên Phủ trên không" năm 1972.'
      }
    ],
    studentTakeaway: 'Nuôi dưỡng ước mơ lớn, nhìn xa trông rộng và chuẩn bị năng lực đón đầu tương lai.'
  },
  {
    id: 'community',
    title: 'Tinh thần vì cộng đồng & Nhân văn',
    iconName: 'HeartHandshake',
    definition: 'Trọn đời gắn bó máu thịt với nhân dân; đức tính khiêm nhường, giản dị, hòa đồng, hết lòng yêu thương đồng bào.',
    concreteEvents: [
      {
        eventName: 'Tình cảm với cựu chiến binh và đồng bào vùng sâu',
        year: '1975 - 2013',
        manifestation: 'Dù ở cương vị cấp cao hay lúc nghỉ hưu, Đại tướng luôn dành thời gian thăm lại chiến trường xưa, thăm hỏi thương binh, động viên khuyến học cho con em vùng khó khăn.',
        quoteOrEvidence: '"Tôi sống ngày nào, cũng là vì đất nước ngày đó."'
      }
    ],
    studentTakeaway: 'Lan tỏa lòng nhân ái, sự sẻ chia và tinh thần cống hiến cho xã hội.'
  }
];

// 4. MỘT SỰ KIỆN - NHIỀU GÓC NHÌN (Yêu cầu 6)
export const MULTI_PERSPECTIVES: MultiPerspectiveEvent[] = [
  {
    id: 'persp-dbp',
    title: 'Chiến dịch Điện Biên Phủ (1954) qua đa chiều lăng kính',
    historicalContext: 'Tập đoàn cứ điểm kiên cố nhất Đông Dương của Pháp, được Mỹ hỗ trợ 73% chi phí chiến tranh nhằm tiêu diệt chủ lực Việt Minh.',
    commanderView: 'Đại tướng Võ Nguyên Giáp: Đây là trận quyết chiến chiến lược định đoạt cục diện kháng chiến. Mọi kế hoạch tác chiến phải bảo đảm tỷ lệ chắc thắng cao nhất, triệt để khai thác hạn chế tiếp tế hàng không của địch và hạn chế tối đa thương vong cho cán bộ, chiến sĩ.',
    soldierView: 'Chiến sĩ ngoài mặt trận: Trải qua những đêm bạt rừng kéo pháo lên dốc cao 70 độ rồi lại kéo pháo ra; đào hàng trăm cây số chiến hào ngập bùn đất dưới làn mưa bom bão đạn. Niềm tin tuyệt đối vào "Anh Văn" (Đại tướng) là nguồn sức mạnh tinh thần bất diệt.',
    citizenView: 'Người dân và dân công hỏa tuyến: Hàng chục vạn đồng bào từ Tây Bắc, Thanh Hóa, Nghệ An vượt đèo Pha Đin, gùi gạo, thồ hàng bằng xe đạp kẽo kẹt ngày đêm phục vụ tiền tuyến với ý chí "Tất cả cho tiền tuyến, tất cả để chiến thắng".',
    vietnamSignificance: 'Chấm dứt hoàn toàn ách thống trị thực dân Pháp kéo dài gần một thế kỷ, giải phóng miền Bắc, mở đường tiến tới thống nhất đất nước.',
    youthLesson: 'Không có chiến thắng nào tự nhiên đến nếu thiếu sự đoàn kết một lòng, sự kiên trì vượt khó và đức hy sinh vì lý tưởng phụng sự non sông.'
  },
  {
    id: 'persp-1944',
    title: 'Ngày thành lập Đội Việt Nam Tuyên truyền Giải phóng quân (1944)',
    historicalContext: 'Chiến tranh thế giới thứ hai bước vào giai đoạn quyết định. Đất nước đang chìm trong đêm tối dưới ách thống trị của phát xít Nhật và thực dân Pháp.',
    commanderView: 'Đồng chí Võ Nguyên Giáp: 34 chiến sĩ là những hạt giống đỏ đầu tiên. Đội quân tuy nhỏ bé nhưng mang trong mình sứ mệnh to lớn: gieo mầm niềm tin cách mạng vào lòng quần chúng nhân dân.',
    soldierView: '34 đội viên đầu tiên: Tuyên thệ 10 lời thề danh dự dưới lá cờ đỏ sao vàng giữa rừng già Trần Hưng Đạo, thề chiến đấu đến giọt máu cuối cùng vì độc lập tự do của Tổ quốc.',
    citizenView: 'Đồng bào các dân tộc Cao Bằng: Nuôi giấu cán bộ, sẻ chia từng củ sắn, hạt muối, coi bộ đội như con em ruột thịt của bản làng mình.',
    vietnamSignificance: 'Đánh dấu sự ra đời của lực lượng vũ trang cách mạng nòng cốt, tiền thân của Quân đội Nhân dân Việt Nam anh hùng.',
    youthLesson: 'Mọi kỳ tích vĩ đại đều bắt đầu từ những bước chân kiên định và niềm tin vững chắc vào lý tưởng đúng đắn.'
  }
];

// 5. NẾU LÀ TÔI? (Yêu cầu 10 - Tình huống mô phỏng giáo dục)
export const IF_IT_WERE_ME_SIMULATIONS: IfItWereMeSimulation[] = [
  {
    id: 'sim-1',
    title: 'Tình huống: Khi phương án của tập thể có nguy cơ rủi ro cao',
    context: 'Bạn là đội trưởng phụ trách một dự án thi đua của lớp. Toàn đội đang rất hào hứng với một kế hoạch làm nhanh gọn để giành giải nhất ngay trong tuần này. Tuy nhiên, sau khi kiểm tra kỹ lưỡng, bạn phát hiện kế hoạch đó có lỗ hổng lớn có thể làm cả nhóm thất bại nặng nề.',
    dilemma: 'Bạn sẽ làm gì khi phần đông bạn bè đang hừng hực khí thế muốn làm ngay, còn việc đề nghị hoãn lại để sửa đổi sẽ làm mọi người hụt hẫng và có thể hiểu lầm bạn là người nhút nhát?',
    choices: [
      {
        id: 'c1',
        label: 'Chiều theo ý số đông để giữ không khí vui vẻ, sai đâu sửa đó sau.',
        reflection: 'Cách này tránh được xung đột trước mắt nhưng đẩy cả tập thể vào rủi ro thất bại nghiêm trọng.'
      },
      {
        id: 'c2',
        label: 'Kiên nhẫn trình bày rõ các nguy cơ thực tế bằng số liệu cụ thể, thuyết phục đồng đội điều chỉnh phương án để chắc chắn thành công.',
        reflection: 'Đây là biểu hiện của bản lĩnh lãnh đạo thực thụ: dũng cảm nói sự thật và đặt kết quả bền vững của tập thể lên trên.'
      },
      {
        id: 'c3',
        label: 'Tự ý quyết định đổi kế hoạch mà không giải thích hay bàn bạc với ai.',
        reflection: 'Độc đoán sẽ làm mất đi sự đồng lòng và khiến các thành viên cảm thấy không được tôn trọng.'
      }
    ],
    historicalTieIn: {
      event: 'Quyết định hoãn nổ súng tại Mường Phăng (1954)',
      year: '1954',
      howGiapHandled: 'Đại tướng Võ Nguyên Giáp đã bình tĩnh trình bày các khó khăn thực tế, lắng nghe ý kiến của cán bộ chỉ huy và kiên trì thuyết phục toàn Đảng ủy mặt trận đổi sang "Đánh chắc tiến chắc".',
      coreValue: 'Bản lĩnh trách nhiệm, tôn trọng quy luật khách quan và tôn trọng sinh mạng con người.'
    }
  },
  {
    id: 'sim-2',
    title: 'Tình huống: Thích ứng khi hoàn cảnh thay đổi bất ngờ',
    context: 'Bạn chuẩn bị rất kỹ cho một bài thuyết trình nhóm, nhưng đúng ngày thi, máy chiếu bị hỏng và tài liệu in ấn bị thất lạc.',
    dilemma: 'Bạn sẽ phản ứng như thế nào trước biến cố bất ngờ ngoài dự kiến?',
    choices: [
      {
        id: 'c2-1',
        label: 'Hoảng sợ, xin thầy cô hoãn bài thi vì lý do khách quan.',
        reflection: 'Dễ dàng bỏ cuộc trước nghịch cảnh sẽ cản trở sự trưởng thành của bạn.'
      },
      {
        id: 'c2-2',
        label: 'Bình tĩnh hội ý nhanh cùng bạn, chuyển sang hình thức diễn thuyết tự nhiên kết hợp vẽ sơ đồ tóm tắt lên bảng đen.',
        reflection: 'Tinh thần thích ứng linh hoạt và làm chủ hoàn cảnh, biến khó khăn thành cơ hội thể hiện sự tự tin.'
      }
    ],
    historicalTieIn: {
      event: 'Đào chiến hào bao vây Điện Biên Phủ',
      year: '1954',
      howGiapHandled: 'Khi pháo binh chưa thể áp đảo hỏa lực địch, Đại tướng đã chỉ đạo chuyển hướng sáng tạo: đào đường hào bao vây siết chặt, hạn chế tối đa uy lực máy bay địch.',
      coreValue: 'Khả năng thích ứng và đổi mới sáng tạo trong hoàn cảnh ngặt nghèo.'
    }
  }
];

// 6. HUY HIỆU KHÁM PHÁ (Yêu cầu 12)
export const DISCOVERY_BADGES: DiscoveryBadge[] = [
  {
    id: 'b-historian',
    name: 'Nhà khám phá Lịch sử',
    description: 'Đã hoàn thành khám phá Dòng thời gian biên niên sử 103 năm của Đại tướng.',
    icon: 'Compass',
    unlocked: true,
    unlockedAt: 'Hôm nay',
    category: 'timeline'
  },
  {
    id: 'b-archive-seeker',
    name: 'Người tìm hiểu Tư liệu',
    description: 'Đã xem và đối chiếu các tài liệu lưu trữ, văn bản sắc lệnh và ảnh lịch sử quý.',
    icon: 'FileText',
    unlocked: true,
    unlockedAt: 'Hôm nay',
    category: 'archive'
  },
  {
    id: 'b-milestone-decoder',
    name: 'Người giải mã Dấu mốc',
    description: 'Đã phân tích các quyết định lịch sử và các địa bàn tác chiến quan trọng.',
    icon: 'MapPin',
    unlocked: false,
    category: 'timeline'
  },
  {
    id: 'b-courage-master',
    name: 'Người hiểu Bản lĩnh',
    description: 'Đã khám phá đủ 8 trụ cột phẩm chất bản lĩnh và rút ra bài học cho bản thân.',
    icon: 'Award',
    unlocked: false,
    category: 'courage'
  },
  {
    id: 'b-decision-expert',
    name: 'Người vượt thử thách',
    description: 'Đã hoàn thành các câu hỏi trắc nghiệm và thử thách mô phỏng tình huống.',
    icon: 'ShieldCheck',
    unlocked: false,
    category: 'quiz'
  },
  {
    id: 'b-journal-writer',
    name: 'Người ghi chép Hành trình',
    description: 'Đã ghi lại nhật ký cảm nhận và bài học cá nhân trong sổ tay số.',
    icon: 'BookOpen',
    unlocked: false,
    category: 'journal'
  }
];

// 7. KHU VỰC KIỂM CHỨNG TƯ LIỆU (Yêu cầu 14)
export const VERIFICATION_DATABASE: VerificationSource[] = [
  {
    id: 'v-1',
    subjectTitle: 'Quyết định chuyển phương châm Điện Biên Phủ sáng 26/01/1954',
    sourceDocName: 'Hồi ký "Điện Biên Phủ - Điểm hẹn lịch sử"',
    publisherOrAuthor: 'Đại tướng Võ Nguyên Giáp (thể hiện: nhà văn Hữu Mai) - NXB Quân đội Nhân dân',
    publicationYear: '2001',
    verifiedContent: 'Chi tiết cuộc họp Đảng ủy mặt trận sáng 26/1/1954 và cuộc trao đổi thẳng thắn với Trưởng đoàn cố vấn Vi Quốc Thanh để đi đến quyết định chuyển từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc".',
    verificationQuote: '"Tôi thấy cần phải hoãn cuộc tiến công chiều nay. Địch không còn ở trạng thái lâm thời phòng ngự mà đã trở thành một tập đoàn cứ điểm kiên cố..."'
  },
  {
    id: 'v-2',
    subjectTitle: 'Sắc lệnh số 21 ngày 08/01/1945 bổ nhiệm Giám đốc Nha Lưu trữ',
    sourceDocName: 'Hồ sơ Sắc lệnh Chính phủ Lâm thời Việt Nam Dân chủ Cộng hòa năm 1945',
    publisherOrAuthor: 'Trung tâm Lưu trữ Quốc gia III - Cục Văn thư và Lưu trữ Nhà nước',
    publicationYear: '1945 (bản số hóa 2015)',
    verifiedContent: 'Văn bản gốc có chữ ký của Bộ trưởng Bộ Nội vụ Võ Nguyên Giáp và Bộ trưởng Bộ Quốc gia Giáo dục Vũ Đình Hòe về việc cử ông Ngô Đình Nhu làm Giám đốc Nha Lưu trữ công văn và Thư viện toàn quốc.',
    verificationQuote: '"Hà Nội, ngày 8-1-1945... Bộ trưởng Bộ Nội vụ: Võ Nguyên Giáp (ký)"'
  },
  {
    id: 'v-3',
    subjectTitle: 'Mệnh lệnh Thần tốc ngày 07/04/1975',
    sourceDocName: 'Tổng hành dinh trong Mùa xuân toàn thắng',
    publisherOrAuthor: 'Đại tướng Võ Nguyên Giáp - NXB Chính trị Quốc gia Sự thật',
    publicationYear: '2000',
    verifiedContent: 'Bức điện khẩn số 157/TK ngày 7/4/1975 gửi các cánh quân đang tiến vào giải phóng miền Nam.',
    verificationQuote: '"Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa; tranh thủ từng giờ, từng phút; xông lên toàn thắng..."'
  },
  {
    id: 'v-4',
    subjectTitle: 'Lời căn dặn của Chủ tịch Hồ Chí Minh trước Chiến dịch Điện Biên Phủ',
    sourceDocName: 'Hồ Chí Minh Toàn tập - Tập 8',
    publisherOrAuthor: 'NXB Chính trị Quốc gia Sự thật',
    publicationYear: '2011',
    verifiedContent: 'Cuộc gặp giữa Bác Hồ và Đại tướng tại Khuổi Tát (Định Hóa, Thái Nguyên) trước khi Đại tướng lên đường ra mặt trận.',
    verificationQuote: '"Tướng quân tại ngoại, trao cho chú toàn quyền quyết định... Chắc thắng mới đánh, không chắc thắng không đánh."'
  }
];

// 8. DỮ LIỆU KHẢO SÁT MẪU (Yêu cầu 15 & 16)
export const DEFAULT_SURVEY_DATA: PerceptionSurveyData = {
  preExperience: {
    knowledgeLevel: 2,
    interestLevel: 3,
    memoryMilestones: 2,
    courageAwareness: 3
  },
  postExperience: {
    knowledgeLevel: 5,
    interestLevel: 5,
    memoryMilestones: 4,
    courageAwareness: 5,
    favoriteMethod: 'Mô phỏng tình huống "Đằng sau một quyết định" & Dòng thời gian tương tác',
    keyGrowthReflection: 'Em hiểu rõ hơn rằng bản lĩnh không phải là sự liều lĩnh, mà là tinh thần trách nhiệm sâu sắc và lòng kiên định vì người khác.'
  },
  isPreCompleted: true,
  isPostCompleted: true
};
