import { useState, useEffect } from 'react';

// Cache loaded images
const loadedImages = new Map<string, boolean>();

export const useImageLoaded = (imgSrc: string) => {
	const [loaded, setLoaded] = useState(false || loadedImages.get(imgSrc) === true);

	useEffect(() => {
		if (loaded) return;

		if (loadedImages.get(imgSrc)) {
			setLoaded(true);
			return;
		}

		const img = new Image();
		img.src = imgSrc;

		if (img.complete) {
			loadedImages.set(imgSrc, true);
			setLoaded(true);
			return;
		}

		img.onload = () => {
			loadedImages.set(imgSrc, true);
			setLoaded(true);
		};

		img.onerror = () => {
			setLoaded(true);
			console.error(`Error loading image: ${imgSrc}`);
		};
	}, [loaded]);

	useEffect(() => {
		if (loadedImages.get(imgSrc)) return;
		setLoaded(false);
	}, [imgSrc]);

	return loaded;
};
