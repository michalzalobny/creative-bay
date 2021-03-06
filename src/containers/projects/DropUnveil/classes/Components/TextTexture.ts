import * as THREE from 'three';
import TWEEN, { Tween } from '@tweenjs/tween.js';

import { breakpoints } from 'utils/media';
import { UpdateInfo, Bounds } from 'utils/sharedTypes';

interface Constructor {
  text: [string, string, string];
  offsetsArray: [number, number, number, number, number, number];
  isAnimatedIn: boolean;
}

export class TextTexture extends THREE.EventDispatcher {
  _rendererBounds: Bounds = { width: 1, height: 1 };
  _canvas: HTMLCanvasElement;
  _ctx: CanvasRenderingContext2D | null;
  texture: THREE.Texture;
  _text1: string;
  _text2: string;
  _text3: string;
  _show = 0;
  _showTween: Tween<{ progress: number }> | null = null;
  _offsetsArray;

  constructor({ text, offsetsArray, isAnimatedIn }: Constructor) {
    super();
    this._text1 = text[0];
    this._text2 = text[1];
    this._text3 = text[2];
    this._offsetsArray = offsetsArray;
    if (isAnimatedIn) {
      this._show = 1;
    }

    this._canvas = document.createElement('canvas');
    this._ctx = this._canvas.getContext('2d');
    this.texture = new THREE.Texture(this._canvas);
  }

  _setSizes() {
    if (this._canvas && this._ctx) {
      const w = this._rendererBounds.width;
      const h = this._rendererBounds.height;
      const ratio = Math.min(window.devicePixelRatio, 2);

      this._canvas.width = w * ratio;
      this._canvas.height = h * ratio;
      this._canvas.style.width = `${w}px`;
      this._canvas.style.height = `${h}px`;
      this._ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  _animateShow(destination: number) {
    if (this._showTween) {
      this._showTween.stop();
    }

    this._showTween = new TWEEN.Tween({
      progress: this._show,
    })
      .to({ progress: destination }, 1600)
      .delay(250)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate(obj => {
        this._show = obj.progress;
        this.texture.needsUpdate = true;
      });

    this._showTween.start();
  }

  animateIn() {
    this._animateShow(1);
  }

  setRendererBounds(bounds: Bounds) {
    this._rendererBounds = bounds;
    this._setSizes();
    this.texture.needsUpdate = true;
  }

  update(updateInfo: UpdateInfo) {
    if (!this._ctx) return;
    this._ctx.clearRect(0, 0, this._rendererBounds.width, this._rendererBounds.height);

    let fontSize = this._rendererBounds.width * 0.1;
    if (this._rendererBounds.width >= breakpoints.tablet) {
      fontSize = 100;
    }

    this._ctx.font = `${fontSize}px 'opensans'`;
    this._ctx.fillStyle = '#fff';
    this._ctx.textBaseline = 'top';

    const text1Size = this._ctx.measureText(this._text1);
    const offset1 = this._offsetsArray[0];
    const text1Height = text1Size.actualBoundingBoxAscent + text1Size.actualBoundingBoxDescent;

    const text2Size = this._ctx.measureText(this._text2);
    const offset2 = this._offsetsArray[1];

    const text3Size = this._ctx.measureText(this._text3);
    const offset3 = this._offsetsArray[2];

    const lineHeightOffset = 0.32 * fontSize;
    const signatureHeight = lineHeightOffset * 2 + text1Height * 3;
    const verticalOffset = this._rendererBounds.height / 2 - signatureHeight / 2;
    const animateX = (1 - this._show) * this._rendererBounds.width * 0.11;

    this._ctx.fillText(
      this._text1,
      this._rendererBounds.width / 2 - text1Size.width / 2 + text1Size.width * offset1 - animateX,
      verticalOffset + text1Height * this._offsetsArray[3]
    );

    this._ctx.fillText(
      this._text2,
      this._rendererBounds.width / 2 - text2Size.width / 2 + text2Size.width * offset2 + animateX,
      verticalOffset + text1Height + lineHeightOffset + text1Height * this._offsetsArray[4]
    );

    this._ctx.fillText(
      this._text3,
      this._rendererBounds.width / 2 - text3Size.width / 2 + text3Size.width * offset3 - animateX,
      verticalOffset + text1Height * 2 + lineHeightOffset * 2 + text1Height * this._offsetsArray[5]
    );
  }

  destroy() {
    if (this._showTween) {
      this._showTween.stop();
    }
    this.texture.dispose();
  }
}
