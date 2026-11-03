import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { InMemoryMessageTemplateRepository } from "@/infrastructure/repositories/in-memory/in-memory-message-template.repository";
import { MessageTemplateService } from "@/core/services/message-template.service";
import { AppError } from "@/core/errors/app-error";

const repo = new InMemoryMessageTemplateRepository();
const service = new MessageTemplateService(repo);

function extractId(url: string): string {
  const parts = url.split("?")[0].split("/");
  return parts[parts.length - 1] ?? "";
}

/**
 * PUT /api/message-templates/[id] e /api/v1/message-templates/[id]
 * Fail Fast: Zod valida o payload parcial no Service.
 * Zero Trust: user_id extraido do cookie seguro, impedindo hijack entre freelancers.
 */
export const PUT = withAuth(async (req, { session }) => {
  const id = extractId(req.url);

  try {
    const body = await req.json();
    const updated = await service.update(id, session.userId, body);
    return NextResponse.json({ template: updated }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});

/**
 * DELETE /api/message-templates/[id] e /api/v1/message-templates/[id]
 * Zero Trust: so remove se o user_id do cookie coincidir com o dono do template.
 */
export const DELETE = withAuth(async (req, { session }) => {
  const id = extractId(req.url);

  try {
    await service.delete(id, session.userId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});