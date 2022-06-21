import { EventDispatcher } from 'three';
import * as THREE from 'three';
import { GLTFLoader, GLTF, DRACOLoader } from 'three-stdlib';

import { disposeModel } from 'utils/functions/disposeModel';
import { LoadedAssets, AssetToPreload, AssetType, LoadedAsset } from 'utils/sharedTypes';

interface AssignAsset extends LoadedAsset {
  objPropertyName: string;
}

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

  _assignAsset(props: AssignAsset) {
    const { asset, naturalHeight, naturalWidth, objPropertyName, type } = props;
    this.loadedAssets[objPropertyName] = {
      type,
      asset,
      naturalWidth,
      naturalHeight,
    };
    this._onAssetLoaded();
  }

  _preloadTextures() {
    if (this._assetsToPreload.length === 0) {
      return this._onLoadingComplete();
    }

    const handleImageLoad = (item: AssetToPreload) => {
      const texture = new THREE.Texture();
      const image = new window.Image();
      image.crossOrigin = 'anonymous';
      image.src = item.src;

      const handleLoaded = () => {
        texture.image = image;
        texture.needsUpdate = true;
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
        });
      };
      if (image.complete) {
        return handleLoaded();
      }
      image.onload = () => {
        handleLoaded();
      };
      image.onerror = () => {
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.IMAGE,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load image at ${item.src}`);
      };
    };

    const handleVideoLoad = (item: AssetToPreload) => {
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
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: video.videoWidth,
          naturalHeight: video.videoHeight,
        });
      };
      video.onerror = () => {
        const texture = new THREE.VideoTexture(video);
        this._assignAsset({
          objPropertyName: item.targetName || item.src,
          type: AssetType.VIDEO,
          asset: texture,
          naturalWidth: 1,
          naturalHeight: 1,
        });
        console.error(`Failed to load video at ${item.src}`);
      };
    };

    const handleModel3DLoad = (item: AssetToPreload) => {
      this._gltfLoader.load(
        item.src,
        (gltf: GLTF) => {
          this._assignAsset({
            objPropertyName: item.targetName || item.src,
            type: AssetType.MODEL3D,
            asset: gltf,
            naturalWidth: 1,
            naturalHeight: 1,
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
        progress => {},
        error => {
          this._assignAsset({
            objPropertyName: item.targetName || item.src,
            type: AssetType.MODEL3D,
            asset: null,
            naturalWidth: 1,
            naturalHeight: 1,
          });
          console.error(`Failed to load 3D model at ${item.src} `, error);
        }
      );
    };

    this._assetsToPreload.forEach(item => {
      switch (item.type) {
        case AssetType.IMAGE: {
          handleImageLoad(item);
          break;
        }
        case AssetType.VIDEO: {
          handleVideoLoad(item);
          break;
        }
        case AssetType.MODEL3D: {
          handleModel3DLoad(item);
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

    this.dispatchEvent({ type: 'progress', progress: loadRatio });

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
