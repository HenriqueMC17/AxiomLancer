import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
});

export class AuthBffController {
  public registerRoutes(app: FastifyInstance): void {
    // 1. Criação de Sessão BFF (Login Seguro)
    app.post(
      '/api/v1/auth/session',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { email, password } = loginSchema.parse(request.body);

        // Mock / Validação de credencial para demonstração da sessão BFF
        // Em produção, valida hash com bcrypt no PrismaUserRepository
        const mockUserId = '11111111-2222-3333-4444-555555555555';

        const token = app.jwt.sign(
          {
            userId: mockUserId,
            email,
            role: 'FREELANCER_PRO',
          },
          { expiresIn: '7d' },
        );

        // Grava token exclusivamente no cookie assinado HttpOnly, Secure e SameSite=Strict
        reply.setBffSession(token);

        return reply.status(200).send({
          success: true,
          message: 'Sessão BFF inicializada com sucesso. Cookies seguros emitidos.',
          user: {
            id: mockUserId,
            email,
            role: 'FREELANCER_PRO',
          },
        });
      },
    );

    // 2. Consulta de Sessão Ativa
    app.get(
      '/api/v1/auth/me',
      {
        preHandler: [
          async (request, reply) => {
            // @ts-expect-error Fastify decorator
            await app.authenticateBff(request, reply);
          },
        ],
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({
          success: true,
          session: request.userSession,
        });
      },
    );

    // 3. Encerramento de Sessão (Logout Seguro)
    app.post('/api/v1/auth/logout', async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.clearBffSession();
      return reply.status(200).send({
        success: true,
        message: 'Sessão BFF encerrada com sucesso.',
      });
    });
  }
}
