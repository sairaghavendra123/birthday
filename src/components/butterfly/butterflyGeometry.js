import * as THREE from 'three';

function createForewingShape() {
  const s = new THREE.Shape();
  s.moveTo(0.02, 0.12);
  s.bezierCurveTo(0.45, 0.72, 1.08, 1.32, 1.66, 1.24);
  s.bezierCurveTo(1.78, 1.2, 1.72, 0.85, 1.56, 0.52);
  s.bezierCurveTo(1.46, 0.32, 1.35, 0.12, 1.18, -0.05);
  s.bezierCurveTo(0.84, -0.18, 0.38, -0.16, 0.02, -0.08);
  s.closePath();
  return s;
}

function createHindwingShape() {
  const s = new THREE.Shape();
  s.moveTo(0.02, -0.02);
  s.bezierCurveTo(0.42, 0.04, 0.95, -0.04, 1.22, -0.22);
  s.bezierCurveTo(1.34, -0.34, 1.28, -0.62, 1.06, -0.86);
  // Scalloped outer contour into graceful swallowtail
  s.bezierCurveTo(0.94, -0.98, 0.84, -1.24, 0.72, -1.42);
  s.bezierCurveTo(0.64, -1.32, 0.62, -1.12, 0.52, -1.04);
  s.bezierCurveTo(0.36, -0.98, 0.16, -0.82, 0.06, -0.58);
  s.bezierCurveTo(0.01, -0.38, 0.01, -0.16, 0.02, -0.02);
  s.closePath();
  return s;
}

/**
 * Builds a cambered wing BufferGeometry with normalized UVs mapped cleanly to [0, 1]
 * and optional X-reflection with corrected winding so left & right wings light symmetrically.
 */
