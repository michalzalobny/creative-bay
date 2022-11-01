import * as THREE from 'three';
import GUI from 'lil-gui';
import RAPIER from '@dimforge/rapier3d';
import { GLTF } from 'three-stdlib';

import { UpdateInfo, LoadedAssets, Bounds } from 'utils/sharedTypes';

import { appState } from '../../Project.state';
import { InteractiveScene } from './InteractiveScene';
import { addBox, addCylinder, GetObjectReturn } from '../utils/getObject3D';
import { Gun3D } from '../Components/Gun3D';

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
  _directionalLight1: THREE.DirectionalLight | null = null;
  _directionalLight1Helper: THREE.CameraHelper | null = null;
  _boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  _cylinderGeometry = new THREE.CylinderBufferGeometry(1, 1, 1, 20, 1);
  _whiteMaterial: THREE.MeshStandardMaterial;
  _playerMaterial: THREE.MeshStandardMaterial;

  _gun3D: Gun3D;
  _debugObjects = {
    envMapIntensity: 2.5,
  };

  _physics: Physics = {
    world: null,
    bodies: [],
  };

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._whiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
    });

    this._playerMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0,
    });

    this._gun3D = new Gun3D({ gui: this._gui });
    this.add(this._gun3D);

    this._setLights();
    this._setGui();
  }

  _setLights() {
    this._directionalLight1 = new THREE.DirectionalLight('#ffffff', 3);
    this._directionalLight1.position.set(-8, 6.8, 10);
    this._directionalLight1.castShadow = true;
    this._directionalLight1.shadow.camera.far = 32;
    this._directionalLight1.shadow.mapSize.set(1024, 1024);
    this._directionalLight1.shadow.normalBias = 0.05;
    this.add(this._directionalLight1);

    this._directionalLight1Helper = new THREE.CameraHelper(this._directionalLight1.shadow.camera);
    this.add(this._directionalLight1Helper);
  }

  _setGui() {
    const debugObjects = this._gui.addFolder('Debug Objects');
    debugObjects.close();
    debugObjects
      .add(this._debugObjects, 'envMapIntensity', 0.01, 10, 0.01)
      .name('envMapIntensity')
      .onFinishChange(() => {
        this.updateAllMaterials();
      });

    if (this._directionalLight1) {
      const light1 = this._gui.addFolder('Directional Light');
      light1.close();
      light1.add(this._directionalLight1, 'intensity', 0, 10, 0.001).name('lightIntensity');
      light1.add(this._directionalLight1.position, 'x', -100, 100, 0.1).name('lightX');
      light1.add(this._directionalLight1.position, 'y', -100, 100, 0.1).name('lightY');
      light1.add(this._directionalLight1.position, 'z', -100, 100, 0.1).name('lightZ');
    }
  }

  _setupPhysics() {
    if (!appState.RAPIER) return;
    const gravity = { x: 0.0, y: -9.81, z: 0.0 };
    this._physics.world = new appState.RAPIER.World(gravity);

    const ground = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 38, y: 0.25, z: 38 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    ground.rigidBody.setTranslation(new RAPIER.Vector3(0, -0.125, 0), true);
    this._physics.bodies.push(ground);

    const box = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 1.25, y: 2.5, z: 1.25 },
    });
    box.rigidBody.setTranslation(new RAPIER.Vector3(4, 2.5 / 2, -8.5), true);
    this._physics.bodies.push(box);

    const player = addCylinder({
      world: this._physics.world,
      scene: this,
      geometry: this._cylinderGeometry,
      material: this._playerMaterial,
      rigidBodyDesc: RAPIER.RigidBodyDesc.kinematicPositionBased(),
      size: { x: 2, y: 1.85 },
    });
    player.rigidBody.setTranslation(new RAPIER.Vector3(0, 1.85, 3), true);
    this._physics.bodies.push(player);

    const wall = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 9, y: 3, z: 0.2 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    wall.rigidBody.setTranslation(new RAPIER.Vector3(-10, 1.5, 0), true);
    this._physics.bodies.push(wall);

    const ramp = addBox({
      world: this._physics.world,
      scene: this,
      geometry: this._boxGeometry,
      material: this._whiteMaterial,
      size: { x: 3.1, y: 6.25, z: 0.4 },
      rigidBodyDesc: RAPIER.RigidBodyDesc.fixed(),
    });
    ramp.rigidBody.setTranslation(new RAPIER.Vector3(3.5, 1.5, 0), true);
    ramp.rigidBody.setRotation({ w: 1.0, x: 0.5, y: 0.0, z: 0.0 }, true);
    this._physics.bodies.push(ramp);

    this._fpsCamera.setPlayerBody(this._physics.bodies[2].rigidBody);
    this._fpsCamera.setPlayerCollider(this._physics.bodies[2].collider);
    this._fpsCamera.setWorld(this._physics.world);
    this._fpsCamera.setGun3D(this._gun3D);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;

    this._gun3D.setAsset((this._loadedAssets['gun'].asset as GLTF).scene);
  }

  updateAllMaterials() {
    if (!this._loadedAssets) return;
    const envMap = this._loadedAssets['env_map_0'].asset as THREE.CubeTexture;
    this.traverse(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        child.material.envMap = envMap;
        child.material.envMapIntensity = this._debugObjects.envMapIntensity;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._updatePhysics(updateInfo);
    this._gun3D.update(updateInfo);
  }

  _updatePhysics(updateInfo: UpdateInfo) {
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
    this.updateAllMaterials();
  }

  destroy() {
    super.destroy();

    this._physics.bodies.forEach(el => {
      this.remove(el.meshThree);
      this._physics.world?.removeCollider(el.collider, true);
      this._physics.world?.removeRigidBody(el.rigidBody);
    });

    this._gun3D.destroy();
    this.remove(this._gun3D);

    if (this._directionalLight1) this.remove(this._directionalLight1);
    if (this._directionalLight1Helper) this.remove(this._directionalLight1Helper);

    this._whiteMaterial.dispose();
    this._playerMaterial.dispose();
    this._boxGeometry.dispose();
    this._cylinderGeometry.dispose();
  }
}
