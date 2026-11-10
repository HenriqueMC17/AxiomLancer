import { IClientRepository } from "@/core/domain/ports/repositories/client.repository.port";
import { Client } from "@/core/domain/types";
import { Database } from "@/lib/db";

export class InMemoryClientRepository implements IClientRepository {
  public async listByUser(userId: string): Promise<Client[]> {
    const state = Database.getState();
    return state.clients.filter((c) => c.user_id === userId);
  }

  public async findById(id: string, userId?: string): Promise<Client | null> {
    const state = Database.getState();
    const found = state.clients.find((c) => c.id === id && (!userId || c.user_id === userId));
    return found ? { ...found } : null;
  }

  public async create(client: Client): Promise<Client> {
    const state = Database.getState();
    state.clients.unshift({ ...client });
    return { ...client };
  }

  public async update(id: string, userId: string, data: Partial<Client>): Promise<Client | null> {
    const state = Database.getState();
    const idx = state.clients.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return null;
    state.clients[idx] = { ...state.clients[idx], ...data };
    return { ...state.clients[idx] };
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const state = Database.getState();
    const idx = state.clients.findIndex((c) => c.id === id && c.user_id === userId);
    if (idx === -1) return false;
    state.clients.splice(idx, 1);
    return true;
  }

  public async setBillingPaused(id: string, paused: boolean): Promise<boolean> {
    const state = Database.getState();
    const c = state.clients.find((cli) => cli.id === id);
    if (!c) return false;
    c.billing_paused = paused;
    return true;
  }
}