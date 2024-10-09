varying vec2 vUv;
varying vec3 vColor;
uniform float u_time;
varying vec3 vPosition;
uniform vec3 u_colors[4];

void main() {

  vec3 uvColor = vec3(vUv, 1.0);

  gl_FragColor = vec4(vColor, 1.);
}