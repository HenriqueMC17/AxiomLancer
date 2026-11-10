import { withAuth } from "@/app/api/_lib/withAuth";
import { ContractService } from "@/core/services/contract.service";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new ContractService(new InMemoryContractRepository());

function extractContractIdFallback(url: string): string {
  const parts = url.split("?")[0].split("/");
  return parts[parts.length - 2] ?? "";
}

/**
 * POST /api/contracts/[id]/accept
 * Registra o aceite digital do contrato pelo cliente de forma imutavel.
 */
export const POST = withAuth<{ id: string }>(async (req, { session, params }) => {
  const contractId = params?.id || extractContractIdFallback(req.url);
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  try {
    const body = await req.json();
    const accepted = await service.accept(contractId, session.userId, body, clientIp);
    return ApiResponse.ok({
      success: true,
      message: "Contrato aceito digitalmente com sucesso.",
      contract: accepted,
    });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});