// export const lerp = (p1: number, p2: number, t: number) => {
//   return p1 + (p2 - p1) * t;
// };

//Apparently less error (more accurate - avoids rounding errors)
export const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b;
