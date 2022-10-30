import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';
import { clamp } from 'three/src/math/MathUtils';

import { UpdateInfo } from 'utils/sharedTypes';
import { lerp } from 'utils/functions/lerp';

import { FirstPersonControls, Keys } from './FirstPersonControls';

interface Props {
  camera: THREE.Camera;
}

const KEYS = {
  w: 'KeyW',
  s: 'KeyS',
  a: 'KeyA',
  d: 'KeyD',
  arrowUp: 'ArrowUp',
  arrowDown: 'ArrowDown',
  arrowLeft: 'ArrowLeft',
  arrowRight: 'ArrowRight',
};

export class FirstPersonCamera {
  static cameraEase = 0.6;

  _camera;
  _rotation = new THREE.Quaternion();
  _rotationLerped = new THREE.Quaternion();
  _translation = new THREE.Vector3(0, 0, 0); //Starting position
  _phi = {
    current: 0,
    target: 0,
  };
  _theta = {
    current: 0,
    target: 0,
  };
  _phiSpeed = 5 * 0.5;
  _thetaSpeed = 5 * 0.5;
  _moveSpeed = 1.7 * 0.7;
  _stepSpeed = 1.9;
  _stepHeight = 1.1;
  _headBobActive = false;
  _headBobTimer = 0;
  _firstPersonControls;
  _forwardVelocity = 0;
  _strafeVelocity = 0;
  _mouseSpeed = 0.76;
  _domElement: HTMLElement;
  _playerBody: RAPIER.RigidBody | null = null;
  _gun: THREE.Object3D | null = null;
  _playerCollider: RAPIER.Collider | null = null;
  _world: RAPIER.World | null = null;
  _characterController: RAPIER.KinematicCharacterController | null = null;

  constructor(props: Props) {
    this._camera = props.camera;
    this._domElement = document.body;
    this._firstPersonControls = new FirstPersonControls({
      camera: this._camera,
      domElement: this._domElement,
    });
    this._addEvents();
  }

  setWorld(world: RAPIER.World) {
    this._world = world;
    this._useCharacterControls();
  }

  _useCharacterControls() {
    if (!this._world) return;
    this._characterController = this._world.createCharacterController(0.1);
    this._characterController.enableAutostep(0.7, 0.3, true);
    this._characterController.enableSnapToGround(0.7);
    this._characterController.setMaxSlopeClimbAngle(Math.PI * 0.5);
  }

  //Updates camera and gun position
  _updateCamera() {
    this._camera.quaternion.copy(this._rotation);
    this._gun?.quaternion.copy(this._rotationLerped);
    //Stick camera to the position of player
    if (this._playerBody) {
      const pos = this._playerBody.translation();
      this._camera.position.set(pos.x, pos.y + 6, pos.z); //6 is halth of the height of character
      this._gun?.position.set(pos.x, pos.y + 6, pos.z);
    }
    // this._camera.position.y += Math.sin(this._headBobTimer) * this._stepHeight;
    if (this._gun) this._gun.position.y += Math.sin(this._headBobTimer) * this._stepHeight * 0.02;
  }

  _handleMouseMove = (e: THREE.Event) => {
    const xh = e.dx * 0.0005 * this._mouseSpeed;
    const yh = e.dy * 0.0005 * this._mouseSpeed;

    this._phi.target = this._phi.target + -xh * this._phiSpeed;
    this._theta.target = clamp(
      this._theta.target + -yh * this._thetaSpeed,
      -Math.PI / 2.01, //2.01 to fix approximation issue
      Math.PI / 2.01
    );
  };

