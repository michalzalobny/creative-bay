

precision highp float;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

#pragma glslify: cnoise = require(glsl-noise/simplex/3d)

#pragma glslify: curl = require('../helpers/curl4')

uniform float time;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float aRandom;

varying vec2 vUv;
varying float vScale;



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


void main() {
    // vec3 translateC = translate;

    // vec3 myNoise = curlNoise(vec3(
    //    translateC.x + (time * 0.1),
    //    translateC.y + (time * 0.1),
    //    translateC.z + (time * 0.1)
    // ));

    // vec3 translatePrev = translateC;

    // translateC += myNoise;

    // vec4 mvPosition = modelViewMatrix * vec4( translateC, 1.0 );

    // vec3 mvPositionCop = mvPosition.xyz;

    // float radius  = 4.0;
    // mvPosition.xyz += position * radius;

    // // Set the stretch vector
    // vec3 stretchVector = normalize(vec3(1.0, 1.0, 1.0));

    // // Create a rotation matrix that rotates the instanced geometry to align with the stretch vector
    // mat4 rotation = mat4(
    // stretchVector.x, stretchVector.y, stretchVector.z, 0.0,
    // 0.0, stretchVector.x, stretchVector.y, stretchVector.z,
    // 0.0, 0.0, stretchVector.x, stretchVector.y,
    // 0.0, 0.0, 0.0, 1.0
    // );


    // gl_Position = projectionMatrix * mvPosition * scale ;
    // vUv = uv;

    vec3 offset = curlNoise(instancePosition + time *0.01);
    float positionScale = 200.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * vec3(5.0, 1.0, 1.0) + (instancePosition+ offset) * positionScale, 1.0) ;
}