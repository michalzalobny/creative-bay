const DEFAULT_FPS = 60;

export const sharedValues = {
  colors: {
    trueBlack: '#000000',
    trueWhite: '#ffffff',
    black: '#161616',
    lightGray: '#f5f5f5',
    lightPurple: '#F0F0FF',
    purple: '#755DB5',
    blue: '#3087ff',
  },
  spacing: {
    s1: '15px',
    s2: '30px',
    s3: '8px',
  },
  timings: {
    t1: 'cubic-bezier(0.64, 0.02, 0.16, 0.97)',
    t2: 'cubic-bezier(0.24, 0.05, 0.16, 0.97)',
  },
  motion: {
    DEFAULT_FPS: DEFAULT_FPS,
    DT_FPS: 1000 / DEFAULT_FPS,
    LERP_EASE: 0.07,
    MOMENTUM_DAMPING: 0.8,
    MOMENTUM_CARRY: 0.6,
  },
  ISR_TIMEOUT: 5,
  /*
  @ before value meaning:
  1. Mouse enter/leave events in Cursor will work normally
  2. .show() will have to be fire manually by subpage, beacause it won't be fired in _app.ts
  */

  // showCursorArr: ['/', '@/projects/exploding-particles'],
  showCursorArr: ['@/projects/exploding-particles'],
};
