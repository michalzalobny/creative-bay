import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Missle3D extends InteractiveObject3D {
  _gui: GUI;
  _missleGroup = new THREE.Group();
  _sphereGeometry = new THREE.SphereBufferGeometry(1, 1, 1);
  _material: THREE.MeshStandardMaterial;

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;

    this._material = new THREE.MeshStandardMaterial({
      color: 0xd4d4d4,
      roughness: 0,
    });

    this._setGui();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
  }
}
