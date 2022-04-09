import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';

export class Floor3D extends InteractiveObject3D {
  static width = 16;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.MeshStandardMaterial | null = null;

  constructor() {
    super();
    this._drawFloor();
  }

  _drawFloor() {
    this._geometry = new THREE.PlaneBufferGeometry(Floor3D.width, Floor3D.width);
    this._material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, color: '#ffffff' });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.rotation.x = -Math.PI * 0.5;
    this._mesh.position.y = 0;
    this._mesh.receiveShadow = true;

    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}
