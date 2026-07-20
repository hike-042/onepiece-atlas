import * as THREE from 'three';

/** Builds an original, procedurally-drawn equirectangular texture depicting
 *  the schematic geography: Grand Line equatorial band, Red Line meridian,
 *  and the four Blues. Nothing here is traced from any existing artwork. */
export function buildWorldTexture(){
  const w = 2048, h = 1024;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d");

  const seaGrad = ctx.createLinearGradient(0, 0, 0, h);
  seaGrad.addColorStop(0, "#1c3a55");
  seaGrad.addColorStop(0.5, "#1F5C56");
  seaGrad.addColorStop(1, "#16324a");
  ctx.fillStyle = seaGrad; ctx.fillRect(0, 0, w, h);

  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 80; i++){
    ctx.strokeStyle = "#dfe9e6";
    ctx.lineWidth = 1;
    ctx.beginPath();
    const y = Math.random() * h;
    ctx.moveTo(0, y);
    for (let x = 0; x <= w; x += 40){ ctx.lineTo(x, y + Math.sin(x / 90) * 6); }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Grand Line equatorial band
  const bandY = h / 2 - 46, bandH = 92;
  ctx.fillStyle = "rgba(201,154,58,0.16)";
  ctx.fillRect(0, bandY, w, bandH);
  ctx.strokeStyle = "rgba(201,154,58,0.55)";
  ctx.lineWidth = 2;
  ctx.setLineDash([14, 10]);
  ctx.strokeRect(0, bandY, w, bandH);
  ctx.setLineDash([]);

  // Red Line meridian (wraps at x=0 and x=w since it's a single great circle)
  const redW = 46;
  ctx.fillStyle = "#8C3B26";
  ctx.fillRect(w - redW / 2, 0, redW / 2, h);
  ctx.fillRect(0, 0, redW / 2, h);
  ctx.strokeStyle = "#5c2517"; ctx.lineWidth = 2;
  ctx.strokeRect(w - redW / 2, 0, redW / 2, h);
  ctx.strokeRect(0, 0, redW / 2, h);

  ctx.fillStyle = "rgba(232,220,192,0.6)";
  ctx.font = "italic 34px Georgia";
  ctx.textAlign = "center";
  ctx.fillText("North Blue", w * 0.42, h * 0.16);
  ctx.fillText("South Blue", w * 0.42, h * 0.9);
  ctx.fillText("West Blue", w * 0.02, h * 0.16);
  ctx.fillText("East Blue", w * 0.92, h * 0.88);
  ctx.font = "italic 30px Georgia";
  ctx.fillText("Paradise", w * 0.32, h * 0.44);
  ctx.fillText("New World", w * 0.72, h * 0.44);

  drawCompassRose(ctx, w * 0.12, h * 0.62, 46);

  return new THREE.CanvasTexture(c);
}

/** A faint decorative compass rose etched into open water — an original
 *  navigator's-chart flourish, not tied to any specific franchise emblem. */
function drawCompassRose(ctx, cx, cy, r){
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "rgba(232,220,192,0.4)";
  ctx.fillStyle = "rgba(232,220,192,0.32)";
  ctx.lineWidth = 1.4;

  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.7, 0, Math.PI * 2); ctx.stroke();

  for (let i = 0; i < 16; i++){
    const ang = (i / 16) * Math.PI * 2;
    const long = i % 4 === 0;
    const inner = long ? r * 0.25 : r * 0.55;
    const outer = long ? r * 0.98 : r * 0.8;
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * inner, Math.sin(ang) * inner);
    ctx.lineTo(Math.cos(ang) * outer, Math.sin(ang) * outer);
    ctx.stroke();
  }

  // the four cardinal points get a small diamond spike instead of a plain line
  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach(ang => {
    ctx.beginPath();
    ctx.moveTo(Math.cos(ang) * r * 1.08, Math.sin(ang) * r * 1.08);
    ctx.lineTo(Math.cos(ang + 0.05) * r * 0.8, Math.sin(ang + 0.05) * r * 0.8);
    ctx.lineTo(Math.cos(ang) * r * 0.55, Math.sin(ang) * r * 0.55);
    ctx.lineTo(Math.cos(ang - 0.05) * r * 0.8, Math.sin(ang - 0.05) * r * 0.8);
    ctx.closePath();
    ctx.fill();
  });

  ctx.restore();
}

/** A small generic sailing-ship icon (silhouette only, not any specific
 *  ship's design) used for the "current ship position" tracker marker. */
