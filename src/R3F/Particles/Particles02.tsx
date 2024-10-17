import { Hud, useFBO } from '@react-three/drei';
import {
  createPortal,
  extend,
  ReactThreeFiber,
  useFrame,
} from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SimulationMaterial from './SimulationMaterial';
// @ts-ignore
import vertexShader from './ParticleShader/vertex.glsl';
// @ts-ignore
import fragmentShader from './ParticleShader/fragment.glsl';

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

  const size = 1024 + 512;

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

  const insideColor = new THREE.Color('#ff6030');
  const outsideColor = new THREE.Color('#1b3984');

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

  const uniforms = useMemo(
    () => ({
      uPositions: {
        value: null,
      },
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
    // simulatorMatRef.current.uniforms.uFrequency.value = THREE.MathUtils.lerp(
    //   simulatorMatRef.current.uniforms.uFrequency.value,
    //   0.1,
    //   0.1,
    // );
  });

  return (
    // <Hud renderPriority={2}>
    //   <OrthographicCamera
    //     makeDefault
    //     top={1}
    //     right={1}
    //     bottom={-1}
    //     left={-1}
    //     near={-1}
    //     far={1}
    //   />
    <Hud renderPriority={2}>
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
            {/* <bufferAttribute
              attach={'attributes-color'}
              count={particlesPosition.length / 2}
              array={particlesPosition}
              itemSize={2}
            /> */}
          </bufferGeometry>
          <shaderMaterial
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
        </points>
      </group>
    </Hud>
    // </Hud>
  );
};

export default Particles02;
