#pragma glslify: cnoise = require(glsl-noise/simplex/2d)

uniform sampler2D tMap1;
uniform vec2 uMediaRes1;
uniform vec2 uPlaneRes;
uniform vec2 uCanvasRes;
uniform float uProgress1;
uniform float uPixelRatio;
uniform float uSize;
uniform float uVar1;
uniform float uVar2;
uniform float uVar3;
uniform float uVar4;
uniform float uTime;

attribute float aRandom;
attribute float aRandom2;

varying vec2 vUv;
varying float vN1;

#define PI 3.14159265359

void main(){
    vec3 stablePosition = position;

    float n1 = cnoise(uv * uVar3 + uTime* 0.2) * uVar4;
    float n2 = cnoise((1.0 - uv) * uVar3 + uTime* 0.2) * uVar4;

    float n1Prev = cnoise(uv * uVar3 + (uTime-0.001 * 5.0) * 0.2) * uVar4;
    float n2Prev = cnoise((1.0 - uv) * uVar3 + (uTime-0.001 * 5.0)* 0.2) * uVar4;

    stablePosition.x += (uVar2 * (n1 + aRandom * 0.3));
    stablePosition.y += (uVar2 * (n2 + aRandom2 * 0.3));


    vec4 modelPosition = modelMatrix * vec4(stablePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z);
    gl_PointSize *= uVar1;
    gl_PointSize *= (1.0 - uVar2);
    
    vUv = uv;
    vN1 = n1;
}