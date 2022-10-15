import * as THREE from 'three';
import GUI from 'lil-gui';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';
import { sharedValues } from 'utils/sharedValues';

import { FirstPersonCamera } from '../utils/FirstPersonCamera';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class InteractiveScene extends THREE.Scene {
  static lerpEase = sharedValues.motion.LERP_EASE;
  _raycaster = new THREE.Raycaster();
  _rendererBounds: Bounds = { height: 100, width: 100 };
  _camera: THREE.PerspectiveCamera;
  _gui: GUI;
  _pixelRatio = 1;
  _fpsCamera;

  constructor({ camera, gui }: Constructor) {
    super();
    this._camera = camera;
    this._gui = gui;
    this._fpsCamera = new FirstPersonCamera({ camera });
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
  }

  update(updateInfo: UpdateInfo) {
    this._fpsCamera.update(updateInfo);
  }

  setPixelRatio(ratio: number) {
    this._pixelRatio = ratio;
  }

  destroy() {
    this._fpsCamera.destroy();
  }
}
