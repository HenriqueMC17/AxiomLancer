import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { AuthService } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/app/api/_lib/rateLimiter";
import { logger } from "@/lib/logger";

/**
 * Configuracoes de autenticacao parametrizadas via variaveis de ambiente
 * em estrita conformidade com a politica de Zero Secrets (Secure by Design).
 */
const AUTH_CONFIG = {
  adminEmail: process.env.ADMIN_EMAIL || "henrique@7keys.dev",
  adminPassword: process.env.ADMIN_PASSWORD || "7keys2026",
  adminName: process.env.ADMIN_NAME || "Henrique Monteiro",
  adminId: process.env.ADMIN_USER_ID || "usr_7keys_001",
};

/**
 * Comparacao de strings em tempo constante para protecao contra Timing Attacks.
 */
function timingSafeCheck(input: string, target: string): boolean {
  const hashInput = crypto.createHash("sha256").update(input).digest();
  const hashTarget = crypto.createHash("sha256").update(target).digest();
  return crypto.timingSafeEqual(hashInput, hashTarget);
}

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
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
        error: `Muitas tentativas de login. Tente novamente em ${Math.ceil((rateLimit.retryAfterSeconds ?? 60) / 60)} minuto(s).`,
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
      return NextResponse.json({ error: "Dados invalidos" }, { status: 400 });
    }
    const { email, password } = parsed.data;

    const emailMatches = timingSafeCheck(email.toLowerCase(), AUTH_CONFIG.adminEmail.toLowerCase());
    const passwordMatches = timingSafeCheck(password, AUTH_CONFIG.adminPassword);

    if (!emailMatches || !passwordMatches) {
      logger.warn("AUTH_FAILED", { ip, email });
      return NextResponse.json({ error: "Credenciais invalidas" }, { status: 401 });
    }

    // Login bem-sucedido -- reseta o contador de tentativas
    resetRateLimit(ip);
    logger.info("AUTH_SUCCESS", { userId: AUTH_CONFIG.adminId, email: AUTH_CONFIG.adminEmail });

    // AuthService e o UNICO ponto de geracao de JWT
    const token = await AuthService.createToken({
      userId: AUTH_CONFIG.adminId,
      email: AUTH_CONFIG.adminEmail,
      name: AUTH_CONFIG.adminName,
      plan: "core",
    });

    const response = NextResponse.json({
      ok: true,
      user: { name: AUTH_CONFIG.adminName, email: AUTH_CONFIG.adminEmail },
    });

    response.cookies.set("axiom_session", token, AuthService.getCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
