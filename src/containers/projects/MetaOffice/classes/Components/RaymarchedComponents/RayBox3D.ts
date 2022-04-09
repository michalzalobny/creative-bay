import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { RayObject3D } from './RayObject3D';

export class RayBox3D extends RayObject3D {
  _geometry: THREE.BoxBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.BoxBufferGeometry, THREE.MeshStandardMaterial> | null = null;

  constructor() {
    super();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.BoxBufferGeometry(2, 2, 2);
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.castShadow = true;
    this._mesh.receiveShadow = true;
    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    if (this._mesh) this.remove(this._mesh);
    this._geometry?.dispose();
  }
}
