/**
 * Structured logger para AxiomLancer.
 * Emite JSON lines no formato { ts, level, event, ...payload }
 * para consumo por ferramentas de APM (Datadog, Grafana Loki, etc.).
 */

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

interface LogEntry {
  ts: string;
  level: LogLevel;
  event: string;
  [key: string]: unknown;
}

function log(level: LogLevel, event: string, payload?: Record<string, unknown>): void {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...payload,
  };
  const line = JSON.stringify(entry);
  if (level === "ERROR" || level === "WARN") {
    console.error(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (event: string, payload?: Record<string, unknown>) => log("DEBUG", event, payload),
  info:  (event: string, payload?: Record<string, unknown>) => log("INFO",  event, payload),
  warn:  (event: string, payload?: Record<string, unknown>) => log("WARN",  event, payload),
  error: (event: string, payload?: Record<string, unknown>) => log("ERROR", event, payload),
};