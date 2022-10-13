import * as THREE from 'three';
import GUI from 'lil-gui';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';
import { sharedValues } from 'utils/sharedValues';

import { FirstPersonCamera } from '../utils/FirstPersonCamera';
import { InputControls } from '../utils/InputControls';
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
  _inputControls = InputControls.getInstance();
  _gui: GUI;
  _pixelRatio = 1;
  _fpsCamera;

  _hoveredObject: InteractiveObject3D | null = null;
  _canHoverObject = true;

  constructor({ camera, gui }: Constructor) {
    super();
    this._camera = camera;
    this._gui = gui;
    this._fpsCamera = new FirstPersonCamera({ camera, inputControls: this._inputControls });
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

  // _onMouseMove = (e: THREE.Event) => {
  //   const mouseX = (e.target as InputControls).mouse.x;
  //   const mouseY = (e.target as InputControls).mouse.y;

  //   const mouseXNorm = (mouseX / this._rendererBounds.width) * 2 - 1;
  //   const mouseYNorm = -(mouseY / this._rendererBounds.height) * 2 + 1;

  //   const objects = this._performRaycast({
  //     x: mouseXNorm,
  //     y: mouseYNorm,
  //   });

  //   if (objects.length > 0 && this._canHoverObject) {
  //     const hoveredObject = objects[0];
  //     if (hoveredObject !== this._hoveredObject) {
  //       if (this._hoveredObject) {
  //         this._hoveredObject.onMouseLeave();
  //       }
  //       this._hoveredObject = hoveredObject;
  //       this._hoveredObject.onMouseEnter();
  //     }
  //   } else if (this._hoveredObject) {
  //     this._hoveredObject.onMouseLeave();
  //     this._hoveredObject = null;
  //   }
  // };

  // _onClick = (e: THREE.Event) => {
  //   const mouseX = (e.target as InputControls).mouse.x;
  //   const mouseY = (e.target as InputControls).mouse.y;

  //   const pointX = (mouseX / this._rendererBounds.width) * 2 - 1;
  //   const pointY = -(mouseY / this._rendererBounds.height) * 2 + 1;

  //   this._performRaycast({
  //     x: pointX,
  //     y: pointY,
  //     colliderName: 'sceneItem',
  //     fnToCallIfHit: 'onClick',
  //   });
  // };

  _addListeners() {
    // this._inputControls.addEventListener('mousemove', this._onMouseMove);
    // this._inputControls.addEventListener('click', this._onClick);
  }

  _removeListeners() {
    // this._inputControls.removeEventListener('mousemove', this._onMouseMove);
    // this._inputControls.removeEventListener('click', this._onClick);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
    this._fpsCamera.setRendererBounds(bounds);
  }

  update(updateInfo: UpdateInfo) {
    this._fpsCamera.update(updateInfo);
    this._inputControls.update();
  }

  setPixelRatio(ratio: number) {
    this._pixelRatio = ratio;
  }

  destroy() {
    this._removeListeners();
    this._fpsCamera.destroy();
  }
}
