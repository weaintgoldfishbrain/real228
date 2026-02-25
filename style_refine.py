import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. 整體底色替換 (泛黃老舊紙張感)
html = html.replace('bg-[#fdfbf7]', 'bg-[#f5f2e9]')
html = html.replace('bg-white', 'bg-[#faf8f5]')
html = html.replace('bg-gray-50', 'bg-[#ebe8e1]')

# 2. 邊界加深與硬化
html = html.replace('border-gray-200', 'border-gray-400')
html = html.replace('border-gray-100', 'border-gray-400')
html = html.replace('border-gray-300', 'border-gray-400')

# 3. 移除現代大圓角，改為生硬的官方文件小圓角
html = html.replace('rounded-xl', 'rounded-sm')
html = html.replace('rounded-lg', 'rounded-sm')

# 4. 特殊卡片或按鈕的銳利化
# 將捐款按鈕的 full 稍微微調，保留點擊感但不要太可愛
html = html.replace('rounded-full', 'rounded-sm')

# 5. 時間軸與標籤的「紅色印記」風格
html = html.replace('bg-gray-200 text-gray-700 text-xs font-bold rounded-md', 'bg-red-900 text-red-50 text-xs font-bold rounded-sm border border-red-950 tracking-widest')
html = html.replace('bg-gray-200 px-2.5 py-1 rounded-md', 'bg-[#d1ccc0] text-gray-800 px-2.5 py-1 rounded-sm border line-through-none border-gray-500')

# 6. Hero 區塊的灰色底色也調暗一點
html = html.replace('bg-[#e5e5e5]', 'bg-[#d1ccc0]')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
