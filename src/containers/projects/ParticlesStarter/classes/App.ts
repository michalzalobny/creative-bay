import * as THREE from 'three';
import debounce from 'lodash.debounce';
import GUI from 'lil-gui';
import { OrbitControls } from 'three-stdlib';

import { sharedValues } from 'utils/sharedValues';
import { Preloader } from 'utils/helperClasses/Preloader';

import { ExperienceScene } from './Scenes/ExperienceScene';
import { appState } from '../Project.state';
//Assets imports
import particleMask from './assets/mask1.webp';

interface Constructor {
	rendererEl: HTMLDivElement;
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
	_pixelRatio = 1;
	_orbitControls: OrbitControls;

	constructor({ rendererEl }: Constructor) {
		super();
		this._rendererEl = rendererEl;
		this._canvas = document.createElement('canvas');
		this._rendererEl.appendChild(this._canvas);
		this._camera = new THREE.PerspectiveCamera();
		appState.gui = new GUI();
		appState.gui.title('Scene settings');

		this._renderer = new THREE.WebGLRenderer({
			canvas: this._canvas,
			antialias: true,
			alpha: true,
			powerPreference: 'default',
		});

		this._orbitControls = new OrbitControls(this._camera, this._rendererEl);
		this._orbitControls.enableDamping = true;
		this._orbitControls.enablePan = true;
		this._orbitControls.enableRotate = true;
		this._orbitControls.enableZoom = true;
		this._orbitControls.update();

		this._experienceScene = new ExperienceScene({ camera: this._camera });

		this._onResize();
		this._addListeners();
		this._resumeAppFrame();

		this._preloader.setAssetsToPreload([
			{
				src: particleMask.src,
				type: 'image',
				targetName: 'particleMask',
			},
		]);
	}

	_onResizeDebounced = debounce(() => this._onResize(), 300);

	_onResize() {
		const stageSize = this._rendererEl.getBoundingClientRect();
		const aspectRatio = stageSize.width / stageSize.height;
		this._camera.aspect = aspectRatio;

		//Set to match pixel size of the elements in three with pixel size of DOM elements
		this._camera.position.z = 1000;
		this._camera.fov =
			2 * Math.atan(stageSize.height / 2 / this._camera.position.z) * (180 / Math.PI);

		this._renderer.setSize(stageSize.width, stageSize.height);
		this._pixelRatio = Math.min(window.devicePixelRatio, 2);
		this._renderer.setPixelRatio(this._pixelRatio);
		this._camera.updateProjectionMatrix();
		this._experienceScene.setPixelRatio(this._pixelRatio);
		this._experienceScene.setStageSize(stageSize);
	}

	_onVisibilityChange = () => {
		if (document.hidden) {
			this._stopAppFrame();
		} else {
			this._resumeAppFrame();
		}
	};

	_onAssetsLoaded = (e: THREE.Event) => {
		this._rendererEl.style.opacity = '1';
		this._experienceScene.setLoadedAssets((e.target as Preloader).loadedAssets);
	};

	_onPreloaderProgress = (e: THREE.Event) => {
		// console.log(e.progress);
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
		appState.gui?.destroy();
		appState.gui = null;
	}
}
