import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Image3D } from '../Components/Image3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _starterImage3D: Image3D;
  _planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  _loadedAssets: LoadedAssets | null = null;

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._starterImage3D = new Image3D({ gui, geometry: this._planeGeometry });
    this.add(this._starterImage3D);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._starterImage3D.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
    this._starterImage3D.setAsset(this._loadedAssets['starterImage']);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    this._starterImage3D.destroy();
    this.remove(this._starterImage3D);
    this._planeGeometry.dispose();
  }
}
