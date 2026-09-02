#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// build-lsg-data · Kerala LSG 2025 election data → the site's data files.
//
// Sources (credited on the page, mirrored in src/data/lsg/attribution.json):
//   • OpenDataKerala / LSGD2025-Results-Data — trend_detailed_results_2025.csv
//     (candidate-level results: winner per ward, party, votes, Won/Lost).
//   • OpenDataKerala / LSG2025 — local_bodies.csv, wards.csv (registered
//     voters), party_and_group.csv, and the Kerala TopoJSON geometry
//     (districts.json + per-district LB boundaries, from OSM).
//
// Outputs, all committed so the site builds offline:
//   src/data/lsg/attribution.json   — provenance, fetched from the sources
//   src/data/lsg/parties.json       — party → front, front names (ML/EN)
//   src/data/lsg/bodies.json        — 1,200 local bodies, voters joined
//   src/data/lsg/state.json         — state + district aggregates (static UI)
//   public/lsg-data/districts.geojson              — simplified district shapes
//   public/lsg-data/district/<slug>.json           — lazy per-district drill
//   public/lsg-data/district/<slug>.geojson        — simplified LB shapes
//
// Fetching is cached in $LSG_CACHE_DIR (default /tmp/lsg-cache) so a re-run
// without network still reproduces the committed output. Run: node
// scripts/build-lsg-data.mjs
// ─────────────────────────────────────────────────────────────────────────────

import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { feature } from 'topojson-client';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const CACHE = process.env.LSG_CACHE_DIR || '/tmp/lsg-cache';
const CDN = (p) => `https://cdn.jsdelivr.net/gh/opendatakerala/${p}`;

// ── Sources ──────────────────────────────────────────────────────────────────
const FILES = {
  // Candidate-level results — the maintained copy lives in the results repo.
  'trend_detailed_results_2025.csv':
    CDN('LSGD2025-Results-Data@main/trend_detailed_results_2025.csv'),
  'local_bodies.csv': CDN('LSG2025@main/public/data/csv/local_bodies.csv'),
  'wards.csv': CDN('LSG2025@main/public/data/csv/wards.csv'),
  'party_and_group.csv': CDN('LSG2025@main/public/data/csv/party_and_group.csv'),
  'topojson/districts.json': CDN('LSG2025@main/public/data/topojson/Kerala/districts.json'),
};

const DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode',
  'Wayanad', 'Kannur', 'Kasaragod',
];

const GRAMA = {};
for (const d of DISTRICTS) {
  GRAMA[`topojson/${d}_grama.json`] =
    CDN(`LSG2025@main/public/data/topojson/Kerala/district_maps/${d}_grama.json`);
}

// District names in the geometry carry typos the CSVs do not; local_bodies.csv
// is all-caps while the results CSV is title case. Normalize both sides.
const ALIASES = { Thiruvanathapuram: 'Thiruvananthapuram', Kasargod: 'Kasaragod' };
const titleCase = (s) => String(s).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
const normDistrict = (n) => ALIASES[titleCase(n)] || titleCase(n);

// One type label everywhere; the geometry says "Corporation", the CSV says
// "Municipal Corporation", and the state calls them municipal corporations.
const TYPE_LABEL = { 'Municipal Corporation': 'Corporation' };
const normType = (t) => TYPE_LABEL[t] || t;

// ── Small RFC-4180 parser (quotes, embedded commas, CRLF) ────────────────────
export function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const pushField = () => { row.push(field); field = ''; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') pushField();
    else if (c === '\n') { pushField(); rows.push(row); row = []; }
    else if (c === '\r') { /* skip */ }
    else field += c;
  }
  if (field !== '' || row.length) { pushField(); rows.push(row); }
  return rows.filter((r) => r.some((f) => f.trim() !== ''));
}

const csvRows = (text) => parseCsv(text.replace(/^\uFEFF/, ''));

