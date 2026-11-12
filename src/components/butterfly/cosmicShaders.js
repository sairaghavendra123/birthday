import * as THREE from 'three';

/**
 * Bokeh stardust field — crisp warm champagne pinpoints paired with soft golden orbs
 * drifting gently across the midnight purple cosmos.
 */
export function createStarfieldMaterial() {
  return new THREE.ShaderMaterial({
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
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.22 + aPhase) * 0.28;
        pos.x += cos(uTime * 0.16 + aPhase * 0.8) * 0.22;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float twinkle = 0.48 + 0.52 * sin(uTime * aSpeed + aPhase);
        vAlpha = twinkle;
        vColor = aColor;

        float dist = max(6.0, -mvPosition.z);
        gl_PointSize = clamp(aSize * uPixelRatio * (115.0 / dist), 1.4, 15.0);
      }
    `,
    fragmentShader: `
      uniform float uOpacity;
      varying float vAlpha;
      varying vec3 vColor;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        // Soft glowing bokeh orb with warm bright core
        float core = exp(-d * d * 24.0);
        float halo = exp(-d * d * 7.5) * 0.55;
        float intensity = (core + halo) * vAlpha * uOpacity;

        gl_FragColor = vec4(vColor * (0.95 + core * 0.35), clamp(intensity, 0.0, 0.92));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/**
 * Scene 2 swirling golden vortex particle swarm coalescing smoothly into the butterfly wings.
 */
export function createMorphSwarmMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uDisperse: { value: 0 },
      uGlobalOpacity: { value: 1 },
      uPixelRatio: { value: 1 },
      uPointer: { value: new THREE.Vector3() },
    },
    vertexShader: `
      attribute vec3 aTarget;
      attribute float aSeed;
      uniform float uTime;
      uniform float uMorph;
      uniform float uDisperse;
      uniform float uPixelRatio;
      uniform vec3 uPointer;
      varying float vAlpha;
      varying float vSeed;

      void main() {
        vSeed = aSeed;

        float swirlAngle = (1.0 - uMorph) * (aSeed * 6.28 + uTime * 1.15) * 1.4;
        float cosA = cos(swirlAngle);
        float sinA = sin(swirlAngle);
        vec3 swirledStart = vec3(
          position.x * cosA - position.z * sinA,
          position.y + sin(uTime * 1.5 + aSeed * 10.0) * 0.32 * (1.0 - uMorph),
          position.x * sinA + position.z * cosA
        );

        vec3 basePos = mix(swirledStart, aTarget, uMorph);

        float dispAngle = aSeed * 6.2831;
        vec3 dispDir = vec3(cos(dispAngle), sin(dispAngle) * 0.7 + 0.3, sin(aSeed * 12.0));
        basePos += dispDir * uDisperse * 2.6;

        float shimmer = sin(uTime * 3.0 + aSeed * 18.0) * 0.035;
        basePos += normalize(basePos + vec3(0.001)) * shimmer;

        float pointerDist = length(basePos.xy - uPointer.xy);
        if (pointerDist < 2.2) {
          basePos.xy += normalize(basePos.xy - uPointer.xy + vec2(0.001)) * (2.2 - pointerDist) * 0.14;
        }

        vec4 mvPosition = modelViewMatrix * vec4(basePos, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float dist = max(3.5, -mvPosition.z);
        gl_PointSize = clamp((2.6 + aSeed * 3.4) * uPixelRatio * (46.0 / dist), 1.8, 18.0);
        vAlpha = (1.0 - uDisperse) * (0.48 + 0.52 * uMorph);
      }
    `,
    fragmentShader: `
      uniform float uGlobalOpacity;
      varying float vAlpha;
      varying float vSeed;

      void main() {
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        float glow = exp(-d * d * 12.0);
        vec3 goldA = vec3(1.0, 0.88, 0.52);
        vec3 goldB = vec3(1.0, 0.72, 0.28);
        vec3 tint = mix(goldB, goldA, vSeed);

        gl_FragColor = vec4(tint * 1.15, clamp(glow * vAlpha * uGlobalOpacity, 0.0, 0.95));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

/**
 * Luminous golden fairy-dust trails billowing behind the butterfly wings and click bursts.
 */
export function createTrailBurstMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uPixelRatio: { value: 1 },
    },
    vertexShader: `
      attribute float aLife;
      attribute float aSize;
      attribute vec3 aTint;
      uniform float uPixelRatio;
      varying float vLife;
      varying vec3 vTint;

      void main() {
        vLife = aLife;
        vTint = aTint;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        float lifeScale = sin(clamp(aLife, 0.0, 1.0) * 3.14159);
        float dist = max(3.0, -mvPosition.z);
        gl_PointSize = clamp(aSize * lifeScale * uPixelRatio * (52.0 / dist), 0.0, 22.0);
      }
    `,
    fragmentShader: `
      varying float vLife;
      varying vec3 vTint;

      void main() {
        if (vLife <= 0.001 || vLife >= 0.999) discard;

        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        if (d > 0.5) discard;

        float core = exp(-d * d * 18.0);
        float halo = exp(-d * d * 6.5) * 0.45;
        float fade = (1.0 - vLife) * smoothstep(0.0, 0.14, vLife);

        gl_FragColor = vec4(vTint * (1.05 + core * 0.3), clamp((core + halo) * fade, 0.0, 0.95));
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}
