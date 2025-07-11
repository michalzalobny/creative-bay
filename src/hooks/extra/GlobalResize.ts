import { EventDispatcher } from './EventDispatcher';

export class GlobalResize extends EventDispatcher {
  // This can be read directly from the GlobalResize class
  public static windowSize = { value: [1, 1] };

  private static instance: GlobalResize | null = null;
  private static canCreate = false;

  public static getInstance() {
    if (!GlobalResize.instance) {
      GlobalResize.canCreate = true;
      GlobalResize.instance = new GlobalResize();
      GlobalResize.canCreate = false;
    }
    return GlobalResize.instance;
  }
  public static destroy() {
    if (GlobalResize.instance && !GlobalResize.canCreate) {
      GlobalResize.instance.destroy();
      GlobalResize.instance = null;
    }
  }

  constructor() {
    super();
    window.addEventListener('resize', this.onResize);
    this.onResize(); // Trigger initial resize event
  }

  private onResize = () => {
    const currentSize = GlobalResize.windowSize.value[0];

    // It means that no initial resize has been done yet
    if (currentSize === 1) {
      this.dispatchEvent({ type: 'resize' });
    }

    const newWidth = window.innerWidth;
    if (newWidth === currentSize) return; // No change in width, no need to update

    const newHeight = window.innerHeight;
    GlobalResize.windowSize.value = [newWidth, newHeight];
    this.dispatchEvent({ type: 'resize' });
  };

  private destroy() {
    window.removeEventListener('resize', this.onResize);
    this.dispatchEvent({ type: 'destroy' });
  }
}
