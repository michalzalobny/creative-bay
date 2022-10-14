import * as THREE from 'three';

interface Props {
  camera: THREE.Camera;
  domElement: HTMLElement;
}

export type Keys = Record<KeyboardEvent['code'], boolean>;

export class FirstPersonControls extends THREE.EventDispatcher {
  camera: THREE.Camera;
  domElement: HTMLElement;
  isLocked = false;
  keys: Keys = {};

  constructor({ camera, domElement }: Props) {
    super();
    this.camera = camera;
    this.domElement = domElement;
    this.addEvents();
  }

  _onKeyDown = (event: KeyboardEvent) => {
    if (this.isLocked === false) return;
    this.keys[event.code] = true;
    this.dispatchEvent({ type: 'keychange', keys: this.keys });
  };
  _onKeyUp = (event: KeyboardEvent) => {
    if (this.isLocked === false) return;
    this.keys[event.code] = false;
    this.dispatchEvent({ type: 'keychange', keys: this.keys });
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.isLocked === false) return;
    const movementX = event.movementX || 0;
    const movementY = event.movementY || 0;
    this.dispatchEvent({ type: 'mousemove', dx: movementX, dy: movementY });
  };

  resetKeys() {
    Object.keys(this.keys).forEach(el => {
      this.keys[el] = false;
    });
    this.dispatchEvent({ type: 'keychange', keys: this.keys });
  }

  onPointerlockChange = () => {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.dispatchEvent({ type: 'lock' });
      this.isLocked = true;
      this.resetKeys();
    } else {
      this.dispatchEvent({ type: 'unlock' });
      this.isLocked = false;
      this.resetKeys();
    }
  };
  onPointerlockError = () => {
    console.error('FirstPersonControls: Unable to use Pointer Lock API');
  };

  addEvents() {
    this.domElement.ownerDocument.addEventListener('mousemove', this.onMouseMove);
    this.domElement.ownerDocument.addEventListener('pointerlockchange', this.onPointerlockChange);
    this.domElement.ownerDocument.addEventListener('pointerlockerror', this.onPointerlockError);

    this.domElement.ownerDocument.addEventListener('keydown', this._onKeyDown);
    this.domElement.ownerDocument.addEventListener('keyup', this._onKeyUp);
  }

  removeEvents() {
    this.domElement.ownerDocument.removeEventListener('mousemove', this.onMouseMove);
    this.domElement.ownerDocument.removeEventListener(
      'pointerlockchange',
      this.onPointerlockChange
    );
    this.domElement.ownerDocument.removeEventListener('pointerlockerror', this.onPointerlockError);

    this.domElement.ownerDocument.removeEventListener('keydown', this._onKeyDown);
    this.domElement.ownerDocument.removeEventListener('keyup', this._onKeyUp);
  }

  destroy() {
    this.removeEvents();
  }
}
