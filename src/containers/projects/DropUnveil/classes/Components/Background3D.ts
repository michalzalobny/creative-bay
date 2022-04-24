import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, Bounds, Mouse } from 'utils/sharedTypes';
import { breakpoints } from 'utils/media';

import vertexShader from '../shaders/background/vertex.glsl';
import fragmentShader from '../shaders/background/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}
export class Background3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.PlaneBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _gui: GUI;
  _background = {
    color1: [0 / 255, 184 / 255, 129 / 255], // [255 / 255, 139 / 255, 31 / 255]
    color2: [0 / 255, 184 / 255, 194 / 255], // [0 / 255, 200 / 255, 255 / 255]
    colorAccent: [0 / 255, 0 / 255, 0 / 255],
    uLinesBlur: 0.25,
    uNoise: 0.075,
    uOffsetX: 0.34,
    uOffsetY: 0.0,
    uLinesAmount: 5.0,
  };
  _mouse2D = [0, 0];
  _planeBounds: Bounds = { height: 100, width: 100 };

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
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: this._background.color1 },
        uColor2: { value: this._background.color2 },
        uColorAccent: { value: this._background.colorAccent },
        uLinesBlur: { value: this._background.uLinesBlur },
        uNoise: { value: this._background.uNoise },
        uOffsetX: { value: this._background.uOffsetX },
        uOffsetY: { value: this._background.uOffsetY },
        uLinesAmount: { value: this._setLinesAmount(this._background.uLinesAmount) },
        uPlaneRes: {
          value: [1, 1], //Plane size in pixels
        },
        uMouse2D: {
          value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
        },
        uBackgroundScale: { value: 1.0 },
      },
      wireframe: false,
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this._mesh.renderOrder = -1;
    this.add(this._mesh);
  }

  _setGui() {
    const background = this._gui.addFolder('Background');
    background.close();
    background.addColor(this._background, 'color1', 1).name('Color 1');
    background.addColor(this._background, 'color2', 1).name('Color 2');
    background.addColor(this._background, 'colorAccent', 1).name('Color accent');
    background
      .add(this._background, 'uLinesBlur', 0.01, 1, 0.01)
      .name('LinesBlur')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.uLinesBlur.value = value;
      });

    background
      .add(this._background, 'uNoise', 0.01, 1, 0.01)
      .name('Noise')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.uNoise.value = value;
      });

    background
      .add(this._background, 'uOffsetX', -5, 5, 0.01)
      .name('Offset X')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.uOffsetX.value = value;
      });

    background
      .add(this._background, 'uOffsetY', -5, 5, 0.01)
      .name('Offset Y')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.uOffsetY.value = value;
      });

    background
      .add(this._background, 'uLinesAmount', 0, 15, 0.01)
      .name('Lines amount')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._setLinesAmount(value);
      });
  }

  _setLinesAmount(value: number) {
    if (this._mesh) {
      if (this._planeBounds.width >= breakpoints.tablet) {
        this._mesh.material.uniforms.uLinesAmount.value = value;
      } else {
        this._mesh.material.uniforms.uLinesAmount.value = value * 3.8;
      }
    }
  }

  setSize(bounds: Bounds) {
    this._planeBounds = bounds;

    if (this._mesh) {
      this._setLinesAmount(this._background.uLinesAmount);
      this._mesh.scale.x = this._planeBounds.width;
      this._mesh.scale.y = this._planeBounds.height;
      this._mesh.material.uniforms.uPlaneRes.value = [this._mesh.scale.x, this._mesh.scale.y];
      if (this._planeBounds.width < breakpoints.tablet) {
        this._mesh.material.uniforms.uBackgroundScale.value =
          this._planeBounds.width * 0.001 * 1.45;
      } else {
        this._mesh.material.uniforms.uBackgroundScale.value = 1.0;
      }
    }
  }

  setMouse2D(mouse: Mouse) {
    if (this._mesh) {
      this._mesh.material.uniforms.uMouse2D.value = [mouse.current.x, mouse.current.y];
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
