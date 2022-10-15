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
  _ambientLight1: THREE.AmbientLight | null = null;
  _pointLight1: THREE.PointLight | null = null;
  _boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  _whiteMaterial: THREE.MeshStandardMaterial;

  _physics: Physics = {
    world: null,
    bodies: [],
  };

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._whiteMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    this._addLights();
    this._setupPhysics();
    this._fpsCamera.setPlayerBody(this._physics.bodies[3].bodyCannon);
  }

  _addLights() {
    this._ambientLight1 = new THREE.AmbientLight(0xffffff, 0.05);
    this.add(this._ambientLight1);

    this._pointLight1 = new THREE.PointLight(0xff0000);
    this._pointLight1.position.y = 15;
    this.add(this._pointLight1);
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
      type: CANNON.Body.STATIC,
    });
    ground.meshThree.receiveShadow = true;
    this._physics.bodies.push(ground);

    const player = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 5, y: 5, z: 5 },
      position: new CANNON.Vec3(0, 10, 0),
      type: CANNON.Body.KINEMATIC,
      mass: 0.2,
    });
    player.meshThree.castShadow = false;
    this._physics.bodies.push(player);

    const wall = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 30, y: 60, z: 0.3 },
      position: new CANNON.Vec3(0, 30, -25),
      type: CANNON.Body.STATIC,
    });
    wall.meshThree.castShadow = false;
    this._physics.bodies.push(wall);
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

    this._ambientLight1 && this.remove(this._ambientLight1);
    this._pointLight1 && this.remove(this._pointLight1);
    this._whiteMaterial.dispose();
    this._boxGeometry.dispose();
  }
}
