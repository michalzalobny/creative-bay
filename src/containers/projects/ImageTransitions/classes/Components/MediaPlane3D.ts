import * as THREE from 'three';

import { UpdateInfo, LoadedAsset, Bounds, Mouse } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import fragmentShaderDefault from '../shaders/mediaPlane/fragment.glsl';
import vertexShaderDefault from '../shaders/mediaPlane/vertex.glsl';

interface Constructor {
  fragmentShader?: string;
  vertexShader?: string;
  geometry: THREE.PlaneBufferGeometry;
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

  constructor({ fragmentShader, geometry, vertexShader }: Constructor) {
    super();
    this._fragmentShader = fragmentShader || fragmentShaderDefault;
    this._vertexShader = vertexShader || vertexShaderDefault;
    this._geometry = geometry;

    this._material = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        tMap1: { value: null },
        tMap2: { value: null },
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
        uMouse: {
          value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
        },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
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

  setAssets(asset1: LoadedAsset, asset2: LoadedAsset) {
    this._mesh.material.uniforms.tMap1.value = asset1.asset as THREE.Texture;
    this._mesh.material.uniforms.uMediaRes1.value = [asset1.naturalWidth, asset1.naturalHeight];

    this._mesh.material.uniforms.tMap2.value = asset2.asset as THREE.Texture;
    this._mesh.material.uniforms.uMediaRes2.value = [asset2.naturalWidth, asset2.naturalHeight];
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
