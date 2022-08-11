import debounce from 'lodash.debounce';
import GUI from 'lil-gui';

import { sharedValues } from 'utils/sharedValues';
import { Bounds } from 'utils/sharedTypes';

import { Experience } from './Experience';

interface Constructor {
  rendererEl: HTMLDivElement;
  setShouldReveal: React.Dispatch<React.SetStateAction<boolean>>;
}

export class App {
  _rendererEl: HTMLDivElement;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement;
  _setShouldRevealReact: React.Dispatch<React.SetStateAction<boolean>>;
  _gui = new GUI();
  _pixelRatio = 1;
  _gl: WebGL2RenderingContext | null;
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _experience: Experience;

  constructor({ setShouldReveal, rendererEl }: Constructor) {
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);

    this._gl = this._canvas.getContext('webgl2');
    if (!this._gl) {
      console.error('WebGL2 is not supported in this browser, try using newer version');
    }
    this._experience = new Experience({ gl: this._gl });
    this._setShouldRevealReact = setShouldReveal;

    this._gui.title('Scene settings');

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();
    this._onAssetsLoaded();
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    this._rendererBounds = this._rendererEl.getBoundingClientRect();
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
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
  };

  _addListeners() {
    window.addEventListener('resize', this._onResizeDebounced);
    window.addEventListener('visibilitychange', this._onVisibilityChange);
  }

  _removeListeners() {
    window.removeEventListener('resize', this._onResizeDebounced);
    window.removeEventListener('visibilitychange', this._onVisibilityChange);
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
    this._experience.destroy();
    this._stopAppFrame();
    this._removeListeners();

    this._gui.destroy();
  }
}
