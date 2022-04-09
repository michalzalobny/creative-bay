/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Text } from 'troika-three-text';

import { UpdateInfo, RaymarchSettings } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import { VisualiserScene } from '../Scenes/VisualiserScene';

export class ScreenFrame3D extends InteractiveObject3D {
  static width = 1;

  _mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshPhysicalMaterial> | null = null;
  _geometry: THREE.PlaneGeometry | null = null;
  _material: THREE.MeshPhysicalMaterial | null = null;
  _raymarchSettingsRef: RaymarchSettings | null = null;
  _label = new Text();
  _pivotGroup = new THREE.Group();
  _cameraModel3DRef: THREE.Group | null = null;

  constructor() {
    super();
    this.add(this._pivotGroup);
    this._drawScreenFrame();
    this._label.text = '(Image plane)';
    this._updateText();
  }

  _updateText() {
    this._label.anchorY = 'bottom';
    this._label.anchorX = 'center';
    this._label.fontSize = 0.25;
    this._label.font = '/fonts/openSans400.woff';
    this._label.color = 0x000000;
    this._label.outlineColor = 0xffffff;
    this._label.outlineWidth = '4%';
    this._pivotGroup.add(this._label);
  }

  _drawScreenFrame() {
    this._geometry = new THREE.PlaneBufferGeometry(ScreenFrame3D.width, ScreenFrame3D.width);

    this._material = new THREE.MeshPhysicalMaterial({
      side: THREE.DoubleSide,
      color: new THREE.Color().setRGB(
        VisualiserScene.highlightColor[0],
        VisualiserScene.highlightColor[1],
        VisualiserScene.highlightColor[2]
      ),
      metalness: 0,
      roughness: 0,
      transmission: 1,
      depthWrite: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      thickness: 0.1,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);

    this._pivotGroup.add(this._mesh);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh && this._raymarchSettingsRef) {
      const roLookAt = new THREE.Vector3()
        .copy(this._raymarchSettingsRef.lookAt)
        .sub(this._raymarchSettingsRef.ro)
        .normalize();

      const screenPos = new THREE.Vector3(
        this._raymarchSettingsRef.ro.x,
        this._raymarchSettingsRef.ro.y,
        this._raymarchSettingsRef.ro.z
      ).add(new THREE.Vector3().copy(roLookAt).multiplyScalar(this._raymarchSettingsRef.zoom));

      this._pivotGroup.position.set(screenPos.x, screenPos.y, -screenPos.z);

      this._pivotGroup.lookAt(
        this._raymarchSettingsRef.lookAt.x,
        this._raymarchSettingsRef.lookAt.y,
        -this._raymarchSettingsRef.lookAt.z
      );

      this._label.position.y = 0.6;
      this._label.rotation.x = Math.PI * 2;
      this._label.rotation.y = Math.PI;

      //camera model
      if (this._cameraModel3DRef) {
        const cameraPos = new THREE.Vector3(
          this._raymarchSettingsRef.ro.x,
          this._raymarchSettingsRef.ro.y,
          this._raymarchSettingsRef.ro.z
        ).add(new THREE.Vector3().copy(roLookAt).multiplyScalar(-0.8));

        this._cameraModel3DRef.position.set(cameraPos.x, cameraPos.y, -cameraPos.z);

        this._cameraModel3DRef.lookAt(
          this._raymarchSettingsRef.lookAt.x,
          this._raymarchSettingsRef.lookAt.y,
          -this._raymarchSettingsRef.lookAt.z
        );
      }
    }
  }

  setCameraModelRef(model: THREE.Group) {
    this._cameraModel3DRef = model;
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) this._pivotGroup.remove(this._mesh);
    this._pivotGroup.remove(this._label);
    this.remove(this._pivotGroup);
    this._label.dispose();
  }

  setRaymarchSettingsRef(objRef: RaymarchSettings) {
    this._raymarchSettingsRef = objRef;
  }
}
