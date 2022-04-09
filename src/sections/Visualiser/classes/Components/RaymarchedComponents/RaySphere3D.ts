import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { RayObject3D } from './RayObject3D';

export class RaySphere3D extends RayObject3D {
  _geometry: THREE.SphereBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.MeshStandardMaterial> | null = null;

  constructor() {
    super();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(1, 32, 32);
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
