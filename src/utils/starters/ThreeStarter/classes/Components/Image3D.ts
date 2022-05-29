import * as THREE from 'three';
import GUI from 'lil-gui';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';

import { MediaPlane3D } from './MediaPlane3D';

interface Constructor {
  gui: GUI;
  geometry: THREE.PlaneBufferGeometry;
  fragmentShader?: string;
  vertexShader?: string;
}
export class Image3D extends MediaPlane3D {
  _gui: GUI;

  constructor({ gui, fragmentShader, geometry, vertexShader }: Constructor) {
    super({ fragmentShader, geometry, vertexShader });
    this._gui = gui;
    this._setGui();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);

    this.setSize({
      width: 300,
      height: 300,
    });
  }

  destroy() {
    super.destroy();
  }
}
