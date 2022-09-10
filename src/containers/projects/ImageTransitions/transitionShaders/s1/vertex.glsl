uniform float uVar1;
uniform float uVar2;
uniform float uVar3;
uniform float uTransitionProgress;

varying vec2 vUv;
varying float vShadowFront;

#define PI 3.1415926535897932384626433832795

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
        oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
        oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  return (rotationMatrix(axis, angle) * vec4(v, 1.0)).xyz;
}

vec2 rotate2D(vec2 _st, float _angle){
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}


void main() {
    float uProgress = uTransitionProgress;
    // uProgress = uVar1;
    float uAngle = PI * 0.015;
    float rad = 0.05;
    float rolls = 5.0;

    float finalAngle = uAngle - 0.0 * 0.3 * sin(uProgress * 6.0);
    vec3 newPosition = position;
    newPosition = rotate(newPosition - vec3(-0.5, 0.5, 0.0), vec3(0.0, 0.0, 1.0), -finalAngle) + vec3(-0.5, 0.5, 0.0);

    float offset = (newPosition.x + 0.5) / (sin(finalAngle) + cos(finalAngle));
    float progress = clamp((uProgress - offset * 0.99) / 0.01, 0.0, 1.0);


    newPosition.z = rad + rad * (1.0 - offset /2.0) * sin(-offset * rolls * PI - 0.5 * PI);
    newPosition.x = -0.5 + rad * (1.0 - offset /2.0) * cos(-offset * rolls * PI + 0.5 * PI);
    newPosition = rotate(newPosition - vec3(-0.5, 0.5, 0.0), vec3(0.0, 0.0, 1.0), finalAngle) + vec3(-0.5, 0.5, 0.0);
    newPosition = rotate(newPosition - vec3(-0.5, 0.5, rad), vec3(sin(finalAngle),cos(finalAngle), 0.0), -PI * uProgress * rolls);
    newPosition += vec3(
        -0.5 + uProgress * cos(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
        0.5 - uProgress * sin(finalAngle) * (sin(finalAngle) + cos(finalAngle)),
        rad * (1.0 - uProgress / 2.0)
    );

    newPosition.z *= 1000.0; //camera's position.z
    newPosition = mix(newPosition, position, progress);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);

    float shadowLength = 3.8;
    float shadowAngleMultiplier = 1.5;
    vec2 uvRot = rotate2D(uv, -uAngle * shadowAngleMultiplier);
    float edge = uvRot.x + rad * shadowLength * smoothstep(1.0, 0.8 , uProgress);
    float sm = 0.09 * 4.2;
    vShadowFront = smoothstep(edge-sm, edge, uProgress);
    float shadowIntensity = 0.8;
    vShadowFront = clamp(vShadowFront, shadowIntensity, 1.0);

    vUv=uv;
}