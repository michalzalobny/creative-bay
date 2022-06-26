import * as THREE from 'three';
import GUI from 'lil-gui';
import { gsap } from 'gsap';
import SplitType from 'split-type';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';
import { sharedValues } from 'utils/sharedValues';
import { getVideoFrameTexture } from 'utils/functions/getVideoFrameTexture';
import { globalState } from 'utils/globalState';
import { delay } from 'utils/functions/delay';

import { InteractiveScene } from './InteractiveScene';
import { PointObject3D } from '../Components/PointObject3D';
import { VideoNames, PostProcess } from '../App';
//Assets imports
import vid1 from '../assets/videos/faster/1.mp4';
import vid2 from '../assets/videos/faster/2.mp4';
import vid3 from '../assets/videos/faster/3.mp4';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
  postProcess: PostProcess;
}

export class ExperienceScene extends InteractiveScene {
  _pointPlane3D: PointObject3D | null = null;
  _planeGeometry: THREE.PlaneBufferGeometry | null = null;
  _videosArray: HTMLVideoElement[] = [];
  _videosWrapper: HTMLElement;
  _videosToPreload = [
    { name: VideoNames.VID1, source: vid1 },
    { name: VideoNames.VID2, source: vid2 },
    { name: VideoNames.VID3, source: vid3 },
  ];
  _currentlyPlayedId = 1; //1, 2 or 3
  _postProcess: PostProcess;
  _isTransitioning = false;
  _isLoaded = false;
  _videoFrameSettings = {
    particlesAmount: 400,
    particlesSize: 10.2, //10.2 ensures that all the pixels used will take the whole space
  };
  _particlesSettings = {
    uVar1: 1,
    uVar2: 1,
    uVar3: 0.5,
    uVar4: 0.5,
  };
  _namesArray = ['青いバラ', '桜の花', 'カモミール'];
  _paragraphsArray: HTMLParagraphElement[] = [];
  _splitParagraphsArray: SplitType[] = [];

  constructor({ postProcess, gui, camera }: Constructor) {
    super({ camera, gui });

    this._setGui();

    this._postProcess = postProcess;

    this._videosWrapper = document.querySelector(`[data-particle="wrapper"]`) as HTMLElement;
    this._preloadVideosFully();
    this._addListeners();
  }

  _setGui() {
    const videoFrame = this._gui.addFolder('Video frame texture');
    videoFrame.close();
    videoFrame
      .add(this._videoFrameSettings, 'particlesAmount', 40, 400, 1)
      .name('frameParticlesAmount')
      .onFinishChange(() => {
        this._createNewPointObject();
        this._computeAllFrames();
      });

    videoFrame
      .add(this._videoFrameSettings, 'particlesSize', 3, 40, 0.1)
      .name('frameParticlesSize')
      .onFinishChange(() => {
        this._createNewPointObject();
        this._computeAllFrames();
      });

    const particles = this._gui.addFolder('Particles');
    particles.close();

    particles
      .add(this._particlesSettings, 'uVar1', 0, 40, 0.01)
      .name('vertical distortion')
      .onChange((val: number) => {
        this._pointPlane3D?.setVar('uVar1', val);
      });
    particles
      .add(this._particlesSettings, 'uVar2', 0, 40, 0.01)
      .name('horizontal distortion')
      .onChange((val: number) => {
        this._pointPlane3D?.setVar('uVar2', val);
      });
    particles
      .add(this._particlesSettings, 'uVar3', 0, 3, 0.01)
      .name('travelling speed')
      .onChange((val: number) => {
        this._pointPlane3D?.setVar('uVar3', val);
      });
    particles
      .add(this._particlesSettings, 'uVar4', 0, 10, 0.01)
      .name('distortion speed')
      .onChange((val: number) => {
        this._pointPlane3D?.setVar('uVar4', val);
      });
  }

  _generateParagraphs() {
    this._namesArray.forEach(name => {
      const title = document.createElement('p');
      title.innerText = name;

      this._paragraphsArray.push(title);
      this._videosWrapper.appendChild(title);
    });

    this._paragraphsArray.forEach(el => {
      const x = new SplitType(el, { types: 'lines,chars', tagName: 'span' });
      this._splitParagraphsArray.push(x);
    });
  }

  async _animateParagraphIn(index: number) {
    const target = this._splitParagraphsArray[index - 1];
    if (!target.lines) return;

    /*
    1. for loop instead of .forEach to be able to use await
    2. two for loops in order to use await between reseting the style and applying new
    3. delay is 50, other lower values like 5 result in css not picking the update of transform reset
    */
    for (let i = 0; i < target.lines.length; i++) {
      const line = target.lines[i];
      const lineArr = Array.from(line.children) as HTMLElement[];
      for (let charIndex = 0; charIndex < lineArr.length; charIndex++) {
        const char = lineArr[charIndex];
        char.style.transition = '';
        char.classList.remove('char--revert');
      }
    }
    await delay(50);
    for (let i = 0; i < target.lines.length; i++) {
      const line = target.lines[i];
      const lineArr = Array.from(line.children) as HTMLElement[];
      for (let charIndex = 0; charIndex < lineArr.length; charIndex++) {
        const char = lineArr[charIndex];
        char.style.transition = `transform 1.5s ${charIndex * 0.07}s ${sharedValues.timings.t1}`;
        char.classList.add('char--active');
      }
    }
  }

