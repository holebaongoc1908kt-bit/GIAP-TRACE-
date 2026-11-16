import { 
  TimelineMilestone, 
  MapLocation, 
  CampaignData, 
  ArchiveItem, 
  InsightCard, 
  QuizQuestion, 
  MatchPairItem, 
  TimelineOrderMilestone 
} from '../types';
import { ASSET_PATHS } from '../assets/images/imageAssets';
import { getCuratedImage, SLOT_IMAGE_URLS } from './giapImageMap.generated';

/**
 * CƠ SỞ DỮ LIỆU MẪU (STRUCTURED PLACEHOLDER)
 * Tuân thủ yêu cầu: Dữ liệu mẫu chuẩn hóa, không bịa nguồn hay sự kiện giả.
 * Sẵn sàng cho người dùng nạp dữ liệu lịch sử được kiểm định chính thức.
 */

// 1. DÒNG CHẢY CUỘC ĐỜI (TIMELINE)
export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm1',
    year: '1911',
    title: 'Cội nguồn quê hương An Xá, Lệ Thủy',
    shortDesc: 'Giai đoạn tuổi thơ bên dòng Kiến Giang, cội nguồn hình thành nhân cách và tình yêu non sông tha thiết.',
    fullDesc: 'Sinh ngày 25/8/1911 tại làng An Xá, xã Lộc Thủy, huyện Lệ Thủy, tỉnh Quảng Bình trong gia đình nhà nho yêu nước. Tuổi thơ ấu được tắm mát bằng truyền thống quật cường chống ngoại xâm của cha ông.',
    image: getCuratedImage('museumData__001__GIAP_BIRTHPLACE_ROOM'),
    location: 'Lệ Thủy, Quảng Bình',
    period: 'Thời niên thiếu & Cội nguồn',
    roleOfGeneral: 'Người con ưu tú của quê hương gió lào cát trắng, sớm tiếp thu tinh thần quật khởi yêu nước.',
    memorablePoint: 'Làng An Xá bên dòng Kiến Giang hiền hòa in đậm câu hát ru và những bài học làm người đầu tiên.',
    courageLesson: 'Gốc rễ của bản lĩnh bắt đầu từ tình yêu tha thiết với quê hương, cội nguồn gia đình và truyền thống dân tộc.',
    relatedArchiveIds: ['arc-01', 'arc-04'],
  },
  {
    id: 'm-thanglong',
    year: '1930 - 1939',
    title: 'Thầy giáo dạy sử trường Tư thục Thăng Long',
    shortDesc: 'Giảng dạy lịch sử hào hùng cho thanh niên yêu nước, tham gia phong trào Mặt trận Dân chủ.',
    fullDesc: 'Tốt nghiệp cử nhân luật, đồng chí tham gia dạy sử và địa lý tại trường Thăng Long (Hà Nội). Bằng lòng nhiệt huyết, thầy giáo Giáp đã gieo mầm lòng yêu nước và ý thức dân tộc vào thế hệ học sinh.',
    image: getCuratedImage('museumData__002__GIAP_YOUNG_SCHOLAR'),
    location: 'Hà Nội',
    period: 'Thời kỳ hoạt động dân chủ',
    roleOfGeneral: 'Thầy giáo dạy lịch sử, nhà báo cách mạng kiên định, người truyền lửa độc lập dân tộc.',
    memorablePoint: 'Từng là một thầy giáo uyên bác trước khi trở thành vị tướng huyền thoại bách chiến bách thắng.',
    courageLesson: 'Khả năng tự học và nắm vững lịch sử là chìa khóa hun đúc nên tầm nhìn và bản lĩnh chiến lược.',
    relatedArchiveIds: ['arc-14-young-scholar', 'arc-06', 'arc-01'],
  },
  {
    id: 'm2',
    year: '1944',
    title: 'Thành lập Đội VN Tuyên truyền Giải phóng quân',
    shortDesc: 'Sự kiện thành lập lực lượng vũ trang cách mạng tiền thân tại khu rừng Trần Hưng Đạo.',
    fullDesc: 'Thực hiện chỉ thị của Bác Hồ, ngày 22/12/1944 tại khu rừng Trần Hưng Đạo (Cao Bằng), đồng chí Võ Nguyên Giáp chỉ huy lễ thành lập 34 chiến sĩ đầu tiên, mở ra lịch sử Quân đội nhân dân anh hùng.',
    image: getCuratedImage('museumData__003__VIETNAM_PEOPLES_ARMY'),
    location: 'Nguyên Bình, Cao Bằng',
    period: 'Chuẩn bị Tổng khởi nghĩa',
    roleOfGeneral: 'Người tổ chức, người chỉ huy trực tiếp Đội Việt Nam Tuyên truyền Giải phóng quân.',
    memorablePoint: '34 chiến sĩ đầu tiên với súng kíp thô sơ đã làm nên chiến thắng giòn giã tại Phai Khắt, Nà Ngần.',
    courageLesson: 'Ý chí kiên định: Bắt đầu từ những việc nhỏ bé nhất với niềm tin son sắt vào sức mạnh đại đoàn kết.',
    relatedArchiveIds: ['arc-02', 'arc-06'],
  },
  {
    id: 'm-1945',
    year: '1945',
    title: 'Bộ trưởng Nội vụ trong Chính phủ Lâm thời',
    shortDesc: 'Tham gia lãnh đạo Cách mạng Tháng Tám và ký các sắc lệnh nền móng đầu tiên của nền Cộng hòa.',
    fullDesc: 'Sau khi nước Việt Nam Dân chủ Cộng hòa ra đời, đồng chí được giao trọng trách Bộ trưởng Bộ Nội vụ Chính phủ Lâm thời, ký nhiều sắc lệnh thiết lập bộ máy chính quyền công dân dân chủ non trẻ.',
    image: getCuratedImage('museumData__004__GIAP_PROVISIONAL_GOV'),
    location: 'Hà Nội',
    period: 'Cách mạng Tháng Tám & Lập quốc',
    roleOfGeneral: 'Bộ trưởng Bộ Nội vụ, Ủy viên Ban Thường vụ Trung ương Đảng.',
    memorablePoint: 'Ký Sắc lệnh số 21 ngày 8/1/1945 cùng các văn bản xây dựng nền móng thư viện và công vụ quốc gia.',
    courageLesson: 'Tinh thần trách nhiệm và năng lực kiến tạo thể chế nhà nước phục vụ lợi ích tối cao của nhân dân.',
    relatedArchiveIds: ['arc-06', 'arc-01'],
  },
  {
    id: 'm3',
    year: '1950',
    title: 'Chiến dịch Biên Giới Thu - Đông',
    shortDesc: 'Chiến dịch tiến công quy mô lớn đầu tiên phá thế bao vây cô lập căn cứ địa Việt Bắc.',
    fullDesc: 'Vai trò chỉ huy chiến dịch của Đại tướng, việc khai thông biên giới Việt - Trung và bước ngoặt chuyển từ thế phòng ngự sang tiến công giải phóng dải biên cương.',
    image: getCuratedImage('museumData__005__GIAP_DEER_TEAM'),
    location: 'Cao Bằng - Lạng Sơn',
    period: 'Kháng chiến chống Pháp',
    roleOfGeneral: 'Chỉ huy trưởng kiêm Bí thư Đảng ủy Chiến dịch Biên Giới.',
    memorablePoint: 'Chiến dịch đầu tiên tiêu diệt hai binh đoàn thiện chiến Le Page và Charton của quân viễn chinh Pháp.',
    courageLesson: 'Khả năng thích ứng chiến lược: chuyển đổi kịp thời hình thái tác chiến từ du kích sang vận động chiến tập trung.',
    relatedArchiveIds: ['arc-03', 'arc-05'],
  },
  {
    id: 'm4',
    year: '1954',
    title: 'Quyết định lịch sử tại Điện Biên Phủ',
    shortDesc: 'Chuyển phương châm từ "Đánh nhanh thắng nhanh" sang "Đánh chắc tiến chắc" lừng lẫy địa cầu.',
    fullDesc: 'Cuộc đấu trí chiến lược cam go và quyết định khó khăn, dũng cảm nhất trong cuộc đời cầm quân của Tổng Tư lệnh Võ Nguyên Giáp, làm nên chiến thắng Điện Biên Phủ chấn động năm châu.',
    image: getCuratedImage('museumData__006__DIEN_BIEN_FLAG_WIN'),
    location: 'Mường Phăng, Điện Biên',
    period: 'Đỉnh cao chiến thắng 1954',
    roleOfGeneral: 'Tổng Tư lệnh Quân đội nhân dân Việt Nam, Chỉ huy trưởng Chiến dịch Điện Biên Phủ.',
    memorablePoint: '56 ngày đêm "khoét núi, ngủ hầm, mưa dầm, cơm vắt", đập tan pháo đài bất khả xâm phạm.',
    courageLesson: 'Bản lĩnh tối cao: Dũng cảm đi ngược lại định kiến đám đông để bảo vệ chân lý thực tiễn và sinh mạng của chiến sĩ.',
    relatedArchiveIds: ['arc-03', 'arc-07', 'arc-08'],
  },
  {
    id: 'm5',
    year: '1975',
    title: 'Chiến dịch Hồ Chí Minh lịch sử',
    shortDesc: 'Mệnh lệnh "Thần tốc, thần tốc hơn nữa; táo bạo, táo bạo hơn nữa" giải phóng miền Nam.',
    fullDesc: 'Hệ thống chỉ huy tại Tổng hành dinh (Nhà D67) và sự chỉ đạo kịp thời, chớp thời cơ chiến lược thống nhất non sông vẻ vang vào trưa ngày 30/4/1975.',
    image: getCuratedImage('museumData__007__MUSEUM_TANK_HALL'),
    location: 'Hà Nội - Sài Gòn',
    period: 'Kháng chiến chống Mỹ thống nhất đất nước',
    roleOfGeneral: 'Bí thư Quân ủy Trung ương, Bộ trưởng Bộ Quốc phòng, Tổng Tư lệnh Quân đội nhân dân Việt Nam.',
    memorablePoint: 'Bức điện mật lịch sử ngày 7/4/1975 truyền lửa xốc tới cho toàn thể các cánh quân giải phóng.',
    courageLesson: 'Tầm nhìn nhạy bén chớp thời cơ lịch sử: Khi thời cơ đến, phải quyết đoán, thần tốc để biến tiềm năng thành thắng lợi trọn vẹn.',
    relatedArchiveIds: ['arc-02', 'arc-05'],
  },
  {
    id: 'm-senior',
    year: '1976 - 2013',
    title: 'Trọn đời vì nước, vì dân & Dấu ấn khoa học',
    shortDesc: 'Cống hiến cho sự nghiệp phát triển khoa học - công nghệ, giáo dục và đại đoàn kết toàn dân.',
    fullDesc: 'Trong cương vị Phó Chủ tịch Hội đồng Bộ trưởng phụ trách khoa học - kỹ thuật, Đại tướng luôn dành tâm huyết phát triển trí tuệ Việt Nam, bảo vệ môi trường biển đảo và cổ vũ khuyến học.',
    image: getCuratedImage('museumData__008__GIAP_WITH_YOUTH'),
    location: 'Hà Nội',
    period: 'Thời kỳ xây dựng đất nước',
    roleOfGeneral: 'Phó Chủ tịch Hội đồng Bộ trưởng, Chủ tịch danh dự Hội Khuyến học Việt Nam.',
    memorablePoint: 'Bức ảnh Đại tướng tuổi cao trong quân phục trang trọng luôn nhắc nhở thế hệ trẻ về tinh thần tự tôn dân tộc.',
    courageLesson: 'Tinh thần vì cộng đồng: Sống trọn đời cống hiến thanh bạch, không bao giờ ngơi nghỉ vì tương lai của non sông.',
    relatedArchiveIds: ['arc-01', 'arc-06'],
  },
  {
    id: 'm6',
    year: '2013',
    title: 'Vũng Chùa - Đảo Yến, Quảng Bình',
    shortDesc: 'Nơi yên nghỉ vĩnh hằng giữa vòng tay non sông và tấm lòng kính yêu của triệu triệu người dân.',
    fullDesc: 'Dấu ấn bất tử của vị Tổng Tư lệnh trọn đời vì nước vì dân, trở về với đất mẹ Quảng Bình trong niềm tiếc thương vô hạn của toàn dân tộc và bạn bè quốc tế.',
    image: getCuratedImage('museumData__009__GIAP_MEMORIAL_ALTAR'),
    location: 'Quảng Trạch, Quảng Bình',
    period: 'Dấu ấn trường tồn',
    roleOfGeneral: 'Đại tướng Tổng Tư lệnh trong lòng nhân dân muôn đời.',
    memorablePoint: 'Dòng người dài vô tận xếp hàng tiễn đưa Đại tướng tại Nhà tang lễ và trên khắp các nẻo đường quê hương.',
    courageLesson: 'Đức khiêm nhường và sự vĩ đại đích thực: Người sống mãi trong lòng dân là người đã sống trọn vẹn vì nhân dân.',
    relatedArchiveIds: ['arc-01', 'arc-08'],
  },
];

