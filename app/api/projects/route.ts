import { withAuth } from "@/app/api/_lib/withAuth";
import { ProjectService } from "@/core/services/project.service";
import { InMemoryProjectRepository } from "@/infrastructure/repositories/in-memory/in-memory-project.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new ProjectService(new InMemoryProjectRepository());

/**
 * GET /api/projects
 * Lista o portfolio de projetos do freelancer.
 * Regra LGPD: Mascara o nome do cliente se is_public_client_name for false.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const projects = await service.listByUser(session.userId);
    return ApiResponse.ok({ projects });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/projects
 * Cria novo projeto no portfolio.
 * Fail Fast: Valida com Zod (start_date <= end_date, aceite de end_date nulo em desenvolvimento).
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const created = await service.create(session.userId, body);
    return ApiResponse.ok({ project: created }, 201);
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});