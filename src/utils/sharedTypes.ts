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

export interface MediaItem {
  item: THREE.Texture | GLTF;
  naturalWidth: number;
  naturalHeight: number;
}

export type MediaItems = Record<string, MediaItem>;

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

interface PreloadItem {
  src: string;
  type: string;
}

export type PreloadItems = (PreloadItem | null)[];
