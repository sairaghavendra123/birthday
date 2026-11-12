import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
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
} from './butterfly/cosmicShaders';
import './butterflyEffect.css';

// Cinematic timeline milestones (seconds)
const TIMELINE = {
  QUOTE_IN: 0.45,
  QUOTE_OUT: 2.55,
  MORPH_START: 2.75,
  MORPH_END: 5.55,
  BUTTERFLY_BORN: 5.05,
  FLIGHT_START: 6.2,
  NAME_REVEAL: 17.1,
  INTERACTIVE_READY: 18.6,
};

// Strictly the 8 curated photos used throughout the butterfly effect (loops seamlessly 1 -> 8 -> 1)
const BUTTERFLY_MEMORIES = [
  {
    src: '/photos/finale/dhathri_outdoor_srm.jpg',
    shortLabel: 'Radiant Smile',
    caption: 'That effortless smile that brings warmth to every ordinary moment.',
    tag: 'Memory 01',
    start: 6.3,
    end: 9.0,
    desktopPos: { left: '20%', top: '31%' },
    mobilePos: { left: '30%', top: '26%' },
    objectPosition: 'center 22%',
  },
  {
    src: '/photos/finale/dhathri_cafe_floral.jpg',
    shortLabel: 'Sweet Moment',
    caption: 'Natural beauty, soft sunshine, and pure happiness in one frame.',
    tag: 'Memory 02',
    start: 7.4,
    end: 10.1,
    desktopPos: { left: '50%', top: '25%' },
    mobilePos: { left: '68%', top: '30%' },
    objectPosition: 'center 22%',
  },
  {
    src: '/photos/montage/davani_lehenga_garden.jpg',
    shortLabel: 'Garden Bloom',
    caption: 'Blooming with grace, outshining every flower behind her.',
    tag: 'Memory 03',
    start: 8.5,
    end: 11.2,
    desktopPos: { left: '78%', top: '33%' },
    mobilePos: { left: '31%', top: '66%' },
    objectPosition: 'center 24%',
  },
  {
    src: '/photos/complaints/davani_pink_tshirt.png',
    shortLabel: 'Good Vibes',
    caption: 'Effortlessly cheerful energy that brightens every room.',
    tag: 'Memory 04',
    start: 9.6,
    end: 12.3,
    desktopPos: { left: '24%', top: '64%' },
    mobilePos: { left: '68%', top: '67%' },
    objectPosition: 'center 28%',
  },
  {
    src: '/photos/complaints/davani_saree_gold_red.png',
    shortLabel: 'Golden Grace',
    caption: 'Warmth, elegance, and quiet confidence in every step.',
    tag: 'Memory 05',
    start: 10.7,
    end: 13.4,
    desktopPos: { left: '74%', top: '63%' },
    mobilePos: { left: '31%', top: '28%' },
    objectPosition: 'center 16%',
  },
  {
    src: '/photos/complaints/davani_green_kurti_phone.png',
    shortLabel: 'Serene Smile',
    caption: 'Gentle poise and that unmistakable warm smile.',
    tag: 'Memory 06',
    start: 11.8,
    end: 14.5,
    desktopPos: { left: '49%', top: '66%' },
    mobilePos: { left: '68%', top: '32%' },
    objectPosition: 'center 22%',
  },
  {
    src: '/photos/butterfly/palm_saree_portrait.jpg',
    shortLabel: 'Traditional Grace',
    caption: 'Draped in quiet elegance against sunlit palms.',
    tag: 'Memory 07',
    start: 12.9,
    end: 15.6,
    desktopPos: { left: '22%', top: '33%' },
    mobilePos: { left: '32%', top: '66%' },
    objectPosition: 'center 24%',
  },
  {
    src: '/photos/complaints/davani_bathukamma_saree.jpg',
    shortLabel: 'Bathukamma Glow',
    caption: 'Carrying festive radiance and joy wherever she goes.',
    tag: 'Memory 08',
    start: 14.0,
    end: 16.6,
    desktopPos: { left: '76%', top: '32%' },
    mobilePos: { left: '67%', top: '67%' },
    objectPosition: 'center 18%',
  },
];

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

function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/**
 * Returns strictly the 8 curated butterfly memories so both stage flight and tap reveals use only these 8 photos.
 */
function collectSiteMemories() {
  return {
    stageMemories: BUTTERFLY_MEMORIES,
    allMemories: BUTTERFLY_MEMORIES,
  };
}

