uniform vec2 uPlaneRes;
uniform vec2 uMediaRes1;
uniform vec2 uMediaRes2;
uniform vec2 uCanvasRes;
uniform vec2 uMouse2D;
uniform sampler2D tMap1;
uniform sampler2D tMap2;
uniform float uTime;
uniform float uTransitionProgress;
uniform float uVar1;
uniform float uVar2;
uniform float uVar3;

varying vec2 vUv;

#define PI 3.14159265359

mat2 rotate(float a) {
			float s = sin(a);
			float c = cos(a);
			return mat2(c, -s, s, c);
		}


void main() {
    vec2 ratio1 = vec2(
        min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes1.x / uMediaRes1.y), 1.0),
        min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes1.y / uMediaRes1.x), 1.0)
    );

    vec2 ratio2 = vec2(
        min((uPlaneRes.x / uPlaneRes.y) / (uMediaRes2.x / uMediaRes2.y), 1.0),
        min((uPlaneRes.y / uPlaneRes.x) / (uMediaRes2.y / uMediaRes2.x), 1.0)
    );

    vec2 uv1 = vec2(
        vUv.x * ratio1.x + (1.0 - ratio1.x) * 0.5,
        vUv.y * ratio1.y + (1.0 - ratio1.y) * 0.5
    );

    vec2 uv2 = vec2(
        vUv.x * ratio2.x + (1.0 - ratio2.x) * 0.5,
        vUv.y * ratio2.y + (1.0 - ratio2.y) * 0.5
    );

    float tilesAmount = 10.0;
    float offsetStrength = 0.36; //[0-1]
    
    vec2 uvDividedF1 = floor(uv1 * vec2( tilesAmount ,1.0));
    vec2 uvDisplaced1 = uv1 - (vec2(1.0, 0.0)  * uvDividedF1.x / tilesAmount) * offsetStrength * uTransitionProgress;

    vec2 uvDividedF2 = floor(uv2 * vec2( tilesAmount ,1.0));
    vec2 uvDisplaced2 = uv2 - (vec2(1.0, 0.0)  * uvDividedF2.x / tilesAmount) * offsetStrength * (1.0-uTransitionProgress);

    vec4 image1 = texture2D(tMap1,uvDisplaced1);
    vec4 image2 = texture2D(tMap2,uvDisplaced2);

    gl_FragColor = mix(image1, image2, 0.0); 
}