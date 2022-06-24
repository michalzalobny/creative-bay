import TWEEN from '@tweenjs/tween.js';
import debounce from 'lodash.debounce';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { Scroll } from 'utils/helperClasses/Scroll';
import { sharedValues } from 'utils/sharedValues';

import { Cursor2D } from './Components/Cursor2D';

interface Constructor {
  rendererEl: HTMLDivElement;
}

export class CanvasApp {
  _rendererEl: HTMLDivElement;
  _rafId: number | null = null;
  _isResumed = true;
  _lastFrameTime: number | null = null;
  _canvas: HTMLCanvasElement;
  _mouseMove = MouseMove.getInstance();
  _scroll = Scroll.getInstance();
  _pixelRatio = 1;
  cursor2D = new Cursor2D();

  constructor({ rendererEl }: Constructor) {
    this._rendererEl = rendererEl;
    this._canvas = document.createElement('canvas');
    this._rendererEl.appendChild(this._canvas);

    this._onResize();
    this._addListeners();
    this._resumeAppFrame();
  }

  _onResizeDebounced = debounce(() => this._onResize(), 300);

  _onResize() {
    const rendererBounds = this._rendererEl.getBoundingClientRect();
    this._pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.cursor2D.setPixelRatio(this._pixelRatio);
    this.cursor2D.setRendererBounds(rendererBounds);
  }

  _onVisibilityChange = () => {
    if (document.hidden) {
      this._stopAppFrame();
    } else {
      this._resumeAppFrame();
    }
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
    this.cursor2D.update({ delta, slowDownFactor, time });
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

    this.cursor2D.destroy();
  }
}
