import * as THREE from 'three';

function createForewingShape() {
  const s = new THREE.Shape();
  s.moveTo(0.015, 0.08);
  // Sweeping upper costal edge to graceful rounded apex
  s.bezierCurveTo(0.42, 0.66, 1.04, 1.24, 1.6, 1.18);
  s.bezierCurveTo(1.74, 1.14, 1.72, 0.82, 1.56, 0.48);
  // Smooth outer margin curving inward cleanly toward body waist
  s.bezierCurveTo(1.44, 0.24, 1.28, 0.04, 1.06, -0.06);
  s.bezierCurveTo(0.72, -0.16, 0.34, -0.14, 0.015, -0.06);
  s.closePath();
  return s;
}

function createHindwingShape() {
  const s = new THREE.Shape();
  s.moveTo(0.015, -0.02);
  // Tucked cleanly below forewing with smooth rounded teardrop contour
  s.bezierCurveTo(0.38, 0.04, 0.88, -0.04, 1.12, -0.2);
  s.bezierCurveTo(1.24, -0.34, 1.18, -0.66, 0.92, -0.88);
  s.bezierCurveTo(0.68, -1.06, 0.34, -1.02, 0.14, -0.74);
  s.bezierCurveTo(0.03, -0.52, 0.01, -0.26, 0.015, -0.02);
  s.closePath();
  return s;
}

/**
 * Converts a 2D Bezier wing Shape into a subtly cambered 3D BufferGeometry with clean [0, 1] UVs
 * and optional X-reflection with fixed face winding so left and right wings light symmetrically.
 */
