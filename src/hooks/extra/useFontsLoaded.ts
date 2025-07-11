import { useEffect, useState } from 'react';
import FontFaceObserver from 'fontfaceobserver';

// Based on the fonts used in @font-face
const fontsToLoad = [
  {
    family: 'Test Triangle',
    weight: 'normal',
    style: 'normal',
  },
  {
    family: 'Test Triangle',
    weight: 500,
    style: 'normal',
  },
];

// Used to check if font promises are already created, by different instances of the hook
let fontPromises: Promise<void>[] = [];

export const useFontsLoaded = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (fontsLoaded) return;

    // Check if font promises are already created, so we don't create them again
    if (fontPromises.length === 0) {
      fontPromises = fontsToLoad.map(font => {
        const fontObserver = new FontFaceObserver(font.family, {
          weight: font.weight,
          style: font.style,
        });
        return fontObserver.load();
      });
    }

    Promise.all(fontPromises)
      .then(() => {
        setFontsLoaded(true);
      })
      .catch(() => {
        setFontsLoaded(false);
      });
  }, [fontsLoaded]);

  return fontsLoaded;
};
