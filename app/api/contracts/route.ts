import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ContractService } from "@/core/services/contract.service";
import { AppError } from "@/core/errors/app-error";

const service = new ContractService();

/**
 * GET /api/contracts e /api/v1/contracts
 * Lista os contratos vinculados ao freelancer autenticado.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const contracts = await service.listByUser(session.userId);
    return NextResponse.json({ contracts }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});

/**
 * POST /api/contracts e /api/v1/contracts
 * Emite novo contrato de prestacao de servicos com calculo decimal.js.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const created = await service.create(session.userId, body);
    return NextResponse.json({ contract: created }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});