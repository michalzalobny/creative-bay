import * as THREE from 'three';
import { GLTF, OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { UpdateInfo, LoadedAssets } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _controls: OrbitControls;
  _loadedAssets: LoadedAssets | null = null;
  _blenderScene: THREE.Group | null = null;

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
    this._blenderScene = (this._loadedAssets['officeSrc'].asset as GLTF).scene;
    if (this._blenderScene) this.add(this._blenderScene);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    if (this._blenderScene) this.remove(this._blenderScene);
  }
}
