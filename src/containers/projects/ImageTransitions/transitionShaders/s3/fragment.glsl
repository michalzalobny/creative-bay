#pragma glslify: cnoise = require('glsl-noise/classic/3d')
#pragma glslify: cnoise2 = require('glsl-noise/classic/2d')

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
uniform float uHoverProgress;
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






//Avener Random FBM
mat2 rot2d (in float angle) {
        return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float r(in float a, in float b) { return fract(sin(dot(vec2(a, b), vec2(12.9898, 78.233))) * 43758.5453); }
float h(in float a) { return fract(sin(dot(a, dot(12.9898, 78.233))) * 43758.5453); }

float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n = p.x + p.y * 57.0 + 113.0 * p.z;
    return mix(mix(mix(h(n + 0.0), h(n + 1.0), f.x),
        mix(h(n + 57.0), h(n + 58.0), f.x), f.y),
    mix(mix(h(n + 113.0), h(n + 114.0), f.x),
        mix(h(n + 170.0), h(n + 171.0), f.x), f.y), f.z);
}

// http://www.iquilezles.org/www/articles/morenoise/morenoise.htm
// http://www.pouet.net/topic.php?post=401468
vec3 dnoise2f(in vec2 p) {
    float i = floor(p.x), j = floor(p.y);
    float u = p.x - i, v = p.y - j;
    float du = 30. * u * u * (u * (u - 2.) + 1.);
    float dv = 30. * v * v * (v * (v - 2.) + 1.);
    u = u * u * u * (u * (u * 6. - 15.) + 10.);
    v = v * v * v * (v * (v * 6. - 15.) + 10.);
    float a = r(i, j);
    float b = r(i + 1.0, j);
    float c = r(i, j + 1.0);
    float d = r(i + 1.0, j + 1.0);
    float k0 = a;
    float k1 = b - a;
    float k2 = c - a;
    float k3 = a - b - c + d;
    return vec3(k0 + k1 * u + k2 * v + k3 * u * v,
    du * (k1 + k3 * v),
    dv * (k2 + k3 * u));
}

float fbm(in vec2 uv) {
    vec2 p = uv;
    float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for (int i = 0; i < 3; ++i) {
    vec3 n = dnoise2f(uv);
    dx += n.y;
    dz += n.z;
    f += w * n.x / (1.0 + dx * dx + dz * dz);
    w *= 0.86;
    uv *= vec2(1.36);
    uv *= rot2d(1.25 * noise(vec3(p * 0.1, 0.12 * uTime)) +
        0.75 * noise(vec3(p * 0.1, 0.20 * uTime)));
    }
    return f;
}

float fbmLow(in vec2 uv) {
    float f, dx, dz, w = 0.5;
    f = dx = dz = 0.0;
    for (int i = 0; i < 3; ++i) {
    vec3 n = dnoise2f(uv);
    dx += n.y;
    dz += n.z;
    f += w * n.x / (1.0 + dx * dx + dz * dz);
    w *= 0.95;
    uv *= vec2(3);
    }
    return f;
}


vec2 zoom (in vec2 uv_1, in float zoom) {
    return (uv_1 - vec2(0.5)) / vec2(zoom) + vec2(0.5);
}

void main() {
    vec2 uv1 = getUvs(uPlaneRes, uMediaRes1, vUv);
    vec2 uv2 = getUvs(uPlaneRes, uMediaRes2, vUv);

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

    //ripples
    vec2 centerVector = vUv - vec2(0.5);
    vec2 noiseUv = centerVector *  aspect;
    noiseUv *= rot2d(sin(uTime * 0.5) * PI * 2.0);
    float swirl  = 3.5 * fbm(noiseUv * fbmLow(vec2(length(noiseUv) - uTime * 0.5 )));

    vec2 swirlDistort = swirl * centerVector;
    vec2 zoomedUv1 = zoom(uv1, 1.0 + 0.4 * progress);
    vec2 zoomedUv2 = zoom(uv2, 1.0 + 0.5 * (1.0 - progress));

    uv1 = mirrored(zoomedUv1 + xy * c3 * 4.0 * progress + xy * (1.0 - c1) * progress * strength * 0.7 + 1.2 * swirlDistort * (1.0 - c2) * uHoverProgress);
    uv2 = mirrored(zoomedUv2 + xy * c3 * 4.0 * progress + xy * c2 * (1.0 - progress) * strength * 0.2 + 0.3 * swirlDistort * c2 * uHoverProgress);


    vec4 image1 = texture2D(tMap1, uv1);
    vec4 image2 = texture2D(tMap2, uv2);

    gl_FragColor = mix( image1, image2, c1 );
    // gl_FragColor = vec4(vec3(1.-c2),1.0);


    float roundC = roundCorners(uPlaneRes, vUv, 0.024);
    gl_FragColor.a *= roundC;
    



}