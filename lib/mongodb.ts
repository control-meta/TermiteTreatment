import { MongoClient, ServerApiVersion } from 'mongodb';

type Connection = {
  uri: string;
  client: MongoClient;
  promise: Promise<MongoClient>;
};

let connection: Connection | undefined;

declare global {
  // Share the pool across development hot reloads, including its configuration.
  // eslint-disable-next-line no-var
  var _termiteMongoConnection: Connection | undefined;
}

export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI?.trim());
}

function currentConnection(): Connection | undefined {
  return process.env.NODE_ENV === 'development' ? global._termiteMongoConnection : connection;
}

function setConnection(value: Connection | undefined) {
  if (process.env.NODE_ENV === 'development') global._termiteMongoConnection = value;
  else connection = value;
}

export async function getMongoClient(): Promise<MongoClient | null> {
  const uri = process.env.MONGODB_URI?.trim();
  const cached = currentConnection();
  if (cached && cached.uri !== uri) {
    setConnection(undefined);
    void cached.client.close().catch(() => {});
  }
  if (!uri) return null;
  const existing = currentConnection();
  if (existing) return existing.promise;

  const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  const next: Connection = { uri, client, promise: Promise.resolve(client) };
  next.promise = client.connect().catch(async error => {
    // A rejected promise must never poison future Save attempts.
    if (currentConnection() === next) setConnection(undefined);
    await client.close().catch(() => {});
    throw error;
  });
  setConnection(next);
  return next.promise;
}

export async function getDb(dbName = 'termite_pest_control') {
  const client = await getMongoClient();
  return client ? client.db(dbName) : null;
}