  _updateRotation() {
    //Lerped
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi.current);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta.current);

    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this._rotationLerped.copy(q);

    //Target - no interpolation
    const qxT = new THREE.Quaternion();
    qxT.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi.target);
    const qzT = new THREE.Quaternion();
    qzT.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta.target);

    const qT = new THREE.Quaternion();
    qT.multiply(qxT);
    qT.multiply(qzT);

    this._rotation.copy(qT);
  }

  _updateHeadBob(updateInfo: UpdateInfo) {
    if (this._headBobActive) {
      const wavelength = Math.PI;
      const nextStep = 1 + Math.floor((this._headBobTimer + 0.000001) / wavelength);
      const nextStepTime = nextStep * wavelength;
      this._headBobTimer = Math.min(
        this._headBobTimer + 0.15 * updateInfo.slowDownFactor * this._stepSpeed,
        nextStepTime
      );

      if (this._headBobTimer == nextStepTime) {
        this._headBobActive = false;
      }
    }
  }

  _handleKeyChange = (e: THREE.Event) => {
    const keys = e.keys as Keys;
    this._forwardVelocity =
      (keys[KEYS.w] || keys[KEYS.arrowUp] ? 1 : 0) +
      (keys[KEYS.s] || keys[KEYS.arrowDown] ? -1 : 0);

    this._strafeVelocity =
      (keys[KEYS.a] || keys[KEYS.arrowLeft] ? 1 : 0) +
      (keys[KEYS.d] || keys[KEYS.arrowRight] ? -1 : 0);
  };

  _updateTranslation(updateInfo: UpdateInfo) {
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi.current);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);

    forward.multiplyScalar(this._forwardVelocity * updateInfo.slowDownFactor);
    left.multiplyScalar(this._strafeVelocity * updateInfo.slowDownFactor);

    this._translation = forward.add(left);

    if (this._forwardVelocity != 0 || this._strafeVelocity != 0) {
      this._headBobActive = true;
    }
  }

  _lerpValues(updateInfo: UpdateInfo) {
    this._phi.current = lerp(
      this._phi.current,
      this._phi.target,
      FirstPersonCamera.cameraEase * updateInfo.slowDownFactor
    );

    this._theta.current = lerp(
      this._theta.current,
      this._theta.target,
      FirstPersonCamera.cameraEase * updateInfo.slowDownFactor
    );
  }

  setPlayerBody(body: RAPIER.RigidBody) {
    this._playerBody = body;
  }

  setGun(obj: THREE.Object3D) {
    this._gun = obj;
  }

  setPlayerCollider(collider: RAPIER.Collider) {
    this._playerCollider = collider;
  }

  update(updateInfo: UpdateInfo) {
    this._lerpValues(updateInfo);
    this._updateRotation();
    this._updateTranslation(updateInfo);
    this._updateHeadBob(updateInfo);
    this._updateCamera();
    this._updateCharacter();
  }

  _updateCharacter() {
    if (!this._characterController || !this._playerCollider || !this._playerBody) return;
    const speed = 0.1; //Docs value for Y

    const movementDirection = {
      x: this._translation.x, //Left
      y: -speed, //Up
      z: this._translation.z, //Forward
    };

    this._characterController.computeColliderMovement(this._playerCollider, movementDirection);

    const movement = this._characterController.computedMovement();
    const newPos = this._playerBody.translation();
    newPos.x += movement.x;
    newPos.y += movement.y;
    newPos.z += movement.z;

    this._playerBody.setNextKinematicTranslation(newPos);
  }

  _handleClick = () => {
    this._requestLock();
  };

  _requestLock() {
    if (this._domElement.ownerDocument.pointerLockElement === this._domElement) return;
    this._domElement.requestPointerLock();
  }

  _addEvents() {
    this._firstPersonControls.addEventListener('mousemove', this._handleMouseMove);
    this._firstPersonControls.addEventListener('keychange', this._handleKeyChange);
    this._domElement.addEventListener('click', this._handleClick);
  }

  _removeEvents() {
    this._firstPersonControls.removeEventListener('mousemove', this._handleMouseMove);
    this._firstPersonControls.removeEventListener('keychange', this._handleKeyChange);
    this._domElement.removeEventListener('click', this._handleClick);
  }

  destroy() {
    this._removeEvents();
    this._firstPersonControls.destroy();
  }
}
