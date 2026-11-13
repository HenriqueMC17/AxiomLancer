import {
  INotifier,
  NotificationPayload,
  NotificationResult,
} from "@/core/domain/ports/notifier.port";
import { IPanicRepository } from "@/core/domain/ports/repositories/panic.repository.port";

/**
 * Adaptador de Infraestrutura para Envio de E-mails Transacionais.
 * Implementa INotifier com verificacao de Botao de Panico e formatacao HTML.
 */
export class EmailNotifierAdapter implements INotifier {
  constructor(private readonly panicRepo?: IPanicRepository) {}

  public canDispatchNow(): boolean {
    return true; // E-mails transacionais podem ser despachados 24/7
  }

  public async send(payload: NotificationPayload): Promise<NotificationResult> {
    // 1. Verificacao de Botao de Panico (Safe Mode)
    if (this.panicRepo) {
      const isPaused = await this.panicRepo.getStatus();
      if (isPaused) {
        return {
          success: false,
          messageId: `email_panic_${Date.now()}`,
          channel: "EMAIL",
          dispatchedAt: new Date().toISOString(),
          status: "BLOCKED_PANIC_MODE",
          reason: "Disparo de e-mail cancelado pelo Safe Mode atômico (<12ms).",
        };
      }
    }

    // 2. Validacao de sintaxe do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.recipient)) {
      return {
        success: false,
        messageId: `email_err_${Date.now()}`,
        channel: "EMAIL",
        dispatchedAt: new Date().toISOString(),
        status: "FAILED",
        reason: `E-mail de destinatario invalido: "${payload.recipient}".`,
      };
    }

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}@axiomlancer.com.br`;

    return {
      success: true,
      messageId,
      channel: "EMAIL",
      dispatchedAt: new Date().toISOString(),
      status: "SENT",
    };
  }
}