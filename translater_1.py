import re

with open('index_en.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Chapter 0
c0_zh = """在當代高速發展的數位資訊環境中，歷史事件早已超越了單純的學術考證範疇，轉而成為形塑政治合法性、動員群眾情緒以及進行跨國界認知作戰的核心場域。近期，各大社群平台與影音分享網站上頻繁出現特定網路帳號之協同性攻擊行為，這些帳號大量散布經過特定剪輯與論述包裝的短影音，其核心論述直指當前的執政黨（民主進步黨）刻意「操弄二二八事件」，並指控官方機構透過扭曲史實、放大特定族群之受害程度、掩蓋外省籍人士的死傷數據，藉此獲取政治利益並撕裂台灣社會。此類現象不僅凸顯了二二八事件在台灣社會中仍具備高度的敏感性與政治動員能量，更反映出歷史記憶在缺乏嚴謹脈絡的數位傳播下，極易被碎片化、武器化。"""

c0_en = """In the rapidly developing digital information environment of our time, historical events have transcended academic research, becoming core arenas for shaping political legitimacy, mobilizing emotions, and conducting cognitive warfare. Recently, coordinated attacks by specific accounts have appeared on major social platforms, distributing short videos packaged with specific narratives. Their core argument accuses the current ruling party of deliberately "manipulating the 228 Incident," alleging that official institutions acquire political benefits and tear society apart by distorting historical facts, exaggerating specific victims, and covering up Mainlander casualty data. Such phenomena not only highlight the high sensitivity of the 228 Incident but also reflect how easily historical memory can be fragmented and weaponized."""

html = html.replace(c0_zh, c0_en)

c0_zh2 = """要客觀檢視「操弄歷史」的嚴重指控，並拆解隱藏於短影音背後的政治修辭，必須回歸最嚴謹的史料考證、法理學分析以及人口統計學實證。二二八事件作為二十世紀台灣最為重大的歷史悲劇，其牽涉層面廣泛，涵蓋戰後初期的國家體制暴力、族群利益衝突、制度性統治失能，以及後續長達數十年的威權禁錮與白色恐怖。本報告奠基於官方解密檔案、中央研究院等學術機構之研究、人口學與流行病學統計，以及財團法人二二八事件紀念基金會發布之歷次權威報告，針對事件的政治責任歸屬、本省與外省族群之真實傷亡數據論辯、轉型正義的法律界定標準與個案爭議、中國共產黨在事件中的真實歷史角色，以及當代網路錯假訊息的具體運作機制進行極度深度的剖析。透過爬梳多方史料與實證數據，本報告旨在釐清歷史真相與政治操弄之間的明確界線，提供具備深度、廣度與法理基礎之專業洞見，以回應當代社會對於歷史真相與資訊識讀的迫切需求。"""

c0_en2 = """To objectively examine the grave accusations of "manipulating history" and dismantle the political rhetoric hidden behind short videos, we must return to the most rigorous historical textual research, jurisprudential analysis, and demographic empirical evidence. As the most significant historical tragedy in 20th-century Taiwan, the 228 Incident involved broad dimensions, covering the state institutional violence of the early post-war period, ethnic conflicts, institutional governance failure, and the subsequent decades of authoritarian imprisonment and White Terror. Based on declassified official archives, research by academic institutions, demographic statistics, and authoritative reports released by the Memorial Foundation of 228, this report conducts an in-depth analysis on the political accountability of the incident, the debate over the true casualty figures, the legal boundaries of transitional justice, the true historical role of the CCP, and the specific operational mechanisms of contemporary online disinformation. By combing through multiple archives and empirical data, this report aims to clarify the boundary between historical truth and political manipulation, providing professional insights with depth, breadth, and a jurisprudential foundation to respond to contemporary society's urgent need for historical truth and information literacy."""

html = html.replace(c0_zh2, c0_en2)

c1_zh1 = """探討任何關於二二八事件的歷史論述，首要任務是確立事件爆發的結構性背景與國家機器的責任歸屬。過去在長達數十年的戒嚴與威權統治時期，官方論述掌握了絕對的詮釋權，多將事件單向定調為「共黨分子煽動」、「日本奴化教育遺毒」或單純的「暴民作亂」；然而，隨著台灣民主化進程的推進與大量國家機密檔案的解密，學界與官方的歷史共識已產生了根本性的移轉，將焦點轉向國家體制的失能與公權力的濫用。"""
c1_en1 = """When exploring any historical narrative regarding the 228 Incident, the primary task is to establish the structural background of its outbreak and the accountability of the state apparatus. During the decades of martial law and authoritarian rule, official narratives held absolute interpretative power, framing the event one-sidedly as "Communist incitement," "the remnants of Japanese enslavement education," or simply "mob rebellion." However, with the advancement of Taiwan's democratization and the declassification of state classified archives, the historical consensus among academia and officials has undergone a fundamental shift, focusing instead on the failure of the state system and the abuse of public power."""
html = html.replace(c1_zh1, c1_en1)

with open('index_en.html', 'w', encoding='utf-8') as f:
    f.write(html)
