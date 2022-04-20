import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { UpdateInfo, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Background3D } from '../Components/Background3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _controls: OrbitControls;
  _background3D: Background3D;

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;

    this._background3D = new Background3D({ gui });
    this.add(this._background3D);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._background3D.setMouse2D(this._mouse2D);
    this._background3D.update(updateInfo);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._background3D.setSize({
      width: this._rendererBounds.width * 1.001,
      height: this._rendererBounds.height * 1.001,
    });
  }

  destroy() {
    this._background3D.destroy();
    this.remove(this._background3D);
  }
}
