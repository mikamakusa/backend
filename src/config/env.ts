function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

export const GOOGLE_CLIENT_ID = requireEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = requireEnv('GOOGLE_CLIENT_SECRET');
export const FACEBOOK_CLIENT_ID = requireEnv('FACEBOOK_CLIENT_ID');
export const FACEBOOK_CLIENT_SECRET = requireEnv('FACEBOOK_CLIENT_SECRET');
export const BASE_URL = requireEnv('BASE_URL'); // Pour callbackURL
