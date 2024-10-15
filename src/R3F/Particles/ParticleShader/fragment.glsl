// varying vec2 vUv;
varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength = 1.0 - strength;
  strength = pow(strength, 10.0);

  vec3 color = vec3(0.34, 0.53, 0.96);

  // strength = mix(0.0, color, strength);

  gl_FragColor = vec4(color, strength);
}

// void main() {
//   vec3 color = vec3(0.34, 0.53, 0.96);
//   gl_FragColor = vec4(color, 1.0);
// }
