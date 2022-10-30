export const lerp = (p1: number, p2: number, t: number) => {
  return p1 + (p2 - p1) * t;
};

//Apparently less error (more accurate - avoids rounding errors)
// export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;

//Use together
// export const lerp = (v0: number, v1: number, t: number) => {
//   return v0 * (1 - t) + v1 * t;
// };

// export const lerp_ti = (
//   source: number,
//   target: number,
//   rate: number,
//   frameDelta = 1 / 60,
//   targetFps = 60
// ) => {
//   const relativeDelta = frameDelta / (1 / targetFps);
//   const smoothing = 1 - rate;
//   return lerp(source, target, 1 - Math.pow(smoothing, relativeDelta));
// };
