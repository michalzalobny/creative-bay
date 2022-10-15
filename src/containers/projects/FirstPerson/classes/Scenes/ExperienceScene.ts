import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { addBox, GetObjectReturn } from '../utils/getObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export interface Physics {
  world: CANNON.World | null;
  bodies: GetObjectReturn[];
}

export class ExperienceScene extends InteractiveScene {
  _loadedAssets: LoadedAssets | null = null;
  _ambientLight1: THREE.AmbientLight;
  _pointLight1: THREE.PointLight;
  _boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  _whiteMaterial: THREE.MeshStandardMaterial;

  _physics: Physics = {
    world: null,
    bodies: [],
  };

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._ambientLight1 = new THREE.AmbientLight(0xffffff, 0.05);
    this.add(this._ambientLight1);

    this._pointLight1 = new THREE.PointLight(0xff0000);
    this._pointLight1.position.y = 15;
    this.add(this._pointLight1);

    this._whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    this._fpsCamera.setObjectsToLookAt([]);
    this._setupPhysics();
  }

  _setupPhysics() {
    this._physics.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });

    const box = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 10, y: 20, z: 10 },
      position: new CANNON.Vec3(60, 60, 0),
      mass: 1,
    });
    box.meshThree.castShadow = false;
    this._physics.bodies.push(box);

    const box2 = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 5, y: 5, z: 5 },
      position: new CANNON.Vec3(0, 30, -50),
      mass: 0.2,
    });
    box2.meshThree.castShadow = false;
    this._physics.bodies.push(box2);

    const ground = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 120, y: 0.5, z: 120 },
    });

    ground.meshThree.receiveShadow = true;
    this._physics.bodies.push(ground);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._updatePhysics();
  }

  _updatePhysics() {
    // this._physics.world?.step(1 / 60, updateInfo.delta, updateInfo.slowDownFactor); //Alternative (need to test)
    this._physics.world?.fixedStep();
    this._physics.bodies.forEach(object => {
      object.meshThree.position.set(
        object.bodyCannon.position.x,
        object.bodyCannon.position.y,
        object.bodyCannon.position.z
      );
      object.meshThree.quaternion.set(
        object.bodyCannon.quaternion.x,
        object.bodyCannon.quaternion.y,
        object.bodyCannon.quaternion.z,
        object.bodyCannon.quaternion.w
      );
    });
  }

  destroy() {
    super.destroy();

    this._physics.bodies.forEach(object => {
      this.remove(object.meshThree);
      this._physics.world?.removeBody(object.bodyCannon);
    });

    this.remove(this._ambientLight1);
    this.remove(this._pointLight1);
    this._whiteMaterial.dispose();
    this._boxGeometry.dispose();
  }
}