  _animateParagraphOut(index: number) {
    const target = this._splitParagraphsArray[index - 1];
    if (!target.lines) return;

    for (let i = 0; i < target.lines.length; i++) {
      const line = target.lines[i];
      const lineArr = Array.from(line.children) as HTMLElement[];
      for (let charIndex = 0; charIndex < lineArr.length; charIndex++) {
        const char = lineArr[charIndex];
        char.classList.add('char--revert');
        char.style.transition = `transform 1s ${charIndex * 0.07}s ${sharedValues.timings.t1}`;
        char.classList.remove('char--active');
      }
    }
  }

  _preloadVideosFully() {
    let loaded = 0;
    const onVideoLoaded = () => {
      loaded += 1;
      if (loaded === this._videosArray.length) {
        this._generateParagraphs();
        this.dispatchEvent({ type: 'loaded' });
        this._startVideoLooping();
        if (globalState.canvasApp) {
          globalState.canvasApp.cursor2D.setCurrentText('click for explosion');
        }
        this._isLoaded = true;
      }
    };

    this._videosToPreload.forEach(vidEl => {
      const video = document.createElement('video');
      video.setAttribute('data-particle', vidEl.name);
      this._videosWrapper.appendChild(video);
      video.src = vidEl.source;
      video.preload = 'auto'; //fixes canplaythrough firing issues issues
      video.muted = true;
      video.playsInline = true;
      video.load();
      video.addEventListener('canplaythrough', onVideoLoaded, { once: true });
      this._videosArray.push(video);
    });
  }

  _generateNewGeometry() {
    this._planeGeometry?.dispose();
    const wrapperSizes = this._videosWrapper.getBoundingClientRect();
    const planeRatio = wrapperSizes.height / wrapperSizes.width;
    const particlesXAmount = (this._videoFrameSettings.particlesAmount * wrapperSizes.width) / 1000;

    this._planeGeometry = new THREE.PlaneGeometry(
      1,
      1,
      Math.round(particlesXAmount),
      Math.round(particlesXAmount * planeRatio)
    );
  }

  _createNewPointObject() {
    if (this._pointPlane3D) {
      this._pointPlane3D.destroy();
      this.remove(this._pointPlane3D);
    }
    this._generateNewGeometry();
    if (!this._planeGeometry) return;

    const particleSize =
      (this._planeGeometry.parameters.widthSegments /
        this._videoFrameSettings.particlesAmount /
        this._planeGeometry.parameters.widthSegments) *
      100000 *
      this._videoFrameSettings.particlesSize;

    this._pointPlane3D = new PointObject3D({
      geometry: this._planeGeometry,
      particleSize,
      particlesSettings: this._particlesSettings,
    });

    this._pointPlane3D.setPixelRatio(this._pixelRatio); //Need to call it here and too because, we destroy previous instance
    this.add(this._pointPlane3D);

    this._pointPlane3D.setRendererBounds(this._rendererBounds);

    const wrapperSizes = this._videosWrapper.getBoundingClientRect();

    this._pointPlane3D.setSize({
      height: wrapperSizes.height,
      width: wrapperSizes.width,
    });
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    this._createNewPointObject();
    this._splitParagraphsArray.forEach(el => {
      el.split({ types: 'lines,chars', tagName: 'span' });
    });
  }

  setPixelRatio(ratio: number) {
    super.setPixelRatio(ratio);
    this._pointPlane3D && this._pointPlane3D.setPixelRatio(this._pixelRatio);
  }

  async _animateVidOpacity(video: HTMLVideoElement, destination: number, duration: number) {
    return gsap.to(video, {
      duration,
      opacity: destination,
    });
  }

  async _animateBloom(destination: number, duration: number, delay = 0) {
    if (!this._postProcess.unrealBloomPass) return Promise.reject();
    return gsap.to(this._postProcess.unrealBloomPass, {
      duration,
      strength: destination,
      ease: 'power2.inOut',
      delay,
    });
  }

  _computeFrame(targetName: string, seconds?: number) {
    const video = this._videosArray.find(
      vid => vid.dataset.particle === targetName
    ) as HTMLVideoElement;

    if (seconds) {
      video.currentTime = seconds;
    }

    const texture = getVideoFrameTexture({
      width: video.videoWidth,
      height: video.videoHeight,
      video,
      appendCanvas: false,
    });

    this._pointPlane3D &&
      this._pointPlane3D.setAsset({
        width: video.videoWidth,
        height: video.videoHeight,
        targetName: targetName,
        texture,
      });
  }

