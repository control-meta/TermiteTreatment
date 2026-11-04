import { textAttributes, textOverrideKey, type PageTextOverride, type PageTextOverrides } from './page-text';

export const mappedTextSelector = '[data-edit-field], [data-edit-faq-part], [data-edit-benefit-part], [data-edit-step-part], [data-edit-area-index]';
const excludedSelector = 'script, style, noscript, template, svg, canvas, iframe, nextjs-portal, [data-text-editor-ignore]';

export function isPageTextElement(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && !el.closest(excludedSelector);
}

export function pageTextSelector(el: Element): string {
  if (el === document.body) return 'body';
  if (el.id && /^[A-Za-z][\w-]*$/.test(el.id) && document.querySelectorAll(`[id="${el.id}"]`).length === 1) return `#${el.id}`;
  const parent = el.parentElement;
  if (!parent) return 'body';
  const siblings = Array.from(parent.children).filter(sibling => sibling.tagName === el.tagName);
  return `${pageTextSelector(parent)} > ${el.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(el) + 1})`;
}

export function ownTextNodes(el: Element): Text[] {
  return Array.from(el.childNodes).filter((node): node is Text => node.nodeType === Node.TEXT_NODE);
}

export function textLabel(el: Element, attribute?: string): string {
  if (attribute) return `${attribute === 'alt' ? 'Image description' : attribute === 'aria-label' ? 'Accessible label' : attribute === 'value' ? 'Button text' : attribute === 'label' ? 'Option label' : attribute[0].toUpperCase() + attribute.slice(1)} · ${el.tagName.toLowerCase()}`;
  if (el.closest('option')) return 'Dropdown option';
  if (el.closest('button, input[type="submit"], input[type="button"]')) return 'Button';
  if (el.closest('label')) return 'Form label';
  if (el.closest('summary')) return 'FAQ question';
  if (el.closest('nav')) return 'Navigation';
  if (el.closest('footer')) return 'Footer';
  if (el.closest('a')) return 'Link';
  if (el.closest('h1, h2, h3, h4, h5, h6')) return 'Heading';
  return 'Page text';
}

export function attributeTargets(el: Element): PageTextOverride[] {
  const attributes: string[] = [...textAttributes];
  if (el instanceof HTMLInputElement && ['submit', 'button', 'reset'].includes(el.type)) attributes.push('value');
  return attributes.filter(attribute => el.hasAttribute(attribute)).map(attribute => ({
    selector: pageTextSelector(el), kind: 'attribute', attribute: attribute as PageTextOverride['attribute'],
    source: el.getAttribute(attribute)!, value: el.getAttribute(attribute)!,
  }));
}

export type AppliedTextChange = { target: Element | Text; attribute?: string; source: string; value: string };

export function applyPageTextOverrides(overrides: PageTextOverrides, onApplied?: (change: AppliedTextChange) => void): void {
  for (const override of Object.values(overrides)) {
    let el: Element | null;
    try { el = document.querySelector(override.selector); } catch { continue; }
    if (!el || !isPageTextElement(el)) continue;
    if (override.kind === 'attribute' && override.attribute) {
      if (override.attribute === 'value' && !(el instanceof HTMLInputElement && ['submit', 'button', 'reset'].includes(el.type))) continue;
      const current = el.getAttribute(override.attribute);
      if (current === override.source && current !== override.value) {
        onApplied?.({ target: el, attribute: override.attribute, source: current, value: override.value });
        el.setAttribute(override.attribute, override.value);
      }
    } else {
      if (el instanceof HTMLTextAreaElement) continue;
      const node = ownTextNodes(el)[override.index!];
      // A changed source means the template/content moved. Never replace unrelated copy.
      if (node?.data === override.source && node.data !== override.value) {
        if (el instanceof HTMLOptionElement && !el.hasAttribute('value')) el.value = el.value;
        onApplied?.({ target: node, source: node.data, value: override.value });
        node.data = override.value;
      }
    }
  }
}

export function overrideForNode(node: Text): PageTextOverride {
  const parent = node.parentElement!;
  return { selector: pageTextSelector(parent), kind: 'text', index: ownTextNodes(parent).indexOf(node), source: node.data, value: node.data };
}

export { textOverrideKey };

export function restorePageTextChanges(changes: Iterable<AppliedTextChange>): void {
  for (const change of changes) {
    if (change.target instanceof Text) {
      if (change.target.data === change.value) change.target.data = change.source;
    } else if (change.attribute && change.target.getAttribute(change.attribute) === change.value) {
      change.target.setAttribute(change.attribute, change.source);
    }
  }
}
