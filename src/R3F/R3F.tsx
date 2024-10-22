import { Hud } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import R3FStyleContainer from './R3FStyleContainer';

import Background from './Background/Background';
import PlanetaryParticles02 from './GpGPU/PlanetaryParticles02';
import Particles from './Particles/Particles';
const R3F = () => {
  return (
    <R3FStyleContainer>
      <Canvas gl={{ antialias: true }} camera={{ fov: 75 }}>
        <color attach={'background'} args={['#0c1c38']} />
        {/* <OrbitControls enableZoom={false} /> */}
        {/* <Particles02 /> */}
        <Hud renderPriority={2}>
          <group>
            <Particles />
            <PlanetaryParticles02 />
          </group>
          <mesh rotation={[0, 0, 0]}>
            <circleGeometry args={[1, 64]} />
            <meshBasicMaterial color={'#ffffff'} toneMapped={false} />
          </mesh>
        </Hud>
        <Background />
      </Canvas>
    </R3FStyleContainer>
  );
};

export default R3F;
