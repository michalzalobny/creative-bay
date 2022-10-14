import { Bounds } from 'utils/sharedTypes';

interface Coords {
  x: number;
  y: number;
}

type Keys = Record<KeyboardEvent['code'], boolean>;

interface InputState {
  mouse: Coords;
  mouseLast: Coords;
  mouseDelta: Coords;
  lockedMouseDelta: Coords;
  mouseNormalized: Coords;
  isTouching: boolean;
  clickStart: Coords;
  keys: Keys;
}

export class InputControls {
  inputState: InputState = {
    mouse: { x: 0, y: 0 },
    mouseLast: { x: 0, y: 0 },
    mouseDelta: { x: 0, y: 0 },
    lockedMouseDelta: { x: 0, y: 0 },
    mouseNormalized: { x: 0, y: 0 },
    keys: {},
    clickStart: { x: 0, y: 0 },
    isTouching: false,
  };
  _rendererBounds: Bounds = { height: 100, width: 100 };
  _isPointerLocked = false;
  _domElement = document.body;
  _counter = 0;

  static _instance: InputControls | null;
  static _canCreate = false;
  static getInstance() {
    if (!InputControls._instance) {
      InputControls._canCreate = true;
      InputControls._instance = new InputControls();
      InputControls._canCreate = false;
    }

    return InputControls._instance;
  }

  constructor() {
    if (InputControls._instance || !InputControls._canCreate) {
      throw new Error('Use InputControls.getInstance()');
    }
    this._titleDomElement = Array.from(document.getElementsByClassName('title'))[0];
    this._addEvents();
    window.addEventListener('click', this._handleScreenClick);

    InputControls._instance = this;
  }

  _onTouchDown = (event: TouchEvent | MouseEvent) => {
    this.inputState.isTouching = true;
    this.inputState.mouseLast.x = 'touches' in event ? event.touches[0].clientX : event.clientX;
    this.inputState.mouseLast.y = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.inputState.mouse.x = this.inputState.mouseLast.x;
    this.inputState.mouse.y = this.inputState.mouseLast.y;

    this.inputState.clickStart.x = this.inputState.mouse.x;
    this.inputState.clickStart.y = this.inputState.mouse.y;
  };

  _onTouchMove = (event: TouchEvent | MouseEvent) => {
    // const touchX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    // const touchY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    // this.inputState.mouse.x = touchX;
    // this.inputState.mouse.y = touchY;

    // if (this._isPointerLocked) {
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // if (Math.abs(movementX) >= 20) {
    //   console.log('x', movementX);
    // }

    this._counter += movementX;
    this._titleDomElement.innerText = `DeltaXs sum: ${this._counter}, movementX: ${movementX}`;

    this.inputState.mouseDelta.x = 0;
    this.inputState.mouseDelta.y = 0;

    this.inputState.mouseDelta.x = movementX;
    this.inputState.mouseDelta.y = movementY;
    // }

    // this.inputState.mouseNormalized.x =
    //   (this.inputState.mouse.x / this._rendererBounds.width) * 2 - 1;
    // this.inputState.mouseNormalized.y =
    //   (this.inputState.mouse.y / this._rendererBounds.height) * 2 - 1;
  };

  _onTouchUp = () => {
    this.inputState.isTouching = false;
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _onMouseLeave = () => {};

  _onClick = () => {
    const clickBounds = 10;
    const xDiff = Math.abs(this.inputState.clickStart.x - this.inputState.mouse.x);
    const yDiff = Math.abs(this.inputState.clickStart.y - this.inputState.mouse.y);

    //Make sure that the user's click is held between certain boundaries
    if (xDiff <= clickBounds && yDiff <= clickBounds) {
      console.log('clicked');
    }
  };

  _onKeyDown = (event: KeyboardEvent) => {
    this.inputState.keys[event.code] = true;
  };
  _onKeyUp = (event: KeyboardEvent) => {
    this.inputState.keys[event.code] = false;
  };

  _onPointerLockChange = () => {
    if (this._domElement.ownerDocument.pointerLockElement === this._domElement) {
      this._isPointerLocked = true;
    } else {
      this._isPointerLocked = false;
    }
  };

  _onPointerLockError = () => {
    console.error('InputControls: Unable to use Pointer Lock API');
  };

  _addEvents() {
    window.addEventListener('mousedown', this._onTouchDown);
    this._domElement.ownerDocument.addEventListener('mousemove', this._onTouchMove);
    window.addEventListener('mouseup', this._onTouchUp);
    // window.addEventListener('click', this._onClick);

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);

    this._domElement.ownerDocument.addEventListener('pointerlockchange', this._onPointerLockChange);
    this._domElement.ownerDocument.addEventListener('pointerlockerror', this._onPointerLockError);

    // window.addEventListener('touchstart', this._onTouchDown);
    // window.addEventListener('touchmove', this._onTouchMove, { passive: true });
    // window.addEventListener('touchend', this._onTouchUp);

    window.addEventListener('mouseout', this._onMouseLeave);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
  }

  update() {
    if (!this._isPointerLocked) {
      this.inputState.mouseDelta.x = this.inputState.mouse.x - this.inputState.mouseLast.x;
      this.inputState.mouseDelta.y = this.inputState.mouse.y - this.inputState.mouseLast.y;
    } else {
    }

    this.inputState.mouseLast.x = this.inputState.mouse.x;
    this.inputState.mouseLast.y = this.inputState.mouse.y;
  }

  _handleScreenClick = () => {
    if (this._isPointerLocked) return;
    this._domElement.requestPointerLock();
  };

  destroy() {
    window.removeEventListener('click', this._handleScreenClick);
  }
}
