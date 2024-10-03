import { useMemo } from 'react';
import * as THREE from 'three';
import fragmentShader from './BackgroundShader/fragment';
import vertexShader from './BackgroundShader/vertex';

const Background = () => {
  const uniforms = useMemo(() => {
    return {
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      u_outline: {
        value: 20,
      },
    };
  }, []);

  return (
    <group>
      <mesh renderOrder={1}>
        <planeGeometry args={[2, 2, 1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </group>
  );
};

export default Background;
