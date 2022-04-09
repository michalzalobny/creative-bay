import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { LabeledSphere3D } from './LabeledSphere3D';
import { InteractiveObject3D } from './InteractiveObject3D';

export class Light3D extends InteractiveObject3D {
  _light: THREE.PointLight | null = null;
  _label = new LabeledSphere3D({
    size: 0.2,
    color: new THREE.Color('#ffffff'),
    labelText: '(Light)',
  });

  constructor() {
    super();
    this._addLight();
  }

  _addLight() {
    this._light = new THREE.PointLight(0xffffff, 1, 1000);
    this._light.castShadow = true;
    this._light.shadow.mapSize.width = 2048;
    this._light.shadow.mapSize.height = 2048;
    this.add(this._light);
    this.add(this._label);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._label.update(updateInfo);
    this._label.setElPosition(this.position);
  }

  destroy() {
    super.destroy();
    if (this._light) this.remove(this._light);
    this._label.destroy();
    this.remove(this._label);
  }

  setLightColor(newCol: [number, number, number]) {
    this._light?.color.setRGB(newCol[0], newCol[1], newCol[2]);
  }
}
