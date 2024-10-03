const fragmentShader = `

varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_outline;

float sdfCircle(vec2 p, float r) {
  // note: sqrt(pow(p.x, 2.0) + pow(p.y, 2.0)) - r;
  return length(p) - r;
}

void main()
  {
    vec2 pixelCoords = (vUv - 0.5) * u_resolution;

    vec3 white = vec3(1.0);
    vec3 red = vec3(1.0, 0.0, 0.0);
    vec3 black = vec3(0.0);

    vec3 color = white;

    float distanceToCircle = sdfCircle(pixelCoords, 300.0);
    color = mix(black, color, smoothstep(-100.0, 12.0, distanceToCircle));

    // white filler inner circle
    color = mix(white, color, smoothstep(-1.0, 0.0, distanceToCircle));

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default fragmentShader;
