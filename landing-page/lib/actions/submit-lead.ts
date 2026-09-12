"use server";

import { LeadCaptureSchema, ActionState } from "@/lib/schemas/lead-capture-schema";
import { withResilience } from "@/lib/resilience/resilience";
import { logger } from "@/lib/observability/logger";

/**
 * Server Action for Lead Submissions
 * Implements strict Fail Fast validation using Zod, structured logging,
 * and resilient execution via Circuit Breaker with exponential backoff.
 */
export async function submitLeadAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const startTime = Date.now();
  const rawEmail = formData.get("email");
  const rawSource = formData.get("source") || "hero_lead_capture";

  // Fail Fast Zod Schema Validation
  const validatedFields = LeadCaptureSchema.safeParse({
    email: rawEmail,
    source: rawSource,
  });

  if (!validatedFields.success) {
    const formattedErrors = validatedFields.error.flatten().fieldErrors;
    logger.warn("Lead validation failed", {
      source: String(rawSource),
      errors: formattedErrors,
    });

    return {
      success: false,
      message: "Falha na validação dos dados.",
      errors: {
        email: formattedErrors.email,
      },
    };
  }

  const { email, source } = validatedFields.data;

  try {
    // Encapsulate downstream persistence / CRM webhook with Circuit Breaker
    await withResilience(
      async () => {
        // Simulated secure database / CRM insertion
        // In production: await db.insert(leads).values({ email, source, createdAt: new Date() })
        return { recorded: true, email };
      },
      {
        contextName: "lead-submission-db",
        maxRetries: 2,
        baseDelayMs: 150,
      }
    );

    const latencyMs = Date.now() - startTime;
    logger.info("Lead registered successfully", {
      email,
      source,
      latencyMs,
    });

    return {
      success: true,
      message: "Acesso antecipado liberado! Verifique seu e-mail para ativar o trial.",
    };
  } catch (error: unknown) {
    logger.error("Failed to register lead under resilient action", error, {
      email,
      source,
    });

    return {
      success: false,
      message: "Erro temporário de conexão. Por favor, tente novamente em instantes.",
    };
  }
}
