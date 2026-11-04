type SaveError = { status: number; code: string; error: string; retryable: boolean };

export function pageSaveError(error: unknown): SaveError {
  const failure = error as { name?: string; code?: string | number; message?: string; cause?: { code?: string; message?: string } } | null;
  const message = `${failure?.message || ''} ${failure?.cause?.message || ''} ${failure?.cause?.code || ''}`;
  if (/MongoDB is not configured/i.test(message)) {
    return { status: 503, code: 'DATABASE_NOT_CONFIGURED', error: 'The database is not configured. Your changes have not been published. Ask the site administrator to configure MongoDB.', retryable: false };
  }
  if (/TLS|SSL|certificate|secure connection/i.test(message)) {
    return { status: 503, code: 'DATABASE_TLS_FAILED', error: 'The secure database connection failed. Your changes have not been published. Check MongoDB Atlas network access and cluster status, then retry saving.', retryable: true };
  }
  if (failure?.code === 18 || /AuthenticationFailed|authentication failed|bad auth/i.test(message)) {
    return { status: 503, code: 'DATABASE_AUTH_FAILED', error: 'The database rejected its sign-in credentials. Your changes have not been published. Ask the site administrator to check the MongoDB credentials.', retryable: false };
  }
  if (/^Mongo(?:ServerSelection|Network|NetworkTimeout|TopologyClosed|NotConnected|OperationTimeout)/.test(failure?.name || '') || /ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN/.test(`${failure?.code} ${message}`)) {
    return { status: 503, code: 'DATABASE_UNAVAILABLE', error: 'The database is unavailable. Your changes have not been published. Check the database connection, then retry saving.', retryable: true };
  }
  return { status: 500, code: 'SAVE_FAILED', error: 'Your changes could not be published. Your edits are still on this page. Please try saving again.', retryable: true };
}
