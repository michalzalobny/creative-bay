uniform vec2 uPlaneRes;
uniform vec2 uMediaRes1;
uniform vec2 uMediaRes2;
uniform vec2 uMediaRes3;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;
uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform sampler2D tMap3;
uniform float uTime;
uniform float uTransitionProgress;
uniform float uVar1;
uniform float uVar2;
uniform float uVar3;

varying vec2 vUv;

#define PI 3.14159265359

vec2 getUvs(vec2 planeRes, vec2 mediaRes, vec2 uv) {
    vec2 ratio = vec2(
        min((planeRes.x / planeRes.y) / (mediaRes.x / mediaRes.y), 1.0),
        min((planeRes.y / planeRes.x) / (mediaRes.y / mediaRes.x), 1.0)
    );
    vec2 finalUv = vec2(
        uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        uv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
    return finalUv;
}

float udRoundBox( vec2 p, vec2 b, float r ){
    return length(max(abs(p)-b+r,0.0))-r;
}
float roundCorners(vec2 planeRes, vec2 uv, float radius) {
    float iRadius = min(planeRes.x, planeRes.y) * radius;
    vec2 halfRes = 0.5 * planeRes.xy;
    float b = udRoundBox( (uv * planeRes) - halfRes, halfRes, iRadius );
    return clamp(1.0 - b, 0.0, 1.0);
}

vec2 mirrored(vec2 v) {
    vec2 m = mod(v,2.0);
    return mix(m, 2.0-m, step(1.0, m));
}

void main() {
    vec2 uv1 = getUvs(uPlaneRes, uMediaRes1, vUv);
    vec2 uv2 = getUvs(uPlaneRes, uMediaRes2, vUv);

    float progress = uTransitionProgress;
    float intensity = 0.1;
    
    vec4 d1 = texture2D(tMap1, uv1);
    vec4 d2 = texture2D(tMap2, uv2);
    
    float displace1 = (d1.r + d1.g + d1.b) * intensity;
    float displace2 = (d2.r + d2.g + d2.b) * intensity;
    
    uv1 = mirrored(vec2(uv1.x, uv1.y +  displace2 * progress ));
    uv2 = mirrored(vec2(uv2.x, uv2.y +  displace1 * (1.0 - progress)));

    vec4 t1 = texture2D(tMap1, uv1);
    vec4 t2 = texture2D(tMap2, uv2);

    gl_FragColor = mix(t1, t2, progress);

    float roundC = roundCorners(uPlaneRes, vUv, 0.024);
    gl_FragColor.a *= roundC;
}