// 2. DẤU CHÂN LỊCH SỬ (BẢN ĐỒ TƯƠNG TÁC)
export const MAP_LOCATIONS: MapLocation[] = [
  {
    id: 'loc-1',
    name: 'Quê hương Lệ Thủy',
    region: 'Bắc Trung Bộ',
    shortDesc: 'Nơi cội nguồn dòng sông Kiến Giang, khởi đầu hành trình một nhân cách lớn.',
    fullDesc: 'Khu lưu niệm nhà lưu niệm thời niên thiếu, gắn liền với dòng sông Kiến Giang và truyền thống yêu nước nồng nàn của quê hương Quảng Bình.',
    image: getCuratedImage('museumData__010__GIAP_BIRTHPLACE_ROOM'),
    mapCoordinates: { x: 52, y: 48 }, // Vị trí Quảng Bình
    associatedYear: '1911',
    milestoneId: 'm1',
    tags: ['Cội nguồn', 'Quê hương', 'Ấu thơ'],
  },
  {
    id: 'loc-2',
    name: 'Khu rừng Trần Hưng Đạo',
    region: 'Cao Bằng (Việt Bắc)',
    shortDesc: 'Khai sinh Đội Việt Nam Tuyên truyền Giải phóng quân với 34 chiến sĩ.',
    fullDesc: 'Nơi diễn ra lễ tuyên thệ thành lập quân đội ngày 22/12/1944 dưới tán rừng nguyên sinh đại ngàn của núi rừng Cao Bằng.',
    image: getCuratedImage('museumData__011__GIAP_REVIEW_TROOPS'),
    mapCoordinates: { x: 50, y: 14 }, // Cao Bằng
    associatedYear: '1944',
    milestoneId: 'm2',
    tags: ['Quân đội', 'Cao Bằng', 'Khai sinh'],
  },
  {
    id: 'loc-3',
    name: 'An toàn khu (ATK) Định Hóa',
    region: 'Thái Nguyên',
    shortDesc: 'Thủ đô gió ngàn, nơi đưa ra những quyết sách mang tầm chiến lược.',
    fullDesc: 'Căn cứ địa trung ương thời kỳ kháng chiến chống thực dân Pháp, nơi Trung ương Đảng và Bác Hồ cùng Đại tướng đưa ra các quyết sách lịch sử.',
    image: getCuratedImage('museumData__012__GIAP_WITH_UNCLE_HO'),
    mapCoordinates: { x: 48, y: 22 }, // Thái Nguyên
    associatedYear: '1947 - 1954',
    milestoneId: 'm3',
    tags: ['ATK', 'Thái Nguyên', 'Thủ đô kháng chiến'],
  },
  {
    id: 'loc-4',
    name: 'Sở chỉ huy Mường Phăng',
    region: 'Điện Biên',
    shortDesc: 'Nơi diễn ra những cuộc họp cân não và quyết định chuyển phương châm tác chiến.',
    fullDesc: 'Trụ sở hầm chỉ huy của Đại tướng tại thung lũng Mường Phăng trong suốt 56 ngày đêm chiến dịch Điện Biên Phủ lịch sử.',
    image: getCuratedImage('museumData__013__GIAP_MUONG_PHANG_HQ'),
    mapCoordinates: { x: 26, y: 19 }, // Điện Biên
    associatedYear: '1954',
    milestoneId: 'm4',
    tags: ['Điện Biên Phủ', 'Mường Phăng', 'Bản lĩnh'],
  },
  {
    id: 'loc-5',
    name: 'Tổng hành dinh (Hầm D67)',
    region: 'Hoàng thành Thăng Long, Hà Nội',
    shortDesc: 'Trung tâm chỉ huy tác chiến chiến lược trong cuộc kháng chiến chống Mỹ cứu nước.',
    fullDesc: 'Di tích cách mạng ghi dấu các cuộc họp của Bộ Chính trị và Quân ủy Trung ương đưa ra các quyết sách lịch sử mùa Xuân năm 1975.',
    image: getCuratedImage('museumData__014__D67_BUNKER_COMMAND'),
    mapCoordinates: { x: 46, y: 26 }, // Hà Nội
    associatedYear: '1968 - 1975',
    milestoneId: 'm5',
    tags: ['Hà Nội', 'Nhà D67', 'Chỉ huy chiến lược'],
  },
  {
    id: 'loc-6',
    name: 'Vũng Chùa - Đảo Yến',
    region: 'Quảng Bình',
    shortDesc: 'Nơi yên nghỉ thanh thản của Đại tướng nhìn ra biển Đông bao la.',
    fullDesc: 'Quần thể phong cảnh hữu tình nơi Đại tướng chọn làm nơi an giấc ngàn thu, hướng mắt che chở biển đảo quê hương đất mẹ.',
    image: getCuratedImage('museumData__015__GIAP_ANCESTRAL_ALTAR'),
    mapCoordinates: { x: 53, y: 46 }, // Vũng Chùa Quảng Bình
    associatedYear: '2013',
    milestoneId: 'm6',
    tags: ['Tưởng niệm', 'Biển đảo', 'Bất tử'],
  },
];

