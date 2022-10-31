export const clamp = (value: number) => {
  return Math.min(1, Math.max(0, value));
};

export const clampRange = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max));
};
