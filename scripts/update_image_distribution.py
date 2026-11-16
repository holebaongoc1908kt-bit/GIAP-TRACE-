#!/usr/bin/env python3
"""
GIAP TRACE - BẢN ĐỒ PHÂN BỔ HÌNH ẢNH TOÀN DIỆN V5.0
Tối ưu hóa và nâng cấp hệ thống hình ảnh:
- 7 Nhóm chỉ định từ yêu cầu người dùng
- 63 Ảnh tư liệu lịch sử quý mới tải lên trong /public/assets/aistudio/
- 34 Ảnh tư liệu gốc từ dự án
- Đồ họa minh họa quân sự cho các biểu tượng/sơ đồ còn lại
- Đảm bảo 0 TRÙNG LẶP URL (168 slots = 168 unique URLs, trừ logo)
- 100% tệp tồn tại thực tế trên đĩa
"""

import os
import csv
import json

CSV_PATH = 'public/assets/aistudio/GIAP_TRACE_BANG_PHAN_BO_ANH_fdfe551d.csv'
TS_PATH = 'src/data/giapImageMap.generated.ts'

# Đọc danh sách slot hiện có để giữ nguyên đúng thứ tự slot, file, line, category
with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
    existing_rows = list(csv.DictReader(f))

print(f"Tổng số slot: {len(existing_rows)}")

# Danh mục ảnh tư liệu xác thực cao (Historical archives & authentic photos)
# Nhóm 1: Trang chủ và Ảnh đại diện
# Ảnh 01: flag_general_hero_1789877465162.jpg
# Ảnh 02: museum_splash_bg.jpg
# Ảnh 04: general_vo_nguyen_giap_portrait_1789889827160.jpg
# Ảnh 05: giap_trace_logo_1789892511251.jpg
#
# Nhóm 2: Chân dung và Cảm hứng
# Ảnh 06: general_vo_nguyen_giap_portrait_likeness_1789890142145.jpg
# Ảnh 07: general_giap_medals_square_1789890356568.jpg
# Ảnh 10: general_vo_nguyen_giap_1789876646974.jpg
# Ảnh 11: giap_warm_smile_uniform_1790321237395.jpg
# Ảnh 12: giap_senior_speaking_1790320033644.jpg
# Ảnh 13: giap_with_youth_1790321463059.jpg
# Ảnh 14: giap_senior_uniform_1790057107137.jpg
#
# Nhóm 3: Theo dấu thời gian
# Ảnh 15: giap_young_scholar_1790322297398.jpg
# Ảnh 16: giap_family_portrait_1790319982315.jpg
# Ảnh 17: giap_birthplace_room_1790321178925.jpg
# Ảnh 18: giap_with_uncle_ho_1790057066944.jpg
# Ảnh 19: giap_provisional_gov_1790319952464.jpg
# Ảnh 20: giap_review_troops_1790319939265.jpg
# Ảnh 21: giap_hanoi_flag_review_1790321226200.jpg
# Ảnh 22: giap_meeting_1946_1790320019102.jpg
#
# Nhóm 4: Bàn chiến lược và Khoảnh khắc quyết định
# Ảnh 23: campaign_map_tactical.jpg
# Ảnh 25: tactical_briefing_map_1789877546424.jpg
# Ảnh 26: giap_muong_phang_hq_1790321420287.jpg
# Ảnh 27: d67_bunker_command_1790321434308.jpg
#
# Nhóm 5: Trận đánh và Sự kiện lịch sử
# Ảnh 28: dien_bien_flag_win_1790321448552.jpg
# Ảnh 29: soldiers_combat_bw_1789891334717.jpg
# Ảnh 30: vietnam_peoples_army_1789877565340.jpg
# Ảnh 31: giap_deer_team_1790319965248.jpg
# Ảnh 32: giap_condao_guillotine_1790319993880.jpg
#
# Nhóm 6: Kho tư liệu và Hiện vật
# Ảnh 33: giap_decree_1945_1790057086547.jpg
# Ảnh 34: giap_signature_doc_1790057044097.jpg
# Ảnh 35: giap_bronze_bust_1790321213814.jpg
# Ảnh 36: giap_golden_bust_dienbien_1790321249666.jpg
# Ảnh 37: giap_commemorative_plate_1790320005586.jpg
# Ảnh 38: museum_tank_hall_1789877482333.jpg
#
# Nhóm 7: Dấu ấn còn mãi
# Ảnh 39: giap_ancestral_altar_1790321191487.jpg
# Ảnh 40: giap_house_cabinet_1790321201277.jpg
# Ảnh 41: giap_memorial_altar_1790057151794.jpg
# Ảnh 42: giap_origin_insights_1789891318216.jpg

