import React, { useRef, useEffect } from 'react';

import { Head } from 'seo/Head/Head';

import { PageProps } from './Project.data';
import { appState } from './Project.state';
import { App } from './classes/App';
import styles from './Project.module.scss';

export default function Project(props: PageProps) {
	const { head } = props;

	const rendererEl = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!rendererEl.current) return;
		appState.app = new App({ rendererEl: rendererEl.current });

		return () => {
			if (appState.app) {
				appState.app.destroy();
				appState.app = null;
			}
		};
	}, []);

	return (
		<>
			<Head {...head} />
			<div className={styles.canvasWrapper} ref={rendererEl} />
		</>
	);
}
