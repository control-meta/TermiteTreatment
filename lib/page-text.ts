export const textAttributes = ['placeholder', 'aria-label', 'title', 'alt', 'label'] as const;
export type TextAttribute = typeof textAttributes[number] | 'value';
export type PageTextOverride = {
  selector: string;
  kind: 'text' | 'attribute';
  index?: number;
  attribute?: TextAttribute;
  source: string;
  value: string;
};
export type PageTextOverrides = Record<string, PageTextOverride>;
export type PageTextEntry = { key: string; label: string; value: string; source: string; attribute?: string };

export function textOverrideKey(entry: Pick<PageTextOverride, 'selector' | 'kind' | 'index' | 'attribute'>): string {
  return `${entry.selector}::${entry.kind === 'text' ? `text:${entry.index}` : entry.attribute}`;
}

// Only the selectors and text attributes produced by the editor are accepted.
// URLs, styles, HTML, form values, and event handlers are never editable through this layer.
const selectorPattern = /^(?:body|#[A-Za-z][\w-]*)(?: > [a-z][a-z0-9-]*:nth-of-type\([1-9]\d*\))*$/;
export function validateTextOverrides(input: unknown): PageTextOverrides {
  if (input === undefined) return {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid page text changes.');
  const entries = Object.entries(input);
  if (entries.length > 2500) throw new Error('Too many text changes on one page.');
  const result: PageTextOverrides = {};
  for (const [key, raw] of entries) {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid text change.');
    const entry = raw as PageTextOverride;
    if (typeof entry.selector !== 'string' || entry.selector.length > 2000 || !selectorPattern.test(entry.selector)
      || typeof entry.source !== 'string' || typeof entry.value !== 'string'
      || entry.source.length > 30000 || entry.value.length > 30000) throw new Error('Invalid text change.');
    if (entry.kind === 'text') {
      if (!Number.isInteger(entry.index) || entry.index! < 0 || entry.index! > 1000) throw new Error('Invalid text position.');
    } else if (entry.kind !== 'attribute' || ![...textAttributes, 'value'].includes(entry.attribute!)) {
      throw new Error('This text attribute cannot be edited.');
    }
    if (key !== textOverrideKey(entry)) throw new Error('Invalid text identifier.');
    result[key] = {
      selector: entry.selector, kind: entry.kind, source: entry.source, value: entry.value,
      ...(entry.kind === 'text' ? { index: entry.index } : { attribute: entry.attribute }),
    };
  }
  return result;
}
