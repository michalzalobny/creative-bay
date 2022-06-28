#pragma glslify: cnoise = require(glsl-noise/simplex/3d)

uniform float uSize;
uniform float uTime;
uniform float uPixelRatio;
uniform float uDistortion;
uniform float uSizeFactor;
uniform vec2 uMouse2D;
uniform float uVar1;
uniform float uVar2;
uniform float uVar3;
uniform float uVar4;

varying vec2 vUv;

#define PI 3.14159265359

vec3 snoiseVec3(vec3 x){
    float s=cnoise(vec3(x));
    float s1=cnoise(vec3(x.y-19.1,x.z+33.4,x.x+47.2));
    float s2=cnoise(vec3(x.z+74.2,x.x-124.5,x.y+99.4));
    vec3 c=vec3(s,s1,s2);
    return c;
}

vec3 curlNoise(vec3 p){
    const float e=.1;
    vec3 dx=vec3(e,0.,0.);
    vec3 dy=vec3(0.,e,0.);
    vec3 dz=vec3(0.,0.,e);
    
    vec3 p_x0=snoiseVec3(p-dx);
    vec3 p_x1=snoiseVec3(p+dx);
    vec3 p_y0=snoiseVec3(p-dy);
    vec3 p_y1=snoiseVec3(p+dy);
    vec3 p_z0=snoiseVec3(p-dz);
    vec3 p_z1=snoiseVec3(p+dz);
    
    float x=p_y1.z-p_y0.z-p_z1.y+p_z0.y;
    float y=p_z1.x-p_z0.x-p_x1.z+p_x0.z;
    float z=p_x1.y-p_x0.y-p_y1.x+p_y0.x;
    
    const float divisor=1./(2.*e);
    return normalize(vec3(x,y,z)*divisor);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main(){
    vec3 stablePosition = position;

    //Rotation values
    float onOffX = step(0.0, uMouse2D.x); // uMouse2D.x goes from [-1 to 1] from [left screen edge, right screen edge]
    float onOffY = step(0.0, uMouse2D.y);
    

    float perspective = 300.0; //No matter the size canvasRes or planeRes, the perspective looks the same for same settings on all devices

    float stX = (uv.x - 0.5);
    float mX = abs(uMouse2D.x);
    float perX1 = stX * perspective * mX;
    float perX2 = -stX * perspective * mX;
    float finalPerX = mix(perX1, perX2, onOffX);

    float stY = (uv.y - 0.5);
    float mY = abs(uMouse2D.y);
    float perY1 = stY * perspective * mY;
    float perY2 = -stY * perspective * mY;
    float finalPerY = mix(perY1, perY2, onOffY);

    //Distortions
    float shrinkValue = 2.0 / uPixelRatio;
    float posXFactor = clamp((1.0 - (abs(stablePosition.x * shrinkValue) * 2.0)) + (1.0 - uDistortion) * shrinkValue, 0.0, 1.0);

    vec3 myNoise = vec3(position.x * 3.5, position.y * 0.6, 1.0) * curlNoise(vec3(
       uVar1 * position.x * 6.0 + (uTime + 1000.0) * 0.15 * uVar4,
       uVar2 * position.y * 3.0 + (uTime + 1000.0) * 0.05 * uVar4,
       uVar3 * uTime * 0.3
    ));

    vec3 distortion = myNoise * 1.3;

    stablePosition += distortion * uDistortion;
    stablePosition.z *= 0.35;

    float rotationRatio = 0.6;
    stablePosition.xz *= rotate2d( PI * 0.50 * -uMouse2D.x * uDistortion * rotationRatio);
    stablePosition.yz *= rotate2d( PI * 0.50 * -uMouse2D.y * uDistortion * rotationRatio);

    vec4 modelPosition = modelMatrix * vec4(stablePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    //Applying perspective for the rotation
    viewPosition.z += finalPerX * uDistortion;
    viewPosition.z += finalPerY * uDistortion;

    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = uSize * uPixelRatio * uSizeFactor;
    gl_PointSize *= (1.0 / - viewPosition.z);
    gl_PointSize *= posXFactor;

    vUv = uv;
}