import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';

import { InputControls } from './InputControls';

interface Props {
  camera: THREE.Camera;
  inputControls: InputControls;
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
  _camera;
  _inputControls;
  _rotation = new THREE.Quaternion();
  _translation = new THREE.Vector3();
  _phi = 0;
  _theta = 0;
  _phiSpeed = 5 * 0.5;
  _thetaSpeed = 5 * 0.5;
  _moveSpeed = 1.7 * 0.7;
  _stepSpeed = 1.9 * 0.6;
  _stepHeight = 1.5;
  _objectsToLookAt: THREE.Object3D[] = [];
  _rendererBounds: Bounds = { height: 100, width: 100 };
  _headBobActive = false;
  _headBobTimer = 0;

  constructor(props: Props) {
    this._camera = props.camera;
    this._inputControls = props.inputControls;
  }

  _updateCamera(updateInfo: UpdateInfo) {
    // console.log(this._rotation);
    this._camera.quaternion.copy(this._rotation);
    this._camera.position.copy(this._translation);
    this._camera.position.y += Math.sin(this._headBobTimer) * this._stepHeight;

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(this._rotation);
    const dir = forward.clone();

    forward.multiplyScalar(100);
    forward.add(this._translation);
    let closest = forward;

    const raycaster = new THREE.Raycaster(this._translation, dir);

    if (this._objectsToLookAt.length === 0) return;
    for (let i = 0; i < this._objectsToLookAt.length; ++i) {
      const intersected = raycaster.intersectObject(this._objectsToLookAt[i])[0];
      if (intersected) {
        if (intersected.distance < closest.distanceTo(raycaster.ray.origin)) {
          closest = intersected.point.clone();
        }
      }
    }

    this._camera.lookAt(closest);
  }

  _updateRotation(updateInfo: UpdateInfo) {
    const xh = this._inputControls.inputState.mouseDelta.x / this._rendererBounds.width;
    const yh = this._inputControls.inputState.mouseDelta.y / this._rendererBounds.height;

    // xh = this._inputControls.inputState.mouseNormalized.x * 0.01;
    // yh = this._inputControls.inputState.mouseNormalized.y * 0.01;

    this._phi += -xh * this._phiSpeed;
    this._theta = clamp(this._theta + -yh * this._thetaSpeed, -Math.PI / 3, Math.PI / 3);

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

  _updateTranslation(updateInfo: UpdateInfo) {
    const keys = this._inputControls.inputState.keys;
    const forwardVelocity =
      (keys[KEYS.w] || keys[KEYS.arrowUp] ? 1 : 0) +
      (keys[KEYS.s] || keys[KEYS.arrowDown] ? -1 : 0);

    const strafeVelocity =
      (keys[KEYS.a] || keys[KEYS.arrowLeft] ? 1 : 0) +
      (keys[KEYS.d] || keys[KEYS.arrowRight] ? -1 : 0);

    const qx = new THREE.Quaternion();
    qx.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._phi);

    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(qx);
    forward.multiplyScalar(forwardVelocity * updateInfo.slowDownFactor * this._moveSpeed);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * updateInfo.slowDownFactor * this._moveSpeed);

    this._translation.add(forward);
    this._translation.add(left);

    if (forwardVelocity != 0 || strafeVelocity != 0) {
      this._headBobActive = true;
    }
  }

  update(updateInfo: UpdateInfo) {
    this._updateRotation(updateInfo);
    this._updateTranslation(updateInfo);
    this._updateCamera(updateInfo);
    this._updateHeadBob(updateInfo);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
    this._inputControls.setRendererBounds(bounds);
  }

  setObjectsToLookAt(objectsToLookAt: THREE.Object3D[]) {
    this._objectsToLookAt = objectsToLookAt;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {}
}
