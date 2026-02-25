import os

with open('index_en.html', 'r', encoding='utf-8') as f:
    html = f.read()

repls = {
    # Chapter 1 headers
    """導論：數位平台上的歷史記憶重構與資訊操弄挑戰""": """Introduction: The Reconstruction of Historical Memory and the Challenge of Information Manipulation on Digital Platforms""",
    """第一章：二二八事件的歷史脈絡、制度性失能與國家責任歸屬""": """Chapter 1: The Historical Context, Institutional Failure, and State Accountability of the 228 Incident""",
    """行政長官公署體制的權力壟斷與社會矛盾激化""": """The Power Monopoly of the Chief Executive's Office System and the Intensification of Social Contradictions""",
    """南京決策高層的誤判與國家機器的毀滅性鎮壓""": """The Misjudgment of the Nanjing High Command and the Devastating Suppression by the State Apparatus""",
    """第二章：傷亡人數之歷史爭辯、人口學推論與官方實證數據""": """Chapter 2: Historical Debate over Casualties, Demographic Inference, and Official Empirical Data""",
    """歷史文獻與官方檔案中的數據分歧""": """Data Discrepancies in Historical Documents and Official Archives""",
    """人口統計學推估的極限與流行病學的反證""": """The Limits of Demographic Projections and Epidemiological Counter-Evidence""",
    """外省族群傷亡統計：拆解「外省人死傷更多」的資訊戰迷思""": """Mainlander Casualty Statistics: Dismantling the Information War Myth of "More Mainlanders Died\"""",
    """第三章：轉型正義的法理邊界與個案爭議之深度檢視""": """Chapter 3: The Jurisprudential Boundaries of Transitional Justice and In-Depth Examination of Case Controversies""",
    """劉青山命案與何鑾旗冤死案之歷史與法理對照""": """Historical and Jurisprudential Comparison of the Murder of Liu Qing-shan and the Wrongful Execution of He Luan-qi""",
    """國家暴力與群眾暴力：轉型正義不可逾越的法理界線""": """State Violence vs. Mob Violence: The Insurmountable Jurisprudential Boundary of Transitional Justice""",
    """第四章：政治史觀的挪用與中國共產黨角色之歷史釐清""": """Chapter 4: The Appropriation of Political Historiography and Historical Clarification of the Chinese Communist Party's Role""",
    """謝雪紅與「二七部隊」的神話建構與史實還原""": """The Myth Building and Historical Restoration of Xie Xue-hong and the "27 Brigade\"""",
    """國共兩黨在威權史觀上的弔詭匯流與當代認知作戰""": """The Paradoxical Convergence of KMT and CCP Authoritarian Historical Views and Contemporary Cognitive Warfare""",
    """第五章：網路錯假訊息的解構與認知作戰之戰略目的""": """Chapter 5: The Deconstruction of Online Disinformation and the Strategic Objectives of Cognitive Warfare""",
    """台灣事實查核中心的實證查核案例：楊振隆案""": """Empirical Fact-Checking Case by the Taiwan FactCheck Center: The Yang Zhen-long Case""",
    """數位資訊戰的深層運作邏輯與政治目標""": """The Deep Operational Logic and Political Objectives of Digital Information Warfare""",
    """結論：捍衛歷史真相與深化轉型正義之展望""": """Conclusion: Defending Historical Truth and Prospects for Deepening Transitional Justice""",

    # Table heads
    """提報者身份""": """Reporter Identity""",
    """提報年份""": """Year Reported""",
    """外省籍宣稱數據""": """Claimed Mainlander Casualties""",
    """本省籍及整體宣稱數據""": """Claimed Taiwanese & Overall Casualties""",
    """時任國防部長 白崇禧""": """Then-Defense Minister Bai Chongxi""",
    """軍警與台籍死傷共 1,860人""": """Military/Police/Taiwanese total dead/injured: 1,860""",
    """死傷失蹤共 1,958人""": """Dead/injured/missing: 1,958""",
    """死傷失蹤共 643人 (另有死3,200人紀錄)""": """Dead/injured/missing: 643 (also a record of 3,200 dead)""",
    """上海《大公報》/ 警政單位""": """Shanghai Ta Kung Pao / Police agencies""",
    """死432, 傷2126, 蹤85 (共2,643人)""": """Dead 432, injured 2,126, missing 85 (Total 2,643)""",
    """未具體對比""": """No specific comparison""",
    """死 6,300人""": """Dead: 6,300""",
    """蘇新 (台共人士)""": """Su Xin (Taiwanese Communist)""",
    """死不下 10,000人""": """No fewer than 10,000 dead""",
    """時任美國副領事 葛超智""": """Then-US Vice Consul George H. Kerr""",
    """死 20,000人""": """Dead: 20,000""",
    """二二八紀念基金會 (實證)""": """Memorial Foundation of 228 (Empirical)""",
    """2006年後""": """Post-2006""",
    """死/失蹤 89人, 傷 1,389人""": """Dead/missing 89, injured 1,389""",
    """總受領賠償 10,280人""": """Total compensated received: 10,280""",
    """資料來源 / 提報者身份""": """Source / Reporter Identity""",
    """台灣警備總司令部""": """Taiwan Garrison Command""",
    """保安處""": """Security Office""",

    # Shorter strings / bullet points
    """去合法化 (Delegitimization) 與道德剝奪：""": """Delegitimization and Moral Deprivation:""",
    """發放標準存在政治偏見與族群歧視。""": """payment standards harbor political bias and ethnic discrimination.""",
    """戰略性轉移焦點 (Whataboutism)：""": """Strategic Focus Shifting (Whataboutism):""",
    """極化社會結構 (Polarization)：""": """Polarization of Social Structures:""",
}

for k, v in repls.items():
    html = html.replace(k, v)

with open('index_en.html', 'w', encoding='utf-8') as f:
    f.write(html)
