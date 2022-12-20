import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds, LoadedAsset } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { PointObject3D } from '../Components/PointObject3D';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  _planePointGeometry: THREE.PlaneBufferGeometry | null = null;
  _loadedAssets: LoadedAssets | null = null;

  _pointObjects3D: PointObject3D[] = [];
  _frameSettings = {
    particlesAmount: 1400,
    particlesSize: 10.2, //10.2 ensures that all the pixels used will take the whole space
  };
  _particlesSettings = {
    uVar1: 0.1,
    uVar2: 0,
    uVar3: 4,
    uVar4: 0.8,
  };
  _textureAsset: LoadedAsset | null = null;
  _imageWrapper: HTMLElement;

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._setGui();

    this._imageWrapper = document.querySelector(
      `[data-particles-dissolve="wrapper"]`
    ) as HTMLElement;
  }

  _setGui() {
    const particles = this._gui.addFolder('Particles');
    particles.close();

    particles
      .add(this._frameSettings, 'particlesAmount', 10, 2200, 1)
      .name('particlesAmount')
      .onFinishChange(() => {
        this._setupScene();
      });

    particles
      .add(this._particlesSettings, 'uVar1', 0.1, 4, 0.01)
      .name('particle size')
      .onChange((val: number) => {
        this._pointObjects3D.forEach(el => {
          el.setVar('uVar1', val);
        });
      });
    particles
      .add(this._particlesSettings, 'uVar2', 0.01, 1, 0.01)
      .name('progress')
      .onChange((val: number) => {
        this._pointObjects3D.forEach(el => {
          el.setVar('uVar2', val);
        });
      });
    particles
      .add(this._particlesSettings, 'uVar3', 0.01, 6, 0.01)
      .name('distortion1')
      .onChange((val: number) => {
        this._pointObjects3D.forEach(el => {
          el.setVar('uVar3', val);
        });
      });
    particles
      .add(this._particlesSettings, 'uVar4', 0.01, 3, 0.01)
      .name('distortion2')
      .onChange((val: number) => {
        this._pointObjects3D.forEach(el => {
          el.setVar('uVar4', val);
        });
      });
  }

  _setupScene() {
    this._createNewPointObjects();
  }

  _createNewPointObjects() {
    this._pointObjects3D.forEach(el => {
      el.destroy();
      this.remove(el);
    });
    this._pointObjects3D = [];

    const geometrySize = this._generateNewGeometry();
    if (!this._planePointGeometry) return;

    const particleSize =
      (this._planePointGeometry.parameters.widthSegments /
        this._frameSettings.particlesAmount /
        this._planePointGeometry.parameters.widthSegments) *
      100000 *
      this._frameSettings.particlesSize;

    for (let i = 0; i < 1; i++) {
      const pointObj = new PointObject3D({
        geometry: this._planePointGeometry,
        particleSize,
        particlesSettings: this._particlesSettings,
      });
      this._pointObjects3D.push(pointObj);
    }

    this._pointObjects3D.forEach(obj => {
      obj.setPixelRatio(this._pixelRatio);
      obj.setRendererBounds(this._rendererBounds);

      if (this._textureAsset && !obj.isAssetSet) {
        obj.setAsset({
          texture: this._textureAsset.asset as THREE.Texture,
          width: this._textureAsset.naturalWidth,
          height: this._textureAsset.naturalHeight,
        });
      }
      obj.setSize({ width: geometrySize.width, height: geometrySize.height });
      this.add(obj);
    });
  }

  _generateNewGeometry() {
    this._planePointGeometry?.dispose();
    const wrapperSizes = this._imageWrapper.getBoundingClientRect();
    const planeRatio = wrapperSizes.height / wrapperSizes.width;
    const particlesXAmount = (this._frameSettings.particlesAmount * wrapperSizes.width) / 1000;

    this._planePointGeometry = new THREE.PlaneGeometry(
      1,
      1,
      Math.round(particlesXAmount),
      Math.round(particlesXAmount * planeRatio)
    );

    //Buffers
    const count = this._planePointGeometry.attributes.position.count;
    const randomArray = new Float32Array(count);
    const randomArray2 = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      randomArray[i] = (Math.random() - 0.5) * 2;
      randomArray2[i] = (Math.random() - 0.5) * 2;
    }
    this._planePointGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomArray, 1));
    this._planePointGeometry.setAttribute('aRandom2', new THREE.BufferAttribute(randomArray2, 1));

    return {
      width: wrapperSizes.width,
      height: wrapperSizes.height,
    };
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._setupScene();
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
    this._textureAsset = this._loadedAssets['starterImage'];
    this._setupScene();
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
    this._pointObjects3D.forEach(el => {
      el.update(updateInfo);
    });
  }

  destroy() {
    super.destroy();
    this._planePointGeometry?.dispose();

    this._pointObjects3D.forEach(el => {
      el.destroy();
      this.remove(el);
    });
    this._pointObjects3D = [];

    this._planeGeometry.dispose();
  }
}
