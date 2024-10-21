import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const particleCount = 10000;
const sphereRadius = 6;
const timeScale = 0.5;
const noiseScale = 0.05; // Scale of the noise effect
const noiseSpeed = 0.5; // Speed of noise change

const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float r = 0.0, delta = 0.0, alpha = 1.0;
    vec2 cxy = 2.0 * gl_PointCoord - 1.0;
    r = dot(cxy, cxy);
    if (r > 1.0) {
      discard;
    }
    // Softer falloff for particle edges
    alpha = 1.0 - smoothstep(0.8, 1.0, r);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

const PlanetaryParticles = () => {
  const particles = useRef<THREE.Points>(null);

  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = sphereRadius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = sphereRadius * Math.cos(phi);
      positions[i3 + 2] = sphereRadius * Math.sin(phi) * Math.sin(theta);

      const hue = Math.random() * 60 + 180; // Blue to cyan range
      const lightness = 60 + Math.random() * 30;
      const color = new THREE.Color().setHSL(hue / 360, 1, lightness / 100);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.01 + Math.random() * 0.2;
    }

    return [positions, colors, sizes];
  }, []);

  const vortices = useMemo(() => {
    return Array(3)
      .fill(0)
      .map(() => ({
        center: new THREE.Vector3(
          Math.random() - 0.5,
          (Math.random() - 0.5) * 0.5, // Limit latitude range
          Math.random() - 0.5,
        )
          .normalize()
          .multiplyScalar(sphereRadius),
        strength: (Math.random() - 0.5) * 0.5,
        radius: 0.2 + Math.random() * 0.3,
      }));
  }, []);

  // Simple noise function
  const noise = (x: number, y: number, z: number) => {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);
    const A = p[X] + Y,
      AA = p[A] + Z,
      AB = p[A + 1] + Z;
    const B = p[X + 1] + Y,
      BA = p[B] + Z,
      BB = p[B + 1] + Z;
    return lerp(
      w,
      lerp(
        v,
        lerp(u, grad(p[AA], x, y, z), grad(p[BA], x - 1, y, z)),
        lerp(u, grad(p[AB], x, y - 1, z), grad(p[BB], x - 1, y - 1, z)),
      ),
      lerp(
        v,
        lerp(u, grad(p[AA + 1], x, y, z - 1), grad(p[BA + 1], x - 1, y, z - 1)),
        lerp(
          u,
          grad(p[AB + 1], x, y - 1, z - 1),
          grad(p[BB + 1], x - 1, y - 1, z - 1),
        ),
      ),
    );
  };

  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t: number, a: number, b: number) => a + t * (b - a);
  const grad = (hash: number, x: number, y: number, z: number) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
    return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
  };

  const p = useMemo(() => {
    const p = new Uint8Array(512);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 0; i < 256; i++) {
      const j = Math.floor(Math.random() * (256 - i)) + i;
      [p[i], p[j]] = [p[j], p[i]];
      p[i + 256] = p[i];
    }
    return p;
  }, []);
  const yAxis = new THREE.Vector3(0, 1, 0);
  const tempVector = new THREE.Vector3();
  const tempVector2 = new THREE.Vector3();

  useFrame(({ clock }) => {
    if (!particles.current) return;

    const time = clock.elapsedTime * timeScale;
    const positions = particles.current.geometry.attributes.position
      .array as Float32Array;
    const noiseTime = clock.elapsedTime * noiseSpeed;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      tempVector.fromArray(positions, i3);

      // Basic wind patterns based on latitude
      const latitude = Math.asin(tempVector.y / sphereRadius);
      let windSpeed =
        Math.cos(latitude * 2) * -0.002 +
        Math.sin(latitude * 3 + time * 0.1) * 0.001;

      // Rotate around y-axis for east-west movement
      tempVector.applyAxisAngle(yAxis, windSpeed);

      // Influence from vortices (high/low pressure systems)
      for (const vortex of vortices) {
        tempVector2.subVectors(vortex.center, tempVector);
        const distance = tempVector2.length();
        if (distance < vortex.radius) {
          const strength = vortex.strength * (1 - distance / vortex.radius);
          tempVector2
            .set(tempVector2.z, 0, -tempVector2.x)
            .normalize()
            .multiplyScalar(strength * 0.01);
          tempVector.add(tempVector2);
        }
      }

      // Add noise to the movement
      const noiseValue = noise(
        tempVector.x * noiseScale + noiseTime,
        tempVector.y * noiseScale + noiseTime,
        tempVector.z * noiseScale + noiseTime,
      );
      tempVector2
        .set(
          noise(
            tempVector.x * noiseScale,
            tempVector.y * noiseScale,
            noiseTime,
          ) - 0.5,
          noise(
            tempVector.y * noiseScale,
            tempVector.z * noiseScale,
            noiseTime,
          ) - 0.5,
          noise(
            tempVector.z * noiseScale,
            tempVector.x * noiseScale,
            noiseTime,
          ) - 0.5,
        )
        .normalize()
        .multiplyScalar(noiseValue * 0.005);

      tempVector.add(tempVector2);

      // Project back to sphere surface
      tempVector.normalize().multiplyScalar(sphereRadius);

      // Update position
      tempVector.toArray(positions, i3);
    }

    particles.current.geometry.attributes.position.needsUpdate = true;
    particles.current.rotation.y += 0.0005; // Slow rotation of the entire system
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.NormalBlending}
        depthWrite={false}
        transparent={true}
        vertexColors={true}
      />
    </points>
  );
};

export default PlanetaryParticles;
