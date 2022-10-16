import { App } from './classes/App';
import { Rapier } from './classes/utils/rapier';

interface AppState {
  app: App | null;
  RAPIER: Rapier | null;
}

export const appState: AppState = {
  app: null,
  RAPIER: null,
};
