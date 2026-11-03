/**
 * In-memory rate limiter para endpoints de autenticacao.
 * Max 5 tentativas por IP em janela deslizante de 15 minutos.
 * NOTA: Para producao, usar Redis (BullMQ) para persistencia entre instancias.
 */

interface RateLimitEntry {
  attempts: number;
  windowStart: number;
}

const WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const MAX_ATTEMPTS = 5;

const store = new Map<string, RateLimitEntry>();

// Limpeza periodica para evitar memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now - entry.windowStart > WINDOW_MS) {
      store.delete(key);
    }
  }
}, WINDOW_MS);

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
  remainingAttempts: number;
}

export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    store.set(ip, { attempts: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0, remainingAttempts: MAX_ATTEMPTS - 1 };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.windowStart);
    return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1000), remainingAttempts: 0 };
  }

  entry.attempts += 1;
  store.set(ip, entry);
  return { allowed: true, retryAfterSeconds: 0, remainingAttempts: MAX_ATTEMPTS - entry.attempts };
}

export function resetRateLimit(ip: string): void {
  store.delete(ip);
}