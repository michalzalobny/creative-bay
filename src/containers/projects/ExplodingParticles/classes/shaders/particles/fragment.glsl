uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform sampler2D tMap3;
uniform vec2 uMediaRes1;
uniform vec2 uMediaRes2;
uniform vec2 uMediaRes3;
uniform vec2 uPlaneRes;
uniform vec2 uCanvasRes;
uniform float uProgress1;
uniform float uProgress2;

varying vec2 vUv;

void main(){
    vec2 ratio1 = vec2(
      min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes1.x / uMediaRes1.y), 1.0),
      min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes1.y / uMediaRes1.x), 1.0)
    );

    vec2 uv1 = vec2(
      vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5,
      vUv.y * ratio1.y + (1.0 - ratio1.y) * 0.5
    );

    vec2 ratio2 = vec2(
      min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes2.x / uMediaRes2.y), 1.0),
      min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes2.y / uMediaRes2.x), 1.0)
    );

    vec2 uv2 = vec2(
      vUv.x * ratio2.x + (1.0 - ratio2.x) * 0.5,
      vUv.y * ratio2.y + (1.0 - ratio2.y) * 0.5
    );

    vec2 ratio3 = vec2(
      min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes3.x / uMediaRes3.y), 1.0),
      min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes3.y / uMediaRes3.x), 1.0)
    );

    vec2 uv3 = vec2(
      vUv.x * ratio3.x + (1.0 - ratio3.x) * 0.5,
      vUv.y * ratio3.y + (1.0 - ratio3.y) * 0.5
    );

    vec4 t1 = texture2D(tMap1, uv1);
    vec4 t2 = texture2D(tMap2, uv2);
    vec4 t3 = texture2D(tMap3, uv3);

    vec4 finalTexture = mix(mix(t1,t2, uProgress1), t3, uProgress2);

    //Relative to where it is in the viewport at any given time
    // vec2 st = gl_FragCoord.xy;
    // float posX = st.x / uCanvasRes.x;
    // float posY = st.y / uCanvasRes.y;
  
    gl_FragColor = finalTexture;
  }