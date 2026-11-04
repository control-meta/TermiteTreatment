'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import PublishedContentRefresh from './PublishedContentRefresh';
import { textAttributes, type PageTextEntry, type PageTextOverride, type PageTextOverrides } from '../lib/page-text';
import { applyPageTextOverrides, restorePageTextChanges, type AppliedTextChange, attributeTargets, isPageTextElement, mappedTextSelector, overrideForNode, pageTextSelector, textLabel, textOverrideKey } from '../lib/page-text-dom';

const emptyOverrides: PageTextOverrides = {};

type Target = { entry: PageTextEntry; element: HTMLElement; node?: Text; override?: PageTextOverride; mapped?: boolean };

export default function AdminPreviewGuard({ textOverrides = emptyOverrides }: { textOverrides?: PageTextOverrides }) {
  const pathname = usePathname();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const preview = window.self !== window.top || params.get('admin_preview') === '1' || params.get('preview') === 'true';
    if (!preview && Object.keys(textOverrides).length === 0) return;
    const draft = { ...textOverrides };
    let editing = true;
    let disposed = false;
    let timer: ReturnType<typeof setTimeout>;
    const applied = new Set<AppliedTextChange>();
    const targets = new Map<string, Target>();
    const mappedElements = new Map<HTMLElement, string | null>();
    const knownNodes = new WeakSet<Text>();
    let popover: HTMLElement | null = null;
    const style = document.createElement('style');
    style.setAttribute('data-text-editor-ignore', '');
    style.textContent = `
      [data-preview-editable], [data-preview-text-target] { cursor: text !important; caret-color: #15803d; }
      [data-preview-editable]:hover, [data-preview-text-target]:hover { outline: 2px dashed #16a34a; outline-offset: 3px; }
      [data-preview-editable]:focus { outline: 2px solid #16a34a; outline-offset: 3px; background-color: #16a34a0f; }
      #page-text-editor-popover { position: fixed; z-index: 2147483647; width: min(360px, calc(100vw - 24px)); padding: 14px; max-height: calc(100dvh - 24px); overflow: auto; border: 1px solid #9ac7a5; border-radius: 12px; background: #fff; color: #173d2d; box-shadow: 0 10px 40px #173d2d40; font: 14px/1.5 Arial, sans-serif; }
      #page-text-editor-popover label { display: block; font: 600 13px/1.5 Arial, sans-serif; }
      #page-text-editor-popover textarea { display: block; width: 100%; min-height: 80px; max-height: 240px; margin: 8px 0; padding: 10px; border: 1px solid #a7c6ad; border-radius: 7px; color: #173d2d; background: #fff; font: 15px/1.5 Arial, sans-serif; resize: vertical; }
      #page-text-editor-popover button { padding: 7px 14px; border: 0; border-radius: 6px; background: #173d2d; color: white; cursor: pointer; font: 600 13px/1.5 Arial, sans-serif; }
      #page-text-editor-popover small { margin-left: 10px; color: #53705c; font: 12px/1.5 Arial, sans-serif; }
    `;
    const draftElement = document.createElement('script');
    draftElement.type = 'application/json';
    draftElement.id = 'page-text-overrides-draft';
    draftElement.setAttribute('data-text-editor-ignore', '');
    if (preview) {
      document.head.appendChild(style);
      document.body.appendChild(draftElement);
    }

    const post = (type: string, payload: unknown) => window.parent.postMessage({ type, payload }, window.location.origin);
    const publishDraft = () => {
      draftElement.textContent = JSON.stringify(draft);
      post('PREVIEW_TEXT_OVERRIDES_CHANGED', draft);
    };
    const publishCatalog = () => {
      const entries = Array.from(targets.values()).filter(target => target.element.isConnected).map(target => ({ ...target.entry, value: read(target) }));
      post('PREVIEW_TEXT_CATALOG', entries);
    };
    function read(target: Target): string {
      if (target.mapped) return (target.element.innerText ?? target.element.textContent ?? '').trim();
      if (target.node) return target.node.data;
      return target.element.getAttribute(target.override!.attribute!) || '';
    }
    function sendMapped(el: HTMLElement) {
      const index = (name: string) => el.hasAttribute(name) ? Number(el.getAttribute(name)) : null;
      post('PREVIEW_TEXT_CHANGED', {
        field: el.getAttribute('data-edit-field'),
        faqIndex: index('data-edit-faq-index'), faqPart: el.getAttribute('data-edit-faq-part'),
        benefitIndex: index('data-edit-benefit-index'), benefitPart: el.getAttribute('data-edit-benefit-part'),
        stepIndex: index('data-edit-step-index'), stepPart: el.getAttribute('data-edit-step-part'),
        areaIndex: index('data-edit-area-index'), text: (el.innerText ?? el.textContent ?? '').trim(),
      });
    }
    function write(target: Target, value: string) {
      if (target.mapped) {
        // Keep icons and existing inline elements intact when using the text panel.
        const walker = document.createTreeWalker(target.element, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        while (walker.nextNode()) if (walker.currentNode.parentElement && isPageTextElement(walker.currentNode.parentElement!)) nodes.push(walker.currentNode as Text);
        if (nodes.length) { nodes[0].data = value; nodes.slice(1).forEach(node => { node.data = ''; }); }
        else target.element.appendChild(document.createTextNode(value));
        target.element.setAttribute('data-preview-dirty', '');
        sendMapped(target.element);
      } else {
        if (target.node) {
          if (target.element instanceof HTMLOptionElement && !target.element.hasAttribute('value')) target.element.value = target.element.value;
          target.node.data = value;
        } else target.element.setAttribute(target.override!.attribute!, value);
        const override = { ...target.override!, value };
        if (value === override.source) delete draft[target.entry.key];
        else draft[target.entry.key] = override;
        publishDraft();
      }
      target.entry.value = value;
      publishCatalog();
    }

    function scan() {
      if (disposed) return;
      applyPageTextOverrides(draft, change => { if (!preview) applied.add(change); });
      if (!preview) return;
      document.querySelectorAll<HTMLElement>(mappedTextSelector).forEach(el => {
        if (!isPageTextElement(el) || mappedElements.has(el)) return;
        mappedElements.set(el, el.getAttribute('contenteditable'));
        el.contentEditable = editing ? 'plaintext-only' : 'false';
        if (editing) el.setAttribute('data-preview-editable', '');
        const key = `mapped:${pageTextSelector(el)}`;
        targets.set(key, { element: el, mapped: true, entry: { key, label: textLabel(el), source: (el.innerText ?? el.textContent ?? '').trim(), value: (el.innerText ?? el.textContent ?? '').trim() } });
      });
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      for (const node of nodes) {
        const el = node.parentElement;
        if (!el || !isPageTextElement(el) || el.closest('textarea') || el.closest(mappedTextSelector) || knownNodes.has(node)) continue;
        const raw = overrideForNode(node);
        const key = textOverrideKey(raw);
        if (!node.data.trim() && !draft[key]) continue;
        knownNodes.add(node);
        const saved = draft[key];
        const override = saved && (node.data === saved.source || node.data === saved.value) ? saved : raw;
        targets.set(key, { element: el, node, override, entry: { key, label: textLabel(el), source: override.source, value: node.data } });
        if (editing && !(el instanceof HTMLOptionElement)) el.setAttribute('data-preview-text-target', '');
      }
      document.body.querySelectorAll('*').forEach(el => {
        if (!isPageTextElement(el)) return;
        for (const raw of attributeTargets(el)) {
          const key = textOverrideKey(raw);
          if (targets.has(key) && targets.get(key)!.element === el) continue;
          const saved = draft[key];
          const override = saved && (raw.value === saved.source || raw.value === saved.value) ? saved : raw;
          targets.set(key, { element: el, override, entry: { key, label: textLabel(el, raw.attribute), attribute: raw.attribute, source: override.source, value: readAttribute(el, raw.attribute!) } });
        }
      });
      publishCatalog();
    }
    function readAttribute(el: Element, attribute: string) { return el.getAttribute(attribute) || ''; }
    function closePopover() { popover?.remove(); popover = null; }
    function openPopover(target: Target) {
      closePopover();
      popover = document.createElement('div');
      popover.id = 'page-text-editor-popover';
      popover.setAttribute('data-text-editor-ignore', '');
      popover.setAttribute('role', 'dialog');
      popover.setAttribute('aria-label', `Edit ${target.entry.label.toLowerCase()}`);
      const label = document.createElement('label');
      label.textContent = `Edit ${target.entry.label.toLowerCase()}`;
      const input = document.createElement('textarea');
      input.value = read(target);
      input.maxLength = 30000;
      input.setAttribute('aria-label', 'Text content');
      input.addEventListener('input', () => write(target, input.value));
      label.appendChild(input);
      const done = document.createElement('button');
      done.textContent = 'Done';
      done.type = 'button';
      done.addEventListener('click', closePopover);
      const hint = document.createElement('small');
      hint.textContent = 'Save changes to publish.';
      popover.append(label, done, hint);
      const rect = target.element.getBoundingClientRect();
      popover.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 372))}px`;
      popover.style.top = `${Math.max(12, Math.min(rect.bottom + 8, window.innerHeight - 220))}px`;
      document.body.appendChild(popover);
      input.focus();
      input.select();
    }
    function targetAtClick(element: Element, event: MouseEvent): Target | undefined {
      const candidates = Array.from(targets.values()).filter(target => target.node && (target.element.contains(element) || element.contains(target.element)));
      for (const target of candidates) {
        const range = document.createRange();
        const text = target.node!.data;
        const start = text.length - text.trimStart().length;
        const end = text.trimEnd().length;
        if (start >= end) continue;
        range.setStart(target.node!, start);
        range.setEnd(target.node!, end);
        if (Array.from(range.getClientRects()).some(rect => rect.width > 0 && rect.height > 0 && event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom)) return target;
      }
      // A container may cover the entire hero or page. Only actual text bounds
      // count as an edit target; padding, icons and background clicks do not.
      return undefined;
    }
    function handleClick(e: MouseEvent) {
      const el = e.target;
      if (!(el instanceof Element) || el.closest('[data-text-editor-ignore]')) return;
      if (editing && !(e.altKey && el.closest('button, summary'))) {
        const mapped = el.closest<HTMLElement>(mappedTextSelector);
        if (mapped) {
          closePopover();
          // Clicking an FAQ arrow toggles its answer; clicking its wording edits it.
          if (el.closest('svg') && mapped.tagName === 'SUMMARY') { e.stopPropagation(); return; }
          e.stopPropagation();
          if (mapped.closest('summary, a, button')) {
            e.preventDefault();
            mapped.focus();
            const doc = document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null; caretRangeFromPoint?: (x: number, y: number) => Range | null };
            const position = doc.caretPositionFromPoint?.(e.clientX, e.clientY);
            const range = doc.caretRangeFromPoint?.(e.clientX, e.clientY);
            const node = position?.offsetNode ?? range?.startContainer;
            const offset = position?.offset ?? range?.startOffset;
            if (node && offset !== undefined && mapped.contains(node)) window.getSelection()?.collapse(node, offset);
          }
          return;
        }
        const target = targetAtClick(el, e);
        if (target) {
          e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
          openPopover(target);
          return;
        }
      }
      closePopover();
      if (el.closest('a, input[type="submit"], input[type="button"], button[type="submit"]') || (el.closest('button') && el.closest('form') && !el.closest('button[type="button"]'))) {
        e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
        post('PREVIEW_CLICK_BLOCKED', null);
      }
    }
    function handleInput(e: Event) {
      const el = e.target instanceof Element ? e.target.closest<HTMLElement>(mappedTextSelector) : null;
      if (!el || el.closest('[data-text-editor-ignore]')) return;
      el.setAttribute('data-preview-dirty', '');
      sendMapped(el);
      publishCatalog();
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && popover) { e.preventDefault(); closePopover(); return; }
      if (!(e.target instanceof HTMLElement) || !e.target.isContentEditable) return;
      if (e.key === 'Escape' || (e.key === 'Enter' && e.target.closest('h1, h2, h3, h4, h5, h6, summary'))) { e.preventDefault(); e.target.blur(); }
    }
    function handleSubmit(e: Event) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); }
    function handleMessage(e: MessageEvent) {
      if (e.origin !== window.location.origin || e.source !== window.parent) return;
      if (e.data?.type === 'PREVIEW_SET_TEXT' && typeof e.data.payload?.key === 'string' && typeof e.data.payload?.value === 'string') {
        const target = targets.get(e.data.payload.key);
        if (target) write(target, e.data.payload.value);
      }
      if (e.data?.type === 'PREVIEW_SET_EDITING') {
        editing = e.data.payload !== false;
        closePopover();
        mappedElements.forEach((_, el) => { el.contentEditable = editing ? 'plaintext-only' : 'false'; if (editing) el.setAttribute('data-preview-editable', ''); else el.removeAttribute('data-preview-editable'); });
        targets.forEach(target => { if (target.node) { if (editing) target.element.setAttribute('data-preview-text-target', ''); else target.element.removeAttribute('data-preview-text-target'); } });
      }
      if (e.data?.type === 'PREVIEW_REQUEST_TEXT_CATALOG') { scan(); draftElement.textContent = JSON.stringify(draft); }
    }
    const observer = new MutationObserver(records => {
      if (records.every(record => (record.target instanceof Element ? record.target : record.target.parentElement)?.closest('[data-text-editor-ignore]'))) return;
      clearTimeout(timer);
      timer = setTimeout(scan, 60);
    });
    scan();
    if (preview) post('PREVIEW_READY', null);
    draftElement.textContent = JSON.stringify(draft);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: [...textAttributes, 'value'] });
    if (preview) {
      window.addEventListener('click', handleClick, true);
      document.addEventListener('input', handleInput, true);
      window.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('submit', handleSubmit, true);
      window.addEventListener('message', handleMessage);
    }
    return () => {
      disposed = true; clearTimeout(timer); observer.disconnect(); restorePageTextChanges(applied.values()); closePopover(); style.remove(); draftElement.remove();
      mappedElements.forEach((original, el) => { if (original === null) el.removeAttribute('contenteditable'); else el.setAttribute('contenteditable', original); el.removeAttribute('data-preview-editable'); });
      targets.forEach(target => target.element.removeAttribute('data-preview-text-target'));
      window.removeEventListener('click', handleClick, true);
      document.removeEventListener('input', handleInput, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('submit', handleSubmit, true);
      window.removeEventListener('message', handleMessage);
    };
  }, [pathname, textOverrides]);

  return <PublishedContentRefresh />;
}
