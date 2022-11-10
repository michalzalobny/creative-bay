import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { TextPlane3D } from '../Components/TextPlane3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  _loadedAssets: LoadedAssets | null = null;
  _textPlane3D: TextPlane3D;

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._textPlane3D = new TextPlane3D({
      geometry: this._planeGeometry,
      gui,
      text: ['Hold to', 'dissolve'],
      offsetsArray: [-0.18, 0.28, -0.08, 0, 0, 0],
    });
    this.add(this._textPlane3D);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._textPlane3D.setRendererBounds(bounds);
    this._textPlane3D.setSize({ width: bounds.width, height: bounds.height });
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._textPlane3D.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._textPlane3D.destroy();
    this.remove(this._textPlane3D);
    this._planeGeometry.dispose();
  }
}