function buildWingGeometry(shape, mirrorX = false, camberAmount = 0.065) {
  const geo = new THREE.ShapeGeometry(shape, 36);
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const spanX = Math.max(0.0001, bb.max.x - bb.min.x);
  const spanY = Math.max(0.0001, bb.max.y - bb.min.y);

  const posAttr = geo.attributes.position;
  const uvAttr = geo.attributes.uv;

  for (let i = 0; i < posAttr.count; i++) {
    const rawX = posAttr.getX(i);
    const rawY = posAttr.getY(i);

    const u = (rawX - bb.min.x) / spanX;
    const v = (rawY - bb.min.y) / spanY;
    uvAttr.setXY(i, u, v);

    const camber = Math.sin(u * Math.PI) * camberAmount;
    const xOut = mirrorX ? -rawX : rawX;
    posAttr.setXYZ(i, xOut, rawY, camber);
  }

  if (mirrorX && geo.index) {
    const idx = geo.index.array;
    for (let i = 0; i < idx.length; i += 3) {
      const tmp = idx[i + 1];
      idx[i + 1] = idx[i + 2];
      idx[i + 2] = tmp;
    }
    geo.index.needsUpdate = true;
  }

  posAttr.needsUpdate = true;
  uvAttr.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/**
 * Creates the ethereal translucent amber-gold 3D butterfly rig with a glowing firefly core,
 * delicate curved antennae, and wingtip particle emitter sockets.
 */
export function createButterflyRig({ foreMaps, hindMaps, glowTexture }) {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const foreShape = createForewingShape();
  const hindShape = createHindwingShape();

  const foreMat = new THREE.MeshStandardMaterial({
    map: foreMaps.map,
    emissiveMap: foreMaps.emissiveMap,
    emissive: new THREE.Color('#F5A638'),
    emissiveIntensity: 0.85,
    alphaMap: foreMaps.alphaMap,
    transparent: true,
    opacity: 0.9,
    alphaTest: 0.03,
    side: THREE.DoubleSide,
    roughness: 0.34,
    metalness: 0.14,
  });

  const hindMat = new THREE.MeshStandardMaterial({
    map: hindMaps.map,
    emissiveMap: hindMaps.emissiveMap,
    emissive: new THREE.Color('#E89328'),
    emissiveIntensity: 0.78,
    alphaMap: hindMaps.alphaMap,
    transparent: true,
    opacity: 0.88,
    alphaTest: 0.03,
    side: THREE.DoubleSide,
    roughness: 0.36,
    metalness: 0.14,
  });

  const rightForeGeo = buildWingGeometry(foreShape, false, 0.065);
  const leftForeGeo = buildWingGeometry(foreShape, true, 0.065);
  const rightHindGeo = buildWingGeometry(hindShape, false, 0.048);
  const leftHindGeo = buildWingGeometry(hindShape, true, 0.048);

  const rightForewingPivot = new THREE.Group();
  const leftForewingPivot = new THREE.Group();
  const rightHindwingPivot = new THREE.Group();
  const leftHindwingPivot = new THREE.Group();

  // Offset hindwing slightly behind forewing to avoid coplanar overlap shimmer
  rightHindwingPivot.position.z = -0.018;
  leftHindwingPivot.position.z = -0.018;

  const rightForeMesh = new THREE.Mesh(rightForeGeo, foreMat);
  const leftForeMesh = new THREE.Mesh(leftForeGeo, foreMat);
  const rightHindMesh = new THREE.Mesh(rightHindGeo, hindMat);
  const leftHindMesh = new THREE.Mesh(leftHindGeo, hindMat);

  rightForewingPivot.add(rightForeMesh);
  leftForewingPivot.add(leftForeMesh);
  rightHindwingPivot.add(rightHindMesh);
  leftHindwingPivot.add(leftHindMesh);

  bodyGroup.add(
    rightForewingPivot,
    leftForewingPivot,
    rightHindwingPivot,
    leftHindwingPivot
  );

  // Wingtip emitter sockets for sweeping fairy-dust trails
  const leftTipSocket = new THREE.Object3D();
  leftTipSocket.position.set(-1.32, 0.78, 0.05);
  leftForewingPivot.add(leftTipSocket);

  const rightTipSocket = new THREE.Object3D();
  rightTipSocket.position.set(1.32, 0.78, 0.05);
  rightForewingPivot.add(rightTipSocket);

  const leftHindSocket = new THREE.Object3D();
  leftHindSocket.position.set(-0.92, -0.45, 0.04);
  leftHindwingPivot.add(leftHindSocket);

  const rightHindSocket = new THREE.Object3D();
  rightHindSocket.position.set(0.92, -0.45, 0.04);
  rightHindwingPivot.add(rightHindSocket);

  // Slender dark-amber body (thorax, tapered abdomen, head, golden antennae)
  const bodyMat = new THREE.MeshStandardMaterial({
    color: '#3A1C0A',
    emissive: '#8A4814',
    emissiveIntensity: 0.45,
    roughness: 0.35,
    metalness: 0.4,
  });

  const thorax = new THREE.Mesh(new THREE.CapsuleGeometry(0.052, 0.2, 6, 12), bodyMat);
  thorax.position.set(0, 0.04, 0.03);
  bodyGroup.add(thorax);

  const abdomen = new THREE.Mesh(new THREE.CapsuleGeometry(0.038, 0.48, 6, 12), bodyMat);
  abdomen.position.set(0, -0.34, 0.015);
  bodyGroup.add(abdomen);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 12), bodyMat);
  head.position.set(0, 0.25, 0.045);
  bodyGroup.add(head);

  // Signature warm bright yellow-white core glow near waist/abdomen
  const coreGlowMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: '#FFF6BA',
    transparent: true,
    opacity: 0.96,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const coreGlowSprite = new THREE.Sprite(coreGlowMat);
  coreGlowSprite.position.set(0, -0.22, 0.08);
  coreGlowSprite.scale.set(0.75, 0.75, 1);
  bodyGroup.add(coreGlowSprite);

  const softAuraMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: '#F5B841',
    transparent: true,
    opacity: 0.42,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const softAuraSprite = new THREE.Sprite(softAuraMat);
  softAuraSprite.position.set(0, 0.02, -0.08);
  softAuraSprite.scale.set(3.1, 2.5, 1);
  bodyGroup.add(softAuraSprite);

  const antennaMat = new THREE.MeshBasicMaterial({ color: '#FFE499' });
  const buildAntenna = (side) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(side * 0.018, 0.28, 0.055),
      new THREE.Vector3(side * 0.08, 0.46, 0.09),
      new THREE.Vector3(side * 0.21, 0.62, 0.05),
      new THREE.Vector3(side * 0.29, 0.67, 0.01),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 14, 0.0075, 6, false);
    const mesh = new THREE.Mesh(tubeGeo, antennaMat);
    bodyGroup.add(mesh);
    return tubeGeo;
  };
  const leftAntGeo = buildAntenna(-1);
  const rightAntGeo = buildAntenna(1);

  const bodySocket = new THREE.Object3D();
  bodySocket.position.set(0, -0.28, 0.04);
  bodyGroup.add(bodySocket);

  const clickableTargets = [
    rightForeMesh,
    leftForeMesh,
    rightHindMesh,
    leftHindMesh,
    thorax,
    abdomen,
  ];

  const dispose = () => {
    [
      rightForeGeo,
      leftForeGeo,
      rightHindGeo,
      leftHindGeo,
      thorax.geometry,
      abdomen.geometry,
      head.geometry,
      leftAntGeo,
      rightAntGeo,
    ].forEach((g) => g.dispose());

    [foreMat, hindMat, bodyMat, antennaMat, coreGlowMat, softAuraMat].forEach((m) => m.dispose());
    [
      foreMaps.map,
      foreMaps.emissiveMap,
      foreMaps.alphaMap,
      hindMaps.map,
      hindMaps.emissiveMap,
      hindMaps.alphaMap,
      glowTexture,
    ].forEach((t) => t.dispose());
  };

  return {
    root,
    bodyGroup,
    rightForewingPivot,
    leftForewingPivot,
    rightHindwingPivot,
    leftHindwingPivot,
    leftTipSocket,
    rightTipSocket,
    leftHindSocket,
    rightHindSocket,
    bodySocket,
    coreGlowSprite,
    clickableTargets,
    dispose,
  };
}

