import { Contract } from "@/core/domain/types";

/**
 * Port (interface) para o repositorio de Contratos e Minutas.
 * Segue o padrao Ports & Adapters (Hexagonal Architecture / Clean Architecture).
 * Garante Persistence Ignorance absoluta no Core de Dominio.
 */
export interface IContractRepository {
  listByUser(userId: string): Promise<Contract[]>;
  findById(id: string, userId: string): Promise<Contract | null>;
  create(contract: Contract): Promise<Contract>;
  update(id: string, userId: string, data: Partial<Contract>): Promise<Contract | null>;
  delete(id: string, userId: string): Promise<boolean>;
  countCompletedByClient(userId: string, clientId: string): Promise<number>;
  getFirstContractDate(userId: string, clientId: string): Promise<string | null>;
}
