import * as THREE from 'three';
import * as CANNON from 'cannon-es';

interface Size {
  x: number;
  y: number;
  z: number;
}

interface AddBox {
  material: THREE.Material;
  size: Size;
  world: CANNON.World;
  scene: THREE.Scene;
  geometry: THREE.BufferGeometry;
  mass?: number;
  position?: CANNON.Vec3;
}

export interface GetObjectReturn {
  meshThree: THREE.Mesh<THREE.BufferGeometry, THREE.Material>;
  bodyCannon: CANNON.Body;
}

export const addBox = (props: AddBox): GetObjectReturn => {
  const {
    position = new CANNON.Vec3(0, 0, 0),
    mass = 0,
    material,
    size,
    world,
    geometry,
    scene,
  } = props;

  //Three
  const meshThree = new THREE.Mesh(geometry, material);
  meshThree.scale.x = size.x;
  meshThree.scale.y = size.y;
  meshThree.scale.z = size.z;
  scene.add(meshThree);

  //Cannon
  const bodyCannon = new CANNON.Body({
    mass, // kg
    shape: new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)),
  });
  bodyCannon.position.copy(position);
  world.addBody(bodyCannon);

  return { meshThree, bodyCannon };
};
