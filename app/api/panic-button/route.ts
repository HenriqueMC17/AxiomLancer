import { togglePanicSchema } from "@/core/domain/schemas";
import { TogglePanicModeUseCase } from "@/core/use-cases/toggle-panic-mode.use-case";
import { InMemoryPanicRepository } from "@/infrastructure/repositories/in-memory/in-memory-panic.repository";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

const panicRepo = new InMemoryPanicRepository();
const togglePanicUseCase = new TogglePanicModeUseCase(panicRepo);

export const GET = withAuth(async () => {
  try {
    const isPaused = await panicRepo.getStatus();
    return ApiResponse.ok({
      billing_paused: isPaused,
      safe_mode_active: isPaused,
    });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const validated = togglePanicSchema.parse(body);

    const result = await togglePanicUseCase.execute({
      billingPaused: validated.billing_paused,
      reason: validated.reason,
    });

    logger.info("PANIC_BUTTON_TOGGLED", {
      billing_paused: result.billing_paused,
      reason: validated.reason ?? "nao informado",
      latency_ms: result.latencyMs,
    });

    return ApiResponse.ok(result);
  } catch (err) {
    return ApiResponse.error(err);
  }
});
