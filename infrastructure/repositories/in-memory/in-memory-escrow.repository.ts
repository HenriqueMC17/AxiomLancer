import { IEscrowRepository } from "@/core/domain/ports/repositories/escrow.repository.port";
import { MilestoneEscrow } from "@/core/domain/types";

export class InMemoryEscrowRepository implements IEscrowRepository {
  private milestones: Map<string, MilestoneEscrow> = new Map();

  constructor(initialMilestones: MilestoneEscrow[] = []) {
    initialMilestones.forEach((m) => this.milestones.set(m.id, { ...m }));
  }

  public async listByContract(contractId: string): Promise<MilestoneEscrow[]> {
    return Array.from(this.milestones.values()).filter((m) => m.contract_id === contractId);
  }

  public async listAll(): Promise<MilestoneEscrow[]> {
    return Array.from(this.milestones.values());
  }

  public async findById(id: string): Promise<MilestoneEscrow | null> {
    const item = this.milestones.get(id);
    return item ? { ...item } : null;
  }

  public async create(milestone: MilestoneEscrow): Promise<MilestoneEscrow> {
    this.milestones.set(milestone.id, { ...milestone });
    return { ...milestone };
  }

  public async update(id: string, data: Partial<MilestoneEscrow>): Promise<MilestoneEscrow | null> {
    const existing = this.milestones.get(id);
    if (!existing) return null;

    const updated = { ...existing, ...data };
    this.milestones.set(id, updated);
    return { ...updated };
  }
}