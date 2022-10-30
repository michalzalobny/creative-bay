import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Gun3D extends InteractiveObject3D {
  _gui: GUI;
  _gun: THREE.Group | null = null;

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  setAsset(item: THREE.Group) {
    this._gun = item;
    this._gun.scale.set(2, 2, 2);
    this._gun.position.y = 10;
    this.add(this._gun);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._gun) {
      this._gun.rotation.y = updateInfo.time * 0.0005;
      const offsetY = Math.sin(updateInfo.time * 0.001) * 1.5;
      this._gun.position.y = 10 + offsetY * offsetY;
    }
  }

  destroy() {
    if (this._gun) this.remove(this._gun);
    super.destroy();
  }
}
