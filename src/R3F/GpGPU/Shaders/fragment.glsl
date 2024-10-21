varying vec3 vColor;

void main() {
    // Create circular particles
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    if (dist > 0.5)
        discard;

    // Apply soft edge
    float alpha = 0.7 * smoothstep(0.5, 0.4, dist);
    gl_FragColor = vec4(vColor, alpha);
}