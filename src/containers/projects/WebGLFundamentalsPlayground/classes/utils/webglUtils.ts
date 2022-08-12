export function resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier?: number) {
  multiplier = multiplier || 1;
  const width = (canvas.clientWidth * multiplier) | 0;
  const height = (canvas.clientHeight * multiplier) | 0;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    return true;
  }

  return false;
}

export function projection(width: number, height: number, dst: Float32Array) {
  dst = dst || new Float32Array(9);
  // Note: This matrix flips the Y axis so 0 is at the top.

  dst[0] = 2 / width;
  dst[1] = 0;
  dst[2] = 0;
  dst[3] = 0;
  dst[4] = -2 / height;
  dst[5] = 0;
  dst[6] = -1;
  dst[7] = 1;
  dst[8] = 1;

  return dst;
}
