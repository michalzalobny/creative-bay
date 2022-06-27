import TWEEN, { Tween } from '@tweenjs/tween.js';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { lerp } from 'utils/functions/lerp';

export class Cursor2D {
  static mouseLerp = 0.15;
  static radiusDefault = 8;
  static fontSize = 12;
  static textShowDuration = 500;

  _mouseMove = MouseMove.getInstance();
  _canvas: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D | null;
  _rendererBounds: Bounds = { height: 10, width: 100 };
  _mouse = {
    x: {
      target: 0,
      current: 0,
    },
    y: {
      target: 0,
      current: 0,
    },
  };
  _circle = {
    radius: 0,
  };
  _textValue = '';
  _destinationTextValue = '';
  _pixelRatio = 1;
  _animateCurrentTextId: ReturnType<typeof setTimeout> | null = null;

  _showProgress = 0;
  _showProgressTween: Tween<{ progress: number }> | null = null;

  _textShowProgress = 0;
  _textShowProgressTween: Tween<{ progress: number }> | null = null;

  _zoomProgress = 0;
  _zoomProgressTween: Tween<{ progress: number }> | null = null;

  _lerpSpeedProgress = 1;
  _lerpSpeedProgressTween: Tween<{ progress: number }> | null = null;

  constructor() {
    this._canvas = document.createElement('canvas');
    this._canvas.className = 'circle-cursor';
    this._ctx = this._canvas.getContext('2d');
    document.body.appendChild(this._canvas);

    this._addListeners();
  }

  setPixelRatio(ratio: number) {
    this._pixelRatio = ratio;
  }

  _setSizes() {
    if (this._ctx) {
      const w = this._rendererBounds.width;
      const h = this._rendererBounds.height;

      this._canvas.width = w * this._pixelRatio;
      this._canvas.height = h * this._pixelRatio;
      this._canvas.style.width = w.toString() + 'px';
      this._canvas.style.height = h.toString() + 'px';
      this._ctx.setTransform(this._pixelRatio, 0, 0, this._pixelRatio, 0, 0);
    }
  }

  _onMouseMove = (e: THREE.Event) => {
    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    this._mouse.x.target = (mouseX / this._rendererBounds.width) * 2 - 1; //[-1 to 1] [left to right]
    this._mouse.y.target = -(mouseY / this._rendererBounds.height) * 2 + 1; //[-1 to 1] [bottom to top]
  };

  _animateShow(destination: number) {
    if (this._showProgressTween) this._showProgressTween.stop();
    this._showProgressTween = new TWEEN.Tween({
      progress: this._showProgress,
    })
      .to({ progress: destination }, 600)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(obj => {
        this._showProgress = obj.progress;
      });
    this._showProgressTween.start();
  }

  _animateTextShow(destination: number) {
    if (this._textShowProgressTween) this._textShowProgressTween.stop();
    this._textShowProgressTween = new TWEEN.Tween({
      progress: this._textShowProgress,
    })
      .to({ progress: destination }, Cursor2D.textShowDuration)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(obj => {
        this._textShowProgress = obj.progress;
      });

    this._textShowProgressTween.start();
  }

  _animateZoom(destination: number) {
    if (this._zoomProgressTween) this._zoomProgressTween.stop();
    this._zoomProgressTween = new TWEEN.Tween({
      progress: this._zoomProgress,
    })
      .to({ progress: destination }, 800)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._zoomProgress = obj.progress;
      });
    this._zoomProgressTween.start();
  }

  _animateLerpSpeed(destination: number) {
    if (this._lerpSpeedProgressTween) this._lerpSpeedProgressTween.stop();
    this._lerpSpeedProgressTween = new TWEEN.Tween({
      progress: this._lerpSpeedProgress,
    })
      .to({ progress: destination }, 800)
      .easing(TWEEN.Easing.Sinusoidal.InOut)
      .onUpdate(obj => {
        this._lerpSpeedProgress = obj.progress;
      });
    this._lerpSpeedProgressTween.start();
  }

  _setTextTimeout = () => {
    this._textValue = this._destinationTextValue;
    this._animateTextShow(1);
  };

  setCurrentText(text: string) {
    this._destinationTextValue = text;
    if (this._animateCurrentTextId) clearTimeout(this._animateCurrentTextId);
    if (this._textValue === '') {
      this._textShowProgress = 0;
      this._setTextTimeout();
    } else {
      this._animateTextShow(0);
      this._animateCurrentTextId = setTimeout(this._setTextTimeout, Cursor2D.textShowDuration);
    }
  }

  _zoomIn() {
    this._animateZoom(1);
  }

  _zoomOut() {
    this._animateZoom(0);
  }

  _animateIn() {
    this._animateShow(1);
  }

  _animateOut() {
    this._animateShow(0);
  }

  _addListeners() {
    this._mouseMove.addEventListener('mousemove', this._onMouseMove);
  }

  _removeListeners() {
    this._mouseMove.removeEventListener('mousemove', this._onMouseMove);
  }

  _draw() {
    if (!this._ctx) return;

    const x = (this._mouse.x.current + 1) * 0.5 * this._rendererBounds.width;
    const y = (1 - (this._mouse.y.current + 1) * 0.5) * this._rendererBounds.height;

    this._ctx.beginPath();
    this._ctx.arc(
      x,
      y,
      Cursor2D.radiusDefault * this._showProgress +
        Cursor2D.radiusDefault * 1.2 * this._zoomProgress * this._showProgress,
      0,
      2 * Math.PI
    );

    //Full circle
    this._ctx.fillStyle = 'rgba(255,255,255, 1)';
    this._ctx.fill();

    this._ctx.font = `${Cursor2D.fontSize}px opensans`;
    this._ctx.fillStyle = `rgba(255,255,255,${
      this._textShowProgress * this._showProgress * (1 - this._zoomProgress)
    })`;
    this._ctx.textAlign = 'center';
    this._ctx.fillText(
      this._textValue,
      x + 20 * (1 - this._textShowProgress * this._showProgress * (1 - this._zoomProgress)),
      y - Cursor2D.fontSize - Cursor2D.radiusDefault
    );
  }

  _clear() {
    if (!this._ctx) return;
    this._ctx.save();
    this._ctx.setTransform(1, 0, 0, 1, 0, 0);
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.restore();
  }

  update(updateInfo: UpdateInfo) {
    this._clear();
    this._draw();

    this._mouse.x.current = lerp(
      this._mouse.x.current,
      this._mouse.x.target,
      Cursor2D.mouseLerp * updateInfo.slowDownFactor * this._lerpSpeedProgress
    );

    this._mouse.y.current = lerp(
      this._mouse.y.current,
      this._mouse.y.target,
      Cursor2D.mouseLerp * updateInfo.slowDownFactor * this._lerpSpeedProgress
    );
  }

  setRendererBounds(rendererBounds: Bounds) {
    this._rendererBounds = rendererBounds;
    this._setSizes();
  }

  zoomIn() {
    void this._zoomIn();
  }

  zoomOut() {
    void this._zoomOut();
  }

  hide() {
    void this._animateOut();
  }

  show() {
    void this._animateIn();
  }

  slowLerp() {
    this._animateLerpSpeed(0.2);
  }

  speedLerp() {
    this._animateLerpSpeed(1);
  }

  destroy() {
    this._removeListeners();
    if (this._animateCurrentTextId) clearTimeout(this._animateCurrentTextId);
  }
}
