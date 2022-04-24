import * as THREE from 'three';
import GUI from 'lil-gui';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';
import { breakpoints } from 'utils/media';

import { MediaPlane3D } from './MediaPlane3D';

interface Constructor {
  gui: GUI;
  geometry: THREE.PlaneBufferGeometry;
  fragmentShader?: string;
  vertexShader?: string;
}
export class Lense3D extends MediaPlane3D {
  static tabletSize = 250;
  static mobileSize = 130;

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

    if (this._rendererBounds.width >= breakpoints.tablet) {
      this.setSize({
        width: Lense3D.tabletSize,
        height: Lense3D.tabletSize,
      });
    } else {
      this.setSize({
        width: Lense3D.mobileSize,
        height: Lense3D.mobileSize,
      });
    }
  }

  destroy() {
    super.destroy();
  }
}
