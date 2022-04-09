import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import { VisualiserScene } from '../Scenes/VisualiserScene';

export class Line3D extends InteractiveObject3D {
  _line: THREE.Line | null = null;
  _geometry: THREE.BufferGeometry | null = null;
  _material: THREE.LineBasicMaterial | null = null;

  constructor() {
    super();
    this._drawLine();
  }

  _drawLine() {
    this._geometry = new THREE.BufferGeometry().setFromPoints([]);
    this._material = new THREE.LineBasicMaterial({
      color: new THREE.Color().setRGB(
        VisualiserScene.highlightColor[0],
        VisualiserScene.highlightColor[1],
        VisualiserScene.highlightColor[2]
      ),
    });
    this._line = new THREE.Line(this._geometry, this._material);
    this.add(this._line);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  updateLinePos(start: THREE.Vector3, stop: THREE.Vector3) {
    if (!this._line) return;
    this._line.geometry.setFromPoints([start, stop]);
    this._line.geometry.attributes.position.needsUpdate = true;
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._line) {
      this.remove(this._line);
    }
  }
}