// ── Fetch with a local cache ─────────────────────────────────────────────────
async function load(name) {
  const path = join(CACHE, name);
  try {
    await stat(path);
    return await readFile(path, 'utf8');
  } catch {
    const url = FILES[name] ?? GRAMA[name];
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch ${url}: HTTP ${res.status}`);
    const text = await res.text();
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, text);
    return text;
  }
}

// ── Aggregation ──────────────────────────────────────────────────────────────
const FRONT_ORDER = ['LDF', 'UDF', 'NDA', 'OTHERS'];

export async function aggregate() {
  // Local bodies.
  const [header, ...bodyRows] = csvRows(await load('local_bodies.csv'));
  const bodies = bodyRows.map((r) => ({
    code: r[2], name: r[3], type: normType(r[1]), district: normDistrict(r[0]), wards: +r[4],
  }));
  const bodyByCode = new Map(bodies.map((b) => [b.code, b]));

  // Registered voters per ward / body.
  const [, ...wardRows] = csvRows(await load('wards.csv'));
  const wardVoters = new Map();   // wardCode → voters
  const bodyVoters = new Map();   // lbCode → voters
  for (const r of wardRows) {
    wardVoters.set(r[1], +r[6]);                       // Total is column 6
    bodyVoters.set(r[0], (bodyVoters.get(r[0]) || 0) + +r[6]);
  }

  // Party → front.
  const [, ...partyRows] = csvRows(await load('party_and_group.csv'));
  const partyGroup = new Map(partyRows.map((r) => [r[0].toUpperCase(), r[1].toUpperCase()]));
  const groupOf = (party) => partyGroup.get((party || '').toUpperCase()) || 'OTHERS';

  // Candidate-level results → winners, LB seats, district seats.
  const [, ...candRows] = csvRows(await load('trend_detailed_results_2025.csv'));
  const wardsByLb = new Map(); // lbCode → Map<wardNo, candidates[]>
  for (const r of candRows) {
    const lb = r[2], wardNo = r[4];
    if (!wardsByLb.has(lb)) wardsByLb.set(lb, new Map());
    const ward = wardsByLb.get(lb);
    if (!ward.has(wardNo)) ward.set(wardNo, []);
    ward.get(wardNo).push({
      name: r[7], party: r[8], votes: +r[9], status: (r[10] || '').toLowerCase(),
    });
  }

  // Per LB: winner per ward, seats by front, leading front.
  const lbResults = new Map();
  for (const [lbCode, wards] of wardsByLb) {
    const winners = []; // { ward, name, party, group, votes, margin, voters }
    const seats = { LDF: 0, UDF: 0, NDA: 0, OTHERS: 0 };
    for (const [wardNo, cands] of wards) {
      const sorted = [...cands].sort((a, b) => b.votes - a.votes);
      const won = sorted.filter((c) => c.status === 'won');
      const winner = won.length ? won[0]
        : sorted.length === 1 ? sorted[0]
        : null;
      if (!winner) continue;
      const runnerUp = sorted.find((c) => c !== winner) || null;
      const group = groupOf(winner.party);
      seats[group]++;
      winners.push({
        ward: wardNo,
        name: winner.name,
        party: winner.party,
        group,
        votes: winner.votes,
        margin: runnerUp ? winner.votes - runnerUp.votes : null,
        voters: wardVoters.get(lbCode + wardNo) ?? null,
      });
    }
    const leading = leadingFront(seats);
    lbResults.set(lbCode, {
      code: lbCode,
      district: bodyByCode.get(lbCode)?.district ?? null,
      name: bodyByCode.get(lbCode)?.name ?? null,
      type: bodyByCode.get(lbCode)?.type ?? null,
      wards: bodyByCode.get(lbCode)?.wards ?? winners.length,
      declared: winners.length,
      voters: bodyVoters.get(lbCode) ?? 0,
      seats, leading,
      winners,
    });
  }

  // District aggregates. Voter counts must come from the ground layer only:
  // a block/district panchayat ward re-aggregates the same electors as the
  // grama wards beneath it, so summing all tiers triple-counts (G/B/D each
  // sum to ~22M in the source). Seats are real at every tier, so they count.
  const GROUND = new Set(['Grama Panchayat', 'Municipality', 'Corporation']);
  const districtSeats = new Map(DISTRICTS.map((d) => [d, { LDF: 0, UDF: 0, NDA: 0, OTHERS: 0, wards: 0, declared: 0, voters: 0 }]));
  for (const lb of lbResults.values()) {
    const d = districtSeats.get(lb.district);
    if (!d) continue;
    for (const f of FRONT_ORDER) d[f] += lb.seats[f];
    d.wards += lb.wards;
    d.declared += lb.declared;
    if (GROUND.has(lb.type)) d.voters += lb.voters;
  }

  return {
    bodies, bodyByCode, partyGroup, bodyVoters,
    groupOf,
    lbResults, districtSeats,
    groups: { LDF: 'എൽഡിഎഫ്', UDF: 'യുഡിഎഫ്', NDA: 'എൻഡിഎ', OTHERS: 'മറ്റുള്ളവർ' },
  };
}

export function leadingFront(seats) {
  const top = FRONT_ORDER.map((f) => [f, seats[f]]).sort((a, b) => b[1] - a[1]);
  if (top[0][1] === 0) return '—';
  return top[0][1] === top[1][1] ? 'TIE' : top[0][0];
}

// ── Geometry: topojson → simplified geojson ──────────────────────────────────
// Douglas–Peucker on [lng, lat]. Kerala is small; an equirectangular distance
// in degrees is good enough at the tolerances used here.
function simplifyRing(ring, tol) {
  if (ring.length < 4) return ring;
  // Rings are closed (first == last); the degenerate start–end chord would
  // zero every perpendicular distance, so simplify the open part and
  // re-close it.
  const closed = ring[0][0] === ring[ring.length - 1][0] && ring[0][1] === ring[ring.length - 1][1];
  const pts = closed ? ring.slice(0, -1) : ring;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  const perp = (p, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    return Math.abs((p[0] - a[0]) * dy - (p[1] - a[1]) * dx) / len;
  };
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = -1, maxI = -1;
    for (let i = s + 1; i < e; i++) {
      const d = perp(pts[i], pts[s], pts[e]);
      if (d > maxD) { maxD = d; maxI = i; }
    }
    if (maxD > tol) {
      keep[maxI] = 1;
      stack.push([s, maxI], [maxI, e]);
    }
  }
  const out = pts.filter((_, i) => keep[i]);
  if (closed) out.push(out[0]);
  return out;
}

function simplifyGeometry(geom, tol) {
  if (geom.type === 'Polygon') {
    return { ...geom, coordinates: geom.coordinates.map((r) => simplifyRing(r, tol)) };
  }
  if (geom.type === 'MultiPolygon') {
    return { ...geom, coordinates: geom.coordinates.map((p) => p.map((r) => simplifyRing(r, tol))) };
  }
  return geom;
}

export async function buildGeometry(districtRows, tol) {
  const byName = new Map(districtRows.map((d) => [d.name, d]));
  const districts = feature(JSON.parse(await load('topojson/districts.json')), 'districts');
  const out = { type: 'FeatureCollection', features: [] };
  for (const f of districts.features) {
    // The topology mixes the 14 district panchayats with urban enclaves;
    // only the district panchayat layer is the state map.
    if (f.properties.Lsgd_Type !== 'District Panchayat') continue;
    const name = normDistrict(f.properties.District);
    const d = byName.get(name);
    out.features.push({
      type: 'Feature',
      properties: d
        ? { name, slug: d.slug, leading: d.leading, seats: d.seats, declared: d.declared }
        : { name },
      geometry: simplifyGeometry(f.geometry, tol),
    });
  }
  return out;
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const t0 = Date.now();
  const agg = await aggregate();

  // Invariants — fail loudly rather than commit bad data.
  const errs = [];
  if (agg.bodies.length !== 1200) errs.push(`bodies: ${agg.bodies.length} ≠ 1200`);
  for (const [code, lb] of agg.lbResults) {
    if (!agg.bodyByCode.has(code)) errs.push(`result LB ${code} missing from local_bodies`);
    if (lb.declared > lb.wards) errs.push(`${code}: declared ${lb.declared} > wards ${lb.wards}`);
  }
  const seatsTotal = [...agg.lbResults.values()]
    .reduce((s, lb) => s + lb.seats.LDF + lb.seats.UDF + lb.seats.NDA + lb.seats.OTHERS, 0);
  const declared = [...agg.lbResults.values()].reduce((s, lb) => s + lb.declared, 0);
  if (seatsTotal !== declared) errs.push(`seats ${seatsTotal} ≠ declared ${declared}`);
  if (errs.length) {
    console.error('DATA INVARIANTS FAILED:\n  ' + errs.join('\n  '));
    process.exit(1);
  }

  // ── Write committed data files ─────────────────────────────────────────────
  const dataDir = join(ROOT, 'src/data/lsg');
  const pubDir = join(ROOT, 'public/lsg-data');
  const pubDist = join(pubDir, 'district');
  await mkdir(dataDir, { recursive: true });
  await mkdir(pubDist, { recursive: true });

  const builtAt = new Date().toISOString();
  await writeFile(join(dataDir, 'attribution.json'), JSON.stringify({
    project: 'OpenDataKerala — Kerala LSG Election Portal',
    projectUrl: 'https://opendatakerala.org/LSG2025/',
    repos: [
      { name: 'LSG2025', url: 'https://github.com/opendatakerala/LSG2025' },
      { name: 'LSGD2025-Results-Data', url: 'https://github.com/opendatakerala/LSGD2025-Results-Data' },
    ],
    sources: ['State Election Commission, Kerala', 'OpenStreetMap'],
    license: 'GPL-3.0 (code); data credited to SEC Kerala via OpenDataKerala',
    builtAt,
  }, null, 2) + '\n');

  await writeFile(join(dataDir, 'parties.json'), JSON.stringify({
    groups: {
      LDF: { label: 'എൽഡിഎഫ്', labelEn: 'LDF' },
      UDF: { label: 'യുഡിഎഫ്', labelEn: 'UDF' },
      NDA: { label: 'എൻഡിഎ', labelEn: 'NDA' },
      OTHERS: { label: 'മറ്റുള്ളവർ', labelEn: 'Others' },
    },
    party: Object.fromEntries(agg.partyGroup),
  }, null, 2) + '\n');

  await writeFile(join(dataDir, 'bodies.json'), JSON.stringify(
    agg.bodies.map((b) => ({ ...b, voters: agg.bodyVoters.get(b.code) ?? 0 }))
  ) + '\n');

  const districtRows = DISTRICTS.map((name) => {
    const s = agg.districtSeats.get(name);
    const seats = { LDF: s.LDF, UDF: s.UDF, NDA: s.NDA, OTHERS: s.OTHERS };
    return {
      name,
      slug: name.toLowerCase(),
      wards: s.wards, declared: s.declared, voters: s.voters,
      seats,
      leading: leadingFront(seats),
    };
  });
  const stateSeats = districtRows.reduce((acc, d) => {
    for (const f of FRONT_ORDER) acc[f] += d.seats[f];
    return acc;
  }, { LDF: 0, UDF: 0, NDA: 0, OTHERS: 0 });
  const typeCounts = agg.bodies.reduce((acc, b) => { acc[b.type] = (acc[b.type] || 0) + 1; return acc; }, {});
  const GROUND = new Set(['Grama Panchayat', 'Municipality', 'Corporation']);
  const stateVoters = agg.bodies
    .filter((b) => GROUND.has(b.type))
    .reduce((s, b) => s + (agg.bodyVoters.get(b.code) ?? 0), 0);
  await writeFile(join(dataDir, 'state.json'), JSON.stringify({
    builtAt,
    counts: {
      ...typeCounts,
      wards: agg.bodies.reduce((s, b) => s + b.wards, 0),
      declared,
      voters: stateVoters,
    },
    seats: stateSeats,
    districts: districtRows,
  }, null, 2) + '\n');

  // ── Write lazy drill-down data + geometry ──────────────────────────────────
  await writeFile(join(pubDir, 'districts.geojson'), JSON.stringify(
    await buildGeometry(districtRows, 0.002)
  ) + '\n');

  for (const d of districtRows) {
    const lbs = [...agg.lbResults.values()]
      .filter((lb) => lb.district === d.name)
      .map(({ code, name, type, wards, declared, voters, seats, leading, winners }) => ({
        code, name, type, wards, declared, voters, seats, leading, winners,
      }));
    await writeFile(join(pubDist, `${d.slug}.json`), JSON.stringify({ district: d, lBs: lbs }) + '\n');

    // LB geometry for the district map (grama, municipality, corporation only).
    const topo = JSON.parse(await load(`topojson/${d.name}_grama.json`));
    const fc = feature(topo, Object.keys(topo.objects)[0]);
    const geojson = { type: 'FeatureCollection', features: [] };
    for (const f of fc.features) {
      const code = f.properties.SEC_Kerala_code;
      const lb = agg.lbResults.get(code);
      if (!lb) continue; // block/district panchayat tiers have no shapes here
      geojson.features.push({
        type: 'Feature',
        properties: {
          code, name: lb.name, type: lb.type,
          leading: lb.leading, seats: lb.seats,
        },
        geometry: simplifyGeometry(f.geometry, 0.001),
      });
    }
    await writeFile(join(pubDist, `${d.slug}.geojson`), JSON.stringify(geojson) + '\n');
  }

  const sizes = [];
  for (const p of ['attribution.json', 'parties.json', 'bodies.json', 'state.json']) {
    const st = await stat(join(dataDir, p));
    sizes.push(`${p} ${(st.size / 1024).toFixed(0)}KB`);
  }
  for (const p of ['districts.geojson', ...districtRows.map((d) => `district/${d.slug}.geojson`)]) {
    const st = await stat(join(pubDir, p));
    sizes.push(`${p} ${(st.size / 1024).toFixed(0)}KB`);
  }
  console.log(`lsg data built in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(`  wards declared ${declared} / seats ${seatsTotal} / bodies ${agg.bodies.length}`);
  console.log('  ' + sizes.join('\n  '));
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  main().catch((e) => { console.error(e); process.exit(1); });
}
