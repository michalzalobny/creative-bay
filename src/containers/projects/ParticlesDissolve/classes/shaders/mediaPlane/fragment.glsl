uniform vec2 uPlaneRes;
uniform vec2 uMediaRes;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;
uniform sampler2D tMap;
uniform float uTime;

varying vec2 vUv;

#define PI 3.14159265359


void main() {
    vec2 ratio = vec2(
        min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes.x / uMediaRes.y), 1.0),
        min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes.y / uMediaRes.x), 1.0)
    );

    vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );

    gl_FragColor.rgba = texture2D(tMap, uv).rgba;
    
}