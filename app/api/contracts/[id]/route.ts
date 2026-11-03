import { withAuth } from "@/app/api/_lib/withAuth";
import { ContractService } from "@/core/services/contract.service";
import { ApiResponse } from "@/lib/api-response";

const service = new ContractService();

export const PUT = withAuth<{ id: string }>(async (req, { session, params }) => {
  const id = params?.id || (req.url.split("?")[0].split("/").at(-1) ?? "");
  try {
    const body = await req.json();
    const updated = await service.update(id, session.userId, body);
    return ApiResponse.ok({ contract: updated });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});

export const DELETE = withAuth<{ id: string }>(async (req, { session, params }) => {
  const id = params?.id || (req.url.split("?")[0].split("/").at(-1) ?? "");
  try {
    await service.delete(id, session.userId);
    return ApiResponse.ok({ success: true });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});
