uniform float uTime;
uniform vec2 uStageSize;
uniform vec2 uPlaneSize;
uniform vec2 uMouse2D;
uniform float uPixelRatio;
uniform float uSize;
uniform float uVar1;
uniform float uVar2;
uniform float uVar3;
uniform float uVar4;


attribute float aRandom;

#define PI 3.14159265359

void main(){
    vec3 stablePosition = position;

    vec4 modelPosition = modelMatrix * vec4(stablePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * uPixelRatio;
    gl_PointSize *= (1.0 / - viewPosition.z) * 1000.0; // * 1000.0 because of camera z position
    gl_PointSize *= uVar1;

}