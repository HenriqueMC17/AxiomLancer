import { describe, it, expect, beforeEach } from "vitest";
import { createContractSchema, updateContractSchema, acceptContractSchema } from "@/core/domain/schemas";
import { ContractService } from "@/core/services/contract.service";
import { Database } from "@/lib/db";
import { ValidationError, NotFoundError, BusinessRuleViolationError } from "@/core/errors/app-error";

describe("Contract Management & Digital Acceptance Domain", () => {
  let service: ContractService;
  const testUserId = "usr_contract_test_01";
  const foreignUserId = "usr_contract_test_02";

  beforeEach(() => {
    service = new ContractService();
  });

  describe("Zod Contract Schema Validation (Fail Fast on Edge)", () => {
    it("deve validar com sucesso um contrato integro com datas e valores validos", () => {
      const payload = {
        client_id: "cli_acme",
        title: "Prestacao de Servicos de Arquitetura de Software",
        description: "Desenvolvimento de microservicos e esteiras de CI/CD",
        contract_value: 15000.0,
        start_date: "2026-03-01",
        end_date: "2026-08-31",
        terms_clause: "Clausula 1: Fica estipulada a entrega em 3 sprints quinzenais. Clausula 2: Pagamentos liberados contra homologacao.",
      };

      const result = createContractSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Prestacao de Servicos de Arquitetura de Software");
        expect(result.data.contract_value).toBe(15000.0);
        expect(result.data.end_date).toBe("2026-08-31");
      }
    });

    it("deve aceitar contrato com end_date nulo ou indefinido (prazo indeterminado)", () => {
      const payload = {
        client_id: "cli_nexus",
        title: "Retainer Mensal de Consultoria de Seguranca",
        contract_value: 8500.0,
        start_date: "2026-02-01",
        end_date: null,
        terms_clause: "Prestacao continua de consultoria DevSecOps com aviso previo de 30 dias para rescisao contratual.",
      };

      const result = createContractSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.end_date).toBeNull();
      }
    });

    it("deve REJEITAR quando a data de inicio for posterior a data de termino", () => {
      const payload = {
        client_id: "cli_acme",
        title: "Contrato Temporal Inconsistente",
        contract_value: 5000.0,
        start_date: "2026-09-01",
        end_date: "2026-03-01",
        terms_clause: "Termos gerais de prestacao com datas cronologicamente invalidas.",
      };

      const result = createContractSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.end_date).toBeDefined();
        expect(errors.end_date?.[0]).toContain("A Data de Inicio nao pode ser maior que a Data de Termino");
      }
    });

    it("deve REJEITAR valor de contrato negativo ou zero", () => {
      const invalidZero = createContractSchema.safeParse({
        client_id: "cli_acme",
        title: "Contrato Valor Zero",
        contract_value: 0,
        start_date: "2026-01-01",
        terms_clause: "Clausula com valor monetario zero que deve ser rejeitada.",
      });
      expect(invalidZero.success).toBe(false);

      const invalidNegative = createContractSchema.safeParse({
        client_id: "cli_acme",
        title: "Contrato Valor Negativo",
        contract_value: -1500.0,
        start_date: "2026-01-01",
        terms_clause: "Clausula com valor monetario negativo que deve ser rejeitada.",
      });
      expect(invalidNegative.success).toBe(false);
    });

    it("deve REJEITAR termos de contrato com menos de 10 caracteres", () => {
      const result = createContractSchema.safeParse({
        client_id: "cli_acme",
        title: "Contrato Termos Curtos",
        contract_value: 2000.0,
        start_date: "2026-01-01",
        terms_clause: "Curto",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.terms_clause).toBeDefined();
      }
    });

    it("deve validar o schema de Aceite Digital exigindo concordancia expressa e e-mail corporativo", () => {
      const validAcceptance = acceptContractSchema.safeParse({
        signer_name: "Marina Siqueira",
        signer_email: "marina@acmedev.io",
        confirm_terms: true,
      });
      expect(validAcceptance.success).toBe(true);

      const rejectedNoConfirm = acceptContractSchema.safeParse({
        signer_name: "Marina Siqueira",
        signer_email: "marina@acmedev.io",
        confirm_terms: false,
      });
      expect(rejectedNoConfirm.success).toBe(false);

      const rejectedInvalidEmail = acceptContractSchema.safeParse({
        signer_name: "Marina Siqueira",
        signer_email: "marina-invalido",
        confirm_terms: true,
      });
      expect(rejectedInvalidEmail.success).toBe(false);
    });
  });

  describe("ContractService - Aritmetica Rigorosa (decimal.js) & Zero Trust", () => {
    it("deve persistir o valor do contrato arredondado com precisao decimal.js Decimal(12,2)", async () => {
      const created = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato de Engenharia de Dados",
        contract_value: 12450.555,
        start_date: "2026-04-01",
        end_date: "2026-10-01",
        terms_clause: "Clausula de desenvolvimento com alta precisao monetaria e regras de arredondamento bancario.",
      });

      expect(created.id).toBeDefined();
      expect(created.contract_value).toBe(12450.56);
      expect(created.status).toBe("PENDING_SIGNATURE");
    });

    it("deve isolar a listagem de contratos estritamente por userId (Zero Trust)", async () => {
      await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato Privado do Freelancer 1",
        contract_value: 5000.0,
        start_date: "2026-01-01",
        terms_clause: "Termos confidenciais pertencentes exclusivamente ao usuario 01.",
      });

      const listUser1 = await service.listByUser(testUserId);
      const listUser2 = await service.listByUser(foreignUserId);

      expect(listUser1.some((c) => c.title === "Contrato Privado do Freelancer 1")).toBe(true);
      expect(listUser2.some((c) => c.title === "Contrato Privado do Freelancer 1")).toBe(false);
    });

    it("deve lancar NotFoundError ao tentar acessar contrato de outro usuario", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato Blindado",
        contract_value: 7000.0,
        start_date: "2026-01-01",
        terms_clause: "Termos protegidos contra acesso lateral de terceiros.",
      });

      await expect(service.getById(contract.id, foreignUserId)).rejects.toThrow(NotFoundError);
    });
  });

  describe("State Machine & Aceite Digital Imutavel", () => {
    it("deve registrar o Aceite Digital transicionando status para ACTIVE e gerando hash sha256 de nao-repudio", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato para Assinatura Imediata",
        contract_value: 18000.0,
        start_date: "2026-05-01",
        terms_clause: "Clausulas de entrega com aceite digital vinculante e imutavel.",
      });

      expect(contract.status).toBe("PENDING_SIGNATURE");
      expect(contract.accepted_at).toBeUndefined();

      const accepted = await service.accept(
        contract.id,
        testUserId,
        {
          signer_name: "Roberto Campos",
          signer_email: "roberto@acme.com",
          confirm_terms: true,
        },
        "201.86.44.12"
      );

      expect(accepted.status).toBe("ACTIVE");
      expect(accepted.accepted_at).toBeDefined();
      expect(accepted.signer_name).toBe("Roberto Campos");
      expect(accepted.signer_email).toBe("roberto@acme.com");
      expect(accepted.signer_ip).toBe("201.86.44.12");
      expect(accepted.signature_hash).toMatch(/^sha256_/);
    });

    it("deve REJEITAR novo aceite em contrato que ja foi assinado (imutabilidade)", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato de Aceite Unico",
        contract_value: 9000.0,
        start_date: "2026-05-01",
        terms_clause: "Termos que nao podem ser reaceitos apos confirmacao inicial.",
      });

      await service.accept(
        contract.id,
        testUserId,
        {
          signer_name: "Roberto Campos",
          signer_email: "roberto@acme.com",
          confirm_terms: true,
        },
        "10.0.0.1"
      );

      await expect(
        service.accept(
          contract.id,
          testUserId,
          {
            signer_name: "Outro Signatario",
            signer_email: "outro@acme.com",
            confirm_terms: true,
          },
          "10.0.0.2"
        )
      ).rejects.toThrow(BusinessRuleViolationError);
    });

    it("deve BLOQUEAR alteracao de clausulas em contrato ja assinado (ACTIVE)", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato Inalteravel Apos Assinatura",
        contract_value: 20000.0,
        start_date: "2026-01-01",
        terms_clause: "Clausula imutavel com garantia juridica.",
      });

      await service.accept(
        contract.id,
        testUserId,
        {
          signer_name: "Diretor Juridico",
          signer_email: "juridico@acme.com",
          confirm_terms: true,
        },
        "192.168.1.10"
      );

      await expect(
        service.update(contract.id, testUserId, {
          contract_value: 30000.0,
        })
      ).rejects.toThrow(BusinessRuleViolationError);
    });

    it("deve BLOQUEAR exclusao de contrato com status ACTIVE", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Contrato Protegido Contra Exclusao",
        contract_value: 11000.0,
        start_date: "2026-01-01",
        terms_clause: "Contrato ativo que nao pode sofrer delecao acidental.",
      });

      await service.accept(
        contract.id,
        testUserId,
        {
          signer_name: "Diretor Executivo",
          signer_email: "ceo@acme.com",
          confirm_terms: true,
        },
        "192.168.1.50"
      );

      await expect(service.delete(contract.id, testUserId)).rejects.toThrow(BusinessRuleViolationError);
    });

    it("deve permitir alterar e excluir contratos enquanto estiverem em PENDING_SIGNATURE", async () => {
      const contract = await service.create(testUserId, {
        client_id: "cli_acme",
        title: "Minuta Provisoria de Contrato",
        contract_value: 4000.0,
        start_date: "2026-06-01",
        terms_clause: "Minuta em discussao inicial passivel de alteracao antes da assinatura.",
      });

      const updated = await service.update(contract.id, testUserId, {
        title: "Minuta Revisada de Contrato",
        contract_value: 4500.0,
      });

      expect(updated.title).toBe("Minuta Revisada de Contrato");
      expect(updated.contract_value).toBe(4500.0);

      const deleted = await service.delete(contract.id, testUserId);
      expect(deleted).toBe(true);
      await expect(service.getById(contract.id, testUserId)).rejects.toThrow(NotFoundError);
    });
  });
});