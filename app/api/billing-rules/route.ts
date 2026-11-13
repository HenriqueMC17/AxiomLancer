import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { RulesEngineService, ExecutionCandidate, EngineResult } from "@/core/services/rules-engine.service";

/**
 * GET /api/billing-rules
 * Retorna as reguas de cobranca ativas configuradas para o usuario autenticado.
 * Zero Trust: Isolamento estrito por session.userId.
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const userRules = state.rules.filter((r) => !r.user_id || r.user_id === session.userId);
    return ApiResponse.ok({ rules: userRules });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/billing-rules
 * Dispara o ciclo autonomo de avaliacao da esteira de cobranca.
 * Executa checagem de Botao de Panico (<12ms) e prevencao de duplicidade via DeduplicationJournal.
 */
export const POST = withAuth(async (_req, { session }) => {
  try {
    const state = Database.getState();
    const user = state.user;
    const clientMap = new Map(state.clients.map((c) => [c.id, c]));
    const userInvoices = state.invoices.filter((i) => i.user_id === session.userId);
    const activeRules = state.rules.filter(
      (r) => (!r.user_id || r.user_id === session.userId) && r.active
    );

    const todayStr = new Date().toISOString().split("T")[0];
    const results: EngineResult[] = [];
    let executedCount = 0;
    let skippedCount = 0;
    let abortedCount = 0;

    for (const invoice of userInvoices) {
      if (invoice.status === "PAID" || invoice.status === "CANCELED") continue;

      const client = clientMap.get(invoice.client_id);
      if (!client) continue;

      for (const rule of activeRules) {
        const offset = RulesEngineService.calculateOffsetDays(invoice.due_date, todayStr);

        // Verifica se a regra e candidata para o offset atual
        const isMatch =
          (rule.trigger_type === "PRE_DUE" && offset <= rule.offset_days && offset >= -3) ||
          (rule.trigger_type === "ON_DUE" && offset === 0) ||
          (rule.trigger_type === "POST_DUE_SHORT" && offset > 0 && offset <= 5) ||
          (rule.trigger_type === "POST_DUE_LONG" && offset > 5);

        if (!isMatch) continue;

        const candidate: ExecutionCandidate = {
          invoice,
          client,
          rule,
          targetDate: todayStr,
        };

        const result = RulesEngineService.executeCandidate(candidate, user, state.journal);
        results.push(result);

        if (result.status === "SUCCESS") {
          executedCount++;
          // Persiste no DeduplicationJournal em memoria
          Database.logExecution({
            event_id: RulesEngineService.generateEventId(invoice.id, todayStr, rule.id),
            invoice_id: invoice.id,
            trigger_day: todayStr,
            rule_id: rule.id,
            execution_id: result.executionId,
            processed_at: new Date().toISOString(),
          });
        } else if (result.status === "SKIPPED_DEDUPLICATED") {
          skippedCount++;
        } else if (result.status === "ABORTED_PANIC_BUTTON") {
          abortedCount++;
        }
      }
    }

    return ApiResponse.ok({
      ok: true,
      executedCount,
      skippedCount,
      abortedCount,
      results,
    });
  } catch (err) {
    return ApiResponse.error(err);
  }
});