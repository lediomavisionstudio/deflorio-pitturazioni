// =======================
// EMAILJS CONFIGURATION
// =======================
const EMAILJS_PUBLIC_KEY = "Nw-nU3eqJzDKBvdug";
const EMAILJS_SERVICE_ID = "service_eq3oh89";
const EMAILJS_TEMPLATE_ID = "template_pamfc5q";

const form = document.querySelector('.quote-form');
const note = document.querySelector('.form-note');
const links = [...document.querySelectorAll('.story-link')];
const storyNav = document.querySelector('.story-nav');
const storySpotlight = document.querySelector('.story-spotlight');
const watched = [...document.querySelectorAll('.section-watch')];
const swatches = [...document.querySelectorAll('.swatch')];
const canvas = document.querySelector('#paint-scene');
const ctx = canvas?.getContext('2d');
const logoImage = new Image();
logoImage.src = 'assets/logo-deflorio-header-transparent.png';
let logoReady = false;
let activePaint = '#e50914';
let pointerX = 0;
let pointerY = 0;
let frame = 0;
let width = 0;
let height = 0;
let dpr = 1;
let activeSpotlightSection = null;

function initEmailJS() {
  if (!window.emailjs?.init) return;
  window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

function showSiteToast(message) {
  const toast = document.createElement('div');
  toast.className = 'review-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  if (window.gsap) {
    gsap.to(toast, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power3.out' });
    gsap.to(toast, { autoAlpha: 0, y: 12, duration: 0.24, delay: 3.4, ease: 'power2.out', onComplete: () => toast.remove() });
  } else {
    toast.style.opacity = '1';
    window.setTimeout(() => toast.remove(), 3800);
  }
}

function sendQuoteRequestEmail(request) {
  if (!window.emailjs?.send) {
    return Promise.reject(new Error('EmailJS non disponibile.'));
  }

  const params = {
    name: request.name,
    surname: request.surname,
    email: request.email,
    phone: request.phone,
    service: request.service || 'Non specificato',
    message: request.message || 'Nessun messaggio',
    time: request.time || new Date().toLocaleString('it-IT')
  };

  console.log('Invio EmailJS...');
  console.log('Dati inviati:', params);

  return window.emailjs
    .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then((response) => {
      console.log('Risposta:', response);
      return response;
    });
}

function formatEmailJSError(error) {
  if (!error) return 'Errore sconosciuto EmailJS.';
  if (typeof error === 'string') return error;

  const details = [
    error.status ? `status: ${error.status}` : '',
    error.text ? `text: ${error.text}` : '',
    error.message ? `message: ${error.message}` : ''
  ].filter(Boolean);

  return details.length ? details.join(' - ') : JSON.stringify(error);
}

function moveStorySpotlight(targetLink) {
  if (!storyNav || !storySpotlight || !targetLink) return;
  const x = targetLink.offsetLeft;
  const width = targetLink.offsetWidth;
  const inset = storyNav.classList.contains('nav-compact') ? 3 : 4;
  storyNav.style.setProperty('--spot-x', (x + inset) + 'px');
  storyNav.style.setProperty('--spot-w', Math.max(42, width - inset * 2) + 'px');
}

function illuminateSection(section) {
  if (!section || activeSpotlightSection === section.id) return;
  activeSpotlightSection = section.id;
  section.style.setProperty('--section-glow-x', section.id === 'home' ? '72%' : '50%');
  section.style.setProperty('--section-glow-y', section.id === 'home' ? '32%' : '12%');
  document.querySelectorAll('.section-watch.spotlit').forEach((item) => item.classList.remove('spotlit'));
  section.classList.add('spotlit');
}

logoImage.addEventListener('load', () => { logoReady = true; });
initEmailJS();

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = Math.max(1, Math.round(rect.width));
  height = Math.max(1, Math.round(rect.height));
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function roundRect(x, y, w, h, r) {
  const safeW = Math.max(0, w);
  const safeH = Math.max(0, h);
  const rr = Math.max(0, Math.min(r, safeW / 2, safeH / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + safeW, y, x + safeW, y + safeH, rr);
  ctx.arcTo(x + safeW, y + safeH, x, y + safeH, rr);
  ctx.arcTo(x, y + safeH, x, y, rr);
  ctx.arcTo(x, y, x + rr, y, rr);
  ctx.closePath();
}

function ease(v) {
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}

function logoCrop() {
  return {
    sx: logoImage.width * 0.015,
    sy: logoImage.height * 0.285,
    sw: logoImage.width * 0.97,
    sh: logoImage.height * 0.39
  };
}

function drawLogo(x, y, w, h, alpha) {
  if (!logoReady) return;
  const c = logoCrop();
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(logoImage, c.sx, c.sy, c.sw, c.sh, x, y, w, h);
  ctx.restore();
}

function drawLoungeHeroScene(time = 0) {
  const t = time * 0.001;
  const mx = pointerX;
  const my = pointerY;
  const camera = Math.sin(t * 0.10) * 18 + mx * 22;
  const tilt = Math.sin(t * 0.07) * 5 + my * 9;

  const backLeft = width * 0.34 + camera * 0.28;
  const backRight = width * 0.70 + camera * 0.18;
  const backTop = height * 0.27 + tilt * 0.22;
  const backBottom = height * 0.73 + tilt * 0.10;
  const ceilingInsetL = width * 0.42 + camera * 0.15;
  const ceilingInsetR = width * 0.78 + camera * 0.12;
  const ceilingFrontY = height * 0.06 + tilt * 0.10;

  const wallBase = ctx.createLinearGradient(0, 0, width, height);
  wallBase.addColorStop(0, '#17130e');
  wallBase.addColorStop(0.36, '#4b3e2f');
  wallBase.addColorStop(0.68, '#9b795d');
  wallBase.addColorStop(1, '#c7a47f');
  ctx.fillStyle = wallBase;
  ctx.fillRect(0, 0, width, height);

  drawRoomCeiling(backLeft, backRight, backTop, ceilingInsetL, ceilingInsetR, ceilingFrontY, camera, tilt);
  drawLeftFeatureWall(backLeft, backTop, backBottom, camera, time);
  drawBackWallpaper(backLeft, backRight, backTop, backBottom, camera, time);
  drawRightMaterialWall(backRight, backTop, backBottom, camera, time);
  drawReflectiveFloor(backLeft, backRight, backBottom, camera, time);
  drawLowCabinet(backLeft, backRight, backBottom, camera);
  drawAccentLamp(backRight, backBottom, time);
  drawRoomDust(time, camera, tilt);

  const textShade = ctx.createLinearGradient(0, 0, width * 0.64, 0);
  textShade.addColorStop(0, 'rgba(0,0,0,0.72)');
  textShade.addColorStop(0.30, 'rgba(0,0,0,0.46)');
  textShade.addColorStop(0.60, 'rgba(0,0,0,0.14)');
  textShade.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = textShade;
  ctx.fillRect(0, 0, width, height);

  const cinematic = ctx.createRadialGradient(width * 0.62, height * 0.46, Math.max(width, height) * 0.16, width * 0.62, height * 0.46, Math.max(width, height) * 0.86);
  cinematic.addColorStop(0, 'rgba(255,255,255,0)');
  cinematic.addColorStop(0.66, 'rgba(0,0,0,0.04)');
  cinematic.addColorStop(1, 'rgba(0,0,0,0.36)');
  ctx.fillStyle = cinematic;
  ctx.fillRect(0, 0, width, height);
}

function poly(points, fill, stroke = 'rgba(0,0,0,0.16)', lineWidth = 1) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
}

function drawRoomCeiling(backLeft, backRight, backTop, insetL, insetR, frontY, camera, tilt) {
  const ceiling = ctx.createLinearGradient(0, 0, width, backTop);
  ceiling.addColorStop(0, '#221a13');
  ceiling.addColorStop(0.50, '#7d644d');
  ceiling.addColorStop(1, '#b59878');
  poly([[0, 0], [width, 0], [backRight, backTop], [backLeft, backTop]], ceiling, 'rgba(0,0,0,0.22)', 1.2);

  const tray = ctx.createLinearGradient(insetL, frontY, insetR, backTop);
  tray.addColorStop(0, '#b19678');
  tray.addColorStop(1, '#d1b796');
  poly([[insetL - width * 0.20, frontY], [insetR + width * 0.12, frontY], [backRight - width * 0.02, backTop - 8], [backLeft + width * 0.03, backTop - 8]], tray, 'rgba(0,0,0,0.18)', 1);

  ctx.save();
  ctx.shadowColor = 'rgba(255,219,168,0.72)';
  ctx.shadowBlur = 18;
  ctx.strokeStyle = 'rgba(255,238,204,0.86)';
  ctx.lineWidth = Math.max(2, width * 0.0032);
  ctx.beginPath();
  ctx.moveTo(backLeft + width * 0.04, backTop - 10);
  ctx.lineTo(backRight - width * 0.03, backTop - 10);
  ctx.stroke();
  ctx.restore();

  for (let i = 0; i < 4; i += 1) {
    const px = [0.31, 0.49, 0.68, 0.80][i] * width + camera * 0.16;
    const py = [0.15, 0.10, 0.12, 0.16][i] * height + tilt * 0.12;
    drawSpotLight(px, py, i === 1 ? 1.05 : 0.72);
  }
}

function drawSpotLight(x, y, scale) {
  ctx.save();
  ctx.shadowColor = 'rgba(255,238,212,0.65)';
  ctx.shadowBlur = 16 * scale;
  ctx.fillStyle = 'rgba(255,250,238,0.92)';
  ctx.beginPath();
  ctx.ellipse(x, y, 8 * scale, 5 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(20,16,12,0.34)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawLeftFeatureWall(backLeft, backTop, backBottom, camera, time) {
  const wall = ctx.createLinearGradient(0, 0, backLeft, height);
  wall.addColorStop(0, '#1b1712');
  wall.addColorStop(0.45, '#3b3126');
  wall.addColorStop(1, '#15120f');
  poly([[0, 0], [backLeft, backTop], [backLeft, backBottom], [0, height]], wall, 'rgba(0,0,0,0.34)', 1.4);

  for (let i = 0; i < 3; i += 1) {
    const x = width * (0.13 + i * 0.10) + camera * 0.24;
    const y = height * (0.22 + i * 0.12);
    const glow = ctx.createRadialGradient(x, y, 8, x, y, width * 0.12);
    glow.addColorStop(0, 'rgba(255,238,208,0.34)');
    glow.addColorStop(1, 'rgba(255,238,208,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, backLeft + 30, height);
  }

  drawWallTexture(0, 0, backLeft, height, 42, 'rgba(255,255,255,0.045)', time, 0.5);
}

function drawBackWallpaper(backLeft, backRight, backTop, backBottom, camera, time) {
  const wall = ctx.createLinearGradient(backLeft, backTop, backRight, backBottom);
  wall.addColorStop(0, '#4d4337');
  wall.addColorStop(0.55, '#6a5b4a');
  wall.addColorStop(1, '#2b251f');
  poly([[backLeft, backTop], [backRight, backTop], [backRight, backBottom], [backLeft, backBottom]], wall, 'rgba(0,0,0,0.24)', 1.2);

  ctx.save();
  ctx.beginPath();
  ctx.rect(backLeft, backTop, backRight - backLeft, backBottom - backTop);
  ctx.clip();
  ctx.globalAlpha = 0.30;
  ctx.strokeStyle = 'rgba(20,18,16,0.60)';
  ctx.lineWidth = 1.2;
  for (let i = 0; i < 34; i += 1) {
    const x = backLeft + ((i * 47 + camera * 0.6) % (backRight - backLeft));
    ctx.beginPath();
    ctx.moveTo(x, backBottom);
    for (let j = 0; j < 7; j += 1) {
      const yy = backBottom - j * (backBottom - backTop) / 6;
      const xx = x + Math.sin(j * 1.4 + i) * 18;
      ctx.lineTo(xx, yy);
    }
    ctx.stroke();

    for (let leaf = 0; leaf < 5; leaf += 1) {
      const ly = backTop + (leaf * 0.16 + ((i * 0.031) % 0.13)) * (backBottom - backTop);
      const lx = x + Math.sin(leaf + i) * 26;
      ctx.beginPath();
      ctx.ellipse(lx, ly, 16, 5, Math.sin(i + leaf), 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function drawRightMaterialWall(backRight, backTop, backBottom, camera, time) {
  const wall = ctx.createLinearGradient(backRight, 0, width, height);
  wall.addColorStop(0, '#6d513b');
  wall.addColorStop(0.36, '#9c714f');
  wall.addColorStop(0.72, '#6b4732');
  wall.addColorStop(1, '#2c2119');
  poly([[backRight, backTop], [width, 0], [width, height], [backRight, backBottom]], wall, 'rgba(0,0,0,0.36)', 1.4);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const edge = ctx.createLinearGradient(backRight - 8, 0, backRight + 44, 0);
  edge.addColorStop(0, 'rgba(255,222,164,0)');
  edge.addColorStop(0.52, 'rgba(255,219,156,0.62)');
  edge.addColorStop(1, 'rgba(255,222,164,0)');
  ctx.fillStyle = edge;
  ctx.fillRect(backRight - 22, 0, 70, height);
  ctx.restore();

  drawWallTexture(backRight, 0, width - backRight, height, 70, 'rgba(255,255,255,0.075)', time, 1);
  drawWallTexture(backRight, 0, width - backRight, height, 34, 'rgba(44,24,12,0.22)', time + 1000, 0.7);
}

function drawWallTexture(x, y, w, h, count, color, time, scale = 1) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i += 1) {
    const px = x + ((Math.sin(i * 42.17) + 1) * 0.5) * w;
    const py = y + ((Math.cos(i * 31.73) + 1) * 0.5) * h;
    const rw = (8 + ((Math.sin(i * 13.2) + 1) * 24)) * scale;
    const rh = (2 + ((Math.cos(i * 19.4) + 1) * 8)) * scale;
    ctx.globalAlpha = 0.35 + ((Math.sin(time * 0.0002 + i) + 1) * 0.16);
    ctx.beginPath();
    ctx.ellipse(px, py, rw, rh, Math.sin(i) * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawReflectiveFloor(backLeft, backRight, backBottom, camera, time) {
  const floor = ctx.createLinearGradient(0, backBottom, width, height);
  floor.addColorStop(0, '#4b4136');
  floor.addColorStop(0.45, '#847665');
  floor.addColorStop(1, '#2b251f');
  poly([[backLeft, backBottom], [backRight, backBottom], [width, height], [0, height]], floor, 'rgba(0,0,0,0.28)', 1.2);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  for (let i = 0; i < 7; i += 1) {
    const p = i / 6;
    const y = backBottom + Math.pow(p, 1.45) * (height - backBottom);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y + p * 16);
    ctx.stroke();
  }
  ctx.restore();

  const refl = ctx.createRadialGradient(width * 0.70 + camera, height * 0.78, 20, width * 0.70 + camera, height * 0.78, width * 0.24);
  refl.addColorStop(0, 'rgba(255,235,198,0.24)');
  refl.addColorStop(1, 'rgba(255,235,198,0)');
  ctx.fillStyle = refl;
  ctx.fillRect(0, backBottom, width, height - backBottom);
}

function drawLowCabinet(backLeft, backRight, backBottom, camera) {
  const x = backLeft - width * 0.02;
  const w = backRight - backLeft + width * 0.04;
  const y = backBottom - height * 0.035;
  const h = height * 0.075;
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#2a221b');
  g.addColorStop(1, '#0e0c0a');
  roundRect(x, y, w, h, 3);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.stroke();

  ctx.fillStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.16, y - 18, 14, 24, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.52)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.25, y - 8, 22, 14, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawAccentLamp(backRight, backBottom, time) {
  const x = backRight - width * 0.05;
  const y = backBottom - height * 0.065;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.42);
  ctx.shadowColor = 'rgba(255,230,190,0.8)';
  ctx.shadowBlur = 24;
  ctx.fillStyle = 'rgba(255,247,232,0.94)';
  ctx.beginPath();
  ctx.ellipse(0, 0, 34, 18, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(0,0,0,0.46)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  const glow = ctx.createRadialGradient(x, y, 10, x, y, width * 0.18);
  glow.addColorStop(0, 'rgba(255,224,176,0.28)');
  glow.addColorStop(1, 'rgba(255,224,176,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);
}

function drawRoomDust(time, camera, tilt) {
  const t = time * 0.001;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 120; i += 1) {
    const seed = i * 29.77;
    const x = width * ((Math.sin(seed) + 1) * 0.5) + Math.sin(t * 0.16 + seed) * 12 + pointerX * 8;
    const y = height * (0.08 + ((Math.cos(seed * 1.31) + 1) * 0.43)) + Math.cos(t * 0.14 + seed) * 10 + pointerY * 6;
    const r = 0.45 + ((Math.sin(seed * 2.1) + 1) * 0.85);
    ctx.globalAlpha = 0.018 + ((Math.cos(seed) + 1) * 0.022);
    ctx.fillStyle = i % 13 === 0 ? '#ffd6a0' : '#ffffff';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawBrush(x, y, angle, scale) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.shadowColor = 'rgba(0,0,0,.38)';
  ctx.shadowBlur = 26;
  ctx.shadowOffsetY = 14;

  const handle = ctx.createLinearGradient(-245, -18, 20, 18);
  handle.addColorStop(0, '#18100f');
  handle.addColorStop(0.22, '#6f3028');
  handle.addColorStop(0.5, '#e50914');
  handle.addColorStop(0.78, '#7d1618');
  handle.addColorStop(1, '#20100f');
  roundRect(-250, -18, 245, 36, 18);
  ctx.fillStyle = handle;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#050607';
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-218, -7);
  ctx.lineTo(-44, -7);
  ctx.strokeStyle = 'rgba(255,255,255,.22)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  const ferrule = ctx.createLinearGradient(-10, -48, 72, 48);
  ferrule.addColorStop(0, '#646b70');
  ferrule.addColorStop(0.18, '#f4f7f8');
  ferrule.addColorStop(0.48, '#bfc6c9');
  ferrule.addColorStop(0.62, '#ffffff');
  ferrule.addColorStop(1, '#555b60');
  roundRect(-12, -48, 86, 96, 11);
  ctx.fillStyle = ferrule;
  ctx.fill();
  ctx.strokeStyle = '#050607';
  ctx.lineWidth = 5;
  ctx.stroke();

  for (let lx of [8, 31, 55]) {
    ctx.beginPath();
    ctx.moveTo(lx, -43);
    ctx.lineTo(lx, 43);
    ctx.strokeStyle = 'rgba(0,0,0,.22)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  ctx.shadowBlur = 0;
  const bristle = ctx.createLinearGradient(68, -58, 190, 58);
  bristle.addColorStop(0, '#2a201a');
  bristle.addColorStop(0.34, '#070707');
  bristle.addColorStop(0.7, '#111111');
  bristle.addColorStop(1, activePaint);
  ctx.beginPath();
  ctx.moveTo(70, -54);
  ctx.bezierCurveTo(126, -70, 180, -44, 212, -8);
  ctx.bezierCurveTo(192, 42, 126, 72, 70, 54);
  ctx.closePath();
  ctx.fillStyle = bristle;
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#050607';
  ctx.stroke();

  for (let i = 0; i < 26; i += 1) {
    const yy = -44 + i * 3.5;
    ctx.beginPath();
    ctx.moveTo(82, yy);
    ctx.bezierCurveTo(116, yy + Math.sin(i) * 7, 160, yy * 0.48, 205, yy * 0.08);
    ctx.strokeStyle = i % 5 === 0 ? 'rgba(255,255,255,.20)' : 'rgba(0,0,0,.32)';
    ctx.lineWidth = i % 5 === 0 ? 1.6 : 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(211, -3, 13, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = activePaint;
  ctx.fill();
  ctx.restore();
}

function buildStrokePath(x, y, w, h, p, time) {
  ctx.beginPath();
  const rows = 9;
  for (let i = 0; i < rows; i += 1) {
    const lag = i * 0.025;
    const local = Math.max(0, Math.min(1, (p - lag) / (1 - lag)));
    const end = w * local;
    const yy = y + h * (0.1 + i * 0.1) + Math.sin(time * 0.002 + i * 1.9) * h * 0.022;
    ctx.moveTo(x - 40, yy);
    ctx.bezierCurveTo(x + end * 0.25, yy - h * 0.08, x + end * 0.72, yy + h * 0.07, x + end + 46, yy);
  }
}

function drawLogoScene(time) {
  const mobile = width < 720;
  const logoW = mobile ? width * 0.88 : width * 0.40;
  const logoH = logoW * 0.34;
  const logoX = mobile ? width * 0.08 : width * 0.57;
  const logoY = mobile ? height * 0.54 : height * 0.36;
  const parallaxX = pointerX * (mobile ? 5 : 18);
  const parallaxY = pointerY * (mobile ? 4 : 14);
  const x = logoX + parallaxX;
  const y = logoY + parallaxY;

  const cycle = (time * 0.00012) % 1;
  const progress = cycle < 0.84 ? ease(cycle / 0.84) : 1;
  const tilt = mobile ? -0.012 : -0.032 + pointerX * 0.018;

  ctx.save();
  ctx.translate(x + logoW / 2, y + logoH / 2);
  ctx.rotate(tilt);
  ctx.transform(1, mobile ? 0.01 : 0.018, mobile ? -0.015 : -0.030, 1, 0, 0);
  ctx.translate(-(x + logoW / 2), -(y + logoH / 2));

  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.filter = 'blur(18px)';
  drawLogo(x + 24, y + 34, logoW, logoH, 0.30);
  ctx.restore();

  for (let layer = 4; layer >= 1; layer -= 1) {
    ctx.save();
    ctx.globalAlpha = 0.035 + layer * 0.018;
    ctx.shadowColor = 'rgba(0,0,0,.16)';
    ctx.shadowBlur = 10 + layer * 6;
    drawLogo(x - layer * 5, y + layer * 4, logoW, logoH, 0.22);
    ctx.restore();
  }

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.14)';
  ctx.shadowBlur = 30;
  drawLogo(x, y, logoW, logoH, 0.13);
  ctx.shadowBlur = 0;
  ctx.restore();

  ctx.save();
  buildStrokePath(x, y, logoW, logoH, progress, time);
  ctx.lineWidth = mobile ? 34 : 50;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.clip();
  drawLogo(x, y, logoW, logoH, 1);

  const sheen = ctx.createLinearGradient(x, y, x + logoW, y + logoH);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(Math.max(0, progress - 0.12), 'rgba(255,255,255,0)');
  sheen.addColorStop(Math.min(1, progress + 0.02), 'rgba(255,255,255,0.42)');
  sheen.addColorStop(Math.min(1, progress + 0.18), 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(x - logoW * 0.1, y - logoH * 0.4, logoW * 1.2, logoH * 1.8);
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = activePaint;
  ctx.lineWidth = mobile ? 22 : 34;
  ctx.lineCap = 'round';
  buildStrokePath(x, y, logoW, logoH, progress, time);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.globalAlpha = 0.20;
  ctx.strokeStyle = 'rgba(255,255,255,0.72)';
  ctx.lineWidth = mobile ? 4 : 6;
  ctx.lineCap = 'round';
  buildStrokePath(x, y, logoW, logoH, Math.min(1, progress + 0.018), time);
  ctx.stroke();
  ctx.restore();

  const edgeX = x + logoW * Math.min(0.985, Math.max(0.05, progress));
  const edgeY = y + logoH * (0.52 + Math.sin(time * 0.002) * 0.32);
  ctx.restore();

  drawBrush(edgeX + (mobile ? 8 : 18), edgeY, mobile ? -0.045 : -0.090 + pointerX * 0.025, mobile ? 0.38 : 0.58);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let i = 0; i < 18; i += 1) {
    const visible = progress - 0.12 - i * 0.036;
    if (visible <= 0 || visible > 0.92) continue;
    const drift = Math.sin(time * 0.002 + i) * 5;
    const dx = x + logoW * (0.05 + i * 0.052) + drift;
    const dy = y + logoH * (0.88 + visible * 0.42);
    ctx.globalAlpha = 0.055 + visible * 0.045;
    ctx.fillStyle = i % 3 ? activePaint : '#ffffff';
    ctx.beginPath();
    ctx.ellipse(dx, dy, 2.2 + visible * 1.8, 5 + visible * 16, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  return progress;
}

function drawScene(time) {
  frame += 1;
  ctx.clearRect(0, 0, width, height);
  drawLoungeHeroScene(time);
  canvas.dataset.ready = 'immersive-lounge-scene';
  canvas.dataset.frames = String(frame);
  canvas.dataset.pixel = activePaint;
  requestAnimationFrame(drawScene);
}

window.addEventListener('load', () => moveStorySpotlight(document.querySelector('.story-link.active')));
window.addEventListener('resize', () => moveStorySpotlight(document.querySelector('.story-link.active')));

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (form.dataset.submitting === 'true') return;

  const data = new FormData(form);
  const name = String(data.get('nome') || '').trim();
  const surname = String(data.get('cognome') || '').trim();
  const phone = String(data.get('telefono') || '').replace(/\D/g, '');
  const email = String(data.get('email') || '').trim();
  const services = data.getAll('servizio').map((item) => String(item).trim()).filter(Boolean);
  const message = String(data.get('messaggio') || '').trim();
  const recipient = 'deflorioandrea22@gmail.com';
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton?.textContent || 'Richiedi preventivo';

  note?.classList.remove('is-success', 'is-error');

  if (!name || !surname || phone.length !== 10 || !form.checkValidity()) {
    if (note) {
      note.textContent = 'Inserisci nome, cognome e un numero di telefono valido da 10 cifre.';
      note.classList.add('is-error');
    }
    form.reportValidity?.();
    return;
  }

  const request = {
    name,
    surname,
    phone,
    email,
    service: services.join(', '),
    message,
    time: new Date().toLocaleString('it-IT'),
    recipient,
    createdAt: new Date().toISOString()
  };

  form.dataset.submitting = 'true';
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Invio...';
  }

  try {
    await sendQuoteRequestEmail(request);

    try {
      const key = 'deflorio.quoteRequests.v1';
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      const normalizedEmail = email.toLowerCase();
      const next = saved.filter((item) => String(item.email || '').toLowerCase() !== normalizedEmail);
      next.push(request);
      localStorage.setItem(key, JSON.stringify(next));
    } catch (error) {
      console.warn('Impossibile salvare la richiesta preventivo.', error);
    }

    if (note) {
      note.textContent = 'Preventivo inviato con successo.';
      note.classList.add('is-success');
    }
    showSiteToast('Preventivo inviato con successo.');
    form.reset();
    window.deflorioRefreshMultiSelect?.();
  } catch (error) {
    console.error(error);
    const errorMessage = formatEmailJSError(error);
    if (note) {
      note.textContent = errorMessage;
      note.classList.add('is-error');
    }
    showSiteToast(errorMessage);
  } finally {
    form.dataset.submitting = 'false';
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalButtonText;
    }
  }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    if (window.deflorioSetActiveSection) {
      window.deflorioSetActiveSection(entry.target.id);
    } else {
      links.forEach((link) => link.classList.toggle('active', link.dataset.section === entry.target.id));
      const activeLink = links.find((link) => link.dataset.section === entry.target.id);
      moveStorySpotlight(activeLink);
    }
    illuminateSection(entry.target);
  });
}, { threshold: 0.42 });
watched.forEach((section) => observer.observe(section));

swatches.forEach((button) => {
  button.addEventListener('click', () => {
    swatches.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activePaint = button.dataset.color || '#e50914';
  });
});

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX / window.innerWidth - 0.5;
  pointerY = event.clientY / window.innerHeight - 0.5;
});
if (canvas && ctx) {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  requestAnimationFrame(drawScene);
}

// Adaptive dock text + WhatsApp glass button behavior.
(() => {
  const nav = document.querySelector('.story-nav');
  if (!nav) return;

  const lightTextSections = new Set(['lavori']);
  const darkTextSections = new Set(['home', 'servizi', 'metodo', 'chi-siamo', 'preventivo']);

  function activeSectionId() {
    return document.querySelector('.story-link.active')?.dataset.section || 'home';
  }

  function setDockTone() {
    const sectionId = activeSectionId();
    const useLightText = lightTextSections.has(sectionId);
    const useDarkText = darkTextSections.has(sectionId) || !useLightText;
    nav.classList.toggle('nav-text-light', useLightText);
    nav.classList.toggle('nav-text-dark', useDarkText);
  }

  setDockTone();

  const toneObserver = new MutationObserver(setDockTone);
  document.querySelectorAll('.story-link').forEach((link) => {
    toneObserver.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      setDockTone();
      ticking = false;
    });
    ticking = true;
  }, { passive: true });

  window.addEventListener('resize', setDockTone);
})();

// Subtle fixed-camera motion and surface labels for the architectural showroom hero.
(() => {
  const hero = document.querySelector('.hero.section-watch#home');
  const label = hero?.querySelector('.hero-surface-label');
  if (!hero) return;

  const surfaces = {
    painting: { text: 'Pittura' },
    wallpaper: { text: 'Carta da parati' },
    finish: { text: 'Finitura decorativa' },
    drywall: { text: 'Cartongesso' },
    lights: { text: 'Faretti e LED' }
  };

  let baseX = window.innerWidth < 760 ? 51 : 50;
  const baseY = 50;
  let tx = baseX;
  let ty = baseY;
  let cx = baseX;
  let cy = baseY;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;
  let targetBrightness = 1;
  let currentBrightness = 1;
  let isVisible = true;
  let frameId = 0;

  function updateBase() {
    baseX = window.innerWidth < 760 ? 51 : 50;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function surfaceFromPoint(localX, localY) {
    const desktop = window.innerWidth > 760;
    if (localX < 0 || localX > 1 || localY < 0 || localY > 1) return null;
    if (desktop && localX < 0.30) return null;
    if (localY < 0.105 && localX > 0.34 && localX < 0.86) return 'lights';
    if (localY < 0.235 && localX > 0.36 && localX < 0.88) return 'drywall';
    if (localX < 0.47) return 'painting';
    if (localX < 0.74) return 'wallpaper';
    return 'finish';
  }

  function setActiveSurface(surface, localX, localY) {
    if (!surface) {
      targetBrightness = 1;
      hero.classList.remove('surface-active');
      return;
    }

    targetBrightness = 1.05;
    hero.classList.add('surface-active');

    if (label) {
      label.textContent = surfaces[surface].text;
      hero.style.setProperty('--surface-label-x', clamp(localX * 100, 18, 86).toFixed(2) + '%');
      hero.style.setProperty('--surface-label-y', clamp(localY * 100 - 5, 16, 76).toFixed(2) + '%');
    }
  }

  function shouldRun() {
    return isVisible && !document.hidden;
  }

  function startLoop() {
    if (!frameId && shouldRun()) frameId = requestAnimationFrame(animateBg);
  }

  function stopLoop() {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
  }

  window.addEventListener('resize', () => {
    updateBase();
    startLoop();
  }, { passive: true });

  window.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const localX = (event.clientX - rect.left) / rect.width;
    const localY = (event.clientY - rect.top) / rect.height;
    const px = event.clientX / window.innerWidth - 0.5;
    const py = event.clientY / window.innerHeight - 0.5;
    tx = baseX;
    ty = baseY;
    targetTiltY = px * 4;
    targetTiltX = -py * 4;
    setActiveSurface(surfaceFromPoint(localX, localY), localX, localY);
    startLoop();
  }, { passive: true });

  window.addEventListener('pointerleave', () => {
    tx = baseX;
    ty = baseY;
    targetTiltX = 0;
    targetTiltY = 0;
    setActiveSurface(null, 0.5, 0.5);
    startLoop();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else startLoop();
  });

  const visibilityObserver = new IntersectionObserver((entries) => {
    isVisible = entries.some((entry) => entry.isIntersecting);
    if (isVisible) startLoop();
    else {
      setActiveSurface(null, 0.5, 0.5);
      stopLoop();
    }
  }, { threshold: 0.02 });
  visibilityObserver.observe(hero);

  function animateBg() {
    frameId = 0;
    cx += (tx - cx) * 0.045;
    cy += (ty - cy) * 0.045;
    currentTiltX += (targetTiltX - currentTiltX) * 0.06;
    currentTiltY += (targetTiltY - currentTiltY) * 0.06;
    currentBrightness += (targetBrightness - currentBrightness) * 0.08;
    hero.style.setProperty('--hero-bg-x', cx.toFixed(2) + '%');
    hero.style.setProperty('--hero-bg-y', cy.toFixed(2) + '%');
    hero.style.setProperty('--hero-tilt-x', currentTiltX.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-tilt-y', currentTiltY.toFixed(3) + 'deg');
    hero.style.setProperty('--hero-room-brightness', currentBrightness.toFixed(3));

    const settled = Math.abs(currentTiltX - targetTiltX) < 0.001 &&
      Math.abs(currentTiltY - targetTiltY) < 0.001 &&
      Math.abs(currentBrightness - targetBrightness) < 0.001;
    if (shouldRun() && !settled) frameId = requestAnimationFrame(animateBg);
  }

  startLoop();
})();

// Awwwards-style bottom nav: GSAP capsule, glass reflection, compact scroll and subtle tilt.
(() => {
  const nav = document.querySelector('.story-nav');
  const capsule = document.querySelector('.story-spotlight');
  const links = [...document.querySelectorAll('.story-link')];
  if (!nav || !capsule || !links.length) return;

  const capsuleState = { x: 0, width: 0 };

  function activeLink() {
    return links.find((link) => link.classList.contains('active')) || links[0];
  }

  function renderCapsule() {
    capsule.style.removeProperty('transform');
    capsule.style.removeProperty('width');
    nav.style.setProperty('--spot-x', capsuleState.x.toFixed(2) + 'px');
    nav.style.setProperty('--spot-w', capsuleState.width.toFixed(2) + 'px');
  }

  function capsuleMetrics(target) {
    const compact = nav.classList.contains('nav-compact');
    const mobile = window.innerWidth < 760;
    const inset = compact ? (mobile ? 5 : 7) : (mobile ? 6 : 10);
    const x = target.offsetLeft + inset;
    const width = target.offsetWidth - inset * 2;
    return {
      x,
      width: Math.max(mobile ? 34 : 46, width)
    };
  }

  window.moveStorySpotlight = function movePremiumCapsule(targetLink, immediate = false) {
    const target = targetLink || activeLink();
    if (!target) return;
    const next = capsuleMetrics(target);

    if (window.gsap && !immediate) {
      window.gsap.to(capsuleState, {
        x: next.x,
        width: next.width,
        duration: 0.5,
        ease: 'power4.out',
        overwrite: true,
        onUpdate: renderCapsule
      });
    } else {
      capsuleState.x = next.x;
      capsuleState.width = next.width;
      renderCapsule();
    }
  };

  function syncActiveCapsule(immediate = false) {
    window.moveStorySpotlight(activeLink(), immediate);
  }

  function syncAfterLayoutChange() {
    syncActiveCapsule(true);
    requestAnimationFrame(() => syncActiveCapsule(true));
    setTimeout(() => syncActiveCapsule(true), 120);
    setTimeout(() => syncActiveCapsule(), 360);
  }

  function setCompact(compact) {
    if (nav.classList.contains('nav-compact') === compact) return;
    nav.classList.toggle('nav-compact', compact);
    syncAfterLayoutChange();
  }

  requestAnimationFrame(() => {
    syncActiveCapsule(true);
    if (window.gsap) {
      window.gsap.fromTo(nav,
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.95, ease: 'power4.out', onComplete: () => nav.classList.add('nav-ready') }
      );
    } else {
      nav.classList.add('nav-ready');
    }
  });

  const activeObserver = new MutationObserver(() => syncActiveCapsule());
  links.forEach((link) => activeObserver.observe(link, { attributes: true, attributeFilter: ['class'] }));

  let lastY = window.scrollY;
  let ticking = false;
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    syncActiveCapsule(true);
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(syncAfterLayoutChange, 120);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (Math.abs(delta) > 5) {
        setCompact(delta > 0 && currentY > 140);
        lastY = currentY;
      }
      if (currentY < 120) setCompact(false);
      syncActiveCapsule();
      ticking = false;
    });
  }, { passive: true });

  nav.addEventListener('pointermove', (event) => {
    const rect = nav.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    const ry = Math.max(-2, Math.min(2, px * 4));
    const rx = Math.max(-2, Math.min(2, -py * 4));
    nav.style.setProperty('--nav-rx', rx.toFixed(2) + 'deg');
    nav.style.setProperty('--nav-ry', ry.toFixed(2) + 'deg');
    nav.style.setProperty('--glass-x', ((px + 0.5) * 100).toFixed(1) + '%');
  }, { passive: true });

  nav.addEventListener('pointerleave', () => {
    nav.style.setProperty('--nav-rx', '0deg');
    nav.style.setProperty('--nav-ry', '0deg');
    nav.style.setProperty('--glass-x', '50%');
  });
})();



