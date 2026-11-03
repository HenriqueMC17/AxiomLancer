import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ProjectService } from "@/core/services/project.service";
import { AppError } from "@/core/errors/app-error";

const service = new ProjectService();

/**
 * GET /api/projects e /api/v1/projects
 * Lista o portfolio de projetos do freelancer.
 * Regra LGPD: Mascara o nome do cliente se is_public_client_name for false.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const projects = await service.listByUser(session.userId);
    return NextResponse.json({ projects }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});

/**
 * POST /api/projects e /api/v1/projects
 * Cria novo projeto no portfolio.
 * Fail Fast: Valida com Zod (start_date <= end_date, aceite de end_date nulo em desenvolvimento).
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const created = await service.create(session.userId, body);
    return NextResponse.json({ project: created }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});