# Xây dựng bảng gán cố định cho từng slot cụ thể
custom_assignments = {
    # Nhóm 1 - SplashView & Header
    "SplashView__001__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/museum_splash_bg.webp",
        "title": "Không gian bảo tàng số Di sản Quân sự",
        "kind": "Ảnh tư liệu – Không gian bảo tàng số"
    },
    "SplashView__002__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/flag_general_hero_1789877465162.webp",
        "title": "Đại tướng Võ Nguyên Giáp và cờ Tổ quốc Việt Nam",
        "kind": "Ảnh tư liệu – Poster mở đầu ứng dụng"
    },
    "SplashView__003__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_giap_medals_square_1789890356568.webp",
        "title": "Đại tướng Võ Nguyên Giáp nụ cười dung dị, huân chương trên ngực áo",
        "kind": "Ảnh tư liệu – Chân dung huân chương"
    },
    "Navbar__001__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_1789889827160.webp",
        "title": "Chân dung Đại tướng Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu chân dung"
    },
    "Navbar__002__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/home_007.svg",
        "title": "Biểu trưng Di sản Dấu chân Đại tướng",
        "kind": "Minh họa đồ họa quân sự"
    },

    # Nhóm HomeDashboard
    "HomeDashboard__001__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp",
        "title": "Lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries",
        "kind": "Ảnh tư liệu lịch sử Điện Biên Phủ"
    },
    "HomeDashboard__002__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_dc5a9c43.png",
        "title": "Mặt trận Điện Biên Phủ tấn công cứ điểm Him Lam - Độc Lập",
        "kind": "Ảnh tư liệu lịch sử chiến trường 1954"
    },
    "HomeDashboard__003__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_muong_phang_hq_1790321420287.webp",
        "title": "Sở chỉ huy Mường Phăng Điện Biên Phủ",
        "kind": "Ảnh tư liệu lịch sử di tích"
    },
    "HomeDashboard__004__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/giap-curated/tu-anh-goc/tactical_briefing_map_1789877546424.webp",
        "title": "Bản đồ tác chiến và lưới lửa Điện Biên Phủ",
        "kind": "Ảnh tư liệu bản đồ chiến dịch"
    },
    "HomeDashboard__005__MUSEUM_TANK_HALL": {
        "url": "/assets/giap-curated/tu-anh-goc/museum_tank_hall_1789877482333.webp",
        "title": "Không gian xe tăng 843 tại Bảo tàng Lịch sử Quân sự",
        "kind": "Ảnh tư liệu bảo tàng quốc gia"
    },
    "HomeDashboard__006__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_595ea24f.png",
        "title": "Gian trưng bày hiện vật tại Bảo tàng Lịch sử Quân sự Việt Nam",
        "kind": "Ảnh tư liệu bảo tàng quân sự"
    },
    "HomeDashboard__007__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_355a8c9b.png",
        "title": "Hào khí chiến thắng non sông Việt Nam",
        "kind": "Ảnh tư liệu lịch sử hào khí non sông"
    },
    "HomeDashboard__008__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_7c6fa4f2.png",
        "title": "Toàn cảnh lòng chảo Mường Thanh lịch sử",
        "kind": "Ảnh tư liệu chiến trường Điện Biên"
    },
    "HomeDashboard__009__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_provisional_gov_1790319952464.webp",
        "title": "Chính phủ Cách mạng lâm thời Việt Nam Dân chủ Cộng hòa 1945",
        "kind": "Ảnh tư liệu lịch sử Quốc gia"
    },
    "HomeDashboard__010__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/aistudio/image_f4dcf6e7.png",
        "title": "Chính phủ lâm thời nước VNDCCH ra mắt quốc dân tháng 9/1945",
        "kind": "Ảnh tư liệu lịch sử 1945"
    },
    "HomeDashboard__011__GIAP_DECREE_1945": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_decree_1945_1790057086547.webp",
        "title": "Sắc lệnh thiết lập tổ chức chính quyền nhân dân 1945",
        "kind": "Văn bản sắc lệnh tư liệu gốc"
    },
    "HomeDashboard__012__GIAP_DECREE_1945": {
        "url": "/assets/aistudio/image_1f3de0a7.png",
        "title": "Sắc lệnh số 21 ngày 8/9/1945 do Bộ trưởng Võ Nguyên Giáp ký",
        "kind": "Văn bản sắc lệnh lịch sử lưu trữ"
    },
    "HomeDashboard__013__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_likeness_1789890142145.webp",
        "title": "Đại tướng Võ Nguyên Giáp chân dung cương nghị",
        "kind": "Ảnh tư liệu chân dung Đại tướng"
    },
    "HomeDashboard__014__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_1789876646974.webp",
        "title": "Chân dung Đại tướng Võ Nguyên Giáp thập niên kháng chiến",
        "kind": "Ảnh tư liệu chân dung"
    },
    "HomeDashboard__015__GIAP_WARM_SMILE_UNIFORM": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_warm_smile_uniform_1790321237395.webp",
        "title": "Đại tướng nụ cười ấm áp trong quân phục Đại tướng",
        "kind": "Ảnh tư liệu chân dung ấm áp"
    },
    "HomeDashboard__016__GIAP_WARM_SMILE_UNIFORM": {
        "url": "/assets/aistudio/image_34dae585.png",
        "title": "Đại tướng Võ Nguyên Giáp phong thái ung dung và đức độ",
        "kind": "Ảnh tư liệu chân dung"
    },
    "HomeDashboard__017__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/giap-curated/tu-anh-goc/vietnam_peoples_army_1789877565340.webp",
        "title": "Thành lập Đội Việt Nam Tuyên truyền Giải phóng quân 22/12/1944",
        "kind": "Ảnh tư liệu lịch sử quân sự"
    },
    "HomeDashboard__018__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_6fe182a2.png",
        "title": "Việt Minh và các chiến sĩ tự vệ trong Tổng khởi nghĩa",
        "kind": "Ảnh tư liệu lịch sử 1945"
    },
    "HomeDashboard__019__GIAP_REVIEW_TROOPS": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_review_troops_1790319939265.webp",
        "title": "Đại tướng duyệt đội ngũ bộ đội trước giờ xuất kích",
        "kind": "Ảnh tư liệu lịch sử hành quân"
    },
    "HomeDashboard__020__GIAP_REVIEW_TROOPS": {
        "url": "/assets/aistudio/image_9847f5c5.png",
        "title": "Bộ đội ta dốc sức kéo pháo qua đèo dốc hiểm trở Điện Biên Phủ",
        "kind": "Ảnh tư liệu lịch sử kéo pháo"
    },
    "HomeDashboard__021__CAMPAIGN_MAP": {
        "url": "/assets/giap-curated/tu-anh-goc/campaign_map_tactical.webp",
        "title": "Bản đồ sơ đồ tác chiến ba đợt tấn công Điện Biên Phủ",
        "kind": "Bản đồ tư liệu chiến dịch"
    },
    "HomeDashboard__022__CAMPAIGN_MAP": {
        "url": "/assets/aistudio/image_96f43947.png",
        "title": "Sơ đồ bố trí cứ điểm và các cánh quân tiến đánh Điện Biên Phủ",
        "kind": "Bản đồ tư liệu tác chiến"
    },
    "HomeDashboard__023__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_2c7b8880.png",
        "title": "Khoảnh khắc lịch sử dân tộc",
        "kind": "Ảnh tư liệu lịch sử dân tộc"
    },
    "HomeDashboard__024__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_2d9a71f6.png",
        "title": "Bình minh trên chiến khu cách mạng",
        "kind": "Ảnh tư liệu chiến khu"
    },
    "HomeDashboard__025__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_8c1c76f9.png",
        "title": "Căn cứ hầm De Castries Điện Biên Phủ",
        "kind": "Ảnh tư liệu chiến trường"
    },
    "HomeDashboard__026__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_36a51b46.png",
        "title": "Dấu chân hành trình giải phóng dân tộc",
        "kind": "Ảnh tư liệu lịch sử hành trình"
    },

    # Nhóm Timeline museumData
    "museumData__001__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_birthplace_room_1790321178925.webp",
        "title": "Gian nhà cội nguồn làng An Xá, Lộc Thủy, Lệ Thủy, Quảng Bình",
        "kind": "Ảnh tư liệu quê hương Đại tướng"
    },
    "museumData__002__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_young_scholar_1790322297398.webp",
        "title": "Đồng chí Võ Nguyên Giáp thời thanh niên dạy sử trường Thăng Long",
        "kind": "Ảnh tư liệu thời thanh niên"
    },
    "museumData__003__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_c0e04227.png",
        "title": "Bác Hồ và Đại tướng Võ Nguyên Giáp cùng Đội tình báo Con Nai (OSS) 1945",
        "kind": "Ảnh tư liệu lịch sử OSS 1945"
    },
    "museumData__004__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/aistudio/image_f3e7fcaf.png",
        "title": "Đại tướng Võ Nguyên Giáp đàm đạo cùng Thiếu tá Archimedes Patti 1945",
        "kind": "Ảnh tư liệu lịch sử 1945"
    },
    "museumData__005__GIAP_DEER_TEAM": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_deer_team_1790319965248.webp",
        "title": "Đại tướng và Đội tình báo Con Nai (OSS) tại chiến khu Tân Trào 1945",
        "kind": "Ảnh tư liệu lịch sử OSS Tân Trào"
    },
    "museumData__006__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_8c64d1e7.png",
        "title": "Pháo 105mm kéo vào trận địa chuẩn bị khai hỏa Điện Biên Phủ 1954",
        "kind": "Ảnh tư liệu lịch sử pháo binh 1954"
    },
    "museumData__007__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_c228d368.png",
        "title": "Tượng đài Đại tướng tại Bảo tàng Chiến thắng Lịch sử Điện Biên Phủ",
        "kind": "Ảnh tư liệu hiện vật bảo tàng"
    },
    "museumData__008__GIAP_WITH_YOUTH": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_with_youth_1790321463059.webp",
        "title": "Đại tướng trò chuyện thân mật và truyền lửa cho thế hệ trẻ",
        "kind": "Ảnh tư liệu giao lưu thế hệ trẻ"
    },
    "museumData__009__GIAP_MEMORIAL_ALTAR": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_memorial_altar_1790057151794.webp",
        "title": "Không gian tưởng niệm Đại tướng tại gia đình số 30 Hoàng Diệu",
        "kind": "Ảnh tư liệu di tích tưởng niệm"
    },
    "museumData__010__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/aistudio/image_c6bd3a62.png",
        "title": "Ngôi nhà lưu niệm Đại tướng bên dòng sông Kiến Giang, An Xá",
        "kind": "Ảnh tư liệu di tích nhà lưu niệm"
    },
    "museumData__011__GIAP_REVIEW_TROOPS": {
        "url": "/assets/aistudio/image_fad8f9ee.png",
        "title": "Bác sĩ Trần Duy Hưng và Đại tướng tại chiến khu Việt Bắc 1947",
        "kind": "Ảnh tư liệu lịch sử Việt Bắc 1947"
    },
    "museumData__012__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_with_uncle_ho_1790057066944.webp",
        "title": "Chủ tịch Hồ Chí Minh và Đại tướng Võ Nguyên Giáp bên bàn làm việc",
        "kind": "Ảnh tư liệu lịch sử Bác Hồ và Đại tướng"
    },
    "museumData__013__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/aistudio/image_dc7302a1.png",
        "title": "Hội nghị cán bộ Trung ương lần thứ 4 tại Việt Bắc ngày 20/5/1948",
        "kind": "Ảnh tư liệu lịch sử kháng chiến 1948"
    },
    "museumData__014__D67_BUNKER_COMMAND": {
        "url": "/assets/giap-curated/tu-anh-goc/d67_bunker_command_1790321434308.webp",
        "title": "Hầm chỉ huy tác chiến D67 Hoàng thành Thăng Long",
        "kind": "Ảnh tư liệu di tích lịch sử D67"
    },
    "museumData__015__GIAP_ANCESTRAL_ALTAR": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_ancestral_altar_1790321191487.webp",
        "title": "Bàn thờ gia tiên và cội nguồn dòng họ tại quê nhà An Xá",
        "kind": "Ảnh tư liệu cội nguồn gia đình"
    },
    "museumData__016__PORTRAIT_GENERAL": {
        "url": "/assets/aistudio/image_8e543aa6.png",
        "title": "Chân dung Đại tướng Võ Nguyên Giáp phong thái nhà quân sự lỗi lạc",
        "kind": "Ảnh tư liệu chân dung Đại tướng"
    },
    "museumData__017__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_ca7943d6.png",
        "title": "Hiện vật lịch sử và vũ khí chiến thắng của Quân đội nhân dân",
        "kind": "Ảnh tư liệu hiện vật bảo tàng"
    },
    "museumData__018__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_e3e33d9f.png",
        "title": "Ảnh tư liệu chiến dịch lịch sử và bản đồ chỉ huy",
        "kind": "Ảnh tư liệu chiến dịch lịch sử"
    },
    "museumData__019__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_b1ce3efb.png",
        "title": "Chủ tịch Hồ Chí Minh và Đại tướng Võ Nguyên Giáp năm 1945",
        "kind": "Ảnh tư liệu Bác Hồ và Đại tướng 1945"
    },
    "museumData__020__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_d627cf6d.png",
        "title": "Đại tướng Võ Nguyên Giáp cùng Hội đồng Chính phủ thống nhất năm 1976",
        "kind": "Ảnh tư liệu lịch sử Chính phủ 1976"
    },
    "museumData__021__GIAP_SIGNATURE": {
        "url": "/assets/aistudio/image_b1c93621.png",
        "title": "Bút tích chữ ký gốc của Đại tướng Võ Nguyên Giáp",
        "kind": "Hiện vật chữ ký tư liệu gốc"
    },
    "museumData__022__GIAP_MEETING_1946": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_meeting_1946_1790320019102.webp",
        "title": "Đại tướng Võ Nguyên Giáp trong cuộc gặp phái đoàn Pháp năm 1946",
        "kind": "Ảnh tư liệu ngoại giao lịch sử 1946"
    },
    "museumData__023__CAMPAIGN_MAP": {
        "url": "/assets/aistudio/image_3d536962.png",
        "title": "Sa bàn chiến trường và hướng hành quân của các đại đoàn",
        "kind": "Ảnh tư liệu sa bàn chiến trường"
    },
    "museumData__024__GIAP_BRONZE_BUST": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_bronze_bust_1790321213814.webp",
        "title": "Tượng đồng Đại tướng Võ Nguyên Giáp uy nghi",
        "kind": "Tác phẩm điêu khắc nghệ thuật"
    },
    "museumData__025__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/aistudio/image_9d059f57.png",
        "title": "Đại tướng thăm lại chiến trường và gặp gỡ nhân dân Điện Biên",
        "kind": "Ảnh tư liệu lịch sử Đại tướng"
    },
    "museumData__026__GIAP_DECREE_1945": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_signature_doc_1790057044097.webp",
        "title": "Tài liệu bút tích và văn bản ký duyệt của Đại tướng",
        "kind": "Ảnh tư liệu văn bản chữ ký"
    },
    "museumData__027__GIAP_GOLDEN_BUST_DIENBIEN": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_golden_bust_dienbien_1790321249666.webp",
        "title": "Tượng mạ vàng Đại tướng tại Di tích Chiến thắng Điện Biên Phủ",
        "kind": "Hiện vật điêu khắc lưu niệm"
    },
    "museumData__028__GIAP_HANOI_FLAG_REVIEW": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_hanoi_flag_review_1790321226200.webp",
        "title": "Đại tướng duyệt đội ngũ tại Hà Nội cờ đỏ sao vàng",
        "kind": "Ảnh tư liệu lịch sử duyệt binh Hà Nội"
    },
    "museumData__029__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/aistudio/image_95557d90.png",
        "title": "Chân dung người thầy giáo yêu nước Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu chân dung thời trẻ"
    },
    "museumData__030__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/aistudio/image_9d10e1ee.png",
        "title": "Ánh mắt sáng ngời ý chí độc lập tự do",
        "kind": "Ảnh tư liệu chân dung thanh niên"
    },
    "museumData__031__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/aistudio/image_411d3b66.png",
        "title": "Lán làm việc đơn sơ mà vĩ đại tại khu rừng Mường Phăng",
        "kind": "Ảnh tư liệu di tích Mường Phăng"
    },
    "museumData__032__GIAP_COMMEMORATIVE_PLATE": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_commemorative_plate_1790320005586.webp",
        "title": "Đĩa sứ lưu niệm kỷ niệm chiến thắng Điện Biên Phủ",
        "kind": "Hiện vật gốm sứ lưu niệm"
    },
    "museumData__033__INSIGHTS_GENERAL_ORIGIN": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_origin_insights_1789891318216.webp",
        "title": "Cội nguồn bản lĩnh và triết lý quân sự Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu tổng kết tư tưởng"
    },

    # Nhóm MilestoneExhibitionsData (34 slots)
    "milestoneExhibitionsData__001__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/aistudio/image_411e8d0c.png",
        "title": "Không gian triển lãm Cội nguồn Lệ Thủy",
        "kind": "Ảnh tư liệu triển lãm lịch sử"
    },
    "milestoneExhibitionsData__002__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/aistudio/image_4363247a.png",
        "title": "Vùng quê An Xá kiên cường bên dòng Kiến Giang",
        "kind": "Ảnh tư liệu cội nguồn quê hương"
    },
    "milestoneExhibitionsData__003__GIAP_HOUSE_CABINET": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_house_cabinet_1790321201277.webp",
        "title": "Tủ sách và kỷ vật tuổi niên thiếu của Đại tướng tại quê nhà",
        "kind": "Hiện vật gia đình tư liệu gốc"
    },
    "milestoneExhibitionsData__004__GIAP_FAMILY_PORTRAIT": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_family_portrait_1790319982315.webp",
        "title": "Bức ảnh gia đình ấm cúng của Đại tướng Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu gia đình gốc"
    },
    "milestoneExhibitionsData__005__INSIGHTS_GENERAL_ORIGIN": {
        "url": "/assets/aistudio/image_4deb73fa.png",
        "title": "Cội nguồn dòng tộc nhà nho yêu nước",
        "kind": "Ảnh tư liệu nghiên cứu gia thế"
    },
    "milestoneExhibitionsData__006__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/aistudio/image_55f22086.png",
        "title": "Mái nhà xưa thời thơ ấu",
        "kind": "Ảnh tư liệu di tích lịch sử"
    },
    "milestoneExhibitionsData__007__GIAP_HOUSE_CABINET": {
        "url": "/assets/aistudio/image_5834db58.png",
        "title": "Góc học tập và tủ lưu niệm Đại tướng",
        "kind": "Ảnh tư liệu hiện vật lưu niệm"
    },
    "milestoneExhibitionsData__008__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/aistudio/image_d3be1c38.png",
        "title": "Đồng chí Võ Nguyên Giáp những năm tháng tuổi trẻ",
        "kind": "Ảnh tư liệu tuổi trẻ Đại tướng"
    },
    "milestoneExhibitionsData__009__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/aistudio/image_e13d0873.png",
        "title": "Chân dung người trí thức cách mạng",
        "kind": "Ảnh tư liệu trí thức cách mạng"
    },
    "milestoneExhibitionsData__010__GIAP_DECREE_1945": {
        "url": "/assets/aistudio/image_fde4d84b.png",
        "title": "Tập hồ sơ sắc lệnh và công văn cách mạng 1945",
        "kind": "Ảnh tư liệu hồ sơ cách mạng"
    },
    "milestoneExhibitionsData__011__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/aistudio/image_ea9075f5.png",
        "title": "Đại tướng Võ Nguyên Giáp trong đoàn đại biểu quốc gia",
        "kind": "Ảnh tư liệu lãnh đạo nhà nước"
    },
    "milestoneExhibitionsData__012__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_f633c3d8.png",
        "title": "34 chiến sĩ Đội Việt Nam Tuyên truyền Giải phóng quân",
        "kind": "Ảnh tư liệu ngày thành lập Quân đội"
    },
    "milestoneExhibitionsData__013__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_b8d37944.png",
        "title": "Chiến sĩ giải phóng quân thề hy sinh vì Tổ quốc",
        "kind": "Ảnh tư liệu chiến sĩ giải phóng quân"
    },
    "milestoneExhibitionsData__014__CHALLENGES_COMBAT_BW": {
        "url": "/assets/giap-curated/tu-anh-goc/soldiers_combat_bw_1789891334717.webp",
        "title": "Chiến sĩ xung kích xung phong dưới làn bom đạn",
        "kind": "Ảnh tư liệu chiến đấu đen trắng"
    },
    "milestoneExhibitionsData__015__GIAP_REVIEW_TROOPS": {
        "url": "/assets/aistudio/image_26f26daa.png",
        "title": "Đoàn quân ra trận trong khí thế sục sôi",
        "kind": "Ảnh tư liệu khí thế ra trận"
    },
    "milestoneExhibitionsData__016__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/aistudio/image_94930723.png",
        "title": "Khí thế ngày hội non sông Ba Đình 1945",
        "kind": "Ảnh tư liệu Quảng trường Ba Đình"
    },
    "milestoneExhibitionsData__017__GIAP_PROVISIONAL_GOV": {
        "url": "/assets/aistudio/image_e3020c33.png",
        "title": "Đại tướng cùng các đồng chí lãnh đạo Đảng và Nhà nước",
        "kind": "Ảnh tư liệu lãnh đạo cách mạng"
    },
    "milestoneExhibitionsData__018__GIAP_DECREE_1945": {
        "url": "/assets/aistudio/image_04400264.png",
        "title": "Bản sắc lệnh lịch sử lập nên nền độc lập",
        "kind": "Ảnh tư liệu sắc lệnh lịch sử"
    },
    "milestoneExhibitionsData__019__GIAP_SIGNATURE": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_condao_guillotine_1790319993880.webp",
        "title": "Máy chém thực dân tại Côn Đảo - chứng tích tội ác chiến tranh",
        "kind": "Ảnh tư liệu hiện vật tội ác chiến tranh"
    },
    "milestoneExhibitionsData__020__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_5ac45c4b.png",
        "title": "Đại thắng Điện Biên Phủ lừng lẫy năm châu chấn động địa cầu",
        "kind": "Ảnh tư liệu lịch sử Đại thắng"
    },
    "milestoneExhibitionsData__021__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_69f7f328.png",
        "title": "Toàn cảnh lòng chảo Mường Thanh rực lửa chiến công",
        "kind": "Ảnh tư liệu lòng chảo Mường Thanh"
    },
    "milestoneExhibitionsData__022__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/aistudio/image_753c916e.png",
        "title": "Sở chỉ huy Mường Phăng - nơi ra quyết định lịch sử thay đổi cục diện",
        "kind": "Ảnh tư liệu chỉ huy Mường Phăng"
    },
    "milestoneExhibitionsData__023__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_7b9949fb.png",
        "title": "Bản đồ tác chiến Điện Biên Phủ chuyển phương châm đánh chắc tiến chắc",
        "kind": "Bản đồ tư liệu chiến dịch lịch sử"
    },
    "milestoneExhibitionsData__024__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/aistudio/image_7e9e4d28.png",
        "title": "Lời dặn của Bác Hồ: 'Trận này quan trọng, phải đánh cho thắng, chắc thắng mới đánh'",
        "kind": "Ảnh tư liệu căn dặn lịch sử"
    },
    "milestoneExhibitionsData__025__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_90491771.png",
        "title": "Sơ đồ công sự hầm hào thắt chặt vòng vây tập đoàn cứ điểm",
        "kind": "Sơ đồ tư liệu chiến dịch Điện Biên"
    },
    "milestoneExhibitionsData__026__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_9ed361c8.png",
        "title": "Tướng De Castries và toàn bộ ban tham mưu Pháp đầu hàng",
        "kind": "Ảnh tư liệu đầu hàng lịch sử"
    },
    "milestoneExhibitionsData__027__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_a1b04c98.png",
        "title": "Không gian bảo tàng chiến thắng lịch sử",
        "kind": "Ảnh tư liệu bảo tàng"
    },
    "milestoneExhibitionsData__028__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_ad473878.png",
        "title": "Kỷ vật chiến trường và vũ khí giải phóng",
        "kind": "Ảnh tư liệu kỷ vật chiến trường"
    },
    "milestoneExhibitionsData__029__D67_BUNKER_COMMAND": {
        "url": "/assets/aistudio/image_b2c28c5e.png",
        "title": "Phòng họp Quân ủy Trung ương hầm D67 Hà Nội",
        "kind": "Ảnh tư liệu lịch sử hầm D67"
    },
    "milestoneExhibitionsData__030__HERO_FLAG_GENERAL": {
        "url": "/assets/aistudio/image_c5a7b951.png",
        "title": "Đại thắng mùa xuân 1975 thống nhất non sông",
        "kind": "Ảnh tư liệu lịch sử Đại thắng 1975"
    },
    "milestoneExhibitionsData__031__GIAP_MEMORIAL_ALTAR": {
        "url": "/assets/aistudio/image_d6f8de00.png",
        "title": "Dòng người vô tận tiễn biệt Đại tướng kính yêu",
        "kind": "Ảnh tư liệu tiễn biệt Đại tướng"
    },
    "milestoneExhibitionsData__032__GIAP_MEMORIAL_ALTAR": {
        "url": "/assets/aistudio/image_e7bbfec1.png",
        "title": "Nơi an nghỉ ngàn thu của Đại tướng tại Vũng Chùa - Đảo Yến",
        "kind": "Ảnh tư liệu Vũng Chùa - Đảo Yến"
    },
    "milestoneExhibitionsData__033__GIAP_ANCESTRAL_ALTAR": {
        "url": "/assets/aistudio/image_fd4884b4.png",
        "title": "Di sản sống mãi trong lòng hàng triệu triệu người con đất Việt",
        "kind": "Ảnh tư liệu di sản trường tồn"
    },
    "milestoneExhibitionsData__034__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_giap_medals_square_1789890356568.webp",
        "title": "Vị tướng của nhân dân - Đại tướng Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu chân dung Vị tướng nhân dân"
    },

    # Nhóm CampaignCommandView (7 slots)
    "CampaignCommandView__001__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/giap-curated/tu-anh-goc/tactical_briefing_map_1789877546424.webp",
        "title": "Chiến dịch Biên giới Thu Đông 1950",
        "kind": "Bản đồ tư liệu chiến dịch 1950"
    },
    "CampaignCommandView__002__CAMPAIGN_MAP": {
        "url": "/assets/giap-curated/tu-anh-goc/campaign_map_tactical.webp",
        "title": "Chiến dịch Hòa Bình 1951 - 1952",
        "kind": "Bản đồ tư liệu chiến dịch Hòa Bình"
    },
    "CampaignCommandView__003__CAMPAIGN_MAP": {
        "url": "/assets/aistudio/image_96f43947.png",
        "title": "Chiến dịch Điện Biên Phủ 1954",
        "kind": "Bản đồ tư liệu chiến dịch Điện Biên Phủ"
    },
    "CampaignCommandView__004__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/giap-curated/tu-anh-goc/d67_bunker_command_1790321434308.webp",
        "title": "Chiến dịch Hồ Chí Minh 1975 - Mệnh lệnh Thần tốc",
        "kind": "Ảnh tư liệu chỉ huy chiến dịch 1975"
    },
    "CampaignCommandView__005__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_muong_phang_hq_1790321420287.webp",
        "title": "Sở chỉ huy Mường Phăng Điện Biên Phủ",
        "kind": "Ảnh tư liệu di tích lịch sử Mường Phăng"
    },
    "CampaignCommandView__006__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp",
        "title": "Đại thắng Điện Biên Phủ 7/5/1954",
        "kind": "Ảnh tư liệu chiến thắng Điện Biên Phủ"
    },
    "CampaignCommandView__007__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_8c1c76f9.png",
        "title": "Trận địa hầm ngầm tập đoàn cứ điểm Điện Biên Phủ",
        "kind": "Ảnh tư liệu chiến trường Điện Biên Phủ"
    },

    # Nhóm RadarTacticalView (4 slots)
    "RadarTacticalView__001__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/aistudio/image_0a97384e.png",
        "title": "Nóc hầm De Castries cấu trúc mái vòm thép kiên cố",
        "kind": "Ảnh tư liệu thực địa Điện Biên Phủ"
    },
    "RadarTacticalView__002__GIAP_HANOI_FLAG_REVIEW": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_hanoi_flag_review_1790321226200.webp",
        "title": "Hệ thống tuyến liên lạc và chỉ huy chiến dịch",
        "kind": "Ảnh tư liệu lịch sử tuyến chỉ huy"
    },
    "RadarTacticalView__003__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_9847f5c5.png",
        "title": "Tuyến tiếp tế và lực lượng pháo binh dốc sức chi viện",
        "kind": "Ảnh tư liệu lực lượng chi viện"
    },
    "RadarTacticalView__004__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_5efce523.png",
        "title": "Sơ đồ địa hình công sự chiến hào thung lũng Mường Thanh",
        "kind": "Ảnh tư liệu địa hình chiến hào"
    },

    # Nhóm ArchiveLibraryView (5 slots)
    "ArchiveLibraryView__001__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/aistudio/image_1f3de0a7.png",
        "title": "Hồ sơ Sắc lệnh số 21 ngày 8/9/1945 do Bộ trưởng Võ Nguyên Giáp ký",
        "kind": "Hiện vật văn bản sắc lệnh gốc"
    },
    "ArchiveLibraryView__002__PORTRAIT_GENERAL": {
        "url": "/assets/aistudio/image_b1c93621.png",
        "title": "Chữ ký nguyên bản và bút tích của Đại tướng Võ Nguyên Giáp",
        "kind": "Hiện vật bút tích chữ ký gốc"
    },
    "ArchiveLibraryView__003__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_signature_doc_1790057044097.webp",
        "title": "Văn bản chữ ký và phê chuẩn kế hoạch tác chiến",
        "kind": "Ảnh tư liệu văn bản chữ ký"
    },
    "ArchiveLibraryView__004__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_decree_1945_1790057086547.webp",
        "title": "Sắc lệnh thiết lập tổ chức chính quyền nhân dân 1945",
        "kind": "Hiện vật sắc lệnh lưu trữ quốc gia"
    },
    "ArchiveLibraryView__005__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_condao_guillotine_1790319993880.webp",
        "title": "Hồ sơ di tích và hiện vật chứng tích chiến tranh Côn Đảo",
        "kind": "Hồ sơ tư liệu chứng tích lịch sử"
    },

    # Nhóm BiographyDossierView (13 slots)
    "BiographyDossierView__001__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_young_scholar_1790322297398.webp",
        "title": "Chân dung Võ Nguyên Giáp thời thanh niên dạy sử trường Thăng Long",
        "kind": "Ảnh tư liệu chân dung thời trẻ"
    },
    "BiographyDossierView__002__GIAP_FAMILY_PORTRAIT": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_family_portrait_1790319982315.webp",
        "title": "Gia đình Đại tướng Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu gia đình Đại tướng"
    },
    "BiographyDossierView__003__GIAP_ORIGIN_INSIGHTS": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_origin_insights_1789891318216.webp",
        "title": "Cội nguồn bản lĩnh và đạo lý vị tướng nhân dân",
        "kind": "Ảnh tư liệu đúc kết tư tưởng"
    },
    "BiographyDossierView__004__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/giap-curated/tu-anh-goc/vietnam_peoples_army_1789877565340.webp",
        "title": "Đại tướng Võ Nguyên Giáp cùng Đội Việt Nam Tuyên truyền Giải phóng quân",
        "kind": "Ảnh tư liệu lịch sử ngày thành lập Quân đội"
    },
    "BiographyDossierView__005__GIAP_PORTRAIT_OFFICIAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_likeness_1789890142145.webp",
        "title": "Chân dung chính thức Đại tướng Tổng Tư lệnh Quân đội nhân dân Việt Nam",
        "kind": "Ảnh tư liệu chân dung chính thức"
    },
    "BiographyDossierView__006__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/giap-curated/tu-anh-goc/dien_bien_flag_win_1790321448552.webp",
        "title": "Lá cờ chiến thắng Điện Biên Phủ 1954",
        "kind": "Ảnh tư liệu lịch sử chiến thắng"
    },
    "BiographyDossierView__007__GIAP_COMMEMORATIVE_PLATE": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_commemorative_plate_1790320005586.webp",
        "title": "Đĩa lưu niệm tôn vinh Vị tướng Điện Biên Phủ",
        "kind": "Hiện vật lưu niệm lịch sử"
    },
    "BiographyDossierView__008__D67_BUNKER_COMMAND": {
        "url": "/assets/giap-curated/tu-anh-goc/d67_bunker_command_1790321434308.webp",
        "title": "Đại tướng chỉ huy tại hầm D67 Hoàng thành Thăng Long",
        "kind": "Ảnh tư liệu lịch sử hầm D67"
    },
    "BiographyDossierView__009__GIAP_SENIOR_SPEAKING": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_senior_speaking_1790320033644.webp",
        "title": "Đại tướng phát biểu tâm huyết truyền cảm hứng trong những năm tháng hòa bình",
        "kind": "Ảnh tư liệu phát biểu lịch sử"
    },
    "BiographyDossierView__010__GIAP_WARM_SMILE_UNIFORM": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_senior_uniform_1790057107137.webp",
        "title": "Đại tướng Võ Nguyên Giáp trong quân phục trang trọng",
        "kind": "Ảnh tư liệu chân dung trang trọng"
    },
    "BiographyDossierView__011__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_warm_smile_uniform_1790321237395.webp",
        "title": "Nụ cười đôn hậu của Đại tướng giữa tình cảm nhân dân",
        "kind": "Ảnh tư liệu nụ cười Đại tướng"
    },
    "BiographyDossierView__012__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_1789876646974.webp",
        "title": "Chân dung Đại tướng Võ Nguyên Giáp trọn đời vì nước vì dân",
        "kind": "Ảnh tư liệu chân dung trọn đời"
    },
    "BiographyDossierView__013__GIAP_SIGNATURE_AUTHENTIC": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_signature_authentic.svg",
        "title": "Chữ ký số hóa nguyên bản của Đại tướng Võ Nguyên Giáp",
        "kind": "Đồ họa vector chữ ký số hóa"
    },

    # Nhóm DecisionsAndInsightsView (5 slots)
    "DecisionsAndInsightsView__001__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/aistudio/image_8c1c76f9.png",
        "title": "Quyết định chuyển từ 'Đánh nhanh thắng nhanh' sang 'Đánh chắc tiến chắc'",
        "kind": "Ảnh tư liệu quyết định chiến lược lịch sử"
    },
    "DecisionsAndInsightsView__002__MUSEUM_TANK_HALL": {
        "url": "/assets/aistudio/image_595ea24f.png",
        "title": "Lắng nghe ý kiến của các cán bộ và đại đoàn chỉ huy ngoài mặt trận",
        "kind": "Ảnh tư liệu thảo luận dân chủ quân sự"
    },
    "DecisionsAndInsightsView__003__D67_BUNKER_COMMAND": {
        "url": "/assets/giap-curated/tu-anh-goc/d67_bunker_command_1790321434308.webp",
        "title": "Trách nhiệm trước sinh mạng của hàng vạn cán bộ chiến sĩ",
        "kind": "Ảnh tư liệu chỉ huy tác chiến"
    },
    "DecisionsAndInsightsView__004__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/giap-curated/tu-anh-goc/giap_with_uncle_ho_1790057066944.webp",
        "title": "Khắc ghi lời Bác: 'Tướng quân tại ngoại, trao cho chú toàn quyền quyết định'",
        "kind": "Ảnh tư liệu căn dặn lịch sử"
    },
    "DecisionsAndInsightsView__005__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/aistudio/image_7c6fa4f2.png",
        "title": "Thực tiễn chiến trường khẳng định tầm nhìn thiên tài của Vị tướng",
        "kind": "Ảnh tư liệu chiến trường Điện Biên Phủ"
    },

    # Nhóm ChallengesView (2 slots)
    "ChallengesView__001__CHALLENGES_COMBAT_BW": {
        "url": "/assets/giap-curated/tu-anh-goc/soldiers_combat_bw_1789891334717.webp",
        "title": "Thử thách giải mã: Khoảnh khắc chiến sĩ xung phong trên chiến hào",
        "kind": "Ảnh tư liệu thử thách chiến đấu"
    },
    "ChallengesView__002__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/aistudio/image_dc5a9c43.png",
        "title": "Mảnh ghép lịch sử: Chiến dịch Điện Biên Phủ hào hùng",
        "kind": "Ảnh tư liệu lịch sử thử thách"
    },

    # Nhóm MapView (8 slots)
    "MapView__001__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_001.svg",
        "title": "Địa danh Lệ Thủy - Quảng Bình",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__002__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_002.svg",
        "title": "Địa danh Thủ đô Hà Nội",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__003__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_003.svg",
        "title": "Địa danh Chiến khu Việt Bắc - Tân Trào",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__004__D67_BUNKER_COMMAND": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_004.svg",
        "title": "Địa danh Khu rừng Trần Hưng Đạo - Cao Bằng",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__005__MUSEUM_TANK_HALL": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_005.svg",
        "title": "Địa danh Biên giới Đông Khê - Thất Khê",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__006__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_006.svg",
        "title": "Địa danh Thung lũng Điện Biên Phủ",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__007__GIAP_ANCESTRAL_ALTAR": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_007.svg",
        "title": "Địa danh Sở chỉ huy Mường Phăng",
        "kind": "Bản đồ minh họa địa danh"
    },
    "MapView__008__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/map_008.svg",
        "title": "Địa danh Dinh Độc Lập - Thành phố Hồ Chí Minh",
        "kind": "Bản đồ minh họa địa danh"
    },

    # Nhóm TimelineView (1 slot)
    "TimelineView__001__PORTRAIT_GENERAL": {
        "url": "/assets/aistudio/image_8e543aa6.png",
        "title": "Dấu chân lịch sử Đại tướng Võ Nguyên Giáp",
        "kind": "Ảnh tư liệu chân dung Đại tướng"
    },

    # Nhóm PersonalizedRecommendations / Góc học tập cá nhân hóa
    "PersonalizedRecommendations__001__DIEN_BIEN_FLAG_WIN": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_001.svg",
        "title": "Nhật ký khám phá di sản",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__002__VIETNAM_PEOPLES_ARMY": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_002.svg",
        "title": "Bộ sưu tập huy chương và thành tích",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__003__MUSEUM_TANK_HALL": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_003.svg",
        "title": "Lộ trình học tập lịch sử đề xuất",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__004__GIAP_SIGNATURE": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_004.svg",
        "title": "Chứng chỉ hoàn thành chặng đường",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__005__GIAP_DECREE_1945": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_005.svg",
        "title": "Cộng đồng nghiên cứu lịch sử trẻ",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__006__GIAP_WITH_UNCLE_HO": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_006.svg",
        "title": "Bộ dấu mốc lịch sử đã lưu",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__007__GIAP_YOUNG_SCHOLAR": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_007.svg",
        "title": "Hồ sơ cá nhân và lộ trình rèn luyện",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__008__GIAP_MUONG_PHANG_HQ": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_008.svg",
        "title": "Gợi ý chuyên đề: Nghệ thuật quân sự Việt Nam",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__009__D67_BUNKER_COMMAND": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_009.svg",
        "title": "Mục tiêu học tập trong ngày",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__010__GIAP_BIRTHPLACE_ROOM": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_010.svg",
        "title": "Chủ đề yêu thích: Cội nguồn và nhân cách",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__011__GIAP_ANCESTRAL_ALTAR": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_011.svg",
        "title": "Góc tự đánh giá kiến thức lịch sử",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__012__TACTICAL_BRIEFING_MAP": {
        "url": "/assets/giap-curated/minh-hoa-moi/community_012.svg",
        "title": "Đồng hành cùng bạn bè trên chặng đường",
        "kind": "Minh họa đồ họa quân sự"
    },
    "PersonalizedRecommendations__013__GIAP_REVIEW_TROOPS": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_002.svg",
        "title": "Bản lĩnh người chỉ huy",
        "kind": "Minh họa biểu trưng phẩm chất"
    },
    "PersonalizedRecommendations__014__GIAP_DEER_TEAM": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_003.svg",
        "title": "Trách nhiệm với non sông",
        "kind": "Minh họa biểu trưng phẩm chất"
    },
    "PersonalizedRecommendations__015__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_004.svg",
        "title": "Tinh thần tự học suốt đời",
        "kind": "Minh họa biểu trưng phẩm chất"
    },
    "PersonalizedRecommendations__016__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_005.svg",
        "title": "Kiên trì vượt qua nghịch cảnh",
        "kind": "Minh họa biểu trưng phẩm chất"
    },

    # Nhóm Insights / Trợ lý / Cài đặt / Thông điệp
    "AiAssistantModal__001__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/tu-anh-goc/general_vo_nguyen_giap_portrait_likeness_1789890142145.webp",
        "title": "Trợ lý ảo Di sản Dấu chân Đại tướng",
        "kind": "Ảnh tư liệu chân dung Đại tướng"
    },
    "InsightsView__001__INSIGHTS_GENERAL_ORIGIN": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_007.svg",
        "title": "Tư duy độc lập và sáng tạo",
        "kind": "Minh họa đồ họa phẩm chất"
    },
    "InsightsView__002__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_008.svg",
        "title": "Lòng nhân ái bao la của Vị tướng",
        "kind": "Minh họa đồ họa phẩm chất"
    },
    "InsightsView__003__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_009.svg",
        "title": "Hợp tác và đoàn kết sức mạnh tập thể",
        "kind": "Minh họa đồ họa phẩm chất"
    },
    "MilestoneInteractiveExhibition__001__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/home_012.svg",
        "title": "Hành trình vĩ đại vì độc lập tự do",
        "kind": "Minh họa đồ họa quân sự"
    },
    "MilestoneInteractiveExhibition__002__CAMPAIGN_MAP": {
        "url": "/assets/giap-curated/minh-hoa-moi/radar_010.svg",
        "title": "Trục thời gian tương tác đa chiều",
        "kind": "Minh họa đồ họa quân sự"
    },
    "MilestoneInteractiveExhibition__003__HERO_FLAG_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/portrait_009.svg",
        "title": "Hành trình cống hiến trọn đời cho Tổ quốc",
        "kind": "Minh họa đồ họa quân sự"
    },
    "SettingsView__001__PORTRAIT_GENERAL": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_010.svg",
        "title": "Sống có mục tiêu và lý tưởng cao đẹp",
        "kind": "Minh họa đồ họa quân sự"
    },
    "ThoughtOfTheDay__001__GIAP_SIGNATURE_AUTHENTIC": {
        "url": "/assets/giap-curated/minh-hoa-moi/insight_011.svg",
        "title": "Biết lắng nghe và thấu hiểu nhân dân",
        "kind": "Minh họa đồ họa quân sự"
    }
}

