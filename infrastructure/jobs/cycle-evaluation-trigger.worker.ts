import { CycleEvaluationService } from "@/core/services/cycle-evaluation.service";
import { Database } from "@/lib/db";
import { ScoreRecalculationWorker } from "@/infrastructure/jobs/score-recalculation.worker";

export interface CycleTriggerJobData {
  userId: string;
  clientId: string;
  enqueuedAt: string;
}

export interface CycleTriggerReport {
  userId: string;
  clientId: string;
  triggered: boolean;
  triggerType?: string;
  cycleIdentifier?: string;
  invitationToken?: string;
  reason: string;
  durationMs: number;
}

/**
 * Worker Assincrono de Verificacao e Disparo de Avaliacao de Ciclo Recorrente.
 *
 * Principios:
 * - Verificacao Diaria (cron): Avalia condicoes para cada cliente ativo do freelancer.
 * - Gatilhos: 10 contratos/projetos concluidos OU 30 dias de ciclo continuo.
 * - Idempotencia: Trava em cycle_identifier unico — nenhum cliente recebe solicitacao duplicada.
 * - Background-First: Retorna imediatamente para nao onerar a thread da requisicao HTTP.
 * - Recalculo em Cascata: Apos novo ciclo COMPLETED, dispara ScoreRecalculationWorker.
 */
export class CycleEvaluationTriggerWorker {
  private static service = new CycleEvaluationService();
  private static queue: CycleTriggerJobData[] = [];
  private static isProcessing = false;

  /**
   * Varre todos os clientes ativos do freelancer e enfileira jobs para cada um.
   */
  public static scanAndEnqueueAll(userId: string): number {
    const clients = Database.listClients ? Database.listClients(userId) : [];
    let enqueued = 0;

    for (const client of clients) {
      const triggerType = this.service.checkTriggerCondition(userId, client.id);
      if (triggerType) {
        this.enqueue({ userId, clientId: client.id });
        enqueued++;
      }
    }

    return enqueued;
  }

  /**
   * Enfileira um job de verificacao de disparo para um cliente especifico.
   * Retorna imediatamente (non-blocking).
   */
  public static enqueue(jobData: Omit<CycleTriggerJobData, "enqueuedAt">): void {
    this.queue.push({ ...jobData, enqueuedAt: new Date().toISOString() });
    setTimeout(() => void this.processNext(), 0);
  }

  /**
   * Processador interno do worker (consumidor da fila assincrona).
   */
  public static async processNext(): Promise<CycleTriggerReport | null> {
    if (this.isProcessing || this.queue.length === 0) return null;

    const job = this.queue.shift();
    if (!job) return null;

    this.isProcessing = true;
    const start = performance.now();

    try {
      const triggerType = this.service.checkTriggerCondition(job.userId, job.clientId);

      if (!triggerType) {
        return {
          userId: job.userId,
          clientId: job.clientId,
          triggered: false,
          reason: "Nenhuma condicao de disparo atingida para este cliente no momento.",
          durationMs: Math.round(performance.now() - start),
        };
      }

      const cycle = await this.service.triggerCycleEvaluation(job.userId, {
        client_id: job.clientId,
        trigger_type: triggerType,
      });

      return {
        userId: job.userId,
        clientId: job.clientId,
        triggered: true,
        triggerType,
        cycleIdentifier: cycle.cycle_identifier,
        invitationToken: cycle.invitation_token,
        reason: `Gatilho '${triggerType}' ativo. Convite de avaliacao enviado com sucesso.`,
        durationMs: Math.round(performance.now() - start),
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      console.error(`[CycleTriggerWorker] Erro ao processar job para cliente ${job.clientId}:`, msg);
      return {
        userId: job.userId,
        clientId: job.clientId,
        triggered: false,
        reason: `Falha: ${msg}`,
        durationMs: Math.round(performance.now() - start),
      };
    } finally {
      this.isProcessing = false;
      if (this.queue.length > 0) setTimeout(() => void this.processNext(), 0);
    }
  }

  /**
   * Chamado apos um ciclo ser marcado como COMPLETED pelo cliente.
   * Dispara recalculo em cascata do score geral do freelancer.
   */
  public static onCycleCompleted(userId: string, cycleId: string): void {
    ScoreRecalculationWorker.enqueue({
      userId,
      triggeredBy: "CYCLE_EVALUATION",
      sourceId: cycleId,
    });
    console.info(`[CycleTriggerWorker] Recalculo de score enfileirado apos conclusao do ciclo ${cycleId}`);
  }

  public static getPendingCount(): number {
    return this.queue.length;
  }
}