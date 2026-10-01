import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { JwtCookieSessionService, SESSION_COOKIE_NAME } from '../../../infrastructure/security/jwt-cookie-session.service';

declare module 'fastify' {
  interface FastifyRequest {
    userSession?: {
      userId: string;
      email: string;
      role?: string;
    };
  }
  interface FastifyReply {
    setBffSession(token: string): this;
    clearBffSession(): this;
  }
}

const bffAuthPluginAsync: FastifyPluginAsync = async (fastify) => {
  // Decorator para gravar cookie com diretrizes estritas Zero Trust
  fastify.decorateReply('setBffSession', function (this: FastifyReply, token: string) {
    this.setCookie(
      SESSION_COOKIE_NAME,
      token,
      JwtCookieSessionService.getSecureCookieOptions(),
    );
    return this;
  });

  // Decorator para remoção de sessão
  fastify.decorateReply('clearBffSession', function (this: FastifyReply) {
    this.clearCookie(SESSION_COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    return this;
  });

  // Hook ou decorator para rotas protegidas
  fastify.decorate('authenticateBff', async (request: FastifyRequest, reply: FastifyReply) => {
    const rawCookie = request.cookies[SESSION_COOKIE_NAME];

    if (!rawCookie) {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Sessão BFF não encontrada ou expirada.',
      });
    }

    // Se o cookie for assinado, desempacota o valor
    const unsigned = request.unsignCookie(rawCookie);
    const token = unsigned.valid ? unsigned.value : rawCookie;

    try {
      const decoded = await fastify.jwt.verify<{ userId: string; email: string; role?: string }>(token!);
      request.userSession = decoded;
    } catch {
      return reply.status(401).send({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Token de sessão inválido ou assinatura corrompida.',
      });
    }
  });
};

export const bffAuthPlugin = fp(bffAuthPluginAsync, {
  name: 'bff-auth-plugin',
});
