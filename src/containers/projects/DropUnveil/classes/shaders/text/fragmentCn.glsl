uniform vec2 uPlaneRes;
uniform vec2 uImageRes;
uniform sampler2D tMap;
uniform float uTime;
uniform vec2 uMouse2D;
uniform vec2 uCanvasRes;

varying vec2 vUv;

void main() {

  vec2 mouse2D;
  mouse2D.x = uMouse2D.x / uCanvasRes.x;
  mouse2D.y = 1.0 - uMouse2D.y / uCanvasRes.y;
  
  vec2 aspect = vec2(uCanvasRes.x / uCanvasRes.y, 1.0);

  float radius = 0.5 * 250.0 / uPlaneRes.y;
  float dist = distance(mouse2D * aspect, vUv * aspect);
  float d = smoothstep(radius, radius + 0.005, dist);

  vec2 sub = mouse2D - vUv;
  sub *= aspect;

  vec2 uv = vUv - sub * pow(dist * 0.7, 0.7);
  vec4 tex_r = texture2D(tMap, uv);
  vec4 tex_g = texture2D(tMap, uv + sub * 0.03);
  vec4 tex_b = texture2D(tMap, uv + sub * 0.01);
  float a = max(max(tex_r.a, tex_g.a), tex_b.a);
  vec4 tex = vec4(tex_r.r, tex_g.g, tex_b.b, a);

  tex.a = mix(tex.a, 0.0, d);

  gl_FragColor = tex;
}