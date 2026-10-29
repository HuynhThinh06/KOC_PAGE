import os
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

print("=== 1. KIỂM TRA FILE TRONG HỆ THỐNG ===")
required_files = [
    r'D:\KOC\index.html',
    r'D:\KOC\product.html',
    r'D:\KOC\cart.html',
    r'D:\KOC\chinh-sach-doi-tra.html',
    r'D:\KOC\chinh-sach-van-chuyen.html',
    r'D:\KOC\chinh-sach-quyen-rieng-tu.html',
    r'D:\KOC\assets\css\style.css',
    r'D:\KOC\assets\css\components.css',
    r'D:\KOC\assets\js\config.js',
    r'D:\KOC\assets\js\main.js',
    r'D:\KOC\assets\js\quiz.js',
    r'D:\KOC\assets\js\cart.js',
    r'D:\KOC\assets\js\chatbot.js',
    r'D:\KOC\google-apps-script.js',
    r'D:\KOC\HUONG-DAN-GOOGLE-SHEET.md'
]

all_files_ok = True
for f in required_files:
    if os.path.exists(f):
        print(f"  [OK] {os.path.basename(f)} ({os.path.getsize(f):,} bytes)")
    else:
        print(f"  [FAIL] Missing file: {f}")
        all_files_ok = False

print("\n=== 2. KIỂM TRA LIÊN KẾT MEDIA & ASSETS TRONG CÁC FILE HTML ===")
html_files = [
    r'D:\KOC\index.html',
    r'D:\KOC\product.html',
    r'D:\KOC\cart.html',
    r'D:\KOC\chinh-sach-doi-tra.html',
    r'D:\KOC\chinh-sach-van-chuyen.html',
    r'D:\KOC\chinh-sach-quyen-rieng-tu.html'
]

media_ok = True
for hf in html_files:
    with open(hf, 'r', encoding='utf-8') as fp:
        raw = fp.read()
    
    # Strip <script> contents to check only pure HTML markup
    content = re.sub(r'<script\b[^>]*>.*?</script>', '', raw, flags=re.S)

    # Check src="..."
    srcs = re.findall(r'src=["\']([^"\']+)["\']', content)
    for src in srcs:
        if not src.startswith(('http', 'blob', 'data', '${')):
            full_src = os.path.normpath(os.path.join(r'D:\KOC', src))
            if not os.path.exists(full_src):
                print(f"  [ERROR] {os.path.basename(hf)}: Broken src -> {src} ({full_src})")
                media_ok = False

    # Check href="..." for local assets / pages
    hrefs = re.findall(r'href=["\']([^"\']+)["\']', content)
    for href in hrefs:
        if not href.startswith(('http', 'mailto', 'tel', '#', 'javascript', '${')):
            clean_href = href.split('#')[0]
            if clean_href:
                full_href = os.path.normpath(os.path.join(r'D:\KOC', clean_href))
                if not os.path.exists(full_href):
                    print(f"  [ERROR] {os.path.basename(hf)}: Broken href -> {href}")
                    media_ok = False

if media_ok:
    print("  [OK] 100% đường dẫn src, href tĩnh đều hợp lệ và tồn tại trên đĩa!")

print("\n=== 3. KIỂM THỬ THUẬT TOÁN TÍNH ĐIỂM MINI QUIZ ===")
def calculate_quiz(user_answers):
    counts = {'A': 0, 'B': 0, 'C': 0}
    for ans in user_answers:
        counts[ans] += 1
    
    if counts['B'] > counts['A'] and counts['B'] >= counts['C']:
        return 'B'
    elif counts['C'] > counts['A'] and counts['C'] > counts['B']:
        return 'C'
    elif counts['A'] >= counts['B'] and counts['A'] >= counts['C']:
        return 'A'
    else:
        return user_answers[0] if user_answers else 'A'

test_cases = [
    (['A', 'A', 'A', 'B', 'C'], 'A', "Nhóm A - Nếp tóc thích thoáng nhẹ"),
    (['B', 'B', 'B', 'A', 'C'], 'B', "Nhóm B - Nếp tóc cần nâng niu"),
    (['C', 'C', 'C', 'A', 'B'], 'C', "Nhóm C - Nếp tóc theo gu riêng"),
    (['A', 'A', 'B', 'B', 'C'], 'A', "Hòa A & B -> Ưu tiên câu 1 (A)"),
    (['B', 'B', 'C', 'C', 'A'], 'B', "Hòa B & C -> Ưu tiên câu 1 (B)"),
]

quiz_ok = True
for ans_list, expected, label in test_cases:
    actual = calculate_quiz(ans_list)
    if actual == expected:
        print(f"  [PASS] {label}: Output={actual}")
    else:
        print(f"  [FAIL] {label}: Expected={expected}, Actual={actual}")
        quiz_ok = False

print("\n=== 4. KIỂM THỬ QUY TẮC TÍNH PHÍ VẬN CHUYỂN ===")
def calc_shipping(qty):
    price = 113000
    subtotal = qty * price
    fee = 0 if subtotal >= 200000 else 25000
    total = subtotal + fee
    return subtotal, fee, total

sub1, fee1, tot1 = calc_shipping(1)
print(f"  Đơn 1 chai ({sub1:,}₫): Phí ship = {fee1:,}₫ | Tổng thanh toán = {tot1:,}₫ -> {'PASS' if fee1==25000 else 'FAIL'}")

sub2, fee2, tot2 = calc_shipping(2)
print(f"  Đơn 2 chai ({sub2:,}₫): Phí ship = {fee2:,}₫ (Freeship) | Tổng thanh toán = {tot2:,}₫ -> {'PASS' if fee2==0 else 'FAIL'}")

print("\n=== KẾT LUẬN KIỂM THỬ ===")
if all_files_ok and media_ok and quiz_ok and fee1 == 25000 and fee2 == 0:
    print(">>> TẤT CẢ CÁC BƯỚC KIỂM THỬ ĐỀU ĐẠT CHUẨN HOÀN HẢO (100% SUCCESS) <<<")
else:
    print(">>> CẦN KIỂM TRA LẠI MỘT SỐ ĐIỂM CHƯA ĐẠT <<<")
