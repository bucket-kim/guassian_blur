import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
//@ts-ignore
import vertexShader from './ParticleShader/vertex.glsl';
//@ts-ignore
import fragmentShader from './ParticleShader/fragment.glsl';

const Particles = () => {
  const pointsRef = useRef<THREE.Points>(null);

  const count = 12000;

  const radius = 4;

  const particlePosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    // const distance = 1;

    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);

      let x = distance * Math.sin(theta) * Math.cos(phi) * 4;
      let y = distance * Math.sin(theta) * Math.sin(phi) * 4;
      let z = distance * Math.cos(theta) * 4;

      positions.set([x, y, z], i * 3);
    }

    return positions;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      uRadius: {
        value: radius,
      },
    }),
    [],
  );

  useFrame((state) => {
    const { clock } = state;
    const elapsedTime = clock.getElapsedTime();

    if (!pointsRef.current) return;

    const material = pointsRef.current.material as THREE.ShaderMaterial;

    material.uniforms.uTime.value = elapsedTime * 0.001;

    // for (let i = 0; i < count; i++) {
    //   const i3 = i * 3;

    //   pointsRef.current.geometry.attributes.position.array[i3] +=
    //     Math.sin(elapsedTime + Math.random() * 10) * 0.01;
    //   pointsRef.current.geometry.attributes.position.array[i3 + 1] +=
    //     Math.cos(elapsedTime + Math.random() * 10) * 0.01;
    //   pointsRef.current.geometry.attributes.position.array[i3 + 2] +=
    //     Math.sin(elapsedTime + Math.random() * 10) * 0.01;
    // }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlePosition.length / 3}
          array={particlePosition}
          itemSize={3}
          normalized={false}
        />
      </bufferGeometry>
      <shaderMaterial
        transparent={true}
        depthWrite={false}
        vertexColors={true}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default Particles;
