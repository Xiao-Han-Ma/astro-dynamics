function animate() {
    let speedMult = 10;
    if (mode === 'transit') {
        let diff = Math.abs(((angles.venus - angles.earth + 180) % 360) - 180);
        speedMult = (diff < 15) ? 0.3 : 15; 
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

function setPos(p, deg) {
    const rad = deg * (Math.PI / 180);
    const el = document.getElementById('p-' + p);
    if(el) {
        el.style.left = `calc(50% + ${Math.cos(rad) * planets[p].d}px)`;
        el.style.top = `calc(50% + ${Math.sin(rad) * planets[p].d}px)`;
    }
}

// 启动动画
animate();