// Premium motion layer: Lenis smooth scroll, GSAP reveals, magnetic buttons and subtle parallax.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;

  if (window.Lenis && !reduceMotion) {
    const lenis = new window.Lenis({
      duration: 1.18,
      smoothWheel: true,
      wheelMultiplier: 0.86,
      touchMultiplier: 0.92,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
    window.deflorioLenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }

  if (!gsap || reduceMotion) return;

  gsap.defaults({ ease: 'power4.out' });

  function splitTitleLines(title) {
    if (!title || title.dataset.linesReady === 'true') return;
    const source = title.dataset.originalTitle || title.getAttribute('aria-label') || title.textContent.trim();
    if (!source) return;

    title.dataset.originalTitle = source;
    title.dataset.linesReady = 'true';
    title.setAttribute('aria-label', source);
    title.textContent = '';

    const preferredLines = {
      'Ogni ambiente racconta una storia. Noi la valorizziamo.': ['Ogni ambiente', 'racconta una storia.', 'Noi la valorizziamo.'],
      "Dall'idea alla consegna.": ["Dall'idea", 'alla consegna.'],
      'Le pareti parlano di te. Noi le rendiamo uniche.': ['Le pareti parlano di te.', 'Noi le rendiamo uniche.'],
      'Colori precisi, ambienti riconsegnati puliti.': ['Colori precisi,', 'ambienti', 'riconsegnati puliti.'],
      'Prima e Dopo.': ['Prima e', 'Dopo.']
    };
    const lines = preferredLines[source] || [source];

    lines.forEach((text, index) => {
      const line = document.createElement('span');
      line.className = 'reveal-line';
      line.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.textContent = text;
      line.appendChild(inner);
      title.appendChild(line);
      if (index < lines.length - 1) title.appendChild(document.createTextNode(' '));
    });
  }

  const titles = [...document.querySelectorAll('.hero-copy h1, .studio-section h2')];
  titles.forEach(splitTitleLines);
  gsap.set('.reveal-line > span', { yPercent: 112, rotate: 0.001 });
  gsap.set('.hero-copy .eyebrow, .hero-copy p:not(.eyebrow)', { y: 28, autoAlpha: 0 });
  gsap.set('.studio-heading .eyebrow', { y: 24, autoAlpha: 0 });
  gsap.set('.service-card, .process-path span, .portfolio-grid span, .contact-layout span, .review-card, .contact-form-card, .contact-info-card, .comparison-pane, .comparison-divider', {
    y: 44,
    autoAlpha: 0,
    scale: 0.985,
    transformOrigin: '50% 80%'
  });

  function revealTitle(scope, delay = 0) {
    const lines = scope.querySelectorAll('.reveal-line > span');
    if (!lines.length) return;
    gsap.to(lines, {
      yPercent: 0,
      duration: 1.28,
      delay,
      stagger: 0.13,
      overwrite: true
    });
  }

  function revealHero() {
    const hero = document.querySelector('.hero.section-watch#home');
    if (!hero) return;
    revealTitle(hero, 0.12);
    gsap.to(hero.querySelectorAll('.hero-copy .eyebrow, .hero-copy p:not(.eyebrow)'), {
      y: 0,
      autoAlpha: 1,
      duration: 1.15,
      stagger: 0.12,
      delay: 0.34,
      overwrite: true
    });
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      section.dataset.motionVisible = 'true';
      revealTitle(section, 0.03);
      gsap.to(section.querySelectorAll('.studio-heading .eyebrow'), {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        overwrite: true
      });
      gsap.to(section.querySelectorAll('.service-card, .process-path span, .portfolio-grid span, .contact-layout span, .review-card, .contact-form-card, .contact-info-card, .comparison-pane, .comparison-divider'), {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 1.15,
        stagger: 0.11,
        delay: 0.18,
        overwrite: true
      });
      revealObserver.unobserve(section);
    });
  }, { threshold: 0.28, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.studio-section').forEach((section) => revealObserver.observe(section));
  window.addEventListener('load', revealHero, { once: true });
  requestAnimationFrame(revealHero);

  const magneticButtons = [...document.querySelectorAll('.button, .top-quote, .whatsapp-dock')];
  magneticButtons.forEach((button) => {
    button.addEventListener('pointermove', (event) => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(button, {
        x: x * 10,
        y: y * 8,
        scale: 1.018,
        duration: 0.46,
        ease: 'power3.out',
        overwrite: true
      });
    }, { passive: true });

    button.addEventListener('pointerleave', () => {
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.62,
        ease: 'elastic.out(1, 0.58)',
        overwrite: true
      });
    });
  });

  const parallaxItems = [...document.querySelectorAll('.comparison-stage, .portfolio-grid, .contact-layout')];
  let ticking = false;

  function updateParallax() {
    const vh = window.innerHeight || 1;
    parallaxItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) return;
      const progress = (rect.top + rect.height * 0.5 - vh * 0.5) / vh;
      const amount = (index % 2 === 0 ? -1 : 1) * progress * 18;
      gsap.to(item, {
        y: amount,
        duration: 0.72,
        ease: 'power3.out',
        overwrite: true
      });
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }, { passive: true });

  window.addEventListener('resize', () => {
    titles.forEach((title) => {
      title.dataset.linesReady = 'false';
      title.textContent = title.getAttribute('aria-label') || title.textContent;
      splitTitleLines(title);
    });
    gsap.set('.reveal-line > span', { yPercent: 0 });
    updateParallax();
  }, { passive: true });
})();