// 3. GIẢI MÃ CHIẾN DỊCH (TRUNG TÂM CHỈ HUY QUÂN SỰ)
export const CAMPAIGN_SAMPLE_DATA: CampaignData = {
  id: 'dien-bien-phu',
  name: 'Chiến dịch Điện Biên Phủ (1954)',
  commandBrief: 'Phân tích bản lĩnh và tư duy khoa học quân sự thực tiễn của Tổng Tư lệnh trong quyết định chuyển đổi phương châm tác chiến.',
  strategicParadigm: {
    initial: {
      title: 'Phương châm ban đầu: "Đánh nhanh thắng nhanh"',
      description: 'Dự kiến tập trung toàn bộ binh lực đánh dồn dập trong khoảng 3 đêm 2 ngày khi tập đoàn cứ điểm của địch chưa được củng cố hoàn chỉnh.'
    },
    revised: {
      title: 'Quyết định lịch sử: Chuyển sang "Đánh chắc tiến chắc"',
      description: 'Quyết định dời ngày nổ súng, kéo pháo ra, chuyển sang thế bao vây bóc dỡ từng cụm cứ điểm với nguyên tắc cốt lõi: "Chắc thắng mới đánh, không chắc thắng không đánh".',
      historicalSignificance: 'Bảo toàn tuyệt đối lực lượng vũ trang nòng cốt và bảo đảm thắng lợi trọn vẹn của chiến dịch then chốt quyết định cục diện hòa bình.'
    }
  },
  stages: [
    {
      id: 'stg-1',
      code: 'ĐỢT 1',
      title: 'Tiến công phân khu phía Bắc',
      timeframe: '13/03 - 17/03/1954',
      brief: 'Tiêu diệt các cụm cứ điểm Him Lam, Độc Lập, bức hàng Bản Kéo, mở toang cánh cửa phía Bắc.',
      tacticalPoints: [
        'Hỏa lực pháo binh tập trung bất ngờ làm tê liệt sân bay',
        'Chiến thuật vây lấn từng bước bằng hệ thống giao thông hào'
      ],
      keyDecision: 'Kiểm tra kỹ lưỡng công tác chuẩn bị trước giờ nổ súng.'
    },
    {
      id: 'stg-2',
      code: 'ĐỢT 2',
      title: 'Đột phá dãy đồi phía Đông',
      timeframe: '30/03 - 30/04/1954',
      brief: 'Cuộc chiến giành giật quyết liệt tại các cứ điểm then chốt A1, C1, D1; thắt chặt vòng vây bóp nghẹt tiếp viện hàng không.',
      tacticalPoints: [
        'Đào chiến hào tiến sát hàng rào đối phương',
        'Đoạt từng tấc đất trên đồi A1 với công sự ngầm kiên cố'
      ],
      keyDecision: 'Khắc phục tư tưởng nôn nóng, củng cố trận địa chiến hào kiên nhẫn.'
    },
    {
      id: 'stg-3',
      code: 'ĐỢT 3',
      title: 'Tổng công kích dứt điểm',
      timeframe: '01/05 - 07/05/1954',
      brief: 'Đánh chiếm toàn bộ các cứ điểm còn lại, tiến thẳng vào Sở chỉ huy De Castries, giành toàn thắng.',
      tacticalPoints: [
        'Điểm hỏa khối bộc phá nghìn cân tại đồi A1',
        'Tổng tiến công đồng loạt trên các hướng không cho địch co cụm'
      ],
      keyDecision: 'Chớp thời cơ tổng công kích sớm hơn kế hoạch khi phòng tuyến địch tan rã.'
    }
  ]
};

