import { App } from './classes/App';
import RAPIER from '@dimforge/rapier3d';

interface AppState {
  app: App | null;
  RAPIER: typeof RAPIER | null;
}

export const appState: AppState = {
  app: null,
  RAPIER: null,
};
