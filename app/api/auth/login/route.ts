import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { AuthService } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/app/api/_lib/rateLimiter";
import { logger } from "@/lib/logger";
import { ApiResponse } from "@/lib/api-response";
import { AppError, AuthenticationError } from "@/core/errors/app-error";

/**
 * Obtem as configuracoes de autenticacao de forma segura.
 * Falha rapido (Fail Fast) e sem segredos hardcoded (Zero Secrets Policy - Secure by Design).
 */
function getAuthConfig() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    logger.error("AUTH_MISCONFIGURED", {
      reason: "ADMIN_EMAIL e ADMIN_PASSWORD devem ser fornecidos via variaveis de ambiente (Zero Secrets Policy).",
    });
    throw new AppError(
      "AUTH_CONFIG_ERROR",
      "Configuracao de credenciais administrativas ausente no ambiente do servidor.",
      500,
      {
        expected: "Variaveis de ambiente ADMIN_EMAIL e ADMIN_PASSWORD configuradas.",
        suggestion: "Configure as variaveis necessarias no arquivo de ambiente (.env.local ou producao).",
      }
    );
  }

  return {
    adminEmail,
    adminPassword,
    adminName: process.env.ADMIN_NAME || "Administrador",
    adminId: process.env.ADMIN_USER_ID || "usr_7keys_001",
  };
}

/**
 * Comparacao de strings em tempo constante para protecao contra Timing Attacks.
 */
function timingSafeCheck(input: string, target: string): boolean {
  const hashInput = crypto.createHash("sha256").update(input).digest();
  const hashTarget = crypto.createHash("sha256").update(target).digest();
  return crypto.timingSafeEqual(hashInput, hashTarget);
}

const LoginSchema = z.object({
  email: z.string().email("Formato de email invalido"),
  password: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    logger.warn("AUTH_RATE_LIMITED", { ip, retryAfterSeconds: rateLimit.retryAfterSeconds });
    return NextResponse.json(
      {
        error: "RATE_LIMIT_EXCEEDED",
        message: `Muitas tentativas de login. Tente novamente em ${Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60)} minuto(s).`,
        context: {
          retry_after_seconds: rateLimit.retryAfterSeconds,
          limit: 5,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "X-RateLimit-Limit": "5",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }
    const { email, password } = parsed.data;

    const authConfig = getAuthConfig();

    const emailMatches = timingSafeCheck(email.toLowerCase(), authConfig.adminEmail.toLowerCase());
    const passwordMatches = timingSafeCheck(password, authConfig.adminPassword);

    if (!emailMatches || !passwordMatches) {
      logger.warn("AUTH_FAILED", { ip, email });
      return ApiResponse.error(new AuthenticationError("Credenciais invalidas."));
    }

    // Login bem-sucedido -- reseta o contador de tentativas
    resetRateLimit(ip);
    logger.info("AUTH_SUCCESS", { userId: authConfig.adminId, email: authConfig.adminEmail });

    // AuthService e o UNICO ponto de geracao de JWT
    const token = await AuthService.createToken({
      userId: authConfig.adminId,
      email: authConfig.adminEmail,
      name: authConfig.adminName,
      plan: "core",
    });

    const response = ApiResponse.ok({
      ok: true,
      user: { name: authConfig.adminName, email: authConfig.adminEmail },
    });

    response.cookies.set("axiom_session", token, AuthService.getCookieOptions());
    return response;
  } catch (err) {
    return ApiResponse.error(err);
  }
}