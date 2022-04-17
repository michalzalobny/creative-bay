import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Sphere3D } from '../Components/Sphere3D';
import { BlobSphere3D } from '../Components/BlobSphere3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _controls: OrbitControls;
  _sphere1 = new Sphere3D();
  _blobSphere1 = new BlobSphere3D();

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;

    this.add(this._sphere1);
    this.add(this._blobSphere1);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._sphere1.update(updateInfo);
    this._blobSphere1.update(updateInfo);
  }

  destroy() {
    this.remove(this._sphere1);
    this._sphere1.destroy();
    this.remove(this._blobSphere1);
    this._blobSphere1.destroy();
  }
}
