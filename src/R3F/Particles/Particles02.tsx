import { useFBO } from '@react-three/drei';
import {
  createPortal,
  extend,
  ReactThreeFiber,
  useFrame,
} from '@react-three/fiber';
import { useControls } from 'leva';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SimulationMaterial from './SimulationMaterial';
// @ts-ignore
import vertexShader from './Particle02Shader/vertex.glsl';
// @ts-ignore
import fragmentShader from './Particle02Shader/fragment.glsl';

extend({ SimulationMaterial: SimulationMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Specify this as an instance of THREE.ShaderMaterial
      simulationMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      > & {
        args?: [number];
      };
    }
  }
}

const Particles02 = () => {
  const simulatorMatRef = useRef<THREE.ShaderMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // const size = 2048;
  // const size = 1024;
  const size = 512;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    -1,
    1,
    1,
    -1,
    1 / Math.pow(2, 53),
    1,
  );

  const positions = new Float32Array([
    -1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0,
  ]);

  const uvs = new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]);

  // const color001 = new THREE.Color('#FF4C00');
  const color002 = new THREE.Color('#BFB9FF');
  const color001 = new THREE.Color('#FFDBBA');
  // const color002 = new THREE.Color('#FFEEC8');

  const renderTarget = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particlesPosition = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }
    return particles;
  }, [size]);

  const colorArray = useMemo(() => {
    const length = size * size;
    const colors = new Float32Array(length * 3); // Store RGB for each particle
    for (let i = 0; i < length; i++) {
      const i3 = i * 3;
      // const randomFactor = Math.random(); // Random factor to determine color interpolation
      const color = color001.clone();
      color.lerp(color002, (Math.random() * 5) / 5);
      colors;
      colors[i3 + 0] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return colors;
  }, [size]);

  const particleControls = useControls({
    uFocus: { value: 5, min: 0, max: 15, step: 0.01 },
    uFov: { value: 50, min: 0, max: 200, step: 0.01 },
    uFrequency: { value: 0.2, min: 0.01, max: 0.75, step: 0.01 },
  });

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
      uFocus: { value: particleControls.uFocus },
      uFov: { value: particleControls.uFov },
    }),
    [],
  );

  useFrame((state) => {
    const { gl, clock } = state;

    if (!pointsRef.current) return;
    if (!simulatorMatRef.current) return;

    const elapsedTime = clock.getElapsedTime();

    // set rcurrent render target to fbo
    gl.setRenderTarget(renderTarget);
    gl.clear();
    // render the sim material with square geo in the render target
    gl.render(scene, camera);
    // revert to the default render target
    gl.setRenderTarget(null);

    const pointsMaterial = pointsRef.current.material as THREE.ShaderMaterial;
    pointsMaterial.uniforms.uPositions.value = renderTarget.texture;
    simulatorMatRef.current.uniforms.uTime.value = elapsedTime;
    pointsMaterial.uniforms.uFocus.value = THREE.MathUtils.lerp(
      pointsMaterial.uniforms.uFocus.value,
      particleControls.uFocus,
      0.1,
    );
    pointsMaterial.uniforms.uFov.value = THREE.MathUtils.lerp(
      pointsMaterial.uniforms.uFov.value,
      particleControls.uFov,
      0.1,
    );

    simulatorMatRef.current.uniforms.uFrequency.value = THREE.MathUtils.lerp(
      simulatorMatRef.current.uniforms.uFrequency.value,
      particleControls.uFrequency,
      0.1,
    );
  });

  return (
    <group position={[0, 0, 0]} frustumCulled={false} scale={4}>
      {createPortal(
        <mesh>
          <simulationMaterial ref={simulatorMatRef} args={[size]} />
          <bufferGeometry>
            <bufferAttribute
              attach={'attributes-position'}
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
            <bufferAttribute
              attach={'attributes-uv'}
              count={uvs.length / 2}
              array={uvs}
              itemSize={2}
            />
          </bufferGeometry>
        </mesh>,
        scene,
      )}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach={'attributes-position'}
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
          <bufferAttribute
            attach={'attributes-color'}
            count={colorArray.length / 3}
            array={colorArray}
            itemSize={3}
          />
        </bufferGeometry>
        <shaderMaterial
          blending={THREE.NormalBlending}
          depthWrite={false}
          transparent={true}
          uniforms={uniforms}
          vertexColors={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
    </group>
  );
};

export default Particles02;
