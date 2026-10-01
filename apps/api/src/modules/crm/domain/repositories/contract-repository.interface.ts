import { Contract } from '../entities/contract.entity';

export interface IContractRepository {
  findById(id: string): Promise<Contract | null>;
  findByUserId(userId: string): Promise<Contract[]>;
  findByClientId(clientId: string): Promise<Contract[]>;
  save(contract: Contract): Promise<void>;
}
