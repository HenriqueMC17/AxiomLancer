import { CycleEvaluation } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Avaliacoes Recorrentes de Ciclo.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 */
export interface ICycleEvaluationRepository {
  findByToken(token: string): Promise<CycleEvaluation | null>;
  findByIdentifier(cycleIdentifier: string): Promise<CycleEvaluation | null>;
  listByUser(userId: string): Promise<CycleEvaluation[]>;
  create(evaluation: CycleEvaluation): Promise<CycleEvaluation>;
  update(id: string, data: Partial<CycleEvaluation>): Promise<CycleEvaluation | null>;
  getLastCompletedCycleDate(userId: string, clientId: string): Promise<string | null>;
}
