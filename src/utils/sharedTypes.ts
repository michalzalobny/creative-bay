import { GLTF } from 'three-stdlib';

export interface DomRectSSR {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
}

export interface UpdateInfo {
  slowDownFactor: number;
  delta: number;
  time: number;
}

export interface LoadedAsset {
  asset: THREE.Texture | GLTF;
  naturalWidth: number;
  naturalHeight: number;
}

export type LoadedAssets = Record<string, LoadedAsset>;

export interface AnimateProps {
  duration?: number;
  delay?: number;
  destination: number;
  easing?: (amount: number) => number;
}

export interface Bounds {
  width: number;
  height: number;
}

interface Coords {
  x: number;
  y: number;
}

export interface Mouse {
  current: Coords;
  target: Coords;
}

export interface AssetToPreload {
  src: string;
  type: 'model3d' | 'image' | 'video';
}
