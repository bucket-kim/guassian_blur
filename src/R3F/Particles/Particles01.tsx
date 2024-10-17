import { useFBO } from '@react-three/drei';
import {
  createPortal,
  extend,
  ReactThreeFiber,
  useFrame,
} from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import DofPointsMaterial from './ParticleShader01/dofPointsMaterial';
import ParticleSimMaterial from './ParticleShader01/particleSimMaterial';

extend({ ParticleSimMaterial });
extend({ DofPointsMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Specify these as instances of THREE.ShaderMaterial
      particleSimMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
      dofPointsMaterial: ReactThreeFiber.Object3DNode<
        THREE.ShaderMaterial,
        typeof THREE.ShaderMaterial
      >;
    }
  }
}

const Particles01 = () => {
  const size = 512;

  const particleSimMatref = useRef<THREE.ShaderMaterial>(null);
  const dofPointMatRef = useRef<THREE.ShaderMaterial>(null);

  const [scene] = useState(() => new THREE.Scene());
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

  const target = useFBO(size, size, {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBFormat,
    stencilBuffer: false,
    type: THREE.FloatType,
  });

  const particles = useMemo(() => {
    const length = size * size;
    const particles = new Float32Array(length * 3);
    for (let i = 0; i < length; i++) {
      let i3 = i * 3;
      particles[i3 + 0] = (i % size) / size;
      particles[i3 + 1] = i / size / size;
    }

    return particles;
  }, [size]);

  useFrame((state) => {
    const { gl, clock } = state;

    if (!particleSimMatref.current || !dofPointMatRef.current) return;

    const elapsedTime = clock.getElapsedTime();

    gl.setRenderTarget(target);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    dofPointMatRef.current.uniforms.positions.value = target.texture;
    // dofPointMatRef.current.uniforms.uTime.value = elapsedTime;
    particleSimMatref.current.uniforms.uTime.value = elapsedTime;
    // particleSimMatref.current.uniforms.uCurlFreq.value = THREE.MathUtils.lerp(
    //   particleSimMatref.current.uniforms.uCurlFreq.value,
    //   0.1,
    //   0.1,
    // );
  });

  return (
    <group>
      {createPortal(
        <mesh>
          <particleSimMaterial ref={particleSimMatref} />
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
      <points>
        <dofPointsMaterial ref={dofPointMatRef} />
        <bufferGeometry>
          <bufferAttribute
            attach={'attributes-position'}
            count={particles.length / 3}
            array={particles}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </group>
  );
};

export default Particles01;
