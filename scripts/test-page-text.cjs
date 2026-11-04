// Isolated regression tests; these never connect to MongoDB or modify live content.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
const { JSDOM } = require('jsdom');

for (const extension of ['.ts', '.tsx']) {
  require.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, filename);
}
const server = { authed: true, enabled: false, writes: [], paths: [], document: null, connectionError: null };
const db = { collection: () => ({
  updateOne: async (filter, update, options) => {
    for (const field of Object.keys(update.$set || {})) {
      if (Object.keys(update.$setOnInsert || {}).some(other => field === other || field.startsWith(`${other}.`) || other.startsWith(`${field}.`))) {
        throw Object.assign(new Error(`Updating the path '${field}' would create a conflict at '${field}'`), { code: 40 });
      }
    }
    const existing = server.document && Object.entries(filter).every(([key, value]) => server.document[key] === value);
    server.writes.push({ filter, update, options });
    server.document = { ...(existing ? server.document : { ...filter, ...update.$setOnInsert }), ...update.$set, _id: { toString: () => 'test-id' } };
  },
  findOne: async () => server.document,
}) };
const router = { refresh: () => { router.refreshes++; }, refreshes: 0 };
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (server.enabled && request.endsWith('/lib/auth')) return { isAuthenticated: async () => server.authed };
  if (server.enabled && request === 'next/cache') return { revalidatePath: path => server.paths.push(path) };
  if (server.enabled && request === './mongodb' && parent.filename.endsWith('/lib/content-service.ts')) return { getDb: async () => { if (server.connectionError) throw server.connectionError; return db; }, isMongoConfigured: () => true };
  if (server.enabled && request === 'next/server') return { ...originalLoad.call(this, request, parent, isMain), connection: async () => { server.connections = (server.connections || 0) + 1; } };
  if (request === 'next/navigation') return { usePathname: () => window.location.pathname, useRouter: () => router };
  return originalLoad.call(this, request, parent, isMain);
};
const React = require('react');
const { createRoot } = require('react-dom/client');
const Guard = require('../components/AdminPreviewGuard.tsx').default;
const { validateTextOverrides, textOverrideKey } = require('../lib/page-text.ts');
const { applyPageTextOverrides, overrideForNode } = require('../lib/page-text-dom.ts');

global.IS_REACT_ACT_ENVIRONMENT = true;
const fixture = `
  <header><nav><a id="home-link" href="/">Home</a><button id="menu" type="button">Services<svg><path d="M0 0" /></svg></button></nav></header>
  <main id="main">
    <h1 data-edit-field="heroTitle">Original headline</h1>
    <a id="cta" href="/contact-us"><svg><path d="M0 0" /></svg>Book a Free Inspection</a>
    <p id="nested">Protect <strong>your property</strong> today.</p>
    <form><label id="name-label">Your Name<input id="name" name="name" placeholder="Your name" aria-label="Full name" value="Customer data" /></label>
      <label>Message<textarea id="message" placeholder="Tell us about your property"></textarea></label>
      <select id="service" name="service"><option value="">Select service</option><option value="residential">Residential Treatment</option><option>Implicit value</option></select>
      <button id="submit" type="submit"><svg><path d="M0 0" /></svg>Submit Enquiry</button>
      <input id="native-submit" type="submit" value="Send request" />
    </form>
    <img id="image" alt="Property illustration" />
    <details><summary data-edit-faq-index="0" data-edit-faq-part="question">A question?<svg><path d="M0 0" /></svg></summary><p data-edit-faq-index="0" data-edit-faq-part="answer">An answer.</p></details>
  </main>
  <p id="duplicate">Home</p><footer id="footer">Thoughtful pest care.</footer>
  <script id="jsonld" type="application/ld+json">{"name":"Do not edit"}</script>
  <div id="mount" data-text-editor-ignore></div>`;

const geometryByDocument = new WeakMap();

