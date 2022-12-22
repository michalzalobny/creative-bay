import * as THREE from 'three';

import { UpdateInfo } from 'utils/sharedTypes';

import { InteractiveObject3D } from './InteractiveObject3D';
import fshader from '../shaders/instanced/fragment.glsl';
import vshader from '../shaders/instanced/vertex.glsl';

const particleCount = 50;

export class InstancedSpheres3D extends InteractiveObject3D {
  _geometry = new THREE.IcosahedronGeometry(1, 32);
  _material: THREE.RawShaderMaterial | null = null;
  _mesh: THREE.InstancedMesh<THREE.IcosahedronGeometry, THREE.RawShaderMaterial> | null = null;

  constructor() {
    super();

    this._initInstancedGeometry();
  }

  _initInstancedGeometry() {
    const positions = new Float32Array(particleCount * 3);
    const randomArray = new Float32Array(particleCount * 1);

    for (let i = 0, i3 = 0, l = particleCount; i < l; i++, i3 += 3) {
      positions[i3 + 0] = Math.random() * 2 - 1;
      positions[i3 + 1] = Math.random() * 2 - 1;
      positions[i3 + 2] = Math.random() * 2 - 1;

      randomArray[i] = (Math.random() - 0.5) * 2;
    }

    this._geometry.setAttribute('aRandom', new THREE.InstancedBufferAttribute(randomArray, 1));
    this._geometry.setAttribute(
      'instancePosition',
      new THREE.InstancedBufferAttribute(positions, 3)
    );

    this._material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        map: { value: null },
      },
      vertexShader: vshader,
      fragmentShader: fshader,
      depthTest: true,
      depthWrite: true,
    });

    this._mesh = new THREE.InstancedMesh(this._geometry, this._material, positions.length);
    // const scale = 150;
    // this._mesh.scale.set(scale, scale, scale);
    this.add(this._mesh);
  }

  setCircleMask(mask: THREE.Texture) {
    if (this._mesh) this._mesh.material.uniforms.map.value = mask;
  }

  update(updateInfo: UpdateInfo) {
    if (this._mesh) {
      this._mesh.material.uniforms.time.value = updateInfo.time * 0.001;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  destroy() {}
}
