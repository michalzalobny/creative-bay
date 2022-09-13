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

float parabola( float x, float k ) {
    return pow( 4. * x * ( 1. - x ), k );
}

vec2 mirrored(vec2 v) {
    vec2 m = mod(v,2.0);
    return mix(m, 2.0-m, step(1.0, m));
}

//https://www.shadertoy.com/view/ldfSDj
float udRoundBox( vec2 p, vec2 b, float r ){
    return length(max(abs(p)-b+r,0.0))-r;
}
float roundCorners(vec2 planeRes, vec2 uv, float radius) {
    float iRadius = min(planeRes.x, planeRes.y) * radius;
    vec2 halfRes = 0.5 * planeRes.xy;
    float b = udRoundBox( (uv * planeRes) - halfRes, halfRes, iRadius );
    return clamp(1.0 - b, 0.0, 1.0);
}

float tri(float v) {
    return mix(v, 1.0 - v, step(0.5, v)) * 2.0;
}

float remap01 (float a, float b, float t){
    return (t-a) / (b-a);
}

float remap(float a, float b, float c, float d, float t){
    return remap01(a, b, t) * (d-c) + c;
}

float paintCircle (vec2 uv, vec2 center, float rad, float width, float distortion) {
    vec2 diff = center-uv;
    float len = length(diff);

    float circle = smoothstep(rad-width, rad, len - distortion) ;
    return circle;
}

void main() {
    vec2 uv1 = getUvs(uPlaneRes, uMediaRes1, vUv);
    vec2 uv2 = getUvs(uPlaneRes, uMediaRes2, vUv);
    vec2 uv3 = getUvs(uPlaneRes, uMediaRes3, vUv);

    vec4 image3 = texture2D(tMap3,  fract(mirrored(uv3  + uTime*0.04)));
    vec4 noise = image3;


    float progress = uTransitionProgress;
    // progress = uVar1;
    vec2 aspect = vec2(uPlaneRes.x / uPlaneRes.y, 1.0);
    
    float radiusC = progress * aspect.x * 0.5 * 1.5; //*1.5 to compensate the aspect ratio (it makes the circle bigger to disappear)
    float fade = 0.2;
    float c1 = 1.0 - paintCircle(vUv * aspect, vec2(0.5) * aspect, radiusC, fade, 0.0);
    float c2 = 1.0 - paintCircle(vUv * aspect, vec2(0.5) * aspect, radiusC - fade, fade, 0.0);
    float c3 = c1 - c2;


    float w = sin(sin(uTime) * 0.3 + vUv.x * 4.0);
    vec2 xy =  0.25 * w * (tri(progress) + tri(c1 * 3.0)) * vec2(0.0, 1.0);
    
    float strength = 1.5;

    uv1 = mirrored(uv1 + xy * c3 * 4.0 * progress + xy * (1.0 - c1) * progress * strength * 2.0);
    uv2 = mirrored(uv2 + xy * c3 * 4.0 * progress + xy * c2 * (1.0 - progress) * strength);


    vec4 image1 = texture2D(tMap1, uv1);
    vec4 image2 = texture2D(tMap2, uv2);

    gl_FragColor = mix( image1, image2, c1 );
    
    float roundC = roundCorners(uPlaneRes, vUv, 0.024);
    gl_FragColor.a *= roundC;
    



}