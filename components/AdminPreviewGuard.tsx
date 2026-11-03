'use client';

import { useEffect } from 'react';

export default function AdminPreviewGuard() {
  useEffect(() => {
    // Only activate if running inside an iframe or admin_preview parameter is present
    const isInsideIframe = typeof window !== 'undefined' && window.self !== window.top;
    const hasPreviewParam =
      typeof window !== 'undefined' &&
      (window.location.search.includes('admin_preview=1') ||
        window.location.search.includes('preview=true'));

    if (!isInsideIframe && !hasPreviewParam) {
      return;
    }

    // 1. Inject styles for live inline visual editing & navigation prevention
    const styleEl = document.createElement('style');
    styleEl.id = 'admin-preview-guard-styles';
    styleEl.textContent = `
      /* Hide standard floating buttons inside preview so canvas is completely clear */
      aside[aria-label="Quick contact buttons"],
      div[aria-label="Quick booking"] {
        display: none !important;
      }

      /* Non-text buttons & links: show disabled cursor and block navigation */
      a:not([contenteditable="true"]),
      button:not([contenteditable="true"]):not([data-allow-preview]),
      input[type="submit"],
      input[type="button"] {
        cursor: not-allowed;
      }

      /* Hover highlight on all editable text elements */
      h1, h2, h3, h4, h5, h6,
      p,
      summary,
      figcaption,
      [data-edit-field],
      [data-edit-faq-part],
      [data-edit-benefit-part],
      [data-edit-step-part],
      [data-edit-area-index],
      [data-edit-area-text] {
        position: relative;
        cursor: text !important;
        transition: outline 0.15s ease, background-color 0.15s ease;
      }

      h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover,
      p:hover,
      summary:hover,
      figcaption:hover,
      [data-edit-field]:hover,
      [data-edit-faq-part]:hover,
      [data-edit-benefit-part]:hover,
      [data-edit-step-part]:hover,
      [data-edit-area-index]:hover,
      [data-edit-area-text]:hover {
        outline: 2px dashed #16a34a !important;
        outline-offset: 3px !important;
        border-radius: 4px !important;
        background-color: rgba(22, 163, 74, 0.04) !important;
      }

      /* Active element being edited */
      [contenteditable="true"] {
        outline: 2px solid #16a34a !important;
        outline-offset: 3px !important;
        border-radius: 4px !important;
        background-color: rgba(22, 163, 74, 0.08) !important;
        caret-color: #16a34a !important;
        cursor: text !important;
      }

      /* Top visual editor banner */
      #preview-visual-editor-banner {
        position: fixed;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        background: #14532d;
        color: #fff;
        padding: 5px 14px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.02em;
        box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 6px;
        pointer-events: none;
        user-select: none;
        opacity: 0.95;
      }
      #preview-visual-editor-banner span.dot {
        width: 7px;
        height: 7px;
        background: #4ade80;
        border-radius: 50%;
        animation: pulseDot 1.5s infinite;
      }
      @keyframes pulseDot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.4; transform: scale(0.85); }
      }
    `;
    document.head.appendChild(styleEl);

    // Add visual banner
    const banner = document.createElement('div');
    banner.id = 'preview-visual-editor-banner';
    banner.innerHTML = '<span class="dot"></span> Live Click &amp; Edit Mode Active';
    document.body.appendChild(banner);

    let activeEditableEl: HTMLElement | null = null;

    function sendUpdate(el: HTMLElement) {
      const field = el.getAttribute('data-edit-field');
      const faqIndex = el.getAttribute('data-edit-faq-index');
      const faqPart = el.getAttribute('data-edit-faq-part');
      const benefitIndex = el.getAttribute('data-edit-benefit-index');
      const benefitPart = el.getAttribute('data-edit-benefit-part');
      const stepIndex = el.getAttribute('data-edit-step-index');
      const stepPart = el.getAttribute('data-edit-step-part');
      const areaIndex = el.getAttribute('data-edit-area-index');

      const text = el.innerText.trim();

      try {
        window.parent.postMessage(
          {
            type: 'PREVIEW_TEXT_CHANGED',
            payload: {
              field,
              faqIndex: faqIndex !== null ? parseInt(faqIndex, 10) : null,
              faqPart,
              benefitIndex: benefitIndex !== null ? parseInt(benefitIndex, 10) : null,
              benefitPart,
              stepIndex: stepIndex !== null ? parseInt(stepIndex, 10) : null,
              stepPart,
              areaIndex: areaIndex !== null ? parseInt(areaIndex, 10) : null,
              id: el.id || null,
              tagName: el.tagName.toLowerCase(),
              text,
            },
          },
          '*'
        );
      } catch {
        // ignore
      }
    }

    // 2. Intercept click events
    const handleCaptureClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find if clicking inside an editable text element
      const editableTarget = target.closest(
        'h1, h2, h3, h4, h5, h6, p, summary, figcaption, [data-edit-field], [data-edit-faq-part], [data-edit-benefit-part], [data-edit-step-part], [data-edit-area-index], [data-edit-area-text]'
      ) as HTMLElement | null;

      if (editableTarget) {
        // Prevent parent links or buttons from navigating
        e.preventDefault();
        e.stopPropagation();

        if (activeEditableEl && activeEditableEl !== editableTarget) {
          activeEditableEl.contentEditable = 'false';
          sendUpdate(activeEditableEl);
        }

        activeEditableEl = editableTarget;
        editableTarget.contentEditable = 'true';
        editableTarget.focus();
        return;
      }

      // If clicked outside active editable element, finish editing
      if (activeEditableEl && !activeEditableEl.contains(target)) {
        activeEditableEl.contentEditable = 'false';
        sendUpdate(activeEditableEl);
        activeEditableEl = null;
      }

      // If clicked on any other interactive element (buttons, forms, anchors without editable text)
      const actionable = target.closest(
        'a, button, input[type="submit"], input[type="button"], [role="button"]'
      );
      if (actionable) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();

        try {
          window.parent.postMessage({ type: 'PREVIEW_CLICK_BLOCKED' }, '*');
        } catch {
          // ignore error
        }
      }
    };

    // 3. Handle live input changes while typing
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (target && target.isContentEditable) {
        sendUpdate(target);
      }
    };

    // 4. Handle blur (focus lost)
    const handleBlur = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.isContentEditable) {
        target.contentEditable = 'false';
        sendUpdate(target);
        if (activeEditableEl === target) {
          activeEditableEl = null;
        }
      }
    };

    // 5. Intercept keydown (Enter on headings, Escape to blur)
    const handleCaptureKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.isContentEditable) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        target.blur();
        return;
      }

      // On headings and summaries, prevent Enter from inserting line breaks
      if (
        e.key === 'Enter' &&
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SUMMARY', 'SPAN'].includes(target.tagName)
      ) {
        e.preventDefault();
        target.blur();
      }
    };

    // 6. Intercept form submit events
    const handleCaptureSubmit = (e: SubmitEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    };

    // 7. Prevent window.open
    try {
      window.open = () => null;
    } catch {
      // ignore
    }

    window.addEventListener('click', handleCaptureClick, true);
    document.addEventListener('input', handleInput, true);
    document.addEventListener('blur', handleBlur, true);
    window.addEventListener('keydown', handleCaptureKeyDown, true);
    document.addEventListener('submit', handleCaptureSubmit, true);

    return () => {
      styleEl.remove();
      banner.remove();
      window.removeEventListener('click', handleCaptureClick, true);
      document.removeEventListener('input', handleInput, true);
      document.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('keydown', handleCaptureKeyDown, true);
      document.removeEventListener('submit', handleCaptureSubmit, true);
    };
  }, []);

  return null;
}
