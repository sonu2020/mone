# LeadPackage Inspector

*Internal design-engineering inspection surface for the canonical MediaOne homepage LeadPackage.*

## Availability

The inspector is gated by the build-time flag:

```text
PUBLIC_MC_OUTLINE=true npm run dev
```

Open `/design/inspector`. Normal builds redirect the route to `/design` and do not mount active inspection controls. This is an internal design tool, not runtime authorization.

## First supported component

The first contract is `LeadPackage` from `src/components/home4/LeadPackage.astro`, rendered with the homepage data contract from `src/pages/index.astro`:

- one lead story
- four headline rows
- the timestamped feed
- `topics=[]`
- `onAir=false`
- `flushTop`

The inspected tree includes the lead card, nested Art/Media, Kicker, ThumbRow rows, feed timeline, and optional TopicStrip metadata. HeaderBar and OnAirNow are outside the LeadPackage scope.

## Provenance model

`src/styles/app.css` is the token authority. A finding is classified as one of:

- **Approved token** — class or computed value maps to an `@theme`, `:root`, or approved custom utility entry.
- **Structural utility** — layout behavior such as grid, flex, spacing, responsive variants, and line clamping.
- **Intentional exception** — a contract-owned exception such as TopicStrip compact pills or Art aspect-ratio layout.
- **Review** — a value or custom class that needs a design-engineer decision.
- **Drift** — an unapproved arbitrary value, raw color, gradient, or other baseline violation.
- **Error** — token/CSS metadata or fixture state could not be resolved.

Unknown provenance is never treated as token-clean. Reports retain the component owner, descendant path, class, computed property, CSS variable, source file, and evidence.

## Report lifecycle

1. **Baseline** — capture the canonical fixture before preview changes.
2. **Findings** — group findings by severity and descendant path.
3. **Preview modified** — apply a supported DOM-only class replacement and record before/after evidence.
4. **Reset** — restore the baseline class snapshot and clear preview patches.
5. **Copy report** — copy a JSON report containing scope, source, context, findings, and preview patches.

Preview changes never write to source files and are discarded on navigation or reload.

## LeadPackage preview rules

The first curated preview rules are intentionally narrow:

| Rule | Preview | Meaning |
|------|---------|---------|
| `text-[0.9375rem]` → `text-lead` | Yes | Replace raw typography size with the named lead scale. |
| `size-[7px]` → `size-2` | Yes | Replace the unregistered dot size with the square spacing token. |
| `rounded-full` → `rounded-none` | No | Review geometry; compact-control exceptions may be intentional. |
| Arbitrary font variation → shared axis variables | No | Review source use of `--font-wdth` and `--font-wght`. |

The rules are contract data, not a promise that every component has the same policy. Add the next component only with its own ownership and exception review.

## Interaction checklist

- [ ] Start with `PUBLIC_MC_OUTLINE=true`.
- [ ] Confirm the route is unavailable or redirects when the flag is absent.
- [ ] Select LeadPackage and nested descendants from the component tree.
- [ ] Hover and keyboard-focus text targets; confirm token/class/computed-value details update.
- [ ] Apply a preview fix; confirm before/after evidence and remaining findings change.
- [ ] Reset; confirm the original class snapshot returns.
- [ ] Copy a report; confirm scope, path, findings, context, and patches are present.
- [ ] Test light/dark themes, narrow viewport, reduced motion, Escape, and Astro navigation.
- [ ] Confirm the fixture remains readable if JavaScript fails.

## Extending the system

A future component needs:

1. a stable fixture identity;
2. a typed contract with descendant ownership and intentional exceptions;
3. token/custom-utility provenance grounded in `src/styles/app.css`;
4. pure report and preview tests;
5. browser verification for pointer, keyboard, responsive, and lifecycle states.

Do not add broad heuristic “clean” status as a substitute for a component contract.
