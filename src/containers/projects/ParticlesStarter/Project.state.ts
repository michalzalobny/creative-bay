import GUI from 'lil-gui';

import { App } from './classes/App';

interface AppState {
	app: App | null;
	gui: GUI | null;
}

export const appState: AppState = {
	app: null,
	gui: null,
};
