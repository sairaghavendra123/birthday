import * as THREE from 'three';

/**
 * Generates procedural high-resolution wing maps (diffuse color, emissive veins,
 * bump relief, and alpha translucency) so the 3D butterfly wings look luminous,
 * iridescent, and anatomically detailed without external texture requests.
 */
export function createButterflyWingMaps(kind = 'fore') {
  const size = 512;

  const colorCanvas = document.createElement('canvas');
  const emissiveCanvas = document.createElement('canvas');
  const alphaCanvas = document.createElement('canvas');
  const bumpCanvas = document.createElement('canvas');

  [colorCanvas, emissiveCanvas, alphaCanvas, bumpCanvas].forEach((c) => {
    c.width = size;
    c.height = size;
  });

  const cCtx = colorCanvas.getContext('2d');
  const eCtx = emissiveCanvas.getContext('2d');
  const aCtx = alphaCanvas.getContext('2d');
  const bCtx = bumpCanvas.getContext('2d');

  // Helper to configure base translucent fill across all UV space
  cCtx.clearRect(0, 0, size, size);
  eCtx.fillStyle = '#000000';
  eCtx.fillRect(0, 0, size, size);
  aCtx.fillStyle = '#000000';
  aCtx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#555555';
  bCtx.fillRect(0, 0, size, size);

  const originX = kind === 'fore' ? size * 0.05 : size * 0.06;
  const originY = kind === 'fore' ? size * 0.78 : size * 0.2;

  // Base golden-amber iridescent wash anchored near thoracic wing joint
  const baseGrad = cCtx.createRadialGradient(
    originX,
    originY,
    size * 0.04,
    size * 0.56,
    kind === 'fore' ? size * 0.42 : size * 0.58,
    size * 0.94
  );
  baseGrad.addColorStop(0.0, '#FFF8DC');
  baseGrad.addColorStop(0.22, '#F7D36A');
  baseGrad.addColorStop(0.55, '#DF9F32');
  baseGrad.addColorStop(0.82, '#8F4E17');
  baseGrad.addColorStop(1.0, '#2A120A');

  cCtx.fillStyle = baseGrad;
  cCtx.fillRect(0, 0, size, size);

  // Subtle violet-rose shimmer across outer wing tip for nebula harmony
  const iridGrad =
    kind === 'fore'
      ? cCtx.createLinearGradient(size * 0.2, size * 0.9, size * 0.98, size * 0.05)
      : cCtx.createLinearGradient(size * 0.15, size * 0.15, size * 0.92, size * 0.92);
  iridGrad.addColorStop(0.0, 'rgba(255, 240, 190, 0.0)');
  iridGrad.addColorStop(0.55, 'rgba(244, 114, 182, 0.14)');
  iridGrad.addColorStop(0.85, 'rgba(168, 85, 247, 0.22)');
  iridGrad.addColorStop(1.0, 'rgba(253, 224, 71, 0.28)');
  cCtx.fillStyle = iridGrad;
  cCtx.fillRect(0, 0, size, size);

  // Emissive core warmth fading outward
  const emGrad = eCtx.createRadialGradient(
    originX,
    originY,
    size * 0.03,
    size * 0.5,
    kind === 'fore' ? size * 0.45 : size * 0.55,
    size * 0.85
  );
  emGrad.addColorStop(0.0, '#FFE48A');
  emGrad.addColorStop(0.32, '#D49428');
  emGrad.addColorStop(0.72, '#5E320B');
  emGrad.addColorStop(1.0, '#140804');
  eCtx.fillStyle = emGrad;
  eCtx.fillRect(0, 0, size, size);

  // Translucent stained-glass wing membrane opacity (more opaque on veins & edges)
  const alphaGrad = aCtx.createRadialGradient(
    originX,
    originY,
    size * 0.05,
    size * 0.55,
    kind === 'fore' ? size * 0.46 : size * 0.54,
    size * 0.85
  );
  alphaGrad.addColorStop(0.0, '#FFFFFF');
  alphaGrad.addColorStop(0.55, '#DBDBDB');
  alphaGrad.addColorStop(0.85, '#EDEDED');
  alphaGrad.addColorStop(1.0, '#FAFAFA');
  aCtx.fillStyle = alphaGrad;
  aCtx.fillRect(0, 0, size, size);

  // Anatomical branching wing venation
  const veinTargets =
    kind === 'fore'
      ? [
          [0.95, 0.06, 0.45, 0.22],
          [0.98, 0.22, 0.55, 0.34],
          [0.96, 0.38, 0.58, 0.48],
          [0.92, 0.54, 0.55, 0.6],
          [0.86, 0.7, 0.48, 0.72],
          [0.74, 0.85, 0.4, 0.82],
          [0.54, 0.94, 0.28, 0.88],
        ]
      : [
          [0.94, 0.14, 0.52, 0.16],
          [0.97, 0.34, 0.58, 0.26],
          [0.91, 0.56, 0.54, 0.38],
          [0.78, 0.78, 0.46, 0.52],
          [0.58, 0.95, 0.36, 0.64],
          [0.34, 0.82, 0.22, 0.55],
          [0.18, 0.66, 0.12, 0.44],
        ];

  veinTargets.forEach(([tx, ty, cx, cy], idx) => {
    const endX = tx * size;
    const endY = ty * size;
    const ctrlX = cx * size;
    const ctrlY = cy * size;

    // Dark bronze outline vein on color map
    cCtx.beginPath();
    cCtx.moveTo(originX, originY);
    cCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    cCtx.strokeStyle = 'rgba(42, 20, 8, 0.82)';
    cCtx.lineWidth = idx < 2 ? 7 : 5;
    cCtx.lineCap = 'round';
    cCtx.stroke();

    // Inner bright metallic gold highlight along each vein
    cCtx.beginPath();
    cCtx.moveTo(originX, originY);
    cCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    cCtx.strokeStyle = 'rgba(255, 226, 128, 0.65)';
    cCtx.lineWidth = 2.2;
    cCtx.stroke();

    // Luminous vein glow on emissive map
    eCtx.beginPath();
    eCtx.moveTo(originX, originY);
    eCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    eCtx.strokeStyle = 'rgba(255, 210, 95, 0.85)';
    eCtx.lineWidth = 3.2;
    eCtx.stroke();

    // Solid veins on alpha map and raised ridges on bump map
    aCtx.beginPath();
    aCtx.moveTo(originX, originY);
    aCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    aCtx.strokeStyle = '#FFFFFF';
    aCtx.lineWidth = 6;
    aCtx.stroke();

    bCtx.beginPath();
    bCtx.moveTo(originX, originY);
    bCtx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
    bCtx.strokeStyle = '#EAEAEA';
    bCtx.lineWidth = 5;
    bCtx.stroke();
  });

  // Glowing golden wingtip scales and pearl dots along outer margin
  const pearlCount = 28;
  for (let i = 0; i < pearlCount; i++) {
    const t = i / (pearlCount - 1);
    const px = (0.76 + Math.sin(t * Math.PI) * 0.18) * size;
    const py = (0.08 + t * 0.84) * size;
    const r = 3.2 + Math.sin(t * Math.PI * 3) * 1.8;

    cCtx.beginPath();
    cCtx.arc(px, py, r, 0, Math.PI * 2);
    cCtx.fillStyle = 'rgba(255, 245, 200, 0.9)';
    cCtx.fill();

    eCtx.beginPath();
    eCtx.arc(px, py, r * 1.1, 0, Math.PI * 2);
    eCtx.fillStyle = 'rgba(255, 224, 125, 0.95)';
    eCtx.fill();
  }

  // Delicate golden stardust flecks across wing surface
  for (let i = 0; i < 160; i++) {
    const seedA = Math.sin(i * 12.9898) * 43758.5453;
    const seedB = Math.sin(i * 78.233) * 23421.631;
    const rx = (seedA - Math.floor(seedA)) * size;
    const ry = (seedB - Math.floor(seedB)) * size;
    const pr = 1 + ((i * 7) % 3);

    cCtx.beginPath();
    cCtx.arc(rx, ry, pr, 0, Math.PI * 2);
    cCtx.fillStyle = i % 4 === 0 ? 'rgba(255, 250, 220, 0.65)' : 'rgba(253, 214, 110, 0.45)';
    cCtx.fill();

    if (i % 2 === 0) {
      eCtx.beginPath();
      eCtx.arc(rx, ry, pr * 1.2, 0, Math.PI * 2);
      eCtx.fillStyle = 'rgba(255, 216, 100, 0.7)';
      eCtx.fill();
    }
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 4;

  const emissiveMap = new THREE.CanvasTexture(emissiveCanvas);
  emissiveMap.colorSpace = THREE.SRGBColorSpace;

  const alphaMap = new THREE.CanvasTexture(alphaCanvas);
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);

  return { map, emissiveMap, alphaMap, bumpMap };
}

