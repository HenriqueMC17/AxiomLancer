import { describe, it, expect } from "vitest";
import { RulesEngineService } from "@/core/services/rules-engine.service";

describe("RulesEngineService - Máquina de Estados & Idempotência (AAA Pattern)", () => {
  it("deve gerar chave de idempotência determinística para o DeduplicationJournal", () => {
    // Arrange
    const invoiceId = "inv_123456";
    const triggerDay = "2026-03-10";
    const ruleId = "rule_d0";

    // Act
    const eventId1 = RulesEngineService.generateEventId(invoiceId, triggerDay, ruleId);
    const eventId2 = RulesEngineService.generateEventId(invoiceId, triggerDay, ruleId);

    // Assert
    expect(eventId1).toBe("dedup_inv_123456_2026-03-10_rule_d0");
    expect(eventId1).toBe(eventId2); // Idempotência garantida
  });

  it("deve calcular corretamente o deslocamento de dias (offset)", () => {
    // Arrange: Vencimento dia 15, data atual dia 12 (D-3)
    const dueDate = "2026-04-15";
    const currentDate = "2026-04-12";

    // Act
    const offsetDays = RulesEngineService.calculateOffsetDays(dueDate, currentDate);

    // Assert
    expect(offsetDays).toBe(-3);
  });

  it("deve calcular offset zero no dia exato do vencimento (D-0)", () => {
    // Arrange
    const dueDate = "2026-04-15";
    const currentDate = "2026-04-15";

    // Act
    const offsetDays = RulesEngineService.calculateOffsetDays(dueDate, currentDate);

    // Assert
    expect(offsetDays).toBe(0);
  });
});
