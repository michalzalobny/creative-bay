import TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import debounce from 'lodash.debounce';
import {
  OrbitControls,
  UnrealBloomPass,
  GammaCorrectionShader,
  ShaderPass,
  TrackballControls,
} from 'three-stdlib';
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
  _orbitControls: OrbitControls;
  _trackballControls: TrackballControls;
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

    this._camera.position.z = 4;
    this._camera.position.x = -2.5;
    this._camera.position.y = 1;

    this._setShouldRevealReact = setShouldReveal;

    this._renderer = new THREE.WebGLRenderer({
      canvas: this._canvas,
      antialias: false,
      alpha: false,
    });

    this._renderer.setClearColor(0xffffff);

    //https://github.com/mrdoob/three.js/issues/13080 - Smooth zooming solution
    this._orbitControls = new OrbitControls(this._camera, this._rendererEl);
    this._orbitControls.enabled = false;
    this._orbitControls.enableDamping = true;
    this._orbitControls.dampingFactor = 0.05;
    this._orbitControls.screenSpacePanning = true;
    this._orbitControls.enableZoom = false;
    this._orbitControls.rotateSpeed = 0.5;
    this._orbitControls.minPolarAngle = 0; // radians
    this._orbitControls.maxPolarAngle = Math.PI / 2; // radians

    this._trackballControls = new TrackballControls(this._camera, this._renderer.domElement);
    this._trackballControls.enabled = false;
    this._trackballControls.noRotate = true;
    this._trackballControls.noPan = true;
    this._trackballControls.noZoom = false;
    this._trackballControls.zoomSpeed = 0.2;
    this._trackballControls.maxDistance = 12;
    this._trackballControls.dynamicDampingFactor = 0.05; // set dampening factor

    this._gui.title('Scene settings');
    this._experienceScene = new ExperienceScene({
      camera: this._camera,
      mouseMove: this._mouseMove,
      gui: this._gui,
      postProcess: this._postProcess,
      trackballControls: this._trackballControls,
      orbitControls: this._orbitControls,
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
      aperture: 0.001 * 0.8,
      maxblur: 0.005 * 1.2,
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

    const target = this._orbitControls.target;
    //Restricts the panning Y
    if (target.y <= 1.3) {
      this._orbitControls.target.set(target.x, 1.3, target.z);
    }
    this._orbitControls.update();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this._trackballControls['target'].set(target.x, target.y, target.z);

    this._trackballControls.update();

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

    this._experienceScene.destroy();
    this._orbitControls?.dispose();
    this._trackballControls?.dispose();
    if (this._postProcess.composer) this._postProcess.composer.renderTarget1.dispose();
    if (this._postProcess.composer) this._postProcess.composer.renderTarget2.dispose();
  }
}
