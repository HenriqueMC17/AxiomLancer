import { withAuth } from "@/app/api/_lib/withAuth";
import { ContractService } from "@/core/services/contract.service";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { ApiResponse } from "@/lib/api-response";

const service = new ContractService(new InMemoryContractRepository());

/**
 * GET /api/contracts
 * Lista os contratos vinculados ao freelancer autenticado.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const contracts = await service.listByUser(session.userId);
    return ApiResponse.ok({ contracts });
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/contracts
 * Emite novo contrato de prestacao de servicos com calculo decimal.js.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const created = await service.create(session.userId, body);
    return ApiResponse.ok({ contract: created }, 201);
  } catch (err: unknown) {
    return ApiResponse.error(err);
  }
});