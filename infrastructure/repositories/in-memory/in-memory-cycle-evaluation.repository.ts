import { ICycleEvaluationRepository } from "@/core/domain/ports/repositories/cycle-evaluation.repository.port";
import { CycleEvaluation } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryCycleEvaluationRepository implements ICycleEvaluationRepository {
  public async findByToken(token: string): Promise<CycleEvaluation | null> {
    return Database.findCycleEvaluationByToken(token);
  }

  public async findByIdentifier(cycleIdentifier: string): Promise<CycleEvaluation | null> {
    return Database.findCycleEvaluationByIdentifier(cycleIdentifier);
  }

  public async listByUser(userId: string): Promise<CycleEvaluation[]> {
    return Database.listAllCycleEvaluations(userId);
  }

  public async create(evaluation: CycleEvaluation): Promise<CycleEvaluation> {
    Database.addCycleEvaluation(evaluation);
    return { ...evaluation };
  }

  public async update(id: string, data: Partial<CycleEvaluation>): Promise<CycleEvaluation | null> {
    return Database.updateCycleEvaluation(id, data);
  }

  public async getLastCompletedCycleDate(userId: string, clientId: string): Promise<string | null> {
    return Database.getLastCompletedCycleDate(userId, clientId);
  }
}
