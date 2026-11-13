import { describe, it, expect, beforeEach } from "vitest";
import { ReleaseMilestoneUseCase } from "@/core/use-cases/release-milestone.use-case";
import { InMemoryEscrowRepository } from "@/infrastructure/repositories/in-memory/in-memory-escrow.repository";
import { InMemoryContractRepository } from "@/infrastructure/repositories/in-memory/in-memory-contract.repository";
import { TransactionalOutboxAdapter } from "@/infrastructure/resilience/transactional-outbox.adapter";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

describe("ReleaseMilestoneUseCase - Smart Escrow com Split Tributario Fator R", () => {
  let escrowRepo: InMemoryEscrowRepository;
  let contractRepo: InMemoryContractRepository;
  let outboxRepo: TransactionalOutboxAdapter;
  let useCase: ReleaseMilestoneUseCase;

  beforeEach(async () => {
    escrowRepo = new InMemoryEscrowRepository();
    contractRepo = new InMemoryContractRepository();
    outboxRepo = new TransactionalOutboxAdapter();
    useCase = new ReleaseMilestoneUseCase(escrowRepo, contractRepo, outboxRepo);

    await contractRepo.create({
      id: "cnt_escrow_01",
      user_id: "usr_freelancer",
      client_id: "cli_client",
      title: "Contrato SaaS Enterprise",
      contract_value: 20000.0,
      status: "ACTIVE",
      start_date: "2026-01-01",
      created_at: new Date().toISOString(),
    });

    await escrowRepo.create({
      id: "ms_escrow_101",
      contract_id: "cnt_escrow_01",
      title: "Entrega do Modulo de Seguranca",
      amount: 5000.0,
      status: "LOCKED",
    });
  });

  it("deve liberar milestone aplicando retencao de 6% (Anexo III) no Cofre Virtual", async () => {
    const result = await useCase.execute({
      contractId: "cnt_escrow_01",
      milestoneId: "ms_escrow_101",
      userId: "usr_freelancer",
      annualRevenueRbt12: 180000.0,
      simplesNacionalType: "ANEXO_III",
    });

    expect(result.milestone.status).toBe("RELEASED");
    expect(result.milestone.release_date).toBeDefined();
    expect(result.taxSplit.grossAmount).toBe(5000.0);
    expect(result.taxSplit.effectiveTaxRate).toBe(6.0);
    expect(result.taxSplit.virtualSafeRetention).toBe(300.0); // 6% de 5000
    expect(result.taxSplit.netDisbursed).toBe(4700.0); // 94% liquido
    expect(result.outboxEventId).toBeDefined();

    // Valida persistencia no Outbox
    const events = await outboxRepo.fetchPending();
    expect(events.length).toBe(1);
    expect(events[0].event_type).toBe("MilestoneReleasedAndDisbursed");
  });

  it("deve aplicar alíquota de Anexo V (15.5%) quando especificado", async () => {
    const result = await useCase.execute({
      contractId: "cnt_escrow_01",
      milestoneId: "ms_escrow_101",
      userId: "usr_freelancer",
      annualRevenueRbt12: 180000.0,
      simplesNacionalType: "ANEXO_V",
    });

    expect(result.taxSplit.effectiveTaxRate).toBe(15.5);
    expect(result.taxSplit.virtualSafeRetention).toBe(775.0); // 15.5% de 5000
    expect(result.taxSplit.netDisbursed).toBe(4225.0);
  });

  it("deve rejeitar liberacao de milestone ja liberado", async () => {
    // 1ª liberacao
    await useCase.execute({
      contractId: "cnt_escrow_01",
      milestoneId: "ms_escrow_101",
      userId: "usr_freelancer",
    });

    // 2ª tentativa de liberacao
    await expect(
      useCase.execute({
        contractId: "cnt_escrow_01",
        milestoneId: "ms_escrow_101",
        userId: "usr_freelancer",
      })
    ).rejects.toThrow(ValidationError);
  });

  it("deve rejeitar se o contrato nao pertencer ao usuario", async () => {
    await expect(
      useCase.execute({
        contractId: "cnt_escrow_01",
        milestoneId: "ms_escrow_101",
        userId: "usr_hacker_ou_outro_tenant",
      })
    ).rejects.toThrow(NotFoundError);
  });
});