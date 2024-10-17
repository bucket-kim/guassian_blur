import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Background from './Background/Background';
import Particles02 from './Particles/Particles02';
import R3FStyleContainer from './R3FStyleContainer';

const R3F = () => {
  return (
    <R3FStyleContainer>
      <Canvas gl={{ antialias: true }}>
        <color attach={'background'} args={['#0a1034']} />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          // zoomSpeed={0.1}
        />
        <Background />
        <Particles02 />
        {/* <group>
        <pointLight intensity={50000} decay={2} color="white" />
        <Particles01 count={10000} />
        </group> */}
        {/* <Effect /> */}
      </Canvas>
    </R3FStyleContainer>
  );
};

export default R3F;
