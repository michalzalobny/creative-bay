import * as THREE from 'three';
import { clamp } from 'three/src/math/MathUtils';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';

import { InputControls } from './InputControls';

interface Props {
  camera: THREE.Camera;
  inputControls: InputControls;
  objectsToLookAt?: THREE.Object3D[];
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
  _phiSpeed = 5 * 0.3;
  _thetaSpeed = 5 * 0.3;
  _objectsToLookAt;
  _rendererBounds: Bounds = { height: 100, width: 100 };

  constructor(props: Props) {
    this._camera = props.camera;
    this._inputControls = props.inputControls;
    this._objectsToLookAt = props.objectsToLookAt;
  }

  _updateCamera() {
    // console.log(this._rotation);
    this._camera.quaternion.copy(this._rotation);
    this._camera.position.copy(this._translation);
    // this._camera.position.copy(this._translation);
    // this._camera.position.y += Math.sin(this.headBobTimer_ * 10) * 1.5;
    // const forward = new THREE.Vector3(0, 0, -1);
    // forward.applyQuaternion(this._rotation);
    // const dir = forward.clone();
    // forward.multiplyScalar(100);
    // forward.add(this._translation);
    // let closest = forward;
    // const result = new THREE.Vector3();
    // const ray = new THREE.Ray(this._translation, dir);
    // for (let i = 0; i < this._objectsToLookAt.length; ++i) {
    //   if (ray.intersectBox(this._objectsToLookAt[i], result)) {
    //     if (result.distanceTo(ray.origin) < closest.distanceTo(ray.origin)) {
    //       closest = result.clone();
    //     }
    //   }
    // }
    // this._camera.lookAt(closest);
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
    forward.multiplyScalar(forwardVelocity * updateInfo.slowDownFactor * 3);

    const left = new THREE.Vector3(-1, 0, 0);
    left.applyQuaternion(qx);
    left.multiplyScalar(strafeVelocity * updateInfo.slowDownFactor * 3);

    this._translation.add(forward);
    this._translation.add(left);

    // if (forwardVelocity != 0 || strafeVelocity != 0) {
    //   this.headBobActive_ = true;
    // }
  }

  update(updateInfo: UpdateInfo) {
    this._updateRotation(updateInfo);
    this._updateTranslation(updateInfo);
    this._updateCamera();
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
    this._inputControls.setRendererBounds(bounds);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {}
}
