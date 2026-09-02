import { classStatus, inspectSnapshots, resetPreview, withPreviewPatch, type ClassStatus, type InspectionElementSnapshot, type InspectionFinding, type InspectionReport } from './audit';
import { LEAD_PACKAGE_CONTRACT, type LeadPackageRule } from './lead-package';
import { tokenForClass } from './token-registry';

interface FindingItem {
  finding: InspectionFinding;
  rule: LeadPackageRule | undefined;
}

function pathOf(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node.parentElement) {
    const tag = node.tagName.toLowerCase();
    const siblings = [...node.parentElement.children].filter((item) => item.tagName === node!.tagName);
    parts.unshift(`${tag}:${siblings.indexOf(node) + 1}`);
    node = node.parentElement;
  }
  return parts.join('>');
}

function componentName(el: Element): string {
  const source = el.getAttribute('data-astro-source-file');
  return source ? source.split('/').pop()?.replace(/\.astro$/, '') ?? 'Component' : el.tagName.toLowerCase();
}

function snapshotFixture(root: HTMLElement): InspectionElementSnapshot[] {
  return [root, ...root.querySelectorAll<HTMLElement>('*')].map((el) => ({
    path: pathOf(el),
    owner: el === root ? 'LeadPackage' : componentName(el.closest('.mc') ?? el),
    classes: [...el.classList],
    inlineStyle: el.getAttribute('style') ?? undefined,
    computed: {
      color: getComputedStyle(el).color,
      backgroundColor: getComputedStyle(el).backgroundColor,
      fontSize: getComputedStyle(el).fontSize,
      lineHeight: getComputedStyle(el).lineHeight,
    },
  }));
}

function exceptionMap(): Map<string, string> {
  return new Map(LEAD_PACKAGE_CONTRACT.exceptions.map((exception) => [`${exception.owner}:rounded-full`, exception.reason]));
}

