import Decimal from "decimal.js";
import { CycleEvaluation } from "@/core/domain/types";
import {
  SubmitCycleFeedbackInput,
  TriggerCycleEvaluationInput,
  submitCycleFeedbackSchema,
  triggerCycleEvaluationSchema,
} from "@/core/domain/schemas";
import { Database } from "@/lib/db";
import { ValidationError, NotFoundError, BusinessRuleViolationError } from "@/core/errors/app-error";

/**
 * Service de Dominio para o Sistema de Avaliacao Recorrente de Ciclo.
 *
 * Principios:
 * - Idempotencia Estrita: Chave unica de ciclo (cycle_identifier) com constraint UNIQUE.
 * - Aritmetica Rigorosa: general_score calculado via decimal.js (ROUND_HALF_UP, Decimal 12,2).
 * - Fail Fast: Validacao Zod em todos os inputs antes de tocar na persistencia.
 * - Zero Trust: userId sempre extraido do JWT, nunca do payload.
 */
export class CycleEvaluationService {
  private static readonly MILESTONE_THRESHOLD = 10;
  private static readonly MONTHLY_DAYS = 30;

  /**
   * Gera a chave unica de idempotencia do ciclo.
   * Formato: cycle_<trigger>_<clientId>_<YYYY-MM>
   */
  static generateCycleIdentifier(
    trigger: TriggerCycleEvaluationInput["trigger_type"],
    clientId: string,
    referenceDate: Date = new Date()
  ): string {
    const year = referenceDate.getUTCFullYear();
    const month = String(referenceDate.getUTCMonth() + 1).padStart(2, "0");
    const triggerCode = trigger === "MILESTONE_10_PROJECTS" ? "m10" : trigger === "MONTHLY_30_DAYS" ? "m30" : "manual";
    return `cycle_${triggerCode}_${clientId}_${year}-${month}`;
  }

  /**
   * Gera um token de convite seguro e unico para o formulario de avaliacao.
   */
  static generateInvitationToken(cycleIdentifier: string): string {
    const ts = Date.now().toString(36);
    let hash = 0;
    for (let i = 0; i < cycleIdentifier.length; i++) {
      hash = (hash << 5) - hash + cycleIdentifier.charCodeAt(i);
      hash |= 0;
    }
    const rand = Math.random().toString(36).substring(2, 10);
    return `tkn_${ts}_${Math.abs(hash).toString(36)}_${rand}`;
  }

