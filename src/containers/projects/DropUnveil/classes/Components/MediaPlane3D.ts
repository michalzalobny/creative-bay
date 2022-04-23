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
  _mouse2D = [0, 0];
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _fragmentShader: string;
  _vertexShader: string;
  _geometry: THREE.PlaneBufferGeometry; //Remember to dispose passed geometry
  _loadedAsset: LoadedAsset | null = null;

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

  setMouse2D(mouse: Mouse) {
    this._mesh.material.uniforms.uMouse2D.value = [mouse.current.x, mouse.current.y];
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

  setAsset(asset: LoadedAsset) {
    this._loadedAsset = asset;

    this._mesh.material.uniforms.tMap.value = this._loadedAsset.asset as THREE.Texture;
    this._mesh.material.uniforms.uImageRes.value = [
      this._loadedAsset.naturalWidth,
      this._loadedAsset.naturalHeight,
    ];
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
