import * as THREE from 'three';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Bounds, UpdateInfo, Mouse } from 'utils/sharedTypes';
import { lerp } from 'utils/functions/lerp';
import { sharedValues } from 'utils/sharedValues';

import { InteractiveObject3D, ColliderName } from '../Components/InteractiveObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
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
  _mouseMove: MouseMove;
  _pixelRatio = 1;

  _mouse3D: Mouse = {
    current: { x: 0, y: 0 },
    target: { x: 0, y: 0 },
  };

  _hoveredObject: InteractiveObject3D | null = null;
  _canHoverObject = true;

  constructor({ mouseMove, camera }: Constructor) {
    super();
    this._camera = camera;
    this._mouseMove = mouseMove;

    this._addListeners();
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
    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    this._mouse3D.target.x = (mouseX / this._rendererBounds.width) * 2 - 1;
    this._mouse3D.target.y = -(mouseY / this._rendererBounds.height) * 2 + 1;
  };

  _addListeners() {
    this._mouseMove.addEventListener('mousemove', this._onMouseMove);
  }

  _removeListeners() {
    this._mouseMove.removeEventListener('mousemove', this._onMouseMove);
  }

  setPixelRatio(ratio: number) {
    this._pixelRatio = ratio;
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
  }

  update(updateInfo: UpdateInfo) {
    //Lerp 3D mouse coords
    this._mouse3D.current.x = lerp(
      this._mouse3D.current.x,
      this._mouse3D.target.x,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );
    this._mouse3D.current.y = lerp(
      this._mouse3D.current.y,
      this._mouse3D.target.y,
      InteractiveScene.lerpEase * updateInfo.slowDownFactor
    );
  }

  destroy() {
    this._removeListeners();
  }
}
