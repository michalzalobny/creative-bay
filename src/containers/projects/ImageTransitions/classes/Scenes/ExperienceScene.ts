import * as THREE from 'three';
import GUI from 'lil-gui';

import { UpdateInfo, LoadedAssets, Bounds, EmptySSRRect } from 'utils/sharedTypes';
import {
  ScrollValues,
  defaultScrollValues,
  getElementScrollOffsets,
} from 'utils/functions/getScrollOffsets';
import { lerp } from 'utils/functions/lerp';

import { InteractiveScene } from './InteractiveScene';
import { Image3D } from '../Components/Image3D';
import { dataArray } from '../../Project.data';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  static scrollLerp = 0.15;
  _images3D: Image3D[] = [];
  _planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  _loadedAssets: LoadedAssets | null = null;

  _scrollContainerEl: HTMLElement | null = null;
  _scrollContainerContentEl: HTMLElement | null = null;
  _scrollMockWrapperEl: HTMLElement | null = null;
  _shouldScrollEls: HTMLElement[] = [];

  _scrollMockWrapperElRect = EmptySSRRect;

  _scrollValues: ScrollValues = defaultScrollValues;

  _scrollProgress = {
    current: 0,
    target: 0,
  };

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._getHTMLElements();
    this._addListeners();
  }

  _getHTMLElements() {
    this._scrollContainerEl = document.querySelector(
      `[data-itransition="scrollContainer"]`
    ) as HTMLElement;

    this._scrollContainerContentEl = document.querySelector(
      `[data-itransition="scrollContainerContent"]`
    ) as HTMLElement;

    this._scrollMockWrapperEl = document.querySelector(
      `[data-itransition="scrollMockWrapper"]`
    ) as HTMLElement;

    this._shouldScrollEls = Array.from(
      document.querySelectorAll(`[data-itransition="shouldScroll"]`)
    );

    this._updateRectSizes();
  }

  _updateRectSizes() {
    if (!this._scrollMockWrapperEl) return;
    this._scrollMockWrapperElRect = this._scrollMockWrapperEl.getBoundingClientRect();
    this._syncScrollContainerHeight();
  }

  _syncScrollContainerHeight() {
    if (!this._scrollContainerContentEl) return;
    this._scrollContainerContentEl.style.height =
      this._scrollMockWrapperElRect.height.toString() + 'px';
  }

  _updateScrollValues = () => {
    if (!this._scrollContainerEl) return;
    this._scrollValues = getElementScrollOffsets(this._scrollContainerEl);
  };

  _calculateProgress() {
    const progress = this._scrollValues.yOffset / this._scrollValues.yMaxOffset; //[0-1]
    if (!isNaN(progress)) this._scrollProgress.target = progress;
  }

  _handleScroll = () => {
    this._updateScrollValues();
    this._calculateProgress();
  };

  _addListeners() {
    super._addListeners();
    this._scrollContainerEl?.addEventListener('scroll', this._handleScroll, { passive: true });
  }

  _removeListeners() {
    this._scrollContainerEl?.removeEventListener('scroll', this._handleScroll);
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._updateRectSizes();
    this._handleScroll();

    this._images3D.forEach(el => {
      el.setRendererBounds(bounds);
    });
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;

    dataArray.forEach(el => {
      const image3D = new Image3D({
        fragmentShader: el.fragmentShader,
        elId: el.elId,
        gui: this._gui,
        geometry: this._planeGeometry,
      });
      this._images3D.push(image3D);
      this.add(image3D);
    });

    this._images3D.forEach(el => {
      const dataEntry = dataArray.find(item => item.elId === el._elId);
      if (!dataEntry || !this._loadedAssets) return;

      const asset1 = this._loadedAssets[dataEntry.img1Src];
      const asset2 = this._loadedAssets[dataEntry.img2Src];

      el.setAssets(asset1, asset2);
    });

    this.setRendererBounds(this._rendererBounds);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._scrollProgress.current = lerp(
      this._scrollProgress.current,
      this._scrollProgress.target,
      ExperienceScene.scrollLerp * updateInfo.slowDownFactor
    );

    const offsetY = -this._scrollProgress.current * this._scrollValues.yMaxOffset;

    this._shouldScrollEls.forEach(el => {
      el.style.transform = `translate3d(0,${offsetY}px,0)`;
    });

    this._images3D.forEach(el => {
      el.update(updateInfo, offsetY);
    });
  }

  destroy() {
    super.destroy();
    this._removeListeners();

    this._images3D.forEach(el => {
      el.destroy();
      this.remove(el);
    });

    this._planeGeometry.dispose();
  }
}