function environment(html = fixture, preview = true) {
  const dom = new JSDOM(`<!doctype html><html><head></head><body>${html}</body></html>`, { url: `http://localhost:3000/locations/mumbai${preview ? '?admin_preview=1' : ''}`, pretendToBeVisual: true });
  for (const key of ['window', 'document', 'Node', 'NodeFilter', 'Element', 'HTMLElement', 'HTMLInputElement', 'HTMLTextAreaElement', 'HTMLOptionElement', 'MutationObserver', 'Text', 'Event', 'MouseEvent', 'MessageEvent']) global[key] = dom.window[key];
  Object.defineProperty(global, 'navigator', { value: dom.window.navigator, configurable: true });
  const textRects = new WeakMap();
  geometryByDocument.set(dom.window.document, textRects);
  // jsdom has no layout; supply explicit text bounds for click-hit tests.
  dom.window.Range.prototype.getClientRects = function () { return textRects.get(this.startContainer) || []; };
  const messages = [];
  dom.window.postMessage = message => messages.push(message);
  return { dom, messages };
}
async function mount(overrides = {}) {
  const root = createRoot(document.getElementById('mount'));
  await React.act(async () => root.render(React.createElement(Guard, { textOverrides: overrides })));
  return root;
}
async function unmount(root, dom) {
  await React.act(async () => root.unmount());
  dom.window.close();
}
function catalog(messages) { return messages.filter(message => message.type === 'PREVIEW_TEXT_CATALOG').at(-1).payload; }
function parentMessage(type, payload) { window.dispatchEvent(new window.MessageEvent('message', { origin: window.location.origin, source: window.parent, data: { type, payload } })); }
function edit(key, value) { parentMessage('PREVIEW_SET_TEXT', { key, value }); }
function textNode(element, text) {
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.data.trim() && (text === undefined || node.data.includes(text))) return node;
  }
  throw new Error('Test text node not found');
}
function textBounds(node, left = 20, top = 20, width = 180, height = 20) {
  geometryByDocument.get(node.ownerDocument).set(node, [{ left, top, right: left + width, bottom: top + height, width, height }]);
}
function clickText(element, text) {
  textBounds(textNode(element, text));
  return element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, clientX: 30, clientY: 30 }));
}
function savedDraft() { return validateTextOverrides(JSON.parse(document.getElementById('page-text-overrides-draft').textContent)); }

test('catalog includes buttons, form labels, navigation, footer, dropdowns and input/textarea placeholders', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  const entries = catalog(messages);
  for (const value of ['Home', 'Services', 'Book a Free Inspection', 'Your Name', 'Submit Enquiry', 'Thoughtful pest care.', 'Residential Treatment', 'Your name', 'Tell us about your property', 'Property illustration', 'Send request']) {
    assert.ok(entries.some(entry => entry.value.trim() === value), `Missing text: ${value}`);
  }
  assert.ok(!entries.some(entry => entry.value.includes('Do not edit') || entry.value === 'Customer data'));
  assert.equal(entries.find(entry => entry.value === 'Original headline').key.startsWith('mapped:'), true);
  await unmount(root, dom);
});

test('clicking a CTA edits its wording, preserves SVG icons and href, and survives serialization/reload on the public page', async () => {
  const { dom } = environment();
  const root = await mount();
  const cta = document.getElementById('cta');
  assert.equal(clickText(cta), false, 'CTA navigation must be prevented');
  const input = document.querySelector('#page-text-editor-popover textarea');
  assert.ok(input, 'Clicking the label must open its text editor');
  input.value = 'Schedule my inspection';
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(cta.textContent, 'Schedule my inspection');
  assert.equal(cta.getAttribute('href'), '/contact-us');
  assert.equal(cta.querySelectorAll('svg').length, 1);
  const stored = JSON.parse(JSON.stringify(savedDraft()));
  await unmount(root, dom);
  const publicEnvironment = environment(fixture, false);
  const publicRoot = await mount(stored);
  assert.equal(document.getElementById('cta').textContent, 'Schedule my inspection');
  assert.equal(document.getElementById('cta').querySelectorAll('svg').length, 1);
  assert.equal(document.querySelector('[contenteditable]'), null, 'Public page cannot be editable');
  assert.equal(document.getElementById('page-text-overrides-draft'), null);
  await unmount(publicRoot, publicEnvironment.dom);
});

