import { Hud, OrthographicCamera, shaderMaterial } from '@react-three/drei';
import { extend, ReactThreeFiber } from '@react-three/fiber';
import { Fragment, useRef } from 'react';
import * as THREE from 'three';
// @ts-ignore
import fragmentShader from './BackgroundShader/fragment.glsl';
// @ts-ignore
import vertexShader from './BackgroundShader/vertex.glsl';

const BackgroundMaterial = shaderMaterial(
  {
    u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    u_scale: 1,
    u_Position: new THREE.Vector2(0, 0),
    u_OrangeCircle: new THREE.Vector2(20, 230),
    u_PurpleCircle: new THREE.Vector2(-220, 240),
    u_BlueCircle: new THREE.Vector2(-390, 50),
    u_LightPinkCircle: new THREE.Vector2(-210, -180),
    u_Threshold: new THREE.Vector2(200, -400),
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

  return (
    <Fragment>
      {/* <mesh renderOrder={1}>
        <planeGeometry args={[2, 2, 1, 1]} />

        <backgroundMaterial ref={materialRef} />
      </mesh> */}
      <Hud renderPriority={1}>
        <OrthographicCamera
          makeDefault
          top={1}
          right={1}
          bottom={-1}
          left={-1}
          near={-1}
          far={1}
        />
        <mesh>
          <planeGeometry args={[2, 2, 1, 1]} />
          <backgroundMaterial ref={materialRef} />
        </mesh>
      </Hud>
    </Fragment>
  );
};

export default Background;