function buildWingGeometry(shape, mirrorX = false, camberAmount = 0.08) {
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

    // Sculpt smooth aerodynamic arch across wing span & gentle trailing tip curl
    const camber = Math.sin(u * Math.PI) * camberAmount - u * (1.0 - v) * 0.03;
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
 * Creates the full 3D anatomical Golden Butterfly rig with independently pivoted
 * forewings, hindwings, metallic chitin body, curved antennae, and wingtip emitter sockets.
 */
export function createButterflyRig({ foreMaps, hindMaps, glowTexture }) {
  const root = new THREE.Group();
  const bodyGroup = new THREE.Group();
  root.add(bodyGroup);

  const foreShape = createForewingShape();
  const hindShape = createHindwingShape();

  const foreMat = new THREE.MeshPhysicalMaterial({
    map: foreMaps.map,
    emissiveMap: foreMaps.emissiveMap,
    emissive: new THREE.Color('#FFCC55'),
    emissiveIntensity: 0.72,
    alphaMap: foreMaps.alphaMap,
    bumpMap: foreMaps.bumpMap,
    bumpScale: 0.015,
    transparent: true,
    opacity: 0.96,
    alphaTest: 0.06,
    side: THREE.DoubleSide,
    metalness: 0.42,
    roughness: 0.24,
    clearcoat: 0.65,
    clearcoatRoughness: 0.18,
    iridescence: 0.75,
    iridescenceIOR: 1.38,
  });

  const hindMat = new THREE.MeshPhysicalMaterial({
    map: hindMaps.map,
    emissiveMap: hindMaps.emissiveMap,
    emissive: new THREE.Color('#F5B841'),
    emissiveIntensity: 0.68,
    alphaMap: hindMaps.alphaMap,
    bumpMap: hindMaps.bumpMap,
    bumpScale: 0.015,
    transparent: true,
    opacity: 0.95,
    alphaTest: 0.06,
    side: THREE.DoubleSide,
    metalness: 0.42,
    roughness: 0.25,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
    iridescence: 0.8,
    iridescenceIOR: 1.4,
  });

  const rightForeGeo = buildWingGeometry(foreShape, false, 0.09);
  const leftForeGeo = buildWingGeometry(foreShape, true, 0.09);
  const rightHindGeo = buildWingGeometry(hindShape, false, 0.065);
  const leftHindGeo = buildWingGeometry(hindShape, true, 0.065);

  const rightForewingPivot = new THREE.Group();
  const leftForewingPivot = new THREE.Group();
  const rightHindwingPivot = new THREE.Group();
  const leftHindwingPivot = new THREE.Group();

  rightForewingPivot.position.set(0.035, 0.06, 0.01);
  leftForewingPivot.position.set(-0.035, 0.06, 0.01);
  rightHindwingPivot.position.set(0.03, -0.06, -0.01);
  leftHindwingPivot.position.set(-0.03, -0.06, -0.01);

  const rightForeMesh = new THREE.Mesh(rightForeGeo, foreMat);
  const leftForeMesh = new THREE.Mesh(leftForeGeo, foreMat);
  const rightHindMesh = new THREE.Mesh(rightHindGeo, hindMat);
  const leftHindMesh = new THREE.Mesh(leftHindGeo, hindMat);

  rightForeMesh.name = 'butterfly-part';
  leftForeMesh.name = 'butterfly-part';
  rightHindMesh.name = 'butterfly-part';
  leftHindMesh.name = 'butterfly-part';

  rightForewingPivot.add(rightForeMesh);
  leftForewingPivot.add(leftForeMesh);
  rightHindwingPivot.add(rightHindMesh);
  leftHindwingPivot.add(leftHindMesh);

  // Wingtip sockets for accurate world-space sparkle emission
  const rightTipSocket = new THREE.Object3D();
  rightTipSocket.position.set(1.58, 1.15, 0.04);
  rightForewingPivot.add(rightTipSocket);

  const leftTipSocket = new THREE.Object3D();
  leftTipSocket.position.set(-1.58, 1.15, 0.04);
  leftForewingPivot.add(leftTipSocket);

  const bodySocket = new THREE.Object3D();
  bodySocket.position.set(0, -0.45, 0);

  // Sculpted metallic thorax & tapered abdomen using LatheGeometry
  const bodyPoints = [
    new THREE.Vector2(0.001, -0.82),
    new THREE.Vector2(0.025, -0.68),
    new THREE.Vector2(0.046, -0.45),
    new THREE.Vector2(0.056, -0.22),
    new THREE.Vector2(0.038, -0.08),
    new THREE.Vector2(0.072, 0.08),
    new THREE.Vector2(0.078, 0.22),
    new THREE.Vector2(0.042, 0.34),
    new THREE.Vector2(0.055, 0.43),
    new THREE.Vector2(0.032, 0.49),
    new THREE.Vector2(0.001, 0.51),
  ];
  const bodyGeo = new THREE.LatheGeometry(bodyPoints, 20);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#8C5A1E'),
    emissive: new THREE.Color('#5A3408'),
    emissiveIntensity: 0.65,
    metalness: 0.82,
    roughness: 0.24,
  });
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  bodyMesh.name = 'butterfly-part';

  // Curved golden antennae with tiny club tips
  const antennaMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E8BD5B'),
    emissive: new THREE.Color('#C58F28'),
    emissiveIntensity: 0.6,
    metalness: 0.8,
    roughness: 0.2,
  });

  const antennaGeos = [];
  [-1, 1].forEach((dir) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(dir * 0.02, 0.48, 0.02),
      new THREE.Vector3(dir * 0.14, 0.72, 0.1),
      new THREE.Vector3(dir * 0.26, 0.94, 0.06),
      new THREE.Vector3(dir * 0.34, 1.0, -0.02),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 14, 0.009, 6, false);
    const tipGeo = new THREE.SphereGeometry(0.022, 8, 8);
    antennaGeos.push(tubeGeo, tipGeo);

    const tube = new THREE.Mesh(tubeGeo, antennaMat);
    const tip = new THREE.Mesh(tipGeo, antennaMat);
    tip.position.set(dir * 0.34, 1.0, -0.02);
    bodyGroup.add(tube, tip);
  });

  // Generous invisible hit sphere for effortless touch/mouse raycasting
  const hitGeo = new THREE.SphereGeometry(1.45, 12, 12);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const hitSphere = new THREE.Mesh(hitGeo, hitMat);
  hitSphere.name = 'butterfly-hit';

  // Soft warm additive aura sprite around butterfly heart
  const auraMat = new THREE.SpriteMaterial({
    map: glowTexture,
    color: new THREE.Color('#FFD97A'),
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const auraSprite = new THREE.Sprite(auraMat);
  auraSprite.scale.set(2.8, 2.8, 1);

  // Dynamic point light moving with butterfly
  const butterflyLight = new THREE.PointLight('#FFD06B', 3.4, 11, 1.6);
  butterflyLight.position.set(0, 0.1, 0.45);

  bodyGroup.add(
    bodyMesh,
    rightForewingPivot,
    leftForewingPivot,
    rightHindwingPivot,
    leftHindwingPivot,
    bodySocket,
    hitSphere,
    auraSprite,
    butterflyLight
  );

  // Tilt butterfly so its wings showcase gracefully in 3D perspective
  bodyGroup.rotation.x = -0.32;

  const clickableTargets = [
    rightForeMesh,
    leftForeMesh,
    rightHindMesh,
    leftHindMesh,
    bodyMesh,
    hitSphere,
  ];

  const dispose = () => {
    [
      rightForeGeo,
      leftForeGeo,
      rightHindGeo,
      leftHindGeo,
      bodyGeo,
      hitGeo,
      ...antennaGeos,
    ].forEach((g) => g.dispose());
    [foreMat, hindMat, bodyMat, antennaMat, hitMat, auraMat].forEach((m) => m.dispose());
  };

  return {
    root,
    bodyGroup,
    rightForewingPivot,
    leftForewingPivot,
    rightHindwingPivot,
    leftHindwingPivot,
    rightTipSocket,
    leftTipSocket,
    bodySocket,
    auraSprite,
    butterflyLight,
    foreMat,
    hindMat,
    clickableTargets,
    dispose,
  };
}

/**
 * Samples points uniformly across all 4 butterfly wings using triangle-area-weighted
 * barycentric interpolation so Scene 2 particles converge into the exact butterfly shape.
 */
export function sampleButterflyWingPoints(count) {
  const foreShape = createForewingShape();
  const hindShape = createHindwingShape();

  const geos = [
    buildWingGeometry(foreShape, false, 0.09),
    buildWingGeometry(foreShape, true, 0.09),
    buildWingGeometry(hindShape, false, 0.065),
    buildWingGeometry(hindShape, true, 0.065),
  ];

  const triangles = [];
  let totalArea = 0;

  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  const ab = new THREE.Vector3();
  const ac = new THREE.Vector3();
  const cross = new THREE.Vector3();

  // Dihedral resting tilt (~20 deg open angle) for dramatic Scene 2 formation pose
  const dihedral = 0.34;
  const tiltX = -0.32;

  geos.forEach((geo, wingIdx) => {
    const isLeft = wingIdx === 1 || wingIdx === 3;
    const sign = isLeft ? -1 : 1;
    const pos = geo.attributes.position;
    const index = geo.index ? geo.index.array : null;
    const triCount = index ? index.length / 3 : pos.count / 3;

    for (let i = 0; i < triCount; i++) {
      const i0 = index ? index[i * 3] : i * 3;
      const i1 = index ? index[i * 3 + 1] : i * 3 + 1;
      const i2 = index ? index[i * 3 + 2] : i * 3 + 2;

      a.fromBufferAttribute(pos, i0);
      b.fromBufferAttribute(pos, i1);
      c.fromBufferAttribute(pos, i2);

      // Apply wing dihedral around Y & resting pitch around X
      [a, b, c].forEach((v) => {
        const rx = v.x * Math.cos(dihedral * sign) + v.z * Math.sin(dihedral * sign);
        const rz = -v.x * Math.sin(dihedral * sign) + v.z * Math.cos(dihedral * sign);
        const ry = v.y * Math.cos(tiltX) - rz * Math.sin(tiltX);
        const fz = v.y * Math.sin(tiltX) + rz * Math.cos(tiltX);
        v.set(rx, ry, fz);
      });

      ab.subVectors(b, a);
      ac.subVectors(c, a);
      const area = cross.crossVectors(ab, ac).length() * 0.5;
      totalArea += area;
      triangles.push({ a: a.clone(), b: b.clone(), c: c.clone(), cumArea: totalArea });
    }
    geo.dispose();
  });

  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // 10% cluster right along the thorax spine
    if (i % 10 === 0) {
      const t = (i / count) * 1.3 - 0.72;
      positions[i * 3] = (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = t;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      continue;
    }

    const r = Math.random() * totalArea;
    let lo = 0;
    let hi = triangles.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (triangles[mid].cumArea < r) lo = mid + 1;
      else hi = mid;
    }

    const tri = triangles[lo];
    let u = Math.random();
    let v = Math.random();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const w = 1 - u - v;

    positions[i * 3] = tri.a.x * u + tri.b.x * v + tri.c.x * w;
    positions[i * 3 + 1] = tri.a.y * u + tri.b.y * v + tri.c.y * w;
    positions[i * 3 + 2] =
      tri.a.z * u + tri.b.z * v + tri.c.z * w + (Math.random() - 0.5) * 0.06;
  }

  return positions;
}