// 4. KHO TƯ LIỆU SỐ (DIGITAL ARCHIVES)
export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'arc-01',
    title: 'Chân dung Đại tướng Võ Nguyên Giáp nụ cười dung dị',
    type: 'image',
    source: 'Lưu trữ tư liệu số hóa GIAP TRACE',
    thumbnail: getCuratedImage('museumData__016__PORTRAIT_GENERAL'),
    details: 'Bản quét phim tư liệu lịch sử độ phân giải cao phục vụ triển lãm số, ghi lại phong thái ung dung, đôn hậu của Đại tướng.',
    catalogNumber: 'DOC-IMG-1944-01',
    yearPlaceholder: '1944-1950'
  },
  {
    id: 'arc-02',
    title: 'Hiện vật Xe tăng 843 - Bảo tàng Lịch sử Quân sự Việt Nam',
    type: 'artifact',
    source: 'Bảo tàng Lịch sử Quân sự Việt Nam [Bảo vật Quốc gia]',
    thumbnail: getCuratedImage('museumData__017__MUSEUM_TANK_HALL'),
    details: 'Xe tăng T-54B số hiệu 843 húc nghiêng cổng phụ Dinh Độc Lập trưa ngày 30/4/1975, biểu tượng của đại thắng mùa Xuân toàn thắng thống nhất non sông.',
    catalogNumber: 'DOC-ART-1975-843',
    yearPlaceholder: '1975'
  },
  {
    id: 'arc-03',
    title: 'Bản đồ diễn tập và tác chiến chỉ huy chiến dịch',
    type: 'map',
    source: 'Bản đồ quân sự tác chiến số hóa',
    thumbnail: getCuratedImage('museumData__018__TACTICAL_BRIEFING_MAP'),
    details: 'Sơ đồ diễn tập và kế hoạch tác chiến phòng không, điều hành các mũi tiến công hiệp đồng quân binh chủng.',
    catalogNumber: 'DOC-MAP-1954-03',
    yearPlaceholder: '1954'
  },
  {
    id: 'arc-04',
    title: 'Đội hình Quân đội Nhân dân Việt Nam anh hùng',
    type: 'artifact',
    source: 'Lực lượng vũ trang nhân dân Việt Nam',
    thumbnail: getCuratedImage('museumData__019__VIETNAM_PEOPLES_ARMY'),
    details: 'Đội ngũ chỉnh tề, khí phách kiên cường tiếp nối truyền thống bộ đội Cụ Hồ từ 34 chiến sĩ đầu tiên.',
    catalogNumber: 'DOC-ART-QĐND-01',
    yearPlaceholder: 'Hiện đại'
  },
  {
    id: 'arc-05',
    title: 'Thước phim tư liệu: Vị Tướng của Nhân dân qua thế kỷ',
    type: 'video',
    source: 'Kho phim tư liệu trung ương',
    thumbnail: getCuratedImage('museumData__020__HERO_FLAG_GENERAL'),
    details: 'Trích đoạn video tư liệu quý báu về cuộc đời, sự nghiệp và nhân cách cao đẹp của Đại tướng Võ Nguyên Giáp.',
    catalogNumber: 'DOC-VID-2004-12',
    yearPlaceholder: '2004'
  },
  {
    id: 'arc-06',
    title: 'Bút tích ghi chú phương châm tác chiến lịch sử',
    type: 'document',
    source: 'Văn bản bảo tàng số',
    thumbnail: getCuratedImage('museumData__021__GIAP_SIGNATURE'),
    details: 'Bút tích ghi lại suy tư về sinh mạng bộ đội và nguyên tắc sắt đá: "Chắc thắng mới đánh, không chắc thắng không đánh".',
    catalogNumber: 'DOC-TXT-1954-01',
    yearPlaceholder: '1954'
  },
  {
    id: 'arc-07',
    title: 'Đàm phán ngoại giao quân sự bảo vệ độc lập 1946',
    type: 'image',
    source: 'Ảnh tư liệu lịch sử Hà Nội 1946',
    thumbnail: getCuratedImage('museumData__022__GIAP_MEETING_1946'),
    details: 'Tư liệu lịch sử ghi lại bản lĩnh ngoại giao kiên định và mềm mỏng của Đại tướng trong các cuộc đàm phán cam go với phía Pháp năm 1946.',
    catalogNumber: 'DOC-IMG-1946-05',
    yearPlaceholder: '1946'
  },
  {
    id: 'arc-08',
    title: 'Sa bàn địa hình quân sự tương tác 3D',
    type: 'map',
    source: 'Mô hình số hóa địa không gian',
    thumbnail: getCuratedImage('museumData__023__CAMPAIGN_MAP'),
    details: 'Dữ liệu mô hình hóa địa hình lòng chảo Mường Thanh và các cụm cứ điểm bao bọc.',
    catalogNumber: 'DOC-MAP-3D-08',
    yearPlaceholder: '1954'
  },
  {
    id: 'arc-09-sig',
    title: 'Bút tích chữ ký gốc Đại tướng Võ Nguyên Giáp',
    type: 'document',
    source: 'Trung tâm Lưu trữ Quốc gia & Bảo tàng Lịch sử Quân sự Việt Nam',
    thumbnail: getCuratedImage('museumData__024__GIAP_BRONZE_BUST'),
    details: 'Tác phẩm điêu khắc nghệ thuật bán thân đồng Đại tướng lưu giữ trang trọng tại bảo tàng quân sự.',
    catalogNumber: 'DOC-SIG-VNG-01',
    yearPlaceholder: 'Lịch sử'
  },
  {
    id: 'arc-10-uncle-ho',
    title: 'Ảnh tư liệu: Đại tướng Võ Nguyên Giáp cùng Chủ tịch Hồ Chí Minh',
    type: 'image',
    source: 'Bảo tàng Hồ Chí Minh & Thông tấn xã Việt Nam',
    thumbnail: getCuratedImage('museumData__025__GIAP_WITH_UNCLE_HO'),
    details: 'Bức ảnh lịch sử ghi lại khoảnh khắc hai nhân cách lớn của dân tộc bên nhau trong những năm tháng gian lao xây dựng nền độc lập.',
    catalogNumber: 'DOC-IMG-VNG-HCM-02',
    yearPlaceholder: '1945-1950'
  },
  {
    id: 'arc-11-decree',
    title: 'Sắc lệnh số 21 ngày 8/1/1945 do Bộ trưởng Võ Nguyên Giáp ký',
    type: 'document',
    source: 'Trung tâm Lưu trữ Quốc gia III (Bộ Nội vụ 1945)',
    thumbnail: getCuratedImage('museumData__026__GIAP_DECREE_1945'),
    details: 'Văn bản gốc ban hành bởi Chính phủ Lâm thời Việt Nam Dân chủ Cộng hòa mang chữ ký của Bộ trưởng Nội vụ Võ Nguyên Giáp và Bộ trưởng Quốc gia Giáo dục Vũ Đình Hòe.',
    catalogNumber: 'DOC-LEG-1945-21',
    yearPlaceholder: '1945'
  },
  {
    id: 'arc-12-senior',
    title: 'Tượng vàng lưu niệm Đại tướng Tổng tư lệnh Điện Biên Phủ',
    type: 'artifact',
    source: 'Hiện vật kỷ niệm chiến thắng Điện Biên Phủ',
    thumbnail: getCuratedImage('museumData__027__GIAP_GOLDEN_BUST_DIENBIEN'),
    details: 'Pho tượng mạ vàng tôn vinh Đại tướng Tổng Tư lệnh kiệt xuất cùng bản lĩnh chuyển hướng chiến dịch Điện Biên Phủ.',
    catalogNumber: 'DOC-IMG-MEDAL-04',
    yearPlaceholder: 'Thập niên 2000'
  },
  {
    id: 'arc-13-memorial',
    title: 'Lễ duyệt binh hào hùng tại Quảng trường Ba Đình Hà Nội',
    type: 'image',
    source: 'Bảo tàng Lịch sử Quân sự Việt Nam',
    thumbnail: getCuratedImage('museumData__028__GIAP_HANOI_FLAG_REVIEW'),
    details: 'Tư liệu lịch sử Đại tướng Võ Nguyên Giáp duyệt đội ngũ quân đội dưới bóng cờ đỏ sao vàng tung bay rực rỡ.',
    catalogNumber: 'DOC-EXH-ALTAR-05',
    yearPlaceholder: 'Lịch sử'
  },
  {
    id: 'arc-14-young-scholar',
    title: 'Thầy giáo Võ Nguyên Giáp trường Tư thục Thăng Long',
    type: 'image',
    source: 'Tư liệu lịch sử phong trào Mặt trận Dân chủ & Trường Thăng Long (Hà Nội)',
    thumbnail: getCuratedImage('museumData__029__GIAP_YOUNG_SCHOLAR'),
    details: 'Chân dung người trí thức trẻ yêu nước Võ Nguyên Giáp thời kỳ giảng dạy lịch sử tại trường Thăng Long, truyền cảm hứng và tinh thần quật khởi dân tộc cho thế hệ trẻ học sinh.',
    catalogNumber: 'DOC-IMG-SCHOLAR-1930',
    yearPlaceholder: '1930 - 1939'
  }
];

