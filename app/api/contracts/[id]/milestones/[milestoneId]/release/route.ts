import { z } from "zod";
import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { ReleaseMilestoneUseCase } from "@/core/use-cases/release-milestone.use-case";
import { InMemoryEscrowRepository } from "@/infrastructure/repositories/in-memory/in-memory-escrow.repository";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { TransactionalOutboxAdapter } from "@/infrastructure/resilience/transactional-outbox.adapter";

const releaseQuerySchema = z.object({
  annualRevenueRbt12: z.number().nonnegative().optional(),
  simplesNacionalType: z.enum(["ANEXO_III", "ANEXO_V"]).optional(),
});

/**
 * POST /api/contracts/[id]/milestones/[milestoneId]/release
 * Executa a liberacao de um marco contratual retido em custodia (Smart Escrow).
 * Aplica automaticamente o split tributario do Simples Nacional (Fator R)
 * e retem a provisao do DAS no Cofre Virtual.
 */
export const POST = withAuth<{ id: string; milestoneId: string }>(async (req, { session, params }) => {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Body vazio e tolerado para parametros padrao
    }

    const parsed = releaseQuerySchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const state = Database.getState();
    const escrowRepo = new InMemoryEscrowRepository(state.milestones);
    const contractRepo = new InMemoryContractRepository();
    const outboxRepo = new TransactionalOutboxAdapter();

    const useCase = new ReleaseMilestoneUseCase(escrowRepo, contractRepo, outboxRepo);

    const result = await useCase.execute({
      contractId: params.id,
      milestoneId: params.milestoneId,
      userId: session.userId,
      annualRevenueRbt12: parsed.data.annualRevenueRbt12 ?? 180000.0,
      simplesNacionalType: parsed.data.simplesNacionalType ?? "ANEXO_III",
    });

    // Sincroniza a mutacao no estado persistente em memoria
    Database.updateMilestone(params.milestoneId, result.milestone);

    return ApiResponse.ok({
      ok: true,
      milestone: result.milestone,
      taxSplit: result.taxSplit,
      outboxEventId: result.outboxEventId,
    });
  } catch (err) {
    return ApiResponse.error(err);
  }
});