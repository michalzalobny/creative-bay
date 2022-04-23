import * as THREE from 'three';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';

export class TextTexture extends THREE.EventDispatcher {
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _canvas: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D | null;
  texture: THREE.Texture;

  constructor() {
    super();
    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this.texture = new THREE.Texture(this._canvas);
  }

  _setSizes() {
    if (this._canvas && this._ctx) {
      const w = this._rendererBounds.width;
      const h = this._rendererBounds.height;
      const ratio = Math.min(window.devicePixelRatio, 2);

      this._canvas.width = w * ratio;
      this._canvas.height = h * ratio;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
      this._ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
    this._setSizes();
    this.texture.needsUpdate = true;
  }

  update(updateInfo: UpdateInfo) {
    if (!this._ctx) return;
    this._ctx.clearRect(0, 0, this._rendererBounds.width, this._rendererBounds.height);

    const fontSize = 50;

    this._ctx.font = `bold ${fontSize}px 'OpenSans'`;
    this._ctx.fillStyle = '#fff';

    this._ctx.fillText('Test', this._rendererBounds.width / 2, this._rendererBounds.height / 2);
  }

  destroy() {
    this.texture.dispose();
  }
}
