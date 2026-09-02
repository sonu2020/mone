import { isStructuralClass, tokenForClass, type TokenDefinition } from './token-registry';
import type { InspectionSeverity } from './lead-package';

export interface InspectionElementSnapshot {
  path: string;
  owner: string;
  classes: string[];
  inlineStyle?: string;
  computed?: Record<string, string>;
}

export interface InspectionFinding {
  id: string;
  path: string;
  owner: string;
  className: string;
  severity: InspectionSeverity;
  source: string;
  note: string;
  token?: TokenDefinition;
  evidence?: Record<string, string>;
}

export interface PreviewPatch {
  id: string;
  path: string;
  from: string;
  to: string;
  appliedAt: string;
}

export interface InspectionReport {
  scope: string;
  source: string;
  status: 'baseline' | 'findings' | 'preview-modified' | 'reset' | 'error';
  findings: InspectionFinding[];
  patches: PreviewPatch[];
  context: { theme: string; viewport: string; capturedAt: string };
  error?: string;
}

const inlineColour = /#[0-9a-f]{3,8}\b|rgb\(|rgba\(|oklch\(/i;
const arbitraryType = /^text-\[\d/;
const arbitrarySize = /^(size|w|h|min-w|min-h|max-w|max-h|gap|p|m|px|py|pt|pb|pl|pr)-\[/;
const arbitraryProperty = /^\[/;
const rawColour = /(^|-)gray-\d|^white$|^black$|^bg-white$|^text-white$|^border-white$/;

export type ClassStatus = 'approved' | 'structural' | 'review' | 'drift';

/** One classification used by both the audit report and the hover popover. */
export function classStatus(cls: string): ClassStatus {
  if (tokenForClass(cls)) return 'approved';
  if (isStructuralClass(cls)) return 'structural';
  if (arbitraryType.test(cls) || arbitrarySize.test(cls) || cls.startsWith('bg-gradient') || rawColour.test(cls)) return 'drift';
  if (cls === 'rounded-full' || arbitraryProperty.test(cls)) return 'review';
  return 'review';
}

export function inspectSnapshots(
  scope: string,
  source: string,
  elements: InspectionElementSnapshot[],
  exceptions: Map<string, string> = new Map(),
): InspectionReport {
  const findings: InspectionFinding[] = [];
  const add = (finding: InspectionFinding) => {
    if (!findings.some((existing) => existing.id === finding.id)) findings.push(finding);
  };

  elements.forEach((element) => {
    element.classes.forEach((cls) => {
      const exception = exceptions.get(`${element.owner}:${cls}`) ?? exceptions.get(cls);
      if (exception) {
        add({ id: `approved:${element.path}:${cls}`, path: element.path, owner: element.owner, className: cls, severity: 'approved', source, note: exception });
        return;
      }
      const status = classStatus(cls);
      if (status === 'drift') {
        const type = cls.startsWith('bg-gradient') ? 'gradient' : arbitraryType.test(cls) ? 'type' : arbitrarySize.test(cls) ? 'size' : 'colour';
        add({ id: `${type}:${element.path}:${cls}`, path: element.path, owner: element.owner, className: cls, severity: 'drift', source, note: 'Replace the raw value with an approved internal token.' });
      } else if (status === 'review' && !isStructuralClass(cls)) {
        const kind = cls === 'rounded-full' ? 'radius' : arbitraryProperty.test(cls) ? 'property' : 'unknown';
        const note = kind === 'radius'
          ? 'Confirm this radius is an approved compact-control exception.'
          : kind === 'property'
            ? 'Replace raw CSS-in-class values with a utility or shared variable.'
            : 'No token or structural provenance is registered for this class.';
        add({ id: `${kind}:${element.path}:${cls}`, path: element.path, owner: element.owner, className: cls, severity: 'review', source, note });
      }
    });

    if (element.inlineStyle && inlineColour.test(element.inlineStyle)) {
      add({ id: `inline:${element.path}`, path: element.path, owner: element.owner, className: 'inline-style', severity: 'review', source, note: 'Inline colour needs token provenance.', evidence: { style: element.inlineStyle } });
    }
  });

  findings.sort((a, b) => a.id.localeCompare(b.id));
  return {
    scope,
    source,
    status: findings.some((finding) => finding.severity === 'drift' || finding.severity === 'error') ? 'findings' : 'baseline',
    findings,
    patches: [],
    context: { theme: 'light', viewport: 'unknown', capturedAt: new Date().toISOString() },
  };
}

export function withPreviewPatch(report: InspectionReport, patch: PreviewPatch): InspectionReport {
  return {
    ...report,
    status: 'preview-modified',
    patches: [...report.patches, patch],
  };
}

export function resetPreview(report: InspectionReport): InspectionReport {
  return { ...report, status: report.findings.length ? 'findings' : 'reset', patches: [] };
}
