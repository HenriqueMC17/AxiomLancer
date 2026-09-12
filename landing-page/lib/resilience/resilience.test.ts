import { describe, it, expect, beforeEach } from "vitest";
import { withResilience, resetAllCircuitBreakers, getCircuitBreakerState } from "./resilience";

describe("Resilience & Circuit Breaker Engine", () => {
  beforeEach(() => {
    resetAllCircuitBreakers();
  });

  it("should successfully execute a healthy action on first attempt", async () => {
    const action = async () => "OK";
    const result = await withResilience(action, { contextName: "test-success" });
    expect(result).toBe("OK");
  });

  it("should retry transient failures and succeed when recovering", async () => {
    let callCount = 0;
    const action = async () => {
      callCount++;
      if (callCount === 1) {
        throw new Error("Temporary network glitch");
      }
      return "RECOVERED";
    };

    const result = await withResilience(action, {
      maxRetries: 2,
      baseDelayMs: 10,
      contextName: "test-retry",
    });

    expect(result).toBe("RECOVERED");
    expect(callCount).toBe(2);
  });

  it("should trip Circuit Breaker to OPEN when failure threshold is reached", async () => {
    const failingAction = async () => {
      throw new Error("Persistent service outage");
    };

    // Threshold 2: fails 2 attempts in retry, which increments failures
    await expect(
      withResilience(failingAction, {
        maxRetries: 1,
        baseDelayMs: 5,
        circuitBreakerThreshold: 2,
        circuitBreakerResetTimeMs: 5000,
        contextName: "test-trip",
      })
    ).rejects.toThrow("Persistent service outage");

    const cbState = getCircuitBreakerState("test-trip");
    expect(cbState?.state).toBe("OPEN");

    // Next call should fast-fail immediately with CircuitBreakerOpenException
    await expect(
      withResilience(failingAction, {
        maxRetries: 1,
        contextName: "test-trip",
      })
    ).rejects.toThrow(/CircuitBreakerOpenException/);
  });
});
