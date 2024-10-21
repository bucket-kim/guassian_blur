uniform float uTime;
uniform float uRadius;
varying vec3 vColor;

mat3 rotation3dY(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}

void main() {
  float distanceFactor = pow(uRadius - distance(position, vec3(0.0)), 1.5);
  float size = distanceFactor * 1.5 + 3.0;
  vec3 particlePosition = position * rotation3dY(uTime * 0.3 * distanceFactor);

  vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = size;
  // Size attenuation;
  gl_PointSize *= (2.0 / -viewPosition.z);

  vColor = color;
}

// uniform sampler2D uPositions;
// uniform float u_time;
// uniform float uFocus;
// uniform float uFov;
// varying float vDistance;
// varying vec3 vColor;

// void main() {

//   vec3 pos = texture2D(uPositions, position.xy).xyz;

//   vec4 modelPosition = modelViewMatrix * vec4(pos, 1.0);
//   vec4 projectedPosition = projectionMatrix * modelPosition;

//   gl_Position = projectedPosition;

//   vDistance = abs(uFocus - -modelPosition.z);

//   gl_PointSize = 8.;
//   // gl_PointSize *= (step(1.0 - (1.0 / 50.), position.x)) + 0.5;

//   vColor = color;
// }