// Premium interaction layer: custom cursor, tactile cards and refined link feedback.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
  const gsap = window.gsap;

  const interactiveSelector = 'a, button, .button, .story-link, .top-quote, .whatsapp-dock, .service-card, .method-door, .about-location, .comparison-stage, .process-path span, .portfolio-grid span, .contact-layout span, .contact-info-item, .premium-grid article, .timeline article, .finish-card';

  if (finePointer && !reduceMotion) {
    const cursor = document.querySelector('.site-cursor');
    const dot = document.querySelector('.site-cursor-dot');
    if (cursor && dot) {
      document.body.classList.add('has-premium-cursor');
      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let cursorX = x;
      let cursorY = y;
      let dotX = x;
      let dotY = y;
      let cursorFrame = 0;
      let cursorVisible = false;

      function startCursor() {
        if (!cursorFrame && cursorVisible && !document.hidden) cursorFrame = requestAnimationFrame(animateCursor);
      }

      function stopCursor() {
        if (!cursorFrame) return;
        cancelAnimationFrame(cursorFrame);
        cursorFrame = 0;
      }

      window.addEventListener('pointermove', (event) => {
        x = event.clientX;
        y = event.clientY;
        const isInHome = Boolean(event.target.closest('#home'));
        cursorVisible = isInHome;
        document.body.classList.toggle('cursor-in-home', isInHome);
        document.body.classList.toggle('cursor-visible', isInHome);
        document.body.classList.toggle('cursor-interactive', isInHome && Boolean(event.target.closest(interactiveSelector)));
        if (isInHome) startCursor();
        else {
          document.body.classList.remove('cursor-interactive', 'cursor-pressed');
          stopCursor();
        }
      }, { passive: true });

      window.addEventListener('pointerdown', () => document.body.classList.add('cursor-pressed'), { passive: true });
      window.addEventListener('pointerup', () => document.body.classList.remove('cursor-pressed'), { passive: true });
      window.addEventListener('pointerleave', () => {
        cursorVisible = false;
        document.body.classList.remove('cursor-visible', 'cursor-interactive', 'cursor-pressed', 'cursor-in-home');
        stopCursor();
      }, { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopCursor();
        else startCursor();
      });

      function animateCursor() {
        cursorFrame = 0;
        cursorX += (x - cursorX) * 0.16;
        cursorY += (y - cursorY) * 0.16;
        dotX += (x - dotX) * 0.38;
        dotY += (y - dotY) * 0.38;
        cursor.style.transform = 'translate3d(' + cursorX.toFixed(2) + 'px,' + cursorY.toFixed(2) + 'px,0) translate(-50%,-50%)';
        dot.style.transform = 'translate3d(' + dotX.toFixed(2) + 'px,' + dotY.toFixed(2) + 'px,0) translate(-50%,-50%)';
        const settled = Math.abs(cursorX - x) < 0.05 && Math.abs(cursorY - y) < 0.05 && Math.abs(dotX - x) < 0.05 && Math.abs(dotY - y) < 0.05;
        if (cursorVisible && !document.hidden && !settled) cursorFrame = requestAnimationFrame(animateCursor);
      }
    }
  }

  if (!gsap || reduceMotion) return;

  const tactileItems = [...document.querySelectorAll('.service-card, .method-door, .about-location, .comparison-stage, .process-path span, .portfolio-grid span, .contact-layout span, .contact-info-item, .premium-grid article, .timeline article, .finish-card')];
  tactileItems.forEach((item) => {
    item.addEventListener('pointermove', (event) => {
      const rect = item.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(item, {
        rotateX: -py * 2.2,
        rotateY: px * 2.8,
        y: -4,
        scale: 1.006,
        duration: 0.55,
        ease: 'power3.out',
        overwrite: true
      });
    }, { passive: true });

    item.addEventListener('pointerleave', () => {
      gsap.to(item, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        duration: 0.72,
        ease: 'power4.out',
        overwrite: true
      });
    });
  });

  const nav = document.querySelector('.story-nav');
  if (nav) {
    nav.addEventListener('pointerenter', () => {
      gsap.to(nav, { y: -3, duration: 0.46, ease: 'power3.out', overwrite: true });
    });
    nav.addEventListener('pointerleave', () => {
      gsap.to(nav, { y: 0, duration: 0.62, ease: 'power4.out', overwrite: true });
    });
  }

  const pressables = [...document.querySelectorAll('a, button, .button, .top-quote, .whatsapp-dock, .story-link')];
  pressables.forEach((item) => {
    item.addEventListener('pointerdown', () => {
      item.classList.add('is-pressing');
      gsap.to(item, { filter: 'brightness(0.94)', duration: 0.16, ease: 'power2.out', overwrite: 'auto' });
    }, { passive: true });
    item.addEventListener('pointerup', () => {
      item.classList.remove('is-pressing');
      gsap.to(item, { filter: 'brightness(1)', duration: 0.36, ease: 'power3.out', overwrite: 'auto' });
    }, { passive: true });
    item.addEventListener('pointerleave', () => {
      item.classList.remove('is-pressing');
      gsap.to(item, { filter: 'brightness(1)', duration: 0.36, ease: 'power3.out', overwrite: 'auto' });
    }, { passive: true });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      gsap.to(link, { opacity: 0.72, duration: 0.12, yoyo: true, repeat: 1, overwrite: true });
    });
  });
})();