// 5. GÓC CHƯA BIẾT (INSIGHT CARDS - DƯỚI 50 TỪ THEO YÊU CẦU)
export const INSIGHT_CARDS: InsightCard[] = [
  {
    id: 'ins-1',
    title: 'Thầy giáo dạy sử thành vị Tổng Tư lệnh',
    briefExcerpt: 'Xuất thân là một giáo viên dạy lịch sử tại trường Thăng Long, ông đã biến những bài học lịch sử thành nghệ thuật quân sự tài ba.',
    image: getCuratedImage('museumData__030__GIAP_YOUNG_SCHOLAR'),
    category: 'Nhân cách & Trí tuệ',
    readTime: '1 phút',
    curatorNote: 'Nền tảng tri thức uyên bác, tư duy sư phạm và nhãn quan chiến lược sâu sắc của Đại tướng.'
  },
  {
    id: 'ins-2',
    title: 'Đêm thức trắng tại thung lũng Mường Phăng',
    briefExcerpt: 'Cơn đau đầu dai dẳng và chiếc khăn ướt đắp trán trong đêm 25/1/1954 đã chứng kiến một trong những quyết định dũng cảm nhất lịch sử quân sự.',
    image: getCuratedImage('museumData__031__GIAP_MUONG_PHANG_HQ'),
    category: 'Khoảnh khắc lịch sử',
    readTime: '1 phút',
    curatorNote: 'Bản lĩnh dám chịu trách nhiệm tối cao trước lịch sử và trước sinh mạng của hàng vạn cán bộ chiến sĩ.'
  },
  {
    id: 'ins-3',
    title: 'Tình yêu vĩ đại dành cho cây đàn dương cầm',
    briefExcerpt: 'Giữa những bộn bề quân vụ và chính trường, tiếng đàn piano là nơi ông tìm về sự thanh thản trong tâm hồn, thể hiện tình yêu nghệ thuật sâu sắc.',
    image: getCuratedImage('museumData__032__GIAP_COMMEMORATIVE_PLATE'),
    category: 'Đời thường dung dị',
    readTime: '1 phút',
    curatorNote: 'Khía cạnh đời sống tâm hồn tinh tế, thanh cao của một danh tướng văn võ song toàn.'
  },
  {
    id: 'ins-4',
    title: 'Vị tướng luôn coi trọng từng giọt máu chiến sĩ',
    briefExcerpt: 'Nguyên tắc bất di bất dịch của ông là hạn chế tối đa thương vong cho binh lính, lấy trí tuệ và sự chuẩn bị chu đáo để khắc chế sức mạnh vũ khí đối phương.',
    image: getCuratedImage('museumData__033__INSIGHTS_GENERAL_ORIGIN'),
    category: 'Triết lý cầm quân',
    readTime: '1 phút',
    curatorNote: 'Tinh thần nhân văn quân sự cốt lõi: người cầm quân vĩ đại là người biết xót thương từng giọt máu của người lính.'
  }
];

