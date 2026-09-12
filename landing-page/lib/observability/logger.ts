/**
 * Structured Logger (Zero External Dependencies)
 * Implements standard JSON logging for Next.js Server Components, Actions, and APIs.
 * Compliant with .agente-core observability standards.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogPayload {
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

function formatLog(level: LogLevel, message: string, context?: Record<string, unknown>, error?: unknown): string {
  const payload: LogPayload = {
    timestamp: new Date().toISOString(),
    level,
    service: "axiomlancer-engine",
    message,
    context,
  };

  if (error instanceof Error) {
    payload.error = {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    };
  } else if (error) {
    payload.error = {
      name: "UnknownError",
      message: String(error),
    };
  }

  return JSON.stringify(payload);
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(formatLog("debug", message, context));
    }
  },
  info: (message: string, context?: Record<string, unknown>) => {
    console.log(formatLog("info", message, context));
  },
  warn: (message: string, context?: Record<string, unknown>) => {
    console.warn(formatLog("warn", message, context));
  },
  error: (message: string, error?: unknown, context?: Record<string, unknown>) => {
    console.error(formatLog("error", message, context, error));
  },
};
