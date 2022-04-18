#pragma glslify: cnoise = require('glsl-noise/classic/3d')

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColorAccent;
uniform float uTime;
varying vec2 vUv;
varying vec3 vPosition;

#define PI 3.14159265359


float lines(vec2 uv, float offset){
    float a = abs(0.5 * sin(uv.x * 10.0) + offset * 0.5);
    return smoothstep(0.0, 0.5 + offset * 0.5, a);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}


void main()
{
    
    vec2 uv = vUv;
    float n = cnoise(vPosition + uTime * 0.1);
    vec2 baseUv = rotate2d(PI * 0.25 + n) * vPosition.xy * 0.5;

    float basePattern = lines(baseUv, 1.0);
    float secondPattern = lines(baseUv, 0.2);

    vec3 baseColor = mix(uColor1, uColor2, basePattern);
    vec3 secondBaseColor = mix(baseColor, uColorAccent, secondPattern);
    gl_FragColor = vec4(secondBaseColor, 1.0);
}