export function makeShipIconTexture(hex){
  const s = 96;
  const c = document.createElement("canvas"); c.width = c.height = s;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.strokeStyle = "#1B2A41";
  ctx.lineWidth = 2;

  // hull
  ctx.beginPath();
  ctx.moveTo(s*0.18, s*0.62);
  ctx.lineTo(s*0.82, s*0.62);
  ctx.lineTo(s*0.68, s*0.78);
  ctx.lineTo(s*0.32, s*0.78);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // mast
  ctx.beginPath();
  ctx.moveTo(s*0.5, s*0.62);
  ctx.lineTo(s*0.5, s*0.18);
  ctx.stroke();

  // sail
  ctx.beginPath();
  ctx.moveTo(s*0.5, s*0.2);
  ctx.lineTo(s*0.78, s*0.42);
  ctx.lineTo(s*0.5, s*0.58);
  ctx.closePath();
  ctx.fillStyle = "#f3ead6";
  ctx.fill(); ctx.stroke();

  return new THREE.CanvasTexture(c);
}

/** A tileable, mostly-transparent texture of faint wavy current-lines.
 *  Meant to be layered just above the globe surface and scrolled over
 *  time (via texture.offset.x) to read as moving open water — original
 *  procedural pattern, not a photographed or traced ocean texture. */
export function buildOceanShimmerTexture(){
  const w = 1024, h = 512;
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  const ctx = c.getContext("2d");
  ctx.clearRect(0, 0, w, h);

  for (let band = 0; band < 26; band++){
    const y = (band / 26) * h;
    const alpha = 0.05 + Math.random() * 0.07;
    ctx.strokeStyle = `rgba(223,233,230,${alpha.toFixed(3)})`;
    ctx.lineWidth = 1 + Math.random() * 1.5;
    ctx.beginPath();
    const waveLen = w / (2 + Math.floor(Math.random() * 3));
    const amp = 5 + Math.random() * 10;
    for (let x = 0; x <= w; x += 8){
      const yy = y + Math.sin((x / waveLen) * Math.PI * 2) * amp;
      if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** A small stone-tablet icon (a Poneglyph marker), carved lines only, no
 *  text glyphs traced from anything, red for the Rio Poneglyph, dark
 *  stone-gray for every other one. */
export function makePoneglyphIconTexture(hex){
  const s = 96;
  const c = document.createElement("canvas"); c.width = c.height = s;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.strokeStyle = "#1B2A41";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(s*0.22, s*0.82);
  ctx.lineTo(s*0.22, s*0.32);
  ctx.lineTo(s*0.5, s*0.14);
  ctx.lineTo(s*0.78, s*0.32);
  ctx.lineTo(s*0.78, s*0.82);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  ctx.strokeStyle = "rgba(27,42,65,0.55)";
  ctx.lineWidth = 2;
  [0.42, 0.56, 0.7].forEach(y => {
    ctx.beginPath();
    ctx.moveTo(s*0.32, s*y);
    ctx.lineTo(s*0.68, s*y);
    ctx.stroke();
  });

  return new THREE.CanvasTexture(c);
}

/** A small breaching sea-serpent icon marking Sea King territory, a
 *  generic silhouette rather than any one named creature's design. */
export function makeSeaKingIconTexture(hex){
  const s = 96;
  const c = document.createElement("canvas"); c.width = c.height = s;
  const ctx = c.getContext("2d");
  ctx.fillStyle = hex;
  ctx.strokeStyle = "#0F2A26";
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(s*0.12, s*0.72);
  ctx.bezierCurveTo(s*0.28, s*0.36, s*0.42, s*0.9, s*0.58, s*0.5);
  ctx.bezierCurveTo(s*0.68, s*0.26, s*0.8, s*0.3, s*0.88, s*0.2);
  ctx.lineTo(s*0.82, s*0.4);
  ctx.bezierCurveTo(s*0.7, s*0.5, s*0.6, s*0.98, s*0.4, s*0.6);
  ctx.bezierCurveTo(s*0.3, s*0.82, s*0.2, s*0.86, s*0.12, s*0.72);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  return new THREE.CanvasTexture(c);
}

/** Small circular dot texture used for marker sprites. */
export function makeDotTexture(hex){
  const s = 64;
  const c = document.createElement("canvas"); c.width = c.height = s;
  const ctx = c.getContext("2d");
  ctx.beginPath(); ctx.arc(s / 2, s / 2, s * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = hex; ctx.fill();
  ctx.lineWidth = 4; ctx.strokeStyle = "#E8DCC0"; ctx.stroke();
  return new THREE.CanvasTexture(c);
}
