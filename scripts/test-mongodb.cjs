// No network or live database access: exercise the actual pool/retry code with a fake driver.
const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const Module = require('node:module');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const instances = [];
let nextConnection = () => Promise.resolve();
class Client {
  constructor(uri, options) { this.uri = uri; this.options = options; this.closed = false; instances.push(this); }
  connect() { return nextConnection().then(() => this); }
  async close() { this.closed = true; }
  db(name) { return { name }; }
}
const load = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'mongodb') return { MongoClient: Client, ServerApiVersion: { v1: '1' } };
  return load.call(this, request, parent, isMain);
};
const { pageSaveError } = require('../lib/page-save-error.ts');
const originalUri = process.env.MONGODB_URI;
const originalMode = process.env.NODE_ENV;
function fresh(mode) {
  process.env.NODE_ENV = mode;
  process.env.MONGODB_URI = 'mongodb://test-user:test-password@localhost/test';
  delete global._termiteMongoConnection;
  delete require.cache[require.resolve('../lib/mongodb.ts')];
  instances.length = 0;
  return require('../lib/mongodb.ts');
}

test('a failed connection can recover on the next request in development and production', async () => {
  for (const mode of ['development', 'production']) {
    const mongo = fresh(mode);
    nextConnection = () => Promise.reject(new Error('TLS handshake rejected'));
    await assert.rejects(mongo.getMongoClient(), /TLS handshake/);
    assert.equal(instances[0].closed, true);
    nextConnection = () => Promise.resolve();
    const recovered = await mongo.getMongoClient();
    assert.equal(instances.length, 2);
    assert.equal(recovered, instances[1]);
    assert.equal(await mongo.getMongoClient(), recovered);
    assert.equal(instances.length, 2);
    assert.deepEqual(await mongo.getDb(), { name: 'termite_pest_control' });
  }
});

test('parallel requests share one pending connection and credentials changes replace the pool', async () => {
  const mongo = fresh('development');
  let resolve;
  nextConnection = () => new Promise(done => { resolve = done; });
  const first = mongo.getMongoClient();
  const second = mongo.getMongoClient();
  assert.equal(instances.length, 1);
  resolve();
  assert.equal(await first, await second);
  process.env.MONGODB_URI = 'mongodb://replacement@localhost/test';
  nextConnection = () => Promise.resolve();
  const replacement = await mongo.getMongoClient();
  assert.equal(instances[0].closed, true);
  assert.equal(replacement, instances[1]);
  assert.equal(replacement.options.serverSelectionTimeoutMS, 10000);
  assert.equal(replacement.options.tlsAllowInvalidCertificates, undefined);
  assert.equal(replacement.options.tlsInsecure, undefined);
  delete process.env.MONGODB_URI;
  assert.equal(await mongo.getDb(), null);
  assert.equal(replacement.closed, true);
});

test('save errors are actionable and do not disclose raw TLS diagnostics or credentials', () => {
  const tls = pageSaveError(Object.assign(new Error('00898B03017F0000:error:SSL routines:ssl3_read_bytes:tlsv1 alert internal error:ssl/record/rec_layer_s3.c:918'), { name: 'MongoServerSelectionError' }));
  assert.equal(tls.status, 503);
  assert.equal(tls.code, 'DATABASE_TLS_FAILED');
  assert.equal(tls.retryable, true);
  assert.match(tls.error, /not been published/);
  assert.doesNotMatch(tls.error, /ssl3|00898|rec_layer/);
  const secret = pageSaveError(new Error('mongodb://private:password@private-host/private-db'));
  assert.doesNotMatch(secret.error, /private|password/);
  assert.equal(pageSaveError({ name: 'MongoNetworkError', message: 'ECONNRESET' }).status, 503);
  assert.equal(pageSaveError({ code: 18, message: 'bad auth' }).retryable, false);
  assert.equal(pageSaveError(new Error('MongoDB is not configured')).code, 'DATABASE_NOT_CONFIGURED');
});

test.after(() => {
  if (originalUri === undefined) delete process.env.MONGODB_URI; else process.env.MONGODB_URI = originalUri;
  if (originalMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalMode;
});
