import * as THREE from 'three';
// @ts-ignore
import simulationFragmentShader from './ParticleShaderFBO/fragment.glsl';
// @ts-ignore
import simulationVertexShader from './ParticleShaderFBO/vertex.glsl';

const getPoint = (v: any, size: number, data: any, offset: any) => {
  v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
  if (v.length() > 1) return getPoint(v, size, data, offset);
  return v.normalize().multiplyScalar(size).toArray(data, offset);
};

const getSphere = (count: number, size: number, p = new THREE.Vector3()) => {
  // const p = new THREE.Vector3();
  const data = new Float32Array(count * 4);
  for (let i = 0; i < count * 3; i += 3) getPoint(p, size, data, i);
  return data;
};

const getRandomData = (width: number, height: number) => {
  // we need to create a vec4 since we're passing the positions to the fragment shader
  // data textures need to have 4 components, R, G, B, and A
  const length = width * height * 4;
  const data = new Float32Array(length);

  for (let i = 0; i < length; i++) {
    const stride = i * 4;

    const distance = Math.sqrt(Math.random()) * 2.0;
    const theta = THREE.MathUtils.randFloatSpread(360);
    const phi = THREE.MathUtils.randFloatSpread(360);

    data[stride] = distance * Math.sin(theta) * Math.cos(phi);
    data[stride + 1] = distance * Math.sin(theta) * Math.sin(phi);
    data[stride + 2] = distance * Math.cos(theta);
    data[stride + 3] = 1.0; // this value will not have any impact
  }

  return data;
};

class SimulationMaterial extends THREE.ShaderMaterial {
  constructor(size: number) {
    const positionTexture = new THREE.DataTexture(
      getRandomData(size, size),
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    const positionsSphereTexture = new THREE.DataTexture(
      getSphere(size * size, size / 4),
      size,
      size,
      THREE.RGBAFormat,
      THREE.FloatType,
    );
    positionsSphereTexture.needsUpdate = true;
    positionTexture.needsUpdate = true;

    const simulationUniforms = {
      uPositions: { value: positionTexture },
      uFrequency: { value: 0.75 },
      uTime: { value: 0 },
    };

    super({
      uniforms: simulationUniforms,
      vertexShader: simulationVertexShader,
      fragmentShader: simulationFragmentShader,
    });
  }
}

export default SimulationMaterial;
