import * as THREE from 'three';
import { gsap } from 'gsap';

import { UpdateInfo, Bounds, Mouse } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import fragmentShaderDefault from '../shaders/particles/fragment.glsl';
import vertexShaderDefault from '../shaders/particles/vertex.glsl';
import { VideoNames } from '../App';

interface ParticlesSettings {
  uVar1: number;
  uVar2: number;
  uVar3: number;
  uVar4: number;
}

interface Constructor {
  fragmentShader?: string;
  vertexShader?: string;
  geometry: THREE.BufferGeometry;
  particleSize: number;
  particlesSettings: ParticlesSettings;
}

interface PointAsset {
  width: number;
  height: number;
  texture: THREE.Texture;
  targetName: string;
}

export class PointObject3D extends InteractiveObject3D {
  static defaultEase = 'power2.inOut';
  _points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  _material: THREE.ShaderMaterial;
  _mouse2D = [0, 0];
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _fragmentShader: string;
  _vertexShader: string;
  _geometry: THREE.BufferGeometry; //Remember to dispose passed geometry

  constructor({
    particlesSettings,
    particleSize,
    fragmentShader,
    geometry,
    vertexShader,
  }: Constructor) {
    super();
    this._fragmentShader = fragmentShader || fragmentShaderDefault;
    this._vertexShader = vertexShader || vertexShaderDefault;
    this._geometry = geometry;

    this._material = new THREE.ShaderMaterial({
      // side: THREE.FrontSide,
      vertexShader: this._vertexShader,
      fragmentShader: this._fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        tMap1: { value: null },
        tMap2: { value: null },
        tMap3: { value: null },
        uMediaRes1: {
          value: [1, 1], //Image size in pixels
        },
        uMediaRes2: {
          value: [1, 1],
        },
        uMediaRes3: {
          value: [1, 1],
        },
        uCanvasRes: {
          value: [0, 0], //Canvas size in pixels
        },
        uPlaneRes: {
          value: [1, 1], //Plane size in pixels
        },
        uMouse2D: {
          value: [1, 1], //Mouse coords from [0,0] (top left corner) to [screenWidth , screenHeight]
        },
        uPixelRatio: { value: 1 },
        uSize: { value: particleSize },
        uSizeFactor: { value: 1 },
        uDistortion: { value: 0 },
        uProgress1: { value: 0 },
        uProgress2: { value: 0 },
        uVar1: { value: particlesSettings.uVar1 },
        uVar2: { value: particlesSettings.uVar2 },
        uVar3: { value: particlesSettings.uVar3 },
        uVar4: { value: particlesSettings.uVar4 },
      },
    });

    this._points = new THREE.Points(this._geometry, this._material);
    this.add(this._points);
  }

  setVar(name: string, value: number) {
    this._points.material.uniforms[name].value = value;
  }

  animatePointSize(destination: number, duration: number) {
    return gsap.to(this._points.material.uniforms.uSizeFactor, {
      value: destination,
      duration,
      ease: PointObject3D.defaultEase,
    });
  }

  animateDistortion(destination: number, duration: number) {
    return gsap.to(this._points.material.uniforms.uDistortion, {
      value: destination,
      duration,
      ease: PointObject3D.defaultEase,
    });
  }

  _animateProgress1(destination: number, duration: number) {
    return gsap.to(this._points.material.uniforms.uProgress1, {
      value: destination,
      duration,
      ease: PointObject3D.defaultEase,
    });
  }

  _animateProgress2(destination: number, duration: number) {
    return gsap.to(this._points.material.uniforms.uProgress2, {
      value: destination,
      duration,
      ease: PointObject3D.defaultEase,
    });
  }

  showT(position: number, duration: number) {
    switch (position) {
      case 1:
        return this._showT1(duration);
      case 2:
        return this._showT2(duration);
      case 3:
        return this._showT3(duration);
      default:
        return this._showT1(duration);
    }
  }

  _showT1(duration: number) {
    const tl = gsap.timeline();
    const offset = `>-${duration}`;
    tl.add(this._animateProgress1(0, duration)).add(this._animateProgress2(0, duration), offset);
    return tl;
  }

  _showT2(duration: number) {
    const tl = gsap.timeline();
    const offset = `>-${duration}`;
    tl.add(this._animateProgress1(1, duration)).add(this._animateProgress2(0, duration), offset);
    return tl;
  }

  _showT3(duration: number) {
    const tl = gsap.timeline();
    const offset = `>-${duration}`;
    tl.add(this._animateProgress1(0, duration)).add(this._animateProgress2(1, duration), offset);
    return tl;
  }

  setMouse(mouse: Mouse) {
    this._points.material.uniforms.uMouse2D.value = [mouse.current.x, mouse.current.y];
  }

  setPixelRatio(ratio: number) {
    this._points.material.uniforms.uPixelRatio.value = ratio;
  }

  setSize(bounds: Bounds) {
    this._points.scale.x = bounds.width;
    this._points.scale.y = bounds.height;
    this._points.material.uniforms.uPlaneRes.value = [this._points.scale.x, this._points.scale.y];
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;

    this._points.material.uniforms.uCanvasRes.value = [
      this._rendererBounds.width,
      this._rendererBounds.height,
    ];
  }

  setAsset(asset: PointAsset) {
    switch (asset.targetName) {
      case VideoNames.VID1:
        (this._points.material.uniforms.tMap1.value as THREE.Texture | null)?.dispose();
        this._points.material.uniforms.tMap1.value = asset.texture;
        this._points.material.uniforms.uMediaRes1.value = [asset.width, asset.height];
        break;
      case VideoNames.VID2:
        (this._points.material.uniforms.tMap2.value as THREE.Texture | null)?.dispose();
        this._points.material.uniforms.tMap2.value = asset.texture;
        this._points.material.uniforms.uMediaRes2.value = [asset.width, asset.height];
        break;
      case VideoNames.VID3:
        (this._points.material.uniforms.tMap3.value as THREE.Texture | null)?.dispose();
        this._points.material.uniforms.tMap3.value = asset.texture;
        this._points.material.uniforms.uMediaRes3.value = [asset.width, asset.height];
        break;
      default:
        break;
    }
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._points.material.uniforms.uTime.value = updateInfo.time * 0.001;
  }

  destroy() {
    super.destroy();
    (this._points.material.uniforms.tMap1.value as THREE.Texture | null)?.dispose();
    (this._points.material.uniforms.tMap2.value as THREE.Texture | null)?.dispose();
    (this._points.material.uniforms.tMap3.value as THREE.Texture | null)?.dispose();
    this._material.dispose();
    this.remove(this._points);
  }
}
