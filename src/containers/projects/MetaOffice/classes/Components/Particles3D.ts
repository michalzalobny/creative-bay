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
    this._generateParticles();
  }

  _generateParticles() {
    const RANDOM_SIZE = 5;
    const COUNT = 200;

    const positionArray = new Float32Array(COUNT * 3);
    const scaleArray = new Float32Array(COUNT);

    const offset = {
      x: 0,
      y: 3,
      z: 0,
    };

    for (let i = 0; i < COUNT; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * RANDOM_SIZE + offset.x;
      positionArray[i * 3 + 1] = (Math.random() - 0.5) * RANDOM_SIZE + offset.y;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * RANDOM_SIZE + offset.z;
      scaleArray[i] = Math.random();
    }

    this._geometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    this._geometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    this._material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      transparent: true,
      uniforms: {
        uPixelRatio: { value: 1 },
        uSize: { value: 80 },
        uTime: { value: 0 },
        uScale: { value: 2 },
      },
      vertexShader,
      fragmentShader,
    });

    this._points = new THREE.Points(this._geometry, this._material);
    this.add(this._points);
  }

  setPixelRatio(ratio: number) {
    if (this._material) {
      this._material.uniforms.uPixelRatio.value = ratio;
    }
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._material) {
      this._material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    this._points && this.remove(this._points);
  }
}
