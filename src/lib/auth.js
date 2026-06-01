import crypto from 'crypto';

const SESSION_SECRET = process.env.SESSION_SECRET || 'geii_portfolio_super_secure_secret_key_2026';

// Helper to hash password with salt
export function hashPassword(password, salt) {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

// Verify a password
export function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  return hash === storedHash;
}

// Sign a session token (simple JWT-like token using HMAC)
export function signSession(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + 24 * 60 * 60 * 1000 })).toString('base64url');
  
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
    
  return `${header}.${body}.${signature}`;
}

// Verify a session token
export function verifySession(token) {
  if (!token) return null;
  
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  
  const [header, body, signature] = parts;
  
  // Re-sign to verify signature
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${body}`)
    .digest('base64url');
    
  if (signature !== expectedSignature) {
    return null; // Invalid signature
  }
  
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    // Check expiration
    if (payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}
