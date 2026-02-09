/**
 * Astro-Dynamics Command Center - UI Logic Module
 * 管理所有交互模式、专业定义及响应式布局切换
 */

function ui(type) {
    const infoPanel = document.getElementById('info-panel');
    const system = document.getElementById('system-container');
    const hudGrid = document.getElementById('hud-grid-container');
    const h = document.getElementById('info-h');
    const b = document.getElementById('info-b');
    const azHUD = document.getElementById('hud-wrap-azimuth');
    const skyHUD = document.getElementById('hud-wrap-sky');
    const opts = document.getElementById('opt-container');

    
    
    // 1. Initialization and State Reset
    resetH(); 
    opts.innerHTML = ''; 
    azHUD.style.display = 'none'; 
    skyHUD.style.display = 'none';
    hudGrid.classList.remove('horizontal'); 
    document.getElementById('flux-container').style.display = 'none';
    document.getElementById('data-row-azimuth').style.display = 'flex';
    document.getElementById('label-sky').innerText = "SKY_TRAJECTORY (λ vs β)";

    

    // 2. Responsive Layout Control: Retrograde and Transit utilize horizontal side-by-side view
    infoPanel.classList.add('active');
    if (window.innerWidth > 768) {
        if (type === 'retrograde' || type === 'transit') {
            hudGrid.classList.add('horizontal');
            infoPanel.style.width = "48%"; // Expanded width for academic clarity
            system.style.marginRight = "48%";
        } else {
            infoPanel.style.width = "38%";
            system.style.marginRight = "38%";
        }
    }
    // 3. 业务逻辑分支：复原专业定义
    switch(type) {
        // --- 地内行星模块 (Inferior Planets) ---
        case 'cat_inf':
            // Maintain the dynamic simulation
            isLive = true; 
            mode = 'highlight_inferior'; 
            
            // UI Header and Academic Definition
            h.innerText = "Inferior Planets (Heliocentric < 1 AU)";
            b.innerText = "Inferior planets (Mercury and Venus) possess orbital radii smaller than Earth's (r < 1 AU). From a geocentric perspective, their apparent motion is angularly constrained near the Sun. They exhibit distinct lunar-like phases and can never reach a state of opposition.";
            
            // Visual Emphasis: Light up and enlarge without hiding other planets
            highlightPlanets(['mercury', 'venus']);
            
            // Ensure the side panel doesn't obstruct the sun during the live motion
            if (window.innerWidth > 768) {
                system.style.marginRight = "38%";
            }
            break;

        case 'inf_conj':
            isLive = false; mode = 'static'; isolate(['venus', 'earth']);
            h.innerText = "Conjunction (Inferior)";
            b.innerText = "Conjunction occurs when a planet and the Sun share the same ecliptic longitude as viewed from Earth.";
            addOpt('Inferior Conjunction', () => { 
                setPos('earth', 0); setPos('venus', 0); 
                b.innerText = "During Inferior Conjunction, the planet is positioned between Earth and the Sun. This is its point of perigee (closest approach), with its dark hemisphere facing Earth. Precision alignment may lead to a solar transit.";
            
            });
            addOpt('Superior Conjunction', () => { 
                setPos('earth', 180); setPos('venus', 0); 
                b.innerText = "During Superior Conjunction, the Sun is situated between Earth and the planet. The planet is at apogee (farthest distance) and is fully illuminated, though typically obscured by solar glare.";
            });
            break;

        case 'inf_elong':
            isLive = false; mode = 'static'; isolate(['venus', 'earth']);
            h.innerText = "Greatest Elongation";
            b.innerText = "The maximum angular distance from the Sun as viewed from Earth, providing the best viewing opportunity during twilight.";
            addOpt('Eastern Elongation', () => { 
                setPos('earth', 0); setPos('venus', 45); 
                b.innerText = "At Greatest Eastern Elongation, the planet is visible in the western sky after sunset, commonly referred to as the 'Evening Star'.";
            });
            addOpt('Western Elongation', () => { 
                setPos('earth', 0); setPos('venus', 315); 
                b.innerText = "At Greatest Western Elongation, the planet rises in the eastern sky before sunrise, commonly referred to as the 'Morning Star'.";
            });
            break;

        // --- 地外行星模块 (Superior Planets) ---
        case 'cat_sup':
            isLive = true; 
            mode = 'highlight_inferior'; 
            h.innerText = "Superior Planets";
            b.innerText = "Superior planets orbit outside Earth's path. They can appear at any angular distance from the Sun and experience 'Opposition' when Earth passes between them and the Sun.";
            highlightPlanets(['mars', 'jupiter', 'saturn', 'uranus', 'neptune']);
            break;

        case 'sup_conj':
            isLive = false; mode = 'static'; isolate(['mars', 'earth']);
            h.innerText = "Conjunction";
            b.innerText = "For superior planets, conjunction occurs when the planet is on the opposite side of the Sun from Earth.";
            setPos('earth', 180); setPos('mars', 0);
            break;

            

        case 'sup_opp':
            isLive = false; mode = 'static'; isolate(['mars', 'earth']);
            h.innerText = "Opposition";
            b.innerText = "Opposition occurs when a superior planet is opposite the Sun in our sky ($Sun–Earth–Planet$ alignment). The planet is closest to Earth, fully illuminated, and visible all night.";
            setPos('earth', 0); setPos('mars', 0);
            break;

        case 'sup_quad':
            isLive = false; mode = 'static'; isolate(['mars', 'earth']);
            h.innerText = "Quadrature";
            b.innerText = "Quadrature occurs when the angular distance between the Sun and a planet is exactly 90 degrees as seen from Earth.";
            addOpt('Eastern Quadrature', () => { setPos('earth', 0); setPos('mars', 90); });
            addOpt('Western Quadrature', () => { setPos('earth', 0); setPos('mars', 270); });
            break;

        // --- 核心动态模式 ---
        case 'retrograde':
            isLive = false; mode = 'retrograde'; activeP = null; pathAzimuth = []; pathSky = []; lastLambda = null;
            azHUD.style.display = 'block'; skyHUD.style.display = 'block';
            document.getElementById('sky-status-box').style.display = 'block';
            h.innerText = "Retrograde Motion";
            b.innerText = "The apparent backward (east to west) motion caused by Earth 'lapping' an outer planet. This HUD tracks Longitude (λ) and Latitude (β) to reveal the figure-8 loops.";
            
            // 动态生成全称按钮
            Object.keys(planets).forEach(p => {
                if (p === 'earth') return;
                addOpt(`TRACK ${p.toUpperCase()}`, () => { 
                    activeP = p; pathAzimuth = []; pathSky = []; lastLambda = null; 
                    highlightPlanets([p]);
                });
            });
            break;

        // case 'transit':
        //     isLive = false; mode = 'transit'; isolate(['venus', 'earth']);
        //     azHUD.style.display = 'block'; skyHUD.style.display = 'block';
        //     document.getElementById('label-azimuth').innerText = "SOLAR_DISK_OBSERVATION";
        //     document.getElementById('label-sky').innerText = "LUMINOSITY_FLUX_ANALYSIS";
            
        //     // 为了左右高度对齐，建议凌日时也保留左侧读数（显示经度）
        //     document.getElementById('data-row-azimuth').style.display = 'flex';
        //     document.getElementById('sky-status-box').style.display = 'none';
        //     document.getElementById('flux-container').style.display = 'block';
            
        //     h.innerText = "Astronomical Transit";
        //     b.innerText = "A transit occurs when an inferior planet passes directly in front of the Solar disk. This allows for 'light curve' measurements—the slight dip in solar brightness—which is the primary method for detecting exoplanets today.";
        //     pathSky = new Array(2000).fill(1.0);
        //     break;
        case 'transit':
            isLive = false; 
            mode = 'transit'; 
            activeP = null; // Reset selection
            
            // UI Layout Setup
            azHUD.style.display = 'block'; 
            skyHUD.style.display = 'block';
            document.getElementById('label-azimuth').innerText = "SOLAR_DISK_OBSERVATION";
            document.getElementById('label-sky').innerText = "PHOTOMETRIC_FLUX_ANALYSIS";
            
            // Sync HUD Rows
            document.getElementById('data-row-azimuth').style.display = 'flex';
            document.getElementById('sky-status-box').style.display = 'none';
            document.getElementById('flux-container').style.display = 'block';
            
            h.innerText = "Astronomical Transit";
            // b.innerText = "Select an inferior planet to observe its transit across the Solar disk. This configuration requires the planet to be at Inferior Conjunction while simultaneously crossing the ecliptic plane.";
            b.innerText = "Select an inferior planet to observe its transit across the Solar disk. This configuration requires the planet to be at Inferior Conjunction while simultaneously crossing the ecliptic plane. When the planet approaches alignment with Earth and the Sun, the simulation automatically slows down to provide a clearer view of the transit event.";

            // Add Selection Options
            addOpt('Observe Venus Transit', () => {
                activeP = 'venus';
                isolate(['venus', 'earth']);
                pathSky = new Array(2000).fill(1.0); // Reset light curve
                // b.innerText = "Observing Venus Transit: Due to its larger angular diameter, Venus creates a deeper flux reduction (approx 0.1%) compared to Mercury. This is a primary proxy for Earth-sized exoplanet detection.";
                b.innerText = "Observing Venus Transit: Due to its larger angular diameter, Venus produces a deeper solar flux reduction (approximately 0.1%) compared to Mercury. This makes it an important analog for Earth-sized exoplanet detection. As Venus approaches inferior conjunction and alignment with Earth, the simulation automatically normalizes and slows the orbital motion to provide a clearer and visually consistent transit across the solar disk.";

            });

            addOpt('Observe Mercury Transit', () => {
                activeP = 'mercury';
                isolate(['mercury', 'earth']);
                pathSky = new Array(2000).fill(1.0); // Reset light curve
                // b.innerText = "Observing Mercury Transit: Mercury transits are more frequent than Venus transits but block significantly less solar flux due to its smaller physical cross-section.";
                b.innerText = "Observing Mercury Transit: Mercury transits occur more frequently than those of Venus but produce a much smaller flux reduction due to its smaller physical and angular size. As Mercury nears inferior conjunction and alignment with Earth, the simulation dynamically adjusts and normalizes the apparent motion speed to allow detailed observation of the transit event.";

            });
            
            break;
    }
}

