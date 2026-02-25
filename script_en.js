const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
let mouse = { x: -1000, y: -1000 }; // Move cursor off-screen initially
let bloodTrails = [];
let animationId;
let isIntroActive = true;

// Initialize Canvas size
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Listen for mouse movement
window.addEventListener('mousemove', (e) => {
    if (!isIntroActive) return;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // When mouse moves, generate slight red smudges (blood trails)
    if (Math.random() > 0.5) {
        bloodTrails.push(new BloodTrail(mouse.x, mouse.y));
    }
});

// ==== Ash/Particle Entity (Ash Particle) ====
class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * height; // Initially distribute randomly across the entire screen
    }

    reset() {
        this.x = Math.random() * width;
        this.y = -10; // Falling from the top
        // Different size and sense of weight: some fine as dust, others large as confetti
        this.size = Math.random() * 3 + 0.5;
        // Falling slowly
        this.speedY = Math.random() * 1 + 0.2;
        // Slight swinging left and right
        this.vx = (Math.random() - 0.5) * 0.5;
        this.swingAngle = Math.random() * Math.PI * 2;
        this.swingSpeed = Math.random() * 0.02 + 0.01;

        // Mostly gray ash, very few dark red (like dripping blood)
        this.isBlood = Math.random() > 0.95;
        this.opacity = Math.random() * 0.6 + 0.2;
    }

    update() {
        this.y += this.speedY;

        // Create a falling swing (like dead leaves or ash)
        this.swingAngle += this.swingSpeed;
        this.x += Math.sin(this.swingAngle) * 1 + this.vx;

        // Reset when particle falls out of screen
        if (this.y > height + 10) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        if (this.isBlood) {
            ctx.fillStyle = `rgba(139, 0, 0, ${this.opacity})`; // Dark red
            // Blood color has a glowing effect
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'red';
        } else {
            ctx.fillStyle = `rgba(100, 100, 100, ${this.opacity})`; // Dark gray
            ctx.shadowBlur = 0;
        }

        ctx.fill();
    }
}

// ==== Blood Trail Entity (Blood Trail) ====
class BloodTrail {
    constructor(x, y) {
        this.x = x + (Math.random() * 20 - 10);
        this.y = y + (Math.random() * 20 - 10);
        this.size = Math.random() * 15 + 5;
        this.opacity = 0.5;
        this.decay = Math.random() * 0.01 + 0.005; // Slowly dissipating
    }

