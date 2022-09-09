import * as THREE from 'three';
import GUI from 'lil-gui';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';

import { MediaPlane3D } from './MediaPlane3D';

interface Constructor {
  gui: GUI;
  geometry: THREE.PlaneBufferGeometry;
  elId: number;
  fragmentShader?: string;
  vertexShader?: string;
}
export class Image3D extends MediaPlane3D {
  _gui: GUI;
  _elId;

  constructor({ elId, gui, fragmentShader, geometry, vertexShader }: Constructor) {
    super({ fragmentShader, geometry, vertexShader });
    this._elId = elId;
    this._gui = gui;

    this._setHTMLElements();
  }

  _setHTMLElements() {
    this._domEl = document.querySelector(`[data-itransition-id="${this._elId}"]`) as HTMLElement;
    this._updateRects();
  }

  _updateRects() {
    if (!this._domEl) return;
    this._domElBounds = this._domEl.getBoundingClientRect();
  }

  _updateX(x: number) {
    if (this._mesh && this._domElBounds) {
      this._mesh.position.x =
        -x + this._domElBounds.left - this._rendererBounds.width / 2 + this._mesh.scale.x / 2;
    }
  }

  _updateY(y: number) {
    if (this._mesh && this._domElBounds) {
      this._mesh.position.y =
        -y - this._domElBounds.top + this._rendererBounds.height / 2 - this._mesh.scale.y / 2;
    }
  }

  update(updateInfo: UpdateInfo, offsetY?: number) {
    super.update(updateInfo);

    this._updateX(0);
    if (offsetY !== null && typeof offsetY !== 'undefined') {
      this._updateY(offsetY);
    }
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._updateRects();
    if (!this._domElBounds) return;
    this.setSize({ width: this._domElBounds.width, height: this._domElBounds.height });
  }

  destroy() {
    super.destroy();
  }
}
