import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { Sparkles, RotateCcw, ArrowRight, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { birthdayConfig } from '../config/birthday.config';
import { soundFx } from '../hooks/useSoundEffects';
import {
  createButterflyWingMaps,
  createRadialGlowTexture,
  createNebulaCloudTexture,
  createPetalTexture,
} from './butterfly/butterflyTextures';
import {
  createButterflyRig,
  sampleButterflyWingPoints,
  updateButterflyWingbeat,
} from './butterfly/butterflyGeometry';
import {
  createStarfieldMaterial,
  createMorphSwarmMaterial,
  createTrailBurstMaterial,
  createMirrorVignetteMaterial,
  createPhotoHaloMaterial,
} from './butterfly/cosmicShaders';

// Timeline timestamps (seconds) aligned cleanly with the 6 cinematic scenes
const SCENE_TIMES = {
  UNIVERSE_END: 3.6,
  BORN_MORPH_START: 3.8,
  BORN_MORPH_END: 6.4,
  BORN_END: 7.6,
  JOURNEY_END: 10.6,
  MEMORIES_START: 10.6,
  MEMORIES_END: 18.0,
  NAME_REVEAL: 18.2,
  INTERACTIVE_READY: 21.6,
};

function clamp01(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function easeOutCubic(t) {
  const x = clamp01(t);
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(t) {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/**
 * Checks whether browser supports hardware-accelerated or software WebGL rendering.
 */
function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Builds deduplicated site photography arrays directly from birthdayConfig without
 * modifying any existing asset paths.
 */
function collectSiteMemories() {
  const featured = [
    {
      src: birthdayConfig.intro?.heroImage || '/photos/hero/davani_saree_portrait.jpg',
      caption: 'Where every story began — grace, warmth, and an unforgettable smile.',
      tag: 'Opening Chapter',
    },
    {
      src: '/photos/gorgeous/dhathri_fiery_gold_saree.jpg',
      caption: 'Radiant in gold — effortless poise that brightens every room.',
      tag: 'Pure Radiance',
    },
    {
      src: '/photos/montage/davani_lehenga_garden.jpg',
      caption: 'Blooming with grace, outshining every flower behind her.',
      tag: 'Memory Journey',
    },
    {
      src: '/photos/montage/dhathri_classroom_smile.jpg',
      caption: 'Even on ordinary college days, her smile makes everything lighter.',
      tag: 'Everyday Magic',
    },
    {
      src: '/photos/gorgeous/dhathri_ceremony_pink_saree.jpg',
      caption: 'Timeless elegance and calm confidence in every frame.',
      tag: 'Timeless Grace',
    },
    {
      src: '/photos/finale/dhathri_celebration_portrait.png',
      caption: 'Birthday Queen energy — surrounded by warmth and golden wishes.',
      tag: 'Birthday Finale',
    },
  ];

  // Hydrate featured captions from birthdayConfig when matching source exists
  const configLookup = new Map();
  const addLookup = (src, caption, tag) => {
    if (!src || configLookup.has(src)) return;
    configLookup.set(src, { src, caption: caption || '', tag: tag || 'Precious Memory' });
  };

  addLookup(birthdayConfig.intro?.heroImage, 'Timeless childhood sweetness and pure joy.', 'Archive');
  birthdayConfig.montage?.forEach((m) => addLookup(m.photo, m.caption, 'Memory Journey'));
  birthdayConfig.gorgeousTribute?.cards?.forEach((c) => addLookup(c.photo, c.note || c.title, c.tag));
  birthdayConfig.timeline?.forEach((t) => addLookup(t.photo, t.story || t.title, t.era));
  birthdayConfig.filmStrip?.forEach((f) => addLookup(f.photo, f.note, 'Film Strip'));
  birthdayConfig.gallery?.forEach((g) => addLookup(g.src, g.caption, g.tag));

  const hydratedFeatured = featured.map((item) => {
    const match = configLookup.get(item.src);
    return match
      ? { src: item.src, caption: match.caption || item.caption, tag: match.tag || item.tag }
      : item;
  });

  // Collect all unique existing memories for interactive butterfly clicks
  const allSeen = new Set();
  const allMemories = [];
  const pushUnique = (entry) => {
    if (!entry?.src || allSeen.has(entry.src)) return;
    allSeen.add(entry.src);
    allMemories.push(entry);
  };

  hydratedFeatured.forEach(pushUnique);
  configLookup.forEach((val) => pushUnique(val));

  return { journeyMemories: hydratedFeatured, allMemories };
}

export default function ButterflyEffectIntro({ onComplete, onStartMusic }) {
  const containerRef = useRef(null);
  const { journeyMemories, allMemories } = useMemo(() => collectSiteMemories(), []);

  const [scenePhase, setScenePhase] = useState(1); // 1..6
  const [replaySeed, setReplaySeed] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [useFallback] = useState(() => {
    if (typeof window === 'undefined') return true;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    return Boolean(reduced || !supportsWebGL());
  });

  // Refs for synchronizing DOM spotlight state with Three.js render loop cleanly
  const phaseRef = useRef(1);
  const nextTapIdxRef = useRef(0);
  const clockOverrideRef = useRef({ skipToFinale: false });
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = spotlightIndex !== null;
  }, [spotlightIndex]);

  const handleExploreUniverse = useCallback(() => {
    if (isExiting) return;
    soundFx.playClick();
    soundFx.playCelebration();
    if (typeof onStartMusic === 'function') {
      onStartMusic();
    }
    setIsExiting(true);
    setTimeout(() => {
      onComplete?.();
    }, 800);
  }, [isExiting, onComplete, onStartMusic]);

  const handleReplay = useCallback(() => {
    soundFx.playClick();
    soundFx.playHarmonicChime();
    setSpotlightIndex(null);
    setHasInteracted(false);
    phaseRef.current = 1;
    setScenePhase(1);
    clockOverrideRef.current = { skipToFinale: false };
    setReplaySeed((prev) => prev + 1);
  }, []);

  const handleSkipToReveal = useCallback(() => {
    soundFx.playClick();
    clockOverrideRef.current.skipToFinale = true;
    phaseRef.current = 6;
    setScenePhase(6);
  }, []);

  const openNextButterflyMemory = useCallback(() => {
    setHasInteracted(true);
    const idx = nextTapIdxRef.current % allMemories.length;
    nextTapIdxRef.current += 1;
    setSpotlightIndex(idx);
  }, [allMemories.length]);

  useEffect(() => {
    if (useFallback) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let animFrameId = 0;
    let isDisposed = false;

    const width = Math.max(container.clientWidth, window.innerWidth || 375);
    const height = Math.max(container.clientHeight, window.innerHeight || 667);
    const aspect = width / height;
    const isNarrow = width < 768;
    const lowHardware = (navigator.hardwareConcurrency || 8) <= 4;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, isNarrow ? 1.75 : 2);

    // 1. WebGLRenderer setup with filmic HDR curve
    const renderer = new THREE.WebGLRenderer({
      antialias: !lowHardware,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Cosmic Midnight Purple & Black Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#04010A');
    scene.fog = new THREE.FogExp2('#0B0319', 0.022);

    const camera = new THREE.PerspectiveCamera(isNarrow ? 58 : 48, aspect, 0.1, 160);
    const baseCamZ = isNarrow ? 15.8 : 11.8;
    camera.position.set(0, 0.4, baseCamZ);
    camera.lookAt(0, 0.2, 0);

    // 3. Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight('#4C1D95', 1.1);
    const keyLight = new THREE.DirectionalLight('#FFE299', 2.1);
    keyLight.position.set(5, 8, 9);
    const rimLight = new THREE.DirectionalLight('#C084FC', 1.8);
    rimLight.position.set(-7, 4, -5);
    scene.add(ambientLight, keyLight, rimLight);

    // 4. Procedural Textures
    const foreMaps = createButterflyWingMaps('fore');
    const hindMaps = createButterflyWingMaps('hind');
    const glowTex = createRadialGlowTexture();
    const petalTex = createPetalTexture();
    const nebulaTexList = [
      createNebulaCloudTexture(0),
      createNebulaCloudTexture(1),
      createNebulaCloudTexture(2),
    ];

    // 5. Realistic Twinkling Starfield
    const starCount = isNarrow || lowHardware ? 1150 : 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starPhases = new Float32Array(starCount);
    const starSpeeds = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    const starPalette = [
      new THREE.Color('#FFF8E7'),
      new THREE.Color('#E9D5FF'),
      new THREE.Color('#FDE68A'),
      new THREE.Color('#C4B5FD'),
      new THREE.Color('#FBCFE8'),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 68;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.78 - 3.0;
      starPos[i * 3 + 2] = -Math.abs(r * Math.sin(phi) * Math.sin(theta)) * 0.8 + 8.0;

      starSizes[i] = 0.65 + Math.random() * 2.1;
      starPhases[i] = Math.random() * Math.PI * 2;
      starSpeeds[i] = 0.8 + Math.random() * 2.4;

      const c = starPalette[i % starPalette.length];
      starColors[i * 3] = c.r;
      starColors[i * 3 + 1] = c.g;
      starColors[i * 3 + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhases, 1));
    starGeo.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeeds, 1));
    starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));

    const starMat = createStarfieldMaterial();
    starMat.uniforms.uPixelRatio.value = pixelRatio;
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Layered Purple Nebula Clouds
    const nebulaGroup = new THREE.Group();
    const nebulaMats = [];
    const nebulaData = [
      { x: -5.5, y: 2.8, z: -16, scale: 18, variant: 0, speed: 0.08 },
      { x: 5.8, y: 1.5, z: -19, scale: 20, variant: 1, speed: -0.06 },
      { x: 0.0, y: 3.6, z: -23, scale: 25, variant: 0, speed: 0.04 },
      { x: -3.2, y: -0.5, z: -12, scale: 14, variant: 2, speed: 0.1 },
      { x: 4.0, y: -0.2, z: -13, scale: 15, variant: 1, speed: -0.09 },
    ];
    nebulaData.forEach((n) => {
      const mat = new THREE.SpriteMaterial({
        map: nebulaTexList[n.variant],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      nebulaMats.push({ mat, targetOpacity: 0.55 });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(n.x, n.y, n.z);
      sprite.scale.set(n.scale, n.scale * 0.72, 1);
      sprite.userData.driftSpeed = n.speed;
      sprite.userData.baseX = n.x;
      sprite.userData.baseY = n.y;
      nebulaGroup.add(sprite);
    });
    scene.add(nebulaGroup);

    // 7. Obsidian Mirror Floor Reflection + Cosmic Ripple Overlay
    const mirrorGeo = new THREE.CircleGeometry(28, 48);
    let mirrorReflector = null;
    try {
      mirrorReflector = new Reflector(mirrorGeo, {
        clipBias: 0.003,
        textureWidth: isNarrow ? 384 : 512,
        textureHeight: isNarrow ? 384 : 512,
        color: 0x2a1448,
        multisample: isNarrow || lowHardware ? 0 : 2,
      });
      mirrorReflector.rotation.x = -Math.PI / 2;
      mirrorReflector.position.y = -3.75;
      scene.add(mirrorReflector);
    } catch {
      mirrorReflector = null;
    }

    const overlayGeo = new THREE.CircleGeometry(28.2, 48);
    const mirrorVignetteMat = createMirrorVignetteMaterial();
    const mirrorOverlay = new THREE.Mesh(overlayGeo, mirrorVignetteMat);
    mirrorOverlay.rotation.x = -Math.PI / 2;
    mirrorOverlay.position.y = -3.73;
    scene.add(mirrorOverlay);

    // 8. Floating 3D Pink & Purple Flower Petals (InstancedMesh)
    const petalCount = isNarrow || lowHardware ? 32 : 64;
    const petalGeo = new THREE.PlaneGeometry(0.24, 0.34, 4, 4);
    // Curve petal slightly for 3D silk volume
    const pAttr = petalGeo.attributes.position;
    for (let i = 0; i < pAttr.count; i++) {
      const px = pAttr.getX(i);
      const py = pAttr.getY(i);
      pAttr.setZ(i, Math.sin(py * 6.0) * 0.035 - px * px * 0.45);
    }
    pAttr.needsUpdate = true;
    petalGeo.computeVertexNormals();

    const petalMat = new THREE.MeshStandardMaterial({
      map: petalTex,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
      roughness: 0.45,
      metalness: 0.1,
      emissive: new THREE.Color('#7E22CE'),
      emissiveIntensity: 0.28,
    });

    const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
    const petalStates = [];
    const petalColors = [
      new THREE.Color('#F9A8D4'),
      new THREE.Color('#F472B6'),
      new THREE.Color('#C084FC'),
      new THREE.Color('#A855F7'),
    ];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < petalCount; i++) {
      petalStates.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.3) * 11,
        z: (Math.random() - 0.5) * 12 - 2,
        fallSpeed: 0.25 + Math.random() * 0.45,
        swayFreq: 0.6 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.2,
        rotSpeedY: (Math.random() - 0.5) * 1.4,
        scale: 0.65 + Math.random() * 0.85,
      });
      petalMesh.setColorAt(i, petalColors[i % petalColors.length]);
    }
    if (petalMesh.instanceColor) petalMesh.instanceColor.needsUpdate = true;
    petalMat.opacity = 0;
    scene.add(petalMesh);

    // 9. Realistic 3D Golden Butterfly Rig
    const butterflyRig = createButterflyRig({ foreMaps, hindMaps, glowTexture: glowTex });
    butterflyRig.root.scale.setScalar(0.001);
    butterflyRig.root.visible = false;
    scene.add(butterflyRig.root);

    // 10. Scene 2 Morphing Golden Particle Swarm (Assembles into exact Butterfly silhouette!)
    const swarmCount = isNarrow || lowHardware ? 1050 : 2100;
    const swarmTarget = sampleButterflyWingPoints(swarmCount);
    const swarmStart = new Float32Array(swarmCount * 3);
    const swarmSeeds = new Float32Array(swarmCount);
    const swarmSizes = new Float32Array(swarmCount);

    for (let i = 0; i < swarmCount; i++) {
      const radius = 3.2 + Math.random() * 9.5;
      const ang = Math.random() * Math.PI * 2;
      swarmStart[i * 3] = Math.cos(ang) * radius * (isNarrow ? 0.68 : 1.1);
      swarmStart[i * 3 + 1] = (Math.random() - 0.5) * 7.5;
      swarmStart[i * 3 + 2] = (Math.random() - 0.5) * 7.5 - 1.0;
      swarmSeeds[i] = Math.random();
      swarmSizes[i] = 0.85 + Math.random() * 2.2;
    }

    const swarmGeo = new THREE.BufferGeometry();
    swarmGeo.setAttribute('position', new THREE.BufferAttribute(swarmStart, 3));
    swarmGeo.setAttribute('aTarget', new THREE.BufferAttribute(swarmTarget, 3));
    swarmGeo.setAttribute('aSeed', new THREE.BufferAttribute(swarmSeeds, 1));
    swarmGeo.setAttribute('aSize', new THREE.BufferAttribute(swarmSizes, 1));

    const swarmMat = createMorphSwarmMaterial();
    swarmMat.uniforms.uPixelRatio.value = pixelRatio;
    const swarmPoints = new THREE.Points(swarmGeo, swarmMat);
    scene.add(swarmPoints);

    // 11. Continuous Golden Trail & Interactive Burst Particle Pool
    const trailPoolSize = isNarrow || lowHardware ? 450 : 850;
    const trailPositions = new Float32Array(trailPoolSize * 3);
    const trailVelocities = new Float32Array(trailPoolSize * 3);
    const trailLives = new Float32Array(trailPoolSize);
    const trailMaxLives = new Float32Array(trailPoolSize);
    const trailSizes = new Float32Array(trailPoolSize);
    const trailTints = new Float32Array(trailPoolSize * 3);

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    trailGeo.setAttribute('aLife', new THREE.BufferAttribute(trailLives, 1));
    trailGeo.setAttribute('aSize', new THREE.BufferAttribute(trailSizes, 1));
    trailGeo.setAttribute('aTint', new THREE.BufferAttribute(trailTints, 3));

    const trailMat = createTrailBurstMaterial();
    trailMat.uniforms.uPixelRatio.value = pixelRatio;
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    trailPoints.frustumCulled = false;
    scene.add(trailPoints);

    let trailCursor = 0;
    const emitSpark = (x, y, z, vx, vy, vz, size, maxLife, warm = true) => {
      const idx = trailCursor;
      trailCursor = (trailCursor + 1) % trailPoolSize;

      trailPositions[idx * 3] = x;
      trailPositions[idx * 3 + 1] = y;
      trailPositions[idx * 3 + 2] = z;

      trailVelocities[idx * 3] = vx;
      trailVelocities[idx * 3 + 1] = vy;
      trailVelocities[idx * 3 + 2] = vz;

      trailMaxLives[idx] = maxLife;
      trailLives[idx] = 0.002;
      trailSizes[idx] = size;

      if (warm) {
        trailTints[idx * 3] = 1.0;
        trailTints[idx * 3 + 1] = 0.78 + Math.random() * 0.2;
        trailTints[idx * 3 + 2] = 0.32 + Math.random() * 0.35;
      } else {
        // Lavender-pink cosmic accent spark
        trailTints[idx * 3] = 0.92;
        trailTints[idx * 3 + 1] = 0.56;
        trailTints[idx * 3 + 2] = 0.98;
      }
    };

    const emitBurst = (originVec, count = 48, speed = 2.6) => {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const spd = speed * (0.35 + Math.random() * 0.85);
        emitSpark(
          originVec.x + (Math.random() - 0.5) * 0.2,
          originVec.y + (Math.random() - 0.5) * 0.2,
          originVec.z + (Math.random() - 0.5) * 0.2,
          Math.sin(phi) * Math.cos(theta) * spd,
          Math.cos(phi) * spd * 0.85 + 0.35,
          Math.sin(phi) * Math.sin(theta) * spd * 0.7,
          2.2 + Math.random() * 3.2,
          0.9 + Math.random() * 0.9,
          i % 5 !== 0
        );
      }
    };

    // 12. Existing Website Photos Revealed Along the Butterfly's Path (Scene 4 & Orbiting Constellation)
    const textureLoader = new THREE.TextureLoader();
    const xSpread = isNarrow ? 1.25 : 2.95;
    const waypointsDesktop = [
      new THREE.Vector3(-xSpread, 1.1, 1.6),
      new THREE.Vector3(xSpread, 1.35, 1.8),
      new THREE.Vector3(-xSpread * 1.08, -0.35, 1.9),
      new THREE.Vector3(xSpread * 1.04, -0.2, 2.0),
      new THREE.Vector3(-xSpread * 0.82, 0.95, 2.1),
      new THREE.Vector3(xSpread * 0.86, 0.85, 2.1),
    ];

    const orbitSlots = [
      new THREE.Vector3(isNarrow ? -1.9 : -4.6, 2.0, -3.2),
      new THREE.Vector3(isNarrow ? 1.9 : 4.6, 2.1, -3.4),
      new THREE.Vector3(isNarrow ? -2.0 : -5.1, -0.8, -3.8),
      new THREE.Vector3(isNarrow ? 2.0 : 5.1, -0.7, -3.6),
      new THREE.Vector3(isNarrow ? -1.55 : -3.4, 2.8, -5.2),
      new THREE.Vector3(isNarrow ? 1.55 : 3.4, 2.75, -5.2),
    ];

    const photoCards = [];
    const clickablePhotoMeshes = [];
    const disposables = [];

    journeyMemories.forEach((mem, idx) => {
      const cardGroup = new THREE.Group();
      const targetHeight = isNarrow ? 2.15 : 2.55;
      const defaultWidth = targetHeight * 0.76;

      // Halo glow plane slightly behind the photograph
      const haloGeo = new THREE.PlaneGeometry(defaultWidth * 1.34, targetHeight * 1.28);
      const haloMat = createPhotoHaloMaterial();
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.z = -0.02;

      // Photograph plane preserving original appearance & true aspect ratio
      const photoGeo = new THREE.PlaneGeometry(defaultWidth, targetHeight);
      const photoMat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        toneMapped: false,
      });
      const photoMesh = new THREE.Mesh(photoGeo, photoMat);
      photoMesh.userData.memoryIndex = idx;
      photoMesh.userData.memorySrc = mem.src;

      cardGroup.add(haloMesh, photoMesh);
      cardGroup.position.copy(waypointsDesktop[idx]);
      cardGroup.scale.setScalar(0.5);
      cardGroup.visible = false;
      scene.add(cardGroup);

      // Match actual photo aspect ratio asynchronously once loaded
      textureLoader.load(mem.src, (tex) => {
        if (isDisposed) {
          tex.dispose();
          return;
        }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        photoMat.map = tex;
        photoMat.needsUpdate = true;

        if (tex.image?.width && tex.image?.height) {
          const naturalAspect = tex.image.width / tex.image.height;
          const clampedAspect = Math.max(0.55, Math.min(1.5, naturalAspect));
          const w = targetHeight * clampedAspect;
          photoMesh.scale.x = w / defaultWidth;
          haloMesh.scale.x = (w * 1.34) / (defaultWidth * 1.34);
        }
        disposables.push(tex);
      });

      clickablePhotoMeshes.push(photoMesh);
      disposables.push(haloGeo, haloMat, photoGeo, photoMat);

      photoCards.push({
        group: cardGroup,
        photoMesh,
        photoMat,
        haloMat,
        anchor: waypointsDesktop[idx],
        orbitPos: orbitSlots[idx],
        burstFired: false,
        revealStart: SCENE_TIMES.MEMORIES_START + idx * 1.18,
      });
    });

    // 13. Smooth Curved Flight Path Through Scenes 3 -> 5
    const flightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(isNarrow ? -1.4 : -2.6, 1.35, 1.6),
      new THREE.Vector3(isNarrow ? 1.5 : 2.9, 1.6, -1.2),
      new THREE.Vector3(waypointsDesktop[0].x * 0.78, waypointsDesktop[0].y + 0.35, 2.3),
      new THREE.Vector3(waypointsDesktop[1].x * 0.78, waypointsDesktop[1].y + 0.3, 2.4),
      new THREE.Vector3(waypointsDesktop[2].x * 0.78, waypointsDesktop[2].y + 0.4, 2.4),
      new THREE.Vector3(waypointsDesktop[3].x * 0.78, waypointsDesktop[3].y + 0.4, 2.5),
      new THREE.Vector3(waypointsDesktop[4].x * 0.72, waypointsDesktop[4].y + 0.35, 2.4),
      new THREE.Vector3(waypointsDesktop[5].x * 0.72, waypointsDesktop[5].y + 0.35, 2.2),
      new THREE.Vector3(0, isNarrow ? 1.85 : 1.55, 0.65),
    ]);

    // 14. Pointer / Touch Interactions + Raycasting
    const pointerNDC = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const pointerWorld = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    let burstFlutter = 0;
    let hoveredPhotoMesh = null;

    const updatePointerFromEvent = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (e) => {
      updatePointerFromEvent(e.clientX, e.clientY);

      if (phaseRef.current >= 2) {
        raycaster.setFromCamera(pointerNDC, camera);
        const bfHit = raycaster.intersectObjects(butterflyRig.clickableTargets, false);
        const phHit = raycaster.intersectObjects(clickablePhotoMeshes, false);
        hoveredPhotoMesh = phHit.find((h) => h.object.material.opacity > 0.25)?.object || null;
        renderer.domElement.style.cursor =
          bfHit.length > 0 || hoveredPhotoMesh ? 'pointer' : 'default';
      }
    };

    const handlePointerDown = (e) => {
      updatePointerFromEvent(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);

      // 1) Check direct click/tap on the 3D Golden Butterfly
      if (butterflyRig.root.visible) {
        const bfHits = raycaster.intersectObjects(butterflyRig.clickableTargets, false);
        if (bfHits.length > 0) {
          burstFlutter = 1.0;
          soundFx.playHarmonicChime();
          const bPos = new THREE.Vector3();
          butterflyRig.root.getWorldPosition(bPos);
          emitBurst(bPos, 78, 3.3);
          openNextButterflyMemory();
          return;
        }
      }

      // 2) Check click/tap on any revealed 3D photo frame
      const phHits = raycaster.intersectObjects(clickablePhotoMeshes, false);
      const visiblePhotoHit = phHits.find((h) => h.object.material.opacity > 0.2);
      if (visiblePhotoHit) {
        soundFx.playClick();
        const memSrc = visiblePhotoHit.object.userData.memorySrc;
        const foundIdx = allMemories.findIndex((m) => m.src === memSrc);
        const worldPos = new THREE.Vector3();
        visiblePhotoHit.object.getWorldPosition(worldPos);
        emitBurst(worldPos, 46, 2.4);
        setHasInteracted(true);
        setSpotlightIndex(foundIdx >= 0 ? foundIdx : 0);
        return;
      }

      // 3) Subtle cosmic spark burst anywhere touched in space
      const dir = raycaster.ray.direction.clone().normalize();
      const targetPt = raycaster.ray.origin.clone().addScaledVector(dir, baseCamZ * 0.85);
      emitBurst(targetPt, 24, 1.9);
    };

    renderer.domElement.addEventListener('pointermove', handlePointerMove, { passive: true });
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Resize responsiveness
    const handleResize = () => {
      if (isDisposed || !container) return;
      const w = Math.max(container.clientWidth, window.innerWidth || 375);
      const h = Math.max(container.clientHeight, window.innerHeight || 667);
      const nextAspect = w / h;
      const narrow = w < 768;
      camera.fov = narrow ? 58 : 48;
      camera.aspect = nextAspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 15. Main Animation Loop
    let prevNow = performance.now();
    let elapsed = 0;
    let sceneElapsed = 0;
    let birthBurstFired = false;

    const tmpVec = new THREE.Vector3();
    const tmpTangent = new THREE.Vector3();
    const wingPosL = new THREE.Vector3();
    const wingPosR = new THREE.Vector3();
    const bfPos = new THREE.Vector3(0, 0.2, 0);
    const prevBfPos = new THREE.Vector3(0, 0.2, 0);

    const animate = (now) => {
      if (isDisposed) return;
      animFrameId = requestAnimationFrame(animate);

      const dt = Math.min((now - prevNow) / 1000, 0.05);
      prevNow = now;
      elapsed += dt;

      if (clockOverrideRef.current.skipToFinale && sceneElapsed < SCENE_TIMES.INTERACTIVE_READY) {
        sceneElapsed = SCENE_TIMES.INTERACTIVE_READY + 0.1;
        birthBurstFired = true;
      } else if (!isPausedRef.current) {
        sceneElapsed += dt;
      }

      // Compute current phase index for minimal React HUD updates
      let computedPhase = 1;
      if (sceneElapsed >= SCENE_TIMES.INTERACTIVE_READY) computedPhase = 6;
      else if (sceneElapsed >= SCENE_TIMES.NAME_REVEAL) computedPhase = 5;
      else if (sceneElapsed >= SCENE_TIMES.MEMORIES_START) computedPhase = 4;
      else if (sceneElapsed >= SCENE_TIMES.BORN_END) computedPhase = 3;
      else if (sceneElapsed >= SCENE_TIMES.UNIVERSE_END) computedPhase = 2;

      if (computedPhase !== phaseRef.current) {
        phaseRef.current = computedPhase;
        setScenePhase(computedPhase);
      }

      // Smooth damped pointer tracking
      smoothPointer.lerp(pointerNDC, 0.08);
      pointerWorld.set(smoothPointer.x * 6.5, smoothPointer.y * 4.2, 0);
      burstFlutter = Math.max(0, burstFlutter - dt * 1.9);

      // Scene 1 fade-in controls
      const universeFade = easeOutCubic(sceneElapsed / 2.6);
      starMat.uniforms.uTime.value = elapsed;
      starMat.uniforms.uOpacity.value = universeFade;
      mirrorVignetteMat.uniforms.uTime.value = elapsed;
      mirrorVignetteMat.uniforms.uOpacity.value = universeFade;
      petalMat.opacity = universeFade * 0.84;

      // Animate nebula clouds
      nebulaGroup.children.forEach((sprite, idx) => {
        const speed = sprite.userData.driftSpeed;
        sprite.position.x = sprite.userData.baseX + Math.sin(elapsed * speed + idx) * 0.75;
        sprite.position.y = sprite.userData.baseY + Math.cos(elapsed * speed * 1.3 + idx) * 0.4;
        nebulaMats[idx].mat.opacity =
          universeFade * nebulaMats[idx].targetOpacity * (0.86 + 0.14 * Math.sin(elapsed * 0.5 + idx));
      });

      // Animate falling & swirling flower petals
      for (let i = 0; i < petalCount; i++) {
        const p = petalStates[i];
        p.y -= p.fallSpeed * dt;
        p.x += Math.sin(elapsed * p.swayFreq + p.phase) * 0.32 * dt + smoothPointer.x * 0.08 * dt;
        if (p.y < -3.6) {
          p.y = 7.2 + Math.random() * 2.5;
          p.x = (Math.random() - 0.5) * 18;
        }
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(
          elapsed * p.rotSpeedX + p.phase,
          elapsed * p.rotSpeedY,
          Math.sin(elapsed + p.phase) * 0.5
        );
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        petalMesh.setMatrixAt(i, dummy.matrix);
      }
      petalMesh.instanceMatrix.needsUpdate = true;

      // Scene 2: Particle formation -> Butterfly emergence
      const morphT = easeInOutCubic(
        (sceneElapsed - SCENE_TIMES.BORN_MORPH_START) /
          (SCENE_TIMES.BORN_MORPH_END - SCENE_TIMES.BORN_MORPH_START)
      );
      const disperseT = easeOutCubic((sceneElapsed - (SCENE_TIMES.BORN_MORPH_END - 0.2)) / 1.4);

      swarmMat.uniforms.uTime.value = elapsed;
      swarmMat.uniforms.uMorph.value = morphT;
      swarmMat.uniforms.uDisperse.value = disperseT;
      swarmMat.uniforms.uGlobalOpacity.value = universeFade;
      swarmMat.uniforms.uPointer.value.copy(pointerWorld);

      // Materialize 3D Golden Butterfly right as particles converge
      const bfAppear = easeOutCubic((sceneElapsed - 5.95) / 1.0);
      if (bfAppear > 0.01) {
        butterflyRig.root.visible = true;
        const popScale =
          (isNarrow ? 0.72 : 0.88) *
          (bfAppear < 1 ? bfAppear * (1.0 + Math.sin(bfAppear * Math.PI) * 0.14) : 1.0);
        butterflyRig.root.scale.setScalar(popScale);

        if (!birthBurstFired && sceneElapsed >= 6.2) {
          birthBurstFired = true;
          emitBurst(new THREE.Vector3(0, 0.2, 0), 75, 2.9);
        }
      }

      // Scene 3..6: Butterfly flight path vs Hovering near DHATHRI
      prevBfPos.copy(bfPos);
      if (sceneElapsed < SCENE_TIMES.BORN_END) {
        bfPos.set(0, 0.2 + Math.sin(elapsed * 1.6) * 0.12, 0.2);
        butterflyRig.root.rotation.set(0, smoothPointer.x * 0.25, smoothPointer.y * 0.12);
        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 5.8,
          amplitude: 0.85,
          burst: burstFlutter,
        });
      } else if (sceneElapsed < SCENE_TIMES.NAME_REVEAL) {
        const rawFlightT = clamp01(
          (sceneElapsed - SCENE_TIMES.BORN_END) /
            (SCENE_TIMES.NAME_REVEAL - SCENE_TIMES.BORN_END)
        );
        const flightT = easeInOutCubic(rawFlightT);
        flightCurve.getPointAt(flightT, bfPos);
        flightCurve.getTangentAt(flightT, tmpTangent);

        butterflyRig.root.rotation.y = Math.atan2(tmpTangent.x, tmpTangent.z) * 0.42;
        butterflyRig.root.rotation.z = -tmpTangent.x * 0.45;
        butterflyRig.root.rotation.x = tmpTangent.y * 0.25;

        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 8.6,
          amplitude: 0.98,
          burst: burstFlutter,
        });

        // Continuous glowing particle trail from wingtips & thorax
        if (Math.random() < 0.92) {
          butterflyRig.leftTipSocket.getWorldPosition(wingPosL);
          butterflyRig.rightTipSocket.getWorldPosition(wingPosR);
          butterflyRig.bodySocket.getWorldPosition(tmpVec);

          emitSpark(
            wingPosL.x,
            wingPosL.y,
            wingPosL.z,
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.3) * 0.3,
            (Math.random() - 0.5) * 0.3,
            1.6 + Math.random() * 1.8,
            1.15,
            true
          );
          emitSpark(
            wingPosR.x,
            wingPosR.y,
            wingPosR.z,
            (Math.random() - 0.5) * 0.35,
            (Math.random() - 0.3) * 0.3,
            (Math.random() - 0.5) * 0.3,
            1.6 + Math.random() * 1.8,
            1.15,
            true
          );
          emitSpark(
            tmpVec.x,
            tmpVec.y,
            tmpVec.z,
            (Math.random() - 0.5) * 0.2,
            -0.25,
            0,
            2.1 + Math.random() * 1.5,
            1.25,
            Math.random() > 0.22
          );
        }
      } else {
        // Scene 5 & 6: Hover majestically above "DHATHRI" with responsive cursor follow
        const hoverY = (isNarrow ? 1.85 : 1.55) + Math.sin(elapsed * 1.5) * 0.16;
        const hoverX = Math.sin(elapsed * 0.65) * 0.22 + smoothPointer.x * 0.65;
        const hoverZ = 0.65 + smoothPointer.y * 0.28;
        bfPos.lerp(tmpVec.set(hoverX, hoverY, hoverZ), 0.08);

        butterflyRig.root.rotation.y = smoothPointer.x * 0.48 + Math.sin(elapsed * 0.7) * 0.15;
        butterflyRig.root.rotation.z = -smoothPointer.x * 0.22;
        butterflyRig.root.rotation.x = smoothPointer.y * 0.18 + 0.08;

        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 6.2,
          amplitude: 0.92,
          burst: burstFlutter,
        });

        // Soft drifting golden sparkles below butterfly over DHATHRI name
        if (Math.random() < 0.45) {
          butterflyRig.leftTipSocket.getWorldPosition(wingPosL);
          butterflyRig.rightTipSocket.getWorldPosition(wingPosR);
          const pick = Math.random() > 0.5 ? wingPosL : wingPosR;
          emitSpark(
            pick.x,
            pick.y,
            pick.z,
            (Math.random() - 0.5) * 0.25,
            -0.35 - Math.random() * 0.35,
            (Math.random() - 0.5) * 0.25,
            1.5 + Math.random() * 1.5,
            1.1,
            true
          );
        }
      }
      butterflyRig.root.position.copy(bfPos);

      // Update active trail/burst spark pool
      for (let i = 0; i < trailPoolSize; i++) {
        const life = trailLives[i];
        if (life <= 0) continue;

        const nextLife = life + dt / trailMaxLives[i];
        if (nextLife >= 1.0) {
          trailLives[i] = 0;
        } else {
          trailLives[i] = nextLife;
          trailPositions[i * 3] += trailVelocities[i * 3] * dt;
          trailPositions[i * 3 + 1] += trailVelocities[i * 3 + 1] * dt;
          trailPositions[i * 3 + 2] += trailVelocities[i * 3 + 2] * dt;
          trailVelocities[i * 3] *= 0.985;
          trailVelocities[i * 3 + 1] = trailVelocities[i * 3 + 1] * 0.985 - 0.08 * dt;
          trailVelocities[i * 3 + 2] *= 0.985;
        }
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.aLife.needsUpdate = true;

      // Scene 4 -> 6: Existing Website Photographs Emerging From Golden Light
      const orbitBlend = easeInOutCubic((sceneElapsed - SCENE_TIMES.NAME_REVEAL) / 2.2);
      photoCards.forEach((card, idx) => {
        const activeDur = sceneElapsed - card.revealStart;
        if (activeDur < 0) {
          card.group.visible = false;
          return;
        }

        card.group.visible = true;
        if (!card.burstFired && activeDur > 0.05) {
          card.burstFired = true;
          emitBurst(card.anchor, 36, 2.2);
        }

        const fadeIn = easeOutCubic(activeDur / 0.85);
        // After this memory's spotlight beat, drift it deeper into the starry constellation
        const recessAge = clamp01((activeDur - 2.3) / 1.5);

        const targetPos = tmpVec.copy(card.anchor).lerp(card.orbitPos, Math.max(orbitBlend, recessAge));
        targetPos.y += Math.sin(elapsed * 0.8 + idx * 1.2) * 0.14;
        card.group.position.copy(targetPos);

        const isHovered = hoveredPhotoMesh === card.photoMesh;
        const targetScale =
          (0.68 + 0.32 * fadeIn) *
          (1.0 - 0.34 * Math.max(orbitBlend * 0.9, recessAge * 0.85)) *
          (isHovered ? 1.12 : 1.0);
        card.group.scale.setScalar(targetScale);

        const baseOpacity =
          fadeIn * (1.0 - Math.max(orbitBlend * 0.56, recessAge * 0.52));
        card.photoMat.opacity = isHovered ? Math.min(1, baseOpacity + 0.38) : baseOpacity;
        card.haloMat.uniforms.uTime.value = elapsed;
        card.haloMat.uniforms.uOpacity.value = isHovered ? 0.95 : card.photoMat.opacity * 0.85;

        // Gentle look toward viewer
        card.group.rotation.y = (smoothPointer.x * 0.15 - targetPos.x * 0.045);
        card.group.rotation.x = -smoothPointer.y * 0.08;
      });

      // Cinematic Camera Tracking & Parallax
      const trackWeight =
        sceneElapsed >= SCENE_TIMES.BORN_END && sceneElapsed < SCENE_TIMES.NAME_REVEAL ? 0.24 : 0.0;
      const targetCamX = bfPos.x * trackWeight + smoothPointer.x * 0.55;
      const targetCamY = 0.35 + bfPos.y * trackWeight * 0.6 + smoothPointer.y * 0.35;
      const targetCamZ = baseCamZ + (sceneElapsed < SCENE_TIMES.BORN_END ? 0.6 : 0);

      camera.position.x += (targetCamX - camera.position.x) * 0.045;
      camera.position.y += (targetCamY - camera.position.y) * 0.045;
      camera.position.z += (targetCamZ - camera.position.z) * 0.045;
      camera.lookAt(camera.position.x * 0.35, 0.25 + bfPos.y * trackWeight * 0.3, 0);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);

      if (mirrorReflector) {
        mirrorReflector.dispose();
      }
      mirrorGeo.dispose();
      overlayGeo.dispose();
      mirrorVignetteMat.dispose();
      starGeo.dispose();
      starMat.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      petalMesh.dispose();
      butterflyRig.dispose();

      [foreMaps.map, foreMaps.emissiveMap, foreMaps.alphaMap, foreMaps.bumpMap].forEach((t) =>
        t.dispose()
      );
      [hindMaps.map, hindMaps.emissiveMap, hindMaps.alphaMap, hindMaps.bumpMap].forEach((t) =>
        t.dispose()
      );
      glowTex.dispose();
      petalTex.dispose();
      nebulaTexList.forEach((t) => t.dispose());
      nebulaMats.forEach(({ mat }) => mat.dispose());
      disposables.forEach((d) => d.dispose?.());

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [journeyMemories, allMemories, openNextButterflyMemory, replaySeed, useFallback]);

  const activeSpotlight = spotlightIndex !== null ? allMemories[spotlightIndex] : null;
  const effectivePhase = useFallback ? 6 : scenePhase;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#04010A] text-[#FAF6F0] select-none transition-all duration-700 ${
        isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* 3D Cosmic Canvas (or Reduced-Motion / Non-WebGL Graceful Fallback) */}
      {!useFallback ? (
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full touch-none"
          aria-label="Interactive 3D Golden Butterfly Universe"
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#2E1065_0%,#0F0521_52%,#04010A_100%)] flex flex-col items-center justify-between py-12 px-6">
          <div className="mt-8 text-center space-y-4">
            <span className="inline-block text-4xl animate-pulse" aria-hidden="true">
              🦋
            </span>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
              {journeyMemories.slice(0, 3).map((m, idx) => (
                <button
                  key={m.src}
                  type="button"
                  onClick={() => setSpotlightIndex(idx)}
                  className="aspect-[3/4] rounded-xl overflow-hidden border border-[#C5A059]/45 shadow-lg hover:scale-105 transition-transform cursor-pointer"
                >
                  <img src={m.src} alt={m.tag} className="w-full h-full object-cover object-top" />
                </button>
              ))}
            </div>
          </div>
          <div className="h-24" />
        </div>
      )}

      {/* Top Subtle Atmospheric Control: Skip during intro sequence */}
      {effectivePhase < 6 && (
        <button
          type="button"
          onClick={handleSkipToReveal}
          className="fixed top-5 right-5 sm:top-6 sm:right-6 z-30 px-3.5 py-1.5 rounded-full bg-white/8 hover:bg-white/15 backdrop-blur-md border border-[#C5A059]/30 text-[11px] font-mono uppercase tracking-[0.2em] text-[#F4E8D5]/80 hover:text-white transition-all cursor-pointer"
        >
          Skip Intro →
        </button>
      )}

      {/* Scene 1 Typography Overlay */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 text-center transition-all duration-1000 ${
          effectivePhase === 1 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <p className="max-w-xl font-display italic text-2xl sm:text-4xl md:text-[2.6rem] leading-relaxed tracking-wide text-[#FAF3E3] drop-shadow-[0_0_24px_rgba(197,160,89,0.55)]">
          “Sometimes, the smallest things create the most beautiful stories...”
        </p>
      </div>

      {/* Scene 4 Minimal Header Caption (kept unobtrusive so photos & butterfly shine) */}
      <div
        className={`pointer-events-none absolute top-7 left-1/2 -translate-x-1/2 z-20 text-center transition-all duration-700 ${
          effectivePhase === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#16082C]/60 backdrop-blur-md border border-[#C5A059]/30 text-[10px] sm:text-xs font-mono uppercase tracking-[0.28em] text-[#F5D06B]">
          <Sparkles size={12} /> Golden Trail of Memories
        </span>
      </div>

      {/* Scene 5 & 6 Centerpiece: DHATHRI Name Reveal + Tagline + Explore Her Universe CTA */}
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-[10%] sm:bottom-[11%] z-20 flex flex-col items-center justify-end px-4 text-center transition-all duration-1000 ${
          effectivePhase >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Soft golden atmospheric glow pool beneath butterfly & behind name */}
        <div className="relative flex flex-col items-center">
          <div
            aria-hidden="true"
            className="absolute -inset-x-16 -inset-y-8 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(245,196,81,0.22)_0%,rgba(168,85,247,0.16)_45%,transparent_75%)] blur-2xl"
          />

          <h1
            className="relative font-display font-semibold tracking-[0.26em] sm:tracking-[0.34em] pl-[0.26em] text-5xl sm:text-7xl md:text-8xl uppercase text-transparent bg-clip-text drop-shadow-[0_4px_28px_rgba(245,196,81,0.45)] animate-gold-shimmer"
            style={{
              backgroundImage:
                'linear-gradient(110deg, #D4A446 0%, #FFF7DC 32%, #F6C85F 52%, #E9D5FF 72%, #D4A446 100%)',
              backgroundSize: '220% auto',
            }}
          >
            DHATHRI
          </h1>

          {/* Delicate luminous horizontal rule */}
          <div className="w-36 sm:w-52 h-px my-3 sm:my-4 bg-gradient-to-r from-transparent via-[#F5C451]/80 to-transparent shadow-[0_0_12px_rgba(245,196,81,0.6)]" />

          <p className="relative font-display italic text-lg sm:text-2xl text-[#F5E6FF]/95 tracking-wide drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] max-w-lg">
            “One little existence. A thousand beautiful memories.”
          </p>
        </div>

        {/* Scene 6 Interactive Controls */}
        <div
          className={`mt-6 sm:mt-8 flex flex-col items-center gap-3.5 transition-all duration-1000 ${
            effectivePhase >= 6
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleExploreUniverse}
              className="group relative inline-flex items-center gap-2.5 px-7 sm:px-9 py-3.5 rounded-full bg-gradient-to-r from-[#E6B84C] via-[#FCE79C] to-[#D49E38] text-[#170926] font-sans font-bold text-xs sm:text-sm uppercase tracking-[0.18em] shadow-[0_0_32px_rgba(245,196,81,0.45)] hover:shadow-[0_0_46px_rgba(245,196,81,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <Sparkles size={15} className="text-[#4C1D95]" />
              <span>Explore Her Universe</span>
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 px-4 py-3.5 rounded-full bg-[#1C0B33]/75 hover:bg-[#2E1352]/90 backdrop-blur-md border border-[#C5A059]/35 text-[#F4E8D5] text-xs font-mono uppercase tracking-wider hover:border-[#F5C451]/60 transition-all cursor-pointer"
              aria-label="Replay Butterfly Intro"
            >
              <RotateCcw size={13} className="text-[#F5C451]" />
              <span>Replay</span>
            </button>
          </div>

          <span className="text-[11px] font-mono tracking-wider text-[#D8B4FE]/75">
            {hasInteracted
              ? '✨ Tap the golden butterfly anytime for more memories'
              : '✨ Tip: Tap the golden butterfly or any glowing photo'}
          </span>
        </div>
      </div>

      {/* Interactive Photo Spotlight Modal triggered by clicking Butterfly or a 3D Photo */}
      {activeSpotlight && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 bg-[#04010A]/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSpotlightIndex(null)}
        >
          <div
            className="relative max-w-md w-full rounded-3xl bg-[#130624]/95 border border-[#F5C451]/40 p-4 sm:p-5 shadow-[0_0_60px_rgba(168,85,247,0.35)] text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setSpotlightIndex(null);
              }}
              aria-label="Close memory preview"
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF6F0] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F5C451]/15 border border-[#F5C451]/35 text-[10px] font-mono uppercase tracking-widest text-[#F5D06B]">
              <Heart size={11} className="text-[#F472B6]" />
              {activeSpotlight.tag}
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-black/50 border border-white/10 max-h-[58vh] flex items-center justify-center">
              <img
                src={activeSpotlight.src}
                alt={activeSpotlight.caption || 'Dhathri Memory'}
                className="w-full max-h-[58vh] object-contain"
              />
            </div>

            {activeSpotlight.caption && (
              <p className="font-display italic text-lg sm:text-xl text-[#FAF6F0]/95 px-2 leading-snug">
                “{activeSpotlight.caption}”
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSpotlightIndex((prev) => (prev - 1 + allMemories.length) % allMemories.length);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-[#F4E8D5] cursor-pointer transition-colors"
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <span className="text-[11px] font-mono text-[#C084FC]">
                {spotlightIndex + 1} / {allMemories.length}
              </span>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setSpotlightIndex((prev) => (prev + 1) % allMemories.length);
                }}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-mono text-[#F4E8D5] cursor-pointer transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scoped keyframes for golden typography shimmer */}
      <style>{`
        @keyframes goldShimmerSweep {
          0% { background-position: 0% center; }
          100% { background-position: 220% center; }
        }
        .animate-gold-shimmer {
          animation: goldShimmerSweep 6.5s linear infinite;
        }
      `}</style>
    </div>
  );
}
