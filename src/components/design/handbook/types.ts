// Shared types for the layout handbook's blueprint primitives. Kept in a module
// rather than exported from a component — Astro frontmatter isn't importable.

/**
 * The whole vocabulary a band column can hold. Deliberately small: if a new
 * band needs a ninth kind, that is worth noticing before it is added.
 */
export type CellKind =
  | 'card'    // lead: still over kicker, headline, standfirst
  | 'rows'    // thumbed headline rows
  | 'rail'    // still over a timestamped list
  | 'grid'    // three-up card row
  | 'list'    // flat listing rows
  | 'video'   // four-up stills
  | 'ad'      // reserved ad box
  | 'bleed';  // full-bleed navy strip

export interface Cell {
  span: number;
  kind: CellKind;
  label?: string;
}