/**
 * Samples target points across the forewing and hindwing silhouettes for Scene 2 particle coalescence.
 */
export function sampleButterflyWingPoints(count) {
  const foreShape = createForewingShape();
  const hindShape = createHindwingShape();
  const foreGeo = new THREE.ShapeGeometry(foreShape, 18);
  const hindGeo = new THREE.ShapeGeometry(hindShape, 18);

  const extractTriangles = (geo, mirror) => {
    const pos = geo.attributes.position;
    const idx = geo.index ? geo.index.array : null;
    const tris = [];
    const triCount = idx ? idx.length / 3 : pos.count / 3;
    for (let i = 0; i < triCount; i++) {
      const a = idx ? idx[i * 3] : i * 3;
      const b = idx ? idx[i * 3 + 1] : i * 3 + 1;
      const c = idx ? idx[i * 3 + 2] : i * 3 + 2;
      const va = new THREE.Vector3((mirror ? -1 : 1) * pos.getX(a), pos.getY(a), pos.getZ(a));
      const vb = new THREE.Vector3((mirror ? -1 : 1) * pos.getX(b), pos.getY(b), pos.getZ(b));
      const vc = new THREE.Vector3((mirror ? -1 : 1) * pos.getX(c), pos.getY(c), pos.getZ(c));
      const area = new THREE.Vector3().subVectors(vb, va).cross(new THREE.Vector3().subVectors(vc, va)).length() * 0.5;
      tris.push({ va, vb, vc, area });
    }
    return tris;
  };

  const allTris = [
    ...extractTriangles(foreGeo, false),
    ...extractTriangles(foreGeo, true),
    ...extractTriangles(hindGeo, false),
    ...extractTriangles(hindGeo, true),
  ];

  foreGeo.dispose();
  hindGeo.dispose();

  const totalArea = allTris.reduce((sum, t) => sum + t.area, 0) || 1;
  const targets = new Float32Array(count * 3);

  const pickTriangle = () => {
    let r = Math.random() * totalArea;
    for (let i = 0; i < allTris.length; i++) {
      r -= allTris[i].area;
      if (r <= 0) return allTris[i];
    }
    return allTris[0];
  };

  const scale = 0.92;
  for (let i = 0; i < count; i++) {
    const tri = pickTriangle();
    let r1 = Math.random();
    let r2 = Math.random();
    if (r1 + r2 > 1) {
      r1 = 1 - r1;
      r2 = 1 - r2;
    }
    const r0 = 1 - r1 - r2;
    targets[i * 3] = (tri.va.x * r0 + tri.vb.x * r1 + tri.vc.x * r2) * scale;
    targets[i * 3 + 1] = ((tri.va.y * r0 + tri.vb.y * r1 + tri.vc.y * r2) + 0.15) * scale;
    targets[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
  }

  return targets;
}

/**
 * Updates realistic asymmetric sinusoidal wingbeat with graceful hindwing phase lag.
 */
export function updateButterflyWingbeat(rig, elapsed, { flapRate = 6.5, amplitude = 0.85, burst = 0 } = {}) {
  const rate = flapRate + burst * 5.2;
  const phase = elapsed * rate;

  // Smooth winged dihedral arc (sweeping open flat toward camera, folding slightly backward)
  const foreAngle = Math.sin(phase) * amplitude * 0.56 + 0.24;
  const hindAngle = Math.sin(phase - 0.26) * amplitude * 0.48 + 0.2;

  rig.rightForewingPivot.rotation.y = -foreAngle;
  rig.leftForewingPivot.rotation.y = foreAngle;

  rig.rightHindwingPivot.rotation.y = -hindAngle;
  rig.leftHindwingPivot.rotation.y = hindAngle;

  rig.rightForewingPivot.rotation.x = Math.cos(phase) * 0.08;
  rig.leftForewingPivot.rotation.x = Math.cos(phase) * 0.08;

  // Subtle vertical body bob synced to downstroke
  rig.bodyGroup.position.y = Math.sin(phase - 0.5) * 0.032;
}
