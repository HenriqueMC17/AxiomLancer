import { IClientRepository } from "@/core/domain/ports/repositories/client.repository.port";
import { Client } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryClientRepository implements IClientRepository {
  public async listByUser(userId: string): Promise<Client[]> {
    const state = Database.getState();
    return state.clients.filter((c) => c.user_id === userId);
  }

  public async findById(id: string): Promise<Client | null> {
    const state = Database.getState();
    const found = state.clients.find((c) => c.id === id);
    return found ? { ...found } : null;
  }

  public async create(client: Client): Promise<Client> {
    const state = Database.getState();
    state.clients.push({ ...client });
    return { ...client };
  }

  public async setBillingPaused(id: string, paused: boolean): Promise<boolean> {
    const state = Database.getState();
    const c = state.clients.find((cli) => cli.id === id);
    if (!c) return false;
    c.billing_paused = paused;
    return true;
  }
}
