// function animate() {
//     let speedMult = 0.8;
//     if (mode === 'transit') {
//         let diff = Math.abs(((angles.venus - angles.earth + 180) % 360) - 180);
//         speedMult = (diff < 15) ? 0.5 : 1.2; 
//     }
//     if (isLive) {
//         Object.keys(planets).forEach(p => {
//             angles[p] = (angles[p] + planets[p].s) % 360;
//             setPos(p, angles[p]);
//         });
//     } else if (mode === 'retrograde' || mode === 'transit') {
//         syncUpdate(speedMult);
//     }
//     requestAnimationFrame(animate);
// }

function animate() {
    let speedMult = 0.8;

    if (mode === 'transit' && activeP) {
        let diff = Math.abs(((angles[activeP] - angles.earth + 180) % 360) - 180);
        
        if (diff < 15) {
            // --- 核心修改：归一化速度控制 ---
            // 我们定义一个理想的“观测步进速度”（例如每帧移动 0.4 度）
            const targetStep = 0.4; 
            
            // 自动计算倍率：speedMult = 目标步进 / 行星固有速度
            // 这样无论选水星还是金星，它们扫过日面的物理速度在视觉上将完全一致
            speedMult = targetStep / planets[activeP].s;

            // 如果你希望水星比金星还要慢，可以再加一个额外系数：
            if (activeP === 'mercury') {
                speedMult *= 0.8; // 在归一化的基础上再减速 50%
            }
        } else {
            speedMult = 1.2; // 凌日区外保持高倍率快进
        }
    }

    if (isLive) {
        Object.keys(planets).forEach(p => {
            angles[p] = (angles[p] + planets[p].s) % 360;
            setPos(p, angles[p]);
        });
    } else if (mode === 'retrograde' || mode === 'transit') {
        syncUpdate(speedMult);
    }
    requestAnimationFrame(animate);
}



function syncUpdate(speedMult) {
    angles.earth = (angles.earth + planets.earth.s * speedMult) % 360;
    setPos('earth', angles.earth);
    ctxAz.fillStyle = 'rgba(0, 0, 0, 0.2)'; ctxAz.fillRect(0,0,300,210);
    ctxSky.fillStyle = 'rgba(0, 0, 0, 0.2)'; ctxSky.fillRect(0,0,300,210);

    if (mode === 'retrograde' && activeP) {
        angles[activeP] = (angles[activeP] + planets[activeP].s * speedMult) % 360;
        setPos(activeP, angles[activeP]);
        const eR = angles.earth * Math.PI / 180, pR = angles[activeP] * Math.PI / 180, pInc = planets[activeP].i * Math.PI / 180;
        const ex = Math.cos(eR) * planets.earth.d, ey = Math.sin(eR) * planets.earth.d;
        const px = Math.cos(pR) * planets[activeP].d, py = Math.sin(pR) * planets[activeP].d * Math.cos(pInc), pz = Math.sin(pR) * planets[activeP].d * Math.sin(pInc);
        const dx = px - ex, dy = py - ey, dz = pz;
        const lambda = Math.atan2(dy, dx), beta = Math.atan2(dz, Math.sqrt(dx*dx + dy*dy)), lambdaDeg = (lambda * 180 / Math.PI + 360) % 360;

        updateDataUI(lambdaDeg, beta);
        drawTrack(ctxAz, pathAzimuth, { x: 150 + Math.cos(lambda)*80, y: 105 + Math.sin(lambda)*80 }, planets[activeP].c);
        drawTrack(ctxSky, pathSky, { x: 150 + Math.cos(lambda)*130, y: 105 - beta*400 }, planets[activeP].c);
    } else if (mode === 'transit') {
        processTransit(speedMult);
    }
}

function processTransit(speedMult) {
    if (!activeP) return; 

    // 1. Update the position of the selected planet
    angles[activeP] = (angles[activeP] + planets[activeP].s * speedMult) % 360;
    setPos(activeP, angles[activeP]);

    // 2. Draw the Sun in the HUD
    ctxAz.fillStyle = '#ffda00'; 
    ctxAz.beginPath(); 
    ctxAz.arc(150, 105, 60, 0, Math.PI * 2); 
    ctxAz.fill();
    ctxAz.strokeStyle = '#fff'; 
    ctxAz.lineWidth = 1; 
    ctxAz.stroke();

    // 3. Dynamic Physical Constants based on selection
    // Mercury is smaller (~1/3 of Venus size) and has a shallower light curve dip
    const isMercury = (activeP === 'mercury');
    const r_planet = isMercury ? 4 : 10;      // Apparent radius on solar disk
    const flux_depth = isMercury ? 0.004 : 0.025; // Depth of the light curve dip (0.4% vs 2.5%)
    const r_sun = 60;

    // 4. Calculate Geocentric Angular Difference
    // Replaced hardcoded 'venus' with angles[activeP]
    let diff = ((angles[activeP] - angles.earth + 180) % 360) - 180;
    
    let flux = 1.0;
    // Map the angular difference to the HUD x-coordinate
    let vx = 150 + (diff * 6); 
    let dist = Math.abs(vx - 150); 

    // 5. Collision Detection & Flux Calculation
    if (dist < (r_sun + r_planet)) {
        // Draw the planet silhouette
        ctxAz.fillStyle = '#000'; 
        ctxAz.beginPath(); 
        ctxAz.arc(vx, 105, r_planet, 0, Math.PI * 2); 
        ctxAz.fill();

        // Smoothstep interpolation for the Light Curve (Inbound/Outbound)
        let t = (r_sun + r_planet - dist) / (r_planet * 2); 
        t = Math.max(0, Math.min(1, t));
        
        // Apply the cubic flux model
        flux = 1.0 - (flux_depth * t * t * (3 - 2 * t)); 
    }

    updateLightCurve(flux);
}

function setPos(p, deg) {
    const rad = deg * (Math.PI / 180);
    const el = document.getElementById('p-' + p);
    if(el) {
        el.style.left = `calc(50% + ${Math.cos(rad) * planets[p].d}px)`;
        el.style.top = `calc(50% + ${Math.sin(rad) * planets[p].d}px)`;
    }
}

function updateDataUI(lambda, beta) {
    const valL = document.getElementById('val-lambda'), valS = document.getElementById('val-status'), valB = document.getElementById('val-beta');
    if (lastLambda !== null) {
        let diff = lambda - lastLambda; if (diff > 180) diff -= 360; if (diff < -180) diff += 360;
        if (Math.abs(diff) < 0.005) { valS.innerText = "STA"; valS.className = "status-tag st-sta"; }
        else if (diff < 0) { valS.innerText = "RET"; valS.className = "status-tag st-ret"; }
        else { valS.innerText = "PRO"; valS.className = "status-tag st-pro"; }
    }
    lastLambda = lambda; valL.innerText = lambda.toFixed(1) + "°"; valB.innerText = (beta * 180 / Math.PI).toFixed(1) + "°";
}

animate();