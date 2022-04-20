import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';

import vertexShader from '../shaders/plane/vertex.glsl';
import fragmentShader from '../shaders/plane/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Background3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _gui: GUI;

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
    this._drawObject();
  }

  _drawObject() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
    this._material = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  setSize(bounds: Bounds) {
    if (this._mesh) {
      this._mesh.scale.x = bounds.width;
      this._mesh.scale.y = bounds.height;
    }
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
