import * as THREE from 'three';
import GUI from 'lil-gui';
import RAPIER from '@dimforge/rapier3d';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { appState } from '../../Project.state';
import { InteractiveScene } from './InteractiveScene';
import { addBox, addCylinder, GetObjectReturn } from '../utils/getObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export interface Physics {
  world: RAPIER.World | null;
  bodies: GetObjectReturn[];
}

export class ExperienceScene extends InteractiveScene {
  _loadedAssets: LoadedAssets | null = null;
  _ambientLight1: THREE.AmbientLight;
  _pointLight1: THREE.PointLight;
  _boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  _cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 20, 1);
  _whiteMaterial: THREE.MeshStandardMaterial;
  _playerMaterial: THREE.MeshStandardMaterial;

  _physics: Physics = {
    world: null,
    bodies: [],
  };

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._ambientLight1 = new THREE.AmbientLight('#652fc2', 0.1);
    this.add(this._ambientLight1);

    this._pointLight1 = new THREE.PointLight('#652fc2');
    this._pointLight1.position.y = 35;
    this.add(this._pointLight1);

    this._whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    this._playerMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
    });
  }

  _setupPhysics() {
    if (!appState.RAPIER) return;
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this._physics.world = new appState.RAPIER.World(gravity);

    const box = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 10, y: 20, z: 10 },
    });
    box.rigidBody.setTranslation(new RAPIER.Vector3(0, 60, -60), true);
    this._physics.bodies.push(box);

    const ground = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 150 * 2, y: 0.1 * 2, z: 150 * 2 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    ground.meshThree.castShadow = false;
    ground.meshThree.receiveShadow = true;
    this._physics.bodies.push(ground);

    const player = addCylinder({
      world: this._physics.world,
      scene: this,
      geometry: this._cylinderGeometry,
      material: this._playerMaterial,
      rigidBodyDesc: RAPIER.RigidBodyDesc.kinematicPositionBased(),
      size: { x: 2, y: 16 },
    });
    player.rigidBody.setTranslation(new RAPIER.Vector3(0, 10, 30), true);
    this._physics.bodies.push(player);

    const wall = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 20, y: 50, z: 3.5 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    wall.rigidBody.setTranslation(new RAPIER.Vector3(-30, 25, 0), true);
    this._physics.bodies.push(wall);

    this._fpsCamera.setPlayerBody(this._physics.bodies[2].rigidBody);
    this._fpsCamera.setPlayerCollider(this._physics.bodies[2].collider);
    this._fpsCamera.setWorld(this._physics.world);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    //Update physics
    if (this._physics.world) {
      this._physics.world.step();
      this._physics.world.timestep = (1 / 60) * updateInfo.slowDownFactor;
    }

    this._physics.bodies.forEach(body => {
      const pos = body.rigidBody.translation();
      const rot = body.rigidBody.rotation();

      body.meshThree.position.x = pos.x;
      body.meshThree.position.y = pos.y;
      body.meshThree.position.z = pos.z;
      body.meshThree.setRotationFromQuaternion(new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w));
    });
  }

  onAppReady() {
    this._setupPhysics();
  }

  destroy() {
    super.destroy();

    this._physics.bodies.forEach(el => {
      this.remove(el.meshThree);
      this._physics.world?.removeCollider(el.collider, true);
      this._physics.world?.removeRigidBody(el.rigidBody);
    });

    this.remove(this._ambientLight1);
    this.remove(this._pointLight1);
    this._whiteMaterial.dispose();
    this._playerMaterial.dispose();
    this._boxGeometry.dispose();
    this._cylinderGeometry.dispose();
  }
}
