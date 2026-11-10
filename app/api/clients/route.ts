import { Client, ToneOfVoice } from "@/core/domain/types";
import { createClientSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { InMemoryClientRepository } from "@/infrastructure/repositories/in-memory/in-memory-client.repository";

const clientRepo = new InMemoryClientRepository();

/**
 * GET /api/clients
 * Lista exclusivamente os clientes do usuario autenticado (Zero Trust / BOLA Prevention).
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const clients = await clientRepo.listByUser(session.userId);
    return ApiResponse.ok({ clients });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/clients
 * Cadastra novo cliente corporativo associado estritamente ao session.userId.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const newClient: Client = {
      id: "cli_" + Date.now(),
      user_id: session.userId,
      legal_name: parsed.data.legal_name,
      email: parsed.data.email,
      tone_of_voice: parsed.data.tone_of_voice as ToneOfVoice,
      billing_paused: parsed.data.billing_paused ?? false,
      payment_reliability_score: 75,
      avg_payment_delay_days: 0,
      created_at: new Date().toISOString(),
    };

    const created = await clientRepo.create(newClient);
    return ApiResponse.ok({ client: created }, 201);
  } catch (err) {
    return ApiResponse.error(err);
  }
});