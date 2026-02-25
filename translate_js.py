import os

file_path = "script_en.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = {
    # Scenarios Data
    '平民/農工': 'Civilian / Worker',
    '知識份子/學生': 'Intellectual / Student',
    '外省/軍公教': 'Mainlander / Gov. & Military',
    '清鄉時刻': 'Pacification Operations',
    '你是一名在市場做小生意的本省人。某天，軍隊突然開進街頭，無差別掃射...' : 'You are a Taiwanese local running a small business in the market. One day, the military suddenly rolls into the streets, firing indiscriminately...',
    '躲進防空洞': 'Hide in the air raid shelter',
    '加入地方自衛隊': 'Join the local self-defense force',
    '「根據史料，許多未參與抗爭的無辜報關行職員、商界人士，在清鄉期間遭軍隊強行帶走，從此下落不明。」': '"According to historical archives, many innocent customs clerks and business people who did not participate in the protests were forcibly taken away by the military during the pacification period and their whereabouts have been unknown ever since."',
    '參與處理委員會': 'The Settlement Committee',
    '你是一名受過高等教育的台籍菁英，對陳儀政府的貪腐感到不滿。你決定...' : 'You are a highly educated Taiwanese elite, dissatisfied with the corruption of the Chen Yi government. You decide to...',
    '起草改革建言書': 'Draft a reform proposal',
    '走上街頭發表演說': 'Take to the streets and give a speech',
    '「歷史上的『二二八事件處理委員會』成員，多為和平請願的士紳。但他們最終被陳儀設局，以『叛亂』罪名遭到逮捕或未經審判而槍決。」': '"Members of the historical \'228 Incident Settlement Committee\' were mostly gentry petitioning for peace. However, they were eventually framed by Chen Yi and arrested or executed without trial on charges of \'rebellion\'."',
    '衝突爆發': 'Conflict Erupts',
    '你是一名剛到台灣不久的外省公務員。街頭爆發了本省人針對外省人的毆打事件...': 'You are a Mainlander civil servant who recently arrived in Taiwan. Beatings targeting Mainlanders erupt on the streets...',
    '躲在台灣朋友家中': 'Hide in a Taiwanese friend\'s house',
    '逃往憲兵隊求保護': 'Flee to the military police for protection',
    '「不可否認，事件初期確有部分外省籍人士遭到本省暴民攻擊。但許多台灣民眾也冒著生命危險，將外省鄰居藏匿於家中。」': '"Undeniably, some Mainlanders were attacked by Taiwanese rioters in the early stages of the incident. However, many Taiwanese also risked their lives to hide their Mainlander neighbors in their homes."',

    # Timeline Data
    '1947年2月27日': 'February 27, 1947',
    '查緝私菸爆發血案': 'Smuggled Cigarette Crackdown Leads to Bloodshed',
    '專賣局查緝員在台北市大稻埕太平町法主公廟對面積查私菸，打傷女販林江邁，並誤殺抗議市民陳文溪。此事件成為引爆全台怒火的導火線。': 'Monopoly Bureau agents confiscated smuggled cigarettes opposite the Fazhugong Temple in Dadaocheng, Taipei, injuring a female vendor, Lin Jiang-mai, and accidentally killing a protesting citizen, Chen Wen-xi. This incident sparked outrage across Taiwan.',
    '林江邁': 'Lin Jiang-mai',
    '陳文溪': 'Chen Wen-xi',
    '「查緝員不僅沒收香菸與現金，更以手槍槍柄擊破林江邁頭部，導致其當場昏迷。隨後在逃避群眾追打時，盲目開槍中傷無辜市民陳文溪。」': '"The agents not only confiscated the cigarettes and cash but also struck Lin Jiang-mai\'s head with a pistol grip, rendering her unconscious. While fleeing from the pursuing crowd, they fired blindly, injuring innocent citizen Chen Wen-xi."',
    '《二二八事件調查報告》行政院，1992': '"The 228 Incident Investigation Report", Executive Yuan, 1992',
    '本質上為長官公署實施經濟統制（專賣制度）所累積的民怨爆發。非單純治安事件，而是官逼民反。': 'Fundamentally, it was an explosion of public resentment accumulated by the economic control (monopoly system) implemented by the Chief Executive\'s Office. It was not a simple public security incident, but a rebellion forced by official tyranny.',
    '國史館檔案號：198.24': 'Academia Historica File: 198.24',

    '1947年2月28日': 'February 28, 1947',
    '長官公署衛兵開槍掃射': 'Guards at Chief Executive\'s Office Open Fire',
    '群眾遊行前往台灣省行政長官公署（今行政院）請願，要求嚴懲兇手。但衛兵卻向長官公署廣場前的和平請願群眾開槍，造成死傷，局勢瞬間失控。': 'A crowd marched to the Taiwan Provincial Chief Executive\'s Office (now the Executive Yuan) to petition for severe punishment of the perpetrators. However, guards fired upon the peaceful petitioners in the square, causing casualties and causing the situation to instantly spiral out of control.',
    '陳儀': 'Chen Yi',
    '「群眾行至長官公署廣場前，未料公署陽台之機槍及樓下衛兵竟同時向群眾掃射，當場死傷數十人...」': '"As the crowd reached the square of the Chief Executive\'s Office, unexpectedly, machine guns on the balcony and guards below opened fire simultaneously, killing and injuring dozens on the spot..."',
    '當時的民間史料與口述歷史紀錄': 'Folk historical materials and oral history records of the time',
    '政府第一時間的武力鎮壓，直接將原本單純的「懲兇」訴求，升級為全島性的反抗運動。': 'The government\'s immediate armed suppression directly escalated the original request for "punishing perpetrators" into an island-wide resistance movement.',
    '國家發展委員會檔案管理局': 'National Development Council Archives',

    '1947年3月1日 - 3月7日': 'March 1 - March 7, 1947',
    '全島衝突與處理委員會成立': 'Island-wide Conflict and Formation of Settlement Committee',
    '動亂蔓延全台。台灣地方仕紳、民意代表與學生組成「二二八事件處理委員會」，前往交涉並提出《三十二條處理大綱》，要求政治改革、縣市長民選。陳儀表面敷衍，實則密電南京請求派兵。': 'The unrest spread throughout Taiwan. Taiwanese local gentry, representatives, and students formed the "228 Incident Settlement Committee", negotiating and proposing the "32-Point Demands", demanding political reform and popular election of mayors. Chen Yi appeared to pacify them but secretly wired Nanjing to request troops.',
    '蔣渭川': 'Jiang Wei-chuan',
    '王添灯': 'Wang Tian-deng',
    '蔣介石': 'Chiang Kai-shek',
    '「對於奸黨亂徒...必須加以制裁...（陳儀3月2日廣播）」；同時密電蔣介石：「台灣形勢已成叛亂，僅靠現有兵力實不足以平亂，懇請速派大軍鎮壓。」': '"Traitorous parties and rioters... must be sanctioned... (Chen Yi broadcast on March 2)"; at the same time, he secretly wired Chiang Kai-shek: "The situation in Taiwan has become a rebellion. The existing military force is absolutely insufficient to quell it. I implore you to swiftly send a large army to suppress it."',
    '《大溪檔案》蔣中正總統文物': '"Daxi Archives" President Chiang Kai-shek Artifacts',
    '處理委員會的訴求多屬近代民主憲政的範圍（如自治、人權保障），卻被官方羅織為「共產黨煽動」與「叛亂」的罪名，作為後續大屠殺的藉口。': 'Most of the Settlement Committee\'s demands were within the scope of modern democratic constitutionalism (such as autonomy and human rights protection), but the government framed them as "Communist incitement" and "rebellion" to serve as an excuse for the subsequent massacre.',
    '二二八紀念基金會史料': 'Memorial Foundation of 228 Archives',

    '1947年3月8日': 'March 8, 1947',
    '國民革命軍第21師登陸基隆': 'National Revolutionary Army 21st Division Lands in Keelung',
    '奉蔣介石之命，國軍第21師等增援部隊陸續從基隆與高雄登陸。抵達後隨即展開無差別的掃射與報復性屠殺，基隆首當其衝，血流成河，史稱「三月大屠殺」。': 'Under the orders of Chiang Kai-shek, the 21st Division and other reinforcement troops of the National Army successively landed in Keelung and Kaohsiung. Upon arrival, they immediately launched indiscriminate shooting and retaliatory massacres. Keelung bore the brunt, with rivers of blood, historically known as the "March Massacre".',
    '彭孟緝': 'Peng Meng-ji',
    '史宏熹': 'Shi Hong-xi',
    '「基隆登陸後，沿途遇人即開槍，無辜市民死傷慘重... 高雄要塞司令彭孟緝更是下令向高雄市政府、火車站等處開砲...」': '"After landing in Keelung, they shot anyone they met along the way. Innocent citizens suffered heavy casualties... Kaohsiung Fortress Commander Peng Meng-ji even ordered artillery fire on the Kaohsiung City Government, the train station, and other places..."',
    '外籍記者與倖存者口述見證': 'Oral testimonies of foreign journalists and survivors',
    '這是國家常規軍隊對本國平民進行的有組織武裝鎮壓，其火力與死傷規模，絕非網路謠言宣稱的「單純鎮暴」或「雙方互有死傷」。': 'This was an organized armed suppression by the state\'s regular army against its own civilians. The scale of firepower and casualties was by no means the "simple riot control" or "mutual casualties" claimed by internet rumors.',
    '國防部檔案管理局密件': 'Ministry of National Defense Archives Confidential Documents',

    '1947年3月底 - 5月': 'Late March - May, 1947',
    '全鄉綏靖與菁英清洗': 'Pacification and Purge of Elites',
    '隨著大部隊掌控局勢，陳儀宣布全省實施「清鄉」。軍警以戶口清查、連坐法等手段，大肆逮捕、暗殺未經審判的台灣知識份子、醫生、律師、民意代表與學生，造成台灣一整代本土菁英的斷層。': 'As the main troops took control, Chen Yi announced the implementation of "Pacification" throughout the province. Military police used census checks, collective guilt systems, and other methods to aggressively arrest and assassinate untried Taiwanese intellectuals, doctors, lawyers, representatives, and students, resulting in a lost generation of native elite.',
    '陳炘': 'Chen Xin',
    '林茂生': 'Lin Mao-sheng',
    '張七郎': 'Zhang Qi-lang',
    '「凡屬處理委員會之委員，多於夜間遭軍警蒙眼私自帶走。次日或數日後，屍體多發現於圓山、南港橋下或淡水河畔，死狀悽慘。」': '"Most members of the Settlement Committee were secretly taken away blindfolded by military police at night. The next day or a few days later, their corpses were mostly found under Yuanshan, Nangang Bridge, or along the Tamsui River, in miserable conditions."',
    '受難者家屬回憶錄': 'Memoirs of victims\' families',
    '清鄉期間的暴行並非戰時混亂，而是有計畫的政治清洗（Political Purge）。受難者多未經合法程序即遭剝奪生命，成為長達40年白色恐怖的序幕。': 'The atrocities during the pacification period were not wartime chaos but a planned Political Purge. Most victims were deprived of their lives without due process, marking the prelude to the 40-year White Terror.',
    '警備總部絕密檔案': 'Taiwan Garrison Command Top Secret Archives',

    # Fact checks
    '「228只是民進黨為了選舉製造仇恨的工具，根本沒那麼嚴重。」': '"228 is just a tool for the DPP to create hatred for elections; it wasn\'t that serious at all."',
    '228平反運動始於1987年，由民間發起。首位代表政府道歉的是國民黨籍總統李登輝（1995年）。補償條例與基金會的成立皆跨越黨派。這是國家級的人權議題，非單一政黨專利。': 'The 228 vindication movement began in 1987, initiated by civil society. The first to apologize on behalf of the government was KMT President Lee Teng-hui (1995). The Compensation Act and the establishment of the foundation crossed party lines. This is a national human rights issue, not the monopoly of a single political party.',
    
    '「死那麼多人都是假的，其實只有幾百人意外死亡。」': '"The mass deaths are fake; in reality, only a few hundred people died accidentally."',
    '根據行政院《二二八事件研究報告》，估計死亡人數約在18,000至28,000人之間。雖然確切數字因當時戶籍混亂難以精確，但「僅數百人」的說法嚴重違背史實與檔案紀錄。': 'According to the Executive Yuan\'s "Research Report on the 228 Incident", the estimated number of deaths ranges from 18,000 to 28,000. Although exact numbers are difficult to pinpoint due to household registration chaos at the time, the claim of "only a few hundred" seriously violates historical facts and archive records.',
    
    '「這些人都是共產黨，政府是為了剿匪。」': '"These people were all Communists, and the government was exterminating bandits."',
    '雖然當時有少數左翼份子，但絕大多數受難者是期待政治改革的仕紳、學生與一般市民。將所有反抗者貼上「共產黨」標籤，是威權政府為合理化鎮壓與清鄉的藉口。': 'Although there was a small number of leftists at the time, the vast majority of victims were gentry, students, and ordinary citizens anticipating political reform. Labeling all resisters as "Communists" was a pretext used by the authoritarian government to rationalize suppression and pacification.',

    '「外省人也被殺，為什麼都不提？」': '"Mainlanders were also killed, why is that never mentioned?"',
    '史實並未否認初期衝突中有本省人對外省人的暴力行為，這在官方報告中皆有明確記載。但後續國家機器的軍事鎮壓與長期白色恐怖，其無差別攻擊的規模、組織性與延續性，與初期的警民衝突完全不成比例。': 'Historical facts do not deny that there was violence by Taiwanese against Mainlanders in early conflicts, which is clearly documented in official reports. But the subsequent military suppression and long-term White Terror by the state apparatus were completely disproportionate in scale, organization, and continuity compared to the initial police-civilian conflicts.',

    '「受難家屬已經領了那麼多賠償金，為什麼還要一直吵？」': '"The victims\' families have already received so much compensation, why do they keep complaining?"',
    '首先，那是由全民納稅人支應的「補償金」而非加害者付出的「賠償金」。其次，對多數家屬而言，金錢無法挽回破碎的家庭，他們真正訴求的是「歷史真相的完全解密」與「加害者責任的釐清」。': 'First, it was a "compensation fund" paid by taxpayers, not "reparations" from the perpetrators. Second, for most families, money cannot bring back broken families; their true appeal is "complete declassification of historical truth" and "clarification of perpetrators\' responsibilities".',

    '「當時的台灣人受到日本奴化教育，所以才會造反。」': '"The Taiwanese at that time were subjected to Japanese enslavement education, which is why they rebelled."',
    '參與「處理委員會」提出改革要求的多為受過高等教育的知識份子。他們是基於對陳儀政府貪腐無能、物價飛漲與特權壟斷的不滿，提出縣市長民選等近代民主訴求，與「奴化」毫無關聯。': 'Most of those participating in the "Settlement Committee" demanding reform were highly educated intellectuals. Their demands for modern democratic rights, such as popular election of mayors, were based on dissatisfaction with the corruption, incompetence, soaring prices, and privileges of the Chen Yi government, completely unrelated to "enslavement".',

    '「如果不派兵鎮壓，台灣早就被共產黨拿下了。」': '"If troops had not been sent to suppress it, Taiwan would have been taken over by the Communists long ago."',
    '當時台灣的共產黨員人數極少（根據檔案僅數十人），根本無法策動全島抗爭。將二二八定調為共產黨叛亂，完全是陳儀為了掩飾施政失敗，並說服蔣介石派兵鎮壓所羅織的藉口。': 'The number of Communist Party members in Taiwan at the time was extremely small (only dozens according to archives), completely incapable of instigating island-wide resistance. Defining 228 as a Communist rebellion was entirely an excuse fabricated by Chen Yi to cover up policy failures and persuade Chiang Kai-shek to send troops.',

    # Charts Translation
    '學生': 'Students',
    '公務員': 'Civil Servants',
    '民眾(無業/家管)': 'Citizens (Unemployed/Housewives)',
    '商界': 'Merchants',
    '工界': 'Workers',
    '自由業(醫/律)': 'Freelancers (Med/Law)',
    '農漁': 'Farmers/Fishers',
    '佔比 (%)': 'Percentage (%)',
    '受難比例 (%)': 'Victim Ratio (%)',
    '死亡': 'Deceased',
    '失蹤': 'Missing',
    '羈押/判刑': 'Detained/Sentenced',
    '受傷/其他': 'Injured/Other',
    '史實查證': 'Fact Check',
    '史實查證與破除迷思': 'Fact Check & Myth Busting',
    
    # Missing from index parsing / extra UI
    '重選情境': 'Reselect Scenario',
    '歷史存檔': 'History Log',
}

for zh, en in replacements.items():
    content = content.replace(zh, en)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("JS Translation completed successfully.")
