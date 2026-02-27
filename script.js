const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 }; // 初始游標移到畫面外
let bloodTrails = [];
let animationId;
let isIntroActive = true;

// 初始化 Canvas 大小
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 監聽滑鼠移動
window.addEventListener('mousemove', (e) => {
    if (!isIntroActive) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // 當滑鼠移動時，產生少許紅色暈染拖曳痕跡 (血跡)
    if (Math.random() > 0.5) {
        bloodTrails.push(new BloodTrail(mouse.x, mouse.y));
    }
});

// ==== 灰燼/粒子實體 (Ash Particle) ====
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // 初始時隨機分佈在整個畫面
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -10; // 從最頂端掉落
        // 大小與重量感不同：有的細如灰塵，有的大如碎紙片
        this.size = Math.random() * 3 + 0.5;
        // 緩慢下墜
        this.speedY = Math.random() * 1 + 0.2;
        // 左右微幅擺動
        this.vx = (Math.random() - 0.5) * 0.5;
        this.swingAngle = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.01;

        // 大多數是灰色灰燼，極少數帶有暗紅色（像滴落的血）
        this.isBlood = Math.random() > 0.95;
        this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.y += this.speedY;

        // 製造飄落的擺動感 (如落葉或灰燼)
        this.swingAngle += this.swingSpeed;
        this.x += Math.sin(this.swingAngle) * 1 + this.vx;

        // 當粒子掉出畫面時重置
        if (this.y > height + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        if (this.isBlood) {
            ctx.fillStyle = `rgba(139, 0, 0, ${this.opacity})`; // 暗紅色
            // 血色帶有發光感
            // ctx.shadowBlur = 5;
            // ctx.shadowColor = 'red';
        } else {
            ctx.fillStyle = `rgba(100, 100, 100, ${this.opacity})`; // 暗灰色
            // ctx.shadowBlur = 0;
        }

        ctx.fill();
    }
}

// ==== 血跡拖曳實體 (Blood Trail) ====
class BloodTrail {
    constructor(x, y) {
        this.x = x + (Math.random() * 20 - 10);
        this.y = y + (Math.random() * 20 - 10);
        this.size = Math.random() * 15 + 5;
        this.opacity = 0.5;
        this.decay = Math.random() * 0.01 + 0.005; // 慢慢消散
    }

