import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import vertexShader from '../shaders/particles/vertexShader.glsl';
import fragmentShader from '../shaders/particles/fragmentShader.glsl';

export class Particles3D extends InteractiveObject3D {
  _geometry = new THREE.BufferGeometry();
  _material: THREE.ShaderMaterial | null = null;
  _points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial> | null = null;

  constructor() {
    super();
  }

  _generateParticles() {
    const RANDOM_SIZE = 6;
    const COUNT = 100;

    this._geometry = new THREE.BufferGeometry();

    const positionArray = new Float32Array(COUNT * 3);
    const scaleArray = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * RANDOM_SIZE;
      positionArray[i * 3 + 1] = 5;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * RANDOM_SIZE;
      scaleArray[i] = Math.random();
    }

    this._geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));

    // Material
    this._material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 120 },
        uTime: { value: 0 },
        uScale: { value: 0.5 },
      },
      vertexShader,
      fragmentShader,
    });

    this._geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    this._points = new THREE.Points(this._geometry, this._material);
    this.add(this._points);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._material) {
      this._material.uniforms.uTime.value = updateInfo.time * updateInfo.slowDownFactor;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    this._points && this.remove(this._points);
  }
}