// Metodo architectural journey: progressive doors.
(() => {
  const section = document.querySelector('.method-journey#metodo');
  if (!section) return;

  const doors = [...section.querySelectorAll('.method-door')];
  if (!doors.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  function setActive(index) {
    doors.forEach((door, doorIndex) => {
      const active = doorIndex === index;
      door.classList.toggle('is-active', active);
      door.setAttribute('aria-current', active ? 'step' : 'false');
    });
  }

  setActive(0);

  if (!gsap || reduceMotion) {
    return;
  }

  if (ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    doors.forEach((door, index) => {
      ScrollTrigger.create({
        trigger: door,
        start: 'top 68%',
        end: 'bottom 38%',
        onEnter: () => setActive(index),
        onEnterBack: () => setActive(index)
      });
    });
  } else {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      setActive(doors.indexOf(visible.target));
    }, { threshold: [0.35, 0.55, 0.72], rootMargin: '-18% 0px -28% 0px' });

    doors.forEach((door) => observer.observe(door));
  }

  gsap.fromTo(doors,
    { y: 42, autoAlpha: 0, scale: 0.985 },
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 0.85,
      stagger: 0.09,
      ease: 'power4.out',
      scrollTrigger: ScrollTrigger ? {
        trigger: section,
        start: 'top 70%',
        once: true
      } : undefined
    }
  );
})();


