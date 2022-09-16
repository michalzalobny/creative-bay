import * as THREE from 'three';

import { UpdateInfo, LoadedAsset, Bounds, Mouse } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import fragmentShaderDefault from '../shaders/defaultTransition/fragment.glsl';
import vertexShaderDefault from '../shaders/defaultTransition/vertex.glsl';

export interface ImagesSettings {
  uVar1: number;
  uVar2: number;
  uVar3: number;
}

interface Constructor {
  fragmentShader?: string;
  vertexShader?: string;
  geometry: THREE.PlaneBufferGeometry;
  imagesSettings: ImagesSettings;
}

export class MediaPlane3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.PlaneBufferGeometry, THREE.ShaderMaterial>;
  _material: THREE.ShaderMaterial;
  _mouse = [0, 0];
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _fragmentShader: string;
  _vertexShader: string;
  _geometry: THREE.PlaneBufferGeometry; //Remember to dispose passed geometry
  _domEl: HTMLElement | null = null;
  _domElBounds: DOMRect | null = null;
  _buttonEl: HTMLElement | null = null;
  _currentImage: 1 | 0 = 0;

  constructor({ imagesSettings, fragmentShader, geometry, vertexShader }: Constructor) {
    super();
    this._fragmentShader = fragmentShader || fragmentShaderDefault;
    this._vertexShader = vertexShader || vertexShaderDefault;
    this._geometry = geometry;

    this._material = new THREE.ShaderMaterial({
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0 },
        tMap1: { value: null },
        tMap2: { value: null },
        tMap3: { value: null },
        uCanvasRes: {
          value: [0, 0], //Canvas size in pixels
        },
        uPlaneRes: {
          value: [1, 1], //Plane size in pixels
        },
        uMediaRes1: {
          value: [1, 1], //Image1 size in pixels
        },
        uMediaRes2: {
          value: [1, 1], //Image2 size in pixels
        },
        uMediaRes3: {
          value: [1, 1], //Image2 size in pixels
        },
        uMouse: {
          value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
        },
        uTransitionProgress: { value: 0 },
        uHoverProgress: { value: 0 },
        uVar1: { value: imagesSettings.uVar1 },
        uVar2: { value: imagesSettings.uVar2 },
        uVar3: { value: imagesSettings.uVar3 },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  setUniformVar(name: string, value: number) {
    this._mesh.material.uniforms[name].value = value;
  }

  setMouse(mouse: Mouse) {
    this._mesh.material.uniforms.uMouse.value = [mouse.current.x, mouse.current.y];
  }

  setSize(bounds: Bounds) {
    this._mesh.scale.x = bounds.width;
    this._mesh.scale.y = bounds.height;
    this._mesh.material.uniforms.uPlaneRes.value = [this._mesh.scale.x, this._mesh.scale.y];
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;

    this._mesh.material.uniforms.uCanvasRes.value = [
      this._rendererBounds.width,
      this._rendererBounds.height,
    ];
  }

  setAssets(asset1: LoadedAsset, asset2?: LoadedAsset, asset3?: LoadedAsset) {
    this._mesh.material.uniforms.tMap1.value = asset1.asset as THREE.Texture;
    this._mesh.material.uniforms.uMediaRes1.value = [asset1.naturalWidth, asset1.naturalHeight];

    if (asset2) {
      this._mesh.material.uniforms.tMap2.value = asset2.asset as THREE.Texture;
      this._mesh.material.uniforms.uMediaRes2.value = [asset2.naturalWidth, asset2.naturalHeight];
    }

    if (asset3) {
      this._mesh.material.uniforms.tMap3.value = asset3.asset as THREE.Texture;
      this._mesh.material.uniforms.uMediaRes3.value = [asset3.naturalWidth, asset3.naturalHeight];
    }
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
  }

  destroy() {
    super.destroy();
    this._material.dispose();
    this.remove(this._mesh);
  }
}
