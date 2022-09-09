import * as THREE from 'three';
import debounce from 'lodash.debounce';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { sharedValues } from 'utils/sharedValues';
import { Preloader } from 'utils/helperClasses/Preloader';
import { AssetToPreload } from 'utils/sharedTypes';

import { ExperienceScene } from './Scenes/ExperienceScene';
import { imagesToPreload } from '../Project.data';

interface Constructor {
  rendererEl: HTMLDivElement;
  setShouldReveal: React.Dispatch<React.SetStateAction<boolean>>;
  setProgressValue: React.Dispatch<React.SetStateAction<number>>;
}

export class App extends THREE.EventDispatcher {
  _rendererEl: HTMLDivElement;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement;
  _camera: THREE.PerspectiveCamera;
  _renderer: THREE.WebGLRenderer;
  _preloader = new Preloader();
  _orbitControls: OrbitControls;
  _experienceScene: ExperienceScene;
  _setShouldRevealReact: React.Dispatch<React.SetStateAction<boolean>>;
  _setProgressValueReact: React.Dispatch<React.SetStateAction<number>>;
  _gui = new GUI();
  _pixelRatio = 1;

  constructor({ setShouldReveal, rendererEl, setProgressValue }: Constructor) {
    super();
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);
    this._camera = new THREE.PerspectiveCamera();

    this._setShouldRevealReact = setShouldReveal;
    this._setProgressValueReact = setProgressValue;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'default',
    });

    this._orbitControls = new OrbitControls(this._camera, this._rendererEl);
    this._orbitControls.enableDamping = true;
    this._orbitControls.enablePan = false;
    this._orbitControls.enableRotate = false;
    this._orbitControls.enableZoom = false;
    this._orbitControls.update();

    this._gui.title('Scene settings');
    // this._gui.hide();
    this._experienceScene = new ExperienceScene({ camera: this._camera, gui: this._gui });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();

    const assetsToPreload: AssetToPreload[] = imagesToPreload.map(item => {
      let type: 'image' | 'video' = 'image';
      const lastFourChars = item.slice(-4);
      if (lastFourChars === '.mp4') type = 'video';
      return {
        src: item,
        type,
      };
    });

    this._preloader.setAssetsToPreload(assetsToPreload);
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;

    //Set to match pixel size of the elements in three with pixel size of DOM elements
    this._camera.position.z = 1000;
    this._camera.fov =
      2 * Math.atan(rendererBounds.height / 2 / this._camera.position.z) * (180 / Math.PI);

    this._renderer.setSize(rendererBounds.width, rendererBounds.height);
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
    this._renderer.setPixelRatio(this._pixelRatio);
    this._camera.updateProjectionMatrix();
    this._experienceScene.setPixelRatio(this._pixelRatio);
    this._experienceScene.setRendererBounds(rendererBounds);
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
  };

  _onAssetsLoaded = (e: THREE.Event) => {
    this._setShouldRevealReact(true);
    this._experienceScene.setLoadedAssets((e.target as Preloader).loadedAssets);
  };

  _onPreloaderProgress = (e: THREE.Event) => {
    this._setProgressValueReact(e.progress as number);
  };

  _addListeners() {
    window.addEventListener('resize', this._onResizeDebounced);
    window.addEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.addEventListener('loaded', this._onAssetsLoaded);
    this._preloader.addEventListener('progress', this._onPreloaderProgress);
  }

  _removeListeners() {
    window.removeEventListener('resize', this._onResizeDebounced);
    window.removeEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.removeEventListener('loaded', this._onAssetsLoaded);
    this._preloader.removeEventListener('progress', this._onPreloaderProgress);
  }

  _resumeAppFrame() {
    this._isResumed = true;
    if (!this._rafId) {
      this._rafId = window.requestAnimationFrame(this._renderOnFrame);
    }
  }

  _renderOnFrame = (time: number) => {
    this._rafId = window.requestAnimationFrame(this._renderOnFrame);

    if (this._isResumed || !this._lastFrameTime) {
      this._lastFrameTime = window.performance.now();
      this._isResumed = false;
      return;
    }

    const delta = time - this._lastFrameTime;
    let slowDownFactor = delta / sharedValues.motion.DT_FPS;

    //Rounded slowDown factor to the nearest integer reduces physics lags
    const slowDownFactorRounded = Math.round(slowDownFactor);

    if (slowDownFactorRounded >= 1) {
      slowDownFactor = slowDownFactorRounded;
    }
    this._lastFrameTime = time;

    this._experienceScene.update({ delta, slowDownFactor, time });
    this._orbitControls.update();

    this._renderer.render(this._experienceScene, this._camera);
  };

  _stopAppFrame() {
    if (this._rafId) {
      window.cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  destroy() {
    if (this._canvas.parentNode) {
      this._canvas.parentNode.removeChild(this._canvas);
    }
    this._stopAppFrame();
    this._removeListeners();

    this._experienceScene.destroy();
    this._preloader.destroy();
    this._gui.destroy();
  }
}
