import { shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import fragmentShader from './GradientShader/fragment.glsl';
// @ts-ignore
import vertexShader from './GradientShader/vertex.glsl';

const colors = ['#FF4C00', '#BFB9FF', '#FFDBBA', '#FFEEC8'];

const mapColors = colors.map((color) => new THREE.Color(color));

console.log(mapColors);

const GradientShaderMaterial = shaderMaterial(
  {
    u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    u_scale: 16,
    u_Position: new THREE.Vector2(-1050, -750),
    u_BlurCirclePos: new THREE.Vector2(-440, 60),
    u_colors: mapColors,
    u_time: 0,
  },
  vertexShader,
  fragmentShader,
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Specify this as an instance of THREE.ShaderMaterial
      gradientShaderMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ GradientShaderMaterial });

const GradientBackground = () => {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;

    const elapsedTime = clock.getElapsedTime();

    shaderRef.current.uniforms.u_time.value = elapsedTime * 0.005;
  });

  return (
    // <Hud>
    //   <OrthographicCamera
    //     makeDefault
    //     top={1}
    //     right={1}
    //     bottom={-1}
    //     left={-1}
    //     near={-10}
    //     far={10}
    //   />
    <mesh renderOrder={1}>
      <planeGeometry args={[2, 2, 300, 300]} />

      {/* Attach ref to the material */}
      <gradientShaderMaterial wireframe={false} ref={shaderRef} />
    </mesh>
    // </Hud>
  );
};

export default GradientBackground;
