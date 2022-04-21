import * as THREE from 'three';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Bounds, UpdateInfo, Mouse } from 'utils/sharedTypes';
import { lerp } from 'utils/functions/lerp';
import { sharedValues } from 'utils/sharedValues';

import { InteractiveObject3D } from '../Components/InteractiveObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  gui: GUI;
}

export class InteractiveScene extends THREE.Scene {
  static lerpEase = sharedValues.motion.LERP_EASE * 1.2;
  _raycaster = new THREE.Raycaster();
  _rendererBounds: Bounds = { height: 100, width: 100 };
  _camera: THREE.PerspectiveCamera;
  _mouseMove: MouseMove;
  _gui: GUI;
  _pixelRatio = 1;

  _mouse2D: Mouse = {
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  };
  _mouseStrength = {
    current: 0,
    target: 0,
  };

  _hoveredObject: InteractiveObject3D | null = null;
  _canHoverObject = true;

  constructor({ mouseMove, camera, gui }: Constructor) {
    super();
    this._camera = camera;
    this._mouseMove = mouseMove;
    this._gui = gui;
    this._addListeners();
  }

  _onMouseMove = (e: THREE.Event) => {
    this._mouseStrength.target = (e.target as MouseMove).strength;

    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    this._mouse2D.target.x = mouseX;
    this._mouse2D.target.y = mouseY;
  };

  _addListeners() {
    this._mouseMove.addEventListener('mousemove', this._onMouseMove);
  }

  _removeListeners() {
    this._mouseMove.removeEventListener('mousemove', this._onMouseMove);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
  }

  update(updateInfo: UpdateInfo) {
    //Lerp mouse move strength
    this._mouseStrength.current = lerp(
      this._mouseStrength.current,
      this._mouseStrength.target,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );

    //Lerp 2D mouse coords
    this._mouse2D.current.x = lerp(
      this._mouse2D.current.x,
      this._mouse2D.target.x,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );
    this._mouse2D.current.y = lerp(
      this._mouse2D.current.y,
      this._mouse2D.target.y,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );
  }

  setPixelRatio(ratio: number) {
    this._pixelRatio = ratio;
  }

  destroy() {
    this._removeListeners();
  }
}
