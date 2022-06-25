import TWEEN, { Tween } from '@tweenjs/tween.js';

import { Bounds, UpdateInfo } from 'utils/sharedTypes';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { lerp } from 'utils/functions/lerp';

export class Cursor2D {
  static mouseLerp = 0.15;

  _mouseMove = MouseMove.getInstance();
  _canvas: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D | null;
  _hoverProgress = 0;
  _hoverProgressTween: Tween<{ progress: number }> | null = null;
  _color = '#ffffff';
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
  _radius = 35;
  _extraRadius = 15;
  _showProgress = 0;
  _showProgressTween: Tween<{ progress: number }> | null = null;
  _isCircleInit = false;
  _pixelRatio = 1;
  _isVisible = false;

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

  _animateShow(destination: number) {
    if (this._showProgressTween) {
      this._showProgressTween.stop();
    }

    this._showProgressTween = new TWEEN.Tween({
      progress: this._showProgress,
    })
      .to({ progress: destination }, 1000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._showProgress = obj.progress;
      });

    this._showProgressTween.start();
  }

  _animateHover(destination: number) {
    if (this._hoverProgressTween) {
      this._hoverProgressTween.stop();
    }

    this._hoverProgressTween = new TWEEN.Tween({
      progress: this._hoverProgress,
    })
      .to({ progress: destination }, 1000)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._hoverProgress = obj.progress;
      });

    this._hoverProgressTween.start();
  }

  _onMouseMove = (e: THREE.Event) => {
    const mouseX = (e.target as MouseMove).mouse.x;
    const mouseY = (e.target as MouseMove).mouse.y;

    this._mouse.x.target = (mouseX / this._rendererBounds.width) * 2 - 1; //[-1 to 1] [left to right]
    this._mouse.y.target = -(mouseY / this._rendererBounds.height) * 2 + 1; //[-1 to 1] [bottom to top]
  };

  _onMouseMoveInternal = () => {
    if (!this._isVisible) return;
    if (!this._isCircleInit) {
      this._isCircleInit = true;
      this._animateShow(1);
    }
  };

  _onMouseOut = (event: MouseEvent) => {
    if (!this._isVisible) return;
    if (
      event.clientY <= 0 ||
      event.clientX <= 0 ||
      event.clientX >= this._rendererBounds.width ||
      event.clientY >= this._rendererBounds.height
    ) {
      this._animateShow(0);
    }
  };

  _onMouseEnter = () => {
    if (!this._isVisible) return;
    this._animateShow(1);
  };

  _addListeners() {
    this._mouseMove.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('mouseenter', this._onMouseEnter);
    document.addEventListener('mouseleave', this._onMouseOut);
    document.addEventListener('mousemove', this._onMouseMoveInternal);
  }

  _removeListeners() {
    this._mouseMove.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseenter', this._onMouseEnter);
    document.removeEventListener('mouseleave', this._onMouseOut);
    document.removeEventListener('mousemove', this._onMouseMoveInternal);
  }

  _draw() {
    if (!this._ctx) return;

    const x = (this._mouse.x.current + 1) * 0.5 * this._rendererBounds.width;
    const y = (1 - (this._mouse.y.current + 1) * 0.5) * this._rendererBounds.height;

    this._ctx.beginPath();
    this._ctx.arc(
      x,
      y,
      (this._radius + this._extraRadius * this._hoverProgress) * this._showProgress,
      0,
      2 * Math.PI
    );
    this._ctx.strokeStyle = 'rgba(255,255,255, 1)';
    this._ctx.lineWidth = 2;
    this._ctx.stroke();
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
      Cursor2D.mouseLerp * updateInfo.slowDownFactor
    );

    this._mouse.y.current = lerp(
      this._mouse.y.current,
      this._mouse.y.target,
      Cursor2D.mouseLerp * updateInfo.slowDownFactor
    );
  }

  setRendererBounds(rendererBounds: Bounds) {
    this._rendererBounds = rendererBounds;
    this._setSizes();
  }

  destroy() {
    this._removeListeners();
  }

  zoomIn() {
    this._animateHover(1);
  }

  zoomOut() {
    this._animateHover(0);
  }

  hide() {
    this._isVisible = false;
    this._animateShow(0);
  }

  show() {
    this._isVisible = true;
    this._animateShow(1);
  }
}
