import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ProjectService } from "@/core/services/project.service";
import { AppError } from "@/core/errors/app-error";

const service = new ProjectService();

function extractId(url: string): string {
  const parts = url.split("?")[0].split("/");
  return parts[parts.length - 1] ?? "";
}

/**
 * PUT /api/projects/[id] e /api/v1/projects/[id]
 * Atualiza projeto com validacao de datas e permissao Zero Trust.
 */
export const PUT = withAuth(async (req, { session }) => {
  const id = extractId(req.url);
  try {
    const body = await req.json();
    const updated = await service.update(id, session.userId, body);
    return NextResponse.json({ project: updated }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});

/**
 * DELETE /api/projects/[id] e /api/v1/projects/[id]
 * Remove projeto pertencente ao freelancer autenticado.
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