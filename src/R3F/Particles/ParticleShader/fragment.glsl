// varying vec2 vUv;
varying vec3 vColor;
varying float vDistance;

// void main() {
//   float strength = distance(gl_PointCoord, vec2(0.5));
//   strength = 1.0 - strength;
//   strength = pow(strength, 10.0);

//   vec3 color = vec3(0.34, 0.53, 0.96);

//   // strength = mix(0.0, color, strength);

//   gl_FragColor = vec4(color, 1.0);
// }

void main() {
  vec2 cxy = 2.0 * gl_PointCoord - 1.0;
  vec3 color = vec3(0.34, 0.53, 0.96);

  if (dot(cxy, cxy) > 1.0)
    discard;

  float alpha = (1.04 - clamp(vDistance * 1.5, 0.0, 1.0));

  gl_FragColor = vec4(color, alpha);
}
