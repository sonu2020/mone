import { describe, expect, it } from 'vitest';
import { inspectSnapshots, resetPreview, withPreviewPatch, type InspectionElementSnapshot } from './audit';

const snapshot = (classes: string[]): InspectionElementSnapshot => ({
  path: 'section:1>p:1',
  owner: 'LeadPackage',
  classes,
});

describe('inspection audit core', () => {
  it('reports arbitrary type, raw colour, and unknown classes', () => {
    const report = inspectSnapshots('lead-package', 'src/components/home4/LeadPackage.astro', [
      snapshot(['text-[0.9375rem]', 'text-white', 'custom-unregistered']),
    ]);
    expect(report.status).toBe('findings');
    expect(report.findings.map((finding) => finding.className)).toEqual([
      'text-white',
      'text-[0.9375rem]',
      'custom-unregistered',
    ]);
  });

  it('keeps approved token and structural classes out of findings', () => {
    const report = inspectSnapshots('lead-package', 'src/components/home4/LeadPackage.astro', [
      snapshot(['text-lead', 'headline-lead', 'grid-cols-12', 'border-rule']),
    ]);
    expect(report.findings).toHaveLength(0);
    expect(report.status).toBe('baseline');
  });

  it('records preview patches and resets them without changing findings', () => {
    const report = inspectSnapshots('lead-package', 'src/components/home4/LeadPackage.astro', [snapshot(['text-[0.9375rem]'])]);
    const patched = withPreviewPatch(report, {
      id: 'leadpackage-arbitrary-type',
      path: 'section:1>p:1',
      from: 'text-[0.9375rem]',
      to: 'text-lead',
      appliedAt: '2026-08-13T00:00:00.000Z',
    });
    expect(patched.status).toBe('preview-modified');
    expect(patched.patches).toHaveLength(1);
    expect(resetPreview(patched).patches).toHaveLength(0);
  });

  it('does not treat aspect-ratio layout styles as inline colour', () => {
    const report = inspectSnapshots('lead-package', 'src/components/home4/Art.astro', [{
      ...snapshot(['bg-light-gray']),
      inlineStyle: 'aspect-ratio:5/3',
    }]);
    expect(report.findings).toHaveLength(0);
  });
});
