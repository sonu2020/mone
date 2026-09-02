export type InspectionSeverity = 'approved' | 'review' | 'drift' | 'error';

export interface LeadPackageDescendant {
  id: string;
  label: string;
  owner: string;
  selector: string;
  role: 'root' | 'lead' | 'topic-strip' | 'row' | 'feed' | 'text';
  optional?: boolean;
}

export interface LeadPackageException {
  id: string;
  owner: string;
  selector: string;
  reason: string;
}

export interface LeadPackageRule {
  id: string;
  owner: string;
  from: string;
  to: string;
  severity: Exclude<InspectionSeverity, 'approved'>;
  note: string;
  preview: boolean;
}

/** Manually managed source-of-truth for the first inspection surface. */
export const LEAD_PACKAGE_CONTRACT = {
  id: 'lead-package',
  component: 'LeadPackage',
  source: 'src/components/home4/LeadPackage.astro',
  fixture: 'homepage',
  maturity: 'canonical',
  layout: '12-column 5/4/3 lead, stack, feed rail',
  descendants: [
    { id: 'lead-card', label: 'Lead card', owner: 'LeadPackage', selector: '[data-inspection-part="lead-card"]', role: 'lead' },
    { id: 'topics', label: 'Topic strip', owner: 'TopicStrip', selector: '[data-inspection-part="topics"]', role: 'topic-strip', optional: true },
    { id: 'row-stack', label: 'Headline stack', owner: 'LeadPackage', selector: '[data-inspection-part="row-stack"]', role: 'row' },
    { id: 'feed', label: 'Timestamped feed', owner: 'LeadPackage', selector: '[data-inspection-part="feed"]', role: 'feed' },
  ] satisfies LeadPackageDescendant[],
  exceptions: [
    { id: 'topic-pill-radius', owner: 'TopicStrip', selector: '[data-inspection-part="topics"]', reason: 'Rounded topic pills are an intentional compact control.' },
    { id: 'art-aspect-ratio', owner: 'Art', selector: '[data-inspection-part="lead-card"]', reason: 'Inline aspect-ratio preserves missing-art geometry; it is not colour drift.' },
    { id: 'standard-utility', owner: 'LeadPackage', selector: '[data-inspection-fixture="lead-package"]', reason: 'Standard structural utilities are not custom-token drift by themselves.' },
  ] satisfies LeadPackageException[],
  rules: [
    { id: 'leadpackage-arbitrary-type', owner: 'LeadPackage', from: 'text-[0.9375rem]', to: 'text-lead', severity: 'drift', note: 'Map the raw font size to a named typography token.', preview: true },
    { id: 'leadpackage-arbitrary-size', owner: 'LeadPackage', from: 'size-[7px]', to: 'size-2', severity: 'drift', note: 'Map the raw size to a named spacing token.', preview: true },
    { id: 'leadpackage-radius', owner: 'LeadPackage', from: 'rounded-full', to: 'rounded-none', severity: 'review', note: 'Confirm rounded geometry is an approved compact-control exception.', preview: false },
    { id: 'leadpackage-font-axis', owner: 'LeadPackage', from: '[font-variation-settings:', to: 'var(--font-wdth) / var(--font-wght)', severity: 'review', note: 'Use the shared font-axis variables.', preview: false },
  ] satisfies LeadPackageRule[],
} as const;

export type LeadPackageContract = typeof LEAD_PACKAGE_CONTRACT;
