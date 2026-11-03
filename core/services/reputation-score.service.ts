import Decimal from "decimal.js";
import { ProjectFeedback, CycleEvaluation } from "@/core/domain/types";
import { ValidationError } from "@/core/errors/app-error";

export interface ScoreWeights {
  projectWeight: number; // Ex: 0.40 (40%)
  cycleWeight: number;   // Ex: 0.60 (60%)
}

export interface ScoreCalculationResult {
  overallScore: number;          // Ex: 4.85
  formattedScore: string;        // "4.85" (Decimal 12,2)
  projectAverage: number;        // Ex: 4.90
  cycleAverage: number;          // Ex: 4.82
  totalFeedbacksCount: number;   // Total de projetos avaliados
  totalCyclesCount: number;      // Total de ciclos avaliados
  calculatedAt: string;          // ISO Timestamp
}

/**
 * Service de Dominio para Calculo de Reputacao (Score de 0 a 5 Estrelas).
 *
 * Principios:
 * - Precisao Aritmetica Absoluta: Utiliza decimal.js com ROUND_HALF_UP e 2 casas decimais.
 * - Fail-Safe contra Divisao por Zero: Retorna 0.00 de forma controlada se nao houver avaliacoes.
 * - Limites Estritos: Garante que nenhuma nota ultrapasse o intervalo [0.00, 5.00].
 * - Ponderacao Configuravel: Prioriza avaliacoes de ciclo (entregas consolidadas) vs pontuais.
 */
export class ReputationScoreService {
  public static readonly DEFAULT_PROJECT_WEIGHT = 0.4;
  public static readonly DEFAULT_CYCLE_WEIGHT = 0.6;
  public static readonly MIN_SCORE = 0.0;
  public static readonly MAX_SCORE = 5.0;

  /**
   * Calcula a media ponderada do freelancer com base em feedbacks de projetos e ciclos de avaliacao.
   */
  public calculateOverallScore(
    projectFeedbacks: ProjectFeedback[],
    cycleEvaluations: CycleEvaluation[],
    weights: ScoreWeights = {
      projectWeight: ReputationScoreService.DEFAULT_PROJECT_WEIGHT,
      cycleWeight: ReputationScoreService.DEFAULT_CYCLE_WEIGHT,
    }
  ): ScoreCalculationResult {
    // 1. Validar e filtrar feedbacks de projetos
    const validProjectScores: Decimal[] = [];
    for (const fb of projectFeedbacks) {
      this.validateScoreRange(fb.score, `Score do projeto '${fb.project_id}'`);
      validProjectScores.push(new Decimal(fb.score));
    }

    // 2. Validar e filtrar avaliacoes de ciclo
    const validCycleScores: Decimal[] = [];
    for (const cycle of cycleEvaluations) {
      this.validateScoreRange(cycle.general_score, `Score geral do ciclo '${cycle.cycle_identifier}'`);
      validCycleScores.push(new Decimal(cycle.general_score));
    }

    const hasProjects = validProjectScores.length > 0;
    const hasCycles = validCycleScores.length > 0;

    // Cenário de borda: Sem nenhum feedback (Proteção estrita contra divisão por zero)
    if (!hasProjects && !hasCycles) {
      return {
        overallScore: 0.0,
        formattedScore: "0.00",
        projectAverage: 0.0,
        cycleAverage: 0.0,
        totalFeedbacksCount: 0,
        totalCyclesCount: 0,
        calculatedAt: new Date().toISOString(),
      };
    }

    // 3. Calculo da media simples dos projetos: Sum(S_p) / N_p
    let projectAvg = new Decimal(0);
    if (hasProjects) {
      const sumProjects = validProjectScores.reduce((acc, curr) => acc.plus(curr), new Decimal(0));
      projectAvg = sumProjects.dividedBy(validProjectScores.length);
    }

    // 4. Calculo da media simples dos ciclos: Sum(S_c) / N_c
    let cycleAvg = new Decimal(0);
    if (hasCycles) {
      const sumCycles = validCycleScores.reduce((acc, curr) => acc.plus(curr), new Decimal(0));
      cycleAvg = sumCycles.dividedBy(validCycleScores.length);
    }

    // 5. Calculo da Media Ponderada
    let overallDecimal: Decimal;

    if (hasProjects && hasCycles) {
      const wProj = new Decimal(weights.projectWeight);
      const wCycle = new Decimal(weights.cycleWeight);
      const totalWeight = wProj.plus(wCycle);

      if (totalWeight.isZero()) {
        throw new ValidationError("A soma dos pesos de ponderacao nao pode ser zero");
      }

      overallDecimal = projectAvg.times(wProj).plus(cycleAvg.times(wCycle)).dividedBy(totalWeight);
    } else if (hasProjects) {
      // Apenas projetos disponiveis
      overallDecimal = projectAvg;
    } else {
      // Apenas ciclos disponiveis
      overallDecimal = cycleAvg;
    }

    // 6. Arredondamento regulatorio ROUND_HALF_UP com 2 casas decimais
    let finalRounded = overallDecimal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);

    // 7. Clamp de seguranca garantindo intervalo [0.00, 5.00]
    if (finalRounded.greaterThan(ReputationScoreService.MAX_SCORE)) {
      finalRounded = new Decimal(ReputationScoreService.MAX_SCORE);
    } else if (finalRounded.lessThan(ReputationScoreService.MIN_SCORE)) {
      finalRounded = new Decimal(ReputationScoreService.MIN_SCORE);
    }

    return {
      overallScore: finalRounded.toNumber(),
      formattedScore: finalRounded.toFixed(2),
      projectAverage: projectAvg.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      cycleAverage: cycleAvg.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber(),
      totalFeedbacksCount: validProjectScores.length,
      totalCyclesCount: validCycleScores.length,
      calculatedAt: new Date().toISOString(),
    };
  }

  /**
   * Valida se a nota esta contida estritamente no intervalo [0, 5]
   */
  private validateScoreRange(score: number, context: string): void {
    if (typeof score !== "number" || isNaN(score)) {
      throw new ValidationError(`${context} deve ser um valor numerico valido`);
    }
    if (score < ReputationScoreService.MIN_SCORE || score > ReputationScoreService.MAX_SCORE) {
      throw new ValidationError(
        `${context} (${score}) esta fora do limite regulatorio de ${ReputationScoreService.MIN_SCORE} a ${ReputationScoreService.MAX_SCORE} estrelas`
      );
    }
  }
}