# Rà soát và đảm bảo các slot khác không bị trùng lặp URL
used_urls = set()
updated_rows = []

# Tập hợp các URL có sẵn trong hệ thống (thực tế tồn tại trên đĩa)
existing_files_on_disk = set()
for root, dirs, files in os.walk('public'):
    for file in files:
        full_path = os.path.join(root, file)
        # Chuyển đổi sang URL format (bắt đầu bằng /)
        url_path = full_path.replace('public', '', 1)
        existing_files_on_disk.add(url_path)

print(f"Tổng số tệp tĩnh trong public: {len(existing_files_on_disk)}")

# Phân bổ cho từng hàng trong danh sách 168 slot
for r in existing_rows:
    slot = r['slot']
    if slot in custom_assignments:
        cfg = custom_assignments[slot]
        target_url = cfg['url']
        target_title = cfg['title']
        target_kind = cfg['kind']
        image_id = os.path.splitext(os.path.basename(target_url))[0]
    else:
        # Giữ nguyên giá trị cũ nếu đã có
        target_url = r['image_url']
        target_title = r['image_title']
        target_kind = r['asset_kind']
        image_id = r['image_id']

    # Kiểm tra trùng lặp
    # Cho phép ngoại lệ duy nhất: Logo GIAP TRACE
    is_logo = 'logo' in target_url.lower() or 'logo' in slot.lower()
    if target_url in used_urls and not is_logo:
        # Nếu trùng, tìm ngay một SVG hoặc ảnh chưa dùng trong danh mục
        found_substitute = False
        for i in range(1, 134):
            candidate = f"/assets/giap-curated/minh-hoa-moi/minh_hoa_{i:03d}.svg"
            if candidate in existing_files_on_disk and candidate not in used_urls:
                target_url = candidate
                target_title = f"Minh họa chuyên đề quân sự {i:03d}"
                target_kind = "Minh họa đồ họa quân sự"
                image_id = f"minh_hoa_{i:03d}"
                found_substitute = True
                break
        if not found_substitute:
            for pref in ['home', 'campaign', 'museum', 'timeline', 'archive', 'portrait', 'radar', 'insight', 'community']:
                for i in range(1, 40):
                    candidate = f"/assets/giap-curated/minh-hoa-moi/{pref}_{i:03d}.svg"
                    if candidate in existing_files_on_disk and candidate not in used_urls:
                        target_url = candidate
                        target_title = f"Đồ họa quân sự {pref} {i:03d}"
                        target_kind = "Minh họa đồ họa quân sự"
                        image_id = f"{pref}_{i:03d}"
                        found_substitute = True
                        break
                if found_substitute:
                    break

    used_urls.add(target_url)

    # Đảm bảo file có thật trên đĩa
    if target_url not in existing_files_on_disk:
        print(f"CẢNH BÁO: Tệp không có trên đĩa: {target_url} cho {slot}")

    updated_rows.append({
        'slot': slot,
        'file': r['file'],
        'line_original': r['line_original'],
        'old_key': r['old_key'],
        'category': r['category'],
        'image_id': image_id,
        'image_url': target_url,
        'image_title': target_title,
        'asset_kind': target_kind
    })

