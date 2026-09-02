// Client-side choropleth runtime shared by ElectionMap.astro and the
// explorer controller.
//
// The component (ElectionMap.astro) owns the static mount: it renders the
// container, a spec JSON, and a bundled script that calls mountElectionMap for
// every [data-map-spec] on the page. The explorer controller drives the same
// map instance — setData swaps its GeoJSON in place and fits the new bounds,
// so a district drill-down never mounts a second Leaflet or scrolls the page
// to a new section. One map, one boot, data swapped underneath it.
//
// The controller learns the controls through the map:ready event
// (detail.controls); feature clicks come back as map:select { id }.
// Everything here degrades quietly: if Leaflet never loads or the GeoJSON
// fetch fails, the page keeps its prose and tables.

export interface ElectionMapSpec {
  url?: string;
  /** Inline GeoJSON — used instead of url when the caller already fetched it. */
  data?: GeoJSON.FeatureCollection;
  label: string;
}

export interface ElectionMapControls {
  /** Highlight one feature (by slug/code/name), or clear the highlight. */
  focus(id: string | null): void;
  /** Refit the map to the current layer's bounds. */
  fit(): void;
  /** Replace the layer with a new collection and fit it. */
  setData(fc: GeoJSON.FeatureCollection): void;
}

const PROBE_CLASSES: Record<string, string> = {
  LDF: 'election-map__probe--ldf',
  UDF: 'election-map__probe--udf',
  NDA: 'election-map__probe--nda',
  OTHERS: 'election-map__probe--oth',
  TIE: 'election-map__probe--tie',
};

export function mountElectionMap(el: HTMLElement, spec: ElectionMapSpec): ElectionMapControls | null {
  if (!spec.url && !spec.data) return null;

  // Probes: one span per fill colour, read at boot so the map follows the
  // theme tokens (including dark mode) instead of hardcoding colours.
  const probes: Record<string, string> = {};
  const probeKeys: Record<string, string> = {
    ...PROBE_CLASSES,
    rule: 'election-map__probe--rule',
    border: 'election-map__probe--border',
    focus: 'election-map__probe--focus',
  };
  for (const [name, cls] of Object.entries(probeKeys)) {
    const span = document.createElement('span');
    span.className = `election-map__probe ${cls}`;
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    probes[name] = window.getComputedStyle(span).backgroundColor;
  }

  const layerRef: { layer: import('leaflet').GeoJSON | null } = { layer: null };
  // setData can be called before Leaflet has booted; hold the payload then.
  let pendingData: GeoJSON.FeatureCollection | null = null;
  // The boot fetch (spec.url) must not clobber a data swap that happened while
  // it was in flight — the controller's drill-down wins over the initial view.
  let overridden = false;
  let reduce = false;
  // Assigned inside mapReady so the controls close over the real Leaflet
  // instance rather than the global (which may not exist yet).
  let drawFn: ((fc: GeoJSON.FeatureCollection) => void) | null = null;

  const keyOf = (props: Record<string, unknown>): string | null =>
    (props.slug as string) || (props.code as string) || (props.name as string) || null;

  const styleFor = (feature: { properties: { leading?: string } }) => {
    const fill = probes[feature.properties.leading ?? ''] || probes.rule;
    return { color: probes.border, weight: 1.2, fillColor: fill, fillOpacity: 0.9 };
  };

  const controls: ElectionMapControls = {
    focus(id: string | null) {
      layerRef.layer?.eachLayer((feat) => {
        const props = (feat as { feature: { properties: Record<string, unknown> } }).feature.properties;
        const isFocus = id !== null && keyOf(props) === id;
        (feat as { setStyle: (s: object) => void }).setStyle(
          isFocus
            ? { weight: 3.5, color: probes.focus, dashArray: '5 3', fillOpacity: 1 }
            : styleFor({ properties: props as never }),
        );
        if (isFocus && !reduce) (feat as { bringToFront: () => void }).bringToFront();
      });
      // Zoom to the selected feature: a drill selection is a zoom to that
      // area, not just a highlight. Capped so a small panchayat never dives
      // past useful context.
      if (id === null) return;
      const map = (layerRef.layer as unknown as { _map: import('leaflet').Map | null })._map;
      if (!map) return;
      layerRef.layer?.eachLayer((feat) => {
        const props = (feat as { feature: { properties: Record<string, unknown> } }).feature.properties;
        if (keyOf(props) !== id) return;
        const b = (feat as { getBounds?: () => import('leaflet').LatLngBounds }).getBounds?.();
        if (b && b.isValid()) map.fitBounds(b, { padding: [28, 28], maxZoom: 13, animate: !reduce });
      });
    },
    fit() {
      if (layerRef.layer) {
        const b = layerRef.layer.getBounds();
        if (b.isValid()) {
          (layerRef.layer as unknown as { _map: { fitBounds: (b: unknown, o: object) => void } })
            ._map.fitBounds(b, { padding: [18, 18] });
        }
      }
    },
    setData(fc: GeoJSON.FeatureCollection) {
      if (drawFn) {
        overridden = true;
        drawFn(fc);
      } else {
        pendingData = fc;
      }
    },
  };

  window.mapReady((L: typeof import('leaflet')) => {
    reduce = window.mapReduceMotion();

    const map = L.map(el, {
      zoomControl: false,
      scrollWheelZoom: false, // the page owns the wheel
      dragging: true,
      attributionControl: true,
    });
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    drawFn = (fc: GeoJSON.FeatureCollection) => {
      if (layerRef.layer) map.removeLayer(layerRef.layer);
      const layer = L.geoJSON(fc as never, {
        style: styleFor,
        onEachFeature: (feature: never, feat: never) => {
          (feat as { on: (ev: string, fn: () => void) => void }).on('mouseover', () => {
            (feat as { setStyle: (s: object) => void }).setStyle({ weight: 2, fillOpacity: 1 });
            if (!reduce) (feat as { bringToFront: () => void }).bringToFront();
          });
          (feat as { on: (ev: string, fn: () => void) => void }).on('mouseout', () => {
            (feat as { setStyle: (s: object) => void }).setStyle(styleFor(
              (feat as { feature: { properties: { leading?: string } } }).feature,
            ));
          });
          (feat as { on: (ev: string, fn: () => void) => void }).on('click', () => {
            const id = keyOf((feat as { feature: { properties: Record<string, unknown> } }).feature.properties);
            if (id) el.dispatchEvent(new CustomEvent('map:select', { detail: { id } }));
          });
        },
      }).addTo(map);
      layerRef.layer = layer;
      const b = layer.getBounds();
      if (b.isValid()) map.fitBounds(b, { padding: [14, 14] });
      el.dispatchEvent(new CustomEvent('map:ready', { detail: { id: el.id, controls } }));
    };

    if (pendingData) {
      const fc = pendingData;
      pendingData = null;
      drawFn(fc);
    } else if (spec.data) {
      drawFn(spec.data);
    } else {
      fetch(spec.url as string)
        .then((r) => { if (!r.ok) throw new Error(`map data ${r.status}`); return r.json(); })
        .then((fc) => { if (!overridden) drawFn?.(fc as GeoJSON.FeatureCollection); })
        .catch(() => { /* the page is complete without the map */ });
    }
  });

  return controls;
}
