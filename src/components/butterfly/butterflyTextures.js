import * as THREE from 'three';

/**
 * Generates procedural wing maps (albedo, glowing veins emissive, alpha translucency)
 * crafted for a delicate, semi-translucent amber-gold celestial butterfly silhouette
 * with fine champagne-gold venation that lets cosmic nebula light softly shine through.
 */
export function createButterflyWingMaps(kind = 'fore') {
  const size = 512;

  const colorCanvas = document.createElement('canvas');
  const emissiveCanvas = document.createElement('canvas');
  const alphaCanvas = document.createElement('canvas');

  [colorCanvas, emissiveCanvas, alphaCanvas].forEach((c) => {
    c.width = size;
    c.height = size;
  });

  const cCtx = colorCanvas.getContext('2d');
  const eCtx = emissiveCanvas.getContext('2d');
  const aCtx = alphaCanvas.getContext('2d');

  const rootX = size * 0.04;
  const rootY = kind === 'fore' ? size * 0.84 : size * 0.16;

  // Base warm translucent amber-copper gradient
  const baseGrad = cCtx.createRadialGradient(
    rootX,
    rootY,
    size * 0.02,
    size * 0.56,
    kind === 'fore' ? size * 0.44 : size * 0.56,
    size * 0.96
  );
  baseGrad.addColorStop(0.0, '#FFF1BA');
  baseGrad.addColorStop(0.18, '#F2B857');
  baseGrad.addColorStop(0.55, '#CC7422');
  baseGrad.addColorStop(0.86, '#9B4C16');
  baseGrad.addColorStop(1.0, '#D88D38');

  cCtx.fillStyle = baseGrad;
  cCtx.fillRect(0, 0, size, size);

  // Subtle warm champagne rim highlight along coastal/leading edge
  const rimGrad =
    kind === 'fore'
      ? cCtx.createLinearGradient(0, size * 0.25, size, 0)
      : cCtx.createLinearGradient(0, 0, size * 0.9, size);
  rimGrad.addColorStop(0.0, 'rgba(255, 240, 185, 0.35)');
  rimGrad.addColorStop(0.5, 'rgba(248, 198, 98, 0.12)');
  rimGrad.addColorStop(1.0, 'rgba(255, 226, 150, 0.42)');
  cCtx.fillStyle = rimGrad;
  cCtx.fillRect(0, 0, size, size);

  // Emissive map: glowing golden inner body transitioning to warm honey membrane
  const emGrad = eCtx.createRadialGradient(
    rootX,
    rootY,
    size * 0.02,
    size * 0.52,
    kind === 'fore' ? size * 0.46 : size * 0.54,
    size * 0.92
  );
  emGrad.addColorStop(0.0, '#FFE89E');
  emGrad.addColorStop(0.26, '#DE8A2E');
  emGrad.addColorStop(0.68, '#874112');
  emGrad.addColorStop(1.0, '#9E541B');
  eCtx.fillStyle = emGrad;
  eCtx.fillRect(0, 0, size, size);

  // Alpha map: translucent silk wing interior (~0.68) with firmer edges & veins (~0.95)
  const alphaGrad = aCtx.createRadialGradient(
    rootX,
    rootY,
    size * 0.03,
    size * 0.56,
    kind === 'fore' ? size * 0.48 : size * 0.52,
    size * 0.95
  );
  alphaGrad.addColorStop(0.0, '#F5F5F5');
  alphaGrad.addColorStop(0.35, '#B2B2B2');
  alphaGrad.addColorStop(0.75, '#BEBEBE');
  alphaGrad.addColorStop(1.0, '#E8E8E8');
  aCtx.fillStyle = alphaGrad;
  aCtx.fillRect(0, 0, size, size);

  // Delicate curved anatomical wing veins fanning cleanly from root
  const veins =
    kind === 'fore'
      ? [
          [0.94, 0.05, 0.44, 0.24],
          [0.98, 0.2, 0.52, 0.36],
          [0.97, 0.38, 0.56, 0.48],
          [0.92, 0.56, 0.54, 0.62],
          [0.84, 0.72, 0.46, 0.75],
          [0.7, 0.86, 0.36, 0.85],
          [0.48, 0.95, 0.24, 0.91],
        ]
      : [
          [0.92, 0.12, 0.5, 0.14],
          [0.96, 0.34, 0.56, 0.25],
          [0.9, 0.58, 0.52, 0.39],
          [0.74, 0.8, 0.42, 0.54],
          [0.52, 0.94, 0.3, 0.66],
          [0.28, 0.84, 0.18, 0.56],
        ];

  veins.forEach(([tx, ty, cx, cy], i) => {
    const ex = tx * size;
    const ey = ty * size;
    const ctrlX = cx * size;
    const ctrlY = cy * size;

    // Subtle warm bronze shadow line for delicate relief without dark inkiness
    cCtx.beginPath();
    cCtx.moveTo(rootX, rootY);
    cCtx.quadraticCurveTo(ctrlX, ctrlY, ex, ey);
    cCtx.strokeStyle = 'rgba(110, 48, 12, 0.38)';
    cCtx.lineWidth = i < 2 ? 4.2 : 2.8;
    cCtx.lineCap = 'round';
    cCtx.stroke();

    // Fine glowing cream-gold inner vein filament
    cCtx.beginPath();
    cCtx.moveTo(rootX, rootY);
    cCtx.quadraticCurveTo(ctrlX, ctrlY, ex, ey);
    cCtx.strokeStyle = 'rgba(255, 232, 168, 0.72)';
    cCtx.lineWidth = i < 2 ? 2.2 : 1.4;
    cCtx.lineCap = 'round';
    cCtx.stroke();

    // Luminous vein glow in emissive map
    eCtx.beginPath();
    eCtx.moveTo(rootX, rootY);
    eCtx.quadraticCurveTo(ctrlX, ctrlY, ex, ey);
    eCtx.strokeStyle = 'rgba(255, 224, 145, 0.68)';
    eCtx.lineWidth = i < 2 ? 2.4 : 1.5;
    eCtx.lineCap = 'round';
    eCtx.stroke();

    // Higher opacity along each vein
    aCtx.beginPath();
    aCtx.moveTo(rootX, rootY);
    aCtx.quadraticCurveTo(ctrlX, ctrlY, ex, ey);
    aCtx.strokeStyle = '#FFFFFF';
    aCtx.lineWidth = i < 2 ? 4.5 : 3.0;
    aCtx.lineCap = 'round';
    aCtx.stroke();
  });

  // Soft outer rim glow frame around wing canvas edges
  const outerBorder = cCtx.createRadialGradient(
    size * 0.45,
    size * 0.5,
    size * 0.36,
    size * 0.5,
    size * 0.5,
    size * 0.75
  );
  outerBorder.addColorStop(0.0, 'rgba(255, 232, 175, 0)');
  outerBorder.addColorStop(0.85, 'rgba(255, 225, 155, 0.16)');
  outerBorder.addColorStop(1.0, 'rgba(255, 240, 198, 0.32)');
  cCtx.fillStyle = outerBorder;
  cCtx.fillRect(0, 0, size, size);

  const setupTex = (canvas, isSRGB) => {
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    tex.needsUpdate = true;
    return tex;
  };

  return {
    map: setupTex(colorCanvas, true),
    emissiveMap: setupTex(emissiveCanvas, true),
    alphaMap: setupTex(alphaCanvas, false),
  };
}

