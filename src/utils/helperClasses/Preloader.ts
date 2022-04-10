import { EventDispatcher } from 'three';
import * as THREE from 'three';
import { GLTFLoader, GLTF, DRACOLoader } from 'three-stdlib';

import { LoadedAssets, AssetToPreload } from 'utils/sharedTypes';

export class Preloader extends EventDispatcher {
  _assetsLoadedCounter = 0;
  _dracoLoader = new DRACOLoader();
  _gltfLoader = new GLTFLoader();
  _assetsToPreload: AssetToPreload[] = [];
  loadedAssets: LoadedAssets = {};

  constructor() {
    super();
    this._dracoLoader.setDecoderPath('/draco/');
    this._gltfLoader.setDRACOLoader(this._dracoLoader);
  }

  _preloadTextures() {
    if (this._assetsToPreload.length === 0) {
      return this._onLoadingComplete();
    }
    this._assetsToPreload.forEach(item => {
      switch (item.type) {
        case 'image': {
          const texture = new THREE.Texture();
          const image = new window.Image();
          image.crossOrigin = 'anonymous';
          image.src = item.src;
          image.onload = () => {
            texture.image = image;
            texture.needsUpdate = true;
            this.loadedAssets[item.src] = {
              asset: texture,
              naturalWidth: image.naturalWidth,
              naturalHeight: image.naturalHeight,
            };
            this._onAssetLoaded();
          };
          break;
        }
        case 'video': {
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
            this.loadedAssets[item.src] = {
              asset: texture,
              naturalWidth: video.videoWidth,
              naturalHeight: video.videoHeight,
            };
            this._onAssetLoaded();
          };
          break;
        }
        case 'model3d': {
          this._gltfLoader.load(
            item.src,
            (gltf: GLTF) => {
              this.loadedAssets[item.src] = {
                asset: gltf,
                naturalWidth: 1,
                naturalHeight: 1,
              };

              this._onAssetLoaded();
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
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

    const loadRatio = this._assetsLoadedCounter / this._assetsToPreload.length;

    if (loadRatio === 1) {
      this._onLoadingComplete();
    }
  }

  _onLoadingComplete() {
    this.dispatchEvent({ type: 'loaded' });
  }

  setAssetsToPreload(items: AssetToPreload[]) {
    this._assetsToPreload = items;
    this._preloadTextures();
  }
}
