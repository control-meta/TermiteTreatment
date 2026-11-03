'use client';

import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  LockKeyhole,
} from 'lucide-react';
import styles from './editor.module.css';

type Props = {
  type: 'location' | 'service' | 'local_service';
  slug: string;
  initialData: any;
};

export default function LivePageEditor({ type, slug, initialData }: Props) {
  const [data, setData] = useState<any>(initialData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showFieldsSidebar, setShowFieldsSidebar] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clickBlockedNotice, setClickBlockedNotice] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const targetUrl =
    type === 'location'
      ? `/locations/${slug}`
      : type === 'service'
      ? `/services/${slug}`
      : data.url || `/locations/${data.citySlug}/${data.serviceSlug}`;

  const previewSrc = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}admin_preview=1`;

  // Listen for click/submit block notifications and direct text edits from inside the preview iframe
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === 'PREVIEW_CLICK_BLOCKED') {
        setClickBlockedNotice(true);
        const timer = setTimeout(() => setClickBlockedNotice(false), 2600);
        return () => clearTimeout(timer);
      }

      if (event.data?.type === 'PREVIEW_TEXT_CHANGED' && event.data.payload) {
        const {
          field,
          faqIndex,
          faqPart,
          benefitIndex,
          benefitPart,
          stepIndex,
          stepPart,
          areaIndex,
          id,
          text,
        } = event.data.payload;

        setHasUnsavedChanges(true);

        setData((prev: any) => {
          const updated = { ...prev };

          if (field) {
            if (field === 'titleMain') {
              updated.title = text;
            } else {
              updated[field] = text;
            }
            return updated;
          }

          if (faqIndex !== null && faqIndex !== undefined && faqPart) {
            const faqs = [...(updated.faqs || [])];
            if (faqs[faqIndex]) {
              if (Array.isArray(faqs[faqIndex])) {
                const tuple = [...faqs[faqIndex]];
                tuple[faqPart === 'question' ? 0 : 1] = text;
                faqs[faqIndex] = tuple;
              } else {
                faqs[faqIndex] = {
                  ...faqs[faqIndex],
                  [faqPart]: text,
                };
              }
              updated.faqs = faqs;
            }
            return updated;
          }

          if (benefitIndex !== null && benefitIndex !== undefined && benefitPart) {
            const benefits = [...(updated.benefits || [])];
            if (benefits[benefitIndex]) {
              if (Array.isArray(benefits[benefitIndex])) {
                const tuple = [...benefits[benefitIndex]];
                tuple[benefitPart === 'title' ? 0 : 1] = text;
                benefits[benefitIndex] = tuple;
              } else {
                benefits[benefitIndex] = {
                  ...benefits[benefitIndex],
                  [benefitPart === 'title' ? 'title' : 'description']: text,
                };
              }
              updated.benefits = benefits;
            }
            return updated;
          }

          if (stepIndex !== null && stepIndex !== undefined && stepPart) {
            const steps = [...(updated.steps || [])];
            if (steps[stepIndex]) {
              if (Array.isArray(steps[stepIndex])) {
                const tuple = [...steps[stepIndex]];
                tuple[stepPart === 'title' ? 0 : 1] = text;
                steps[stepIndex] = tuple;
              } else {
                steps[stepIndex] = {
                  ...steps[stepIndex],
                  [stepPart === 'title' ? 'heading' : 'text']: text,
                };
              }
              updated.steps = steps;
            }
            return updated;
          }

          if (areaIndex !== null && areaIndex !== undefined) {
            const areas = [...(updated.areas || [])];
            areas[areaIndex] = text;
            updated.areas = areas;
            return updated;
          }

          // Fallbacks based on element ID
          if (id === 'location-title' || id === 'service-hero-title') {
            if (type === 'location') updated.heroTitle = text;
            else updated.title = text;
          } else if (id === 'overview-title' || id === 'local-overview-title') {
            updated.definitionTitle = text;
          } else if (id === 'process-title' || id === 'local-process-title') {
            updated.processTitle = text;
          }

          return updated;
        });
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [type]);

  function handleIframeLoad() {
    try {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      // Inject disabled styling
      const styleId = 'admin-preview-guards';
      if (!doc.getElementById(styleId)) {
        const style = doc.createElement('style');
        style.id = styleId;
        style.textContent = `
          a, button:not([data-allow-preview]), input[type="submit"], input[type="button"], [role="button"]:not([data-allow-preview]) {
            cursor: not-allowed !important;
          }
          summary {
            cursor: pointer !important;
          }
        `;
        doc.head.appendChild(style);
      }

      // Catch and disable any navigation clicks inside the iframe
      const interceptAction = (e: Event) => {
        const target = (e as MouseEvent).target as HTMLElement | null;
        if (target?.closest('summary')) return;

        const actionable = target?.closest(
          'a, button, input[type="submit"], input[type="button"], [role="button"]'
        );
        if (actionable || e.type === 'submit') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          setClickBlockedNotice(true);
          setTimeout(() => setClickBlockedNotice(false), 2600);
        }
      };

      doc.addEventListener('click', interceptAction as EventListener, true);
      doc.addEventListener('submit', interceptAction as EventListener, true);
      if (iframe.contentWindow) {
        iframe.contentWindow.addEventListener('click', interceptAction as EventListener, true);
        iframe.contentWindow.open = () => null;
      }
    } catch {
      // ignore
    }
  }

  function refreshPreview() {
    if (iframeRef.current) {
      iframeRef.current.src = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}admin_preview=1&preview_t=${Date.now()}`;
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage('');

    // Scrape live DOM text from the iframe to ensure anything typed right before save is saved
    const payloadData = { ...data };
    try {
      const doc = iframeRef.current?.contentDocument;
      if (doc) {
        doc.querySelectorAll('[data-edit-field]').forEach((el) => {
          const field = el.getAttribute('data-edit-field');
          const val = (el as HTMLElement).innerText.trim();
          if (field && val) {
            if (field === 'titleMain') {
              payloadData.title = val;
            } else {
              payloadData[field] = val;
            }
          }
        });

        doc.querySelectorAll('[data-edit-faq-index]').forEach((el) => {
          const idx = parseInt(el.getAttribute('data-edit-faq-index') || '-1', 10);
          const part = el.getAttribute('data-edit-faq-part');
          const val = (el as HTMLElement).innerText.trim();
          if (idx >= 0 && part && val && payloadData.faqs?.[idx]) {
            if (Array.isArray(payloadData.faqs[idx])) {
              const tuple = [...payloadData.faqs[idx]];
              tuple[part === 'question' ? 0 : 1] = val;
              payloadData.faqs[idx] = tuple;
            } else {
              payloadData.faqs[idx] = { ...payloadData.faqs[idx], [part]: val };
            }
          }
        });

        doc.querySelectorAll('[data-edit-benefit-index]').forEach((el) => {
          const idx = parseInt(el.getAttribute('data-edit-benefit-index') || '-1', 10);
          const part = el.getAttribute('data-edit-benefit-part');
          const val = (el as HTMLElement).innerText.trim();
          if (idx >= 0 && part && val && payloadData.benefits?.[idx]) {
            if (Array.isArray(payloadData.benefits[idx])) {
              const tuple = [...payloadData.benefits[idx]];
              tuple[part === 'title' ? 0 : 1] = val;
              payloadData.benefits[idx] = tuple;
            } else {
              payloadData.benefits[idx] = {
                ...payloadData.benefits[idx],
                [part === 'title' ? 'title' : 'description']: val,
              };
            }
          }
        });

        doc.querySelectorAll('[data-edit-step-index]').forEach((el) => {
          const idx = parseInt(el.getAttribute('data-edit-step-index') || '-1', 10);
          const part = el.getAttribute('data-edit-step-part');
          const val = (el as HTMLElement).innerText.trim();
          if (idx >= 0 && part && val && payloadData.steps?.[idx]) {
            if (Array.isArray(payloadData.steps[idx])) {
              const tuple = [...payloadData.steps[idx]];
              tuple[part === 'title' ? 0 : 1] = val;
              payloadData.steps[idx] = tuple;
            } else {
              payloadData.steps[idx] = {
                ...payloadData.steps[idx],
                [part === 'title' ? 'heading' : 'text']: val,
              };
            }
          }
        });

        doc.querySelectorAll('[data-edit-area-index]').forEach((el) => {
          const idx = parseInt(el.getAttribute('data-edit-area-index') || '-1', 10);
          const val = (el as HTMLElement).innerText.trim();
          if (idx >= 0 && val && payloadData.areas) {
            payloadData.areas[idx] = val;
          }
        });
      }
    } catch {
      // ignore
    }

    try {
      const res = await fetch('/api/admin/pages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          slug,
          data: payloadData,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      setHasUnsavedChanges(false);
      setData(payloadData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4500);
      refreshPreview();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  }

  // FAQ Handlers
  function updateFaq(index: number, field: 'question' | 'answer', value: string) {
    const updated = [...(data.faqs || [])];
    if (Array.isArray(updated[index])) {
      // Handle tuple [q, a]
      const tuple = [...updated[index]];
      tuple[field === 'question' ? 0 : 1] = value;
      updated[index] = tuple;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setData({ ...data, faqs: updated });
  }

  function addFaq() {
    const current = data.faqs || [];
    const isTuple = current.length > 0 && Array.isArray(current[0]);
    const newItem = isTuple ? ['New Question?', 'Answer details here...'] : { question: 'New Question?', answer: 'Answer details here...' };
    setData({ ...data, faqs: [...current, newItem] });
  }

  function removeFaq(index: number) {
    const updated = (data.faqs || []).filter((_: any, i: number) => i !== index);
    setData({ ...data, faqs: updated });
  }

  return (
    <div className={styles.editorRoot}>
      {/* Top Action Bar */}
      <header className={styles.editorNav}>
        <div className={styles.navLeft}>
          <a href="/admin" className={styles.backBtn}>
            <ArrowLeft size={16} />
            <span>Dashboard</span>
          </a>
          <div className={styles.divider} />
          <h1 className={styles.pageTitle}>
            Editing {type === 'location' ? 'Location' : type === 'service' ? 'Service' : 'Localized Service'}: <span>{data.name || data.title}</span>
          </h1>
          <div className={styles.liveBadge} title="Direct in-place text editing is active! Click any headline, paragraph, card, or FAQ on the page to edit it.">
            <span className={styles.liveDot} />
            <span>Click &amp; Edit Live</span>
          </div>
        </div>

        <div className={styles.deviceControls}>
          <button
            type="button"
            className={`${styles.deviceBtn} ${previewDevice === 'desktop' ? styles.activeDevice : ''}`}
            onClick={() => setPreviewDevice('desktop')}
            title="Desktop View"
          >
            <Monitor size={17} />
          </button>
          <button
            type="button"
            className={`${styles.deviceBtn} ${previewDevice === 'tablet' ? styles.activeDevice : ''}`}
            onClick={() => setPreviewDevice('tablet')}
            title="Tablet View (768px)"
          >
            <Tablet size={17} />
          </button>
          <button
            type="button"
            className={`${styles.deviceBtn} ${previewDevice === 'mobile' ? styles.activeDevice : ''}`}
            onClick={() => setPreviewDevice('mobile')}
            title="Mobile View (390px)"
          >
            <Smartphone size={17} />
          </button>
          <button
            type="button"
            onClick={refreshPreview}
            className={styles.refreshBtn}
            title="Refresh Preview Frame"
          >
            <RefreshCw size={15} />
          </button>

          <button
            type="button"
            className={`${styles.toggleFieldsBtn} ${showFieldsSidebar ? styles.active : ''}`}
            onClick={() => setShowFieldsSidebar(!showFieldsSidebar)}
            title={showFieldsSidebar ? 'Hide Form Fields Panel' : 'Show Form Fields Panel'}
          >
            <span>{showFieldsSidebar ? '✕ Close Form' : '📋 Form Fields'}</span>
          </button>
        </div>

        <div className={styles.navRight}>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" className={styles.externalLink}>
            <span>View Live</span>
            <ExternalLink size={14} />
          </a>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`${styles.publishBtn} ${hasUnsavedChanges ? styles.saveBtnHasUnsaved : ''}`}
          >
            <Save size={16} />
            <span>{saving ? 'Publishing...' : hasUnsavedChanges ? 'Save to MongoDB *' : 'Save to MongoDB'}</span>
          </button>
        </div>
      </header>

      {/* Notifications */}
      {saveSuccess && (
        <div className={styles.successToast}>
          <CheckCircle2 size={18} />
          <span>Content saved to MongoDB and published live with instant cache revalidation!</span>
        </div>
      )}
      {errorMessage && (
        <div className={styles.errorToast}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Split Workspace */}
      <div className={styles.workspace}>
        {/* Optional Form Panel (collapsed by default for pure visual editing) */}
        {showFieldsSidebar && (
          <aside className={styles.formPanel}>
            <div className={styles.formScroll}>
            {type === 'location' ? (
              <div className={styles.formFields}>
                <section className={styles.formGroup}>
                  <h3>Hero Section</h3>
                  <label className={styles.fieldLabel}>
                    <span>Hero Headline</span>
                    <input
                      type="text"
                      value={data.heroTitle || `Termite Treatment in ${data.name}`}
                      onChange={e => setData({ ...data, heroTitle: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Hero Subtitle / Tagline</span>
                    <input
                      type="text"
                      value={data.heroLead || 'Protect Your Home & Business with Expert Termite Control Services'}
                      onChange={e => setData({ ...data, heroLead: e.target.value })}
                    />
                  </label>
                </section>

                <section className={styles.formGroup}>
                  <h3>About the City</h3>
                  <label className={styles.fieldLabel}>
                    <span>City Official Name</span>
                    <input
                      type="text"
                      value={data.officialName || data.name}
                      onChange={e => setData({ ...data, officialName: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>State</span>
                    <input
                      type="text"
                      value={data.state || ''}
                      onChange={e => setData({ ...data, state: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>About Paragraph</span>
                    <textarea
                      rows={5}
                      value={data.about || ''}
                      onChange={e => setData({ ...data, about: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Local Property Context</span>
                    <textarea
                      rows={4}
                      value={data.context || ''}
                      onChange={e => setData({ ...data, context: e.target.value })}
                    />
                  </label>
                </section>

                <section className={styles.formGroup}>
                  <h3>Coverage Areas</h3>
                  <label className={styles.fieldLabel}>
                    <span>Areas (comma separated)</span>
                    <textarea
                      rows={3}
                      value={Array.isArray(data.areas) ? data.areas.join(', ') : data.areas || ''}
                      onChange={e => setData({ ...data, areas: e.target.value.split(',').map((s: string) => s.trim()) })}
                    />
                  </label>
                </section>

                <section className={styles.formGroup}>
                  <div className={styles.groupHeader}>
                    <h3>Frequently Asked Questions</h3>
                    <button type="button" onClick={addFaq} className={styles.addBtn}>
                      <Plus size={14} /> Add FAQ
                    </button>
                  </div>

                  <div className={styles.faqList}>
                    {(data.faqs || []).map((faq: any, index: number) => {
                      const q = Array.isArray(faq) ? faq[0] : faq.question;
                      const a = Array.isArray(faq) ? faq[1] : faq.answer;

                      return (
                        <div key={index} className={styles.faqItem}>
                          <div className={styles.faqHeader}>
                            <span>FAQ #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className={styles.deleteBtn}
                              title="Delete Question"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question"
                            value={q || ''}
                            onChange={e => updateFaq(index, 'question', e.target.value)}
                          />
                          <textarea
                            rows={3}
                            placeholder="Answer"
                            value={a || ''}
                            onChange={e => updateFaq(index, 'answer', e.target.value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : (
              <div className={styles.formFields}>
                <section className={styles.formGroup}>
                  <h3>Service Overview</h3>
                  <label className={styles.fieldLabel}>
                    <span>Service Title</span>
                    <input
                      type="text"
                      value={data.title || ''}
                      onChange={e => setData({ ...data, title: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Accent Subtitle</span>
                    <input
                      type="text"
                      value={data.accent || ''}
                      onChange={e => setData({ ...data, accent: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Hero Introduction</span>
                    <textarea
                      rows={4}
                      value={data.intro || ''}
                      onChange={e => setData({ ...data, intro: e.target.value })}
                    />
                  </label>
                </section>

                <section className={styles.formGroup}>
                  <h3>Definition &amp; Details</h3>
                  <label className={styles.fieldLabel}>
                    <span>Definition Heading</span>
                    <input
                      type="text"
                      value={data.definitionTitle || ''}
                      onChange={e => setData({ ...data, definitionTitle: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Definition Text</span>
                    <textarea
                      rows={4}
                      value={data.definition || ''}
                      onChange={e => setData({ ...data, definition: e.target.value })}
                    />
                  </label>

                  <label className={styles.fieldLabel}>
                    <span>Benefits Section Heading</span>
                    <input
                      type="text"
                      value={data.benefitTitle || ''}
                      onChange={e => setData({ ...data, benefitTitle: e.target.value })}
                    />
                  </label>
                </section>

                <section className={styles.formGroup}>
                  <div className={styles.groupHeader}>
                    <h3>Service FAQs</h3>
                    <button type="button" onClick={addFaq} className={styles.addBtn}>
                      <Plus size={14} /> Add FAQ
                    </button>
                  </div>

                  <div className={styles.faqList}>
                    {(data.faqs || []).map((faq: any, index: number) => {
                      const q = Array.isArray(faq) ? faq[0] : faq.question;
                      const a = Array.isArray(faq) ? faq[1] : faq.answer;

                      return (
                        <div key={index} className={styles.faqItem}>
                          <div className={styles.faqHeader}>
                            <span>FAQ #{index + 1}</span>
                            <button
                              type="button"
                              onClick={() => removeFaq(index)}
                              className={styles.deleteBtn}
                              title="Delete Question"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <input
                            type="text"
                            placeholder="Question"
                            value={q || ''}
                            onChange={e => updateFaq(index, 'question', e.target.value)}
                          />
                          <textarea
                            rows={3}
                            placeholder="Answer"
                            value={a || ''}
                            onChange={e => updateFaq(index, 'answer', e.target.value)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            )}
          </div>
        </aside>
        )}

        {/* Right Live Preview Panel */}
        <main className={styles.previewPanel}>
          <div className={styles.visualHintBanner}>
            <span>💡 <strong>Direct Live Editing:</strong> Click on any headline, paragraph, card, or FAQ directly on the webpage to edit it live. Changes save instantly to MongoDB.</span>
          </div>

          <div className={`${styles.deviceFrame} ${styles[previewDevice]}`}>
            <div className={styles.frameHeader}>
              <div className={styles.trafficLights}>
                <span />
                <span />
                <span />
              </div>
              <div className={styles.addressBar}>
                <span>https://termitepestcontrol.co.in{targetUrl}</span>
              </div>
              <div
                className={styles.previewLockBadge}
                title="Direct in-place text editing active. Click any text to edit."
              >
                <LockKeyhole size={11} />
                <span>Text Editable</span>
              </div>
            </div>

            <iframe
              ref={iframeRef}
              src={previewSrc}
              onLoad={handleIframeLoad}
              title="Live Graphical Page Preview"
              className={styles.previewIframe}
            />

            {clickBlockedNotice && (
              <div className={styles.previewToast} role="status">
                <AlertCircle size={15} />
                <span>Buttons &amp; links are disabled in Live Preview so you won&apos;t accidentally open another page.</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