test('panel edits placeholders, options, labels and native submit values without changing form submission values', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  const entries = catalog(messages);
  for (const [before, after] of [['Your name', 'Enter your full name'], ['Tell us about your property', 'How can we help?'], ['Residential Treatment', 'Home termite care'], ['Send request', 'Request a visit'], ['Implicit value', 'New wording']]) {
    edit(entries.find(entry => entry.value === before).key, after);
  }
  assert.equal(document.getElementById('name').placeholder, 'Enter your full name');
  assert.equal(document.getElementById('name').value, 'Customer data');
  assert.equal(document.getElementById('message').placeholder, 'How can we help?');
  assert.equal(document.querySelector('option[value="residential"]').textContent, 'Home termite care');
  assert.equal(document.querySelector('option[value="residential"]').value, 'residential');
  assert.equal(document.querySelectorAll('option')[2].value, 'Implicit value');
  assert.equal(document.getElementById('native-submit').value, 'Request a visit');
  const stored = savedDraft();
  await unmount(root, dom);
  const live = environment(fixture, false);
  const liveRoot = await mount(stored);
  assert.equal(document.getElementById('message').placeholder, 'How can we help?');
  assert.equal(document.querySelector('option[value="residential"]').textContent, 'Home termite care');
  assert.equal(document.querySelectorAll('option')[2].value, 'Implicit value');
  await unmount(liveRoot, live.dom);
});

test('empty copy, duplicate text and nested styles remain separate and safe', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  const entries = catalog(messages);
  edit(entries.find(entry => entry.value === 'Home').key, 'Homepage');
  assert.equal(document.getElementById('duplicate').textContent, 'Home');
  edit(entries.find(entry => entry.value === 'your property').key, '<script>alert(1)</script>');
  edit(entries.find(entry => entry.value === 'Thoughtful pest care.').key, '');
  assert.equal(document.querySelector('#nested strong').textContent, '<script>alert(1)</script>');
  assert.equal(document.querySelector('#nested script'), null);
  assert.equal(document.getElementById('footer').textContent, '');
  const stored = savedDraft();
  await unmount(root, dom);
  const live = environment(fixture, false);
  const liveRoot = await mount(stored);
  assert.equal(document.getElementById('footer').textContent, '');
  assert.equal(document.querySelector('#nested strong').textContent, '<script>alert(1)</script>');
  await unmount(liveRoot, live.dom);
  const editor = environment();
  const editorRoot = await mount(stored);
  const cleared = catalog(editor.messages).find(entry => entry.source === 'Thoughtful pest care.');
  assert.equal(cleared.value, '');
  edit(cleared.key, cleared.source);
  assert.equal(document.getElementById('footer').textContent, 'Thoughtful pest care.');
  await unmount(editorRoot, editor.dom);
});

test('mapped fields still send structured updates and preserve icons when edited from the text panel', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  const question = catalog(messages).find(entry => entry.value === 'A question?');
  edit(question.key, 'A clearer question?');
  assert.equal(document.querySelector('summary').textContent, 'A clearer question?');
  assert.equal(document.querySelectorAll('summary svg').length, 1);
  assert.ok(messages.some(message => message.type === 'PREVIEW_TEXT_CHANGED' && message.payload.faqIndex === 0 && message.payload.text === 'A clearer question?'));
  assert.ok(document.querySelector('summary').hasAttribute('data-preview-dirty'));
  await unmount(root, dom);
});

test('control mode opens menus, still blocks submissions, and discovers newly mounted text', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  parentMessage('PREVIEW_SET_EDITING', false);
  let opened = false;
  document.getElementById('menu').addEventListener('click', () => { opened = true; });
  document.getElementById('menu').dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  assert.equal(opened, true);
  const submit = new window.Event('submit', { bubbles: true, cancelable: true });
  assert.equal(document.querySelector('form').dispatchEvent(submit), false);
  const panel = document.createElement('div'); panel.id = 'dialog'; panel.textContent = 'New booking panel copy'; document.body.appendChild(panel);
  await React.act(async () => { await new Promise(resolve => setTimeout(resolve, 100)); });
  assert.ok(catalog(messages).some(entry => entry.value === 'New booking panel copy'));
  parentMessage('PREVIEW_SET_EDITING', true);
  clickText(document.getElementById('menu'), 'Services');
  assert.ok(document.querySelector('#page-text-editor-popover textarea'));
  await unmount(root, dom);
});

