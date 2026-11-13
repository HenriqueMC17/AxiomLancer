import { describe, it, expect, beforeEach } from "vitest";
import { WhatsAppNotifierAdapter } from "@/infrastructure/whatsapp/whatsapp-notifier.adapter";
import { InMemoryPanicRepository } from "@/infrastructure/repositories/in-memory/in-memory-panic.repository";

describe("WhatsAppNotifierAdapter - Compliance de Disparo & Quiet Hours", () => {
  let panicRepo: InMemoryPanicRepository;

  beforeEach(async () => {
    panicRepo = new InMemoryPanicRepository();
    // Reseta estado para garantir isolamento deterministico
    await panicRepo.setPanicState(false);
  });

  it("deve sanitizar numeros de telefone brasileiros para padrao internacional E.164", () => {
    expect(WhatsAppNotifierAdapter.sanitizePhoneNumber("11987654321")).toBe("+5511987654321");
    expect(WhatsAppNotifierAdapter.sanitizePhoneNumber("(11) 98765-4321")).toBe("+5511987654321");
    expect(WhatsAppNotifierAdapter.sanitizePhoneNumber("+5511987654321")).toBe("+5511987654321");
    expect(WhatsAppNotifierAdapter.sanitizePhoneNumber("5511987654321")).toBe("+5511987654321");
  });

  it("deve bloquear envio instantaneamente quando o Botao de Panico estiver ativo", async () => {
    await panicRepo.setPanicState(true);
    const adapter = new WhatsAppNotifierAdapter(panicRepo, true);

    const result = await adapter.send({
      recipient: "11999998888",
      recipientName: "Cliente Teste",
      channel: "WHATSAPP",
      body: "Ola, sua fatura vence hoje.",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("BLOCKED_PANIC_MODE");
    expect(result.reason).toContain("Safe Mode");
  });

  it("deve enviar com sucesso quando os parametros forem validos", async () => {
    const adapter = new WhatsAppNotifierAdapter(panicRepo, true);

    const result = await adapter.send({
      recipient: "11999998888",
      recipientName: "Cliente Teste",
      channel: "WHATSAPP",
      body: "Ola, sua fatura vence hoje.",
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("SENT");
    expect(result.messageId).toContain("wamid.");
  });

  it("deve falhar se o numero de telefone for invalido", async () => {
    const adapter = new WhatsAppNotifierAdapter(panicRepo, true);

    const result = await adapter.send({
      recipient: "123",
      recipientName: "Invalido",
      channel: "WHATSAPP",
      body: "Teste",
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("FAILED");
    expect(result.reason).toContain("Numero de WhatsApp invalido");
  });
});