import * as THREE from 'three';

/**
 * Creates a custom ShaderMaterial for thousands of gently twinkling cosmic stars.
 */
export function createStarfieldMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
    },
    vertexShader: `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      attribute vec3 aColor;

      varying float vTwinkle;
      varying vec3 vColor;

      uniform float uTime;
      uniform float uPixelRatio;

      void main() {
        vColor = aColor;
        vTwinkle = 0.5 + 0.5 * sin(uTime * aSpeed + aPhase);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        float distScale = 240.0 / max(1.0, -mvPosition.z);
        gl_PointSize = clamp(aSize * uPixelRatio * distScale * (0.72 + 0.45 * vTwinkle), 1.0, 26.0);
      }
    `,
    fragmentShader: `
      varying float vTwinkle;
      varying vec3 vColor;
      uniform float uOpacity;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        float core = exp(-d * d * 26.0);
        float halo = smoothstep(0.5, 0.0, d) * 0.42;
        float alpha = (core + halo) * (0.45 + 0.55 * vTwinkle) * uOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
  });
}

/**
 * GPU-driven golden particle swarm that drifts as cosmic dust in Scene 1,
 * vortex-morphs into the exact butterfly wing silhouette in Scene 2,
 * and disperses smoothly while reacting gently to cursor movement.
 */
export function createMorphSwarmMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uDisperse: { value: 0 },
      uGlobalOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uButterflyCenter: { value: new THREE.Vector3(0, 0.2, 0) },
    },
    vertexShader: `
      attribute vec3 aTarget;
      attribute float aSeed;
      attribute float aSize;

      varying float vAlpha;
      varying float vHeat;

      uniform float uTime;
      uniform float uMorph;
      uniform float uDisperse;
      uniform float uGlobalOpacity;
      uniform float uPixelRatio;
      uniform vec3 uPointer;
      uniform vec3 uButterflyCenter;

      void main() {
        // Gentle orbital drift in dust phase
        float driftAngle = uTime * (0.18 + aSeed * 0.25) + aSeed * 6.2831;
        vec3 dustPos = position;
        dustPos.x += cos(driftAngle) * 0.45;
        dustPos.y += sin(driftAngle * 1.3) * 0.38;
        dustPos.z += sin(driftAngle * 0.7) * 0.4;

        // Swirl vortex along morph path (peaks around uMorph = 0.5)
        float morphEase = smoothstep(0.0, 1.0, uMorph);
        float swirlStrength = sin(morphEase * 3.14159265) * 3.4;
        float angle = swirlStrength * (0.6 + aSeed * 0.9);
        float cs = cos(angle);
        float sn = sin(angle);

        vec3 targetWorld = aTarget + uButterflyCenter;
        vec3 blended = mix(dustPos, targetWorld, morphEase);

        // Rotate XY around butterfly center during formation vortex
        vec2 rel = blended.xy - uButterflyCenter.xy;
        vec2 rotated = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs);
        blended.xy = uButterflyCenter.xy + rotated;
        blended.z += sin(morphEase * 3.14159265 + aSeed * 9.0) * 1.2 * (1.0 - morphEase);

        // Expansion burst after butterfly materializes
        vec3 burstDir = normalize(vec3(
          cos(aSeed * 43.1),
          sin(aSeed * 29.7),
          sin(aSeed * 71.3) * 0.6
        ));
        blended += burstDir * uDisperse * (4.0 + aSeed * 6.0);

        // Soft pointer attraction / ripple reaction (guard against zero vector NaN)
        vec2 ptrDelta = blended.xy - uPointer.xy;
        float ptrDist = length(ptrDelta);
        float ptrForce = exp(-ptrDist * 0.45) * 0.55;
        vec2 ptrDir = ptrDist > 0.001 ? (ptrDelta / ptrDist) : vec2(0.0, 0.0);
        blended.xy += ptrDir * (-ptrForce * 0.35);
        blended.z += ptrForce * 0.65;

        vec4 mvPosition = modelViewMatrix * vec4(blended, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float shimmer = 0.7 + 0.3 * sin(uTime * 3.2 + aSeed * 19.0);
        vHeat = morphEase * (1.0 - uDisperse * 0.5);
        vAlpha = uGlobalOpacity * (1.0 - smoothstep(0.35, 1.0, uDisperse)) * shimmer;

        float distScale = 230.0 / max(1.0, -mvPosition.z);
        gl_PointSize = clamp(aSize * uPixelRatio * distScale * (0.85 + 0.5 * vHeat), 1.5, 34.0);
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      varying float vHeat;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        float glow = exp(-d * d * 18.0);
        vec3 goldWarm = vec3(0.98, 0.80, 0.34);
        vec3 goldBright = vec3(1.0, 0.96, 0.78);
        vec3 roseTint = vec3(0.95, 0.60, 0.88);
        vec3 col = mix(mix(goldWarm, roseTint, 0.14), goldBright, vHeat * glow);

        gl_FragColor = vec4(col, glow * vAlpha);
      }
    `,
  });
}

/**
 * Custom ShaderMaterial for pre-allocated trail + interactive click burst sparks.
 */
export function createTrailBurstMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uPixelRatio: { value: 1 },
    },
    vertexShader: `
      attribute float aLife;
      attribute float aSize;
      attribute vec3 aTint;

      varying float vLife;
      varying vec3 vTint;

      uniform float uPixelRatio;

      void main() {
        vLife = aLife;
        vTint = aTint;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float fadeScale = sin(clamp(aLife, 0.0, 1.0) * 3.14159265);
        float distScale = 220.0 / max(1.0, -mvPosition.z);
        gl_PointSize = clamp(aSize * uPixelRatio * distScale * fadeScale, 0.0, 42.0);
      }
    `,
    fragmentShader: `
      varying float vLife;
      varying vec3 vTint;

      void main() {
        if (vLife <= 0.001) discard;
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        float core = exp(-d * d * 22.0);
        float alpha = core * smoothstep(0.0, 0.18, vLife) * (1.0 - smoothstep(0.65, 1.0, vLife));
        gl_FragColor = vec4(vTint, alpha * 0.95);
      }
    `,
  });
}

/**
 * Dark cosmic radial vignette & ripple sheen placed just over the mirror Reflector
 * so the reflection blends smoothly into the midnight purple void without hard edges.
 */
export function createMirrorVignetteMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;

      void main() {
        vec2 centered = (vUv - 0.5) * 2.0;
        float dist = length(centered);

        // Subtle circular cosmic water ripples
        float ripple = sin(dist * 26.0 - uTime * 1.4) * 0.5 + 0.5;
        float fineRipple = sin(dist * 48.0 - uTime * 2.1 + centered.x * 4.0) * 0.5 + 0.5;

        // Smooth fade to pure void darkness near perimeter
        float edgeDark = smoothstep(0.18, 0.92, dist);
        vec3 mirrorTint = mix(
          vec3(0.04, 0.015, 0.09),
          vec3(0.015, 0.005, 0.035),
          edgeDark
        );

        vec3 goldHint = vec3(0.85, 0.68, 0.30) * ripple * fineRipple * (1.0 - edgeDark) * 0.07;
        float alpha = mix(0.46, 0.98, edgeDark) * (1.0 - (1.0 - uOpacity) * 0.85);
        gl_FragColor = vec4(mirrorTint + goldHint, alpha);
      }
    `,
  });
}

/**
 * Glowing champagne-gold + lavender halo shader rendered softly behind each revealed photo.
 */
export function createPhotoHaloMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform float uTime;
      uniform float uOpacity;

      void main() {
        vec2 p = abs(vUv - 0.5) * 2.0;
        float boxDist = max(p.x, p.y);
        float radial = length(p);

        // Crisp luminous rim glow just outside the photograph border
        float frameBand = exp(-pow((boxDist - 0.78) * 10.0, 2.0));
        float softAura = smoothstep(1.18, 0.45, radial) * 0.42;

        // Animated golden light sweep passing across the frame border
        float sweep = 0.5 + 0.5 * sin((vUv.x + vUv.y) * 5.0 - uTime * 2.2);

        vec3 gold = vec3(0.98, 0.82, 0.40);
        vec3 violet = vec3(0.68, 0.35, 0.98);
        vec3 col = mix(violet, gold, 0.65 + 0.35 * sweep);

        float alpha = (frameBand * (0.72 + 0.35 * sweep) + softAura) * uOpacity;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