/**
 * Soft glowing particle sprite used for bokeh gold trails and starlight bursts.
 */
export function createRadialGlowTexture(
  innerColor = 'rgba(255, 252, 225, 1)',
  midColor = 'rgba(245, 196, 81, 0.65)',
  outerColor = 'rgba(197, 160, 89, 0)'
) {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );
  grad.addColorStop(0.0, innerColor);
  grad.addColorStop(0.28, midColor);
  grad.addColorStop(0.68, outerColor);
  grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Multi-lobed procedural purple/magenta nebula cloud sprite.
 */
export function createNebulaCloudTexture(variant = 0) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const palettes = [
    ['rgba(168, 85, 247, 0.42)', 'rgba(91, 33, 182, 0.24)', 'rgba(20, 6, 46, 0)'],
    ['rgba(217, 70, 239, 0.34)', 'rgba(109, 40, 217, 0.22)', 'rgba(15, 5, 36, 0)'],
    ['rgba(245, 158, 11, 0.22)', 'rgba(126, 34, 206, 0.26)', 'rgba(12, 4, 28, 0)'],
  ];
  const [c1, c2, c3] = palettes[variant % palettes.length];

  const lobes = 7;
  for (let i = 0; i < lobes; i++) {
    const angle = (i / lobes) * Math.PI * 2 + variant * 1.1;
    const dist = i === 0 ? 0 : size * (0.12 + ((i * 17) % 10) * 0.012);
    const cx = size * 0.5 + Math.cos(angle) * dist;
    const cy = size * 0.5 + Math.sin(angle) * dist;
    const radius = size * (0.28 + ((i * 13) % 7) * 0.025);

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0.0, c1);
    grad.addColorStop(0.45, c2);
    grad.addColorStop(1.0, c3);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Delicate flower petal gradient texture used on curved 3D instanced petals.
 */
export function createPetalTexture() {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.94);
  ctx.bezierCurveTo(size * 0.12, size * 0.72, size * 0.06, size * 0.28, size * 0.5, size * 0.06);
  ctx.bezierCurveTo(size * 0.94, size * 0.28, size * 0.88, size * 0.72, size * 0.5, size * 0.94);
  ctx.closePath();

  const grad = ctx.createLinearGradient(size * 0.5, size * 0.06, size * 0.5, size * 0.94);
  grad.addColorStop(0.0, '#FFFFFF');
  grad.addColorStop(0.55, '#F5ECFF');
  grad.addColorStop(1.0, '#D8C4F0');
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle central vein
  ctx.beginPath();
  ctx.moveTo(size * 0.5, size * 0.9);
  ctx.lineTo(size * 0.5, size * 0.16);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
