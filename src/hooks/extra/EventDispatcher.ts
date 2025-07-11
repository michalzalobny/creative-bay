/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */

interface BaseEvent {
	type: string;
	target?: EventDispatcher | null;
	[key: string]: any; // Allows for additional properties
}

interface Listener {
	(event: any): void;
}

interface EventMap {
	[type: string]: Listener[];
}

class EventDispatcher {
	_listeners?: EventMap;

	addEventListener(type: string, listener: Listener) {
		if (this._listeners === undefined) this._listeners = {};

		const listeners = this._listeners;

		if (listeners[type] === undefined) {
			listeners[type] = [];
		}

		if (listeners[type].indexOf(listener) === -1) {
			listeners[type].push(listener);
		}
	}

	hasEventListener(type: string, listener: Listener): boolean {
		if (this._listeners === undefined) return false;

		const listeners = this._listeners;

		return listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1;
	}

	removeEventListener(type: string, listener: Listener) {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[type];

		if (listenerArray !== undefined) {
			const index = listenerArray.indexOf(listener);

			if (index !== -1) {
				listenerArray.splice(index, 1);
			}
		}
	}

	dispatchEvent(event: BaseEvent) {
		if (this._listeners === undefined) return;

		const listeners = this._listeners;
		const listenerArray = listeners[event.type];

		if (listenerArray !== undefined) {
			event.target = this;

			// Make a copy, in case listeners are removed while iterating.
			const array = listenerArray.slice(0);

			for (let i = 0, l = array.length; i < l; i++) {
				array[i].call(this, event);
			}

			event.target = null;
		}
	}
}

export { EventDispatcher };
