import * as THREE from 'three';

import { UpdateInfo, LoadedAssets, Size } from 'utils/sharedTypes';

import { InteractiveScene } from './InteractiveScene';
import { PointObject3D } from '../Components/PointObject3D';
import { appState } from '../../Project.state';

interface Constructor {
	camera: THREE.PerspectiveCamera;
}

export class ExperienceScene extends InteractiveScene {
	_pointObj3D: PointObject3D;
	_planeGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
	_loadedAssets: LoadedAssets | null = null;

	_particlesSettings = {
		uVar1: 1,
		uVar2: 1,
		uVar3: 1,
		uVar4: 1,
	};

	constructor({ camera }: Constructor) {
		super({ camera });

		this._pointObj3D = new PointObject3D({
			geometry: this._planeGeometry,
			particlesSettings: this._particlesSettings,
			particleSize: 3,
		});

		this.add(this._pointObj3D);

		this._setGui();
	}

	_setGui() {
		if (!appState.gui) return;
		const particles = appState.gui.addFolder('Particles');
		particles.close();

		particles
			.add(this._particlesSettings, 'uVar1', 0.01, 4, 0.01)
			.name('particle size')
			.onChange((val: number) => {
				this._pointObj3D.setVar('uVar1', val);
			});
		particles
			.add(this._particlesSettings, 'uVar2', 0.01, 4, 0.01)
			.name('progress')
			.onChange((val: number) => {
				this._pointObj3D.setVar('uVar2', val);
			});
		particles
			.add(this._particlesSettings, 'uVar3', 0.01, 4, 0.01)
			.name('distortion1')
			.onChange((val: number) => {
				this._pointObj3D.setVar('uVar3', val);
			});
		particles
			.add(this._particlesSettings, 'uVar4', 0.01, 4, 0.01)
			.name('distortion2')
			.onChange((val: number) => {
				this._pointObj3D.setVar('uVar4', val);
			});
	}

	setStageSize(size: Size) {
		super.setStageSize(size);
		this._pointObj3D.setStageSize(this.stageSize);
		this._pointObj3D.setPixelRatio(this.pixelRatio);
		this._pointObj3D.setPlaneSize({ width: 600, height: 600 });
	}

	setLoadedAssets(assets: LoadedAssets) {
		this._loadedAssets = assets;

		const mask = this._loadedAssets['particleMask'];
		this._pointObj3D.setParticleMaskTexture(mask.asset as THREE.Texture);
	}

	update(updateInfo: UpdateInfo) {
		super.update(updateInfo);
	}

	destroy() {
		super.destroy();
		this._pointObj3D.destroy();
		this.remove(this._pointObj3D);
		this._planeGeometry.dispose();
	}
}