  async animateTransition(finishedVideo: HTMLVideoElement, nextVideo: HTMLVideoElement) {
    const finishedTargetName = finishedVideo.dataset.particle || '';
    const nextTargetName = nextVideo.dataset.particle || '';
    const nextVideoId = parseInt(nextTargetName.replace(VideoNames.VID_PART, ''));

    this._computeFrame(finishedTargetName);

    await this._animateVidOpacity(finishedVideo, 0, 0.2);

    nextVideo.currentTime = 0;
    this._computeFrame(nextTargetName);

    if (this._pointPlane3D) {
      const time1 = 0.85;

      await Promise.allSettled([
        this._pointPlane3D.animateDistortion(1, 1.2),
        this._pointPlane3D.animatePointSize(0.96, 0.6),
      ]);

      await delay(500);

      await Promise.allSettled([
        this._animateBloom(7, time1),
        this._animateBloom(0, time1 * 0.7, time1),
        this._pointPlane3D.showT(nextVideoId, time1, time1 * 0.8),
      ]);

      await delay(150);
      await this._animateParagraphIn(this._currentlyPlayedId);
      await Promise.allSettled([
        this._pointPlane3D.animateDistortion(0, 1.2, 0),
        this._pointPlane3D.animatePointSize(1, 0.6),
      ]);
    }

    await this._animateVidOpacity(nextVideo, 1, 0.2);

    finishedVideo.currentTime = 0;
    this._computeFrame(finishedTargetName);

    void nextVideo.play();
    this._isTransitioning = false;

    if (globalState.canvasApp) globalState.canvasApp.cursor2D.show();
  }

  handleVideoChange = (e: Event | HTMLVideoElement) => {
    if (this._isTransitioning) return;
    if (globalState.canvasApp) globalState.canvasApp.cursor2D.hide();
    this._animateParagraphOut(this._currentlyPlayedId);

    this._isTransitioning = true;
    let finishedVideo;

    if ('target' in e) {
      finishedVideo = e.target as HTMLVideoElement;
    } else {
      finishedVideo = e;
    }

    const targetName = finishedVideo.dataset.particle || '';
    const videoId = parseInt(targetName.replace(VideoNames.VID_PART, ''));

    if (videoId === this._videosArray.length) {
      this._currentlyPlayedId = 1;
    } else {
      this._currentlyPlayedId += 1;
    }

    const nextVideo = this._videosArray.find(
      vid => vid.dataset.particle === VideoNames.VID_PART + this._currentlyPlayedId.toString()
    ) as HTMLVideoElement;

    finishedVideo.pause();
    void this.animateTransition(finishedVideo, nextVideo);
  };

  _computeAllFrames() {
    this._videosArray.forEach(vid => {
      const targetName = vid.dataset.particle || '';
      this._computeFrame(targetName, 0);
    });
  }

  _startVideoLooping() {
    const video = this._videosArray.find(
      vid => vid.dataset.particle === VideoNames.VID_PART + this._currentlyPlayedId.toString()
    ) as HTMLVideoElement;

    void this._animateParagraphIn(this._currentlyPlayedId);

    video.style.opacity = '1';
    void video.play();
  }

  _handleClick = () => {
    if (!this._isLoaded) return;
    const currentVideo = this._videosArray.find(
      vid => vid.dataset.particle === VideoNames.VID_PART + this._currentlyPlayedId.toString()
    ) as HTMLVideoElement;

    this.handleVideoChange(currentVideo);
  };

  _addListeners() {
    super._addListeners();
    this._videosArray[0].addEventListener('ended', this.handleVideoChange);
    this._videosArray[1].addEventListener('ended', this.handleVideoChange);
    this._videosArray[2].addEventListener('ended', this.handleVideoChange);
    window.addEventListener('click', this._handleClick);
  }

  _removeListeners() {
    super._removeListeners();
    this._videosArray[0].removeEventListener('ended', this.handleVideoChange);
    this._videosArray[1].removeEventListener('ended', this.handleVideoChange);
    this._videosArray[2].removeEventListener('ended', this.handleVideoChange);
    window.removeEventListener('click', this._handleClick);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    if (this._pointPlane3D) {
      this._pointPlane3D.setMouse(this.mouse);
      this._pointPlane3D.update(updateInfo);
    }
  }

  destroy() {
    if (this._pointPlane3D) {
      this._pointPlane3D.destroy();
      this.remove(this._pointPlane3D);
    }
    this._removeListeners();
    this._videosArray.forEach(video => {
      this._videosWrapper.removeChild(video);
    });
    this._planeGeometry?.dispose();
    if (globalState.canvasApp) globalState.canvasApp.cursor2D.setCurrentText('');

    this._splitParagraphsArray.forEach(el => {
      el.revert();
    });

    this._paragraphsArray.forEach(el => {
      this._videosWrapper.removeChild(el);
    });
  }
}
