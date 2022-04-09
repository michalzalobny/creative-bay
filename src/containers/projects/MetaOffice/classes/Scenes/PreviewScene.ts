import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/singletons/MouseMove';
import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
}

export class PreviewScene extends InteractiveScene {
  static highlightColor = [0.65, 0.792, 0.219];

  _controls: OrbitControls;

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {}
}