    update() {
        this.opacity -= this.decay;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // 柔和的紅色光暈邊緣
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(139, 0, 0, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// 建立粒子群
const particleCount = 150;
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// 動畫主迴圈
function animate() {
    if (!isIntroActive) return;
    // 使用帶有透明度的黑色填滿整個 Canvas，以產生微微的拖影效果 (Motion Blur)
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // 更新並繪製血跡拖曳 (由舊到新遍歷，方便刪除)
    for (let i = bloodTrails.length - 1; i >= 0; i--) {
        let t = bloodTrails[i];
        t.update();
        if (t.opacity <= 0) {
            bloodTrails.splice(i, 1);
        } else {
            t.draw();
        }
    }

    // 更新並繪製灰燼粒子
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
}

// 啟動動畫
animate();


// ==========================================
// [轉場] Intro Screen 到 舊版內容
// ==========================================
document.getElementById('enter-site-btn').addEventListener('click', () => {
    // 1. 淡出 Intro 畫面
    const introScreen = document.getElementById('intro-screen');
    introScreen.classList.add('hidden-intro');

    // 2. 停止 Canvas 動畫以釋放資源
    isIntroActive = false;
    cancelAnimationFrame(animationId);

    // 3. 顯示舊版主內容
    const mainContent = document.getElementById('main-content');
    mainContent.style.pointerEvents = 'auto';
    mainContent.style.opacity = '1';

    // 4. 初始化 Charts (需等 mainContent 有大小才能正確繪製)
    setTimeout(initCharts, 500);
});

// ==========================================
// [舊版] 網站主要互動邏輯 
// ==========================================
// --- Hero Carousel Logic ---
function initHeroCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length <= 1) return;
    let currentSlide = 0;

    setInterval(() => {
        slides[currentSlide].classList.remove('opacity-100', 'z-10');
        slides[currentSlide].classList.add('opacity-0', 'z-0');

        currentSlide = (currentSlide + 1) % slides.length;

        slides[currentSlide].classList.remove('opacity-0', 'z-0');
        slides[currentSlide].classList.add('opacity-100', 'z-10');
    }, 5000); // 5秒輪播一次
}

// --- Empathy Scenarios Data (Expanded for Randomization) ---
const scenariosData = {
    "doctor": {
        role: "你是一位在地方深受敬重的醫師",
        context: "1947年3月初，市區爆發警民衝突，死傷慘重。地方仕紳與學生組成了「處理委員會」希望維持治安。市長親自拜託你，希望你利用聲望出面代表市民與軍方談判，要求軍隊停止開槍。",
        choices: [
            { text: "A. 挺身而出：為了保護無辜市民與學生，同意前往水上機場與軍方談判。", nextId: "doctor_a" },
            { text: "B. 婉拒躲避：深感局勢危險，為了家中年幼的孩子，決定連夜躲回鄉下老家。", nextId: "doctor_b" }
        ]
    },
    "doctor_a": { isResult: true, title: "史實見證：和平的代價", content: "在真實歷史中，許多如嘉義的潘木枝醫師、畫家陳澄波等人選擇了這條路。他們帶著和平的訴求前往軍營談判，卻立刻被扣押，綁上鐵絲，在未經任何法庭審判的情況下，被押至火車站前當眾槍決。<br><br><span class='text-red-400 font-bold'>「他們沒有暴動，他們是去求和的。」</span>這戳破了網路謠言稱死者皆為暴民的謊言。", prototype: "原型人物：潘木枝、陳澄波等和平談判代表" },
    "doctor_b": { isResult: true, title: "史實見證：躲不過的清鄉", content: "即便選擇躲避，在3月中旬展開的「清鄉」運動中，軍警特務按名冊抓人。許多未參與衝突的知識份子、律師（如林連宗）、台大教授（如林茂生）半夜在家中被強行帶走，從此「失蹤」。<br><br><span class='text-red-400 font-bold'>國家暴力的肅清，針對的是台灣菁英階層，而非單純的治安維護。</span>", prototype: "原型人物：無數在清鄉中失蹤的知識份子" },

    "reporter": {
        role: "你是一家本土報社的主筆",
        context: "二二八事件爆發後，長官公署試圖封鎖消息。你掌握了軍警在街頭無差別開槍的真實傷亡名單與照片。此時，報社外已經有特務在徘徊監視。",
        choices: [
            { text: "A. 堅持報導：身為新聞人必須揭露真相，決定連夜排版將真實傷亡印製出刊。", nextId: "reporter_a" },
            { text: "B. 妥協自保：為了報社員工與家人的安全，決定配合官方說法，發布「暴民滋事」的報導。", nextId: "reporter_b" }
        ]
    },
    "reporter_a": { isResult: true, title: "史實見證：被噤聲的第四權", content: "如《台灣新生報》總經理阮朝日、《人民導報》社長宋斐如等人，因堅持報導真相或批評時政，在清鄉期間遭特務以「叛亂」罪名帶走，從此下落不明，連屍骨都無處尋覓。<br><br><span class='text-red-400 font-bold'>國家暴力不僅抹殺了生命，也抹殺了真相的傳播。</span>", prototype: "原型人物：阮朝日、宋斐如、王添灯等報人" },
    "reporter_b": { isResult: true, title: "史實見證：株連與文字獄", content: "在戒嚴與清鄉的肅殺氛圍下，妥協並不能保證絕對的安全。許多報社被迫停刊或改組，即便配合官方，只要過去曾發表過批評言論，仍可能在後續的「白色恐怖」中被羅織罪名入獄。<br><br><span class='text-red-400 font-bold'>極權統治下的審查是溯及既往且毫無標準的。</span>", prototype: "原型人物：當時被迫停刊或受審查的台灣新聞界" },

    "student": {
        role: "你是一名滿腔熱血的大學生",
        context: "社會陷入混亂，警察大多逃避或躲藏。你與同學決定組織「學生治安服務隊」，在街頭指揮交通、保護外省籍教師與商人的安全，試圖讓社會恢復秩序。",
        choices: [
            { text: "A. 堅守崗位：即使聽說軍隊即將登陸，仍相信自己是在「協助維持治安」，繼續穿著學生制服在街頭執勤。", nextId: "student_a" },
            { text: "B. 解散撤退：察覺政府態度有異，聽從長輩勸告，立刻解散服務隊，銷毀名冊並躲藏起來。", nextId: "student_b" }
        ]
    },
    "student_a": { isResult: true, title: "史實見證：青春的鮮血", content: "3月8日軍隊登陸後，展開無差別掃射。許多穿著制服、在街頭維持治安的學生首當其衝，被軍隊視為「暴徒」直接射殺或逮捕。如基隆中學、台北市區的大學生皆有慘重傷亡。<br><br><span class='text-red-400 font-bold'>軍事鎮壓不分青紅皂白，連試圖恢復秩序的青年也成為槍下亡魂。</span>", prototype: "原型人物：參與治安維持而受難的各地青年學生" },
    "student_b": { isResult: true, title: "史實見證：黑名單與逃亡", content: "雖然暫時保住性命，但在隨後的清鄉行動中，特務四處搜捕曾參與「處理委員會」或「治安隊」的青年。許多人被迫流亡海外，或在提心吊膽中度過餘生，甚至在後續的白色恐怖中仍被抓捕。<br><br><span class='text-red-400 font-bold'>「凡走過必留下痕跡」，在威權眼裡，組織起來的青年就是威脅。</span>", prototype: "原型人物：流亡海外或隱姓埋名的台灣青年" }
};

const scenarioRootKeys = ["doctor", "reporter", "student"];

function startRandomScenario() {
    // 隨機選取一個情境原型
    const randomKey = scenarioRootKeys[Math.floor(Math.random() * scenarioRootKeys.length)];
    renderScenario(randomKey);
}

function renderScenario(scenarioId) {
    const container = document.getElementById('scenario-container');
    container.innerHTML = ''; // Clear
    container.classList.remove('fade-in');
    void container.offsetWidth; // trigger reflow

    const data = scenariosData[scenarioId];

    container.classList.add('fade-in');

    if (!data.isResult) {
        // Render Question
        container.innerHTML = `
                    <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-4 border-l-4 border-red-600 pl-4">${data.role}</h3>
                    <p class="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">${data.context}</p>
                    <div class="flex flex-col gap-4 w-full md:w-4/5 mx-auto">
                        <button onclick="renderScenario('${data.choices[0].nextId}')" class="px-6 py-4 bg-transparent border border-gray-500 text-gray-200 rounded-lg hover:bg-gray-800 hover:border-gray-300 transition text-left text-sm md:text-base">${data.choices[0].text}</button>
                        <button onclick="renderScenario('${data.choices[1].nextId}')" class="px-6 py-4 bg-transparent border border-gray-500 text-gray-200 rounded-lg hover:bg-gray-800 hover:border-gray-300 transition text-left text-sm md:text-base">${data.choices[1].text}</button>
                    </div>
                `;
    } else {
        // Render Truth Result
        container.innerHTML = `
                    <div class="text-center">
                        <span class="inline-block px-3 py-1 bg-red-900/50 text-red-400 border border-red-800 text-xs font-bold rounded mb-4">歷史的真相</span>
                        <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-6">${data.title}</h3>
                        <p class="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">${data.content}</p>
                        <p class="text-sm text-gray-500 mb-8 italic">${data.prototype}</p>
                        <button onclick="startRandomScenario()" class="px-6 py-3 border border-gray-600 text-gray-400 font-bold rounded-lg hover:text-white hover:border-white hover:bg-white/10 transition flex items-center justify-center gap-2 mx-auto">
                            <span>↻ 重新見證 (隨機人物)</span>
                        </button>
                    </div>
                `;
    }
}

// --- Timeline Data with Images (Enriched Knowledge) ---
const timelineData = [
    {
        date: '1947年 2月27日', title: '導火線：緝菸血案與誤殺',
        desc: '專賣局查緝員在台北市天馬茶房前，暴力取締私菸販賣者林江邁，並以槍托擊破其頭部。群眾包圍查緝員理論時，查緝員開槍誤殺旁觀市民陳文溪。',
        details: '事件發生在傍晚的延平北路，當時正值下班與民眾聚集時間。目擊警察與憲兵未能有效處置，民眾的怒火迅速蔓延。隔日陳文溪延醫不治，引發了全台北市的大罷工與遊行。這並不僅是一場衝突，而是長期以來民間對「專賣制度」貪腐與物價飛漲的怒火引爆點。',
        keyFigures: ['林江邁 (私菸攤商)', '陳文溪 (無辜遇難市民)', '傅學通 (開槍查緝員)'],
        quote: '查緝員不分青紅皂白，將小販的火柴、香菸、以及身上的錢全部沒收... 查緝員竟以槍柄擊中林婦頭部，頓時血流如注，昏迷倒地。',
        quoteSource: '《台灣新生報》1947年現場報導',
        fact: '📝 檔案顯示，查緝員的不當執法與驚慌開槍是引爆點。這完全是一起查緝過當引發的治安事件，戳破了「共產黨預謀武裝暴動」的謠言。',
        archive: '出處：行政院《二二八事件研究報告》',
        imageSrc: 'images/228_by_Li_Jun.jpg',
        imageAlt: '恐怖的檢查 - 黃榮燦版畫',
        caption: '《恐怖的檢查》：黃榮燦所繪，真實呈現查緝私菸爆發射殺平民的一刻'
    },
    {
        date: '1947年 2月28日', title: '長官公署開槍與佔領放送局',
        desc: '憤怒民眾遊行至長官公署（今行政院）請願要求懲兇，遭公署屋頂的衛兵用機關槍掃射。隨後群眾佔領臺北放送局，透過廣播將事件傳遍全台，各地爆發反抗行動。',
        details: '群眾最初是前往專賣局抗議，找不到局長後才轉往長官公署。衛兵未經警告直接對和平請願的群眾開槍，這項致命錯誤徹底激怒了市民。隨後民眾佔領新公園內的「臺灣廣播電臺（原臺北放送局）」，向全臺灣廣播原委，悲憤的控訴透過電波迅速擴散，成為事件從單一城市衝突演變為全島性反抗的關鍵轉捩點。',
        keyFigures: ['向全台廣播的無名學生與青年', '陳儀 (台灣省行政長官)'],
        quote: '我們並沒有帶武器，只是要請願要求處理昨天的兇手，沒想到上面就開槍了... 現在我們已經佔領廣播局，請全台灣的同胞站出來！',
        quoteSource: '事發當天臺北放送局放送的證言',
        fact: '📝 佔領廣播電台是群眾運動擴散的標準模式。當時廣播的訴求是要求「政治改革」與「懲治貪污」，而非宣佈獨立或共產革命。史料證明這是一場自發性的反抗威權運動。',
        archive: '出處：國史館二二八檔案、口述歷史研究',
        imageSrc: 'images/PIC_0210a5d7de02c6f46866.jpg',
        imageAlt: '原臺北放送局 (臺灣廣播電臺)',
        caption: '史料：原臺北放送局（臺灣廣播電臺）。民眾在此向全台播音，引爆全島響應。'
    },
    {
        date: '1947年 3月1日-5日', title: '處理委員會與政治改革訴求',
        desc: '為了平息事態，各地仕紳、民意代表與學生組成「二二八事件處理委員會」，代替失能的政府維持治安，並提出《三十二條處理大綱》要求高度自治。',
        details: '處理委員會在台北市中山堂成立，成員涵蓋了當時台灣社會最頂尖的菁英階層。他們不僅組織學生維持市區治安，也向政府提出了要求縣市長民選、廢除長官公署等政治改革訴求。然而，陳儀表面上假意答應談判、安撫民心，私下卻急電蔣介石指稱台灣發生「叛亂」，要求立刻派兵鎮壓。',
        keyFigures: ['王添灯 (省參議員)', '林連宗 (制憲國代)', '蔣渭川'],
        quote: '本省人要求改革政治，並非叛亂... 不要用武力鎮壓，這是我們切望的。',
        quoteSource: '處理委員會透過廣播台的公開呼籲',
        fact: '📝 史料與會議紀錄證明，處理委員會的目標始終是「和平解決」與「體制內改革」，從未主張台灣獨立或推翻政府。陳儀的「叛亂」指控純屬羅織罪名。',
        archive: '出處：大溪檔案（蔣介石總統文物）、陳儀請兵電報',
        imageSrc: 'images/images (9).jpg',
        imageAlt: '基隆要塞司令部前的廣場或市區群眾',
        caption: '歷史事件發生期間的市區群眾聚集（圖為當時歷史影像一隅）'
    },
    {
        date: '1947年 3月8日', title: '軍隊登陸基隆與無差別鎮壓',
        desc: '收到陳儀請兵電報後，國民政府整編第二十一師等部隊抵達基隆與高雄。部隊一登陸即展開無差別掃射，市區陷入血腥的軍事鎮壓。',
        details: '在基隆港，軍隊登陸前即向岸上擁擠的民眾開槍。在南部，高雄要塞司令彭孟緝更是下令軍隊無差別掃射高雄火車站地下道、市政府及高雄中學。軍隊以「掃蕩暴徒」為名，對平民、甚至正在街頭指揮交通的學生服務隊進行屠殺，並伴隨大規模的洗劫與搜刮。',
        keyFigures: ['劉雨卿 (21師師長)', '彭孟緝 (高雄要塞司令)'],
        quote: '軍隊一上岸就隨便開槍... 街上到處都是屍體，連淡水河裡也佈滿了浮屍，河水都被染紅了。',
        quoteSource: '美國駐台副領事葛超智 (George H. Kerr) 報告',
        fact: '📝 國內外檔案（含美方機密報告）皆明確記載了軍隊無差別攻擊平民的慘況。這是一場國家軍隊對本國未武裝人民的血腥鎮壓，並非正當的「平亂」。',
        archive: '出處：國家發展委員會檔案管理局、美國國家檔案館',
        imageSrc: 'images/228_Incident_k_(cropped).jpg',
        imageAlt: '事件中受難的遺體',
        caption: '軍事鎮壓展開後，街頭隨處可見無差別開槍下的受難者'
    },
    {
        date: '1947年 3月中旬以後', title: '全島清鄉與濫捕知識菁英',
        desc: '軍隊控制局勢後，政府宣佈戒嚴並展開「清鄉」。以逮捕「暴徒」為名，未經審判大肆暗殺與處決台籍知識份子與社會菁英。',
        details: '警備總部實質上是依照事先草擬的「黑名單」，針對曾參與處理委員會、報社記者、律師、醫師與大學教授進行政治清算。許多菁英在半夜被特務帶走後即下落不明，連屍骨都無處尋覓。這場針對性的捕殺，造成台灣社會領導階層嚴重的斷層，也開啟了後續近四十年的白色恐怖時期。',
        keyFigures: ['陳澄波 (畫家)', '潘木枝 (醫師)', '林茂生 (台大教授)', '阮朝日 (新生報總經理)'],
        quote: '我死了，你們要堅強，不要忘記我是為了台灣人而死的。好好讀書，為台灣貢獻。',
        quoteSource: '多位受難者臨終前留給家屬的遺言概念',
        fact: '📝 清鄉階段的逮捕與處決幾乎皆無合法審判紀錄。這不僅是為了「解除武裝」，更是國家機器為了消滅台灣本土異議聲音的系統性剷除。',
        archive: '出處：國防部保密局台灣站檔案、受難者家屬口述',
        imageSrc: 'images/WI01-001.jpg',
        imageAlt: '受難者遺書',
        caption: '受難菁英的最後告別：在未經審判的清鄉中，無數菁英留下絕筆'
    }
];

let currentTimelineIndex = 0;

function renderTimelineMobile() {
    const container = document.getElementById('timeline-mobile');
    container.innerHTML = timelineData.map((item, index) => {
        const tagsRaw = item.keyFigures && item.keyFigures.length > 0
            ? item.keyFigures.map(f => `<span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md">👤 ${f}</span>`).join('')
            : '';
        const quoteRaw = item.quote ? `<blockquote class="mb-4 px-4 py-3 bg-red-50/50 border-l-4 border-red-800 italic text-gray-800 text-sm rounded-r">「${item.quote}」<footer class="text-xs text-gray-500 mt-2 font-bold">— ${item.quoteSource}</footer></blockquote>` : '';

        return `
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm scroll-mt-24" id="m-card-${index}">
                    <button onclick="toggleTimelineMobile(${index})" class="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                        <div>
                            <span class="block text-xs font-bold uppercase tracking-wider mb-1 text-red-800">${item.date}</span>
                            <span class="block font-serif font-bold text-gray-900 pr-4">${item.title}</span>
                        </div>
                        <span id="m-icon-${index}" class="text-2xl text-gray-400 transition-transform duration-300 ${index === 0 ? 'rotate-180' : ''} shrink-0">↓</span>
                    </button>
                    <div id="m-content-${index}" class="${index === 0 ? 'block' : 'hidden'} border-t border-gray-100 bg-white">
                        <div class="w-full h-56 image-placeholder relative bg-gray-200">
                            <img src="${item.imageSrc}" alt="${item.imageAlt}" class="w-full h-full object-cover absolute top-0 left-0">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                            <span class="absolute bottom-3 left-4 text-white text-xs font-medium z-10 drop-shadow-md pr-4">${item.caption}</span>
                        </div>
                        <div class="p-5">
                            <p class="text-gray-900 text-base leading-relaxed mb-4 font-medium border-l-4 border-gray-300 pl-3">${item.desc}</p>
                            <div class="text-gray-600 text-sm leading-relaxed mb-4 space-y-3">
                                <p class="text-justify">${item.details}</p>
                                <div class="flex flex-wrap gap-2 mt-2">${tagsRaw}</div>
                            </div>
                            ${quoteRaw}
                            <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-inner mt-4">
                                <span class="text-xs font-bold text-red-800 block mb-2 tracking-wider flex items-center gap-1">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    史實查證與破除迷思
                                </span>
                                <p class="text-sm text-gray-800 font-medium leading-relaxed mb-2">${item.fact}</p>
                                <span class="inline-block text-[11px] text-gray-600 bg-gray-200 px-2.5 py-1 rounded font-medium border border-gray-300">${item.archive}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
    }).join('');
}

function toggleTimelineMobile(index) {
    const content = document.getElementById(`m-content-${index}`);
    const icon = document.getElementById(`m-icon-${index}`);
    const card = document.getElementById(`m-card-${index}`);

    // 摺疊其他選項
    document.querySelectorAll('[id^="m-content-"]').forEach((el, i) => {
        if (i !== index) {
            el.classList.add('hidden');
            document.getElementById(`m-icon-${i}`).classList.remove('rotate-180');
        }
    });

    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.classList.add('rotate-180');
        // 平滑捲動至該卡片，加上延遲以確保 DOM 更新後正確對齊
        setTimeout(() => {
            card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else {
        content.classList.add('hidden');
        icon.classList.remove('rotate-180');
    }
}

function renderTimelineControls() {
    const container = document.getElementById('timeline-controls');
    container.innerHTML = timelineData.map((item, index) => `
                <button onclick="updateTimelineDisplay(${index})" 
                        class="w-full text-left p-4 rounded-lg transition-all duration-200 border hover:bg-white hover:shadow-md flex items-center group ${index === 0 ? 'bg-white shadow-md border-gray-200 text-gray-900' : 'bg-transparent border-transparent text-gray-500'}"
                        id="t-btn-${index}">
                    <div class="w-3 h-3 rounded-full bg-red-800 mr-4 group-hover:scale-125 transition-transform ${index === currentTimelineIndex ? 'scale-125 opacity-100' : 'opacity-50'}"></div>
                    <div>
                        <span class="block text-xs font-bold uppercase tracking-wider mb-1">${item.date}</span>
                        <span class="block font-serif font-medium md:text-lg">${item.title}</span>
                    </div>
                </button>
            `).join('');
}

function updateTimelineDisplay(index) {
    currentTimelineIndex = index;
    const data = timelineData[index];

    timelineData.forEach((_, i) => {
        const btn = document.getElementById(`t-btn-${i}`);
        if (i === index) {
            btn.classList.add('bg-white', 'shadow-md', 'border-gray-200', 'text-gray-900');
            btn.classList.remove('bg-transparent', 'border-transparent', 'text-gray-500');
            btn.querySelector('div').classList.add('scale-125', 'opacity-100');
            btn.querySelector('div').classList.remove('opacity-50');
        } else {
            btn.classList.remove('bg-white', 'shadow-md', 'border-gray-200', 'text-gray-900');
            btn.classList.add('bg-transparent', 'border-transparent', 'text-gray-500');
            btn.querySelector('div').classList.remove('scale-125', 'opacity-100');
            btn.querySelector('div').classList.add('opacity-50');
        }
    });

    const display = document.getElementById('timeline-display');
    display.classList.remove('fade-in');
    void display.offsetWidth;
    display.classList.add('fade-in');

    document.getElementById('t-date').textContent = data.date;
    document.getElementById('t-title').textContent = data.title;
    document.getElementById('t-desc').textContent = data.desc;

    // New Detail & Metadata handling
    document.getElementById('t-details').textContent = data.details;

    // Render Tags (Key Figures)
    const tagsContainer = document.getElementById('t-tags-container');
    if (data.keyFigures && data.keyFigures.length > 0) {
        tagsContainer.innerHTML = data.keyFigures.map(figure => `<span class="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md">👤 ${figure}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '';
    }

    // Render Quote
    const quoteContainer = document.getElementById('t-quote-container');
    if (data.quote) {
        quoteContainer.classList.remove('hidden');
        document.getElementById('t-quote').textContent = data.quote;
        document.getElementById('t-quote-source').textContent = data.quoteSource;
    } else {
        quoteContainer.classList.add('hidden');
    }

    document.getElementById('t-fact').innerHTML = data.fact; // using innerHTML to allow emojis if needed
    document.getElementById('t-archive').textContent = data.archive;

    // Image handling
    document.getElementById('t-image').alt = data.imageAlt;
    document.getElementById('t-image').src = data.imageSrc;
    document.getElementById('t-caption').textContent = data.caption;
    document.getElementById('t-img-hint').classList.add('hidden');

}

// --- Fact Check Data ---
const factChecks = [
    { claim: "「228只是民進黨為了選舉製造仇恨的工具，根本沒那麼嚴重。」", reality: "228平反運動始於1987年，由民間發起。首位代表政府道歉的是國民黨籍總統李登輝（1995年）。補償條例與基金會的成立皆跨越黨派。這是國家級的人權議題，非單一政黨專利。" },
    { claim: "「死那麼多人都是假的，其實只有幾百人意外死亡。」", reality: "根據行政院《二二八事件研究報告》，估計死亡人數約在18,000至28,000人之間。雖然確切數字因當時戶籍混亂難以精確，但「僅數百人」的說法嚴重違背史實與檔案紀錄。" },
    { claim: "「這些人都是共產黨，政府是為了剿匪。」", reality: "雖然當時有少數左翼份子，但絕大多數受難者是期待政治改革的仕紳、學生與一般市民。將所有反抗者貼上「共產黨」標籤，是威權政府為合理化鎮壓與清鄉的藉口。" },
    { claim: "「外省人也被殺，為什麼都不提？」", reality: "史實並未否認初期衝突中有本省人對外省人的暴力行為，這在官方報告中皆有明確記載。但後續國家機器的軍事鎮壓與長期白色恐怖，其無差別攻擊的規模、組織性與延續性，與初期的警民衝突完全不成比例。" },
    { claim: "「受難家屬已經領了那麼多賠償金，為什麼還要一直吵？」", reality: "首先，那是由全民納稅人支應的「補償金」而非加害者付出的「賠償金」。其次，對多數家屬而言，金錢無法挽回破碎的家庭，他們真正訴求的是「歷史真相的完全解密」與「加害者責任的釐清」。" },
    { claim: "「當時的台灣人受到日本奴化教育，所以才會造反。」", reality: "參與「處理委員會」提出改革要求的多為受過高等教育的知識份子。他們是基於對陳儀政府貪腐無能、物價飛漲與特權壟斷的不滿，提出縣市長民選等近代民主訴求，與「奴化」毫無關聯。" },
    { claim: "「如果不派兵鎮壓，台灣早就被共產黨拿下了。」", reality: "當時台灣的共產黨員人數極少（根據檔案僅數十人），根本無法策動全島抗爭。將二二八定調為共產黨叛亂，完全是陳儀為了掩飾施政失敗，並說服蔣介石派兵鎮壓所羅織的藉口。" }
];

function renderFactCards() {
    const container = document.getElementById('fact-grid');
    container.innerHTML = factChecks.map((item, index) => `
                <div class="interactive-card bg-white rounded-xl overflow-hidden border border-gray-200 cursor-pointer group" onclick="toggleFact(${index})">
                    <div class="p-6 bg-red-50 border-b border-red-100 flex justify-between items-center">
                        <h4 class="text-lg font-bold text-gray-800 leading-snug pr-4">${item.claim}</h4>
                        <span id="fact-icon-${index}" class="text-red-800 text-xl font-black group-hover:scale-125 transition-transform duration-300 inline-block">+</span>
                    </div>
                    <div id="fact-content-${index}" class="hidden p-6 bg-white border-t-4 border-gray-800">
                        <span class="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded mb-3 inline-block">史實查證</span>
                        <p class="text-gray-700 leading-relaxed">${item.reality}</p>
                    </div>
                </div>
            `).join('');
}

function toggleFact(index) {
    const content = document.getElementById(`fact-content-${index}`);
    const icon = document.getElementById(`fact-icon-${index}`);

    document.querySelectorAll('[id^="fact-content-"]').forEach((el, i) => {
        if (i !== index) {
            el.classList.add('hidden');
            const otherIcon = document.getElementById(`fact-icon-${i}`);
            if (otherIcon) {
                otherIcon.textContent = '+';
                otherIcon.classList.remove('rotate-180');
            }
        }
    });

    content.classList.toggle('hidden');
    if (!content.classList.contains('hidden')) {
        content.classList.add('fade-in');
        icon.textContent = '−';
        icon.classList.add('rotate-180');
    } else {
        icon.textContent = '+';
        icon.classList.remove('rotate-180');
    }
}

// --- Report Accordion Logic ---
function toggleReport(index) {
    const content = document.getElementById(`report-content-${index}`);
    const icon = document.getElementById(`report-icon-${index}`);
    const isOpen = !content.classList.contains('hidden');

    if (isOpen) {
        content.classList.add('hidden');
        icon.textContent = '+';
        icon.classList.remove('rotate-180');
        icon.classList.remove('rotate-45');
    } else {
        content.classList.remove('hidden');
        content.classList.add('fade-in');
        icon.textContent = '−';
        icon.classList.add('rotate-180');
        icon.classList.remove('rotate-45');
    }
}

function expandAllReports() {
    for (let i = 0; i <= 6; i++) {
        const content = document.getElementById(`report-content-${i}`);
        const icon = document.getElementById(`report-icon-${i}`);
        if (content) {
            content.classList.remove('hidden');
            content.classList.add('fade-in');
            icon.textContent = '−';
            icon.classList.add('rotate-180');
            icon.classList.remove('rotate-45');
        }
    }
}

function collapseAllReports() {
    for (let i = 0; i <= 6; i++) {
        const content = document.getElementById(`report-content-${i}`);
        const icon = document.getElementById(`report-icon-${i}`);
        if (content) {
            content.classList.add('hidden');
            icon.textContent = '+';
            icon.classList.remove('rotate-180');
            icon.classList.remove('rotate-45');
        }
    }
}

function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}
function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}