  /**
   * Verifica se o gatilho de avaliacao de ciclo deve ser disparado para o cliente informado.
   * Retorna o motivo do disparo ou null se nao ha condicao atingida.
   */
  checkTriggerCondition(
    userId: string,
    clientId: string
  ): TriggerCycleEvaluationInput["trigger_type"] | null {
    const completedCount = Database.countCompletedContractsByClient(userId, clientId);
    const lastCycleDate = Database.getLastCompletedCycleDate(userId, clientId);
    const firstContractDate = Database.getClientFirstContractDate(userId, clientId);

    // Gatilho 1: Marco de 10 contratos/projetos concluidos
    if (completedCount >= CycleEvaluationService.MILESTONE_THRESHOLD) {
      const cycleId = CycleEvaluationService.generateCycleIdentifier("MILESTONE_10_PROJECTS", clientId);
      if (!Database.findCycleEvaluationByIdentifier(cycleId)) {
        return "MILESTONE_10_PROJECTS";
      }
    }

    // Gatilho 2: Ciclo mensal de 30 dias
    const referenceDate = lastCycleDate ?? firstContractDate;
    if (referenceDate) {
      const daysSince = Math.floor(
        (Date.now() - new Date(referenceDate).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysSince >= CycleEvaluationService.MONTHLY_DAYS) {
        const cycleId = CycleEvaluationService.generateCycleIdentifier("MONTHLY_30_DAYS", clientId);
        if (!Database.findCycleEvaluationByIdentifier(cycleId)) {
          return "MONTHLY_30_DAYS";
        }
      }
    }

    return null;
  }

  /**
   * Cria um novo registro de ciclo com status PENDING e envia o convite de avaliacao.
   * Falha silenciosamente se o ciclo ja existe (idempotencia).
   */
  async triggerCycleEvaluation(
    userId: string,
    input: TriggerCycleEvaluationInput
  ): Promise<CycleEvaluation> {
    if (!userId) throw new ValidationError("Identificador de usuario obrigatorio");

    const parsed = triggerCycleEvaluationSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("Parametros de disparo invalidos", parsed.error.flatten());
    }

    const cycleIdentifier = CycleEvaluationService.generateCycleIdentifier(
      parsed.data.trigger_type,
      parsed.data.client_id
    );

    // Idempotencia: rejeita disparo se o ciclo ja existe
    const existing = Database.findCycleEvaluationByIdentifier(cycleIdentifier);
    if (existing) {
      throw new BusinessRuleViolationError(
        "CYCLE_ALREADY_TRIGGERED",
        `O ciclo de avaliacao '${cycleIdentifier}' ja foi disparado anteriormente. Nao e permitido duplicar solicitacoes.`
      );
    }

    const invitationToken = CycleEvaluationService.generateInvitationToken(cycleIdentifier);
    const now = new Date().toISOString();

    const newCycle: CycleEvaluation = {
      id: `cyc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      user_id: userId,
      client_id: parsed.data.client_id,
      cycle_identifier: cycleIdentifier,
      trigger_type: parsed.data.trigger_type,
      status: "PENDING",
      general_score: 0,
      invitation_token: invitationToken,
      invitation_sent_at: now,
      created_at: now,
    };

    Database.addCycleEvaluation(newCycle);

    // Simulacao do disparo de e-mail transacional (SendGrid / Resend)
    console.info(
      `[CycleWorker] Convite de avaliacao enviado | Ciclo: ${cycleIdentifier} | Token: ${invitationToken}`
    );

    return Database.listAllCycleEvaluations(userId).find((c) => c.cycle_identifier === cycleIdentifier) ?? newCycle;
  }

  /**
   * Processa a submissao do feedback pelo cliente via formulario seguro.
   * Calcula o general_score com decimal.js e transiciona o status para COMPLETED.
   */
  async submitFeedback(input: SubmitCycleFeedbackInput): Promise<CycleEvaluation> {
    const parsed = submitCycleFeedbackSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError("Dados de avaliacao invalidos", parsed.error.flatten());
    }

    const cycle = Database.findCycleEvaluationByToken(parsed.data.invitation_token);
    if (!cycle) {
      throw new NotFoundError("Avaliacao de Ciclo", parsed.data.invitation_token);
    }

    if (cycle.status === "COMPLETED") {
      throw new BusinessRuleViolationError(
        "CYCLE_ALREADY_COMPLETED",
        "Este formulario de avaliacao de ciclo ja foi preenchido anteriormente."
      );
    }

    if (cycle.status === "EXPIRED") {
      throw new BusinessRuleViolationError(
        "CYCLE_INVITATION_EXPIRED",
        "O link de avaliacao expirou. Entre em contato com o freelancer para uma nova solicitacao."
      );
    }

    // Calcula a media das 5 dimensoes com decimal.js (ROUND_HALF_UP, Decimal 12,2)
    const d = parsed.data;
    const generalScore = new Decimal(d.score_communication)
      .plus(d.score_proactivity)
      .plus(d.score_results)
      .plus(d.score_understanding)
      .plus(d.score_demand_delivery)
      .dividedBy(5)
      .toDecimalPlaces(2, Decimal.ROUND_HALF_UP)
      .toNumber();

    const updated = Database.updateCycleEvaluation(cycle.id, {
      score_communication: new Decimal(d.score_communication).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      score_proactivity: new Decimal(d.score_proactivity).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      score_results: new Decimal(d.score_results).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      score_understanding: new Decimal(d.score_understanding).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      score_demand_delivery: new Decimal(d.score_demand_delivery).toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      general_score: generalScore,
      comments: d.comments.trim(),
      status: "COMPLETED",
      completed_at: new Date().toISOString(),
    });

    if (!updated) throw new NotFoundError("Avaliacao de Ciclo", cycle.id);
    return updated;
  }

  /**
   * Lista todas as avaliacoes de ciclo do freelancer autenticado.
   */
  async listByUser(userId: string): Promise<CycleEvaluation[]> {
    if (!userId) throw new ValidationError("Identificador de usuario obrigatorio");
    return Database.listAllCycleEvaluations(userId);
  }

  /**
   * Busca um ciclo pelo token seguro de convite (rota publica do formulario).
   */
  async getByToken(token: string): Promise<CycleEvaluation> {
    if (!token || token.length < 10) {
      throw new ValidationError("Token de avaliacao invalido");
    }
    const cycle = Database.findCycleEvaluationByToken(token);
    if (!cycle) throw new NotFoundError("Avaliacao de Ciclo", token);
    return cycle;
  }
}