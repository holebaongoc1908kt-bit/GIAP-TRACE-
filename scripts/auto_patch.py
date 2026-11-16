#!/usr/bin/env python3
"""
GIAP TRACE - SCRIPT PHÂN BỔ ẢNH KHÔNG TRÙNG (AUTO PATCH)
Áp dụng phân bổ từ public/assets/aistudio/GIAP_TRACE_BANG_PHAN_BO_ANH_fdfe551d.csv
lên các thành phần của ứng dụng.
"""

import os
import sys
import csv
import re

CSV_PATH = 'public/assets/aistudio/GIAP_TRACE_BANG_PHAN_BO_ANH_fdfe551d.csv'

def main():
    if not os.path.isfile(CSV_PATH):
        print(f"Không tìm thấy file: {CSV_PATH}")
        sys.exit(1)

    with open(CSV_PATH, 'r', encoding='utf-8-sig') as f:
        rows = list(csv.DictReader(f))

    print(f"Tổng số slot trong CSV: {len(rows)}")

    by_file = {}
    for r in rows:
        by_file.setdefault(r['file'], []).append(r)

    # Xử lý từng file
    for filepath, frows in by_file.items():
        if not os.path.isfile(filepath):
            print(f"Bỏ qua file không tồn tại: {filepath}")
            continue

        print(f"\n--- Đang xử lý: {filepath} ({len(frows)} slots) ---")
        with open(filepath, 'r', encoding='utf-8') as fp:
            content = fp.read()

        # Đường dẫn import tùy thuộc vị trí file
        if 'src/data/' in filepath:
            import_stmt = "import { getCuratedImage, SLOT_IMAGE_URLS } from './giapImageMap.generated';\n"
        else:
            import_stmt = "import { getCuratedImage, SLOT_IMAGE_URLS } from '../data/giapImageMap.generated';\n"

        # Đảm bảo có import getCuratedImage
        if 'getCuratedImage' not in content:
            # Thêm sau dòng import cuối cùng hoặc đầu file
            lines = content.split('\n')
            last_import_idx = 0
            for idx, line in enumerate(lines):
                if line.startswith('import ') or line.startswith('} from '):
                    last_import_idx = idx
            lines.insert(last_import_idx + 1, import_stmt.strip())
            content = '\n'.join(lines)

        # Xử lý riêng cho RadarTacticalView nếu các token khác biệt
        if 'RadarTacticalView.tsx' in filepath:
            # Thay 4 vị trí fallback cụ thể
            content = content.replace(
                "'/assets/images/tactical_briefing_map_1789877546424.jpg'",
                f"getCuratedImage('{frows[0]['slot']}')",
                1
            )
            content = content.replace(
                "'/assets/images/tactical_briefing_map_1789877546424.jpg'",
                f"getCuratedImage('{frows[1]['slot']}')",
                1
            )
            content = content.replace(
                "'/assets/images/tactical_briefing_map_1789877546424.jpg'",
                f"getCuratedImage('{frows[2]['slot']}')",
                1
            )
            content = content.replace(
                "'/assets/images/tactical_briefing_map_1789877546424.jpg'",
                f"getCuratedImage('{frows[3]['slot']}')",
                1
            )
            print(f"  Đã patch 4 fallback trong RadarTacticalView thành công.")
        elif 'CampaignCommandView.tsx' in filepath and len(frows) == 7:
            # 5 stage images + 1 general photo + 1 fallback
            for idx, r in enumerate(frows[:6]):
                old_token = f"ASSET_PATHS.{r['old_key']}"
                new_token = f"getCuratedImage('{r['slot']}')"
                content = content.replace(old_token, new_token, 1)
                print(f"  Slot {r['slot']}: {old_token} -> {new_token}")
            # Patch thêm slot 7 vào fallback ảnh Mường Phăng nếu có
            slot7 = frows[6]
            if "onError" not in content and "GIAP_MUONG_PHANG_HQ" not in content:
                # Add onError for Campaign photo
                content = content.replace(
                    "className=\"w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700\"",
                    f"className=\"w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700\"\n              onError={{(e) => {{ (e.target as HTMLImageElement).src = getCuratedImage('{slot7['slot']}'); }}}}"
                )
                print(f"  Slot {slot7['slot']}: Đã gắn vào onError của CampaignCommandView.")
        else:
            # Thay thế lần lượt từng token theo thứ tự xuất hiện
            for r in frows:
                old_token = f"ASSET_PATHS.{r['old_key']}"
                new_token = f"getCuratedImage('{r['slot']}')"
                if old_token in content:
                    content = content.replace(old_token, new_token, 1)
                    print(f"  Slot {r['slot']}: {old_token} -> {new_token}")
                else:
                    print(f"  CẢNH BÁO: Không tìm thấy {old_token} cho {r['slot']}")

        # Ghi lại file
        with open(filepath, 'w', encoding='utf-8') as fp:
            fp.write(content)
        print(f"Đã lưu: {filepath}")

    print("\nHoàn tất chạy patcher phân bổ ảnh!")

if __name__ == '__main__':
    main()
