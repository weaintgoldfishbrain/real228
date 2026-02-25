import os

file_path = "index_en.html"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    # SEO
    '二二八事件史實查證與分析報告': 'The 228 Incident: Fact-Checking & Analysis Report',
    '針對近期網路上流傳「民進黨操弄228」及淡化事件嚴重性的論述，本報告彙整行政院調查報告、口述歷史與學術研究，以客觀數據與史料還原歷史真相。': 'Addressing online narratives that downplay the severity of the 228 Incident or label it as "political manipulation," this report compiles official investigations, oral histories, and academic research to restore the historical truth with objective data and archives.',
    '獨立史實查證專案': 'Independent Historical Fact-Checking Project',
    '撥開歷史迷霧：二二八事件史實查證報告': 'Clearing the Fog of History: The 228 Incident Fact-Checking Report',
    '面對網路謠言與「政治操作」的指控，我們用權威史料與真實數據說話。': 'Facing internet rumors and accusations of "political manipulation," we speak with authoritative archives and real data.',
    
    # Intro
    '被抹滅的真相、消逝的聲音與凝結的血淚': 'The Erased Truth, Vanished Voices, and Frozen Blood Tears',
    '凝視歷史真相': 'Gaze into Historical Truth',
    
    # Navbar
    '史實查證報告': 'Fact-Checking Report',
    '首頁': 'Home',
    '歷史見證': 'Historical Witness',
    '時間軸與史料': 'Timeline & Archives',
    '報告全文': 'Full Report',
    '謠言查核': 'Fact Check',
    '<span class="hidden sm:inline">請喝咖啡</span>': '<span class="hidden sm:inline">Buy me a coffee</span>',
    '<span>請喝咖啡</span>': '<span>Buy a Coffee</span>',
    '<span>請喝咖啡 (贊助)</span>': '<span>Buy a Coffee (Donate)</span>',
    
    # Hero
    '撥開歷史迷霧<br>': 'Clearing the Fog of History<br>',
    '還原二二八真相': 'Restoring the Truth of 228',
    '近期網路上充斥著「228是選舉操弄」、「只是暴民滋事」的言論。本報告不講政治口水，僅彙整國家檔案管理局資料、行政院調查報告與真實歷史影像，用最沉痛的史實，直球對決網路謠言。': 'Recently, the internet has been flooded with rhetoric claiming that "228 is an electoral manipulation" or "just rioters causing trouble." This report sets aside political squabbles and directly confronts internet rumors with the most solemn historical facts, compiling data from the National Archives Administration, Executive Yuan investigation reports, and real historical images.',
    '闢謠查核': 'Fact Check',
    '歷史見證': 'Historical Witness',
    '<span class="font-bold">歷史現場：</span>專賣局前抗議群眾聚集': '<span class="font-bold">Historical Scene:</span> Crowds protesting in front of the Monopoly Bureau',
    '<span class="font-bold">史料：</span>臺北放送局演奏所（今臺北二二八紀念館）': '<span class="font-bold">Archive:</span> Taipei Broadcasting Bureau (now Taipei 228 Memorial Museum)',
    '<span class="font-bold">史料：</span>事件後國防部長白崇禧來台宣慰': '<span class="font-bold">Archive:</span> Defense Minister Bai Chongxi visiting Taiwan to comfort the people after the incident',
    
    # Scenario
    '歷史不能只看冰冷的數字，每個名字背後都是一個破碎的家庭。我們無意挑起仇恨，但真相不容忘卻。': 'History cannot be viewed only through cold numbers; behind every name is a broken family. We have no intention of provoking hatred, but the truth must not be forgotten.',
    
    # Timeline
    '歷史的切片：二二八事件發展時間軸': 'Slices of History: The Timeline of the 228 Incident',
    
    # Report Section
    '撥開迷霧：官方解密報告全文': 'Clearing the Fog: Full Declassified Official Report',
    '點擊章節展開閱讀詳細的歷史分析與證據。本報告皆立基於官方檔案與學界共識。': 'Click the chapters to expand and read detailed historical analysis and evidence. This report is entirely based on official archives and academic consensus.',
    '全部展開': 'Expand All',
    '全部收合': 'Collapse All',
    
    # Fact Check Section
    '謠言直球對決': 'Confronting Rumors Directly',
    '點擊常見網路論述，查看官方檔案與歷史調查的真實結論。': 'Click on common internet narratives to see the real conclusions from official archives and historical investigations.',
    
    # Footer
    '資料來源：行政院《二二八事件研究報告》、二二八事件紀念基金會': 'Sources: Executive Yuan "Research Report on the 228 Incident", Memorial Foundation of 228',
    
    # Sitemap
    '計畫初衷': 'Project Intention',
    '我們是一群致力於歷史真相普及的志工。在這個資訊破碎的時代，期望透過數位化的方式，讓沈重的歷史檔案能夠被更多人看見，而非淪為政治口水的提款機。': 'We are a group of volunteers dedicated to popularizing historical truth. In this era of fragmented information, we hope that through digitalization, heavy historical archives can be seen by more people, rather than becoming a pawn in political squabbles.',
    '報告章節': 'Report Chapters',
    '導論與背景': 'Introduction & Context',
    '全面鎮壓與清鄉': 'Total Suppression & Pacification',
    '受難者輪廓分析': 'Victim Profile Analysis',
    '快速跳轉': 'Quick Links',
    '時間軸': 'Timeline',
    
    # Some common button texts
    '閱讀全文與資料來源': 'Read Full Text & Sources',
    '重新選擇': 'Choose Again',
    '查看分析報告': 'View Analysis Report'
}

for zh, en in replacements.items():
    content = content.replace(zh, en)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Translation completed successfully.")
