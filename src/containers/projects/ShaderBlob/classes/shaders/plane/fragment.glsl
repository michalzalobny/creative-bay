uniform float uTime;
varying vec2 vUv;

#define PI 3.14159265359


void main()
{
    vec2 uv = vUv;

    vec3 col = vec3(0.5);

    gl_FragColor = vec4(col, 1.0);
}