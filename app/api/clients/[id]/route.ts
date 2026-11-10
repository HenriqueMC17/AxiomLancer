import { updateClientSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { NotFoundError } from "@/core/errors/app-error";
import { InMemoryClientRepository } from "@/infrastructure/repositories/in-memory/in-memory-client.repository";

const clientRepo = new InMemoryClientRepository();

export const PUT = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const body = await req.json();
    const parsed = updateClientSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const updated = await clientRepo.update(id, session.userId, parsed.data);
    if (!updated) {
      return ApiResponse.error(new NotFoundError("Cliente", id));
    }

    return ApiResponse.ok({ client: updated });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

export const DELETE = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const id = params?.id || (new URL(req.url).pathname.split("/").at(-1) ?? "");
    const deleted = await clientRepo.delete(id, session.userId);
    if (!deleted) {
      return ApiResponse.error(new NotFoundError("Cliente", id));
    }

    return ApiResponse.ok({ ok: true });
  } catch (err) {
    return ApiResponse.error(err);
  }
});