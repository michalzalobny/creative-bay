import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import vertexShader from '../shaders/blobSphere/vertex.glsl';
import fragmentShader from '../shaders/blobSphere/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

export class BlobSphere3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.SphereBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;

  constructor() {
    super();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(200, 32, 32);
    this._material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tCube: { value: 0 },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh) {
      this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
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
