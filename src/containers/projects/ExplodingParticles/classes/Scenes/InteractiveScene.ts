import * as THREE from 'three';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Bounds, UpdateInfo, Mouse } from 'utils/sharedTypes';
import { lerp } from 'utils/functions/lerp';
import { sharedValues } from 'utils/sharedValues';

import { InteractiveObject3D, ColliderName } from '../Components/InteractiveObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

interface PerformRaycast {
  x: number;
  y: number;
  colliderName?: ColliderName;
  fnToCallIfHit?: string;
}

export class InteractiveScene extends THREE.Scene {
  static lerpEase = sharedValues.motion.LERP_EASE;
  _raycaster = new THREE.Raycaster();
  _rendererBounds: Bounds = { height: 100, width: 100 };
  _camera: THREE.PerspectiveCamera;
  _mouseMove = MouseMove.getInstance();
  _gui: GUI;
  _pixelRatio = 1;

  mouse: Mouse = {
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  };

  mouseStrength = {
    current: 0,
    target: 0,
  };

  _hoveredObject: InteractiveObject3D | null = null;
  _canHoverObject = true;

  constructor({ camera, gui }: Constructor) {
    super();
    this._camera = camera;
    this._gui = gui;
  }

  _performRaycast({ x, y, colliderName, fnToCallIfHit }: PerformRaycast) {
    this._raycaster.setFromCamera({ x, y }, this._camera);
    const intersects = this._raycaster.intersectObjects(this.children, true);
    const intersectingObjects: InteractiveObject3D[] = [];

    for (let i = 0; i < intersects.length; ++i) {
      const interactiveObject = intersects[i].object.parent as InteractiveObject3D;
      if (interactiveObject.colliderName) {
        intersectingObjects.push(interactiveObject);
        if (fnToCallIfHit) {
          if (interactiveObject.colliderName === colliderName) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            interactiveObject[fnToCallIfHit]();
          }
        }
        break;
      }
    }

    return intersectingObjects;
  }

  _onMouseMove = (e: THREE.Event) => {
    this.mouseStrength.target = (e.target as MouseMove).strength;

    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    this.mouse.target.x = (mouseX / this._rendererBounds.width) * 2 - 1;
    this.mouse.target.y = -(mouseY / this._rendererBounds.height) * 2 + 1;

    const objects = this._performRaycast({
      x: this.mouse.target.x,
      y: this.mouse.target.y,
    });

    if (objects.length > 0 && this._canHoverObject) {
      const hoveredObject = objects[0];
      if (hoveredObject !== this._hoveredObject) {
        if (this._hoveredObject) {
          this._hoveredObject.onMouseLeave();
        }
        this._hoveredObject = hoveredObject;
        this._hoveredObject.onMouseEnter();
      }
    } else if (this._hoveredObject) {
      this._hoveredObject.onMouseLeave();
      this._hoveredObject = null;
    }
  };

  _onClick = (e: THREE.Event) => {
    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    const pointX = (mouseX / this._rendererBounds.width) * 2 - 1;
    const pointY = -(mouseY / this._rendererBounds.height) * 2 + 1;

    this._performRaycast({
      x: pointX,
      y: pointY,
      colliderName: 'sceneItem',
      fnToCallIfHit: 'onClick',
    });
  };

  _addListeners() {
    this._mouseMove.addEventListener('mousemove', this._onMouseMove);
    this._mouseMove.addEventListener('click', this._onClick);
  }

  _removeListeners() {
    this._mouseMove.removeEventListener('mousemove', this._onMouseMove);
    this._mouseMove.removeEventListener('click', this._onClick);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
  }

  update(updateInfo: UpdateInfo) {
    //Lerp mouse move strength
    this.mouseStrength.current = lerp(
      this.mouseStrength.current,
      this.mouseStrength.target,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );

    //Lerp mouse coords
    this.mouse.current.x = lerp(
      this.mouse.current.x,
      this.mouse.target.x,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );
    this.mouse.current.y = lerp(
      this.mouse.current.y,
      this.mouse.target.y,
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
