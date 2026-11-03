import { IContractRepository } from "@/core/domain/ports/repositories/contract.repository.port";
import { Contract } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryContractRepository implements IContractRepository {
  public async listByUser(userId: string): Promise<Contract[]> {
    return Database.listContracts(userId);
  }

  public async findById(id: string, userId: string): Promise<Contract | null> {
    return Database.findContract(id, userId);
  }

  public async create(contract: Contract): Promise<Contract> {
    return Database.createContract(contract);
  }

  public async update(id: string, userId: string, data: Partial<Contract>): Promise<Contract | null> {
    return Database.updateContract(id, userId, data);
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    return Database.deleteContract(id, userId);
  }

  public async countCompletedByClient(userId: string, clientId: string): Promise<number> {
    return Database.countCompletedContractsByClient(userId, clientId);
  }

  public async getFirstContractDate(userId: string, clientId: string): Promise<string | null> {
    return Database.getClientFirstContractDate(userId, clientId);
  }
}