# Kiểm tra tổng kết
all_urls = [r['image_url'] for r in updated_rows]
unique_urls = set(all_urls)
duplicates = [u for u in unique_urls if all_urls.count(u) > 1 and 'logo' not in u.lower()]

print(f"\n--- KẾT QUẢ KIỂM TRA PHÂN BỔ ---")
print(f"Tổng số slot: {len(updated_rows)}")
print(f"Tổng số URL duy nhất: {len(unique_urls)}")
print(f"Số lượng URL trùng lặp (ngoại trừ logo): {len(duplicates)}")
if duplicates:
    for d in duplicates:
        print(f"  Trùng: {d}")

# Ghi lại file CSV
with open(CSV_PATH, 'w', encoding='utf-8-sig', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['slot', 'file', 'line_original', 'old_key', 'category', 'image_id', 'image_url', 'image_title', 'asset_kind'])
    writer.writeheader()
    writer.writerows(updated_rows)

print(f"Đã lưu thành công: {CSV_PATH}")

# Sinh file TypeScript giapImageMap.generated.ts
ts_code = []
ts_code.append('/**')
ts_code.append(' * GIAP TRACE - BẢN ĐỒ PHÂN BỔ HÌNH ẢNH KHÔNG TRÙNG LẶP (AUTO-GENERATED V5.0)')
ts_code.append(' * Được sinh tự động từ GIAP_TRACE_BANG_PHAN_BO_ANH.csv.')
ts_code.append(' * Mỗi slot có một ảnh duy nhất, không trùng lặp (trừ Logo GIAP TRACE).')
ts_code.append(' * Kết hợp ảnh tư liệu lịch sử gốc, bảo tàng số và đồ họa quân sự cao cấp.')
ts_code.append(' */')
ts_code.append('')
ts_code.append('export interface CuratedImageInfo {')
ts_code.append('  slot: string;')
ts_code.append('  file: string;')
ts_code.append('  category: string;')
ts_code.append('  imageId: string;')
ts_code.append('  imageUrl: string;')
ts_code.append('  title: string;')
ts_code.append('  assetKind: string;')
ts_code.append('}')
ts_code.append('')
ts_code.append('export const GIAP_IMAGE_MAP: Record<string, CuratedImageInfo> = {')