export function initLeadPackageInspection(): void {
  if (!document.documentElement.classList.contains('mc-outline')) return;
  const app = document.querySelector<HTMLElement>('[data-inspection-app]');
  if (!app || app.dataset.inspectionInit) return;
  app.dataset.inspectionInit = 'true';

  const fixture = app.querySelector<HTMLElement>('[data-inspection-fixture="lead-package"]');
  const root = fixture?.querySelector<HTMLElement>(':scope > div > .mc, :scope > .mc');
  const panelEl = app.querySelector<HTMLElement>('[data-inspection-panel]');
  const hasPanel = panelEl !== null;
  if (!fixture || !root) return;

  const baselineClasses = new Map<string, string[]>();
  [root, ...root.querySelectorAll<HTMLElement>('*')].forEach((el) => baselineClasses.set(pathOf(el), [...el.classList]));
  let report = inspectSnapshots(LEAD_PACKAGE_CONTRACT.id, LEAD_PACKAGE_CONTRACT.source, snapshotFixture(root), exceptionMap());
  root.querySelector('article')?.setAttribute('data-inspection-part', 'lead-card');
  root.querySelector('article')?.nextElementSibling?.classList.contains('mc') && root.querySelector('article')?.nextElementSibling?.setAttribute('data-inspection-part', 'topics');
  root.querySelector('article')?.parentElement?.querySelector('div.flex.flex-col')?.setAttribute('data-inspection-part', 'row-stack');
  root.querySelector('aside')?.setAttribute('data-inspection-part', 'feed');
  let selected = root;
  let activeTarget: HTMLElement | null = null;
  let focused: HTMLElement | null = null;
  let pinned = false;

  const findingsList = (findings: InspectionFinding[]): FindingItem[] => findings.map((finding) => ({
    finding,
    rule: LEAD_PACKAGE_CONTRACT.rules.find((candidate) => candidate.from === finding.className && candidate.preview),
  }));

  const findingsMarkup = (items: FindingItem[]): string => items.length
    ? items.map(({ finding, rule }) => {
      const color = finding.severity === 'drift' ? 'var(--color-accent-red)' : 'var(--color-saffron)';
      return `<article class="border p-2" style="border-color:color-mix(in oklch,${color} 45%,transparent)"><p class="font-mono text-caption text-ink dark:text-ivory">${finding.className}</p><p class="mt-1 text-caption text-ink-muted">${finding.note}</p>${rule ? `<button type="button" data-inspection-fix="${rule.id}" class="mt-2 border border-azure px-2 py-1 text-caption text-azure">Preview ${rule.to}</button>` : ''}</article>`; }).join('')
    : '<p class="text-body-small text-ink-muted">Token-clean for the known contract.</p>';

  const reset = () => {
    [root, ...root.querySelectorAll<HTMLElement>('*')].forEach((el) => {
      const original = baselineClasses.get(pathOf(el));
      if (original) el.className = original.join(' ');
    });
    report = resetPreview(inspectSnapshots(LEAD_PACKAGE_CONTRACT.id, LEAD_PACKAGE_CONTRACT.source, snapshotFixture(root), exceptionMap()));
    render();
  };

  const copyReport = async () => {
    const payload = JSON.stringify({
      ...report,
      selectedPath: pathOf(selected),
      focused: focused ? { path: pathOf(focused), owner: componentName(focused.closest('.mc') ?? focused), text: (focused.textContent ?? '').slice(0, 96) } : null,
      target: activeTarget ? { path: pathOf(activeTarget), text: (activeTarget.textContent ?? '').slice(0, 96) } : null,
      context: { ...report.context, theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light', viewport: `${window.innerWidth}x${window.innerHeight}` },
    }, null, 2);
    try { await navigator.clipboard.writeText(payload); } catch { /* visible report remains available */ }
    panelEl?.querySelector<HTMLElement>('[data-inspection-live]')?.replaceChildren('Report copied or ready to copy from the visible findings.');
  };

  const applyRule = (id: string) => {
    const rule = LEAD_PACKAGE_CONTRACT.rules.find((candidate) => candidate.id === id);
    if (!rule || !rule.preview) return;
    [selected, ...selected.querySelectorAll<HTMLElement>('*')].forEach((el) => {
      if (!el.classList.contains(rule.from)) return;
      el.classList.replace(rule.from, rule.to);
      report = withPreviewPatch(report, { id: rule.id, path: pathOf(el), from: rule.from, to: rule.to, appliedAt: new Date().toISOString() });
    });
    const refreshed = inspectSnapshots(LEAD_PACKAGE_CONTRACT.id, LEAD_PACKAGE_CONTRACT.source, snapshotFixture(root), exceptionMap());
    report = { ...refreshed, patches: report.patches, status: 'preview-modified' };
    render();
  };

  const render = () => {
    if (!panelEl) return;
    const findings = report.findings.filter((finding) => finding.severity !== 'approved');
    const counts = findings.reduce<Record<string, number>>((acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] ?? 0) + 1;
      return acc;
    }, {});
    const chain = (el: HTMLElement): HTMLElement[] => {
      const steps: HTMLElement[] = [];
      let node: HTMLElement | null = el;
      while (node && root.contains(node)) {
        steps.unshift(node);
        if (node === root) break;
        node = node.parentElement;
      }
      return steps;
    };
    const treeEntries = focused ? chain(focused) : [root, ...root.querySelectorAll<HTMLElement>('.mc')];
    panelEl!.innerHTML = `<div class="border-b border-rule p-4 dark:border-ivory/10 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="eyebrow text-azure dark:text-azure-light">LEADPACKAGE · ${report.status.toUpperCase()}</p><h2 class="mt-1 text-section font-bold text-ink dark:text-ivory">Inspection report</h2></div><button type="button" data-inspection-copy class="border border-rule px-2 py-1 text-caption text-ink dark:text-ivory">Copy</button></div><p data-inspection-live class="mt-2 text-body-small text-ink-muted dark:text-ivory/60" aria-live="polite">${findings.length ? `${findings.length} findings · ${counts.drift ?? 0} drift · ${counts.review ?? 0} review` : 'No unresolved findings'}</p></div>${focused ? `<div class="border-b border-rule p-4 dark:border-ivory/10 sm:p-5"><div class="flex items-start justify-between gap-3"><div><p class="eyebrow text-azure dark:text-azure-light">FOCUSED ELEMENT</p><h3 class="mt-1 text-caption font-semibold text-ink dark:text-ivory">${focused.tagName.toLowerCase()} · ${componentName(focused.closest('.mc') ?? focused)}</h3><p class="mt-1 break-all font-mono text-caption text-ink-muted dark:text-ivory/60">${pathOf(focused)}</p></div><button type="button" data-inspection-close-focus class="border border-rule px-2 py-1 text-caption text-ink dark:text-ivory" aria-label="Clear focused element">×</button></div>${targetDetailsHtml(focused)}</div>` : ''}<div class="border-b border-rule p-4 dark:border-ivory/10 sm:p-5"><p class="eyebrow text-ink-muted">${focused ? 'TREE · FOCUSED PATH' : 'COMPONENT TREE'}</p><div data-inspection-tree class="mt-3 space-y-1"></div></div><div class="border-b border-rule p-4 dark:border-ivory/10 sm:p-5"><p class="eyebrow text-ink-muted">TARGET</p><div data-inspection-target class="mt-2 text-body-small text-ink dark:text-ivory">${activeTarget ? `${componentName(activeTarget)} · ${pathOf(activeTarget)}` : 'Hover or focus text in the fixture.'}</div></div><div class="p-4 sm:p-5"><div class="flex items-center justify-between gap-2"><p class="eyebrow text-ink-muted">FINDINGS</p><button type="button" data-inspection-reset class="text-caption text-azure">Reset preview</button></div><div data-inspection-findings class="mt-3 space-y-2"></div></div>`;

    const tree = panelEl!.querySelector<HTMLElement>('[data-inspection-tree]')!;
    treeEntries.forEach((node, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `block w-full border-b border-rule-light px-2 py-2 text-left text-caption ${node === focused ? 'bg-light-gray font-semibold dark:bg-brand-overlay' : ''}`;
      const isRoot = node === root;
      const name = isRoot ? 'LeadPackage' : componentName(node.closest('.mc') ?? node);
      button.textContent = `${index > 0 ? '› ' : ''}${name} · ${pathOf(node)}`;
      button.addEventListener('click', () => {
        selected.classList.remove('outline-2', 'outline-azure');
        selected = node;
        selected.classList.add('outline-2', 'outline-azure');
        selected.scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        report = inspectSnapshots(LEAD_PACKAGE_CONTRACT.id, LEAD_PACKAGE_CONTRACT.source, snapshotFixture(root), exceptionMap());
        render();
      });
      tree.appendChild(button);
    });

    const findingBox = panelEl!.querySelector<HTMLElement>('[data-inspection-findings]')!;
    findingBox.innerHTML = findingsMarkup(findingsList(findings));
    panelEl!.querySelector('[data-inspection-reset]')?.addEventListener('click', reset);
    panelEl!.querySelector('[data-inspection-copy]')?.addEventListener('click', copyReport);
    panelEl!.querySelector('[data-inspection-close-focus]')?.addEventListener('click', clearFocus);
    panelEl!.querySelectorAll<HTMLButtonElement>('[data-inspection-fix]').forEach((button) => button.addEventListener('click', () => applyRule(button.dataset.inspectionFix ?? '')));
  };

  const clearTarget = () => {
    activeTarget?.classList.remove('outline-2', 'outline-azure');
    activeTarget = null;
    if (!pinned) hidePopover();
    render();
  };

  const clearFocus = () => {
    pinned = false;
    focused = null;
    hidePopover();
    render();
  };

  // ── Hover/focus popover: token provenance at the target ──────────────────
  const chipStyle = (status: ClassStatus): string => {
    const color = status === 'drift' ? 'var(--color-accent-red)' : status === 'review' ? 'var(--color-saffron)' : status === 'approved' ? 'var(--color-azure)' : 'var(--color-ink-muted)';
    return status === 'structural'
      ? `color:${color};border-color:var(--color-rule)`
      : `color:${color};border-color:color-mix(in oklch,${color} 45%,transparent);background:color-mix(in oklch,${color} 10%,transparent)`;
  };

  const targetDetailsHtml = (target: HTMLElement): string => {
    const computed = getComputedStyle(target);
    const owner = componentName(target.closest('.mc') ?? target);
    const entries = [...target.classList].map((cls) => {
      const exception = exceptionMap().get(`${owner}:${cls}`) ?? exceptionMap().get(cls);
      const status: ClassStatus = exception ? 'approved' : classStatus(cls);
      const token = tokenForClass(cls);
      const label = status === 'approved' && token ? `${cls} → ${token.id}` : status === 'structural' ? cls : `${cls} · ${status}`;
      return { cls, status, label };
    });
    return `
      <dl class="mt-2 space-y-1 text-caption">
        <div class="flex justify-between gap-2"><dt class="text-ink-muted dark:text-ivory/60">font-size</dt><dd class="font-mono text-ink dark:text-ivory">${computed.fontSize}</dd></div>
        <div class="flex justify-between gap-2"><dt class="text-ink-muted dark:text-ivory/60">line-height</dt><dd class="font-mono text-ink dark:text-ivory">${computed.lineHeight}</dd></div>
        <div class="flex justify-between gap-2"><dt class="text-ink-muted dark:text-ivory/60">color</dt><dd class="font-mono text-ink dark:text-ivory">${computed.color}</dd></div>
      </dl>
      <div class="mt-2 flex flex-wrap gap-1">${entries.map(({ cls, status, label }) => `<span class="border px-2 py-0.5 font-mono text-caption" style="${chipStyle(status)}">${label}</span>`).join('')}</div>`;
  };

  const popover = document.createElement('div');
  popover.className = 'fixed z-50 hidden w-80 border border-rule bg-bg-card p-3 dark:bg-brand-dark';
  popover.setAttribute('role', 'tooltip');
  document.body.appendChild(popover);

  const hidePopover = () => popover.classList.add('hidden');

  const showPopover = (target: HTMLElement) => {
    const rect = target.getBoundingClientRect();
    popover.innerHTML = `
      <p class="mb-1 text-caption font-semibold text-ink dark:text-ivory">
        ${target.tagName.toLowerCase()}
        <span class="text-ink-muted dark:text-ivory/60"> · ${componentName(target.closest('.mc') ?? target)}</span>
      </p>
      <p class="break-all font-mono text-caption text-ink-muted dark:text-ivory/60">${pathOf(target)}</p>
      ${targetDetailsHtml(target)}`;
    popover.classList.remove('hidden');
    const left = Math.min(rect.left, window.innerWidth - popover.offsetWidth - 8);
    const top = rect.bottom + 8 + popover.offsetHeight <= window.innerHeight
      ? rect.bottom + 8
      : Math.max(8, rect.top - popover.offsetHeight - 8);
    popover.style.left = `${Math.max(8, left)}px`;
    popover.style.top = `${top}px`;
  };

  window.addEventListener('scroll', () => { hidePopover(); pinned = false; }, { passive: true });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      clearFocus();
      clearTarget();
    }
  });

  const inspectable = 'h1,h2,h3,p,time,a,span,img';

  fixture.addEventListener('mouseover', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(inspectable);
    if (target && fixture.contains(target)) {
      activeTarget?.classList.remove('outline-2', 'outline-azure');
      activeTarget = target;
      activeTarget.classList.add('outline-2', 'outline-azure');
      if (!pinned) showPopover(activeTarget);
      render();
    }
  });
  fixture.addEventListener('focusin', (event) => {
    const target = (event.target as HTMLElement).closest<HTMLElement>(inspectable);
    if (target && fixture.contains(target)) {
      activeTarget = target;
      showPopover(activeTarget);
      render();
    }
  });
  fixture.addEventListener('mouseleave', clearTarget);

  // Inspection override: fixture clicks pin the focused element in the
  // sidebar and never navigate away from the workspace.
  fixture.addEventListener('click', (event) => {
    const link = (event.target as HTMLElement).closest('a');
    if (link && fixture.contains(link)) event.preventDefault();
    const target = (event.target as HTMLElement).closest<HTMLElement>(`${inspectable},.mc,[data-inspection-part]`)
      ?? (event.target as HTMLElement);
    if (!target || !fixture.contains(target)) return;
    if (focused === target) {
      clearFocus();
      return;
    }
    focused = target;
    selected.classList.remove('outline-2', 'outline-azure');
    selected = focused;
    selected.classList.add('outline-2', 'outline-azure');
    pinned = !hasPanel; // without a sidebar, clicking pins the popover
    if (pinned) showPopover(focused);
    render();
  });

  render();
}