    update() {
        this.opacity -= this.decay;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        // Soft red halo edge
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(139, 0, 0, ${this.opacity})`);
        gradient.addColorStop(1, 'rgba(139, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

// Create particle swarm
const particleCount = 150;
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Main animation loop
function animate() {
    if (!isIntroActive) return;
    // Fill whole canvas with transparent black to create a slight motion blur effect (Motion Blur)
    ctx.fillStyle = 'rgba(5, 5, 5, 0.2)';
    ctx.fillRect(0, 0, width, height);

    // Update and redraw blood trails
    for (let i = bloodTrails.length - 1; i >= 0; i--) {
        let t = bloodTrails[i];
        t.update();
        if (t.opacity <= 0) {
            bloodTrails.splice(i, 1);
        } else {
            t.draw();
        }
    }

    // Update and redraw ash particles
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    animationId = requestAnimationFrame(animate);
}

// Start animation
animate();


// ==========================================
// [Transition from Intro Screen to Legacy Content
// ==========================================
document.getElementById('enter-site-btn').addEventListener('click', () => {
    // 1. Fade out Intro screen
    const introScreen = document.getElementById('intro-screen');
    introScreen.classList.add('hidden-intro');

    // 2. Stop Canvas animation to free resources
    isIntroActive = false;
    cancelAnimationFrame(animationId);

    // 3. Show legacy main content
    const mainContent = document.getElementById('main-content');
    mainContent.style.pointerEvents = 'auto';
    mainContent.style.opacity = '1';

    // 4. Init Charts
    setTimeout(initCharts, 500);
});

// ==========================================
// [Legacy website main interaction logic 
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
    }, 5000); // 5seconds per slide
}

// --- Empathy Scenarios Data (Expanded for Randomization) ---
const scenariosData = {
    "doctor": {
        role: "You are a highly respected local doctor",
        context: "In early March 1947, police-citizen conflicts erupted downtown with heavy casualties. Local gentry and students formed a 'Settlement Committee' hoping to maintain public order. The mayor personally requested you to use your prestige to negotiate with the military on behalf of citizens, demanding the troops stop firing.",
        choices: [
            { text: "A. Step Forward: To protect innocent citizens and students, agree to go to the Shueishang Airport to negotiate with the military.", nextId: "doctor_a" },
            { text: "B. Decline and Hide: Sensing extreme danger, for the sake of your young children at home, decide to flee back to your hometown overnight.", nextId: "doctor_b" }
        ]
    },
    "doctor_a": { isResult: true, title: "Historical Witness: The Price of Peace", content: "In real history, many like Dr. Pan Mu-chih and painter Chen Cheng-po chose this path. They went to the military camp with peaceful demands, only to be immediately detained, bound with wire, and publicly executed in front of the train station without any trial.<br><br><span class='text-red-400 font-bold'>"They did not riot; they went to sue for peace."</span> This pierces the online rumor claiming all deceased were rioters.", prototype: "Archetypes: Pan Mu-chih, Chen Cheng-po, and other peace negotiators" },
    "doctor_b": { isResult: true, title: "Historical Witness: Escaping the 'Village Cleansing' was Impossible", content: "Even if choosing to hide, during the 'village cleansing' campaign in mid-March, military and secret police arrested people based on rosters. Many intellectuals, lawyers (like Lin Lien-tsung), and NTU professors (like Lin Mao-sheng) who did not participate in conflicts were forcibly taken away from home at midnight, thereafter missing.<br><br><span class='text-red-400 font-bold'>The state's purge targeted the Taiwanese elite class, not just maintaining public order.</span>", prototype: "Archetypes: Countless intellectuals who went missing during the village cleansing" },

    "reporter": {
        role: "You are the chief editorial writer of a local newspaper",
        context: "After the 228 Incident broke out, the Chief Executive's Office tried to block news. You have the real casualty list and photos of military and police shooting indiscriminately on the streets. At this time, secret police are already loitering and surveilling outside the newspaper office.",
        choices: [
            { text: "A. Insist on Reporting: As a journalist, you must expose the truth. Decide to typeset overnight and print the true casualties.", nextId: "reporter_a" },
            { text: "B. Compromise for Self-Preservation: For the safety of the staff and your family, decide to cooperate with the official narrative and publish a report on 'rioters causing trouble'.", nextId: "reporter_b" }
        ]
    },
    "reporter_a": { isResult: true, title: "Historical Witness: The Silenced Fourth Estate", content: "Such as Juan Chao-jih (General Manager of Taiwan Hsin Sheng Daily News) and Sung Fei-ju (President of People's Herald), for insisting on reporting the truth or criticizing politics, they were taken away by secret agents during the village cleansing on charges of 'rebellion,' never to be seen again.<br><br><span class='text-red-400 font-bold'>State violence wiped out not only lives but also the dissemination of truth.</span>", prototype: "Archetypes: Juan Chao-jih, Sung Fei-ju, Wang Tian-deng and other journalists" },
    "reporter_b": { isResult: true, title: "Historical Witness: Guilt by Association and Literary Inquisition", content: "Under the chilling atmosphere of martial law and village cleansing, compromise did not guarantee absolute safety. Many newspapers were forced to suspend or reorganize. Even if they cooperated, as long as they had previously published critical remarks, they could still be framed and imprisoned in the subsequent White Terror.<br><br><span class='text-red-400 font-bold'>Censorship under totalitarian rule is retroactive and lacks standard.</span>", prototype: "Archetypes: The Taiwanese press forced to suspend or subjected to censorship at the time" },

    "student": {
        role: "You are a passionate university student",
        context: "Society is in chaos, and most police are evading or hiding. You and your classmates decide to organize a 'Student Public Security Service Squad,' directing traffic on the streets, protecting the safety of Mainlander teachers and businessmen, and trying to restore social order.",
        choices: [
            { text: "A. Stick to Your Post: Even hearing that the army is about to land, still believe you are 'assisting in maintaining public order,' and continue to perform duties on the streets in student uniforms.", nextId: "student_a" },
            { text: "B. Disband and Retreat: Sensing a change in the government's attitude and listening to elders' advice, immediately disband the service squad, destroy the roster, and hide.", nextId: "student_b" }
        ]
    },
    "student_a": { isResult: true, title: "Historical Witness: Youthful Blood", content: "After landing on March 8, the army launched indiscriminate shootings. Many students in uniforms maintaining public order on the streets bore the brunt, seen as 'rioters' by the military and immediately shot or arrested. University students in downtown Taipei and Keelung High School suffered heavy casualties.<br><br><span class='text-red-400 font-bold'>The military suppression was indiscriminate; even youths trying to restore order became victims under the gun.</span>", prototype: "Archetypes: Youth students nationwide who suffered for participating in maintaining public order" },
    "student_b": { isResult: true, title: "Historical Witness: Blacklists and Exile", content: "Though saving your life temporarily, in the subsequent village cleansing, secret police blindly hunted down youths who participated in the Settlement Committee or Security Squad. Many were forced into exile overseas, lived the rest of their lives in fear, or were still arrested in the later White Terror.<br><br><span class='text-red-400 font-bold'>'Everything leaves a trace.' In the eyes of authoritarianism, organized youth are a threat.</span>", prototype: "Archetypes: Taiwanese youths exiled overseas or living incognito" }
};

const scenarioRootKeys = ["doctor", "reporter", "student"];

function startRandomScenario() {
    // Randomly select a scenario archetype
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
                        <span class="inline-block px-3 py-1 bg-red-900/50 text-red-400 border border-red-800 text-xs font-bold rounded mb-4">The Truth of History</span>
                        <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-6">${data.title}</h3>
                        <p class="text-gray-300 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">${data.content}</p>
                        <p class="text-sm text-gray-500 mb-8 italic">${data.prototype}</p>
                        <button onclick="startRandomScenario()" class="px-6 py-3 border border-gray-600 text-gray-400 font-bold rounded-lg hover:text-white hover:border-white hover:bg-white/10 transition flex items-center justify-center gap-2 mx-auto">
                            <span>↻ Witness Again (Random Character)</span>
                        </button>
                    </div>
                `;
    }
}

