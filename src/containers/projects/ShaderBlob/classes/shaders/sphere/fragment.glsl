#pragma glslify: cnoise = require('glsl-noise/classic/3d')

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
    vec2 baseUv = rotate2d(PI * 0.25) * vPosition.xy * 0.001;

    vec3 color1 = vec3(1.0, 0.0, 0.0);
    vec3 color2 = vec3(0.0, 1.0, 0.0);
    vec3 color3 = vec3(0.0, 0.0, 1.0);

    float basePattern = lines(baseUv, 0.1);
    float secondPattern = lines(baseUv, 0.3);

    vec3 baseColor = mix(color1, color2, basePattern);
    vec3 secondBaseColor = mix(baseColor, color3, secondPattern);

    float n = cnoise(vPosition * 0.001 + uTime);
    gl_FragColor = vec4(secondBaseColor, 1.0);
}