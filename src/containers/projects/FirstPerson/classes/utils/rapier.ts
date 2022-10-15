import RAPIER from '@dimforge/rapier3d-compat';
export type Rapier = typeof RAPIER;

export function getRapier() {
  return RAPIER.init().then(() => RAPIER);
}
