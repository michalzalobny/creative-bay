#pragma glslify: cnoise = require('glsl-noise/classic/2d')

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColorAccent;
uniform vec2 uPlaneRes;
uniform vec2 uMouse2D;
uniform float uLinesBlur;
uniform float uNoise;
uniform float uOffsetX;
uniform float uOffsetY;
uniform float uLinesAmount;

uniform float uTime;
varying vec2 vUv;

#define PI 3.14159265359


float lines(vec2 uv, float offset){
    float a = abs(0.5 * sin(uv.y * uLinesAmount) + offset * uLinesBlur);
    return smoothstep(0.0, uLinesBlur + offset * uLinesBlur, a);
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float random(vec2 p) {
    vec2 k1 = vec2(
            23.14069263277926, // e^pi (Gelfond's constant)
            2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract(
            cos(dot(p, k1)) * 12345.6789
    );
}

vec3 fadeLine(vec2 uv, vec2 mouse2D,  vec3 col1, vec3 col2, vec3 col3){
    float n = cnoise(uv) * (mouse2D.x + 0.9) * 2.2 + (mouse2D.y + 0.5) * 0.2;
    vec2 baseUv = rotate2d(n) * ((uv + mouse2D.y * 1.2) * 0.15 + (mouse2D.y + 2.5) * 0.02 );

    float basePattern = lines(baseUv, 1.0);
    float secondPattern = lines(baseUv, 0.25);

    vec3 baseColor = mix(col1, col2, basePattern);
    vec3 secondBaseColor = mix(baseColor, col3, secondPattern);
    return secondBaseColor;
}


void main()
{
    vec2 mouse2D = uMouse2D;
    mouse2D *= 0.8;

    vec2 uv = vUv;
    uv.y -= uOffsetY * ((mouse2D.y - 0.8) * 0.2 + 0.2);
    uv.x += uOffsetX;
    uv.x *= uPlaneRes.x / uPlaneRes.y; // Takes care of aspect ratio

    vec3 col1 = fadeLine(uv, mouse2D, uColor1, uColor2, uColorAccent);
    vec3 finalCol = col1;


    vec2 uvRandom = vUv;
    uvRandom.y *= random(vec2(uvRandom.y, 0.5));
    finalCol.rgb += random(uvRandom) * uNoise;

    gl_FragColor = vec4(finalCol, 1.0);
}