// Chi siamo location reveal.
(() => {
  const section = document.querySelector('.about-section#chi-siamo');
  if (!section || !window.gsap) return;
  const cards = [...section.querySelectorAll('.about-location')];
  if (!cards.length) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  gsap.set(cards, { y: 34, autoAlpha: 0, scale: 0.985, transformOrigin: '50% 80%' });

  const reveal = () => {
    gsap.to(cards, {
      y: (index) => (index === 1 || index === 3 ? 42 : 0),
      autoAlpha: 1,
      scale: 1,
      duration: 0.82,
      stagger: 0.11,
      ease: 'power3.out',
      overwrite: true
    });
  };

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({ trigger: section, start: 'top 68%', once: true, onEnter: reveal });
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      reveal();
      observer.disconnect();
    }, { threshold: 0.26 });
    observer.observe(section);
  }
})();


// Premium contact section motion.
(() => {
  const section = document.querySelector('.contact-premium#preventivo');
  if (!section || !window.gsap) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const reviews = [...section.querySelectorAll('.review-card')];
  const form = section.querySelector('.contact-form-card');
  const info = section.querySelector('.contact-info-card');

  gsap.set(reviews, { y: 24, autoAlpha: 0 });
  gsap.set(form, { x: 34, autoAlpha: 0 });
  gsap.set(info, { y: 28, autoAlpha: 0 });

  const reveal = () => {
    gsap.to(reviews, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.11, ease: 'power3.out', overwrite: true });
    gsap.to(form, { x: 0, autoAlpha: 1, duration: 0.56, delay: 0.08, ease: 'power3.out', overwrite: true });
    gsap.to(info, { y: 0, autoAlpha: 1, duration: 0.5, delay: 0.18, ease: 'power3.out', overwrite: true });
  };

  if (window.ScrollTrigger) {
    gsap.registerPlugin(window.ScrollTrigger);
    window.ScrollTrigger.create({ trigger: section, start: 'top 68%', once: true, onEnter: reveal });
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      reveal();
      observer.disconnect();
    }, { threshold: 0.24 });
    observer.observe(section);
  }
})();