test('a template/source change cannot redirect a saved edit to unrelated text', () => {
  const { dom } = environment();
  const node = document.getElementById('footer').firstChild;
  const override = { ...overrideForNode(node), value: 'Saved wording' };
  const stored = { [textOverrideKey(override)]: override };
  node.data = 'Different template text';
  applyPageTextOverrides(stored);
  assert.equal(node.data, 'Different template text');
  dom.window.close();
});

test('validation rejects HTML/URL attributes, malformed positions, excessive edits and mismatched identifiers', () => {
  const base = { selector: '#cta', kind: 'text', index: 0, source: 'Before', value: 'After' };
  assert.deepEqual(validateTextOverrides({ [textOverrideKey(base)]: base }), { [textOverrideKey(base)]: base });
  for (const bad of [
    { ...base, selector: 'script, body' }, { ...base, index: -1 },
    { ...base, kind: 'attribute', attribute: 'href' }, { ...base, kind: 'attribute', attribute: 'onclick' },
    { ...base, kind: 'attribute', attribute: 'innerHTML' }, { ...base, value: 'x'.repeat(30001) },
  ]) assert.throws(() => validateTextOverrides({ [textOverrideKey(bad)]: bad }));
  assert.throws(() => validateTextOverrides({ wrong: base }));
  assert.throws(() => validateTextOverrides(Array(2)));
});


