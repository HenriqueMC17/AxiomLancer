import { Client } from "../../types";

export interface IClientRepository {
  listByUser(userId: string): Promise<Client[]>;
  findById(id: string): Promise<Client | null>;
  create(client: Client): Promise<Client>;
  setBillingPaused(id: string, paused: boolean): Promise<boolean>;
}
