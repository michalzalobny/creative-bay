#pragma glslify: cnoise = require('glsl-noise/classic/2d')

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColorAccent;
uniform vec2 uPlaneRes;
uniform vec2 uMouse2D;
uniform float uLinesBlur;

uniform float uTime;
varying vec2 vUv;

#define PI 3.14159265359


float lines(vec2 uv, float offset){
    float a = abs(0.5 * sin(uv.y * 9.0) + offset * uLinesBlur);
    return smoothstep(0.0, uLinesBlur + offset * uLinesBlur, a);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}


void main()
{
    vec2 mouse2DNormalized;
    mouse2DNormalized.x = (uMouse2D.x / uPlaneRes.x) * 2.0 - 1.0;
    mouse2DNormalized.y = -(uMouse2D.y / uPlaneRes.y) * 2.0 + 1.0;
    mouse2DNormalized *= 0.8;

    vec2 uv = vUv;
    uv.y -= 0.3;
    uv.x += 0.3;
    uv.x *= uPlaneRes.x / uPlaneRes.y; // Takes care of aspect ratio
    float n = cnoise(uv + mouse2DNormalized);
    vec2 baseUv = rotate2d(PI * 0.25 + n - mouse2DNormalized.x * 0.2) * (uv * 0.3);

    float basePattern = lines(baseUv, 1.0);
    float secondPattern = lines(baseUv, 0.1);

    vec3 baseColor = mix(uColor1, uColor2, basePattern);
    vec3 secondBaseColor = mix(baseColor, uColorAccent, secondPattern);
    gl_FragColor = vec4(secondBaseColor, 1.0);
}