test('authenticated save/load round trip retains text overrides and refreshes the correct city-service route', async () => {
  server.enabled = true;
  const { POST } = require('../app/api/admin/pages/update/route.ts');
  const { getPageContent } = require('../lib/content-service.ts');
  const override = { selector: '#cta', kind: 'text', index: 0, source: 'Book a Free Inspection', value: 'Schedule an inspection' };
  const textOverrides = { [textOverrideKey(override)]: override };
  const body = { type: 'local_service', slug: 'delhi-ncr-residential-termite-control', data: { title: 'Edited service', textOverrides } };
  const request = () => new Request('http://localhost:3000/api/admin/pages/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  server.authed = false;
  assert.equal((await POST(request())).status, 401);
  assert.equal(server.writes.length, 0);
  server.authed = true;
  const response = await POST(request());
  assert.equal(response.status, 200);
  assert.equal(server.writes.length, 1);
  assert.deepEqual(server.writes[0].update.$set.textOverrides, textOverrides);
  assert.ok(server.paths.includes('/locations/delhi-ncr/residential-termite-control'));
  const reloaded = await getPageContent('local_service', body.slug);
  assert.deepEqual(reloaded.textOverrides, textOverrides);
  const live = environment(fixture, false);
  const root = await mount(reloaded.textOverrides);
  assert.equal(document.getElementById('cta').textContent, 'Schedule an inspection');
  await unmount(root, live.dom);
  body.data.textOverrides = { '#cta::href': { selector: '#cta', kind: 'attribute', attribute: 'href', source: '/contact-us', value: 'javascript:alert(1)' } };
  assert.equal((await POST(request())).status, 400);
  assert.equal(server.writes.length, 1);
  server.enabled = false;
});


test('leaving a page restores its changes to shared controls instead of leaking copy onto another page', async () => {
  const { dom } = environment(fixture, false);
  const original = document.getElementById('cta').firstChild;
  const text = Array.from(document.getElementById('cta').childNodes).find(node => node.nodeType === Node.TEXT_NODE);
  const override = { ...overrideForNode(text), value: 'Page-specific booking label' };
  const placeholder = { selector: '#name', kind: 'attribute', attribute: 'placeholder', source: 'Your name', value: 'Page-specific placeholder' };
  const aria = { selector: '#name', kind: 'attribute', attribute: 'aria-label', source: 'Full name', value: 'Page-specific accessible label' };
  const root = await mount({ [textOverrideKey(override)]: override, [textOverrideKey(placeholder)]: placeholder, [textOverrideKey(aria)]: aria });
  assert.equal(document.getElementById('cta').textContent, 'Page-specific booking label');
  await React.act(async () => root.unmount());
  assert.equal(document.getElementById('cta').textContent, 'Book a Free Inspection');
  assert.equal(document.getElementById('cta').firstChild, original);
  assert.equal(document.getElementById('name').placeholder, 'Your name');
  assert.equal(document.getElementById('name').getAttribute('aria-label'), 'Full name');
  dom.window.close();
});


test('the actual save API returns a retryable 503 instead of exposing an SSL stack', async () => {
  server.enabled = true;
  server.connectionError = Object.assign(new Error('SSL routines:ssl3_read_bytes:tlsv1 alert internal error:ssl/record/rec_layer_s3.c:918'), { name: 'MongoServerSelectionError' });
  const { POST } = require('../app/api/admin/pages/update/route.ts');
  const writes = server.writes.length;
  const originalError = console.error;
  let response;
  try {
    console.error = () => {};
    response = await POST(new Request('http://localhost:3000/api/admin/pages/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: 'location', slug: 'mumbai', data: { heroTitle: 'Keep my edited headline' } }) }));
  } finally { console.error = originalError; server.connectionError = null; server.enabled = false; }
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('Retry-After'), '3');
  const result = await response.json();
  assert.equal(result.code, 'DATABASE_TLS_FAILED');
  assert.equal(result.retryable, true);
  assert.match(result.error, /not been published/);
  assert.doesNotMatch(result.error, /ssl3|rec_layer/);
  assert.equal(server.writes.length, writes);
});

test('clicking Save keeps edits after failure and Retry save resends the same content', async () => {
  require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : String(key) }); };
  const Editor = require('../app/admin/edit/[type]/[slug]/LivePageEditor.tsx').default;
  const { dom } = environment();
  const root = createRoot(document.getElementById('mount'));
  const originalFetch = global.fetch;
  const requests = [];
  let succeed = false;
  global.fetch = async (_, options) => {
    requests.push(JSON.parse(options.body));
    return succeed ? { ok: true, json: async () => ({ success: true }) } : { ok: false, json: async () => ({ error: 'Secure database connection failed. Your changes have not been published.', retryable: true }) };
  };
  try {
    await React.act(async () => root.render(React.createElement(Editor, { type: 'location', slug: 'mumbai', initialData: { name: 'Mumbai', heroTitle: 'Original headline', faqs: [] } })));
    const frame = document.querySelector('iframe');
    await React.act(async () => window.dispatchEvent(new window.MessageEvent('message', { source: frame.contentWindow, origin: window.location.origin, data: { type: 'PREVIEW_TEXT_CHANGED', payload: { field: 'heroTitle', text: 'Keep my edited headline' } } })));
    const button = text => Array.from(document.querySelectorAll('button')).find(element => element.textContent.trim() === text);
    await React.act(async () => button('Save changes *').dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
    assert.equal(requests[0].data.heroTitle, 'Keep my edited headline');
    assert.match(document.querySelector('[role="alert"]').textContent, /not been published/);
    assert.ok(button('Save changes *'));
    succeed = true;
    await React.act(async () => button('Retry save').dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
    assert.deepEqual(requests[1], requests[0]);
    assert.equal(document.querySelector('[role="alert"]'), null);
    assert.ok(button('Save changes'));
    assert.equal(JSON.parse(window.localStorage.getItem('termite-treatment:content-published')).path, '/locations/mumbai');
  } finally { global.fetch = originalFetch; await React.act(async () => root.unmount()); dom.window.close(); }
});

test('every service and city has one complete hero title, including legacy MongoDB titles', () => {
  require.extensions['.css'] = module => { module.exports = new Proxy({}, { get: (_, key) => key === '__esModule' ? false : String(key) }); };
  const { renderToStaticMarkup } = require('react-dom/server');
  const Hero = require('../components/ServiceHero.tsx').default;
  const { termiteServices } = require('../lib/company.ts');
  const { locations } = require('../lib/locations.ts');
  const { serviceDetails } = require('../lib/service-details.ts');
  const { getLocalizedService } = require('../lib/location-services.ts');
  const { serviceTitle } = require('../lib/service-title.ts');
  for (const service of termiteServices) {
    for (const city of [undefined, ...locations]) {
      const detail = city ? getLocalizedService(city, service.slug) : serviceDetails[service.slug];
      const dom = new JSDOM(renderToStaticMarkup(React.createElement(Hero, { service, detail, city })));
      const h1 = dom.window.document.querySelector('h1');
      assert.equal(h1.textContent, serviceTitle(service.slug, undefined, city?.name));
      assert.equal(h1.children.length, 1);
      assert.equal(h1.querySelector('[data-edit-field="titleMain"]').textContent, h1.textContent);
      assert.equal(h1.textContent.split(/termite/i).length - 1, 1);
      dom.window.close();
    }
  }
  for (const title of ['Commercial', 'Commercial in Pune', 'Commercial Termite Protection in Pune', 'Commercial Termite Control in PuneTermite Protection in Pune']) {
    assert.equal(serviceTitle('commercial-termite-control', title, 'Pune'), 'Commercial Termite Control in Pune');
  }
  assert.equal(serviceTitle('commercial-termite-control', 'Custom care for your office', 'Pune'), 'Custom care for your office');
  assert.equal(serviceTitle('commercial-termite-control', '', 'Pune'), '');
});

test('page reads wait for a request and read changed database content on consecutive visits', async () => {
  server.enabled = true;
  server.connectionError = null;
  const { getPageContent, getLocalizedServiceContent } = require('../lib/content-service.ts');
  const before = server.connections || 0;
  try {
    for (const [type, slug] of [['location', 'mumbai'], ['service', 'commercial-termite-control'], ['local_service', 'pune-commercial-termite-control']]) {
      server.document = { _id: { toString: () => 'test-id' }, title: 'First revision', heroTitle: 'First revision' };
      assert.equal((await getPageContent(type, slug)).title, 'First revision');
      server.document.title = 'Newly published revision';
      server.document.heroTitle = 'Newly published revision';
      const content = type === 'local_service' ? await getLocalizedServiceContent('pune', 'commercial-termite-control') : await getPageContent(type, slug);
      assert.equal(content.title, 'Newly published revision');
    }
    assert.equal(server.connections - before, 6);
    server.document = { _id: { toString: () => 'test-id' }, title: 'Commercial', accent: 'Termite Protection in Puneee' };
    const legacy = await getLocalizedServiceContent('pune', 'commercial-termite-control');
    assert.equal(legacy.title, 'Commercial Termite Control in Pune');
    assert.equal(legacy.accent, '');
  } finally { server.enabled = false; server.document = null; }
});

test('public pages refresh after publishing and returning to the tab without refreshing editor drafts', async () => {
  const { publicationStorageKey } = require('../lib/content-publication.ts');
  for (const preview of [false, true]) {
    const { dom } = environment(fixture, preview);
    const root = await mount();
    router.refreshes = 0;
    const publish = path => window.dispatchEvent(new window.StorageEvent('storage', { key: publicationStorageKey, newValue: JSON.stringify({ path, at: Date.now() }) }));
    try {
      publish('/services/commercial-termite-control');
      await new Promise(resolve => setTimeout(resolve, 130));
      assert.equal(router.refreshes, 0);
      publish('/locations/mumbai');
      await new Promise(resolve => setTimeout(resolve, 130));
      assert.equal(router.refreshes, preview ? 0 : 1);
      window.dispatchEvent(new window.Event('focus'));
      document.dispatchEvent(new window.Event('visibilitychange'));
      await new Promise(resolve => setTimeout(resolve, 130));
      assert.equal(router.refreshes, preview ? 0 : 2, 'focus and visibility events should coalesce into one request');
    } finally { await unmount(root, dom); }
    window.dispatchEvent(new window.Event('focus'));
    await new Promise(resolve => setTimeout(resolve, 130));
    assert.equal(router.refreshes, preview ? 0 : 2, 'listeners must be removed on navigation');
  }
});


test('saving loaded pages repeatedly preserves createdAt and ignores client-supplied system fields', async () => {
  server.enabled = true;
  const { POST } = require('../app/api/admin/pages/update/route.ts');
  try {
    for (const [type, slug] of [['location', 'mumbai'], ['service', 'residential-termite-control'], ['local_service', 'delhi-ncr-residential-termite-control']]) {
      server.document = null;
      const save = data => POST(new Request('http://localhost:3000/api/admin/pages/update', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, slug, data }),
      }));
      const data = { title: 'First saved headline', createdAt: '1999-01-01T00:00:00.000Z', updatedAt: '1999-01-01T00:00:00.000Z', textOverrides: {} };
      assert.equal((await save(data)).status, 200);
      const createdAt = server.document.createdAt;
      assert.notEqual(createdAt, data.createdAt);
      assert.equal(createdAt, server.document.updatedAt);
      // This is the payload sent by the editor after loading an existing MongoDB document.
      const loaded = { ...server.document, _id: 'test-id', _source: 'mongodb', title: 'Edited saved headline' };
      assert.equal((await save(loaded)).status, 200);
      assert.equal(server.document.createdAt, createdAt);
      assert.equal(server.document.title, 'Edited saved headline');
      const { update, options } = server.writes.at(-1);
      assert.equal(Object.hasOwn(update.$set, 'createdAt'), false);
      assert.equal(Object.hasOwn(update.$set, '_id'), false);
      assert.equal(Object.hasOwn(update.$set, '_source'), false);
      assert.equal(options.upsert, true);
      assert.match(update.$set.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
      assert.equal((await save({ ...loaded, createdAt: '1900-01-01T00:00:00.000Z', updatedAt: '1900-01-01T00:00:00.000Z' })).status, 200);
      assert.equal(server.document.createdAt, createdAt);
      assert.notEqual(server.document.updatedAt, '1900-01-01T00:00:00.000Z');
    }
  } finally { server.enabled = false; }
});


