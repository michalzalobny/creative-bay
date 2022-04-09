import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

export class Model3D extends InteractiveObject3D {
  _model: THREE.Group | null = null;
  _modelMaterial: THREE.MeshMatcapMaterial | null = null;

  constructor() {
    super();
  }

  setModel(el: THREE.Group) {
    this._model = el;
    this.add(this._model);
  }

  setMaterial(material: THREE.MeshMatcapMaterial) {
    this._modelMaterial = material;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._modelMaterial?.dispose();
    if (this._model) this.remove(this._model);
  }
}
