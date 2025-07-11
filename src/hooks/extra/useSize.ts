import { useLayoutEffect, useState } from 'react';
import { GlobalResize } from './GlobalResize';

import { debounce } from './debounce';
import { useFontsLoaded } from './useFontsLoaded';

export const useSize = (elRef: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const fontsLoaded = useFontsLoaded();

  const onResize = () => {
    const el = elRef.current;
    if (!el) return;

    setWidth(el.clientWidth);
    setHeight(el.clientHeight);
  };
  const onResizeDebounced = debounce(onResize, 200);

  useLayoutEffect(() => {
    const globalResize = GlobalResize.getInstance();
    globalResize.addEventListener('resize', onResizeDebounced);
    return () => {
      globalResize.removeEventListener('resize', onResizeDebounced);
    };
  }, []);

  useLayoutEffect(() => {
    onResize();
  }, [elRef]);

  useLayoutEffect(() => {
    if (fontsLoaded) {
      onResize();
    }
  }, [fontsLoaded]);

  return { width, height, onResize };
};
