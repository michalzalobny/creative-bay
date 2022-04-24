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
  text: [string, string, string];
  offsetsArray: [number, number, number, number, number, number];
}

export class TextPlane3D extends MediaPlane3D {
  _gui: GUI;
  _textTexture: TextTexture | null = null;
  _text;
  _offsetsArray;
  _isTTAnimatedIn = false;

  constructor({ gui, fragmentShader, vertexShader, geometry, text, offsetsArray }: Constructor) {
    super({ geometry, fragmentShader, vertexShader });
    this._text = text;
    this._offsetsArray = offsetsArray;

    this._gui = gui;
    this._setGui();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    //Updating previous one creates errors, so it's better to create new one when viewport is resized
    this._createTextTexture(this._rendererBounds);
  }

  _createTextTexture(bounds: Bounds) {
    this._textTexture?.destroy();
    this._textTexture = null;
    this._textTexture = new TextTexture({
      text: this._text,
      offsetsArray: this._offsetsArray,
      isAnimatedIn: this._isTTAnimatedIn,
    });
    this._isTTAnimatedIn = true;
    this._textTexture.setRendererBounds(bounds);

    const asset: LoadedAsset = {
      asset: this._textTexture.texture,
      naturalWidth: this._textTexture._rendererBounds.width,
      naturalHeight: this._textTexture._rendererBounds.height,
      type: AssetType.IMAGE,
    };
    this.setAsset(asset);

    this._textTexture.animateIn();
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
