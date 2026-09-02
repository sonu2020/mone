// ============================================================================
// Dummy standfirsts — placeholder body copy for listings whose stories carry
// no excerpt of their own.
//
// The fixture set is mostly headlines: only a handful of stories have real
// excerpts, so a list that renders a description per row would render almost
// none of them and the layout could never be judged. This fills the gap the
// same way DummyImage fills a missing still.
//
// Two rules the pool follows, because placeholder copy sitting under a real
// headline is one careless step from reading as reporting:
//
//   1. Nothing specific. No names, numbers, places, dates or outcomes. Every
//      line is about the state of the coverage, not about the events, so no
//      sentence can be true or false of the story above it.
//   2. Deterministic. Picked by a hash of the story, never at random, so a
//      given headline keeps the same line across builds — a static site whose
//      copy churns on every deploy is a diffing nightmare.
//
// Replace these with real standfirsts before anything ships as journalism.
// ============================================================================

const POOL_ML = [
  'വിശദമായ റിപ്പോർട്ട് ഉടൻ. ഈ വാർത്തയുടെ പൂർണരൂപം ഇവിടെ ചേർക്കും.',
  'ഈ വാർത്തയെക്കുറിച്ചുള്ള വിശദാംശങ്ങൾ ഈ ഭാഗത്ത് വരും. തലക്കെട്ടിനു താഴെയുള്ള സംഗ്രഹത്തിന്റെ സ്ഥാനം ഇതാണ്.',
  'റിപ്പോർട്ടിന്റെ സംഗ്രഹം ഇവിടെ. ലേഖനത്തിന്റെ ആദ്യ ഖണ്ഡിക ഈ സ്ഥാനത്ത് ചേർക്കാം.',
  'വാർത്തയുടെ പശ്ചാത്തലവും പ്രധാന വിവരങ്ങളും ഈ വരികളിൽ. ഡെസ്ക് എഴുതുന്ന സ്റ്റാൻഡ്ഫസ്റ്റ് ഇവിടെ വരും.',
  'ഈ ഭാഗത്ത് ലേഖനത്തിന്റെ ചുരുക്കം ചേർക്കും. രണ്ടു വരിയിൽ കൂടുതൽ വേണ്ടിവരില്ല.',
  'തലക്കെട്ട് പറയാത്ത കാര്യങ്ങൾ ഈ സംഗ്രഹത്തിൽ. വിശദമായ റിപ്പോർട്ട് ലേഖനത്തിൽ വായിക്കാം.',
  'സംഗ്രഹത്തിനുള്ള മാതൃകാ വാചകം. യഥാർഥ ഉള്ളടക്കം ഡെസ്കിൽനിന്ന് ലഭിക്കുമ്പോൾ ഇത് മാറ്റും.',
  'ഈ വരികൾ ലേഖനത്തിന്റെ സംഗ്രഹത്തിനുള്ള ഇടം കാണിക്കുന്നു. ഉള്ളടക്കം പിന്നീട് ചേർക്കും.',
];

/** Stable non-negative hash — same string in, same index out, every build. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * A placeholder standfirst for a story, chosen by its own identity so it never
 * changes between builds.
 */
export const dummyDescription = (seed: string): string =>
  POOL_ML[hash(seed) % POOL_ML.length];

/**
 * The story's own excerpt where it has one, a placeholder where it does not.
 * Listings call this rather than reaching for the pool directly, so real copy
 * always wins and there is one place to delete when the fixtures grow up.
 */
export const blurbFor = (story: { excerpt?: string; href: string; title: string }): string =>
  story.excerpt?.trim() || dummyDescription(story.href + story.title);
