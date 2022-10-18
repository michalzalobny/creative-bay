import * as THREE from 'three';
import debounce from 'lodash.debounce';
import GUI from 'lil-gui';

import { sharedValues } from 'utils/sharedValues';
import { Preloader } from 'utils/helperClasses/Preloader';

import { appState } from '../Project.state';
import { ExperienceScene } from './Scenes/ExperienceScene';
//Assets imports
import starterImageSrc from './assets/starter.jpg';

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
  _experienceScene: ExperienceScene;
  _setShouldRevealReact: React.Dispatch<React.SetStateAction<boolean>>;
  _setProgressValueReact: React.Dispatch<React.SetStateAction<number>>;
  _gui = new GUI();
  _pixelRatio = 1;
  _assetsLoaded = false;

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

    this._gui.title('Scene settings');
    this._experienceScene = new ExperienceScene({ camera: this._camera, gui: this._gui });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();

    this._preloader.setAssetsToPreload([
      { src: starterImageSrc.src, type: 'image', targetName: 'starterImage' },
    ]);

    // import('@dimforge/rapier3d')
    //   .then(RAPIER => {
    //     appState.RAPIER = RAPIER;

    //     if (this._assetsLoaded) {
    //       this._revealApp();
    //     }
    //   })
    //   .catch(err => {
    //     console.error('App: RAPIER load failed: ', err);
    //   });
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;

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
    this._assetsLoaded = true;
    this._experienceScene.setLoadedAssets((e.target as Preloader).loadedAssets);
    if (appState.RAPIER !== null) {
      this._revealApp();
    }
  };

  _revealApp() {
    this._setShouldRevealReact(true);
    this._experienceScene.onAppReady();
  }

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
    const slowDownFactor = delta / sharedValues.motion.DT_FPS;

    // //Rounded slowDown factor to the nearest integer reduces physics lags
    // const slowDownFactorRounded = Math.round(slowDownFactor);

    // if (slowDownFactorRounded >= 1) {
    //   slowDownFactor = slowDownFactorRounded;
    // }
    this._lastFrameTime = time;

    this._experienceScene.update({ delta, slowDownFactor, time });

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
    appState.RAPIER = null;
  }
}
