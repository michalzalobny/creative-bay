import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import debounce from 'lodash.debounce';
import { OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';
import { ShaderPass } from 'three-stdlib';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Scroll } from 'utils/helperClasses/Scroll';
import { sharedValues } from 'utils/sharedValues';
import { Preloader } from 'utils/helperClasses/Preloader';

import { ExperienceScene } from './Scenes/ExperienceScene';
import { DotScreenShader } from './assets/DotScreenShader';

interface Constructor {
  rendererEl: HTMLDivElement;
  setShouldReveal: React.Dispatch<React.SetStateAction<boolean>>;
  setProgressValue: React.Dispatch<React.SetStateAction<number>>;
}

interface PostProcess {
  renderPass: RenderPass | null;
  composer: EffectComposer | null;
  dotScreenShaderPass: ShaderPass | null;
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
  _orbitControls: OrbitControls;
  _experienceScene: ExperienceScene;
  _setShouldRevealReact: React.Dispatch<React.SetStateAction<boolean>>;
  _setProgressValueReact: React.Dispatch<React.SetStateAction<number>>;
  _gui = new GUI();
  _pixelRatio = 1;
  //Post process
  _postProcess: PostProcess = {
    renderPass: null,
    dotScreenShaderPass: null,
    composer: null,
  };

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
    });

    this._orbitControls = new OrbitControls(this._camera, this._rendererEl);
    this._orbitControls.enableDamping = true;
    this._orbitControls.update();

    this._gui.title('Scene settings');
    this._experienceScene = new ExperienceScene({
      camera: this._camera,
      mouseMove: this._mouseMove,
      controls: this._orbitControls,
      gui: this._gui,
      renderer: this._renderer,
    });

    this._onResize();

    this._setPostProcess();

    this._addListeners();
    this._resumeAppFrame();

    this._preloader.setAssetsToPreload([]);
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;

    //Set to match pixel size of the elements in three with pixel size of DOM elements
    this._camera.position.z = 800;
    this._camera.fov =
      2 * Math.atan(rendererBounds.height / 2 / this._camera.position.z) * (180 / Math.PI);

    this._renderer.setSize(rendererBounds.width, rendererBounds.height);
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
    this._renderer.setPixelRatio(this._pixelRatio);
    this._camera.updateProjectionMatrix();
    this._experienceScene.setPixelRatio(this._pixelRatio);
    this._experienceScene.setRendererBounds(rendererBounds);
    if (this._postProcess.composer) {
      this._postProcess.composer.setSize(rendererBounds.width, rendererBounds.height);
    }
  }

  _setPostProcess() {
    this._postProcess.composer = new EffectComposer(this._renderer);
    this._postProcess.renderPass = new RenderPass(this._experienceScene, this._camera);
    this._postProcess.dotScreenShaderPass = new ShaderPass(DotScreenShader);

    this._postProcess.composer.addPass(this._postProcess.renderPass);
    this._postProcess.composer.addPass(this._postProcess.dotScreenShaderPass);
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
    //animate in experience
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
    this._orbitControls.update();

    //Instead of this.renderer.render()...
    if (this._postProcess.composer) {
      this._postProcess.composer.render();
    }
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

    if (this._postProcess.composer) {
      this._postProcess.composer.renderTarget1.dispose();
      this._postProcess.composer.renderTarget2.dispose();
    }

    this._experienceScene.destroy();
    this._preloader.destroy();
    this._gui.destroy();
  }
}
