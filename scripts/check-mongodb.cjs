// Read-only connection diagnostic. Never prints the connection string or credentials.
require('@next/env').loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');
const { MongoClient } = require('mongodb');
async function check() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) { console.error('MongoDB is not configured. Set MONGODB_URI in the server environment.'); process.exitCode = 1; return; }
  let client;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 });
    await client.connect();
    await client.db('termite_pest_control').command({ ping: 1 });
    console.log('MongoDB connection and authentication succeeded. No documents were changed.');
  } catch (error) {
    const tls = /TLS|SSL|certificate/i.test(String(error.message));
    console.error(tls
      ? 'The secure MongoDB connection failed before authentication. Check the Atlas project IP access list, cluster status, and network/firewall.'
      : 'MongoDB connection failed. Check cluster availability, network access, and the configured database credentials.');
    process.exitCode = 1;
  } finally { await client?.close().catch(() => {}); }
}
check();
