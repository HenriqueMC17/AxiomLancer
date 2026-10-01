import { Client } from '../entities/client.entity';

export interface IClientRepository {
  findById(id: string): Promise<Client | null>;
  findByUserId(userId: string): Promise<Client[]>;
  save(client: Client): Promise<void>;
  delete(id: string): Promise<void>;
}