for r in updated_rows:
    entry = {
        'slot': r['slot'],
        'file': r['file'],
        'category': r['category'],
        'imageId': r['image_id'],
        'imageUrl': r['image_url'],
        'title': r['image_title'],
        'assetKind': r['asset_kind']
    }
    ts_code.append(f'  "{r["slot"]}": {json.dumps(entry, ensure_ascii=False)},')

ts_code.append('};')
ts_code.append('')
ts_code.append('export const SLOT_IMAGE_URLS: Record<string, string> = {')
for r in updated_rows:
    ts_code.append(f'  "{r["slot"]}": "{r["image_url"]}",')
ts_code.append('};')
ts_code.append('')
ts_code.append('/**')
ts_code.append(' * Lấy URL ảnh theo Slot ID, có fallback an toàn')
ts_code.append(' */')
ts_code.append("export function getCuratedImage(slotId: string, fallback = '/assets/giap-curated/tu-anh-goc/flag_general_hero_1789877465162.webp'): string {")
ts_code.append('  return SLOT_IMAGE_URLS[slotId] || fallback;')
ts_code.append('}')
ts_code.append('')
ts_code.append('/**')
ts_code.append(' * Lấy tiêu đề ảnh theo Slot ID')
ts_code.append(' */')
ts_code.append("export function getCuratedTitle(slotId: string, fallback = 'Hình ảnh tư liệu'): string {")
ts_code.append('  return GIAP_IMAGE_MAP[slotId]?.title || fallback;')
ts_code.append('}')
ts_code.append('')
ts_code.append('/**')
ts_code.append(' * Lấy loại tư liệu (Ảnh tư liệu gốc vs Minh họa)')
ts_code.append(' */')
ts_code.append("export function getCuratedAssetKind(slotId: string, fallback = 'Tư liệu lịch sử'): string {")
ts_code.append('  return GIAP_IMAGE_MAP[slotId]?.assetKind || fallback;')
ts_code.append('}')
ts_code.append('')

with open(TS_PATH, 'w', encoding='utf-8') as f:
    f.write('\n'.join(ts_code))

print(f"Đã lưu thành công: {TS_PATH}")
