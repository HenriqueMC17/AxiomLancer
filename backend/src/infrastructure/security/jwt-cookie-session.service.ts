import { CookieSerializeOptions } from '@fastify/cookie';

export interface UserSessionPayload {
  userId: string;
  email: string;
  role?: string;
}

export const SESSION_COOKIE_NAME = 'axiom_session_token';

export class JwtCookieSessionService {
  /**
   * Diretrizes Zero Trust para cookies de sessão BFF:
   * HttpOnly: Previne roubo de token via scripts XSS
   * Secure: Transmitido estritamente via HTTPS em produção
   * SameSite=Strict: Previne requisições forjadas CSRF entre domínios
   * Signed: Assinatura criptográfica contra adulteração no cliente
   */
  public static getSecureCookieOptions(): CookieSerializeOptions {
    const isProduction = process.env.NODE_ENV === 'production';

    return {
      path: '/',
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      signed: true,
      maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
    };
  }
}