test('blank page areas, images, icons and control padding never open a text popup', async () => {
  const { dom, messages } = environment();
  const root = await mount();
  try {
    const cta = document.getElementById('cta');
    textBounds(textNode(cta), 20, 20, 180, 20);
    const blankClick = element => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, clientX: 500, clientY: 300 }));
    for (const element of [document.body, document.getElementById('main'), document.getElementById('nested'), document.getElementById('image'), cta, cta.querySelector('svg'), document.getElementById('name')]) {
      blankClick(element);
      assert.equal(document.getElementById('page-text-editor-popover'), null, `Unexpected popup for ${element.tagName}`);
    }
    clickText(cta);
    assert.equal(document.querySelector('#page-text-editor-popover textarea').value, 'Book a Free Inspection');
    blankClick(document.getElementById('main'));
    assert.equal(document.getElementById('page-text-editor-popover'), null, 'A background click must close the popup');
    assert.equal(messages.some(message => message.type === 'PREVIEW_TEXT_OVERRIDES_CHANGED'), false);
  } finally { await unmount(root, dom); }
});

test('a click on one of several text fragments opens only that fragment, not the first text in its container', async () => {
  const { dom } = environment();
  const root = await mount();
  try {
    const paragraph = document.getElementById('nested');
    textBounds(textNode(paragraph, 'Protect'), 20, 100, 60, 20);
    textBounds(textNode(paragraph, 'your property'), 90, 100, 100, 20);
    textBounds(textNode(paragraph, 'today.'), 200, 100, 60, 20);
    paragraph.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, clientX: 220, clientY: 110 }));
    assert.equal(document.querySelector('#page-text-editor-popover textarea').value, ' today.');
    paragraph.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, clientX: 150, clientY: 200 }));
    assert.equal(document.getElementById('page-text-editor-popover'), null);
  } finally { await unmount(root, dom); }
});
