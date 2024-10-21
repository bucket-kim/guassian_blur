uniform float uTime;
uniform float uRadius;
uniform float uNoiseScale;
uniform float uPixelRatio;
uniform float uSize;
uniform sampler2D uPermutationTexture;

varying vec3 vColor;

float fade(float t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 fade3(vec3 t) {
    return vec3(fade(t.x), fade(t.y), fade(t.z));
}

float grad(float hash, vec3 p) {
    vec4 h = texture2D(uPermutationTexture, vec2(hash, 0.0));
    float hx = h.r;

    vec3 g = vec3(step(4.0, mod(hx * 8.0, 8.0)) * 2.0 - 1.0, step(2.0, mod(hx * 4.0, 4.0)) * 2.0 - 1.0, step(1.0, mod(hx * 2.0, 2.0)) * 2.0 - 1.0);

    return dot(g, p);
}

float noise(vec3 p) {
    vec3 pi = floor(p);
    vec3 pf = p - pi;

    vec3 u = fade3(pf);

    float n000 = grad(texture2D(uPermutationTexture, vec2(pi.x / 256.0, 0.0)).r, pf);
    float n001 = grad(texture2D(uPermutationTexture, vec2((pi.x + 1.0) / 256.0, 0.0)).r, pf - vec3(1.0, 0.0, 0.0));
    float n010 = grad(texture2D(uPermutationTexture, vec2(pi.y / 256.0, 0.0)).r, pf - vec3(0.0, 1.0, 0.0));
    float n011 = grad(texture2D(uPermutationTexture, vec2((pi.y + 1.0) / 256.0, 0.0)).r, pf - vec3(1.0, 1.0, 0.0));
    float n100 = grad(texture2D(uPermutationTexture, vec2(pi.z / 256.0, 0.0)).r, pf - vec3(0.0, 0.0, 1.0));
    float n101 = grad(texture2D(uPermutationTexture, vec2((pi.z + 1.0) / 256.0, 0.0)).r, pf - vec3(1.0, 0.0, 1.0));
    float n110 = grad(texture2D(uPermutationTexture, vec2((pi.x + pi.y) / 256.0, 0.0)).r, pf - vec3(0.0, 1.0, 1.0));
    float n111 = grad(texture2D(uPermutationTexture, vec2((pi.x + pi.y + 1.0) / 256.0, 0.0)).r, pf - vec3(1.0, 1.0, 1.0));

    return mix(mix(mix(n000, n001, u.x), mix(n010, n011, u.x), u.y), mix(mix(n100, n101, u.x), mix(n110, n111, u.x), u.y), u.z);
}

void main() {

    // Calculate spherical coordinates
    float theta = atan(position.z, position.x);
    float phi = acos(position.y / uRadius);

    // Sample noise for movement
    vec3 noisePos = vec3(theta * uNoiseScale, phi * uNoiseScale, uTime);
    float noiseValue1 = noise(noisePos);
    float noiseValue2 = noise(noisePos + vec3(1000.0));

    // Update position based on noise
    float deltaTheta = cos(noiseValue1 * 6.28318) * 0.001;
    float deltaPhi = sin(noiseValue2 * 6.28318) * 0.001;

    theta += deltaTheta;
    phi = clamp(phi + deltaPhi, 0.1, 3.04159);

    // Convert back to Cartesian coordinates
    vec3 newPosition = vec3(uRadius * sin(phi) * cos(theta), uRadius * cos(phi), uRadius * sin(phi) * sin(theta));

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Calculate point size
    gl_PointSize = uSize * uPixelRatio * (1.0 / -mvPosition.z);
}