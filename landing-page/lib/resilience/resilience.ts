import { logger } from "@/lib/observability/logger";

export interface ResilientActionOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  contextName?: string;
  circuitBreakerThreshold?: number;
  circuitBreakerResetTimeMs?: number;
}

interface CircuitBreakerState {
  failures: number;
  openUntil: number;
  state: "CLOSED" | "OPEN" | "HALF_OPEN";
}

// In-memory circuit breaker map keyed by context
const circuitBreakers = new Map<string, CircuitBreakerState>();

/**
 * Resilient Action Wrapper
 * Wraps asynchronous operations with exponential backoff retries and an in-memory Circuit Breaker.
 * Modeled after enterprise resilience patterns in .agente-core.
 */
export async function withResilience<T>(
  action: () => Promise<T>,
  options: ResilientActionOptions = {}
): Promise<T> {
  const {
    maxRetries = 2,
    baseDelayMs = 200,
    contextName = "default-resilient-action",
    circuitBreakerThreshold = 4,
    circuitBreakerResetTimeMs = 20000,
  } = options;

  let cb = circuitBreakers.get(contextName);
  if (!cb) {
    cb = { failures: 0, openUntil: 0, state: "CLOSED" };
    circuitBreakers.set(contextName, cb);
  }

  const now = Date.now();

  // Check if Circuit Breaker is OPEN
  if (cb.state === "OPEN") {
    if (now > cb.openUntil) {
      cb.state = "HALF_OPEN";
      logger.info(`Circuit breaker transitioned to HALF_OPEN for context: ${contextName}`);
    } else {
      logger.warn(`Circuit breaker OPEN for ${contextName}. Fast-failing execution.`);
      throw new Error(`CircuitBreakerOpenException: Operation ${contextName} temporarily suspended.`);
    }
  }

  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const result = await action();

      // On successful execution: reset breaker
      if (cb.failures > 0 || cb.state !== "CLOSED") {
        logger.info(`Circuit breaker CLOSED for ${contextName}. System healthy.`);
        cb.failures = 0;
        cb.state = "CLOSED";
        cb.openUntil = 0;
      }

      return result;
    } catch (err: unknown) {
      attempt++;
      cb.failures++;

      if (cb.failures >= circuitBreakerThreshold) {
        cb.state = "OPEN";
        cb.openUntil = Date.now() + circuitBreakerResetTimeMs;
        logger.error(`Circuit breaker TRIPPED to OPEN for ${contextName}. Failures=${cb.failures}`, err);
      }

      if (attempt > maxRetries) {
        logger.error(`Max retries (${maxRetries}) exceeded for ${contextName}. Operation failed.`, err, {
          attempt,
          failures: cb.failures,
        });
        throw err;
      }

      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      logger.warn(`Action failed for ${contextName}. Retrying in ${delay}ms...`, {
        attempt,
        nextDelayMs: delay,
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Fatal: Unreachable execution state in withResilience for ${contextName}`);
}

/**
 * Utility to manually inspect or reset a breaker state (useful for tests and telemetry)
 */
export function getCircuitBreakerState(contextName: string): CircuitBreakerState | undefined {
  return circuitBreakers.get(contextName);
}

export function resetAllCircuitBreakers(): void {
  circuitBreakers.clear();
}
