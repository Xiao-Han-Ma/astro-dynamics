function ui(type) {
    const h = document.getElementById('info-h'), b = document.getElementById('info-b');
    const azHUD = document.getElementById('hud-wrap-azimuth'), skyHUD = document.getElementById('hud-wrap-sky'), opts = document.getElementById('opt-container');
    
    // 初始化 UI 状态
    azHUD.style.display = 'none'; skyHUD.style.display = 'none'; 
    document.getElementById('info-panel').classList.add('active');

    if (type === 'retrograde') {
        isLive = false; mode = 'retrograde'; activeP = null; pathAzimuth = []; pathSky = []; 
        azHUD.style.display = 'block'; skyHUD.style.display = 'block';
        h.innerText = "Retrograde Tracking";
        b.innerText = "Generally, planets move from west to east (Prograde). Retrograde motion is an apparent backward (east to west) motion caused by Earth 'lapping' an outer planet.";
        addOpt('Track Mars', () => { activeP = 'mars'; pathAzimuth = []; pathSky = []; });
    }
    // ... 其他分支逻辑同理
}

function resetSystem() {
    isLive = true; mode = 'idle'; activeP = null;
    document.getElementById('info-panel').classList.remove('active');
    document.getElementById('hud-wrap-azimuth').style.display = 'none';
    document.getElementById('hud-wrap-sky').style.display = 'none';
}
