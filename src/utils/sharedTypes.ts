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

export interface RaymarchSettings {
  ro: THREE.Vector3;
  lookAt: THREE.Vector3;
  lightPos: THREE.Vector3;
  lightColor: [number, number, number];
  zoom: number;
  sphere: THREE.Vector3;
  sphere2: THREE.Vector3;
  sphereOffset: THREE.Vector3;
  sphere2Offset: THREE.Vector3;
  animateSpheres: boolean;
  box: THREE.Vector3;
  torus: THREE.Vector3;
  raySmooth: number;
  isCameraFocused: boolean;
}

export interface AnimateCamera {
  lookAt: THREE.Vector3;
  position: THREE.Vector3;
  duration?: number;
}
