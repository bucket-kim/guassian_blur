import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const particleCount = 10000;
const sphereRadius = 7;
const timeScale = 0.05;

// Perlin Noise Implementation
const permutation = new Uint8Array(512);
for (let i = 0; i < 256; i++) permutation[i] = i;
for (let i = 0; i < 256; i++) {
  const j = Math.floor(Math.random() * (256 - i)) + i;
  [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
  permutation[i + 256] = permutation[i];
}

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

     float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = 1.0 - strength;

    if (r > 1.0) {
      discard;
    }
    
    // Softer falloff for particle edges
    alpha = 1.0 - smoothstep(0.8, 1.0, r);

    vec3 color = mix(vColor, vColor, strength);

    gl_FragColor = vec4(color, strength);
  }
`;

const PlanetaryParticles02 = () => {
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

      // const hue = Math.random() * 60 + 180; // Blue to cyan range
      const hue = Math.random() * 60 + 180;
      const saturation = 0.5; // 50% saturation
      const lightness = 90 + Math.random() * 10;
      const color = new THREE.Color().setHSL(
        hue / 360,
        saturation,
        lightness / 100,
      );
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = 0.02 + Math.random() * 0.3; // Larger particle sizes
    }

    return [positions, colors, sizes];
  }, []);

  const vortices = useMemo(() => {
    return Array(3)
      .fill(0)
      .map(() => ({
        center: new THREE.Vector3(
          Math.random() - 0.5,
          (Math.random() - 0.5) * 0.5,
          Math.random() - 0.5,
        )
          .normalize()
          .multiplyScalar(sphereRadius),
        strength: (Math.random() - 0.5) * 0.5,
        radius: 0.2 + Math.random() * 0.3,
      }));
  }, []);

  const tempVector = new THREE.Vector3();
  const tempVortexVector = new THREE.Vector3();
  const tempPerpendicular = new THREE.Vector3();

  useFrame(({ clock }) => {
    if (!particles.current) return;

    const time = clock.elapsedTime * timeScale;
    const positions = particles.current.geometry.attributes.position
      .array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      tempVector.fromArray(positions, i3);

      // Convert to spherical coordinates
      const r = tempVector.length();
      let theta = Math.atan2(tempVector.z, tempVector.x);
      let phi = Math.acos(tempVector.y / r);

      // Basic wind patterns based on latitude
      const latitude = Math.asin(tempVector.y / sphereRadius);
      const latitudeCos = Math.cos(latitude * 2);
      const latitudeSin = Math.sin(latitude * 3);
      let windSpeed = latitudeCos * 0.011;

      // Enhanced y-direction (latitude) movement
      const yOffset = Math.sin(theta * 3 + time) * 0.001 * latitudeCos;
      phi += yOffset;

      // Add some north-south flow with longitudinal variation
      windSpeed += latitudeSin * Math.sin(theta + time) * 0.001;

      // Rotate around y-axis for east-west movement
      theta += windSpeed * 0.15;

      // Influence from vortices (high/low pressure systems)
      for (const vortex of vortices) {
        tempVortexVector.subVectors(vortex.center, tempVector);
        const distance = tempVortexVector.length();
        if (distance < vortex.radius) {
          const strength = vortex.strength * (1 - distance / vortex.radius) * 5;
          tempPerpendicular
            .set(tempVortexVector.z, 0, -tempVortexVector.x)
            .normalize();
          theta += tempPerpendicular.x * strength * 0.01;
          phi += tempPerpendicular.z * strength * 0.01;
        }
      }

      // Convert back to Cartesian coordinates
      const sinPhi = Math.sin(phi);
      tempVector.set(
        r * sinPhi * Math.cos(theta),
        r * Math.cos(phi),
        r * sinPhi * Math.sin(theta),
      );

      // Update position
      tempVector.toArray(positions, i3);
    }

    particles.current.geometry.attributes.position.needsUpdate = true;
    particles.current.rotation.y += 0.0005; // Slow rotation of the entire system
  });

  return (
    <points ref={particles} scale={1.0} visible={true}>
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

export default PlanetaryParticles02;
