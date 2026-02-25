import re

with open('old_index.html', 'r', encoding='utf-8') as f:
    old_html = f.read()

# 擷取舊版中完整的 report-accordion
match_old = re.search(r'(<div class="space-y-4" id="report-accordion">.*?)\s*<!-- Fact Check Module -->', old_html, re.DOTALL)
if match_old:
    report_content = match_old.group(1)
    
    # 套用之前的陳舊復古風格色彩替換
    report_content = report_content.replace('bg-[#fdfbf7]', 'bg-[#f5f2e9]')
    report_content = report_content.replace('bg-white', 'bg-[#faf8f5]')
    report_content = report_content.replace('bg-gray-50', 'bg-[#ebe8e1]')
    report_content = report_content.replace('border-gray-200', 'border-gray-400')
    report_content = report_content.replace('border-gray-100', 'border-gray-400')
    report_content = report_content.replace('border-gray-300', 'border-gray-400')
    report_content = report_content.replace('rounded-xl', 'rounded-sm')
    report_content = report_content.replace('rounded-lg', 'rounded-sm')

    with open('index.html', 'r', encoding='utf-8') as f:
        new_html = f.read()
    
    # 取代 index.html 當中殘缺的 report-accordion
    new_html = re.sub(r'<div class="space-y-4" id="report-accordion">.*?</section>', report_content + '        </section>', new_html, flags=re.DOTALL)
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
        print("Success")
else:
    print("Match failed")
