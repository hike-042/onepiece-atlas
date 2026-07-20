/** A living background for every page on the site: twinkling stars, slow
 *  drifting current-glow (like distant sea fog catching the moonlight),
 *  and a tiny sailing-ship silhouette that crosses the deep background
 *  every so often. Pure original canvas drawing — no imagery, no traced
 *  shapes — just an atmosphere that fits a world that's mostly ocean.
 *
 *  Usage: <canvas class="ambient-backdrop"></canvas> placed as the first
 *  element inside <body> (or #stage), with the CSS in main.css pinning it
 *  behind everything else. Then: startAmbientBackdrop(canvas).
 *  On pages with a WebGL globe, make the globe's own renderer transparent
 *  so this shows through around and behind it. */
export function startAmbientBackdrop(canvas){
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // Shooting stars and the drifting ship are the two most conspicuous moving
  // elements here — skip them under reduced motion. Twinkle is subtle/slow
  // enough to leave as-is (reads more as "living scene" than jarring motion).
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0;

  function resize(){
    w = canvas.width = Math.round(canvas.clientWidth * dpr);
    h = canvas.height = Math.round(canvas.clientHeight * dpr);
  }
  window.addEventListener('resize', resize);
  resize();

  const STAR_COUNT = 160;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random(), y: Math.random(),
    r: Math.random() * 1.4 + 0.35,
    baseAlpha: Math.random() * 0.45 + 0.25,
    twinkleSpeed: Math.random() * 0.02 + 0.006,
    phase: Math.random() * Math.PI * 2,
  }));

  const BLOB_COLORS = ['31,92,86', '166,124,39', '27,42,65'];
  const blobs = Array.from({ length: 6 }, () => ({
    x: Math.random(), y: Math.random(),
    r: 0.18 + Math.random() * 0.24,
    color: BLOB_COLORS[Math.floor(Math.random() * BLOB_COLORS.length)],
    vx: (Math.random() - 0.5) * 0.00012,
    vy: (Math.random() - 0.5) * 0.00006,
  }));

  function makeShip(){
    return {
      x: -0.15,
      y: 0.62 + Math.random() * 0.22,
      speed: 0.00035 + Math.random() * 0.00025,
      scale: 15 + Math.random() * 9,
      flip: Math.random() > 0.5,
    };
  }
  const ship = makeShip();

  function makeShootingStar(){
    const startX = Math.random() * 0.7;
    const angle = Math.PI * 0.22;
    return {
      x: startX, y: -0.05,
      vx: Math.cos(angle) * 0.014, vy: Math.sin(angle) * 0.014,
      life: 0, maxLife: 26 + Math.random() * 10,
    };
  }
  let shootingStar = null;
  let framesSinceStar = 0;
  let nextStarAt = 180 + Math.random() * 300;

  // Optional saga-themed weather layer, set from outside via the returned
  // setWeather('none' | 'sand' | 'fog'). Particle pools are built once and
  // just gated on/off, rather than allocated on every theme switch.
  let weather = 'none';
  const sandGrains = Array.from({ length: 90 }, () => ({
    x: Math.random(), y: Math.random(),
    vx: 0.00028 + Math.random() * 0.00035, vy: 0.00006 + Math.random() * 0.00008,
    r: Math.random() * 1.1 + 0.3, alpha: Math.random() * 0.3 + 0.1,
  }));
  const fogBanks = Array.from({ length: 5 }, () => ({
    x: Math.random(), y: 0.55 + Math.random() * 0.35,
    r: 0.22 + Math.random() * 0.2,
    vx: (Math.random() - 0.5) * 0.00006,
  }));

  // A rare, massive, slow-drifting sea-serpent silhouette — a generic sea
  // monster shape (not any specific franchise creature's design), crossing
  // far less often and far slower than the ship, since it should read as a
  // once-in-a-while sighting rather than routine traffic.
  function makeSeaKing(){
    return {
      x: -0.25,
      y: 0.68 + Math.random() * 0.18,
      speed: 0.00016 + Math.random() * 0.0001,
      scale: 30 + Math.random() * 16,
      flip: Math.random() > 0.5,
    };
  }
  let seaKing = null;
  let framesSinceSeaKing = 0;
  let nextSeaKingAt = 1400 + Math.random() * 1600;

  function drawSeaKing(s){
    const x = s.x * w, y = s.y * h, u = s.scale * dpr * (s.flip ? -1 : 1);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(u, Math.abs(u));
    ctx.fillStyle = 'rgba(140,180,175,0.10)';
    ctx.beginPath();
    ctx.moveTo(-1.4, 0.1);
    ctx.bezierCurveTo(-1.0, -0.45, -0.6, -0.45, -0.2, 0.05);
    ctx.bezierCurveTo(0.1, 0.35, 0.3, 0.35, 0.5, 0.05);
    ctx.bezierCurveTo(0.7, -0.35, 0.95, -0.35, 1.2, -0.05);
    ctx.lineTo(1.22, 0.22);
    ctx.bezierCurveTo(0.95, 0.32, 0.7, 0.1, 0.5, 0.32);
    ctx.bezierCurveTo(0.3, 0.5, 0.1, 0.5, -0.2, 0.32);
    ctx.bezierCurveTo(-0.6, 0.12, -1.0, 0.12, -1.4, 0.32);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(1.15, -0.12, 0.17, 0.13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawShip(s){
    const x = s.x * w, y = s.y * h, u = s.scale * dpr * (s.flip ? -1 : 1);
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(u, Math.abs(u));
    ctx.fillStyle = 'rgba(200,210,215,0.16)';
    ctx.beginPath();
    ctx.moveTo(-1, 0.32); ctx.lineTo(1, 0.32); ctx.lineTo(0.72, 0.56); ctx.lineTo(-0.72, 0.56);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 0.32); ctx.lineTo(0, -0.85); ctx.lineTo(0.6, -0.12);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  let t = 0;
  let frameId;
  function frame(){
    frameId = requestAnimationFrame(frame);
    t++;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.32, 0, w * 0.5, h * 0.32, Math.max(w, h) * 0.8);
    grad.addColorStop(0, '#0d1f30');
    grad.addColorStop(1, '#050a11');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    blobs.forEach(b => {
      b.x += b.vx; b.y += b.vy;
      if (b.x > 1.3) b.x = -0.3; if (b.x < -0.3) b.x = 1.3;
      if (b.y > 1.3) b.y = -0.3; if (b.y < -0.3) b.y = 1.3;
      const bx = b.x * w, by = b.y * h, br = b.r * Math.max(w, h);
      const bg = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      bg.addColorStop(0, `rgba(${b.color},0.16)`);
      bg.addColorStop(1, `rgba(${b.color},0)`);
      ctx.fillStyle = bg;
      ctx.fillRect(bx - br, by - br, br * 2, br * 2);
    });

    stars.forEach(s => {
      const alpha = Math.max(0, s.baseAlpha + Math.sin(t * s.twinkleSpeed + s.phase) * 0.22);
      ctx.fillStyle = `rgba(232,220,192,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(s.x * w, s.y * h, s.r * dpr, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reducedMotion){
      ship.x += ship.speed;
      if (ship.x > 1.2) Object.assign(ship, makeShip());
    }
    drawShip(ship);

    if (!reducedMotion){
      framesSinceSeaKing++;
      if (!seaKing && framesSinceSeaKing > nextSeaKingAt){
        seaKing = makeSeaKing();
        framesSinceSeaKing = 0;
        nextSeaKingAt = 1400 + Math.random() * 1600;
      }
      if (seaKing){
        seaKing.x += seaKing.speed;
        if (seaKing.x > 1.25) seaKing = null;
      }
    }
    if (seaKing) drawSeaKing(seaKing);

    if (!reducedMotion && weather === 'sand'){
      sandGrains.forEach(g => {
        g.x += g.vx; g.y += g.vy;
        if (g.x > 1.05){ g.x = -0.05; g.y = Math.random(); }
        ctx.fillStyle = `rgba(201,154,58,${g.alpha.toFixed(3)})`;
        ctx.beginPath(); ctx.arc(g.x * w, g.y * h, g.r * dpr, 0, Math.PI * 2); ctx.fill();
      });
    }
    if (weather === 'fog'){
      fogBanks.forEach(f => {
        if (!reducedMotion){
          f.x += f.vx;
          if (f.x > 1.3) f.x = -0.3; if (f.x < -0.3) f.x = 1.3;
        }
        const fx = f.x * w, fy = f.y * h, fr = f.r * Math.max(w, h);
        const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, fr);
        fg.addColorStop(0, 'rgba(150,165,155,0.16)');
        fg.addColorStop(1, 'rgba(150,165,155,0)');
        ctx.fillStyle = fg;
        ctx.fillRect(fx - fr, fy - fr, fr * 2, fr * 2);
      });
    }

    if (!reducedMotion){
      framesSinceStar++;
      if (!shootingStar && framesSinceStar > nextStarAt){
        shootingStar = makeShootingStar();
        framesSinceStar = 0;
        nextStarAt = 240 + Math.random() * 420;
      }
    }
    if (shootingStar){
      shootingStar.x += shootingStar.vx;
      shootingStar.y += shootingStar.vy;
      shootingStar.life++;
      const p = shootingStar.life / shootingStar.maxLife;
      if (p < 1){
        const hx = shootingStar.x * w, hy = shootingStar.y * h;
        const tx = hx - shootingStar.vx * w * 3.2, ty = hy - shootingStar.vy * h * 3.2;
        const trail = ctx.createLinearGradient(tx, ty, hx, hy);
        const fade = Math.sin(Math.PI * Math.min(1, p * 1.4)) * (1 - p * 0.3);
        trail.addColorStop(0, `rgba(232,220,192,0)`);
        trail.addColorStop(1, `rgba(255,250,235,${(0.85 * fade).toFixed(3)})`);
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.6 * dpr;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(hx, hy);
        ctx.stroke();
      } else {
        shootingStar = null;
      }
    }
  }
  frame();

  return {
    stop: () => cancelAnimationFrame(frameId),
    setWeather: (next) => { weather = next; },
  };
}
