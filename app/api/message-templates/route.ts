import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { InMemoryMessageTemplateRepository } from "@/infrastructure/repositories/in-memory/in-memory-message-template.repository";
import { MessageTemplateService } from "@/core/services/message-template.service";
import { AppError } from "@/core/errors/app-error";

const repo = new InMemoryMessageTemplateRepository();
const service = new MessageTemplateService(repo);

/**
 * GET /api/message-templates e /api/v1/message-templates
 * Lista todos os templates do freelancer autenticado.
 * Zero Trust: user_id extraido exclusivamente do cookie JWT HttpOnly.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const templates = await service.listByUser(session.userId);
    return NextResponse.json({ templates }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});

/**
 * POST /api/message-templates e /api/v1/message-templates
 * Cria novo template.
 * Fail Fast: Zod rejeita payloads invalidos no Service antes da persistencia.
 * Zero Trust: user_id injetado via session -- nunca do body da requisicao.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const created = await service.create(session.userId, body);
    return NextResponse.json({ template: created }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});