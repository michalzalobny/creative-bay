varying vec2 vUv;

uniform vec2 uPlaneRes;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;

void main()
{
    vec3 pos = position;

    pos.x += uMouse2D.x * uCanvasRes.x / uPlaneRes.x * 0.5;
    pos.y += uMouse2D.y * uCanvasRes.y / uPlaneRes.y * 0.5;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}