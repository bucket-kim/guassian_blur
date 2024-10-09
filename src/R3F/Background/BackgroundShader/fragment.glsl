varying vec2 vUv;

uniform vec2 u_resolution;
uniform float u_scale;
uniform vec2 u_Position;
uniform vec2 u_OrangeCircle;
uniform vec2 u_PurpleCircle;
uniform vec2 u_BlueCircle;
uniform vec2 u_LightPinkCircle;
uniform vec2 u_Threshold;
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

float bgCircles(vec2 pixelCoords, float size) {

  vec2 wavedPixelCoords = vec2(pixelCoords.x + cos(pixelCoords.y * 0.02 + u_time) * 8.0, pixelCoords.y + sin(pixelCoords.x * 0.02 + u_time) * 8.);

  float circle = sdfCircle(wavedPixelCoords, size);

  return circle;
}

float subCircles(vec2 pixelCoords, float size) {

  vec2 wavedPixelCoords = vec2(pixelCoords.x + cos(pixelCoords.y * 0.02 + u_time) * 20.0, pixelCoords.y + sin(pixelCoords.x * 0.02 + u_time) * 20.);

  float circle = sdfCircle(wavedPixelCoords, size);

  return circle;
}

void main() {
  vec2 pixelCoords = (vUv - 0.5) * u_resolution;

  vec3 color = vec3(1.);
  vec3 black = vec3(0.0, 0.0, 0.0);
  vec3 white = vec3(1.0, 0.9647, 0.8902);
  vec3 red = vec3(1., 0.07227185067438519, 0);
  vec3 purple = vec3(0.9255, 0.6745, 1.0);
  vec3 blue = vec3(0.6078, 0.7647, 0.9804);
  vec3 lightBlue = vec3(0.7765, 0.8745, 0.9882);
  vec3 lightPink = vec3(1.0, 0.9529, 0.8902);
  vec3 orange = vec3(0.9608, 0.4549, 0.1412);
  vec3 yellow = vec3(1.0, 0.85499260812105, 0.5775804404214573);

  vec2 offset = vec2(u_Position.x, u_Position.y);
  vec2 pos = pixelCoords - offset;

// main white circle
  float mainCircleShadow = sdfMainCircle(pos, 102. * u_scale);
  float mainCircle = sdfMainCircle(pos, 100. * u_scale);

  // red circle
  vec2 redPos = vec2(10. * (sin(2. * u_time * .05)), 10. * (cos(2. * u_time * .05)));
  float redCircle = bgCircles(pixelCoords - redPos, 500.);

// yellow circle
  vec2 yellowPos = vec2(10. * (cos(2. * u_time * .05)) + 11., 10. * (sin(2. * u_time * .05)) - 20.);
  float yellowCircle = bgCircles(pixelCoords - yellowPos, 520.);

  // white HighlightCircle
  vec2 whitePos = vec2(10. * (cos(2. * u_time * .05)) + 11., 10. * (sin(2. * u_time * .05)) - 20.);
  float whiteCircle = bgCircles(pixelCoords - whitePos, 400.);

// 1st orange circle
  vec2 orangePos = vec2(10. * (sin(2. * u_time * .05)) + u_OrangeCircle.x, 10. * (cos(2. * u_time * .05)) + u_OrangeCircle.y);
  float orangeCircle = subCircles(pixelCoords - orangePos, 200.);

// 1st purple circle
  vec2 purplePos = vec2(10. * (cos(2. * u_time * .05)) + u_PurpleCircle.x, 10. * (sin(2. * u_time * .05)) + u_PurpleCircle.y);
  float purpleCircle = subCircles(pixelCoords - purplePos, 160.);

// 1st blue circle
  vec2 bluePos = vec2(10. * (cos(2. * u_time * .05)) + u_BlueCircle.x, 10. * (sin(2. * u_time * .05)) + u_BlueCircle.y);
  float blueCircle = subCircles(pixelCoords - bluePos, 240.);

// light blue circle
  vec2 lightBluePos = vec2(10. * (cos(2. * u_time * .05)) + u_BlueCircle.x, 10. * (sin(2. * u_time * .05)) + u_BlueCircle.y);
  float lightBlueCircle = subCircles(pixelCoords - lightBluePos, 220.);

// 1st lightPink circle
  vec2 lightPinkPos = vec2(10. * (cos(2. * u_time * .05)) + u_LightPinkCircle.x, 10. * (sin(2. * u_time * .05)) + u_LightPinkCircle.y);
  float lightPinkCircle = subCircles(pixelCoords - lightPinkPos, 200.);

  // circle colors
  color = mix(color, red, smoothstep(160., -320., redCircle));
  color = mix(color, yellow, smoothstep(40., -80., yellowCircle));
  color = mix(color, white, smoothstep(150., -100., whiteCircle));
  color = mix(color, purple, smoothstep(120., -110., purpleCircle));
  color = mix(color, orange, smoothstep(120., -150., orangeCircle));
  color = mix(color, blue, smoothstep(150., -150., blueCircle));
  color = mix(color, lightBlue, smoothstep(200., -200., lightBlueCircle));
  color = mix(color, lightPink, smoothstep(90., -180., lightPinkCircle));
  // color = mix(color, blue, smoothstep(u_Threshold.x, u_Threshold.y, blueCircle));
  // color = mix(color, red, smoothstep(400., -8., redCircle));

  // main circle at the front
  color = mix(color, black, smoothstep(0.0, -10.0, mainCircleShadow));
  color = mix(vec3(1.), color, smoothstep(0.0, 1.0, mainCircle));

  gl_FragColor = vec4(color, 1.0);
}
