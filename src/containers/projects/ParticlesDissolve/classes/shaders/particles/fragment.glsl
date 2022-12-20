

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

varying vec2 vUv;
varying float vN1;

void main(){
    vec2 ratio1 = vec2(
      min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes1.x / uMediaRes1.y), 1.0),
      min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes1.y / uMediaRes1.x), 1.0)
    );

    vec2 uv1 = vec2(
      vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5,
      vUv.y * ratio1.y + (1.0 - ratio1.y) * 0.5
    );

    vec4 t1 = texture2D(tMap1, uv1);
    
    vec4 finalCol = mix(t1, vec4(1.0,0.0,0.0,0.0), uVar2);

    finalCol.rgb = vec3(t1);

    gl_FragColor = finalCol;
  }