// 6. THỬ THÁCH LỊCH SỬ (CHALLENGES)
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q-1',
    question: 'Quyết định chuyển phương châm tại Điện Biên Phủ từ "Đánh nhanh thắng nhanh" sang phương châm nào?',
    options: [
      'Phòng ngự phản công',
      'Đánh chắc, tiến chắc',
      'Chiến tranh tổng lực',
      'Bao vây cô lập'
    ],
    correctIndex: 1,
    explanation: 'Quyết định chuyển sang "Đánh chắc tiến chắc" là quyết định bản lĩnh then chốt bảo đảm thắng lợi.'
  },
  {
    id: 'q-2',
    question: 'Đội Việt Nam Tuyên truyền Giải phóng quân thành lập năm 1944 có bao nhiêu chiến sĩ đầu tiên?',
    options: [
      '12 chiến sĩ',
      '34 chiến sĩ',
      '50 chiến sĩ',
      '100 chiến sĩ'
    ],
    correctIndex: 1,
    explanation: 'Đội gồm 34 chiến sĩ ban đầu dưới sự chỉ huy của đồng chí Võ Nguyên Giáp tại Cao Bằng.'
  },
  {
    id: 'q-3',
    question: 'Trọng tâm triết lý cầm quân của Đại tướng Võ Nguyên Giáp luôn đề cao điều gì?',
    options: [
      'Thắng bằng mọi giá bất chấp tổn thất',
      'Chắc thắng mới đánh, coi trọng sinh mạng chiến sĩ',
      'Phụ thuộc vào viện trợ vũ khí nặng',
      'Tấn công phủ đầu chớp nhoáng'
    ],
    correctIndex: 1,
    explanation: 'Tư tưởng "Chắc thắng mới đánh, không chắc thắng không đánh" là kim chỉ nam nhân văn kiệt xuất.'
  }
];

