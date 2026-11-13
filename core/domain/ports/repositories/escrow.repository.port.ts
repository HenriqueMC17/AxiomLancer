import { MilestoneEscrow } from "../../types";

/**
 * Port para o repositorio de Smart Escrow e Milestones Contratuais.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture).
 */
export interface IEscrowRepository {
  listByContract(contractId: string): Promise<MilestoneEscrow[]>;
  listAll(): Promise<MilestoneEscrow[]>;
  findById(id: string): Promise<MilestoneEscrow | null>;
  create(milestone: MilestoneEscrow): Promise<MilestoneEscrow>;
  update(id: string, data: Partial<MilestoneEscrow>): Promise<MilestoneEscrow | null>;
}