// Secure review submission workflow.
(() => {
  const STORAGE_KEYS = {
    quoteRequests: 'deflorio.quoteRequests.v1',
    reviews: 'deflorio.reviews.v1'
  };

  class StorageRepository {
    constructor(key) {
      this.key = key;
    }

    read() {
      try {
        const value = window.localStorage.getItem(this.key);
        return value ? JSON.parse(value) : [];
      } catch (error) {
        return [];
      }
    }

    write(items) {
      window.localStorage.setItem(this.key, JSON.stringify(items));
    }
  }

  class QuoteRequestRepository extends StorageRepository {
    constructor() {
      super(STORAGE_KEYS.quoteRequests);
    }

    normalizeEmail(email) {
      return String(email || '').trim().toLowerCase();
    }

    existsByEmail(email) {
      const normalized = this.normalizeEmail(email);
      return this.read().some((request) => request.email === normalized);
    }

    save(request) {
      const email = this.normalizeEmail(request.email);
      if (!email) return null;
      const items = this.read().filter((item) => item.email !== email);
      const next = {
        id: crypto.randomUUID ? crypto.randomUUID() : 'quote-' + Date.now(),
        ...request,
        email,
        createdAt: request.createdAt || new Date().toISOString()
      };
      items.unshift(next);
      this.write(items);
      return next;
    }
  }

  class ReviewRepository extends StorageRepository {
    constructor() {
      super(STORAGE_KEYS.reviews);
    }

    normalizeEmail(email) {
      return String(email || '').trim().toLowerCase();
    }

    findByEmail(email) {
      const normalized = this.normalizeEmail(email);
      return this.read().find((review) => review.email === normalized) || null;
    }

    upsert(review) {
      const email = this.normalizeEmail(review.email);
      const items = this.read().filter((item) => item.email !== email);
      const existing = this.findByEmail(email);
      const next = {
        id: existing?.id || (crypto.randomUUID ? crypto.randomUUID() : 'review-' + Date.now()),
        ...review,
        email,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.unshift(next);
      this.write(items);
      return next;
    }
  }

  class ReviewService {
    constructor({ quoteRepository, reviewRepository }) {
      this.quoteRepository = quoteRepository;
      this.reviewRepository = reviewRepository;
    }

    verifyEmail(email) {
      const normalized = this.quoteRepository.normalizeEmail(email);
      if (!normalized || !this.quoteRepository.existsByEmail(normalized)) {
        return { ok: false, email: normalized, reason: 'missingQuote' };
      }
      const existingReview = this.reviewRepository.findByEmail(normalized);
      if (existingReview) return { ok: true, email: normalized, existingReview };
      return { ok: true, email: normalized, existingReview: null };
    }

    saveReview(payload) {
      return this.reviewRepository.upsert(payload);
    }
  }

  class StarRating {
    constructor({ value = 0, onChange }) {
      this.value = value;
      this.onChange = onChange;
      this.element = document.createElement('div');
      this.element.className = 'star-rating';
      this.element.setAttribute('role', 'radiogroup');
      this.buttons = Array.from({ length: 5 }, (_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = '★';
        button.setAttribute('aria-label', String(index + 1) + ' stelle');
        button.addEventListener('click', () => this.setValue(index + 1));
        this.element.appendChild(button);
        return button;
      });
      this.render();
    }

    setValue(value) {
      this.value = value;
      this.render();
      this.onChange?.(value);
    }

    render() {
      this.buttons.forEach((button, index) => {
        const active = index < this.value;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-checked', active && index + 1 === this.value ? 'true' : 'false');
      });
    }
  }

  class ModalBase {
    constructor() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'review-workflow-overlay';
      this.overlay.hidden = true;
      this.overlay.addEventListener('click', (event) => {
        if (event.target === this.overlay) this.close();
      });
      this.handleEscape = (event) => {
        if (event.key === 'Escape' && !this.overlay.hidden) this.close();
      };
      document.addEventListener('keydown', this.handleEscape);
      this.modal = document.createElement('div');
      this.modal.className = 'review-workflow-modal';
      this.modal.setAttribute('role', 'dialog');
      this.modal.setAttribute('aria-modal', 'true');
      this.overlay.appendChild(this.modal);
      document.body.appendChild(this.overlay);
    }

    open() {
      this.overlay.hidden = false;
      document.body.style.overflow = 'hidden';
      if (window.gsap) {
        gsap.fromTo(this.overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: 'power3.out' });
        gsap.fromTo(this.modal, { y: 18, scale: 0.96, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.34, ease: 'power3.out' });
      }
      this.modal.querySelector('input, textarea, button')?.focus();
    }

    close() {
      const finish = () => {
        this.overlay.hidden = true;
        document.body.style.overflow = '';
      };
      if (window.gsap && !this.overlay.hidden) {
        gsap.to(this.overlay, { autoAlpha: 0, duration: 0.2, ease: 'power2.out', onComplete: finish });
      } else {
        finish();
      }
    }
  }

  class ReviewEmailVerificationModal extends ModalBase {
    constructor({ service, onVerified, onEditReview }) {
      super();
      this.service = service;
      this.onVerified = onVerified;
      this.onEditReview = onEditReview;
      this.render();
    }

    render() {
      this.modal.innerHTML = `
        <h3>Verifica la tua email</h3>
        <p>Per lasciare una recensione inserisci l'indirizzo email utilizzato durante la richiesta di preventivo.</p>
        <form class="review-workflow-form" novalidate>
          <label>Email<input type="email" name="email" autocomplete="email" required></label>
          <div class="review-workflow-error" aria-live="polite"></div>
          <div class="review-modal-actions">
            <button class="secondary" type="button" data-cancel>Annulla</button>
            <button class="primary" type="submit">Continua</button>
          </div>
        </form>`;
      this.form = this.modal.querySelector('form');
      this.email = this.modal.querySelector('input[name="email"]');
      this.error = this.modal.querySelector('.review-workflow-error');
      this.modal.querySelector('[data-cancel]').addEventListener('click', () => this.close());
      this.form.addEventListener('submit', (event) => this.submit(event));
    }

    submit(event) {
      event.preventDefault();
      this.error.innerHTML = '';
      if (!this.email.checkValidity()) {
        this.error.textContent = 'Inserisci un indirizzo email valido.';
        return;
      }
      const result = this.service.verifyEmail(this.email.value);
      if (!result.ok) {
        this.error.innerHTML = '<strong>Non abbiamo trovato alcuna richiesta di preventivo associata a questa email.</strong><span>Per lasciare una recensione è necessario aver richiesto un preventivo.</span>';
        return;
      }
      if (result.existingReview) {
        this.error.innerHTML = '<strong>Hai già pubblicato una recensione.</strong>';
        const edit = document.createElement('button');
        edit.type = 'button';
        edit.className = 'primary';
        edit.textContent = 'Modifica recensione';
        edit.addEventListener('click', () => {
          this.close();
          this.onEditReview(result.email, result.existingReview);
        });
        this.error.appendChild(edit);
        return;
      }
      this.close();
      this.onVerified(result.email, null);
    }
  }

  class ReviewModal extends ModalBase {
    constructor({ service, onSaved }) {
      super();
      this.service = service;
      this.onSaved = onSaved;
      this.email = '';
      this.rating = 0;
      this.render();
    }

    render() {
      this.modal.innerHTML = `
        <h3>La tua recensione</h3>
        <form class="review-workflow-form" novalidate>
          <label>Nome<input type="text" name="name" autocomplete="name" required></label>
          <label>Rating<div data-stars></div></label>
          <label>Commento<textarea name="comment" maxlength="500" required></textarea></label>
          <div class="review-modal-actions">
            <button class="secondary" type="button" data-cancel>Annulla</button>
            <button class="primary" type="submit" disabled>Pubblica recensione</button>
          </div>
        </form>`;
      this.form = this.modal.querySelector('form');
      this.name = this.modal.querySelector('input[name="name"]');
      this.comment = this.modal.querySelector('textarea[name="comment"]');
      this.saveButton = this.modal.querySelector('button[type="submit"]');
      this.starRating = new StarRating({ onChange: (value) => { this.rating = value; this.validate(); } });
      this.modal.querySelector('[data-stars]').appendChild(this.starRating.element);
      this.modal.querySelector('[data-cancel]').addEventListener('click', () => this.close());
      this.name.addEventListener('input', () => this.validate());
      this.comment.addEventListener('input', () => this.validate());
      this.form.addEventListener('submit', (event) => this.submit(event));
    }

    openFor(email, review = null) {
      this.email = email;
      this.name.value = review?.name || '';
      this.comment.value = review?.comment || '';
      this.rating = review?.rating || 0;
      this.starRating.setValue(this.rating);
      this.validate();
      this.open();
    }

    validate() {
      const commentLength = this.comment.value.trim().length;
      const valid = this.name.value.trim().length > 0 && this.rating > 0 && commentLength > 0 && commentLength <= 500;
      this.saveButton.disabled = !valid;
    }

    submit(event) {
      event.preventDefault();
      this.validate();
      if (this.saveButton.disabled) return;
      const review = this.service.saveReview({
        name: this.name.value.trim(),
        email: this.email,
        rating: this.rating,
        comment: this.comment.value.trim()
      });
      this.close();
      this.onSaved(review);
    }
  }

  function createReviewCard(review) {
    const article = document.createElement('article');
    article.className = 'review-card';
    article.dataset.reviewEmail = review.email;
    article.innerHTML = '<span aria-label="' + review.rating + ' stelle">' + '★★★★★'.slice(0, review.rating) + '</span><h3></h3><p></p>';
    article.querySelector('h3').textContent = review.name;
    article.querySelector('p').textContent = review.comment;
    return article;
  }

  function renderUserReviews(repository) {
    const list = document.querySelector('.contact-premium .review-list');
    if (!list) return;
    list.innerHTML = '';
    repository.read().forEach((review) => list.appendChild(createReviewCard(review)));
    window.deflorioUpdateReviewPager?.();
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'review-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    if (window.gsap) {
      gsap.to(toast, { autoAlpha: 1, y: 0, duration: 0.28, ease: 'power3.out' });
      gsap.to(toast, { autoAlpha: 0, y: 12, duration: 0.24, delay: 2.6, ease: 'power2.out', onComplete: () => toast.remove() });
    } else {
      toast.style.opacity = '1';
      window.setTimeout(() => toast.remove(), 3000);
    }
  }

  const quoteRepository = new QuoteRequestRepository();
  const reviewRepository = new ReviewRepository();
  const service = new ReviewService({ quoteRepository, reviewRepository });
  const trigger = document.querySelector('.review-trigger');

  const reviewModal = new ReviewModal({
    service,
    onSaved: () => {
      renderUserReviews(reviewRepository);
      showToast('Grazie! La tua recensione è stata pubblicata.');
    }
  });

  const verificationModal = new ReviewEmailVerificationModal({
    service,
    onVerified: (email, review) => reviewModal.openFor(email, review),
    onEditReview: (email, review) => reviewModal.openFor(email, review)
  });

  trigger?.addEventListener('click', () => verificationModal.open());
  renderUserReviews(reviewRepository);
})();

