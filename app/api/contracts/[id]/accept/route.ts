import { NextResponse } from "next/server";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ContractService } from "@/core/services/contract.service";
import { AppError } from "@/core/errors/app-error";

const service = new ContractService();

function extractContractId(url: string): string {
  // Ex: /api/contracts/cnt_01/accept -> cnt_01
  const parts = url.split("?")[0].split("/");
  return parts[parts.length - 2] ?? "";
}

/**
 * POST /api/contracts/[id]/accept e /api/v1/contracts/[id]/accept
 * Registra o aceite digital do contrato pelo cliente de forma imutavel.
 */
export const POST = withAuth(async (req, { session }) => {
  const contractId = extractContractId(req.url);
  const forwardedFor = req.headers.get("x-forwarded-for");
  const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  try {
    const body = await req.json();
    const accepted = await service.accept(contractId, session.userId, body, clientIp);
    return NextResponse.json({
      success: true,
      message: "Contrato aceito digitalmente com sucesso.",
      contract: accepted,
    }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});