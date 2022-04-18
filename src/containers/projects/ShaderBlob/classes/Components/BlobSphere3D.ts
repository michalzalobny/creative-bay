import * as THREE from 'three';
import GUI from 'lil-gui';
import TWEEN, { Tween } from '@tweenjs/tween.js';

import { UpdateInfo, Bounds, AnimateProps } from 'utils/sharedTypes';
import { breakpoints } from 'utils/media';

import vertexShader from '../shaders/blobSphere/vertex.glsl';
import fragmentShader from '../shaders/blobSphere/fragment.glsl';
import { InteractiveObject3D } from './InteractiveObject3D';

interface Constructor {
  gui: GUI;
}

export class BlobSphere3D extends InteractiveObject3D {
  _mesh: THREE.Mesh<THREE.SphereBufferGeometry, THREE.ShaderMaterial> | null = null;
  _geometry: THREE.SphereBufferGeometry | null = null;
  _material: THREE.ShaderMaterial | null = null;
  _gui: GUI;
  _fresnelSettings = {
    mRefractionRatio: 1.02,
    mFresnelBias: 0.1,
    mFresnelScale: 4.0, //2.0 - default
    mFresnelPower: 2.0, //1.0 - default
  };
  _scaleTween: Tween<{ progress: number }> | null = null;
  _colorFactorTween: Tween<{ progress: number }> | null = null;
  _isBlobAnimated = false;
  _blobScale = 1.2;
  _colorFactor = 1;
  _rendererBounds: Bounds = { height: 100, width: 100 };

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(1, 64, 64);
    this._material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tCube: { value: 0 },
        uColorFactor: { value: this._colorFactor },
        mRefractionRatio: { value: this._fresnelSettings.mRefractionRatio },
        mFresnelBias: { value: this._fresnelSettings.mFresnelBias },
        mFresnelScale: { value: this._fresnelSettings.mFresnelScale },
        mFresnelPower: { value: this._fresnelSettings.mFresnelPower },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
  }

  _setGui() {
    const fresnel = this._gui.addFolder('Blob fresnel');
    fresnel.close();
    fresnel
      .add(this._fresnelSettings, 'mRefractionRatio', 0, 1.2, 0.01)
      .name('mRefractionRatio')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.mRefractionRatio.value = value;
      });

    fresnel
      .add(this._fresnelSettings, 'mFresnelBias', 0, 1, 0.01)
      .name('mFresnelBias')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.mFresnelBias.value = value;
      });

    fresnel
      .add(this._fresnelSettings, 'mFresnelScale', 0, 4, 0.01)
      .name('mFresnelScale')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.mFresnelScale.value = value;
      });

    fresnel
      .add(this._fresnelSettings, 'mFresnelPower', 0.01, 5, 0.01)
      .name('mFresnelPower')
      .onChange((value: number) => {
        if (!this._mesh) return;
        this._mesh.material.uniforms.mFresnelPower.value = value;
      });
  }

  _animateScale({ duration = 0, delay = 0, destination }: AnimateProps) {
    if (this._scaleTween) this._scaleTween.stop();

    this._scaleTween = new TWEEN.Tween({ progress: this._blobScale })
      .to({ progress: destination })
      .delay(delay)
      .duration(duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._blobScale = obj.progress;
        let finalSize = this._rendererBounds.width * 0.25;
        if (this._rendererBounds.width >= breakpoints.tablet) {
          finalSize = this._rendererBounds.width * 0.12;
        }
        this.setSize(finalSize * this._blobScale);
      })
      .onComplete(() => {
        this._isBlobAnimated = true;
      });

    this._scaleTween.start();
  }

  _animateColorFactor({ duration = 0, delay = 0, destination }: AnimateProps) {
    if (this._colorFactorTween) this._colorFactorTween.stop();

    this._colorFactorTween = new TWEEN.Tween({ progress: this._colorFactor })
      .to({ progress: destination })
      .delay(delay)
      .duration(duration)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._colorFactor = obj.progress;
        this._setColorFactor(this._colorFactor);
      });
    this._colorFactorTween.start();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._mesh) {
      this._mesh.material.uniforms.uTime.value = updateInfo.time * 0.001;
    }
  }

  setTCube(tCube: THREE.CubeTexture) {
    if (this._mesh) {
      this._mesh.material.uniforms.tCube.value = tCube;
    }
  }

  _setColorFactor(value: number) {
    if (this._mesh) {
      this._mesh.material.uniforms.uColorFactor.value = value;
    }
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;

    if (this._isBlobAnimated) {
      this.setSize(this._rendererBounds.width * 0.25);
      if (this._rendererBounds.width >= breakpoints.tablet) {
        this.setSize(this._rendererBounds.width * 0.12);
      }
    }
  }

  setSize(size: number) {
    if (this._mesh) {
      this._mesh.scale.set(size, size, size);
    }
  }

  animateIn() {
    this._animateScale({ destination: 1, duration: 2000 });
    this._animateColorFactor({ destination: 0, duration: 2000 });
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
