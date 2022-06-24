import { CanvasApp } from 'classes/CanvasApp';

interface GlobalState {
  canvasApp: CanvasApp | null;
}

export const globalState: GlobalState = {
  canvasApp: null,
};
