const DEFAULT_FPS = 60;
const DT_FPS = 1000 / DEFAULT_FPS;

import { EventDispatcher } from '../EventDispatcher';

export type UpdateEventProps = {
  type: string;
  dt: number;
  uTime: number;
};

export class GlobalFrame extends EventDispatcher {
  // Those can be read directly from the GlobalFrame class, or from the update event
  public static dt = { value: 0 };
  public static uTime = { value: 0 };

  private static instance: GlobalFrame | null = null;
  private static canCreate = false;

  public static getInstance() {
    if (!GlobalFrame.instance) {
      GlobalFrame.canCreate = true;
      GlobalFrame.instance = new GlobalFrame();
      GlobalFrame.canCreate = false;
    }
    return GlobalFrame.instance;
  }
  public static destroy() {
    if (GlobalFrame.instance && !GlobalFrame.canCreate) {
      GlobalFrame.instance.destroy();
      GlobalFrame.instance = null;
    }
  }

  private rafId: number | null = null;
  private isResumed = true;
  private lastFrameTime: number | null = null;

  constructor() {
    super();

    window.addEventListener('visibilitychange', this.onVisibilityChange);
    this.resumeAppFrame();
  }

  private onVisibilityChange = () => {
    if (document.hidden) {
      this.stopAppFrame();
    } else {
      this.resumeAppFrame();
    }
  };

  private resumeAppFrame() {
    this.isResumed = true;
    if (!this.rafId) {
      this.rafId = window.requestAnimationFrame(this.renderOnFrame);
    }
  }

  private renderOnFrame = (time: number) => {
    this.rafId = window.requestAnimationFrame(this.renderOnFrame);

    if (this.isResumed || !this.lastFrameTime) {
      this.lastFrameTime = window.performance.now();
      this.isResumed = false;
      return;
    }

    const delta = time - this.lastFrameTime;

    // Round dt to 0.5 multiples to avoid flickering
    let dt = delta / DT_FPS;
    const rounded = Math.round(dt * 2) / 2;
    dt = rounded < 0.5 ? 0.5 : rounded;

    GlobalFrame.dt.value = dt;
    GlobalFrame.uTime.value = time;

    this.lastFrameTime = time;

    this.dispatchEvent({
      type: 'update',
      dt: GlobalFrame.dt.value,
      uTime: GlobalFrame.uTime.value,
    });
  };

  private stopAppFrame() {
    if (this.rafId) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private destroy() {
    this.stopAppFrame();

    window.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.dispatchEvent({ type: 'destroy' });
  }
}
