// Database configuration utility
export function getDatabaseUrl(): string {
  const dbEnv = process.env.DB_ENV || 'cloud';
  
  if (dbEnv === 'local') {
    return process.env.DATABASE_URL_LOCAL || 'file:./dev.db';
  }
  
  return process.env.DATABASE_URL || '';
}

export function getDatabaseProvider(): 'sqlite' | 'postgresql' {
  const dbEnv = process.env.DB_ENV || 'cloud';
  return dbEnv === 'local' ? 'sqlite' : 'postgresql';
}

export function getConnectionInfo() {
  const dbEnv = process.env.DB_ENV || 'cloud';
  return {
    environment: dbEnv,
    provider: getDatabaseProvider(),
    url: getDatabaseUrl(),
    isLocal: dbEnv === 'local'
  };
}