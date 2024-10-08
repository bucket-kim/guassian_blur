import { Hud, OrthographicCamera, shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import fragmentShader from './BackgroundShader/fragment.glsl';
// @ts-ignore
import vertexShader from './BackgroundShader/vertex.glsl';

const BackgroundMaterial = shaderMaterial(
  {
    u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    u_scale: 16,
    u_Position: new THREE.Vector2(-1050, -750),
    u_BlurCirclePos: new THREE.Vector2(-440, 60),

    u_time: 0,
  },
  vertexShader,
  fragmentShader,
);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Specify this as an instance of THREE.ShaderMaterial
      backgroundMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

extend({ BackgroundMaterial });

const Background = () => {
  // Use typeof BackgroundMaterial to match the ref type
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { xPosition, yPosition, CircleXPos, CircleYPos, scale } = useControls(
    'Background',
    {
      xPosition: { value: -1050, min: -2000, max: 0, step: 10 }, // Control x axis
      yPosition: { value: -750, min: -2000, max: 0, step: 10 }, // Control y axis
      CircleXPos: { value: -440, min: -1000, max: 1000, step: 10 }, // Control y axis
      CircleYPos: { value: 60, min: -1000, max: 1000, step: 10 }, // Control y axis
      scale: { value: 16, min: 1, max: 50, step: 0.1 }, // Control scale
    },
  );

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    const getElapsedTime = clock.elapsedTime;
    // Access and update the shader material's uniforms
    materialRef.current.uniforms.u_time.value = getElapsedTime;
    materialRef.current.uniforms.u_Position.value.set(xPosition, yPosition);
    materialRef.current.uniforms.u_BlurCirclePos.value.set(
      CircleXPos,
      CircleYPos,
    );
    materialRef.current.uniforms.u_scale.value = scale;
  });

  return (
    <Hud>
      <OrthographicCamera
        makeDefault
        top={1}
        right={1}
        bottom={-1}
        left={-1}
        near={0}
        far={1}
      />
      <mesh renderOrder={1}>
        <planeGeometry args={[2, 2, 1, 1]} />

        {/* Attach ref to the material */}
        <backgroundMaterial ref={materialRef} />
      </mesh>
    </Hud>
  );
};

export default Background;
