import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo } from 'utils/sharedTypes';

import vertexShader from '../shaders/sphere/vertex.glsl';
import fragmentShader from '../shaders/sphere/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Sphere3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.SphereBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _gui: GUI;
  _background = {
    color1: [255 / 255, 255 / 255, 229 / 255],
    color2: [255 / 255, 113 / 255, 66 / 255],
    colorAccent: [61 / 255, 66 / 255, 148 / 255],
  };

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(1000, 32, 32);
    this._material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: this._background.color1 },
        uColor2: { value: this._background.color2 },
        uColorAccent: { value: this._background.colorAccent },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  _setGui() {
    const background = this._gui.addFolder('Background');
    background.close();
    background.addColor(this._background, 'color1', 1).name('Color 1');
    background.addColor(this._background, 'color2', 1).name('Color 2');
    background.addColor(this._background, 'colorAccent', 1).name('Color accent');
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh) {
      this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}
