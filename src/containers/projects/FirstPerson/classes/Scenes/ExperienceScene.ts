import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _loadedAssets: LoadedAssets | null = null;
  _ambientLight1: THREE.AmbientLight;
  _planeGeometry = new THREE.PlaneBufferGeometry(200, 200, 10, 10);
  _whiteMaterial: THREE.MeshStandardMaterial;
  _planeMesh: THREE.Mesh;

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._ambientLight1 = new THREE.AmbientLight(0xffffff, 0.05);
    this.add(this._ambientLight1);

    this._whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this._planeMesh = new THREE.Mesh(this._planeGeometry, this._whiteMaterial);
    this._planeMesh.castShadow = false;
    this._planeMesh.receiveShadow = true;
    this._planeMesh.rotation.x = (-Math.PI / 2) * 1;
    this._planeMesh.position.y = -10;
    this.add(this._planeMesh);

    //Extra
    const pointLight = new THREE.PointLight(0xff0000);
    pointLight.position.y = 5;
    pointLight.position.x = 30;
    this.add(pointLight);

    const box = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 5), this._whiteMaterial);
    box.position.y = -10 + 2.5;
    box.position.x = 15;
    box.position.z = -5;
    this.add(box);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this.remove(this._ambientLight1);
    this.remove(this._planeMesh);
    this._whiteMaterial.dispose();
    this._planeGeometry.dispose();
  }
}
