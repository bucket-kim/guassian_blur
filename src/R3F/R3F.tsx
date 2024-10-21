import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Particles from './Particles/Particles';
import R3FStyleContainer from './R3FStyleContainer';

import PlanetaryParticles02 from './GpGPU/PlanetaryParticles02';
const R3F = () => {
  return (
    <R3FStyleContainer>
      <Canvas gl={{ antialias: true }} camera={{ fov: 75 }}>
        <color attach={'background'} args={['#0c1c38']} />
        <OrbitControls enableZoom={false} />
        <Particles />
        <PlanetaryParticles02 />
        {/* <Particles02 /> */}
        {/* <Hud renderPriority={2}>
        </Hud>
        <Background /> */}
      </Canvas>
    </R3FStyleContainer>
  );
};

export default R3F;
