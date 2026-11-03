import { describe, it, expect, beforeEach } from "vitest";
import {
  createMessageTemplateSchema,
  updateMessageTemplateSchema,
} from "@/core/domain/schemas";
import { InMemoryMessageTemplateRepository } from "@/infrastructure/repositories/in-memory/in-memory-message-template.repository";
import { MessageTemplateService } from "@/core/services/message-template.service";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

describe("MessageTemplate Validation, Service & Repository (Fail Fast & Zero Trust)", () => {
  describe("Zod Contract Validation (Edge Validation)", () => {
    it("deve validar com sucesso um payload completo e valido", () => {
      const payload = {
        channel: "EMAIL",
        tone_of_voice: "AMIGAVEL",
        subject: "Lembrete de Vencimento",
        body: "Prezado cliente, informamos que sua fatura vence amanha.",
      };

      const result = createMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.channel).toBe("EMAIL");
        expect(result.data.tone_of_voice).toBe("AMIGAVEL");
      }
    });

    it("deve rejeitar quando o assunto for vazio ou menor que 3 caracteres", () => {
      const payload = {
        channel: "EMAIL",
        tone_of_voice: "FIRME",
        subject: "Oi",
        body: "Corpo da mensagem com mais de 10 caracteres validos.",
      };

      const result = createMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.subject).toBeDefined();
      }
    });

    it("deve rejeitar quando o corpo da mensagem for menor que 10 caracteres", () => {
      const payload = {
        channel: "WHATSAPP",
        tone_of_voice: "EXECUTIVO",
        subject: "Cobranca Extrajudicial",
        body: "Curto",
      };

      const result = createMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.body).toBeDefined();
      }
    });

    it("deve rejeitar canal invalido (fora do enum)", () => {
      const payload = {
        channel: "TELEGRAM",
        tone_of_voice: "AMIGAVEL",
        subject: "Assunto Valido",
        body: "Corpo da mensagem com mais de 10 caracteres.",
      };

      const result = createMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.channel).toBeDefined();
      }
    });

    it("deve rejeitar tom de voz invalido (fora do enum)", () => {
      const payload = {
        channel: "SMS",
        tone_of_voice: "AGRESSIVO",
        subject: "Aviso importante",
        body: "Por favor regularize seus debitos em aberto.",
      };

      const result = createMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.tone_of_voice).toBeDefined();
      }
    });

    it("deve permitir atualizacao parcial com updateMessageTemplateSchema", () => {
      const payload = {
        subject: "Novo Assunto Atualizado",
      };

      const result = updateMessageTemplateSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.subject).toBe("Novo Assunto Atualizado");
        expect(result.data.body).toBeUndefined();
      }
    });
  });

  describe("MessageTemplateService (Camada de Negocio Pura)", () => {
    let repo: InMemoryMessageTemplateRepository;
    let service: MessageTemplateService;
    const testUserId = "usr_srv_test_01";

    beforeEach(() => {
      repo = new InMemoryMessageTemplateRepository();
      service = new MessageTemplateService(repo);
    });

    it("deve criar um template com sucesso atraves do service", async () => {
      const template = await service.create(testUserId, {
        channel: "EMAIL",
        tone_of_voice: "AMIGAVEL",
        subject: "Fatura {{invoice_number}} Disponivel",
        body: "Prezado(a) {{client_name}}, sua fatura no valor de {{gross_value}} vence em {{due_date}}.",
      });

      expect(template.id).toBeDefined();
      expect(template.user_id).toBe(testUserId);
      expect(template.subject).toBe("Fatura {{invoice_number}} Disponivel");
    });

    it("deve lancar ValidationError se o payload for invalido no service", async () => {
      await expect(
        service.create(testUserId, {
          channel: "EMAIL",
          tone_of_voice: "AMIGAVEL",
          subject: "No", // < 3 chars
          body: "Mensagem valida com mais de dez caracteres",
        })
      ).rejects.toThrow(ValidationError);
    });

    it("deve lancar NotFoundError ao tentar buscar template inexistente ou de outro usuario", async () => {
      await expect(
        service.getById("tmpl_inexistente", testUserId)
      ).rejects.toThrow(NotFoundError);
    });

    it("deve interpolar variaveis dinamicamente pelo metodo render()", () => {
      const template = {
        id: "tmpl_render",
        user_id: testUserId,
        channel: "EMAIL" as const,
        tone_of_voice: "AMIGAVEL" as const,
        subject: "Fatura {{invoice_number}} para {{client_name}}",
        body: "Ola, {{client_name}}! Valor: {{gross_value}}. Vencimento: {{due_date}}. PIX: {{pix_key}}.",
      };

      const rendered = service.render(template, {
        client_name: "Acme Corp",
        invoice_number: "FAT-2026-999",
        gross_value: "R$ 4.500,00",
        due_date: "10/11/2026",
        pix_key: "financeiro@acme.com",
      });

      expect(rendered.subject).toBe("Fatura FAT-2026-999 para Acme Corp");
      expect(rendered.body).toBe(
        "Ola, Acme Corp! Valor: R$ 4.500,00. Vencimento: 10/11/2026. PIX: financeiro@acme.com."
      );
    });
  });

  describe("InMemoryMessageTemplateRepository (Zero Trust & Isolation)", () => {
    let repo: InMemoryMessageTemplateRepository;
    const testUserId = "usr_test_iso_1";
    const otherUserId = "usr_test_iso_2";

    beforeEach(() => {
      repo = new InMemoryMessageTemplateRepository();
    });

    it("deve isolar a listagem de templates por user_id estrito", async () => {
      const userTmpl = await repo.create({
        id: "tmpl_user_1",
        user_id: testUserId,
        channel: "EMAIL",
        tone_of_voice: "AMIGAVEL",
        subject: "Template Usuario 1",
        body: "Corpo de teste para usuario 1 com caracteres suficientes.",
      });

      await repo.create({
        id: "tmpl_user_2",
        user_id: otherUserId,
        channel: "WHATSAPP",
        tone_of_voice: "FIRME",
        subject: "Template Usuario 2",
        body: "Corpo de teste para usuario 2 com caracteres suficientes.",
      });

      const userTemplates = await repo.listByUser(testUserId);
      expect(userTemplates.some((t) => t.id === userTmpl.id)).toBe(true);
      expect(userTemplates.every((t) => t.user_id === testUserId)).toBe(true);
    });

    it("nao deve permitir recuperar ou atualizar template de outro usuario", async () => {
      const foreignTmpl = await repo.create({
        id: "tmpl_foreign",
        user_id: otherUserId,
        channel: "SMS",
        tone_of_voice: "EXECUTIVO",
        subject: "Template Externo",
        body: "Mensagem restrita de outro inquilino no sistema.",
      });

      const notFound = await repo.findById(foreignTmpl.id, testUserId);
      expect(notFound).toBeNull();

      const updateResult = await repo.update(foreignTmpl.id, testUserId, {
        subject: "Tentativa de Hijack",
      });
      expect(updateResult).toBeNull();

      const deleteResult = await repo.delete(foreignTmpl.id, testUserId);
      expect(deleteResult).toBe(false);
    });

    it("deve atualizar e remover com sucesso quando user_id for o legitimo dono", async () => {
      const tmpl = await repo.create({
        id: "tmpl_to_modify",
        user_id: testUserId,
        channel: "EMAIL",
        tone_of_voice: "FIRME",
        subject: "Assunto Inicial",
        body: "Corpo inicial da notificacao que sera alterada.",
      });

      const updated = await repo.update(tmpl.id, testUserId, {
        subject: "Assunto Modificado com Sucesso",
      });
      expect(updated).not.toBeNull();
      expect(updated?.subject).toBe("Assunto Modificado com Sucesso");

      const deleted = await repo.delete(tmpl.id, testUserId);
      expect(deleted).toBe(true);

      const check = await repo.findById(tmpl.id, testUserId);
      expect(check).toBeNull();
    });
  });
});