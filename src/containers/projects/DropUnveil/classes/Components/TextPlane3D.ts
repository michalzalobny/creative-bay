import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, Bounds, LoadedAsset, AssetType } from 'utils/sharedTypes';

import { MediaPlane3D } from './MediaPlane3D';
import { TextTexture } from './TextTexture';

interface Constructor {
  gui: GUI;
  vertexShader?: string;
  fragmentShader?: string;
  geometry: THREE.PlaneBufferGeometry;
}

export class TextPlane3D extends MediaPlane3D {
  _gui: GUI;
  _textTexture: TextTexture | null = null;

  constructor({ gui, fragmentShader, vertexShader, geometry }: Constructor) {
    super({ geometry, fragmentShader, vertexShader });
    this._gui = gui;
    this._setGui();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;

    //Updating previous one creates errors, so it's better to create new one when viewport is resized
    this._createTextTexture(this._rendererBounds);
  }

  _createTextTexture(bounds: Bounds) {
    this._textTexture?.destroy();
    this._textTexture = null;
    this._textTexture = new TextTexture();
    this._textTexture.setRendererBounds(bounds);

    const asset: LoadedAsset = {
      asset: this._textTexture.texture,
      naturalWidth: this._textTexture._rendererBounds.width,
      naturalHeight: this._textTexture._rendererBounds.height,
      type: AssetType.IMAGE,
    };
    this.setAsset(asset);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    if (this._textTexture) this._textTexture.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._textTexture?.destroy();
  }
}
