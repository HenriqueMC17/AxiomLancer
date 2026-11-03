import { ReputationScoreService, ScoreCalculationResult } from "@/core/services/reputation-score.service";
import { Database } from "@/lib/db";

export interface ScoreRecalculationJobData {
  userId: string;
  triggeredBy: "PROJECT_FEEDBACK" | "CYCLE_EVALUATION" | "MANUAL_RECALC";
  sourceId?: string;
  enqueuedAt: string;
}

export interface JobExecutionReport {
  success: boolean;
  userId: string;
  previousScore?: number;
  newScore: number;
  calculation: ScoreCalculationResult;
  durationMs: number;
}

/**
 * Worker e Despachante Assincrono de Recalculo de Score (BullMQ / Async Background Pattern).
 *
 * Garante que a gravacao de novos feedbacks na API responda instantaneamente (<15ms)
 * enquanto o recalculo matematico ponderado de reputacao ocorre em segundo plano.
 */
export class ScoreRecalculationWorker {
  private static service = new ReputationScoreService();
  private static isProcessing = false;
  private static queue: ScoreRecalculationJobData[] = [];

  /**
   * Enfileira um job de recalculo de score para execucao assincrona em background.
   * Retorna imediatamente sem travar a thread da requisicao HTTP (Non-blocking).
   */
  public static enqueue(jobData: Omit<ScoreRecalculationJobData, "enqueuedAt">): void {
    const fullJob: ScoreRecalculationJobData = {
      ...jobData,
      enqueuedAt: new Date().toISOString(),
    };

    this.queue.push(fullJob);

    // Dispara execucao em background de forma assincrona (macro-task)
    setTimeout(() => {
      void this.processNext();
    }, 0);
  }

  /**
   * Processador do Worker (consumidor de fila assincrona).
   */
  public static async processNext(): Promise<JobExecutionReport | null> {
    if (this.isProcessing || this.queue.length === 0) {
      return null;
    }

    const job = this.queue.shift();
    if (!job) return null;

    this.isProcessing = true;
    const start = performance.now();

    try {
      const feedbacks = Database.getFeedbacks(job.userId);
      const cycles = Database.getCycleEvaluations(job.userId);
      const previousScore = Database.getUserScore(job.userId);

      // Executa o calculo com decimal.js
      const calculation = this.service.calculateOverallScore(feedbacks, cycles);

      // Atualiza o score do usuario
      Database.setUserScore(job.userId, calculation.overallScore);

      const durationMs = Math.round(performance.now() - start);

      const report: JobExecutionReport = {
        success: true,
        userId: job.userId,
        previousScore,
        newScore: calculation.overallScore,
        calculation,
        durationMs,
      };

      return report;
    } catch (err: unknown) {
      console.error(`[ScoreWorker] Falha ao processar job para usuario ${job.userId}:`, err);
      return null;
    } finally {
      this.isProcessing = false;
      // Se houver mais jobs pendentes na fila, continua processando
      if (this.queue.length > 0) {
        setTimeout(() => {
          void this.processNext();
        }, 0);
      }
    }
  }

  /**
   * Executa recalculo sincrono imediato (usado em testes ou scripts de auditoria)
   */
  public static async executeNow(userId: string): Promise<JobExecutionReport> {
    const start = performance.now();
    const feedbacks = Database.getFeedbacks(userId);
    const cycles = Database.getCycleEvaluations(userId);
    const previousScore = Database.getUserScore(userId);

    const calculation = this.service.calculateOverallScore(feedbacks, cycles);
    Database.setUserScore(userId, calculation.overallScore);

    return {
      success: true,
      userId,
      previousScore,
      newScore: calculation.overallScore,
      calculation,
      durationMs: Math.round(performance.now() - start),
    };
  }

  public static getPendingCount(): number {
    return this.queue.length;
  }
}