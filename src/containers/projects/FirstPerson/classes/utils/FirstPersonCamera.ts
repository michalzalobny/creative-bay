import * as THREE from 'three';
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
  static cameraEase = 0.9;

  _camera;
  _rotation = new THREE.Quaternion();
  _translation = new THREE.Vector3(0, 10, 0); //Starting position
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
  _stepHeight = 1.5;
  _headBobActive = false;
  _headBobTimer = 0;
  _firstPersonControls;
  _forwardVelocity = 0;
  _strafeVelocity = 0;
  _mouseSpeed = 0.75;
  _domElement: HTMLElement;

  constructor(props: Props) {
    this._camera = props.camera;
    this._domElement = document.body;
    this._firstPersonControls = new FirstPersonControls({
      camera: this._camera,
      domElement: this._domElement,
    });
    this._addEvents();
  }

  _updateCamera() {
    this._camera.quaternion.copy(this._rotation);
    this._camera.position.copy(this._translation);
    this._camera.position.y += Math.sin(this._headBobTimer) * this._stepHeight;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this._rotation);

    forward.multiplyScalar(100);
    forward.add(this._translation);
    const closest = forward;

    this._camera.lookAt(closest);
  }

  _handleMouseMove = (e: THREE.Event) => {
    const xh = e.dx * 0.0005 * this._mouseSpeed;
    const yh = e.dy * 0.0005 * this._mouseSpeed;

    this._phi.current = this._phi.current + -xh * this._phiSpeed;
    this._theta.current = clamp(
      this._theta.current + -yh * this._thetaSpeed,
      -Math.PI / 2.01, //2.01 to fix approximation issue
      Math.PI / 2.01
    );
  };

  _updateRotation() {
    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi.current);
    const qz = new THREE.Quaternion();
    qz.setFromAxisAngle(new THREE.Vector3(1, 0, 0), this._theta.current);

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
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi.current);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(this._forwardVelocity * updateInfo.slowDownFactor * this._moveSpeed);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(this._strafeVelocity * updateInfo.slowDownFactor * this._moveSpeed);

    this._translation.add(forward);
    this._translation.add(left);

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

  update(updateInfo: UpdateInfo) {
    this._updateRotation();
    this._updateTranslation(updateInfo);
    this._updateHeadBob(updateInfo);
    this._updateCamera();
    // this._lerpValues(updateInfo);
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
