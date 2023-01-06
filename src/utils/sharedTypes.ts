import { GLTF } from 'three-stdlib';

import { HeadProps } from 'seo/Head/Head';

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

export enum AssetType {
  MODEL3D = 'model3d',
  VIDEO = 'video',
  IMAGE = 'image',
  CUBE_TEXTURE = 'cube_texture',
}

export interface LoadedAsset {
  type: AssetType.IMAGE | AssetType.MODEL3D | AssetType.VIDEO | AssetType.CUBE_TEXTURE;
  asset: THREE.Texture | GLTF | null;
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
  type: 'model3d' | 'image' | 'video' | 'cube_texture';
  targetName?: string;
}

export interface AnimateCamera {
  lookAt?: THREE.Vector3;
  position: THREE.Vector3;
  duration?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface PageProps {
  head: HeadProps;
  inspirationName?: string;
  inspirationHref?: string;
  repoHref?: string;
}

export const emptySSRRect: DomRectSSR = {
  bottom: 1,
  height: 1,
  left: 1,
  right: 1,
  top: 1,
  width: 1,
  x: 1,
  y: 1,
};
