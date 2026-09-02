import { describe, expect, it } from 'vitest';
import { LEAD_PACKAGE_CONTRACT } from './lead-package';

describe('LeadPackage inspection contract', () => {
  it('declares the canonical homepage fixture and 5/4/3 composition', () => {
    expect(LEAD_PACKAGE_CONTRACT.component).toBe('LeadPackage');
    expect(LEAD_PACKAGE_CONTRACT.fixture).toBe('homepage');
    expect(LEAD_PACKAGE_CONTRACT.layout).toContain('5/4/3');
    expect(LEAD_PACKAGE_CONTRACT.descendants.map((item) => item.id)).toContain('feed');
  });

  it('keeps optional topics and intentional exceptions explicit', () => {
    expect(LEAD_PACKAGE_CONTRACT.descendants.find((item) => item.id === 'topics')?.optional).toBe(true);
    expect(LEAD_PACKAGE_CONTRACT.exceptions.map((item) => item.id)).toEqual([
      'topic-pill-radius',
      'art-aspect-ratio',
      'standard-utility',
    ]);
  });

  it('only enables preview behavior for known source class replacements', () => {
    const preview = LEAD_PACKAGE_CONTRACT.rules.filter((rule) => rule.preview);
    expect(preview.map((rule) => [rule.from, rule.to])).toEqual([
      ['text-[0.9375rem]', 'text-lead'],
      ['size-[7px]', 'size-2'],
    ]);
    expect(LEAD_PACKAGE_CONTRACT.rules.find((rule) => rule.id === 'leadpackage-font-axis')?.preview).toBe(false);
  });
});
