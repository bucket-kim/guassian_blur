varying vec2 vUv;

void main() {
  vUv = uv;

  vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
  vec4 projectedPosition = projectionMatrix * modelPosition;

  gl_Position = projectedPosition;
}
