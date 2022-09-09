uniform vec2 uPlaneRes;
uniform vec2 uMediaRes1;
uniform vec2 uMediaRes2;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;
uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uTime;
uniform float uTransitionProgress;

varying vec2 vUv;

#define PI 3.14159265359


void main() {
    vec2 ratio1 = vec2(
        min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes1.x / uMediaRes1.y), 1.0),
        min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes1.y / uMediaRes1.x), 1.0)
    );

    vec2 ratio2 = vec2(
        min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes2.x / uMediaRes2.y), 1.0),
        min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes2.y / uMediaRes2.x), 1.0)
    );

    vec2 uv1 = vec2(
        vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5,
        vUv.y * ratio1.y + (1.0 - ratio1.y) * 0.5
    );

    vec2 uv2 = vec2(
        vUv.x * ratio2.x + (1.0 - ratio2.x) * 0.5,
        vUv.y * ratio2.y + (1.0 - ratio2.y) * 0.5
    );

    vec4 image1 = texture2D(tMap1,uv1);
    vec4 image2 = texture2D(tMap2,uv2);

    gl_FragColor = mix(image1, image2, uTransitionProgress); 
}