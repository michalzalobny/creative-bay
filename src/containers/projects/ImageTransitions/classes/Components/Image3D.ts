import * as THREE from 'three';
import GUI from 'lil-gui';
import TWEEN, { Tween } from '@tweenjs/tween.js';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';

import { MediaPlane3D, ImagesSettings } from './MediaPlane3D';

interface Constructor {
  gui: GUI;
  geometry: THREE.PlaneBufferGeometry;
  elId: number;
  fragmentShader?: string;
  vertexShader?: string;
  imagesSettings: ImagesSettings;
}
export class Image3D extends MediaPlane3D {
  _gui: GUI;
  _elId;
  _transitionProgressTween: Tween<{ progress: number }> | null = null;

  constructor({ imagesSettings, elId, gui, fragmentShader, geometry, vertexShader }: Constructor) {
    super({ imagesSettings, fragmentShader, geometry, vertexShader });
    this._elId = elId;
    this._gui = gui;

    this._setHTMLElements();
    this._addListeners();
  }

  _animateTransition(destination: number) {
    if (this._transitionProgressTween) this._transitionProgressTween.stop();
    this._transitionProgressTween = new TWEEN.Tween({
      progress: this._mesh.material.uniforms.uTransitionProgress.value as number,
    })
      .to({ progress: destination }, 1500)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._mesh.material.uniforms.uTransitionProgress.value = obj.progress;
      });
    this._transitionProgressTween.start();
  }

  _setHTMLElements() {
    this._domEl = document.querySelector(`[data-itransition-id="${this._elId}"]`) as HTMLElement;
    this._buttonEl = document.querySelector(
      `[data-itransition-btn="${this._elId}"]`
    ) as HTMLElement;
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

  _handleClick = () => {
    if (this._currentImage === 0) {
      this._currentImage = 1;
    } else {
      this._currentImage = 0;
    }
    this._animateTransition(this._currentImage);
  };

  _addListeners() {
    this._buttonEl?.addEventListener('click', this._handleClick);
  }

  _removeListeners() {
    this._buttonEl?.removeEventListener('click', this._handleClick);
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
    this._removeListeners();
  }
}
