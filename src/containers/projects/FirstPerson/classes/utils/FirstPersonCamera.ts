import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d';
import { clamp } from 'three/src/math/MathUtils';

import { UpdateInfo } from 'utils/sharedTypes';
import { clampRange } from 'utils/functions/clamp';

import { Gun3D } from '../Components/Gun3D';
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
  static cameraEase = 0.25;

  _camera;
  _rotation = new THREE.Quaternion();
  _translation = new THREE.Vector3(0, 0, 0); //Starting position
  _phi = 0;
  _theta = 0;
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
  _gun3D: Gun3D | null = null;
  _playerCollider: RAPIER.Collider | null = null;
  _world: RAPIER.World | null = null;
  _characterController: RAPIER.KinematicCharacterController | null = null;
  _mouse = {
    x: 0,
    y: 0,
  };

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
    this._gun3D?.quaternion.copy(this._rotation);
    //Stick camera to the position of player
    if (this._playerBody) {
      const pos = this._playerBody.translation();
      this._camera.position.set(pos.x, pos.y + 6, pos.z); //6 is halth of the height of character
      this._gun3D?.position.set(pos.x, pos.y + 6, pos.z);
    }
    // this._camera.position.y += Math.sin(this._headBobTimer) * this._stepHeight;
    if (this._gun3D)
      this._gun3D.position.y += Math.sin(this._headBobTimer) * this._stepHeight * 0.02;
  }

  _handleMouseMove = (e: THREE.Event) => {
    const xh = e.dx * 0.0005 * this._mouseSpeed;
    const yh = e.dy * 0.0005 * this._mouseSpeed;

    //Used for sway
    this._mouse.x = e.dx * 1;
    this._mouse.y = e.dy * 1;

    this._phi = this._phi + -xh * this._phiSpeed;
    this._theta = clamp(
      this._theta + -yh * this._thetaSpeed,
      -Math.PI * 0.51, //0.51 to fix approximation issue
      Math.PI * 0.51
    );
  };

  _updateRotation() {
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta);

    const q = new THREE.Quaternion();
    q.multiply(qx);
    q.multiply(qz);

    this._rotation.copy(q);
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
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);

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

  setPlayerBody(body: RAPIER.RigidBody) {
    this._playerBody = body;
  }

  setGun3D(obj: Gun3D) {
    this._gun3D = obj;
  }

  setPlayerCollider(collider: RAPIER.Collider) {
    this._playerCollider = collider;
  }

  update(updateInfo: UpdateInfo) {
    this._updateGunSway(updateInfo);
    this._updateRotation();
    this._updateTranslation(updateInfo);
    this._updateHeadBob(updateInfo);
    this._updateCamera();
    this._updateCharacter();
  }

  //https://www.youtube.com/watch?v=45ssV6CEgoU
  _updateGunSway(updateInfo: UpdateInfo) {
    if (!this._gun3D) return;

    //Move sway
    const inputX = -this._mouse.x;
    const inputY = this._mouse.y;

    const movementX = clampRange(
      inputX * Gun3D.swayAmount,
      -Gun3D.maxSwayAmount,
      Gun3D.maxSwayAmount
    );
    const movementY = clampRange(
      inputY * Gun3D.swayAmount,
      -Gun3D.maxSwayAmount,
      Gun3D.maxSwayAmount
    );

    const finalPosition = new THREE.Vector3(movementX, movementY, 0);
    const localPosition = this._gun3D.getGunGroupPosition();
    const gunPosition = localPosition.lerp(
      finalPosition.add(Gun3D.startPosition),
      Gun3D.smoothAmount * updateInfo.slowDownFactor
    );
    this._gun3D.setGunGroupPosition(gunPosition);

    //Rotation
    const tiltY = clampRange(
      inputX * Gun3D.swayRotationAmount,
      -Gun3D.maxSwayRotationAmount,
      Gun3D.maxSwayRotationAmount
    );
    const tiltX = clampRange(
      inputY * Gun3D.swayRotationAmount,
      -Gun3D.maxSwayRotationAmount,
      Gun3D.maxSwayRotationAmount
    );

    const finalRotation = new THREE.Quaternion();
    finalRotation.setFromEuler(
      new THREE.Euler(
        this._gun3D.swayRotation.rotationX ? -tiltX : 0,
        this._gun3D.swayRotation.rotationY ? tiltY : 0,
        this._gun3D.swayRotation.rotationZ ? tiltY : 0
      )
    );
    const localRotation = this._gun3D.getGunGroupRotation();
    const gunRotation = localRotation.slerp(
      finalRotation.multiply(Gun3D.startRotation),
      Gun3D.smoothRotationAmount * updateInfo.slowDownFactor
    );
    this._gun3D.setGunGroupRotation(gunRotation);

    this._mouse.x = 0;
    this._mouse.y = 0;
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
