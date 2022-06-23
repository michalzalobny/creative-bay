import * as THREE from 'three';
import GUI from 'lil-gui';
import { gsap } from 'gsap';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';
import { getVideoFrameTexture } from 'utils/functions/getVideoFrameTexture';

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
  static particlesAmount = 400;
  static particlesSize = 10.2; //10.2 ensures that all the pixels used will take the whole space
  static wheelMultiplier = 1;
  static mouseMultiplier = 2;
  static touchMultiplier = 2;

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

  constructor({ postProcess, gui, camera }: Constructor) {
    super({ camera, gui });

    this._postProcess = postProcess;

    this._videosWrapper = document.querySelector(`[data-particle="wrapper"]`) as HTMLElement;
    this._preloadVideosFully();
    this._addListeners();
  }

  _preloadVideosFully() {
    let loaded = 0;
    const onVideoLoaded = () => {
      loaded += 1;
      if (loaded === this._videosArray.length) {
        this.dispatchEvent({ type: 'loaded' });
        this.startVideoLooping();
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
    const particlesXAmount = (ExperienceScene.particlesAmount * wrapperSizes.width) / 1000;

    this._planeGeometry = new THREE.PlaneGeometry(
      1,
      1,
      Math.round(particlesXAmount),
      Math.round(particlesXAmount * planeRatio)
    );
  }

  setRendererBounds(bounds: Bounds) {
    super.setRendererBounds(bounds);
    if (this._pointPlane3D) {
      this._pointPlane3D.destroy();
      this.remove(this._pointPlane3D);
    }
    this._generateNewGeometry();
    if (!this._planeGeometry) return;

    const particleSize =
      (this._planeGeometry.parameters.widthSegments /
        ExperienceScene.particlesAmount /
        this._planeGeometry.parameters.widthSegments) *
      100000 *
      ExperienceScene.particlesSize;

    this._pointPlane3D = new PointObject3D({
      geometry: this._planeGeometry,
      gui: this._gui,
      particleSize,
    });
    this._pointPlane3D.setPixelRatio(this._pixelRatio); //Need to call it here and too because, we destroy previous instance
    this.add(this._pointPlane3D);

    this._pointPlane3D.setRendererBounds(bounds);

    const wrapperSizes = this._videosWrapper.getBoundingClientRect();

    this._pointPlane3D.setSize({
      height: wrapperSizes.height,
      width: wrapperSizes.width,
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

  computeFrame(targetName: string, seconds?: number) {
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

    this.computeFrame(finishedTargetName);

    await this._animateVidOpacity(finishedVideo, 0, 0.2);

    nextVideo.currentTime = 0;
    this.computeFrame(nextTargetName);

    const pointSizeDuration = 0.6;

    if (this._pointPlane3D) {
      await Promise.allSettled([
        this._pointPlane3D.animateDistortion(1, 1),
        this._pointPlane3D.animatePointSize(0.6, pointSizeDuration),
      ]);

      const time1 = 0.75;

      await Promise.allSettled([
        this._animateBloom(5, time1),
        this._animateBloom(0, time1, time1 * 1.25),
        this._pointPlane3D.showT(nextVideoId, time1, 0.8 * time1),
        this._pointPlane3D.animateDistortion(0, 1, time1, 'power1.easeOut'),
        this._pointPlane3D.animatePointSize(1, pointSizeDuration, time1),
      ]);
    }

    await this._animateVidOpacity(nextVideo, 1, 0.2);

    finishedVideo.currentTime = 0;
    this.computeFrame(finishedTargetName);

    void nextVideo.play();
    this._isTransitioning = false;
  }

  handleVideoChange = (e: Event | HTMLVideoElement) => {
    if (this._isTransitioning) return;
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

    void this.animateTransition(finishedVideo, nextVideo);
  };

  startVideoLooping() {
    const video = this._videosArray.find(
      vid => vid.dataset.particle === VideoNames.VID_PART + this._currentlyPlayedId.toString()
    ) as HTMLVideoElement;

    video.style.opacity = '1';
    void video.play();
  }

  _handleClick = () => {
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
  }
}