/**
 * Updates lifelike asymmetric butterfly wingbeats (brisk power downstroke + graceful upstroke,
 * hindwing lag, subtle conservation-of-momentum body bob, and glide intervals).
 */
export function updateButterflyWingbeat(rig, elapsed, { flapRate = 7.4, amplitude = 0.92, burst = 0 } = {}) {
  const phase = elapsed * flapRate;
  // Asymmetric sawtooth-smoothed sine wave: fast downstroke, lighter upstroke
  const primary = Math.sin(phase) + 0.22 * Math.sin(phase * 2.0 - 0.45);
  const hindWave = Math.sin(phase - 0.38) + 0.18 * Math.sin((phase - 0.38) * 2.0 - 0.4);

  const foreAngle = (0.14 + primary * 0.72) * amplitude + burst * Math.sin(elapsed * 22) * 0.35;
  const hindAngle = (0.1 + hindWave * 0.62) * amplitude + burst * Math.sin(elapsed * 22 - 0.4) * 0.25;

  rig.rightForewingPivot.rotation.y = -foreAngle;
  rig.leftForewingPivot.rotation.y = foreAngle;
  rig.rightHindwingPivot.rotation.y = -hindAngle;
  rig.leftHindwingPivot.rotation.y = hindAngle;

  // Gentle body bob opposite wing downstroke
  rig.bodyGroup.position.y = -primary * 0.055 * amplitude;

  // Aura pulse synced to wing power
  const pulse = 2.6 + primary * 0.28 + burst * 1.1;
  rig.auraSprite.scale.set(pulse, pulse, 1);
  rig.butterflyLight.intensity = 3.0 + Math.max(0, primary) * 0.9 + burst * 2.4;
}
