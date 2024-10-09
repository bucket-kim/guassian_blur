import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Background from './Background/Background';
import R3FStyleContainer from './R3FStyleContainer';

const R3F = () => {
  return (
    <R3FStyleContainer>
      <Canvas gl={{ antialias: true }}>
        <OrbitControls />
        <Background />
        {/* <GradientBackground /> */}
      </Canvas>
    </R3FStyleContainer>
  );
};

export default R3F;