// --- Init ---
window.onload = () => {
    initHeroCarousel();
    startRandomScenario(); // 初始化隨機載入情境
    renderTimelineControls();
    updateTimelineDisplay(0);
    renderTimelineMobile();
    renderFactCards();

    // Charts
};


function initCharts() {
    if (typeof Chart !== 'undefined') {
        const ctxProf = document.getElementById('professionChart').getContext('2d');
        new Chart(ctxProf, {
            type: 'bar',
            data: {
                labels: ['學生', '公務員', '民眾(無業/家管)', '商界', '工界', '自由業(醫/律)', '農漁'],
                datasets: [{
                    label: '佔比 (%)',
                    data: [20, 15, 25, 12, 10, 10, 8],
                    backgroundColor: ['#a63e3e', '#d4af37', '#595959', '#8a5a44', '#2c2c2c', '#722f37', '#a8a8a8'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + '%'; } } } },
                scales: { y: { beginAtZero: true, title: { display: true, text: '受難比例 (%)', font: { family: "'Noto Sans TC', sans-serif", weight: 'bold' } }, ticks: { callback: function (val) { return val + '%'; } } } }
            }
        });
        const ctxType = document.getElementById('victimTypeChart').getContext('2d');
        new Chart(ctxType, {
            type: 'doughnut',
            data: {
                labels: ['死亡', '失蹤', '羈押/判刑', '受傷/其他'],
                datasets: [{
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#2c2c2c', '#595959', '#a63e3e', '#d4af37'],
                    borderWidth: 2, borderColor: '#faf8f5'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right' }, tooltip: { callbacks: { label: function (c) { return ' ' + c.label + ': ' + c.parsed + '%'; } } } } }
        });
    }
}

