import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { InstancedSpheres3D } from '../Components/InstancedSpheres3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _loadedAssets: LoadedAssets | null = null;
  _instancedSpheres3D: InstancedSpheres3D | null = null;

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._instancedSpheres3D = new InstancedSpheres3D();
    this.add(this._instancedSpheres3D);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
    if (this._instancedSpheres3D) {
      this._instancedSpheres3D.setCircleMask(assets['circleMask'].asset as THREE.Texture);
    }
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    if (this._instancedSpheres3D) this._instancedSpheres3D.update(updateInfo);
  }

  destroy() {
    super.destroy();
    if (this._instancedSpheres3D) this.remove(this._instancedSpheres3D);
    if (this._instancedSpheres3D) this._instancedSpheres3D.destroy();
  }
}
