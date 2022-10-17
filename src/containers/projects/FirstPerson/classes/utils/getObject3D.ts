import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';

interface Size {
  x: number;
  y: number;
  z: number;
}

interface AddBox {
  material: THREE.Material;
  size: Size;
  world: RAPIER.World;
  scene: THREE.Scene;
  geometry: THREE.BufferGeometry;
  rigidBodyDesc?: RAPIER.RigidBodyDesc;
}

export interface GetObjectReturn {
  meshThree: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;
  rigidBody: RAPIER.RigidBody;
  collider: RAPIER.Collider;
}

export const addBox = (props: AddBox): GetObjectReturn => {
  const {
    material,
    size,
    world,
    geometry,
    scene,
    rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic(),
  } = props;

  //Three
  const meshThree = new THREE.Mesh(geometry, material);
  meshThree.scale.x = size.x;
  meshThree.scale.y = size.y;
  meshThree.scale.z = size.z;
  scene.add(meshThree);

  //Rapier
  const rigidBody = world.createRigidBody(rigidBodyDesc);
  const colliderDesc = RAPIER.ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
  const collider = world.createCollider(colliderDesc, rigidBody);

  return { meshThree, rigidBody, collider };
};
