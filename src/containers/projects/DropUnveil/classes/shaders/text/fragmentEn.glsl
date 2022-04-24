uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;

varying vec2 vUv;

#define S(a,t) smoothstep(a*0.975, a, t)

void main() {
  vec2 mouse2D = uMouse2D;
  //reverse normalized mouse
  mouse2D.x = (mouse2D.x + 1.0) * 0.5; 
  mouse2D.y = 1.0 - (mouse2D.y - 1.0) * -0.5;
  
  vec2 aspect = vec2(uCanvasRes.x / uCanvasRes.y, 1.0);

  float radius = 0.5 * 250.0 / uPlaneRes.y;
  float dist = distance(mouse2D * aspect, vUv * aspect);
  float d = 1.0 - S(radius, dist);

  vec2 sub = mouse2D - vUv;
  sub *= aspect;

  vec4 tex = texture2D(tMap, vUv);

  tex.a = mix(tex.a, 0.0, d);

  gl_FragColor = tex;
  
}