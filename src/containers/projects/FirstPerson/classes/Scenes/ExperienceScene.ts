import * as THREE from 'three';
import GUI from 'lil-gui';
import RAPIER from '@dimforge/rapier3d-compat';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { appState } from '../../Project.state';
import { InteractiveScene } from './InteractiveScene';
import { addBox, GetObjectReturn } from '../utils/getObject3D';

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
    box.rigidBody.setTranslation(new RAPIER.Vector3(60, 85, 0), true);
    this._physics.bodies.push(box);

    const ground = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 120, y: 1.5, z: 120 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    ground.meshThree.castShadow = false;
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

    //Update physics
    this._physics.world?.step();
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
    this._boxGeometry.dispose();
  }
}
