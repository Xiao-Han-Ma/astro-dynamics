const planets = {
    mercury: { d: 30, s: 4.15, g: 'inf', c: '#95a5a6', i: 7.0 }, 
    venus: { d: 55, s: 1.62, g: 'inf', c: '#e67e22', i: 3.4 }, 
    earth: { d: 85, s: 1.0, g: 'ear', c: '#3498db', i: 0 },
    mars: { d: 120, s: 0.53, g: 'sup', c: '#e74c3c', i: 5.8 }, 
    jupiter: { d: 160, s: 0.08, g: 'sup', c: '#d39c7e', i: 1.3 }
};

// 全局状态变量
let angles = { mercury:0, venus:0, earth:0, mars:0, jupiter:0 };
let isLive = true, mode = 'idle', activeP = null; 
let pathAzimuth = [], pathSky = [], lastLambda = null;
