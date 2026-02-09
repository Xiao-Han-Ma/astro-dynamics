const canAz = document.getElementById('canvas-azimuth');
const ctxAz = canAz.getContext('2d');
const canSky = document.getElementById('canvas-sky');
const ctxSky = canSky.getContext('2d');

canAz.width = 300; canAz.height = 210;
canSky.width = 300; canSky.height = 210;

function drawTrack(ctx, store, current, color) {
    store.push(current); if(store.length > 800) store.shift();
    ctx.strokeStyle = color; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.4;
    ctx.beginPath();
    store.forEach((p, i) => { if(i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
    ctx.stroke();
    ctx.globalAlpha = 1.0; ctx.shadowBlur = 10; ctx.shadowColor = color;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(current.x, current.y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
}

function updateLightCurve(flux) {
    pathSky.push(flux); if(pathSky.length > 2000) pathSky.shift(); 
    document.getElementById('val-flux').innerText = (flux * 100).toFixed(2) + "%";
    ctxSky.clearRect(0, 0, 300, 210);
    ctxSky.strokeStyle = '#00d2ff'; ctxSky.lineWidth = 2;
    ctxSky.beginPath();
    pathSky.forEach((f, i) => {
        let x = i * (300 / pathSky.length);
        let y = 180 - (f - 0.95) * 2000;
        if(i === 0) ctxSky.moveTo(x, y); else ctxSky.lineTo(x, y);
    }); ctxSky.stroke();
}