import * as THREE from 'three';

import { UpdateInfo, Size, Mouse } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import fragmentShaderDefault from '../shaders/particles/fragment.glsl';
import vertexShaderDefault from '../shaders/particles/vertex.glsl';

interface ParticlesSettings {
	uVar1: number;
	uVar2: number;
	uVar3: number;
	uVar4: number;
}

interface Constructor {
	fragmentShader?: string;
	vertexShader?: string;
	geometry: THREE.BufferGeometry;
	particleSize: number;
	particlesSettings: ParticlesSettings;
}

export class PointObject3D extends InteractiveObject3D {
	_points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
	_material: THREE.ShaderMaterial;
	_stageSize: Size = { width: 1, height: 1 };
	_fragmentShader: string;
	_vertexShader: string;
	_geometry: THREE.BufferGeometry; //Remember to dispose passed geometry

	constructor({
		particlesSettings,
		particleSize,
		fragmentShader,
		geometry,
		vertexShader,
	}: Constructor) {
		super();
		this._fragmentShader = fragmentShader || fragmentShaderDefault;
		this._vertexShader = vertexShader || vertexShaderDefault;
		this._geometry = geometry;

		this._material = new THREE.ShaderMaterial({
			// side: THREE.FrontSide,
			vertexShader: this._vertexShader,
			fragmentShader: this._fragmentShader,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			uniforms: {
				uTime: { value: 0 },
				uStageSize: {
					value: [1, 1],
				},
				uPlaneSize: {
					value: [1, 1], //Plane size in pixels
				},
				uMouse2D: {
					value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
				},
				uPixelRatio: { value: 1 },
				uSize: { value: particleSize },
				uVar1: { value: particlesSettings.uVar1 },
				uVar2: { value: particlesSettings.uVar2 },
				uVar3: { value: particlesSettings.uVar3 },
				uVar4: { value: particlesSettings.uVar4 },
				tMask: { value: null },
			},
		});

		this._points = new THREE.Points(this._geometry, this._material);
		this.add(this._points);
	}

	setVar(name: string, value: number) {
		this._points.material.uniforms[name].value = value;
	}

	setMouse(mouse: Mouse) {
		this._points.material.uniforms.uMouse2D.value = [mouse.current.x, mouse.current.y];
	}

	setPixelRatio(ratio: number) {
		this._points.material.uniforms.uPixelRatio.value = ratio;
	}

	setPlaneSize(size: Size) {
		this._points.scale.x = size.width;
		this._points.scale.y = size.height;

		this._points.material.uniforms.uPlaneSize.value = [this._points.scale.x, this._points.scale.y];
	}

	setStageSize(size: Size) {
		this._stageSize = size;

		this._points.material.uniforms.uStageSize.value = [
			this._stageSize.width,
			this._stageSize.height,
		];
	}

	setParticleMaskTexture(texture: THREE.Texture) {
		this._points.material.uniforms.tMask.value = texture;
	}

	update(updateInfo: UpdateInfo) {
		super.update(updateInfo);
		this._points.material.uniforms.uTime.value = updateInfo.time * 0.001;
	}

	destroy() {
		super.destroy();
		this._material.dispose();
		this.remove(this._points);
	}
}
