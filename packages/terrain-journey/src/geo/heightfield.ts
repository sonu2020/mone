// ============================================================================
// The ground, as a grid of elevations.
//
// Fetches terrarium-encoded DEM tiles, paints them into one mosaic canvas, and
// samples a regular grid out of it. Nothing here knows about Three.js — the
// output is a plain Float32Array and the scene decides what to do with it.
//
// Why fetch at runtime rather than bake the grid into a module: a modest bbox
// needs six to a dozen tiles, the browser caches them between visits, and a
// baked grid is a six-figure array of numbers sitting in the bundle.
// ============================================================================

import type { BBox } from '../types';

/**
 * AWS Terrain Tiles — an open aggregate of SRTM, NED and others on the Registry
 * of Open Data on AWS. No API key.
 *
 * MUST be the virtual-hosted-style host, with the bucket as a subdomain. The
 * path-style URL serves identical bytes and sends no CORS headers, and since
 * this reads pixels rather than drawing an <img>, it fails with no useful
 * error: the fetch resolves, the decode throws on a tainted canvas, and the
 * cause is nowhere in the message.
 */
export const TERRAIN_TILES =
  'https://elevation-tiles-prod.s3.amazonaws.com/terrarium/{z}/{x}/{y}.png';

export const TERRAIN_ATTRIBUTION =
  '<a href="https://registry.opendata.aws/terrain-tiles/">Terrain Tiles</a> on AWS Open Data';

/** Zoom 13 is roughly 19 m per pixel in the tropics. */
const MAX_ZOOM = 13;
const MIN_ZOOM = 8;
const TILE_PX = 256;

/**
 * Most tiles we are willing to fetch for one journey.
 *
 * This is why zoom is chosen rather than fixed. A 6 km ghat needs six tiles at
 * zoom 13; a 105 km river covers the same ground in 143, which is a rude thing
 * to do to a reader's connection and to an open dataset nobody is paying for.
 * Dropping a zoom level quarters the count.
 */
const TILE_BUDGET = 24;

/** Highest zoom whose tile count for `bbox` fits the budget. */
export function chooseZoom(bbox: BBox, budget = TILE_BUDGET): number {
  for (let z = MAX_ZOOM; z > MIN_ZOOM; z--) {
    const nx = Math.floor(lngToTileX(bbox[2], z)) - Math.floor(lngToTileX(bbox[0], z)) + 1;
    const ny = Math.floor(latToTileY(bbox[1], z)) - Math.floor(latToTileY(bbox[3], z)) + 1;
    if (nx * ny <= budget) return z;
  }
  return MIN_ZOOM;
}

export interface HeightField {
  /** Elevations in metres, row-major, north-to-south then west-to-east. */
  data: Float32Array;
  cols: number;
  rows: number;
  bbox: BBox;
  min: number;
  max: number;
  meta: HeightFieldMeta;
}

export interface HeightFieldOptions {
  cols: number;
  rows: number;
  /** Omit to pick the highest zoom that fits the tile budget. */
  zoom?: number;
  tileUrl?: string;
}

export interface HeightFieldMeta {
  zoom: number;
  tiles: number;
  /** Ground metres per DEM pixel at this zoom and latitude. */
  metresPerPixel: number;
}

function lngToTileX(lng: number, z: number) {
  return ((lng + 180) / 360) * 2 ** z;
}

function latToTileY(lat: number, z: number) {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.asinh(Math.tan(r)) / Math.PI) / 2) * 2 ** z;
}

/**
 * Build a `cols x rows` grid of elevations covering `bbox`.
 *
 * Rejects only if every tile fails. A single 404 is survivable: that patch of
 * the mosaic stays transparent, decodes to a hole, and is filled from its
 * neighbours — a flat patch rather than a spike to -32768 m.
 */
export async function loadHeightField(
  bbox: BBox,
  opts: HeightFieldOptions,
): Promise<HeightField> {
  const { cols, rows } = opts;
  const zoom = opts.zoom ?? chooseZoom(bbox);
  const tileUrl = opts.tileUrl ?? TERRAIN_TILES;
  const [west, south, east, north] = bbox;

  const x0 = Math.floor(lngToTileX(west, zoom));
  const x1 = Math.floor(lngToTileX(east, zoom));
  // Tile Y grows southward, so north is the low index.
  const y0 = Math.floor(latToTileY(north, zoom));
  const y1 = Math.floor(latToTileY(south, zoom));

  const tilesX = x1 - x0 + 1;
  const tilesY = y1 - y0 + 1;

  const canvas = document.createElement('canvas');
  canvas.width = tilesX * TILE_PX;
  canvas.height = tilesY * TILE_PX;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('terrain-journey: no 2d context for the DEM mosaic');

  await Promise.all(
    Array.from({ length: tilesX * tilesY }, async (_, k) => {
      const tx = x0 + (k % tilesX);
      const ty = y0 + Math.floor(k / tilesX);
      const url = tileUrl
        .replace('{z}', String(zoom))
        .replace('{x}', String(tx))
        .replace('{y}', String(ty));
      try {
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) throw new Error(String(res.status));
        const bmp = await createImageBitmap(await res.blob());
        ctx.drawImage(bmp, (tx - x0) * TILE_PX, (ty - y0) * TILE_PX);
        bmp.close();
      } catch (e) {
        console.warn(`[terrain-journey] DEM tile ${zoom}/${tx}/${ty} failed`, e);
      }
    }),
  );

  const px = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const data = new Float32Array(cols * rows);
  const holes: number[] = [];
  let min = Infinity;
  let max = -Infinity;

  for (let r = 0; r < rows; r++) {
    const lat = north - ((north - south) * r) / (rows - 1);
    const iy = clamp(Math.round((latToTileY(lat, zoom) - y0) * TILE_PX), 0, canvas.height - 1);

    for (let c = 0; c < cols; c++) {
      const lng = west + ((east - west) * c) / (cols - 1);
      const ix = clamp(Math.round((lngToTileX(lng, zoom) - x0) * TILE_PX), 0, canvas.width - 1);

      const o = (iy * canvas.width + ix) * 4;
      const i = r * cols + c;

      if (px[o + 3] === 0) {
        data[i] = NaN;
        holes.push(i);
        continue;
      }
      // Terrarium: elevation = (R * 256 + G + B / 256) - 32768.
      const e = px[o] * 256 + px[o + 1] + px[o + 2] / 256 - 32768;
      data[i] = e;
      if (e < min) min = e;
      if (e > max) max = e;
    }
  }

  if (holes.length === data.length) {
    throw new Error('terrain-journey: every DEM tile failed');
  }

  for (const i of holes) {
    const r = Math.floor(i / cols);
    const c = i % cols;
    let fill = NaN;
    for (let d = 1; d < cols && Number.isNaN(fill); d++) {
      const a = data[r * cols + Math.max(0, c - d)];
      const b = data[r * cols + Math.min(cols - 1, c + d)];
      fill = !Number.isNaN(a) ? a : b;
    }
    data[i] = Number.isNaN(fill) ? min : fill;
  }

  const midLat = ((bbox[1] + bbox[3]) / 2) * (Math.PI / 180);
  return {
    data,
    cols,
    rows,
    bbox,
    min,
    max,
    meta: {
      zoom,
      tiles: tilesX * tilesY,
      metresPerPixel: (40075016.686 * Math.cos(midLat)) / (2 ** zoom * TILE_PX),
    },
  };
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}
