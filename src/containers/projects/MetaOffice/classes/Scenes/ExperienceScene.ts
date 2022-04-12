import * as THREE from 'three';
import { GLTF, OrbitControls } from 'three-stdlib';
import GUI from 'lil-gui';

import { MouseMove } from 'utils/helperClasses/MouseMove';
import { UpdateInfo, LoadedAssets } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  mouseMove: MouseMove;
  controls: OrbitControls;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  _controls: OrbitControls;
  _loadedAssets: LoadedAssets | null = null;
  _blenderScene: THREE.Group | null = null;
  _bakedMaterial1: THREE.MeshBasicMaterial | null = null;
  _bakedMaterial2: THREE.MeshBasicMaterial | null = null;
  _bakedMaterial3: THREE.MeshBasicMaterial | null = null;
  _bakedMaterial4: THREE.MeshBasicMaterial | null = null;
  _lightMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });
  _glassMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
  });
  _glassDarkMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.3,
  });

  constructor({ gui, controls, camera, mouseMove }: Constructor) {
    super({ camera, mouseMove, gui });
    this._controls = controls;
  }

  setLoadedAssets(assets: LoadedAssets) {
    this._loadedAssets = assets;
    this._blenderScene = (this._loadedAssets['officeSrc'].asset as GLTF).scene;

    (this._loadedAssets['render1Src'].asset as THREE.Texture).flipY = false;
    (this._loadedAssets['render1Src'].asset as THREE.Texture).encoding = THREE.sRGBEncoding;
    this._bakedMaterial1 = new THREE.MeshBasicMaterial({
      map: this._loadedAssets['render1Src'].asset as THREE.Texture,
    });

    (this._loadedAssets['render2Src'].asset as THREE.Texture).flipY = false;
    (this._loadedAssets['render2Src'].asset as THREE.Texture).encoding = THREE.sRGBEncoding;
    this._bakedMaterial2 = new THREE.MeshBasicMaterial({
      map: this._loadedAssets['render2Src'].asset as THREE.Texture,
    });

    (this._loadedAssets['render3Src'].asset as THREE.Texture).flipY = false;
    (this._loadedAssets['render3Src'].asset as THREE.Texture).encoding = THREE.sRGBEncoding;
    this._bakedMaterial3 = new THREE.MeshBasicMaterial({
      map: this._loadedAssets['render3Src'].asset as THREE.Texture,
    });

    (this._loadedAssets['render4Src'].asset as THREE.Texture).flipY = false;
    (this._loadedAssets['render4Src'].asset as THREE.Texture).encoding = THREE.sRGBEncoding;
    this._bakedMaterial4 = new THREE.MeshBasicMaterial({
      map: this._loadedAssets['render4Src'].asset as THREE.Texture,
    });

    const render1Meshes = this._blenderScene.children.filter(child => child.name.includes('books'));
    render1Meshes.forEach(mesh => {
      if (mesh && this._bakedMaterial1) (mesh as THREE.Mesh).material = this._bakedMaterial1;
    });

    const render2Mesh = this._blenderScene.children.find(
      child => child.name === 'render2'
    ) as THREE.Mesh;
    if (render2Mesh) render2Mesh.material = this._bakedMaterial2;

    const render3Mesh = this._blenderScene.children.find(
      child => child.name === 'render3'
    ) as THREE.Mesh;
    if (render3Mesh) render3Mesh.material = this._bakedMaterial3;

    const render4Mesh = this._blenderScene.children.find(
      child => child.name === 'render4'
    ) as THREE.Mesh;
    if (render4Mesh) render4Mesh.material = this._bakedMaterial4;

    const champGlassMesh = this._blenderScene.children.find(
      child => child.name === 'champGlass'
    ) as THREE.Mesh;
    if (champGlassMesh) champGlassMesh.material = this._glassMaterial;

    const glassMesh = this._blenderScene.children.find(
      child => child.name === 'glass'
    ) as THREE.Mesh;
    if (glassMesh) glassMesh.material = this._glassMaterial;

    const barGlassMesh = this._blenderScene.children.find(
      child => child.name === 'displayGlass'
    ) as THREE.Mesh;
    if (barGlassMesh) barGlassMesh.material = this._glassDarkMaterial;

    const emissionMesh = this._blenderScene.children.find(
      child => child.name === 'emission'
    ) as THREE.Mesh;
    if (emissionMesh) emissionMesh.material = this._lightMaterial;

    const neonMesh = this._blenderScene.children.find(child => child.name === 'neon') as THREE.Mesh;
    if (neonMesh) neonMesh.material = this._lightMaterial;

    const windowsMesh = this._blenderScene.children.find(
      child => child.name === 'windows'
    ) as THREE.Mesh;
    if (windowsMesh) windowsMesh.material = this._glassDarkMaterial;

    if (this._blenderScene) this.add(this._blenderScene);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);
  }

  destroy() {
    if (this._blenderScene) this.remove(this._blenderScene);
    this._bakedMaterial1?.dispose();
    this._bakedMaterial2?.dispose();
    this._bakedMaterial3?.dispose();
    this._bakedMaterial4?.dispose();
    this._glassMaterial?.dispose();
    this._glassDarkMaterial?.dispose();
    this._lightMaterial?.dispose();
  }
}
