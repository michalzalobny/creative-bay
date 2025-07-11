import { useEffect, useRef } from 'react';

import { GlobalFrame, UpdateEventProps } from './GlobalFrame';

export const useFrame = (callback: (time: number, dt: number) => void) => {
  const callbackRef = useRef(callback);

  // Keep the callback always up-to-date
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const globalFrame = GlobalFrame.getInstance();

    const onUpdate = (e: UpdateEventProps) => {
      callbackRef.current(e.uTime, e.dt);
    };

    globalFrame.addEventListener('update', onUpdate);

    return () => {
      globalFrame.removeEventListener('update', onUpdate);
    };
  }, []);
};
