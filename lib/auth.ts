import { SignJWT, jwtVerify } from "jose";

/**
 * Validacao Fail Fast do segredo de autenticacao conforme as diretrizes
 * de seguranca do ecossistema 7Keys (Zero Secrets Policy).
 */
function getValidatedJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "FATAL_SECURITY_ERROR: [Zero Secrets Policy] A variavel de ambiente JWT_SECRET e obrigatoria e nao foi informada no ambiente."
    );
  }
  if (secret.length < 32) {
    throw new Error(
      "FATAL_SECURITY_ERROR: JWT_SECRET possui entropia insuficiente. Sao necessarios ao menos 32 caracteres para HS256."
    );
  }
  return new TextEncoder().encode(secret);
}

const JWT_SECRET = getValidatedJwtSecret();

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  plan: string;
}

export class AuthService {
  /**
   * Gera token JWT HttpOnly-ready com duracao controlada (Zero Trust / Short TTL).
   * Padrao de 2 horas ou parametrizado via variavel de ambiente.
   */
  public static async createToken(
    payload: SessionPayload,
    expiresIn: string = process.env.JWT_EXPIRES_IN || "2h"
  ): Promise<string> {
    return new SignJWT({ ...payload })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET);
  }

  /**
   * Verifica token JWT aplicando obrigatoriamente a Algorithm Allowlist.
   * Impede ataques de confusao de algoritmo e 'alg: none' (Secure by Design / Zero Trust).
   */
  public static async verifyToken(token: string): Promise<SessionPayload | null> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        algorithms: ["HS256"],
      });
      return payload as unknown as SessionPayload;
    } catch {
      return null;
    }
  }

  /** Opcoes de cookie seguras (BFF pattern) */
  public static getCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      maxAge: 2 * 60 * 60, // 2 horas alinhado a expiracao do token
      path: "/",
    };
  }
}
