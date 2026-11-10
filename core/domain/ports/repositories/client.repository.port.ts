import { Client } from "../../types";

export interface IClientRepository {
  listByUser(userId: string): Promise<Client[]>;
  findById(id: string, userId?: string): Promise<Client | null>;
  create(client: Client): Promise<Client>;
  update(id: string, userId: string, data: Partial<Client>): Promise<Client | null>;
  delete(id: string, userId: string): Promise<boolean>;
  setBillingPaused(id: string, paused: boolean): Promise<boolean>;
}