// uniform float u_time;
// uniform float u_radius;

// varying vec2 vUv;

// mat3 rotation3dY(float angle) {
//   float s = sin(angle);
//   float c = cos(angle);
//   return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
// }

// void main() {

//   float distanceFactor = pow(u_radius - distance(position, vec3(0.0)), 1.5);

//   float size = distanceFactor * 1.5 + 5.0;

//   vec3 particlePosition = position * rotation3dY((u_time * 0.2) * distanceFactor);

//   vec4 modelPosition = modelMatrix * vec4(particlePosition, 1.0);
//   vec4 viewPosition = viewMatrix * modelPosition;
//   vec4 projectionPosition = projectionMatrix * viewPosition;

//   gl_Position = projectionPosition;
//   gl_PointSize = size;

//   gl_PointSize *= (1.0 / -viewPosition.z);

//   vUv = uv;
// }

uniform sampler2D uPositions;
uniform float u_time;
// varying vec3 vColor;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;

  gl_PointSize = 15.0;
  // Size attenuation;
  gl_PointSize *= step(1.0 - (1.0 / 64.0), position.x) + 0.5;

  // vColor = color
}