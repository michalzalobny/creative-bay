import * as THREE from 'three';

export const disposeModel = (model: THREE.Group | THREE.Object3D) => {
  model.traverse(child => {
    if (child instanceof THREE.Mesh) {
      if (child.children) {
        child.children.forEach(nestedChild => disposeModel(nestedChild));
      }
      if (child.geometry instanceof THREE.BufferGeometry) child.geometry.dispose();
      if (child.material instanceof THREE.Material) child.material.dispose();
    }
  });
};