// --- 辅助功能函数 ---

function addOpt(text, callback) {
    const opts = document.getElementById('opt-container');
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerText = text;
    btn.onclick = callback;
    opts.appendChild(btn);
}

function isolate(targets) {
    Object.keys(planets).forEach(k => {
        const isVisible = targets.includes(k) || k === 'earth';
        const el = document.getElementById('p-' + k);
        const orb = document.getElementById('o-' + k.substring(0, 3));
        if (el) el.style.display = isVisible ? 'flex' : 'none';
        if (orb) orb.style.display = isVisible ? 'block' : 'none';
    });
}

function highlightPlanets(targets) {
    Object.keys(planets).forEach(p => {
        const el = document.getElementById('p-' + p);
        if (el) el.classList.remove('highlight');
    });
    targets.forEach(p => {
        const el = document.getElementById('p-' + p);
        if (el) el.classList.add('highlight');
    });
}

function resetH() {
    Object.keys(planets).forEach(p => {
        const el = document.getElementById('p-' + p);
        const orb = document.getElementById('o-' + p.substring(0, 3));
        if (el) { el.classList.remove('highlight'); el.style.display = 'flex'; }
        if (orb) orb.style.display = 'block';
    });
}

function resetSystem() {
    isLive = true; mode = 'idle'; activeP = null;
    pathAzimuth = []; pathSky = [];
    const infoPanel = document.getElementById('info-panel');
    const system = document.getElementById('system-container');
    const hudGrid = document.getElementById('hud-grid-container');
    
    infoPanel.classList.remove('active');
    system.style.marginRight = "0";
    hudGrid.classList.remove('horizontal');
    document.getElementById('hud-wrap-azimuth').style.display = 'none';
    document.getElementById('hud-wrap-sky').style.display = 'none';
    
    resetH();
}