export default function ButterflyEffectIntro({ onComplete, onStartMusic }) {
  const webglCanvasRef = useRef(null);
  const canvas2dRef = useRef(null);

  const { stageMemories, allMemories } = useMemo(() => collectSiteMemories(), []);

  const [isNarrow, setIsNarrow] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [use2DFallback, setUse2DFallback] = useState(() => {
    if (typeof window === 'undefined') return true;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    return Boolean(reduced || !supportsWebGL());
  });

  const [replaySeed, setReplaySeed] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [tapMemories, setTapMemories] = useState([]);

  // Discrete DOM HUD state updated strictly on phase/card transitions
  const [sceneState, setSceneState] = useState({
    showHorizon: false,
    quotePhase: 'hidden', // 'hidden' | 'visible' | 'fading'
    cardStates: stageMemories.map(() => 'hidden'), // 'hidden' | 'entering' | 'leaving'
    showName: false,
    showActions: false,
    showSkip: true,
  });

  const skipRef = useRef(false);
  const isPausedRef = useRef(false);
  const showNameRef = useRef(false);
  const nextTapIdxRef = useRef(0);
  const tapIdRef = useRef(0);
  const tapTimeoutsRef = useRef(new Set());
  const readyIndicesRef = useRef(new Set());
  const preloadCacheRef = useRef([]);

  // Preload & decode all memory photos eagerly so tap-anywhere pops appear instantaneously
  useEffect(() => {
    if (typeof window === 'undefined' || !allMemories.length) return;
    let cancelled = false;
    readyIndicesRef.current.clear();
    preloadCacheRef.current = allMemories.map((mem, idx) => {
      const img = new window.Image();
      img.decoding = 'async';
      const markReady = () => {
        if (!cancelled) {
          readyIndicesRef.current.add(idx);
        }
      };
      img.onload = () => {
        if (typeof img.decode === 'function') {
          img.decode().then(markReady, markReady);
        } else {
          markReady();
        }
      };
      img.onerror = () => {};
      img.src = mem.src;
      if (img.complete && img.naturalWidth > 0) {
        markReady();
      }
      return img;
    });

    return () => {
      cancelled = true;
      preloadCacheRef.current = [];
    };
  }, [allMemories]);

  useEffect(() => {
    isPausedRef.current = spotlightIndex !== null;
  }, [spotlightIndex]);

  useEffect(() => {
    showNameRef.current = sceneState.showName;
  }, [sceneState.showName]);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 640);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const syncDomFromTime = useCallback(
    (t) => {
      const showHorizon = t >= 0.35;
      const quotePhase =
        t < TIMELINE.QUOTE_IN
          ? 'hidden'
          : t < TIMELINE.QUOTE_OUT
          ? 'visible'
          : t < TIMELINE.QUOTE_OUT + 1.4
          ? 'fading'
          : 'hidden';

      const cardStates = stageMemories.map((card) => {
        if (t < card.start) return 'hidden';
        if (t < card.end) return 'entering';
        if (t < card.end + 1.15) return 'leaving';
        return 'hidden';
      });

      const showName = t >= TIMELINE.NAME_REVEAL;
      const showActions = t >= TIMELINE.INTERACTIVE_READY;
      const showSkip = !showActions;

      setSceneState((prev) => {
        const sameCards = prev.cardStates.every((v, idx) => v === cardStates[idx]);
        if (
          prev.showHorizon === showHorizon &&
          prev.quotePhase === quotePhase &&
          sameCards &&
          prev.showName === showName &&
          prev.showActions === showActions &&
          prev.showSkip === showSkip
        ) {
          return prev;
        }
        return { showHorizon, quotePhase, cardStates, showName, showActions, showSkip };
      });
    },
    [stageMemories]
  );

  const openMemoryBySrc = useCallback(
    (src) => {
      soundFx.playClick();
      setHasInteracted(true);
      const found = allMemories.findIndex((m) => m.src === src);
      setSpotlightIndex(found >= 0 ? found : 0);
    },
    [allMemories]
  );

  const clearTapMemories = useCallback(() => {
    tapTimeoutsRef.current.forEach((timerId) => clearTimeout(timerId));
    tapTimeoutsRef.current.clear();
    setTapMemories([]);
  }, []);

  useEffect(() => () => clearTapMemories(), [clearTapMemories]);

  const scheduleTapTimeout = useCallback((fn, delay) => {
    const id = window.setTimeout(() => {
      tapTimeoutsRef.current.delete(id);
      fn();
    }, delay);
    tapTimeoutsRef.current.add(id);
  }, []);

  const dismissTapMemory = useCallback(
    (id) => {
      setTapMemories((prev) => prev.map((m) => (m.id === id ? { ...m, isLeaving: true } : m)));
      scheduleTapTimeout(() => {
        setTapMemories((prev) => prev.filter((m) => m.id !== id));
      }, 550);
    },
    [scheduleTapTimeout]
  );

  const spawnMemoryAtPoint = useCallback(
    (clientX, clientY) => {
      const total = allMemories.length;
      if (!total) return;
      setHasInteracted(true);

      let memoryIndex = nextTapIdxRef.current % total;
      const ready = readyIndicesRef.current;
      if (ready.size > 0 && !ready.has(memoryIndex)) {
        for (let offset = 1; offset < total; offset++) {
          const candidate = (memoryIndex + offset) % total;
          if (ready.has(candidate)) {
            memoryIndex = candidate;
            nextTapIdxRef.current += offset;
            break;
          }
        }
      }
      nextTapIdxRef.current += 1;

      const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
      const padX = Math.min(125, vw * 0.24);
      const padY = Math.min(155, vh * 0.24);
      const x = Math.max(padX, Math.min(vw - padX, clientX));
      const y = Math.max(padY, Math.min(vh - padY, clientY));
      const tilt = ((memoryIndex % 5) - 2) * 1.8;
      const id = ++tapIdRef.current;

      setTapMemories((prev) => {
        const trimmed = prev.length >= 6 ? prev.slice(prev.length - 5) : prev;
        return [...trimmed, { id, x, y, memoryIndex, tilt, isLeaving: false }];
      });

      scheduleTapTimeout(() => {
        setTapMemories((prev) => prev.map((m) => (m.id === id ? { ...m, isLeaving: true } : m)));
      }, 2400);

      scheduleTapTimeout(() => {
        setTapMemories((prev) => prev.filter((m) => m.id !== id));
      }, 2900);
    },
    [allMemories.length, scheduleTapTimeout]
  );

  const openNextButterflyMemory = useCallback(() => {
    setHasInteracted(true);
    const idx = nextTapIdxRef.current % allMemories.length;
    nextTapIdxRef.current += 1;
    setSpotlightIndex(idx);
  }, [allMemories.length]);

  const handleStageTap = useCallback(
    (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!sceneState.showName || spotlightIndex !== null || isExiting) return;
      if (e.target.closest('button, a, .be-mem-modal, .be-tap-card, .be-memory-card')) return;
      if (use2DFallback) {
        soundFx.playHarmonicChime();
      }
      spawnMemoryAtPoint(e.clientX, e.clientY);
    },
    [sceneState.showName, spotlightIndex, isExiting, use2DFallback, spawnMemoryAtPoint]
  );

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
    }, 920);
  }, [isExiting, onComplete, onStartMusic]);

  const handleReplay = useCallback(() => {
    soundFx.playClick();
    soundFx.playHarmonicChime();
    skipRef.current = false;
    nextTapIdxRef.current = 0;
    clearTapMemories();
    setSpotlightIndex(null);
    setHasInteracted(false);
    setSceneState({
      showHorizon: false,
      quotePhase: 'hidden',
      cardStates: stageMemories.map(() => 'hidden'),
      showName: false,
      showActions: false,
      showSkip: true,
    });
    setReplaySeed((prev) => prev + 1);
  }, [stageMemories, clearTapMemories]);

  const handleSkipToReveal = useCallback(() => {
    soundFx.playClick();
    skipRef.current = true;
    syncDomFromTime(TIMELINE.INTERACTIVE_READY + 0.5);
  }, [syncDomFromTime]);

  // =========================================================================
  // Primary 3D WebGL Engine (#be-canvas-webgl)
  // =========================================================================
  useEffect(() => {
    if (use2DFallback) return;

    const canvas = webglCanvasRef.current;
    if (!canvas) return;

    let animFrameId = 0;
    let isDisposed = false;

    const width = Math.max(window.innerWidth || 375, 320);
    const height = Math.max(window.innerHeight || 667, 320);
    const narrow = width < 768;
    const lowHardware = (navigator.hardwareConcurrency || 8) <= 4;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, narrow ? 1.75 : 2);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !lowHardware,
        powerPreference: 'high-performance',
        alpha: true,
      });
    } catch {
      queueMicrotask(() => setUse2DFallback(true));
      return;
    }

    renderer.setClearColor(0x030108, 0);
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(narrow ? 56 : 46, width / height, 0.1, 160);
    const baseCamZ = narrow ? 15.2 : 11.4;
    camera.position.set(0, 0.25, baseCamZ);
    camera.lookAt(0, 0.1, 0);

    // Warm golden key + violet cosmos fill lights
    const ambientLight = new THREE.AmbientLight('#5B21B6', 1.35);
    const keyLight = new THREE.DirectionalLight('#FFE4A0', 2.25);
    keyLight.position.set(4, 7, 10);
    const rimLight = new THREE.DirectionalLight('#C084FC', 1.9);
    rimLight.position.set(-6, 3, -5);
    const corePoint = new THREE.PointLight('#FFCD6B', 2.4, 14);
    corePoint.position.set(0, 0.2, 2.2);
    scene.add(ambientLight, keyLight, rimLight, corePoint);

    // Procedural wing, nebula, glow, and petal textures
    const foreMaps = createButterflyWingMaps('fore');
    const hindMaps = createButterflyWingMaps('hind');
    const glowTex = createRadialGlowTexture();
    const petalTex = createPetalTexture();
    const nebulaTexList = [
      createNebulaCloudTexture(0),
      createNebulaCloudTexture(1),
      createNebulaCloudTexture(2),
    ];

    // 1. Central Royal Purple Nebula Haze Sprites
    const nebulaGroup = new THREE.Group();
    const nebulaEntries = [
      { x: 0, y: 0.3, z: -10, scale: 18, variant: 0, opacity: 0.72, speed: 0.06 },
      { x: -3.2, y: 0.9, z: -13, scale: 15, variant: 1, opacity: 0.56, speed: -0.05 },
      { x: 3.4, y: -0.4, z: -14, scale: 16, variant: 2, opacity: 0.52, speed: 0.05 },
      { x: 0.4, y: -1.6, z: -11, scale: 20, variant: 0, opacity: 0.36, speed: -0.04 },
    ];
    nebulaEntries.forEach((n) => {
      const mat = new THREE.SpriteMaterial({
        map: nebulaTexList[n.variant],
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.position.set(n.x, n.y, n.z);
      sprite.scale.set(n.scale, n.scale * 0.72, 1);
      nebulaGroup.add(sprite);
      n.mat = mat;
      n.sprite = sprite;
    });
    scene.add(nebulaGroup);

    // 2. Bokeh Stardust Field (calm, balanced warm golden & soft violet stars)
    const starCount = narrow || lowHardware ? 320 : 660;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starPhases = new Float32Array(starCount);
    const starSpeeds = new Float32Array(starCount);
    const starColors = new Float32Array(starCount * 3);

    const bokehPalette = [
      new THREE.Color('#FFF5D6'),
      new THREE.Color('#FFD97D'),
      new THREE.Color('#F5B841'),
      new THREE.Color('#FDE68A'),
      new THREE.Color('#E9D5FF'),
    ];

    for (let i = 0; i < starCount; i++) {
      const isCenterCluster = i < starCount * 0.12;
      if (isCenterCluster) {
        const angle = Math.random() * Math.PI * 2;
        const rad = 1.6 + Math.pow(Math.random(), 0.7) * 6.5;
        starPos[i * 3] = Math.cos(angle) * rad * 1.35;
        starPos[i * 3 + 1] = Math.sin(angle) * rad * 0.8 + (Math.random() - 0.5) * 2.5;
        starPos[i * 3 + 2] = (Math.random() - 0.5) * 8.0 - 3.5;
        starSizes[i] = 0.85 + Math.random() * 1.65;
      } else {
        starPos[i * 3] = (Math.random() - 0.5) * 34;
        starPos[i * 3 + 1] = (Math.random() - 0.42) * 22;
        starPos[i * 3 + 2] = -Math.random() * 24 - 1.0;
        starSizes[i] = 0.8 + Math.random() * 1.9;
      }

      starPhases[i] = Math.random() * Math.PI * 2;
      starSpeeds[i] = 0.9 + Math.random() * 2.5;
      const c = bokehPalette[i % bokehPalette.length];
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

    // 3. Drifting Pink & Violet Flower Petals (InstancedMesh)
    const petalCount = narrow || lowHardware ? 28 : 54;
    const petalGeo = new THREE.PlaneGeometry(0.26, 0.38, 4, 4);
    const pAttr = petalGeo.attributes.position;
    for (let i = 0; i < pAttr.count; i++) {
      const px = pAttr.getX(i);
      const py = pAttr.getY(i);
      pAttr.setZ(i, Math.sin(py * 5.8) * 0.042 - px * px * 0.48);
    }
    pAttr.needsUpdate = true;
    petalGeo.computeVertexNormals();

    const petalMat = new THREE.MeshStandardMaterial({
      map: petalTex,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      roughness: 0.4,
      metalness: 0.08,
      emissive: new THREE.Color('#9333EA'),
      emissiveIntensity: 0.34,
    });

    const petalMesh = new THREE.InstancedMesh(petalGeo, petalMat, petalCount);
    const petalColors = [
      new THREE.Color('#F472B6'),
      new THREE.Color('#E879F9'),
      new THREE.Color('#C084FC'),
      new THREE.Color('#A855F7'),
    ];
    const petalStates = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < petalCount; i++) {
      petalStates.push({
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.35) * 12,
        z: (Math.random() - 0.5) * 10 - 1.5,
        fallSpeed: 0.22 + Math.random() * 0.38,
        driftX: (Math.random() - 0.5) * 0.26,
        swayFreq: 0.5 + Math.random() * 1.1,
        phase: Math.random() * Math.PI * 2,
        rotSpeedX: (Math.random() - 0.5) * 1.1,
        rotSpeedY: (Math.random() - 0.5) * 1.3,
        scale: 0.65 + Math.random() * 0.85,
      });
      petalMesh.setColorAt(i, petalColors[i % petalColors.length]);
    }
    if (petalMesh.instanceColor) petalMesh.instanceColor.needsUpdate = true;
    scene.add(petalMesh);

    // 4. Translucent Glowing Amber Butterfly Rig
    const butterflyRig = createButterflyRig({ foreMaps, hindMaps, glowTexture: glowTex });
    butterflyRig.root.scale.setScalar(0.001);
    butterflyRig.root.visible = false;
    scene.add(butterflyRig.root);

    // 5. Scene 2 Morphing Stardust Swarm
    const swarmCount = narrow || lowHardware ? 950 : 1850;
    const swarmTarget = sampleButterflyWingPoints(swarmCount);
    const swarmStart = new Float32Array(swarmCount * 3);
    const swarmSeeds = new Float32Array(swarmCount);

    for (let i = 0; i < swarmCount; i++) {
      const r = 2.6 + Math.random() * 8.5;
      const a = Math.random() * Math.PI * 2;
      swarmStart[i * 3] = Math.cos(a) * r * (narrow ? 0.68 : 1.15);
      swarmStart[i * 3 + 1] = (Math.random() - 0.5) * 7.2;
      swarmStart[i * 3 + 2] = (Math.random() - 0.5) * 6.5 - 0.5;
      swarmSeeds[i] = Math.random();
    }

    const swarmGeo = new THREE.BufferGeometry();
    swarmGeo.setAttribute('position', new THREE.BufferAttribute(swarmStart, 3));
    swarmGeo.setAttribute('aTarget', new THREE.BufferAttribute(swarmTarget, 3));
    swarmGeo.setAttribute('aSeed', new THREE.BufferAttribute(swarmSeeds, 1));

    const swarmMat = createMorphSwarmMaterial();
    swarmMat.uniforms.uPixelRatio.value = pixelRatio;
    const swarmPoints = new THREE.Points(swarmGeo, swarmMat);
    scene.add(swarmPoints);

    // 6. Wingtip Fairy-Dust Curl Trails & Click Spark Pool
    const trailPoolSize = narrow || lowHardware ? 550 : 950;
    const trailPos = new Float32Array(trailPoolSize * 3);
    const trailVel = new Float32Array(trailPoolSize * 3);
    const trailLife = new Float32Array(trailPoolSize);
    const trailMaxLife = new Float32Array(trailPoolSize);
    const trailSizes = new Float32Array(trailPoolSize);
    const trailTints = new Float32Array(trailPoolSize * 3);

    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
    trailGeo.setAttribute('aLife', new THREE.BufferAttribute(trailLife, 1));
    trailGeo.setAttribute('aSize', new THREE.BufferAttribute(trailSizes, 1));
    trailGeo.setAttribute('aTint', new THREE.BufferAttribute(trailTints, 3));

    const trailMat = createTrailBurstMaterial();
    trailMat.uniforms.uPixelRatio.value = pixelRatio;
    const trailPoints = new THREE.Points(trailGeo, trailMat);
    trailPoints.frustumCulled = false;
    scene.add(trailPoints);

    let trailCursor = 0;
    const emitSpark = (x, y, z, vx, vy, vz, size, maxLife, gold = true) => {
      const idx = trailCursor;
      trailCursor = (trailCursor + 1) % trailPoolSize;

      trailPos[idx * 3] = x;
      trailPos[idx * 3 + 1] = y;
      trailPos[idx * 3 + 2] = z;

      trailVel[idx * 3] = vx;
      trailVel[idx * 3 + 1] = vy;
      trailVel[idx * 3 + 2] = vz;

      trailMaxLife[idx] = maxLife;
      trailLife[idx] = 0.002;
      trailSizes[idx] = size;

      if (gold) {
        trailTints[idx * 3] = 1.0;
        trailTints[idx * 3 + 1] = 0.8 + Math.random() * 0.18;
        trailTints[idx * 3 + 2] = 0.34 + Math.random() * 0.34;
      } else {
        trailTints[idx * 3] = 0.94;
        trailTints[idx * 3 + 1] = 0.68;
        trailTints[idx * 3 + 2] = 1.0;
      }
    };

    const emitBurst = (originVec, count = 64, speed = 2.5) => {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const spd = speed * (0.3 + Math.random() * 0.85);
        emitSpark(
          originVec.x + (Math.random() - 0.5) * 0.25,
          originVec.y + (Math.random() - 0.5) * 0.25,
          originVec.z + (Math.random() - 0.5) * 0.2,
          Math.sin(phi) * Math.cos(theta) * spd,
          Math.cos(phi) * spd * 0.8 + 0.28,
          Math.sin(phi) * Math.sin(theta) * spd * 0.6,
          2.0 + Math.random() * 3.0,
          0.9 + Math.random() * 0.85,
          i % 6 !== 0
        );
      }
    };

    // 7. Curved 3D Flight Spline (Scenes 3 & 4 around the visible photo cards -> Scene 5 hover)
    const xAmp = narrow ? 1.15 : 2.35;
    const flightCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.15, 0.2),
      new THREE.Vector3(-xAmp * 0.9, 1.05, 1.4),
      new THREE.Vector3(xAmp * 0.85, 0.85, 0.6),
      new THREE.Vector3(-xAmp * 0.55, -0.45, 1.5),
      new THREE.Vector3(xAmp * 0.95, 0.15, 1.2),
      new THREE.Vector3(-xAmp * 0.7, 1.15, 0.8),
      new THREE.Vector3(0, narrow ? 1.85 : 1.45, 0.65),
    ]);

    // 8. Pointer Interaction & Butterfly Raycasting
    const pointerNDC = new THREE.Vector2(0, 0);
    const smoothPointer = new THREE.Vector2(0, 0);
    const pointerWorld = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    let burstFlutter = 0;

    const updatePointer = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointerNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerMove = (e) => {
      updatePointer(e.clientX, e.clientY);
      if (showNameRef.current) {
        canvas.style.cursor = 'pointer';
        return;
      }
      if (butterflyRig.root.visible) {
        raycaster.setFromCamera(pointerNDC, camera);
        const hits = raycaster.intersectObjects(butterflyRig.clickableTargets, false);
        canvas.style.cursor = hits.length > 0 ? 'pointer' : 'default';
      }
    };

    const handlePointerDown = (e) => {
      // Ignore DOM button/card/modal clicks
      if (e.target !== canvas) return;
      updatePointer(e.clientX, e.clientY);
      raycaster.setFromCamera(pointerNDC, camera);

      if (butterflyRig.root.visible) {
        const bfHits = raycaster.intersectObjects(butterflyRig.clickableTargets, false);
        if (bfHits.length > 0) {
          burstFlutter = 1.0;
          soundFx.playHarmonicChime();
          const bPos = new THREE.Vector3();
          butterflyRig.root.getWorldPosition(bPos);
          emitBurst(bPos, 85, 3.2);
          if (!showNameRef.current) {
            openNextButterflyMemory();
          }
          return;
        }
      }

      const dir = raycaster.ray.direction.clone().normalize();
      const targetPt = raycaster.ray.origin.clone().addScaledVector(dir, baseCamZ * 0.85);
      if (showNameRef.current) {
        soundFx.playHarmonicChime();
        emitBurst(targetPt, 56, 2.6);
      } else {
        soundFx.playClick();
        emitBurst(targetPt, 36, 2.2);
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);

    const handleResize = () => {
      if (isDisposed) return;
      const w = Math.max(window.innerWidth || 375, 320);
      const h = Math.max(window.innerHeight || 667, 320);
      const isSm = w < 768;
      camera.fov = isSm ? 56 : 46;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let prevNow = performance.now();
    let elapsed = 0;
    let sceneElapsed = 0;
    let birthBurstFired = false;

    const tmpVec = new THREE.Vector3();
    const tmpTangent = new THREE.Vector3();
    const bfPos = new THREE.Vector3(0, 0.15, 0.2);
    const wingPosL = new THREE.Vector3();
    const wingPosR = new THREE.Vector3();
    const hindPosL = new THREE.Vector3();
    const hindPosR = new THREE.Vector3();
    const bodyPos = new THREE.Vector3();

    const animate = (now) => {
      if (isDisposed) return;
      animFrameId = requestAnimationFrame(animate);

      const dt = Math.min((now - prevNow) / 1000, 0.05);
      prevNow = now;
      elapsed += dt;

      if (skipRef.current && sceneElapsed < TIMELINE.INTERACTIVE_READY) {
        sceneElapsed = TIMELINE.INTERACTIVE_READY + 0.4;
        birthBurstFired = true;
      } else if (!isPausedRef.current) {
        sceneElapsed += dt;
      }

      syncDomFromTime(sceneElapsed);

      smoothPointer.lerp(pointerNDC, 0.08);
      pointerWorld.set(smoothPointer.x * 6.0, smoothPointer.y * 4.0, 0);
      burstFlutter = Math.max(0, burstFlutter - dt * 1.85);

      const universeFade = easeOutCubic(sceneElapsed / 2.2);
      starMat.uniforms.uTime.value = elapsed;
      starMat.uniforms.uOpacity.value = universeFade;
      petalMat.opacity = universeFade * 0.85;

      // Drift nebula sprites gently
      nebulaEntries.forEach((n, idx) => {
        n.sprite.position.x = n.x + Math.sin(elapsed * n.speed + idx) * 0.8;
        n.sprite.position.y = n.y + Math.cos(elapsed * n.speed * 1.2 + idx) * 0.45;
        n.mat.opacity = universeFade * n.opacity * (0.88 + 0.12 * Math.sin(elapsed * 0.55 + idx));
      });

      // Float rose/violet petals softly downward
      for (let i = 0; i < petalCount; i++) {
        const p = petalStates[i];
        p.y -= p.fallSpeed * dt;
        p.x += (Math.sin(elapsed * p.swayFreq + p.phase) * 0.3 + p.driftX) * dt;
        if (p.y < -4.2) {
          p.y = 7.0 + Math.random() * 2.5;
          p.x = (Math.random() - 0.5) * 18;
        }
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.set(
          elapsed * p.rotSpeedX + p.phase,
          elapsed * p.rotSpeedY,
          Math.sin(elapsed * 0.8 + p.phase) * 0.6
        );
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        petalMesh.setMatrixAt(i, dummy.matrix);
      }
      petalMesh.instanceMatrix.needsUpdate = true;

      // Scene 2 morph vortex -> golden butterfly appearance
      const morphT = easeInOutCubic(
        (sceneElapsed - TIMELINE.MORPH_START) / (TIMELINE.MORPH_END - TIMELINE.MORPH_START)
      );
      const disperseT = easeOutCubic((sceneElapsed - (TIMELINE.MORPH_END - 0.25)) / 1.35);

      swarmMat.uniforms.uTime.value = elapsed;
      swarmMat.uniforms.uMorph.value = morphT;
      swarmMat.uniforms.uDisperse.value = disperseT;
      swarmMat.uniforms.uGlobalOpacity.value = universeFade;
      swarmMat.uniforms.uPointer.value.copy(pointerWorld);

      const bfAppear = easeOutCubic((sceneElapsed - TIMELINE.BUTTERFLY_BORN) / 1.0);
      if (bfAppear > 0.01) {
        butterflyRig.root.visible = true;
        const baseScale = narrow ? 0.72 : 0.94;
        const popScale =
          baseScale * (bfAppear < 1 ? bfAppear * (1.0 + Math.sin(bfAppear * Math.PI) * 0.12) : 1.0);
        butterflyRig.root.scale.setScalar(popScale);

        if (!birthBurstFired && sceneElapsed >= TIMELINE.BUTTERFLY_BORN + 0.3) {
          birthBurstFired = true;
          emitBurst(new THREE.Vector3(0, 0.15, 0.2), 95, 2.8);
        }
      }

      // Butterfly flight path & wingbeat
      if (sceneElapsed < TIMELINE.FLIGHT_START) {
        bfPos.set(0, 0.18 + Math.sin(elapsed * 1.5) * 0.1, 0.2);
        butterflyRig.root.rotation.set(0.06, smoothPointer.x * 0.24, smoothPointer.y * 0.1);
        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 5.6,
          amplitude: 0.88,
          burst: burstFlutter,
        });
      } else if (sceneElapsed < TIMELINE.NAME_REVEAL) {
        const rawT = clamp01(
          (sceneElapsed - TIMELINE.FLIGHT_START) / (TIMELINE.NAME_REVEAL - TIMELINE.FLIGHT_START)
        );
        const flightT = easeInOutCubic(rawT);
        flightCurve.getPointAt(flightT, bfPos);
        flightCurve.getTangentAt(flightT, tmpTangent);

        butterflyRig.root.rotation.y = Math.atan2(tmpTangent.x, tmpTangent.z) * 0.36;
        butterflyRig.root.rotation.z = -tmpTangent.x * 0.4;
        butterflyRig.root.rotation.x = tmpTangent.y * 0.22 + 0.08;

        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 8.2,
          amplitude: 0.95,
          burst: burstFlutter,
        });
      } else {
        const hoverY = (narrow ? 1.85 : 1.48) + Math.sin(elapsed * 1.45) * 0.14;
        const hoverX = Math.sin(elapsed * 0.6) * 0.24 + smoothPointer.x * 0.6;
        const hoverZ = 0.65 + smoothPointer.y * 0.25;
        bfPos.lerp(tmpVec.set(hoverX, hoverY, hoverZ), 0.075);

        butterflyRig.root.rotation.y = smoothPointer.x * 0.42 + Math.sin(elapsed * 0.65) * 0.12;
        butterflyRig.root.rotation.z = -smoothPointer.x * 0.2;
        butterflyRig.root.rotation.x = smoothPointer.y * 0.14 + 0.1;

        updateButterflyWingbeat(butterflyRig, elapsed, {
          flapRate: 6.0,
          amplitude: 0.9,
          burst: burstFlutter,
        });
      }

      butterflyRig.root.position.copy(bfPos);
      corePoint.position.set(bfPos.x, bfPos.y, bfPos.z + 1.5);

      // Pulse golden core glow gently
      const corePulse = 0.72 + Math.sin(elapsed * 3.8) * 0.1;
      butterflyRig.coreGlowSprite.scale.set(corePulse, corePulse, 1);

      // Delicate golden fairy-dust trails billowing behind both wings (sparser in finale)
      if (butterflyRig.root.visible) {
        butterflyRig.leftTipSocket.getWorldPosition(wingPosL);
        butterflyRig.rightTipSocket.getWorldPosition(wingPosR);
        butterflyRig.leftHindSocket.getWorldPosition(hindPosL);
        butterflyRig.rightHindSocket.getWorldPosition(hindPosR);
        butterflyRig.bodySocket.getWorldPosition(bodyPos);

        const curlS = Math.sin(elapsed * 3.2);
        const curlC = Math.cos(elapsed * 3.2);
        const isFinaleHover = sceneElapsed >= TIMELINE.NAME_REVEAL;
        const tipProb = isFinaleHover ? 0.22 : 0.65;
        const secondaryProb = isFinaleHover ? 0.08 : 0.32;

        if (Math.random() < tipProb) {
          emitSpark(
            wingPosL.x,
            wingPosL.y,
            wingPosL.z - 0.12,
            -0.38 + curlC * 0.2,
            -0.16 + curlS * 0.22,
            -0.25,
            1.3 + Math.random() * 1.4,
            isFinaleHover ? 0.68 : 0.88,
            true
          );
          emitSpark(
            wingPosR.x,
            wingPosR.y,
            wingPosR.z - 0.12,
            0.38 - curlC * 0.2,
            -0.16 + curlS * 0.22,
            -0.25,
            1.3 + Math.random() * 1.4,
            isFinaleHover ? 0.68 : 0.88,
            true
          );
        }

        if (Math.random() < secondaryProb) {
          emitSpark(
            hindPosL.x,
            hindPosL.y,
            hindPosL.z - 0.1,
            -0.24 + (Math.random() - 0.5) * 0.2,
            -0.24 - Math.random() * 0.15,
            -0.15,
            1.1 + Math.random() * 1.2,
            0.85,
            true
          );
          emitSpark(
            hindPosR.x,
            hindPosR.y,
            hindPosR.z - 0.1,
            0.24 + (Math.random() - 0.5) * 0.2,
            -0.24 - Math.random() * 0.15,
            -0.15,
            1.1 + Math.random() * 1.2,
            0.85,
            true
          );
          emitSpark(
            bodyPos.x + (Math.random() - 0.5) * 0.14,
            bodyPos.y,
            bodyPos.z - 0.1,
            (Math.random() - 0.5) * 0.16,
            -0.28 - Math.random() * 0.16,
            0,
            1.4 + Math.random() * 1.1,
            0.9,
            Math.random() > 0.25
          );
        }
      }

      // Advance active trail particles
      for (let i = 0; i < trailPoolSize; i++) {
        const life = trailLife[i];
        if (life <= 0) continue;
        const nextLife = life + dt / trailMaxLife[i];
        if (nextLife >= 1.0) {
          trailLife[i] = 0;
        } else {
          trailLife[i] = nextLife;
          trailPos[i * 3] += trailVel[i * 3] * dt;
          trailPos[i * 3 + 1] += trailVel[i * 3 + 1] * dt;
          trailPos[i * 3 + 2] += trailVel[i * 3 + 2] * dt;
          trailVel[i * 3] *= 0.98;
          trailVel[i * 3 + 1] = trailVel[i * 3 + 1] * 0.98 - 0.08 * dt;
          trailVel[i * 3 + 2] *= 0.98;
        }
      }
      trailGeo.attributes.position.needsUpdate = true;
      trailGeo.attributes.aLife.needsUpdate = true;

      // Subtle camera parallax response
      camera.position.x += (smoothPointer.x * 0.42 - camera.position.x) * 0.04;
      camera.position.y += (0.25 + smoothPointer.y * 0.28 - camera.position.y) * 0.04;
      camera.lookAt(0, 0.1, 0);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(animate);

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      canvas.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);

      butterflyRig.dispose();
      starGeo.dispose();
      starMat.dispose();
      swarmGeo.dispose();
      swarmMat.dispose();
      trailGeo.dispose();
      trailMat.dispose();
      petalGeo.dispose();
      petalMat.dispose();
      petalTex.dispose();
      nebulaTexList.forEach((t) => t.dispose());
      nebulaEntries.forEach((n) => n.mat.dispose());
      renderer.dispose();
    };
  }, [use2DFallback, replaySeed, openNextButterflyMemory, syncDomFromTime]);

  // =========================================================================
  // 2D Canvas Fallback (#be-canvas-2d) when WebGL is disabled / reduced-motion
  // =========================================================================
  useEffect(() => {
    if (!use2DFallback) return;

    const canvas = canvas2dRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let isDisposed = false;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth || 375;
      const h = window.innerHeight || 667;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener('resize', setSize);

    const stars = Array.from({ length: 85 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.9 + Math.random() * 2.1,
      phase: Math.random() * Math.PI * 2,
      gold: Math.random() > 0.18,
    }));

    const petals = Array.from({ length: 24 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vy: 0.04 + Math.random() * 0.05,
      size: 5 + Math.random() * 6,
      phase: Math.random() * Math.PI * 2,
      pink: Math.random() > 0.45,
    }));

    let prev = performance.now();
    let elapsed = 0;
    let sceneElapsed = 0;

    const draw = (now) => {
      if (isDisposed) return;
      animId = requestAnimationFrame(draw);

      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      elapsed += dt;

      if (skipRef.current && sceneElapsed < TIMELINE.INTERACTIVE_READY) {
        sceneElapsed = TIMELINE.INTERACTIVE_READY + 0.4;
      } else if (!isPausedRef.current) {
        sceneElapsed += dt;
      }
      syncDomFromTime(sceneElapsed);

      const w = window.innerWidth || 375;
      const h = window.innerHeight || 667;
      ctx.clearRect(0, 0, w, h);

      // Golden stardust bokeh
      stars.forEach((s) => {
        const a = 0.35 + 0.55 * Math.sin(elapsed * 2 + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(255, 224, 138, ${a})`
          : `rgba(226, 198, 255, ${a * 0.85})`;
        ctx.fill();
      });

      // Falling pink & purple petals
      petals.forEach((p) => {
        p.y = (p.y + p.vy * dt) % 1.08;
        const px = p.x * w + Math.sin(elapsed + p.phase) * 18;
        const py = p.y * h;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(elapsed * 0.7 + p.phase);
        ctx.scale(1, 0.65);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.pink ? 'rgba(244, 114, 182, 0.72)' : 'rgba(192, 132, 252, 0.7)';
        ctx.fill();
        ctx.restore();
      });

      // Glowing amber translucent butterfly silhouette
      const bfAlpha = clamp01((sceneElapsed - 1.2) / 1.2);
      if (bfAlpha > 0.02) {
        const bx = w * 0.5 + Math.sin(elapsed * 0.7) * 24;
        const by =
          sceneElapsed >= TIMELINE.NAME_REVEAL
            ? h * 0.33 + Math.sin(elapsed * 1.4) * 8
            : h * 0.47 + Math.sin(elapsed * 1.4) * 10;
        const flap = 0.58 + 0.42 * Math.sin(elapsed * 5.8);
        const wingScale = (w < 640 ? 48 : 68) * bfAlpha;

        ctx.save();
        ctx.translate(bx, by);

        // Abdomen warm glow
        const coreGrad = ctx.createRadialGradient(0, 12, 2, 0, 8, wingScale * 0.55);
        coreGrad.addColorStop(0, 'rgba(255, 248, 205, 0.95)');
        coreGrad.addColorStop(0.5, 'rgba(245, 180, 65, 0.35)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(0, 8, wingScale * 0.55, 0, Math.PI * 2);
        ctx.fill();

        [-1, 1].forEach((side) => {
          ctx.save();
          ctx.scale(side * flap, 1);
          // Forewing
          ctx.beginPath();
          ctx.moveTo(0, 2);
          ctx.bezierCurveTo(wingScale * 0.45, -wingScale * 0.8, wingScale * 1.15, -wingScale * 0.9, wingScale, -wingScale * 0.15);
          ctx.bezierCurveTo(wingScale * 0.85, wingScale * 0.15, wingScale * 0.2, wingScale * 0.12, 0, 6);
          ctx.closePath();
          ctx.fillStyle = 'rgba(218, 122, 34, 0.72)';
          ctx.strokeStyle = 'rgba(255, 224, 150, 0.82)';
          ctx.lineWidth = 1.4;
          ctx.fill();
          ctx.stroke();

          // Hindwing
          ctx.beginPath();
          ctx.moveTo(0, 6);
          ctx.bezierCurveTo(wingScale * 0.55, wingScale * 0.08, wingScale * 0.72, wingScale * 0.62, wingScale * 0.25, wingScale * 0.68);
          ctx.bezierCurveTo(wingScale * 0.05, wingScale * 0.66, 0, wingScale * 0.35, 0, 6);
          ctx.closePath();
          ctx.fillStyle = 'rgba(202, 108, 28, 0.68)';
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        });

        ctx.restore();
      }
    };

    animId = requestAnimationFrame(draw);
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', setSize);
    };
  }, [use2DFallback, replaySeed, syncDomFromTime]);

  const activeSpotlight = spotlightIndex !== null ? allMemories[spotlightIndex] : null;

  const rootClassNames = [
    sceneState.showHorizon ? 'be-show-horizon' : '',
    sceneState.showName && spotlightIndex === null ? 'be-tap-ready' : '',
    isExiting ? 'be-exiting' : '',
    use2DFallback ? 'be-mode-2d' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div id="butterfly-effect" className={rootClassNames} onPointerDown={handleStageTap}>
      {/* Dual WebGL / 2D Fallback Canvases styled identically to butterflyEffect.css */}
      <canvas ref={webglCanvasRef} id="be-canvas-webgl" className="be-canvas" />
      <canvas ref={canvas2dRef} id="be-canvas-2d" className="be-canvas" />

      {/* Atmospheric Vignette & Twilight Reflective Horizon */}
      <div className="be-cosmic-vignette" aria-hidden="true" />
      <div className="be-horizon-floor" aria-hidden="true" />

      {/* Scene 1 Poetic Whisper */}
      <div className="be-scene1-wrap" aria-hidden="true">
        <p
          className={`be-scene1-quote ${
            sceneState.quotePhase === 'visible'
              ? 'is-visible'
              : sceneState.quotePhase === 'fading'
              ? 'is-fading'
              : ''
          }`}
        >
          “Before the universe knew her name, a golden spark took wing...”
        </p>
      </div>

      {/* Scene 4 Floating Translucent Glass Memory Cards */}
      <div className="be-photo-stage">
        {stageMemories.map((card, idx) => {
          const cardState = sceneState.cardStates[idx];
          const pos = isNarrow ? card.mobilePos : card.desktopPos;
          const stateClass =
            cardState === 'entering'
              ? 'is-entering'
              : cardState === 'leaving'
              ? 'is-leaving'
              : '';

          return (
            <button
              key={card.src}
              type="button"
              onClick={() => openMemoryBySrc(card.src)}
              className={`be-memory-card ${stateClass}`}
              style={{
                left: pos.left,
                top: pos.top,
                textAlign: 'left',
              }}
              aria-label={`View memory: ${card.shortLabel}`}
            >
              <div className="be-memory-frame">
                <img
                  src={card.src}
                  alt={card.shortLabel}
                  loading="eager"
                  style={{ objectPosition: card.objectPosition }}
                />
              </div>
              <p className="be-memory-caption">✦ {card.shortLabel}</p>
            </button>
          );
        })}
      </div>

      {/* Tap-Anywhere Floating Memory Cards (active when DHATHRI name appears) */}
      <div className="be-tap-stage" aria-live="polite">
        {tapMemories.map((item) => {
          const mem = allMemories[item.memoryIndex];
          if (!mem) return null;
          return (
            <div
              key={item.id}
              className={`be-tap-card ${item.isLeaving ? 'is-leaving' : ''}`}
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
                '--tap-tilt': `${item.tilt}deg`,
              }}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playClick();
                setSpotlightIndex(item.memoryIndex);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View memory: ${mem.shortLabel || mem.tag}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  soundFx.playClick();
                  setSpotlightIndex(item.memoryIndex);
                }
              }}
            >
              <button
                type="button"
                className="be-tap-close"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playClick();
                  dismissTapMemory(item.id);
                }}
                aria-label="Close memory card"
              >
                ×
              </button>
              <div className="be-tap-card-frame">
                <img
                  src={mem.src}
                  alt={mem.shortLabel || mem.tag}
                  loading="eager"
                  decoding="sync"
                  style={{ objectPosition: mem.objectPosition || 'center 22%' }}
                />
              </div>
              <p className="be-memory-caption">✦ {mem.shortLabel || mem.tag}</p>
            </div>
          );
        })}
      </div>

      {/* Scene 5 & 6: DHATHRI Golden Mirror Reveal + Explore CTA */}
      <div className="be-finale-overlay">
        <div className={`be-name-stage ${sceneState.showName ? 'is-visible' : ''}`}>
          <div className="be-name-halo" aria-hidden="true" />
          <h1 className="be-title-dhathri">DHATHRI</h1>
          <span className="be-title-reflection" aria-hidden="true">
            DHATHRI
          </span>
          <div className="be-gold-rule" aria-hidden="true" />
          <p className="be-tagline">“One little existence. A thousand beautiful memories.”</p>
        </div>

        <div className={`be-actions ${sceneState.showActions ? 'is-visible' : ''}`}>
          <button
            type="button"
            className="be-explore-btn"
            onClick={handleExploreUniverse}
          >
            <span>Explore Her Universe</span>
            <span aria-hidden="true">→</span>
          </button>

          <div className="be-replay-row">
            <button type="button" className="be-replay-inline" onClick={handleReplay}>
              ↻ Replay Intro
            </button>
            <span className="be-interact-hint">
              {hasInteracted
                ? '✦ Tap anywhere anytime for another memory'
                : '✦ Tip: Tap anywhere on screen for her memories'}
            </span>
          </div>
        </div>
      </div>

      {/* Minimal Top-Right Skip Pill */}
      <button
        type="button"
        className={`be-skip-btn ${!sceneState.showSkip ? 'is-hidden' : ''}`}
        onClick={handleSkipToReveal}
      >
        SKIP ›
      </button>

      {/* Interactive Photo Spotlight Modal */}
      <div
        className={`be-mem-modal ${activeSpotlight ? 'is-open' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          setSpotlightIndex(null);
        }}
      >
        {activeSpotlight && (
          <div className="be-mem-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="be-mem-close"
              onClick={() => {
                soundFx.playClick();
                setSpotlightIndex(null);
              }}
              aria-label="Close memory preview"
            >
              ×
            </button>

            <img
              src={activeSpotlight.src}
              alt={activeSpotlight.caption || activeSpotlight.shortLabel}
            />

            <p className="be-mem-modal-cap">
              ✦ {activeSpotlight.shortLabel || activeSpotlight.tag}
            </p>

            {activeSpotlight.caption && (
              <p
                style={{
                  margin: '0.45rem 0 0',
                  fontFamily: 'var(--font-italic)',
                  fontStyle: 'italic',
                  fontSize: '0.98rem',
                  lineHeight: 1.4,
                  color: '#f6ecd7',
                }}
              >
                “{activeSpotlight.caption}”
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '0.85rem',
                paddingTop: '0.55rem',
                borderTop: '1px solid rgba(232, 207, 142, 0.22)',
              }}
            >
              <button
                type="button"
                className="be-replay-inline"
                onClick={() => {
                  soundFx.playClick();
                  setSpotlightIndex((prev) => (prev - 1 + allMemories.length) % allMemories.length);
                }}
              >
                ‹ Prev
              </button>
              <span className="be-interact-hint">
                {spotlightIndex + 1} / {allMemories.length}
              </span>
              <button
                type="button"
                className="be-replay-inline"
                onClick={() => {
                  soundFx.playClick();
                  setSpotlightIndex((prev) => (prev + 1) % allMemories.length);
                }}
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
