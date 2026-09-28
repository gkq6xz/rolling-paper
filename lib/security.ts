import crypto from 'crypto';

export function randomId(bytes = 8) {
  return crypto.randomBytes(bytes).toString('base64url');
}

export function randomAdminToken() {
  return crypto.randomBytes(24).toString('base64url');
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
