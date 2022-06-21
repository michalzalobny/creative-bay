import { EventDispatcher } from 'three';
import * as THREE from 'three';
import { GLTFLoader, GLTF, DRACOLoader } from 'three-stdlib';

import { disposeModel } from 'utils/functions/disposeModel';
import { LoadedAssets, AssetToPreload, AssetType } from 'utils/sharedTypes';

export class Preloader extends EventDispatcher {
  _assetsLoadedCounter = 0;
  _dracoLoader = new DRACOLoader();
  _gltfLoader = new GLTFLoader();
  assetsToPreload: AssetToPreload[] = [];
  loadedAssets: LoadedAssets = {};

  constructor() {
    super();
    this._dracoLoader.setDecoderPath('/draco/');
    this._gltfLoader.setDRACOLoader(this._dracoLoader);
  }

  _preloadTextures() {
    if (this.assetsToPreload.length === 0) {
      return this._onLoadingComplete();
    }
    this.assetsToPreload.forEach(item => {
      switch (item.type) {
        case AssetType.IMAGE: {
          const texture = new THREE.Texture();
          const image = new window.Image();
          image.crossOrigin = 'anonymous';
          image.src = item.src;

          const onLoad = () => {
            texture.image = image;
            texture.needsUpdate = true;
            this.loadedAssets[item.targetName || item.src] = {
              type: AssetType.IMAGE,
              asset: texture,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
            };
            this._onAssetLoaded();
          };

          if (image.complete) {
            onLoad();
            break;
          }

          image.onload = onLoad;
          break;
        }
        case AssetType.VIDEO: {
          const video = document.createElement('video');
          video.crossOrigin = 'anonymous';
          video.muted = true;
          video.loop = true;
          video.controls = true;
          video.playsInline = true;
          video.autoplay = true;
          video.src = item.src;
          void video.play();

          video.oncanplay = () => {
            const texture = new THREE.VideoTexture(video);
            this.loadedAssets[item.targetName || item.src] = {
              type: AssetType.VIDEO,
              asset: texture,
              naturalWidth: video.videoWidth,
              naturalHeight: video.videoHeight,
            };
            this._onAssetLoaded();
          };
          break;
        }
        case AssetType.MODEL3D: {
          this._gltfLoader.load(
            item.src,
            (gltf: GLTF) => {
              this.loadedAssets[item.targetName || item.src] = {
                type: AssetType.MODEL3D,
                asset: gltf,
                naturalWidth: 1,
                naturalHeight: 1,
              };

              this._onAssetLoaded();
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
            progress => {},
            error => {
              console.warn('3D model loading failed', error);
              this._onAssetLoaded();
            }
          );
          break;
        }
        default:
          break;
      }
    });
  }

  _onAssetLoaded() {
    this._assetsLoadedCounter += 1;

    const loadRatio = this._assetsLoadedCounter / this.assetsToPreload.length;

    this.dispatchEvent({ type: 'progress', progress: loadRatio });

    if (loadRatio === 1) {
      this._onLoadingComplete();
    }
  }

  _onLoadingComplete() {
    this.dispatchEvent({ type: 'loaded' });
  }

  setAssetsToPreload(items: AssetToPreload[]) {
    this.assetsToPreload = items;
    this._preloadTextures();
  }

  destroy() {
    Object.entries(this.loadedAssets).forEach(el => {
      switch (el[1].type) {
        case AssetType.IMAGE:
          (el[1].asset as THREE.Texture).dispose();
          break;
        case AssetType.VIDEO:
          (el[1].asset as THREE.VideoTexture).dispose();
          break;
        case AssetType.MODEL3D:
          (el[1].asset as GLTF).scenes.forEach(scene => {
            disposeModel(scene);
          });
          break;
        default:
          break;
      }
    });
  }
}
