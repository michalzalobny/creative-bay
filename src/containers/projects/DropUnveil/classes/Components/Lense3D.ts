import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAsset, Bounds, Mouse } from 'utils/sharedTypes';

import vertexShader from '../shaders/lense/vertex.glsl';
import fragmentShader from '../shaders/lense/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Lense3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _gui: GUI;
  _lenseAsset: LoadedAsset | null = null;
  _mouse2D = [0, 0];
  _rendererBounds: Bounds = { width: 1, height: 1 };

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
    this._drawObject();
  }

  _drawObject() {
    this._geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
    this._material = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        tMap: { value: null },
        uCanvasRes: {
          value: [0, 0], //Canvas size in pixels
        },
        uPlaneRes: {
          value: [1, 1], //Plane size in pixels
        },
        uImageRes: {
          value: [1, 1], //Image size in pixels
        },
        uMouse2D: {
          value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
        },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _setGui() {}

  setSize(bounds: Bounds) {
    if (this._mesh) {
      this._mesh.scale.x = bounds.width;
      this._mesh.scale.y = bounds.height;
      this._mesh.material.uniforms.uPlaneRes.value = [this._mesh.scale.x, this._mesh.scale.y];
    }
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;

    if (this._mesh) {
      this._mesh.material.uniforms.uCanvasRes.value = [
        this._rendererBounds.width,
        this._rendererBounds.height,
      ];
    }
  }

  setMouse2D(mouse: Mouse) {
    if (this._mesh) {
      this._mesh.material.uniforms.uMouse2D.value = [mouse.current.x, mouse.current.y];
    }
  }

  setAsset(asset: LoadedAsset) {
    this._lenseAsset = asset;

    if (this._mesh) {
      this._mesh.material.uniforms.tMap.value = this._lenseAsset.asset as THREE.Texture;
      this._mesh.material.uniforms.uImageRes.value = [
        this._lenseAsset.naturalWidth,
        this._lenseAsset.naturalHeight,
      ];
    }
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh) {
      this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}
