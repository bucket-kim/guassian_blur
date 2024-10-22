varying float vDistance;
varying vec3 vColor;

void main() {
  float strength = distance(gl_PointCoord, vec2(0.5));
  strength *= 2.0;
  strength = 1.0 - strength;

    // Final color
  vec3 color = mix(vec3(0.349, 0.4863, 0.5412), vec3(0.349, 0.4863, 0.5412), strength);
  gl_FragColor = vec4(color, strength);
    #include <colorspace_fragment>
}