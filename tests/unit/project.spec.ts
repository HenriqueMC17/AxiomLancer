import { describe, it, expect, beforeEach } from "vitest";
import { createProjectSchema } from "@/core/domain/schemas";
import { ProjectService } from '@/core/services/project.service';
import { InMemoryProjectRepository } from '@/infrastructure/repositories/in-memory/in-memory-project.repository';
import { Database } from "@/lib/db";
import { ValidationError, NotFoundError } from "@/core/errors/app-error";

describe("Project Domain, Validation & LGPD Compliance", () => {
  let service: ProjectService;
  const testUserId = "usr_proj_test_01";
  const foreignUserId = "usr_proj_test_02";

  beforeEach(() => {
    service = new ProjectService(new InMemoryProjectRepository());
  });

  describe("Zod Contract & Data Validation (Fail Fast)", () => {
    it("deve validar com sucesso um projeto concluido com start_date <= end_date", () => {
      const payload = {
        client_id: "cli_acme",
        name: "Plataforma FinTech Core",
        description: "Microsservicos de alta performance",
        start_date: "2026-01-01",
        end_date: "2026-03-31",
        is_in_development: false,
        is_public_client_name: true,
      };

      const result = createProjectSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Plataforma FinTech Core");
        expect(result.data.end_date).toBe("2026-03-31");
      }
    });

    it("deve REJEITAR quando start_date for maior que end_date", () => {
      const payload = {
        client_id: "cli_acme",
        name: "Projeto Invalido Temporal",
        start_date: "2026-05-01",
        end_date: "2026-02-01", // Data de termino anterior a data de inicio
        is_in_development: false,
      };

      const result = createProjectSchema.safeParse(payload);
      expect(result.success).toBe(false);
      if (!result.success) {
        const errors = result.error.flatten().fieldErrors;
        expect(errors.end_date).toBeDefined();
        expect(errors.end_date?.[0]).toContain("A Data de Inicio nao pode ser maior que a Data de Termino");
      }
    });

    it("deve aceitar end_date nulo ou vazio quando estiver 'Em desenvolvimento'", () => {
      const payload = {
        client_id: "cli_nexus",
        name: "Arbitragem de Liquidez",
        start_date: "2026-06-01",
        end_date: null,
        is_in_development: true,
        is_public_client_name: false,
      };

      const result = createProjectSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_in_development).toBe(true);
        expect(result.data.end_date).toBeNull();
      }
    });
  });

  describe("ProjectService - Regras de Negocio, LGPD e Zero Trust", () => {
    it("deve aplicar mascaramento 'Confidencial' para empresa quando is_public_client_name for false (LGPD)", async () => {
      const project = await service.create(testUserId, {
        client_id: "cli_nexus",
        name: "Contrato Confidencial Enterprise",
        start_date: "2026-01-15",
        end_date: "2026-04-15",
        is_in_development: false,
        is_public_client_name: false, // LGPD restrito
      });

      expect(project.id).toBeDefined();
      expect(project.is_public_client_name).toBe(false);
      expect(project.client_name).toBe("Confidencial");
    });

    it("deve exibir o nome real da empresa quando is_public_client_name for true", async () => {
      const project = await service.create(testUserId, {
        client_id: "cli_acme",
        name: "Projeto com Consentimento Publico",
        start_date: "2026-01-01",
        end_date: "2026-02-01",
        is_in_development: false,
        is_public_client_name: true, // LGPD permitido
      });

      expect(project.is_public_client_name).toBe(true);
      expect(project.client_name).toBe("Acme Corp Dev Lab");
    });

    it("deve normalizar end_date para null quando criado em desenvolvimento", async () => {
      const project = await service.create(testUserId, {
        client_id: "cli_acme",
        name: "Modulo em Andamento",
        start_date: "2026-08-01",
        end_date: "2026-09-01", // Usuario informou, mas marcou toggle
        is_in_development: true,
      });

      expect(project.end_date).toBeNull();
    });

    it("deve isolar o portfolio por usuario (Zero Trust)", async () => {
      const userProject = await service.create(testUserId, {
        client_id: "cli_acme",
        name: "Projeto Usuario 1",
        start_date: "2026-01-01",
        end_date: null,
        is_in_development: true,
      });

      // Tentativa de acesso por outro usuario
      await expect(service.getById(userProject.id, foreignUserId)).rejects.toThrow(NotFoundError);

      // Tentativa de update por outro usuario
      await expect(
        service.update(userProject.id, foreignUserId, { name: "Hijack" })
      ).rejects.toThrow(NotFoundError);

      // Tentativa de exclusao por outro usuario
      await expect(service.delete(userProject.id, foreignUserId)).rejects.toThrow(NotFoundError);
    });
  });
});