import * as THREE from 'three';
// @ts-ignore
import vertexShader from './Shaders/vertex.glsl';
// @ts-ignore
import fragmentShader from './Shaders/fragment.glsl';

class ParticleMaterial extends THREE.ShaderMaterial {
  constructor() {
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
    };

    const particleUniforms = {
      uSize: new THREE.Uniform(0.04),
      uResolution: new THREE.Uniform(
        new THREE.Vector2(
          sizes.width * sizes.pixelRatio,
          sizes.height * sizes.pixelRatio,
        ),
      ),
    };

    super({
      uniforms: particleUniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    });
  }
}

export default ParticleMaterial;
