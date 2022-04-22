varying vec2 vUv;

uniform vec2 uPlaneRes;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;

void main()
{
    vec3 pos = position;

    //follow mouse
    vec2 mouse2DNormalized;
    mouse2DNormalized.x = (uMouse2D.x / uCanvasRes.x) * 2.0 - 1.0;
    mouse2DNormalized.y = -(uMouse2D.y / uCanvasRes.y) * 2.0 + 1.0;
    
    pos.x += mouse2DNormalized.x * uCanvasRes.x / uPlaneRes.x * 0.5;
    pos.y += mouse2DNormalized.y * uCanvasRes.y / uPlaneRes.y * 0.5;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
}