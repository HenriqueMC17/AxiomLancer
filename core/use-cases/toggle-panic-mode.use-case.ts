import { IPanicRepository, PanicStateResult } from "../domain/ports/repositories/panic.repository.port";

export interface TogglePanicInput {
  billingPaused: boolean;
  reason?: string;
}

export class TogglePanicModeUseCase {
  constructor(private readonly panicRepo: IPanicRepository) {}

  public async execute(input: TogglePanicInput): Promise<PanicStateResult & { message: string }> {
    const result = await this.panicRepo.setPanicState(input.billingPaused);

    const message = result.billing_paused
      ? "Safe Mode ativado: todas as cobrancas automaticas foram congeladas instantaneamente."
      : "Safe Mode desativado: esteira de cobranca reativada com sucesso.";

    return {
      ...result,
      message,
    };
  }
}
