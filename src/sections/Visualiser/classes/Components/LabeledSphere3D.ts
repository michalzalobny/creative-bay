/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as THREE from 'three';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Text } from 'troika-three-text';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from '../Components/InteractiveObject3D';

interface Constructor {
  size: number;
  color: THREE.ColorRepresentation;
  labelText: string;
}

export class LabeledSphere3D extends InteractiveObject3D {
  _geometry: THREE.SphereBufferGeometry | null = null;
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.MeshBasicMaterial> | null = null;
  _material: THREE.MeshBasicMaterial | null = null;
  _label = new Text();

  constructor({ labelText, color, size }: Constructor) {
    super();
    this._drawSphere(size, color);
    this._label.text = labelText;
    this._updateText();
  }

  _drawSphere(size: number, color: THREE.ColorRepresentation) {
    this._geometry = new THREE.SphereBufferGeometry(size, 16, 16);
    this._material = new THREE.MeshBasicMaterial({ color });
    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  _updateText() {
    this._label.anchorY = 'bottom';
    this._label.anchorX = 'center';
    this._label.fontSize = 0.25;
    this._label.font = '/fonts/openSans400.woff';
    this._label.color = 0x000000;
    this._label.outlineColor = 0xffffff;
    this._label.outlineWidth = '4%';
    this.add(this._label);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    super.destroy();
    this._material?.dispose();
    if (this._mesh) this.remove(this._mesh);
    this._geometry?.dispose();

    this.remove(this._label);
    this._label.dispose();
  }

  setElPosition(newPos: THREE.Vector3) {
    this._mesh?.position.set(newPos.x, newPos.y, newPos.z);
    this._label.position.x = newPos.x;
    this._label.position.y = newPos.y + 0.3;
    this._label.position.z = newPos.z;
  }
}
