import { Hud } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { FC, Fragment, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface patricleProps {
  count: number;
}

const Particles01: FC<patricleProps> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const mouseRef = useRef([0, 0]);

  const { size, viewport } = useThree();

  const aspect = size.width / viewport.width;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }

    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || !lightRef.current) return;

    lightRef.current.position.set(0, 0, 0);

    particles.forEach(
      (
        particle: {
          t: any;
          factor: any;
          speed: any;
          xFactor: any;
          yFactor: any;
          zFactor: any;
          mx: any;
          my: any;
        },
        i: any,
      ) => {
        if (!meshRef.current) return;
        let { t, factor, speed, xFactor, yFactor, zFactor } = particle;

        t = particle.t += speed / 2;

        const a = Math.cos(t) + Math.sin(t * 1) / 10;
        const b = Math.sin(t) + Math.cos(t * 2) / 10;
        const s = Math.cos(t);

        particle.mx += (mouseRef.current[0] - particle.mx) * 0.01;
        particle.my += (mouseRef.current[1] * -1 - particle.my) * 0.01;

        dummy.position.set(
          a +
            xFactor +
            Math.cos((t / 10) * factor) +
            (Math.sin(t * 1) * factor) / 10,
          b +
            yFactor +
            Math.sin((t / 10) * factor) +
            (Math.cos(t * 2) * factor) / 10,
          b +
            zFactor +
            Math.cos((t / 10) * factor) +
            (Math.sin(t * 3) * factor) / 10,
        );

        dummy.scale.set(s, s, s);

        dummy.rotation.set(s * 5, s * 5, s * 5);
        dummy.updateMatrix();

        meshRef.current.setMatrixAt(i, dummy.matrix);
      },
    );

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <Fragment>
      <Hud renderPriority={2}>
        <pointLight
          ref={lightRef}
          intensity={5000}
          // distance={2000}
          color={'lightblue'}
          decay={1}
        />
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshPhongMaterial color={'#ffffff'} />
        </instancedMesh>
      </Hud>
    </Fragment>
  );
};

export default Particles01;
