import * as THREE from 'three';

export const disposeModel = (model: THREE.Group | THREE.Object3D) => {
  if (model.children) model.children.forEach(nestedChild => disposeModel(nestedChild));
  if (model instanceof THREE.Mesh) {
    if (model.geometry instanceof THREE.BufferGeometry) model.geometry.dispose();
    if (model.material instanceof THREE.Material) model.material.dispose();
  }
};
