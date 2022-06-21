import * as THREE from 'three';
import GUI from 'lil-gui';
import { gsap } from 'gsap';

import { UpdateInfo, Bounds } from 'utils/sharedTypes';
import { getVideoFrameTexture } from 'utils/functions/getVideoFrameTexture';
import { Scroll } from 'utils/helperClasses/Scroll';

import { InteractiveScene } from './InteractiveScene';
import { PointObject3D } from '../Components/PointObject3D';
import { VideoNames } from '../App';
//Assets imports
import vid1 from '../assets/videos/1.mp4';
import vid2 from '../assets/videos/2.mp4';
import vid3 from '../assets/videos/3.mp4';

interface Constructor {
  camera: THREE.PerspectiveCamera;
  gui: GUI;
}

export class ExperienceScene extends InteractiveScene {
  static planeRatio = 1.71;
  static particlesAmount = 300;
  static wheelMultiplier = 1;
  static mouseMultiplier = 2;
  static touchMultiplier = 2;

  _pointPlane3D: PointObject3D;
  _planeGeometry = new THREE.PlaneGeometry(
    1,
    1,
    ExperienceScene.particlesAmount,
    ExperienceScene.particlesAmount * ExperienceScene.planeRatio
  );
  _videosArray: HTMLVideoElement[] = [];
  _videosWrapper: HTMLElement;
  _scroll = Scroll.getInstance();
  _offsetX = {
    last: 0,
    current: 0,
    target: 0,
    strengthTarget: 0,
    strengthCurrent: 0,
  };
  _videosToPreload = [
    { name: VideoNames.VID1, source: vid1 },
    { name: VideoNames.VID2, source: vid2 },
    { name: VideoNames.VID3, source: vid3 },
  ];
  _currentlyPlayedId = 1; //1, 2 or 3

  constructor({ gui, camera }: Constructor) {
    super({ camera, gui });

    this._videosWrapper = document.querySelector(`[data-particle="wrapper"]`) as HTMLElement;
    this._preloadVideosFully();
    this._addListeners();

    this._pointPlane3D = new PointObject3D({ gui, geometry: this._planeGeometry });
    this.add(this._pointPlane3D);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  animateIn() {}

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

  setRendererBounds(bounds: Bounds) {
    this._pointPlane3D.setRendererBounds(bounds);

    //Each video has the same parent and has the same dimensions as parent so we can use actual video as a "wrapper"
    const wrapperSizes = this._videosWrapper.getBoundingClientRect();

    this._pointPlane3D.setSize({
      height: wrapperSizes.height,
      width: wrapperSizes.width,
    });
  }

  setPixelRatio(ratio: number) {
    super.setPixelRatio(ratio);
    this._pointPlane3D.setPixelRatio(this._pixelRatio);
  }

  async _animateVidOpacity(video: HTMLVideoElement, destination: number, duration: number) {
    return gsap.to(video, {
      duration,
      opacity: destination,
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

    await this._pointPlane3D.animateDistortion(1, 1);
    await this._pointPlane3D.showT(nextVideoId, 1);
    await this._pointPlane3D.animateDistortion(0, 1);
    await this._animateVidOpacity(nextVideo, 1, 0.2);

    finishedVideo.currentTime = 0;
    this.computeFrame(finishedTargetName);

    void nextVideo.play();
  }

  handleVideoChange = (e: Event | HTMLVideoElement) => {
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

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  _applyScrollX(x: number) {}

  _onScrollMouse = (e: THREE.Event) => {
    this._applyScrollX(e.x * ExperienceScene.mouseMultiplier);
  };
  _onScrollTouch = (e: THREE.Event) => {
    this._applyScrollX(e.x * ExperienceScene.touchMultiplier);
  };
  _onScrollWheel = (e: THREE.Event) => {
    this._applyScrollX(e.y * ExperienceScene.wheelMultiplier);
  };

  _addListeners() {
    super._addListeners();
    this._scroll.addEventListener('mouse', this._onScrollMouse);
    this._scroll.addEventListener('touch', this._onScrollTouch);
    this._scroll.addEventListener('wheel', this._onScrollWheel);
    this._videosArray[0].addEventListener('ended', this.handleVideoChange);
    this._videosArray[1].addEventListener('ended', this.handleVideoChange);
    this._videosArray[2].addEventListener('ended', this.handleVideoChange);
  }

  _removeListeners() {
    super._removeListeners();
    this._scroll.removeEventListener('mouse', this._onScrollMouse);
    this._scroll.removeEventListener('touch', this._onScrollTouch);
    this._scroll.removeEventListener('wheel', this._onScrollWheel);
    this._videosArray[0].removeEventListener('ended', this.handleVideoChange);
    this._videosArray[1].removeEventListener('ended', this.handleVideoChange);
    this._videosArray[2].removeEventListener('ended', this.handleVideoChange);
  }

  update(updateInfo: UpdateInfo) {
    super.update(updateInfo);

    this._pointPlane3D.update(updateInfo);
  }

  destroy() {
    this._pointPlane3D.destroy();
    this.remove(this._pointPlane3D);
    this._removeListeners();
    this._videosArray.forEach(video => {
      this._videosWrapper.removeChild(video);
    });
    this._planeGeometry.dispose();
  }
}
