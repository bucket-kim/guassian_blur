varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_scale;
uniform vec2 u_Position;
uniform vec2 u_BlurCirclePos;
uniform float u_time;

float inverseLerp(float currentValue, float minValue, float maxValue) {
  return (currentValue - minValue) / (maxValue - minValue);
}

float remap(float currentValue, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(currentValue, inMin, inMax);
  return mix(outMin, outMax, t);
}

float sdfCircle(vec2 p, float r) {
  // note: sqrt(pow(p.x, 2.0) + pow(p.y, 2.0)) - r;
  return length(p) - r;
}

float opUnion(float d1, float d2) {
  return min(d1, d2);
}

float opIntersect(float d1, float d2) {
  return max(d1, d2);
}

float opSubtract(float d1, float d2) {
  return max(-d1, d2);
}

float softMax(float a, float b, float k) {
  return log(exp(k * a) + exp(k * b)) / k;
}

float softMin(float a, float b, float k) {
  return -softMax(-a, -b, k);
}

float softMinValue(float a, float b, float k) {
  float h = remap(a - b, -1.0 / k, 1.0 / k, 0.0, 1.0);
  return h;
}

float sdfMainCircle(vec2 pixelCoords, float size) {
  float mainCircle = sdfCircle(pixelCoords, size);
  return mainCircle;
}

float blurCircle(vec2 pixelCoords, float size) {
  float circle = sdfCircle(pixelCoords, size);

  return circle;
}

void main() {
  vec2 pixelCoords = (vUv - 0.5) * u_resolution;

  vec3 color = vec3(1.);
  vec3 black = vec3(0.0);
  vec3 orange = vec3(1.0, 0.9255, 0.549);
  vec3 red = vec3(0.973, 0.094, 0);

  vec2 offset = vec2(u_Position.x, u_Position.y);
  vec2 pos = pixelCoords - offset;

  float mainCircleShadow = sdfMainCircle(pos, 102. * u_scale);
  float mainCircle = sdfMainCircle(pos, 100. * u_scale);

// 1st orange circle
  vec2 orange1Pos = vec2(100. * (cos(20. * u_time * .05)) - 330. + u_BlurCirclePos.x, 100. * (sin(20. * u_time * .05)) - 770. + u_BlurCirclePos.y);
  float orangeCircle = blurCircle(pixelCoords - orange1Pos, 1620.);

  // red circle
  vec2 redPos = vec2(100. * (cos(20. * u_time * .05)) - 720. + u_BlurCirclePos.x, 100. * (sin(20. * u_time * .05)) - 1170. + u_BlurCirclePos.y);
  float redCircle = blurCircle(pixelCoords - redPos, 1590.);

  // orange circle behind
  color = mix(color, orange, smoothstep(0., -800., orangeCircle));
  color = mix(color, red, smoothstep(400., -800., redCircle));

  // main circle at the front
  // color = mix(color, black, smoothstep(0.0, -300.0, mainCircleShadow));
  // color = mix(vec3(1.), color, smoothstep(0.0, 1.0, mainCircle));

  gl_FragColor = vec4(color, 1.0);
}