/**
 * Warm bright golden radial core glow sprite (firefly core & subtle atmospheric bloom).
 */
export function createRadialGlowTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0.0, 'rgba(255, 252, 230, 1.0)');
  g.addColorStop(0.18, 'rgba(255, 226, 130, 0.92)');
  g.addColorStop(0.45, 'rgba(245, 175, 65, 0.38)');
  g.addColorStop(0.76, 'rgba(168, 85, 247, 0.1)');
  g.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Rich royal-purple & plum nebula haze sprites matching the cosmic aura.
 */
export function createNebulaCloudTexture(variant = 0) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const palettes = [
    ['rgba(126, 48, 224, 0.36)', 'rgba(88, 28, 165, 0.22)', 'rgba(42, 12, 88, 0.08)'],
    ['rgba(155, 58, 235, 0.28)', 'rgba(107, 33, 168, 0.18)', 'rgba(56, 14, 102, 0.07)'],
    ['rgba(192, 92, 210, 0.24)', 'rgba(104, 38, 178, 0.16)', 'rgba(38, 10, 82, 0.06)'],
  ];
  const p = palettes[variant % palettes.length];

  const puffs = [
    [0.5, 0.5, 0.46, p[0]],
    [0.36, 0.44, 0.34, p[1]],
    [0.64, 0.54, 0.36, p[1]],
    [0.48, 0.62, 0.38, p[2]],
  ];

  puffs.forEach(([cx, cy, rad, col]) => {
    const gx = cx * size;
    const gy = cy * size;
    const gr = rad * size;
    const grad = ctx.createRadialGradient(gx, gy, gr * 0.05, gx, gy, gr);
    grad.addColorStop(0.0, col);
    grad.addColorStop(0.55, col.replace(/[\d.]+\)$/, '0.07)'));
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

/**
 * Silky soft rose-magenta & lavender flower petal alpha texture.
 */
export function createPetalTexture() {
  const w = 128;
  const h = 192;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, w, h);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(w * 0.5, h * 0.96);
  ctx.bezierCurveTo(w * 0.06, h * 0.72, w * 0.06, h * 0.2, w * 0.5, h * 0.04);
  ctx.bezierCurveTo(w * 0.94, h * 0.2, w * 0.94, h * 0.72, w * 0.5, h * 0.96);
  ctx.closePath();

  const grad = ctx.createLinearGradient(0, h * 0.04, 0, h * 0.96);
  grad.addColorStop(0.0, 'rgba(255, 224, 245, 0.94)');
  grad.addColorStop(0.45, 'rgba(232, 121, 249, 0.85)');
  grad.addColorStop(1.0, 'rgba(139, 92, 246, 0.72)');
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
