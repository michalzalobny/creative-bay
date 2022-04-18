import { Vector2 } from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

export const DotScreenShader = {
  uniforms: {
    tDiffuse: { value: null },
    tSize: { value: new Vector2(256, 256) },
    center: { value: new Vector2(0.5, 0.5) },
    angle: { value: 1.57 },
    scale: { value: 1.0 },
  },

  vertexShader: /* glsl */ `

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

  fragmentShader: /* glsl */ `

		uniform vec2 center;
		uniform float angle;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		//source of rand : https://github.com/th3-z/nit3dyne/blob/8aafdcc8e35ad60453d0d439863749e83c53ef2c/nit3dyne/shaders/post.frag
		float random(vec2 p) {
			vec2 k1 = vec2(
					23.14069263277926, // e^pi (Gelfond's constant)
					2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
			);
			return fract(
					cos(dot(p, k1)) * 12345.6789
			);
		}

		void main() {
			vec4 color = texture2D( tDiffuse, vUv );
			vec2 uvRandom = vUv;
			uvRandom.y *= random(vec2(uvRandom.y, 0.4));
			color.rgb += random(uvRandom) * 0.12;
			gl_FragColor = color;

		}`,
};