// --- Timeline Data with Images (Enriched Knowledge) ---
const timelineData = [
    {
        date: 'Feb 27, 1947', title: 'The Trigger: Contraband Cigarette Bloodshed and Manslaughter',
        desc: 'Investigators from the Monopoly Bureau violently cracked down on contraband cigarette vendor Lin Jiang-mai in front of Tianma Tea House in Taipei, striking her head with a gun butt. While the crowd surrounded the investigators to argue, an investigator fired a shot, accidentally killing bystander Chen Wen-xi.',
        details: 'The incident occurred on Yanping North Road in the evening, during rush hour with crowds gathering. The police and military police present failed to handle it effectively, and public anger quickly spread. The next day, Chen Wen-xi died, triggering a general strike and parade throughout Taipei. This wasn't merely a conflict; it was the ignition point of long-standing public fury over the corruption of the 'monopoly system' and soaring inflation.',
        keyFigures: ['Lin Jiang-mai (私菸攤商)', 'Chen Wen-xi (無辜遇難市民)', '傅學通 (開槍查緝員)'],
        quote: 'The investigators indiscriminately confiscated all the matches, cigarettes, and money on the vendor... The investigator even struck Lin's head with a gun butt, immediately causing her to bleed profusely and fall unconscious.',
        quoteSource: '1947 On-Site Report by Taiwan Hsin Sheng Daily News',
        fact: '📝 Archives show that improper law enforcement and panicked shooting by investigators were the trigger. This was entirely a public security incident caused by excessive enforcement, debunking the rumor of a 'premeditated armed riot by the Communist Party.'',
        archive: 'Source: Executive Yuan's 'Research Report on the 228 Incident'',
        imageSrc: 'images/228_by_Li_Jun.jpg',
        imageAlt: 'Terrifying Inspection - Huang Rong-tsan's Woodcut',
        caption: '«Terrifying Inspection»: Painted by Huang Rong-tsan, authentically portraying the moment a civilian was shot during a contraband cigarette sweep.'
    },
    {
        date: 'Feb 28, 1947', title: 'Chief Executive's Office Opens Fire & Occupation of Broadcasting Station',
        desc: 'Angry citizens marched to the Chief Executive's Office (now the Executive Yuan) to petition for punishing the culprits, but were machine-gunned by guards on the roof. Afterwards, the crowd occupied the Taipei Broadcasting Station, broadcasting the incident all over Taiwan, and resistance erupted everywhere.',
        details: 'The crowd initially went to the Monopoly Bureau to protest, and after failing to find the director, moved to the Chief Executive's Office. Guards fired directly at the peacefully petitioning crowd without warning; this fatal mistake completely enraged the citizens. The public then occupied the 'Taiwan Broadcasting Station' inside the New Park, broadcasting the cause to the whole island. The sorrowful and angry accusations quickly spread via radio waves, becoming the key turning point from a single-city conflict to an island-wide resistance.',
        keyFigures: ['Nameless students and youths who broadcasted to all of Taiwan', 'Chen Yi (Chief Executive of Taiwan)'],
        quote: 'We brought no weapons; we just wanted to petition to handle yesterday's murderer, never expecting them to open fire from above... Now we have occupied the broadcasting station, please, compatriots all over Taiwan, stand up!',
        quoteSource: 'Testimonies broadcasted from the Taipei Broadcasting Station on the day of the incident',
        fact: '📝 Occupying the broadcasting station is a standard model for mass movement diffusion. The broadcasts' appeals at the time were for 'political reform' and 'punishing corruption,' rather than declaring independence or a communist revolution. Historical materials prove this was a spontaneous movement resisting authoritarianism.',
        archive: 'Source: Academia Historica 228 Archives, Oral History Research',
        imageSrc: 'images/PIC_0210a5d7de02c6f46866.jpg',
        imageAlt: 'Former Taipei Broadcasting Station (Taiwan Broadcasting Station)',
        caption: 'Archive: Former Taipei Broadcasting Station. Citizens broadcasted to the whole island here, igniting a nationwide response.'
    },
    {
        date: 'Mar 1 - 5, 1947', title: 'The Settlement Committee and Political Reform Appeals',
        desc: 'To calm the situation, local gentry, public representatives, and students formed the '228 Incident Settlement Committee' to substitute the dysfunctional government in maintaining order, proposing the '32-Point Demands' seeking a high degree of autonomy.',
        details: 'The Settlement Committee was established in Taipei Zhongshan Hall, comprising the top elite echelon of Taiwanese society at the time. They not only organized students to maintain urban security but also proposed political reform demands to the government. However, Chen Yi ostensibly agreed to negotiate to pacify the public, while secretly dispatching urgent telegrams to Chiang Kai-shek claiming a 'rebellion' had occurred, requesting immediate troop dispatch for suppression.',
        keyFigures: ['Wang Tian-deng (Provincial Councilor)', 'Lin Lien-tsung (National Assembly Delegate)', 'Jiang Wei-chuan'],
        quote: 'The Taiwanese demand political reform; it is not a rebellion... Please do not use military force to suppress; this is our earnest hope.',
        quoteSource: 'Public appeal by the Settlement Committee via the broadcasting station',
        fact: '📝 Historical archives and meeting minutes prove that the Settlement Committee's goal was always a 'peaceful resolution' and 'intra-system reform,' never advocating Taiwan independence or overthrowing the government. Chen Yi's 'rebellion' accusation was a fabricated charge.',
        archive: 'Source: Daxi Archives (Chiang Kai-shek Presidential Artifacts), Chen Yi's telegram requesting troops',
        imageSrc: 'images/images (9).jpg',
        imageAlt: 'Crowds in front of the Keelung Fortress Command or downtown',
        caption: 'Downtown crowds gathering during the historical incident (image shows a corner of historical footage)'
    },
    {
        date: 'Mar 8, 1947', title: 'Troops Land in Keelung & Indiscriminate Suppression',
        desc: 'After receiving Chen Yi's telegram, the Nationalist Government's reorganized 21st Division and other troops arrived in Keelung and Kaohsiung. Upon landing, the troops immediately launched indiscriminate shootings; the cities plunged into bloody military suppression.',
        details: 'At Keelung Port, the military fired at the crowded civilians on shore even before landing. In the south, Kaohsiung Fortress Commander Peng Meng-ji directly ordered troops to indiscriminately sweep the Kaohsiung Train Station underpass, City Hall, and Kaohsiung High School. Under the name of 'mopping up rioters,' the army massacred civilians and even the student service squads directing traffic on the streets.',
        keyFigures: ['Liu Yu-ching (Commander of the 21st Division)', 'Peng Meng-ji (Kaohsiung Fortress Commander)'],
        quote: 'The troops just indiscriminately fired upon landing... There were corpses everywhere on the streets; even the Tamsui River was filled with floating bodies, dyeing the water red.',
        quoteSource: 'Report by U.S. Vice Consul in Taiwan George H. Kerr',
        fact: '📝 Domestic and foreign archives (including classified U.S. reports) clearly document the tragic indiscriminate military attacks on civilians. This was a bloody suppression by the state's military against its own unarmed people, not a legitimate 'quelling of a riot.'',
        archive: 'Source: National Development Council Archives, U.S. National Archives',
        imageSrc: 'images/228_Incident_k_(cropped).jpg',
        imageAlt: 'Victims' bodies in the incident',
        caption: 'After the military crackdown began, victims of indiscriminate shootings could be seen everywhere on the streets.'
    },
    {
        date: 'Mid-March 1947 Onwards', title: 'Island-Wide Village Cleansing & Indiscriminate Arrest of Intellectual Elites',
        desc: 'After the military controlled the situation, the government declared martial law and launched 'village cleansing.' Under the guise of arresting 'rioters,' Taiwanese intellectuals and social elites were extensively assassinated and executed without trial.',
        details: 'The Garrison Command essentially conducted political purges based on pre-drafted 'blacklists,' targeting the Settlement Committee, reporters, lawyers, doctors, and NTU professors. Many elites disappeared after being taken by secret police at midnight, with no bones to be found. This targeted hunting caused a severe gap in Taiwan's social leadership and ushered in the subsequent nearly 40 years of White Terror.',
        keyFigures: ['Chen Cheng-po (Painter)', 'Pan Mu-chih (Doctor)', 'Lin Mao-sheng (NTU Professor)', 'Juan Chao-jih (Hsin Sheng Daily News GM)'],
        quote: 'I'm dying, you must be strong, do not forget I die for the Taiwanese people. Study hard, and contribute to Taiwan.',
        quoteSource: 'Concept of dying words left to families by several victims',
        fact: '📝 Arrests and executions during the village cleansing phase almost totally lacked legal trial records. This was not just to 'disarm' but a systematic eradication by the state apparatus to extinguish Taiwanese dissenting voices.',
        archive: 'Source: Ministry of National Defense Secrecy Bureau Taiwan Station Archives, Oral histories from victims' families',
        imageSrc: 'images/WI01-001.jpg',
        imageAlt: 'Victims' Suicide Notes',
        caption: 'The final farewell of martyred elites: During the trial-less village cleansing, countless elites left their final words.'
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
                                    Fact Check & Dispelling Myths
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
        // Smooth scroll to the card, adding delay to ensure correct alignment after DOM update
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
    { claim: `228 is just a tool for the DPP to create hatred for elections; it wasn't that serious at all.`, reality: `The 228 vindication movement began in 1987, initiated by civil society. The first to apologize on behalf of the government was KMT President Lee Teng-hui (1995). The Compensation Act and the establishment of the foundation crossed party lines. This is a national human rights issue, not the monopoly of a single political party.` },
    { claim: `The mass deaths are fake; in reality, only a few hundred people died accidentally.`, reality: `According to the Executive Yuan's "Research Report on the 228 Incident", the estimated number of deaths ranges from 18,000 to 28,000. Although exact numbers are difficult to pinpoint due to household registration chaos at the time, the claim of "only a few hundred" seriously violates historical facts and archive records.` },
    { claim: `These people were all Communists, and the government was exterminating bandits.`, reality: `Although there was a small number of leftists at the time, the vast majority of victims were gentry, students, and ordinary citizens anticipating political reform. Labeling all resisters as "Communists" was a pretext used by the authoritarian government to rationalize suppression and pacification.` },
    { claim: `Mainlanders were also killed, why is that never mentioned?`, reality: `Historical facts do not deny that there was violence by Taiwanese against Mainlanders in early conflicts, which is clearly documented in official reports. But the subsequent military suppression and long-term White Terror by the state apparatus were completely disproportionate in scale, organization, and continuity compared to the initial police-civilian conflicts.` },
    { claim: `The victims' families have already received so much compensation, why do they keep complaining?`, reality: `First, it was a "compensation fund" paid by taxpayers, not "reparations" from the perpetrators. Second, for most families, money cannot bring back broken families; their true appeal is "complete declassification of historical truth" and "clarification of perpetrators' responsibilities".` },
    { claim: `The Taiwanese at that time were subjected to Japanese enslavement education, which is why they rebelled.`, reality: `Most of the intellectuals who participated in the "Settlement Committee" to demand reforms were highly educated. They raised modern democratic demands, such as the direct election of county magistrates and mayors, based on their dissatisfaction with the Chen Yi government's corruption, incompetence, soaring prices, and privileged monopolies. It had absolutely nothing to do with "enslavement".` },
    { claim: `If troops had not been sent to suppress it, Taiwan would have been taken over by the Communists long ago.`, reality: `At that time, the number of Communist Party members in Taiwan was extremely small (only a few dozen according to archives), making it impossible to instigate an island-wide resistance. Defining 228 as a Communist rebellion was entirely an excuse fabricated by Chen Yi to cover up governance failures and persuade Chiang Kai-shek to dispatch troops for suppression.` }
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
                        <span class="text-xs font-bold text-white bg-gray-800 px-2 py-1 rounded mb-3 inline-block">Fact Check</span>
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
                labels: ['Students', 'Civil Servants', 'Citizens (Unemployed/Housewives)', 'Merchants', 'Workers', 'Freelancers (Med/Law)', 'Farmers/Fishers'],
                datasets: [{
                    label: 'Percentage (%)',
                    data: [20, 15, 25, 12, 10, 10, 8],
                    backgroundColor: ['#a63e3e', '#d4af37', '#595959', '#8a5a44', '#2c2c2c', '#722f37', '#a8a8a8'],
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return c.parsed.y + '%'; } } } },
                scales: { y: { beginAtZero: true, title: { display: true, text: 'Victim Ratio (%)', font: { family: "'Noto Sans TC', sans-serif", weight: 'bold' } }, ticks: { callback: function (val) { return val + '%'; } } } }
            }
        });
        const ctxType = document.getElementById('victimTypeChart').getContext('2d');
        new Chart(ctxType, {
            type: 'doughnut',
            data: {
                labels: ['Deceased', 'Missing', 'Detained/Sentenced', 'Injured/Other'],
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

