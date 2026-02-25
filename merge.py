import re

# 1. 讀取舊版內容
with open('old_index.html', 'r', encoding='utf-8') as f:
    old_html = f.read()

css_match = re.search(r'<style>(.*?)</style>', old_html, re.DOTALL)
old_css = css_match.group(1).strip() if css_match else ""

js_match = re.search(r'<script>(\s*// --- Hero Carousel Logic ---.*?)</script>\s*</body>', old_html, re.DOTALL)
old_js = js_match.group(1).strip() if js_match else ""

# 修改舊版 js 中的 window.onload，加入 initCharts() 的分離
old_js = re.sub(
    r'if \(typeof Chart !== \'undefined\'\) \{.*?\n\s+};',
    '',
    old_js,
    flags=re.DOTALL
)

# 從 window.onload 移除 chart 初始化，因為我們要在按鈕點擊後初始化
chart_logic = """
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
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: function(c) { return c.parsed.y + '%'; } } } },
                scales: { y: { beginAtZero: true, title: { display: true, text: '受難比例 (%)', font: { family: "'Noto Sans TC', sans-serif", weight: 'bold' } }, ticks: { callback: function(val) { return val + '%'; } } } }
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
                    borderWidth: 2, borderColor: '#fdfbf7'
                }]
            },
            options: { responsive: true, maintainAspectRatio: false, cutout: '60%', plugins: { legend: { position: 'right' }, tooltip: { callbacks: { label: function(c) { return ' ' + c.label + ': ' + c.parsed + '%'; } } } } }
        });
    }
}
"""

old_js = old_js + "\n" + chart_logic

# 2. 讀取新版 Intro 樣式
with open('temp_style.css', 'r', encoding='utf-8') as f:
    intro_css = f.read()

# 將 body 樣式替換為 #intro-screen
intro_css = intro_css.replace('body {', '#intro-screen {')

combined_css = f"/* ==== 舊版網站樣式 ==== */\n{old_css}\n\n/* ==== 228 Intro Screen 樣式 ==== */\n{intro_css}\n"
# 加入 Intro 消失動畫
combined_css += """
#intro-screen {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    z-index: 100;
    transition: opacity 1.5s ease, visibility 1.5s;
}

#intro-screen.hidden-intro {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
"""

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(combined_css)

# 3. 讀取新版 Intro JS 並組合
with open('script.js', 'r', encoding='utf-8') as f:
    intro_js = f.read()

# 在 Intro JS 中加入 isIntroActive
intro_js = intro_js.replace('let bloodTrails = [];', 'let bloodTrails = [];\nlet animationId;\nlet isIntroActive = true;')
intro_js = intro_js.replace("window.addEventListener('mousemove', (e) => {", "window.addEventListener('mousemove', (e) => {\n    if(!isIntroActive) return;")
intro_js = intro_js.replace("requestAnimationFrame(animate);", "animationId = requestAnimationFrame(animate);")
intro_js = intro_js.replace("function animate() {", "function animate() {\n    if(!isIntroActive) return;")

combined_js = intro_js + f"""

// ==========================================
// [轉場] Intro Screen 到 舊版內容
// ==========================================
document.getElementById('enter-site-btn').addEventListener('click', () => {{
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
}});

// ==========================================
// [舊版] 網站主要互動邏輯 
// ==========================================
{old_js}
"""

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(combined_js)

