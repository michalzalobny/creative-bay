import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo } from 'utils/sharedTypes';

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

  constructor({ gui }: Constructor) {
    super();
    this._gui = gui;
    this._setGui();
    this._drawSphere();
  }

  _drawSphere() {
    this._geometry = new THREE.SphereBufferGeometry(200, 32, 32);
    this._material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        tCube: { value: 0 },
        mRefractionRatio: { value: this._fresnelSettings.mRefractionRatio },
        mFresnelBias: { value: this._fresnelSettings.mFresnelBias },
        mFresnelScale: { value: this._fresnelSettings.mFresnelScale },
        mFresnelPower: { value: this._fresnelSettings.mFresnelPower },
      },
    });

    this._mesh = new THREE.Mesh(this._geometry, this._material);
    this.add(this._mesh);
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

  _setGui() {
    //Fresnel
    const fresnel = this._gui.addFolder('Blob fresnel');
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

  destroy() {
    super.destroy();
    this._geometry?.dispose();
    this._material?.dispose();
    if (this._mesh) {
      this.remove(this._mesh);
    }
  }
}
