const planets = {
    mercury: { d: 30,  s: 4.15,  g: 'inf', c: '#95a5a6', i: 7.00 }, 
    venus:   { d: 55,  s: 1.62,  g: 'inf', c: '#e67e22', i: 3.39 }, 
    earth:   { d: 85,  s: 1.00,  g: 'ear', c: '#3498db', i: 0.00 },
    mars:    { d: 115, s: 0.53,  g: 'sup', c: '#e74c3c', i: 1.85 }, 
    jupiter: { d: 150, s: 0.08,  g: 'sup', c: '#d39c7e', i: 1.30 }, 
    saturn:  { d: 190, s: 0.034, g: 'sup', c: '#f1c40f', i: 2.49 },
    uranus:  { d: 230, s: 0.012, g: 'sup', c: '#81ecec', i: 0.77 },
    neptune: { d: 270, s: 0.006, g: 'sup', c: '#a29bfe', i: 1.77 },
    pluto:   { d: 310, s: 0.004, g: 'sup', c: '#dfe6e9', i: 17.16 }
};

let angles = { mercury:0, venus:0, earth:0, mars:0, jupiter:0, saturn:0, uranus:0, neptune:0, pluto:0 };
let isLive = true, mode = 'idle', activeP = null; 
let pathAzimuth = [], pathSky = [], lastLambda = null;