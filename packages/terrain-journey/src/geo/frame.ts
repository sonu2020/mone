// ============================================================================
// Degrees in, metres out.
//
// Three.js wants metres, not degrees. Everything a journey draws is placed in a
// frame centred on its bbox: +x east, +z south, +y up. One projection, shared
// by the terrain, the route and the labels, so nothing can drift apart.
//
// An equirectangular projection about the bbox centre. Over a few kilometres of
// a tropical latitude the error against a proper projection is centimetres, and
// the linearity is worth more than the accuracy: it inverts exactly, which is
// what lets the terrain grid map straight back to array indices.
// ============================================================================

import type { BBox, LngLat } from '../types';

const EARTH_RADIUS = 6371000;

export class LocalFrame {
  readonly originLng: number;
  readonly originLat: number;
  readonly metresPerDegLat: number;
  readonly metresPerDegLng: number;

  constructor(bbox: BBox) {
    this.originLng = (bbox[0] + bbox[2]) / 2;
    this.originLat = (bbox[1] + bbox[3]) / 2;
    this.metresPerDegLat = (Math.PI / 180) * EARTH_RADIUS;
    this.metresPerDegLng =
      (Math.PI / 180) * EARTH_RADIUS * Math.cos((this.originLat * Math.PI) / 180);
  }

  /** [lng, lat] → [x, z] in metres from the centre of the bbox. */
  toLocal(lng: number, lat: number): [number, number] {
    return [
      (lng - this.originLng) * this.metresPerDegLng,
      -(lat - this.originLat) * this.metresPerDegLat,
    ];
  }

  /** [x, z] → [lng, lat]. The exact inverse of toLocal. */
  toLngLat(x: number, z: number): LngLat {
    return [
      x / this.metresPerDegLng + this.originLng,
      -z / this.metresPerDegLat + this.originLat,
    ];
  }
}

const R = EARTH_RADIUS;

/** Great-circle-ish distance in metres between two [lng, lat] points. */
export function haversineish(a: LngLat, b: LngLat): number {
  const lat = ((a[1] + b[1]) / 2) * (Math.PI / 180);
  const dx = (b[0] - a[0]) * (Math.PI / 180) * Math.cos(lat) * R;
  const dy = (b[1] - a[1]) * (Math.PI / 180) * R;
  return Math.hypot(dx, dy);
}