// Review carousel pagination.
(() => {
  const section = document.querySelector('.contact-premium#preventivo');
  const list = section?.querySelector('.review-list');
  const prev = section?.querySelector('[data-review-prev]');
  const next = section?.querySelector('[data-review-next]');
  const pageLabel = section?.querySelector('.review-page');
  if (!section || !list || !prev || !next || !pageLabel) return;

  const perPage = 3;
  let page = 0;

  const getCards = () => [...list.querySelectorAll('.review-card')];

  const animateVisibleCards = (cards) => {
    if (!window.gsap || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(cards,
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.38, stagger: 0.06, ease: 'power3.out', overwrite: true }
    );
  };

  const update = (shouldAnimate = false) => {
    const cards = getCards();
    const totalPages = Math.max(1, Math.ceil(cards.length / perPage));
    page = Math.min(page, totalPages - 1);
    const start = page * perPage;
    const visible = [];

    cards.forEach((card, index) => {
      const isVisible = index >= start && index < start + perPage;
      card.classList.toggle('is-review-hidden', !isVisible);
      card.setAttribute('aria-hidden', String(!isVisible));
      if (isVisible) visible.push(card);
    });

    prev.disabled = page === 0;
    next.disabled = page >= totalPages - 1;
    pageLabel.textContent = String(page + 1) + ' / ' + String(totalPages);
    if (shouldAnimate) animateVisibleCards(visible);
  };

  prev.addEventListener('click', () => {
    if (page <= 0) return;
    page -= 1;
    update(true);
  });

  next.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(getCards().length / perPage));
    if (page >= totalPages - 1) return;
    page += 1;
    update(true);
  });

  window.deflorioUpdateReviewPager = () => update(false);
  update(false);
})();

// Quote form multi-select and validation helpers.
(() => {
  const quoteForm = document.querySelector('.quote-form');
  if (!quoteForm) return;

  const phoneInput = quoteForm.querySelector('input[name="telefono"]');
  const multiSelects = [...quoteForm.querySelectorAll('[data-multi-select]')];

  const refreshMultiSelect = () => {
    multiSelects.forEach((select) => {
      const label = select.querySelector('[data-multi-label]');
      const checked = [...select.querySelectorAll('input[type="checkbox"]:checked')].map((input) => input.value);
      if (!label) return;
      label.textContent = checked.length ? checked.join(', ') : 'Seleziona uno o più servizi';
    });
  };

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  multiSelects.forEach((select) => {
    select.addEventListener('change', refreshMultiSelect);
  });

  document.addEventListener('click', (event) => {
    multiSelects.forEach((select) => {
      if (select.contains(event.target)) return;
      select.querySelector('details')?.removeAttribute('open');
    });
  });

  window.deflorioRefreshMultiSelect = refreshMultiSelect;
  refreshMultiSelect();
})();

