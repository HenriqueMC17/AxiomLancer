import { withAuth } from "@/app/api/_lib/withAuth";
import { ProjectService } from "@/core/services/project.service";
import { InMemoryProjectRepository } from "@/infrastructure/repositories/in-memory/in-memory-project.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new ProjectService(new InMemoryProjectRepository());

/**
 * PUT /api/projects/[id]
 * Atualiza projeto com validacao de datas e permissao Zero Trust.
 */
export const PUT = withAuth<{ id: string }>(async (req, { session, params }) => {
  const id = params?.id || (req.url.split("?")[0].split("/").at(-1) ?? "");
  try {
    const body = await req.json();
    const updated = await service.update(id, session.userId, body);
    return ApiResponse.ok({ project: updated });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});

/**
 * DELETE /api/projects/[id]
 * Remove projeto pertencente ao freelancer autenticado.
 */
export const DELETE = withAuth<{ id: string }>(async (req, { session, params }) => {
  const id = params?.id || (req.url.split("?")[0].split("/").at(-1) ?? "");
  try {
    await service.delete(id, session.userId);
    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});