export const MATCH_PAIRS: MatchPairItem[] = [
  { id: 'mp-1', leftTitle: 'Cao Bằng (1944)', rightMatch: 'Thành lập Đội VN Tuyên truyền Giải phóng quân' },
  { id: 'mp-2', leftTitle: 'Điện Biên Phủ (1954)', rightMatch: 'Phương châm Đánh chắc tiến chắc' },
  { id: 'mp-3', leftTitle: 'Hà Nội (Nhà D67)', rightMatch: 'Tổng hành dinh Chiến dịch Hồ Chí Minh 1975' },
  { id: 'mp-4', leftTitle: 'Quảng Bình (Vũng Chùa)', rightMatch: 'Nơi an nghỉ vĩnh hằng nhìn ra biển Đông' }
];

export const TIMELINE_SORT_ITEMS: TimelineOrderMilestone[] = [
  { id: 'so-1', title: 'Thành lập Đội VN Tuyên truyền GPQ', placeholderYear: '1944', correctIndex: 0 },
  { id: 'so-2', title: 'Chiến dịch Biên Giới Thu Đông', placeholderYear: '1950', correctIndex: 1 },
  { id: 'so-3', title: 'Chiến thắng lịch sử Điện Biên Phủ', placeholderYear: '1954', correctIndex: 2 },
  { id: 'so-4', title: 'Đại thắng mùa Xuân thống nhất đất nước', placeholderYear: '1975', correctIndex: 3 }
];
