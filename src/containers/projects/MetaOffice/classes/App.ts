import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import debounce from 'lodash.debounce';
import { OrbitControls, UnrealBloomPass, GammaCorrectionShader, ShaderPass } from 'three-stdlib';
import GUI from 'lil-gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js';

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

export interface PostProcess {
  renderPass: RenderPass | null;
  bokehPass: BokehPass | null;
  unrealBloomPass: UnrealBloomPass | null;
  composer: EffectComposer | null;
  shaderPass: ShaderPass | null;
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
  //Post process
  _postProcess: PostProcess = {
    renderPass: null,
    bokehPass: null,
    unrealBloomPass: null,
    composer: null,
    shaderPass: null,
  };
  _renderTarget: THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget | null = null;

  constructor({ setShouldReveal, rendererEl }: Constructor) {
    super();
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);
    this._camera = new THREE.PerspectiveCamera();

    this._setShouldRevealReact = setShouldReveal;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: false,
      alpha: false,
    });

    this._renderer.setClearColor(0xffffff);

    this._controls = new OrbitControls(this._camera, this._rendererEl);
    this._controls.enabled = true;
    this._controls.screenSpacePanning = true;
    this._controls.zoomSpeed = 1.4;
    this._controls.enableDamping = true;

    this._controls.minPolarAngle = 0; // radians
    this._controls.maxPolarAngle = Math.PI / 2; // radians

    this._controls.update();

    this._gui.title('Scene settings');
    this._experienceScene = new ExperienceScene({
      camera: this._camera,
      mouseMove: this._mouseMove,
      controls: this._controls,
      gui: this._gui,
      postProcess: this._postProcess,
    });

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();
    this._setPostProcess();

    this._preloader.setAssetsToPreload([
      { src: officeSrc, type: 'model3d', targetName: 'officeSrc' },
      { src: render1Src.src, type: 'image', targetName: 'render1Src' },
      { src: render2Src.src, type: 'image', targetName: 'render2Src' },
      { src: render3Src.src, type: 'image', targetName: 'render3Src' },
    ]);
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    const aspectRatio = rendererBounds.width / rendererBounds.height;
    this._camera.aspect = aspectRatio;
    this._camera.position.z = 8;
    this._camera.position.x = 5.5;
    this._camera.position.y = 4.5;
    this._controls.target.set(0, 1.4, 0);

    this._renderer.setSize(rendererBounds.width, rendererBounds.height);
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._camera.updateProjectionMatrix();

    this._experienceScene.setRendererBounds(rendererBounds);
    if (this._postProcess.composer) {
      this._postProcess.composer.setSize(rendererBounds.width, rendererBounds.height);
    }
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
  };

  _setPostProcess() {
    this._postProcess.renderPass = new RenderPass(this._experienceScene, this._camera);
    this._postProcess.unrealBloomPass = new UnrealBloomPass(
      new THREE.Vector2(1024, 1024),
      0.05,
      10,
      10
    );

    this._postProcess.shaderPass = new ShaderPass(GammaCorrectionShader as THREE.ShaderMaterial);
    this._postProcess.bokehPass = new BokehPass(this._experienceScene, this._camera, {
      focus: 21.5,
      aperture: 0.001 * 1.1,
      maxblur: 0.005 * 1.4,
    });

    this._postProcess.composer = new EffectComposer(this._renderer);

    this._postProcess.composer.addPass(this._postProcess.renderPass);
    this._postProcess.composer.addPass(this._postProcess.unrealBloomPass);
    this._postProcess.composer.addPass(this._postProcess.shaderPass);
    this._postProcess.composer.addPass(this._postProcess.bokehPass);
  }

  _onAssetsLoaded = () => {
    this._setShouldRevealReact(true);
    this._experienceScene.setLoadedAssets(this._preloader.loadedAssets);
    this._experienceScene.animateIn();
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

    this._experienceScene.destroy();
    if (this._postProcess.composer) this._postProcess.composer.renderTarget1.dispose();
    if (this._postProcess.composer) this._postProcess.composer.renderTarget2.dispose();
  }
}
