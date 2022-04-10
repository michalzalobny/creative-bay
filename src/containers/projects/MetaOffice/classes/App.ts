import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import debounce from 'lodash.debounce';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Scroll } from 'utils/helperClasses/Scroll';
import { sharedValues } from 'utils/sharedValues';
import { Preloader } from 'utils/helperClasses/Preloader';

import { ExperienceScene } from './Scenes/ExperienceScene';
//Assets imports
import officeSrc from './assets/office.glb';
import render1Src from './assets/render1.jpg';
import render2Src from './assets/render2.jpg';
import render3Src from './assets/render3.jpg';

interface Constructor {
  rendererEl: HTMLDivElement;
  setShouldReveal: React.Dispatch<React.SetStateAction<boolean>>;
}

export class App extends THREE.EventDispatcher {
  _rendererEl: HTMLDivElement;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement;
  _camera: THREE.PerspectiveCamera;
  _renderer: THREE.WebGLRenderer;
  _mouseMove = MouseMove.getInstance();
  _scroll = Scroll.getInstance();
  _preloader = new Preloader();
  _controls: OrbitControls;
  _experienceScene: ExperienceScene;
  _setShouldRevealReact: React.Dispatch<React.SetStateAction<boolean>>;
  _gui = new GUI();

  constructor({ setShouldReveal, rendererEl }: Constructor) {
    super();
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);
    this._camera = new THREE.PerspectiveCamera();

    this._setShouldRevealReact = setShouldReveal;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: true,
      alpha: true,
    });

    this._renderer.shadowMap.enabled = true;

    this._controls = new OrbitControls(this._camera, this._rendererEl);
    this._controls.enableDamping = true;
    this._controls.update();

    this._gui.title('Scene settings');
    this._experienceScene = new ExperienceScene({
      camera: this._camera,
      mouseMove: this._mouseMove,
      controls: this._controls,
      gui: this._gui,
    });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();

    this._preloader.setAssetsToPreload([
      { src: officeSrc, type: 'model3d' },
      { src: render1Src.src, type: 'image' },
      { src: render2Src.src, type: 'image' },
      { src: render3Src.src, type: 'image' },
    ]);
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
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._camera.updateProjectionMatrix();

    this._experienceScene.setRendererBounds(rendererBounds);
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
  };

  _onAssetsLoaded = () => {
    this._setShouldRevealReact(true);
    console.log(this._preloader.loadedAssets);
    // this._experienceScene.animateIn();
    // this._experienceScene.setCameraModel(
    //   this._preloader.mediaItems[cameraSrc].item as GLTF,
    //   this._preloader.mediaItems[matcapSrc.src].item as THREE.Texture
    // );
  };

  _addListeners() {
    window.addEventListener('resize', this._onResizeDebounced);
    window.addEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.addEventListener('loaded', this._onAssetsLoaded);
  }

  _removeListeners() {
    window.removeEventListener('resize', this._onResizeDebounced);
    window.removeEventListener('visibilitychange', this._onVisibilityChange);
    this._preloader.removeEventListener('loaded', this._onAssetsLoaded);
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

    TWEEN.update(time);

    const delta = time - this._lastFrameTime;
    let slowDownFactor = delta / sharedValues.motion.DT_FPS;

    //Rounded slowDown factor to the nearest integer reduces physics lags
    const slowDownFactorRounded = Math.round(slowDownFactor);

    if (slowDownFactorRounded >= 1) {
      slowDownFactor = slowDownFactorRounded;
    }
    this._lastFrameTime = time;

    this._mouseMove.update();
    this._scroll.update({ delta, slowDownFactor, time });
    this._experienceScene.update({ delta, slowDownFactor, time });
    this._controls.update();

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
  }
}
