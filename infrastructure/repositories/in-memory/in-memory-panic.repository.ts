import { IPanicRepository, PanicStateResult } from "@/core/domain/ports/repositories/panic.repository.port";
import { Database } from "@/lib/db";

export class InMemoryPanicRepository implements IPanicRepository {
  public async getStatus(): Promise<boolean> {
    const state = Database.getState();
    return state.user.billing_paused;
  }

  public async setPanicState(paused: boolean): Promise<PanicStateResult> {
    return Database.togglePanicButton(paused);
  }
}