// Public lavori gallery and review rendering from the shared admin data source.
(() => {
  if (!window.DeflorioData) return;

  const portfolioRepository = new window.DeflorioData.PortfolioRepository();
  const reviewRepository = new window.DeflorioData.ReviewRepository();
  const media = document.querySelector('[data-lavori-media]');
  const currentImage = document.querySelector('[data-lavori-current]');
  const nextImage = document.querySelector('[data-lavori-next-image]');
  const prev = document.querySelector('[data-lavori-prev]');
  const next = document.querySelector('[data-lavori-next]');
  const counter = document.querySelector('[data-lavori-counter]');
  let lavoriItems = [];
  let activeIndex = 0;
  let autoplay = null;
  let resumeTimer = null;
  let touchStartX = 0;
  let currentNaturalWidth = 0;
  let currentNaturalHeight = 0;

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function preloadImage(index) {
    if (!lavoriItems.length) return;
    const item = lavoriItems[(index + lavoriItems.length) % lavoriItems.length];
    if (!item?.image) return;
    const image = new Image();
    image.decoding = 'async';
    image.src = item.image;
  }

  function updateCounter() {
    if (counter) counter.textContent = pad(activeIndex + 1) + ' / ' + pad(Math.max(1, lavoriItems.length));
  }

  function imageIsLargeEnough() {
    return currentNaturalWidth >= 1200 || currentNaturalHeight >= 900;
  }

  function animateKenBurns() {
    if (!window.gsap || !currentImage) return;
    gsap.killTweensOf(currentImage);
    const targetScale = imageIsLargeEnough() ? 1.03 : 1;
    gsap.fromTo(currentImage, { scale: 1 }, { scale: targetScale, duration: 5.8, ease: 'none' });
  }

  function loadImageElement(element, item, onLoad) {
    if (!element || !item) return;
    element.onload = () => onLoad?.(element);
    element.src = item.image;
    element.alt = item.alt || 'Lavoro Deflorio Pitturazioni';
  }

  function showImage(index, animate = true) {
    if (!currentImage || !lavoriItems.length) return;
    activeIndex = (index + lavoriItems.length) % lavoriItems.length;
    const item = lavoriItems[activeIndex];
    updateCounter();
    preloadImage(activeIndex + 1);

    if (!animate || !nextImage || !window.gsap) {
      loadImageElement(currentImage, item, (image) => {
        currentNaturalWidth = image.naturalWidth || 0;
        currentNaturalHeight = image.naturalHeight || 0;
        currentImage.classList.add('is-active');
        animateKenBurns();
      });
      return;
    }

    loadImageElement(nextImage, item, (image) => {
      currentNaturalWidth = image.naturalWidth || 0;
      currentNaturalHeight = image.naturalHeight || 0;
      nextImage.classList.add('is-active');
      gsap.killTweensOf([currentImage, nextImage]);
      gsap.set(nextImage, { autoAlpha: 0, scale: 1 });
      gsap.to(nextImage, { autoAlpha: 1, duration: 0.7, ease: 'power3.out' });
      gsap.to(currentImage, {
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power3.out',
        onComplete: () => {
          currentImage.src = item.image;
          currentImage.alt = item.alt || 'Lavoro Deflorio Pitturazioni';
          gsap.set(currentImage, { autoAlpha: 1, scale: 1 });
          nextImage.classList.remove('is-active');
          nextImage.removeAttribute('src');
          gsap.set(nextImage, { autoAlpha: 0, scale: 1 });
          animateKenBurns();
        }
      });
    });
  }

  function animateButton(button) {
    if (!button || !window.gsap) return;
    button.addEventListener('mouseenter', () => gsap.to(button, { scale: 1.08, duration: 0.35, ease: 'power3.out' }));
    button.addEventListener('mouseleave', () => gsap.to(button, { scale: 1, duration: 0.35, ease: 'power3.out' }));
    button.addEventListener('focus', () => gsap.to(button, { scale: 1.08, duration: 0.35, ease: 'power3.out' }));
    button.addEventListener('blur', () => gsap.to(button, { scale: 1, duration: 0.35, ease: 'power3.out' }));
  }

  function fadeInGallery() {
    const gallery = document.querySelector('[data-lavori-slider]');
    if (!gallery || !window.gsap) return;
    gsap.fromTo(gallery, { autoAlpha: 0, y: 24 }, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: gallery,
        start: 'top 82%',
        once: true
      }
    });
  }

  function stopAutoplay() {
    window.clearInterval(autoplay);
    autoplay = null;
  }

  function startAutoplay() {
    stopAutoplay();
    if (lavoriItems.length <= 1) return;
    autoplay = window.setInterval(() => showImage(activeIndex + 1, true), 5000);
  }

  function pauseThenResume() {
    stopAutoplay();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAutoplay, 6500);
  }

  function renderPortfolio() {
    lavoriItems = portfolioRepository.read();
    if (!lavoriItems.length || !currentImage) return;
    activeIndex = Math.min(activeIndex, lavoriItems.length - 1);
    showImage(activeIndex, false);
    startAutoplay();
  }

  prev?.addEventListener('click', () => {
    showImage(activeIndex - 1, true);
    pauseThenResume();
  });

  next?.addEventListener('click', () => {
    showImage(activeIndex + 1, true);
    pauseThenResume();
  });

  media?.addEventListener('mouseenter', stopAutoplay);
  media?.addEventListener('mouseleave', startAutoplay);
  media?.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    showImage(activeIndex + (event.key === 'ArrowRight' ? 1 : -1), true);
    pauseThenResume();
  });
  media?.addEventListener('touchstart', (event) => { touchStartX = event.touches[0]?.clientX || 0; stopAutoplay(); }, { passive: true });
  media?.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const delta = endX - touchStartX;
    if (Math.abs(delta) > 42) showImage(activeIndex + (delta < 0 ? 1 : -1), true);
    pauseThenResume();
  }, { passive: true });

  function createPublicReviewCard(review) {
    const article = document.createElement('article');
    article.className = 'review-card';
    const rating = Math.max(1, Math.min(5, Number(review.rating || 5)));
    article.innerHTML = '<span aria-label="' + rating + ' stelle">' + '\u2605'.repeat(rating) + '</span><h3></h3><p></p>';
    article.querySelector('h3').textContent = review.name;
    article.querySelector('p').textContent = review.comment;
    return article;
  }

  function renderReviews() {
    const list = document.querySelector('.contact-premium .review-list');
    if (!list) return;
    list.innerHTML = '';
    reviewRepository.read().forEach((review) => list.appendChild(createPublicReviewCard(review)));
    window.deflorioUpdateReviewPager?.();
  }

  window.deflorioRenderManagedContent = () => {
    renderPortfolio();
    renderReviews();
  };

  window.addEventListener('storage', (event) => {
    if (event.key === window.DeflorioData.KEYS.portfolio || event.key === window.DeflorioData.KEYS.reviews) {
      window.deflorioRenderManagedContent();
    }
  });
  window.addEventListener('deflorio:data-changed', () => window.deflorioRenderManagedContent());
  animateButton(prev);
  animateButton(next);
  fadeInGallery();
  window.deflorioRenderManagedContent();
})();

// Reliable section navigation: one source of truth for anchor scrolling and the active pill.
(() => {
  const nav = document.querySelector('.story-nav');
  const capsule = document.querySelector('.story-spotlight');
  const links = [...document.querySelectorAll('.story-link')];
  if (!nav || !capsule || !links.length) return;

  const sectionLinks = links
    .map((link) => {
      const hrefId = (link.getAttribute('href') || '').replace(/^#/, '');
      const id = link.dataset.section || hrefId;
      return { link, id };
    })
    .filter(({ id }) => id && document.getElementById(id));

  const sectionIds = sectionLinks.map(({ id }) => id);
  let pendingSectionId = '';
  let syncFrame = 0;
  let correctionFrame = 0;

  function linkForSection(id) {
    return sectionLinks.find((item) => item.id === id)?.link || sectionLinks[0]?.link || links[0];
  }

  function sectionTop(id) {
    const section = document.getElementById(id);
    if (!section) return 0;
    return Math.max(0, section.getBoundingClientRect().top + window.scrollY);
  }

  function isNearSection(id) {
    return Math.abs(window.scrollY - sectionTop(id)) < 10;
  }

  function moveCapsule(target) {
    if (!target) return;
    const compact = nav.classList.contains('nav-compact');
    const mobile = window.innerWidth < 760;
    const inset = compact ? (mobile ? 5 : 7) : (mobile ? 6 : 10);
    const x = target.offsetLeft + inset;
    const width = Math.max(mobile ? 36 : 48, target.offsetWidth - inset * 2);
    nav.style.setProperty('--spot-x', x.toFixed(2) + 'px');
    nav.style.setProperty('--spot-w', width.toFixed(2) + 'px');
    capsule.style.removeProperty('transform');
    capsule.style.removeProperty('width');

    if (mobile && typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }

  function setActiveSection(id, immediate = false) {
    const target = linkForSection(id);
    if (!target) return;
    links.forEach((link) => link.classList.toggle('active', link === target));
    if (window.moveStorySpotlight) {
      window.moveStorySpotlight(target, immediate);
    } else {
      moveCapsule(target);
    }
  }

  function currentSectionId() {
    const probe = Math.min(window.innerHeight * (window.innerWidth < 760 ? 0.38 : 0.42), 360);
    let best = sectionIds[0] || 'home';
    let bestScore = Number.POSITIVE_INFINITY;

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;

      const containsProbe = rect.top <= probe && rect.bottom >= probe;
      const center = rect.top + rect.height / 2;
      const score = containsProbe
        ? Math.abs(center - probe)
        : Math.min(Math.abs(rect.top - probe), Math.abs(rect.bottom - probe)) + 10000;

      if (score < bestScore) {
        best = id;
        bestScore = score;
      }
    });

    return best;
  }

  function syncActiveNav() {
    if (pendingSectionId && isNearSection(pendingSectionId)) {
      pendingSectionId = '';
    }
    setActiveSection(pendingSectionId || currentSectionId());
  }

  function requestSync() {
    if (syncFrame) return;
    syncFrame = window.requestAnimationFrame(() => {
      syncFrame = 0;
      syncActiveNav();
    });
  }

  function layoutReady() {
    const tasks = [];
    if (document.readyState !== 'complete') {
      tasks.push(new Promise((resolve) => window.addEventListener('load', resolve, { once: true })));
    }
    if (document.fonts?.ready) {
      tasks.push(document.fonts.ready.catch(() => undefined));
    }
    return Promise.all(tasks).then(() => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    }));
  }

  function monitorTarget(id) {
    let frames = 0;
    if (correctionFrame) cancelAnimationFrame(correctionFrame);

    function tick() {
      frames += 1;
      if (!pendingSectionId || isNearSection(id) || frames > 180) {
        pendingSectionId = '';
        syncActiveNav();
        return;
      }
      correctionFrame = requestAnimationFrame(tick);
    }

    correctionFrame = requestAnimationFrame(tick);
  }

  async function navigateToSection(id) {
    const section = document.getElementById(id);
    if (!section) return;
    pendingSectionId = id;
    setActiveSection(id, true);
    await layoutReady();

    const targetY = id === 'home' ? 0 : sectionTop(id);
    if (window.deflorioLenis?.scrollTo) {
      window.deflorioLenis.scrollTo(targetY, {
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    if (history.replaceState) {
      history.replaceState(null, '', `${location.pathname}${location.search}#${id}`);
    }
    monitorTarget(id);
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href^="#"]');
    if (!anchor) return;
    const id = decodeURIComponent((anchor.getAttribute('href') || '').replace(/^#/, ''));
    if (!id || !document.getElementById(id)) return;
    event.preventDefault();
    navigateToSection(id);
  }, true);

  window.deflorioSetActiveSection = (id) => {
    if (!pendingSectionId && sectionIds.includes(id)) setActiveSection(id);
  };
  window.deflorioSyncNavigation = syncActiveNav;
  window.deflorioNavigateToSection = navigateToSection;

  window.addEventListener('scroll', requestSync, { passive: true });
  window.addEventListener('resize', requestSync, { passive: true });
  window.addEventListener('orientationchange', requestSync);
  window.addEventListener('hashchange', requestSync);
  window.addEventListener('load', requestSync);
  document.addEventListener('DOMContentLoaded', requestSync);
  document.fonts?.ready?.then(requestSync).catch(() => undefined);
  document.querySelectorAll('img').forEach((image) => {
    if (!image.complete) {
      image.addEventListener('load', requestSync, { once: true });
      image.addEventListener('error', requestSync, { once: true });
    }
  });

  requestSync();
})();
