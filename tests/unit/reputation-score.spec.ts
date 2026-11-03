import { describe, it, expect, beforeEach } from "vitest";
import { ReputationScoreService } from "@/core/services/reputation-score.service";
import { ScoreRecalculationWorker } from "@/infrastructure/jobs/score-recalculation.worker";
import { Database } from "@/lib/db";
import { ValidationError } from "@/core/errors/app-error";
import { ProjectFeedback, CycleEvaluation } from "@/core/domain/types";

describe("ReputationScoreService - Calculo da Media Ponderada & Precisao Decimal (decimal.js)", () => {
  let service: ReputationScoreService;

  beforeEach(() => {
    service = new ReputationScoreService();
  });

  describe("Calculo Matematico & Ponderacao (40% Projetos, 60% Ciclos)", () => {
    it("deve calcular a media ponderada com precisao decimal.js e ROUND_HALF_UP", () => {
      // Arrange
      const feedbacks: ProjectFeedback[] = [
        { id: "fb_1", user_id: "u1", project_id: "p1", score: 5.0, created_at: "2026-01-01" },
        { id: "fb_2", user_id: "u1", project_id: "p2", score: 4.8, created_at: "2026-01-02" },
      ]; // Media projetos: 4.90

      const cycles: CycleEvaluation[] = [
        {
          id: "c_1",
          user_id: "u1",
          client_id: "cli_1",
          cycle_identifier: "CICLO-1",
          score_communication: 5.0,
          score_proactivity: 5.0,
          score_results: 5.0,
          score_understanding: 4.9,
          general_score: 4.98,
          created_at: "2026-01-10",
        },
      ]; // Media ciclos: 4.98

      // Act: (4.90 * 0.40) + (4.98 * 0.60) = 1.96 + 2.988 = 4.948 -> Arredondado: 4.95
      const result = service.calculateOverallScore(feedbacks, cycles);

      // Assert
      expect(result.overallScore).toBe(4.95);
      expect(result.formattedScore).toBe("4.95");
      expect(result.projectAverage).toBe(4.9);
      expect(result.cycleAverage).toBe(4.98);
      expect(result.totalFeedbacksCount).toBe(2);
      expect(result.totalCyclesCount).toBe(1);
    });

    it("deve calcular corretamente com pesos customizados", () => {
      const feedbacks: ProjectFeedback[] = [
        { id: "fb_1", user_id: "u1", project_id: "p1", score: 4.0, created_at: "2026-01-01" },
      ];
      const cycles: CycleEvaluation[] = [
        {
          id: "c_1",
          user_id: "u1",
          client_id: "cli_1",
          cycle_identifier: "CICLO-1",
          score_communication: 5.0,
          score_proactivity: 5.0,
          score_results: 5.0,
          score_understanding: 5.0,
          general_score: 5.0,
          created_at: "2026-01-10",
        },
      ];

      // 50% / 50%: (4.0 * 0.5) + (5.0 * 0.5) = 4.50
      const result = service.calculateOverallScore(feedbacks, cycles, { projectWeight: 0.5, cycleWeight: 0.5 });
      expect(result.overallScore).toBe(4.5);
      expect(result.formattedScore).toBe("4.50");
    });
  });

  describe("Casos de Borda e Protecao contra Divisao por Zero", () => {
    it("deve retornar 0.00 de forma segura quando nao houver feedbacks nem ciclos (Divisao por Zero)", () => {
      const result = service.calculateOverallScore([], []);

      expect(result.overallScore).toBe(0.0);
      expect(result.formattedScore).toBe("0.00");
      expect(result.projectAverage).toBe(0.0);
      expect(result.cycleAverage).toBe(0.0);
      expect(result.totalFeedbacksCount).toBe(0);
      expect(result.totalCyclesCount).toBe(0);
    });

    it("deve utilizar apenas a media de projetos quando ainda nao existirem ciclos concluidos", () => {
      const feedbacks: ProjectFeedback[] = [
        { id: "fb_1", user_id: "u1", project_id: "p1", score: 4.0, created_at: "2026-01-01" },
        { id: "fb_2", user_id: "u1", project_id: "p2", score: 4.5, created_at: "2026-01-02" },
        { id: "fb_3", user_id: "u1", project_id: "p3", score: 5.0, created_at: "2026-01-03" },
      ]; // Media simples: (4.0 + 4.5 + 5.0) / 3 = 4.50

      const result = service.calculateOverallScore(feedbacks, []);
      expect(result.overallScore).toBe(4.5);
      expect(result.formattedScore).toBe("4.50");
      expect(result.totalFeedbacksCount).toBe(3);
      expect(result.totalCyclesCount).toBe(0);
    });

    it("deve utilizar apenas a media de ciclos quando nao existirem feedbacks avulsos", () => {
      const cycles: CycleEvaluation[] = [
        {
          id: "c_1",
          user_id: "u1",
          client_id: "cli_1",
          cycle_identifier: "CICLO-1",
          score_communication: 4.8,
          score_proactivity: 4.8,
          score_results: 4.8,
          score_understanding: 4.8,
          general_score: 4.8,
          created_at: "2026-01-10",
        },
      ];

      const result = service.calculateOverallScore([], cycles);
      expect(result.overallScore).toBe(4.8);
      expect(result.formattedScore).toBe("4.80");
      expect(result.totalFeedbacksCount).toBe(0);
      expect(result.totalCyclesCount).toBe(1);
    });
  });

  describe("Cenarios Extremos e Limites Regulatorios [0.00, 5.00]", () => {
    it("deve retornar 0.00 se todas as avaliacoes forem nota zero", () => {
      const feedbacks: ProjectFeedback[] = [
        { id: "fb_0", user_id: "u1", project_id: "p1", score: 0.0, created_at: "2026-01-01" },
      ];
      const result = service.calculateOverallScore(feedbacks, []);
      expect(result.overallScore).toBe(0.0);
      expect(result.formattedScore).toBe("0.00");
    });

    it("deve retornar 5.00 se todas as avaliacoes forem nota maxima", () => {
      const feedbacks: ProjectFeedback[] = [
        { id: "fb_max", user_id: "u1", project_id: "p1", score: 5.0, created_at: "2026-01-01" },
      ];
      const cycles: CycleEvaluation[] = [
        {
          id: "c_max",
          user_id: "u1",
          client_id: "cli_1",
          cycle_identifier: "CICLO-MAX",
          score_communication: 5.0,
          score_proactivity: 5.0,
          score_results: 5.0,
          score_understanding: 5.0,
          general_score: 5.0,
          created_at: "2026-01-10",
        },
      ];
      const result = service.calculateOverallScore(feedbacks, cycles);
      expect(result.overallScore).toBe(5.0);
      expect(result.formattedScore).toBe("5.00");
    });

    it("deve rejeitar notas menores que 0.0 com ValidationError", () => {
      const invalidFeedbacks: ProjectFeedback[] = [
        { id: "fb_inv", user_id: "u1", project_id: "p1", score: -0.5, created_at: "2026-01-01" },
      ];
      expect(() => service.calculateOverallScore(invalidFeedbacks, [])).toThrow(ValidationError);
    });

    it("deve rejeitar notas maiores que 5.0 com ValidationError", () => {
      const invalidFeedbacks: ProjectFeedback[] = [
        { id: "fb_inv", user_id: "u1", project_id: "p1", score: 5.1, created_at: "2026-01-01" },
      ];
      expect(() => service.calculateOverallScore(invalidFeedbacks, [])).toThrow(ValidationError);
    });
  });

  describe("ScoreRecalculationWorker (Integracao Mockada com Banco)", () => {
    it("deve executar recalculo sincrono imediato e atualizar o banco com sucesso", async () => {
      const userId = "usr_7keys_001";
      const report = await ScoreRecalculationWorker.executeNow(userId);

      expect(report.success).toBe(true);
      expect(report.userId).toBe(userId);
      expect(report.newScore).toBeGreaterThanOrEqual(0);
      expect(report.newScore).toBeLessThanOrEqual(5);

      const dbScore = Database.getUserScore(userId);
      expect(dbScore).toBe(report.newScore);
    });

    it("deve enfileirar job assincrono sem travar a execucao", () => {
      const userId = "usr_7keys_001";
      expect(() => {
        ScoreRecalculationWorker.enqueue({
          userId,
          triggeredBy: "PROJECT_FEEDBACK",
        });
      }).not.toThrow();
    });
  });
});