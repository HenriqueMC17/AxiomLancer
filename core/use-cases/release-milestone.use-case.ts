import { IEscrowRepository } from "../domain/ports/repositories/escrow.repository.port";
import { IContractRepository } from "../domain/ports/repositories/contract.repository.port";
import { IOutboxRepository } from "../domain/ports/outbox.port";
import { TaxEngineService } from "../services/tax-engine.service";
import { MilestoneEscrow } from "../domain/types";
import { NotFoundError, ValidationError } from "../errors/app-error";

export interface ReleaseMilestoneInput {
  milestoneId: string;
  contractId: string;
  userId: string;
  annualRevenueRbt12?: number;
  simplesNacionalType?: "ANEXO_III" | "ANEXO_V";
}

export interface ReleaseMilestoneResult {
  milestone: MilestoneEscrow;
  taxSplit: {
    grossAmount: number;
    effectiveTaxRate: number;
    virtualSafeRetention: number; // Retencao automatica do DAS (Cofre Virtual)
    netDisbursed: number;        // Valor liquido transferido ao freelancer
    simplesNacionalType: "ANEXO_III" | "ANEXO_V";
  };
  outboxEventId: string;
}

export class ReleaseMilestoneUseCase {
  constructor(
    private readonly escrowRepo: IEscrowRepository,
    private readonly contractRepo: IContractRepository,
    private readonly outboxRepo: IOutboxRepository
  ) {}

  public async execute(input: ReleaseMilestoneInput): Promise<ReleaseMilestoneResult> {
    // 1. Validacao do Contrato e Tenant
    const contract = await this.contractRepo.findById(input.contractId, input.userId);
    if (!contract) {
      throw new NotFoundError("Contrato", input.contractId);
    }

    // 2. Busca e Validacao do Milestone
    const milestone = await this.escrowRepo.findById(input.milestoneId);
    if (!milestone || milestone.contract_id !== input.contractId) {
      throw new NotFoundError("Milestone de Escrow", input.milestoneId);
    }

    if (milestone.status === "RELEASED") {
      throw new ValidationError("Este marco contratual ja foi liberado e liquidado anteriormente.", {
        milestoneId: input.milestoneId,
        currentStatus: milestone.status,
        releaseDate: milestone.release_date,
      });
    }

    // 3. Calculo do Split Tributario Simples Nacional (Fator R - Anexo III vs V)
    const rbt12 = input.annualRevenueRbt12 ?? 180000.0;
    const simplesType = input.simplesNacionalType ?? "ANEXO_III";

    const taxProvision = TaxEngineService.provisionInvoiceTax(
      milestone.amount,
      rbt12,
      simplesType
    );

    const grossAmount = milestone.amount;
    const virtualSafeRetention = taxProvision.virtualSafeDeposit.toNumber();
    const netDisbursed = taxProvision.netOperationalAmount.toNumber();
    const effectiveTaxRate = taxProvision.effectiveRatePercent.toNumber();

    // 4. Atualizacao do Estado do Milestone
    const releaseDate = new Date().toISOString();
    const updatedMilestone = await this.escrowRepo.update(milestone.id, {
      status: "RELEASED",
      release_date: releaseDate,
    });

    if (!updatedMilestone) {
      throw new Error(`Falha ao atualizar o milestone ${milestone.id}.`);
    }

    // 5. Emissao de Evento no Transactional Outbox (Zero Dual Write)
    const outboxEvent = await this.outboxRepo.saveEvent({
      aggregate_type: "ESCROW_MILESTONE",
      aggregate_id: milestone.id,
      event_type: "MilestoneReleasedAndDisbursed",
      payload: {
        contractId: contract.id,
        milestoneId: milestone.id,
        userId: input.userId,
        grossAmount,
        virtualSafeRetention,
        netDisbursed,
        effectiveTaxRate,
        simplesNacionalType: simplesType,
        releasedAt: releaseDate,
      },
    });

    return {
      milestone: updatedMilestone,
      taxSplit: {
        grossAmount,
        effectiveTaxRate,
        virtualSafeRetention,
        netDisbursed,
        simplesNacionalType: simplesType,
      },
      outboxEventId: outboxEvent.id,
    };
  }
}