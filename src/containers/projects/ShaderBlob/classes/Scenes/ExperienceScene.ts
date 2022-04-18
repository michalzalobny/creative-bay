//Based on https://www.youtube.com/watch?v=sPBb-0al7Y0

import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { UpdateInfo, Bounds } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { Sphere3D } from '../Components/Sphere3D';
import { BlobSphere3D } from '../Components/BlobSphere3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
  renderer: THREE.WebGLRenderer;
}

export class ExperienceScene extends InteractiveScene {
  _controls: OrbitControls;
  _sphere1: Sphere3D;
  _blobSphere1: BlobSphere3D;
  _cubeRenderTarget: THREE.WebGLCubeRenderTarget | null = null;
  _cubeCamera: THREE.CubeCamera | null = null;
  _renderer: THREE.WebGLRenderer;

  constructor({ gui, controls, camera, mouseMove, renderer }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;
    this._renderer = renderer;

    this._blobSphere1 = new BlobSphere3D({ gui: this._gui });
    this._sphere1 = new Sphere3D({ gui: this._gui });

    this._addCubeRenderTarget();

    this.add(this._sphere1);
    this.add(this._blobSphere1);
  }

  _addCubeRenderTarget() {
    this._cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      format: THREE.RGBAFormat,
      generateMipmaps: true,
      minFilter: THREE.LinearMipMapLinearFilter,
      encoding: THREE.sRGBEncoding,
    });

    this._cubeCamera = new THREE.CubeCamera(0.1, 1000, this._cubeRenderTarget);
    this._blobSphere1.setTCube(this._cubeRenderTarget.texture);
  }

  animateIn() {
    this._blobSphere1.animateIn();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._sphere1.update(updateInfo);
    this._blobSphere1.update(updateInfo);
    if (this._cubeRenderTarget && this._cubeCamera) {
      //Fixes feedback loop, because now it does not need itself in order to draw the rest of the scene
      this._blobSphere1.visible = false;
      this._cubeCamera.update(this._renderer, this);
      this._blobSphere1.visible = true;
    }
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._blobSphere1.setRendererBounds(bounds);
    this._sphere1.setSize(1000); //It's 1000 due to the camera Z position (it has to be bigger, because it wraps the camera)
  }

  destroy() {
    this.remove(this._sphere1);
    this._sphere1.destroy();
    this.remove(this._blobSphere1);
    this._blobSphere1.destroy();
    if (this._cubeRenderTarget) this._cubeRenderTarget.dispose();
  }
}
