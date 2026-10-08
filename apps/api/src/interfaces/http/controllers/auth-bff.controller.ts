import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres.'),
  email: z.string().email('E-mail inválido.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
});

const profileSchema = z.object({
  name: z.string().min(2).optional(),
  taxId: z.string().min(11, 'CPF ou CNPJ inválido.'),
  phone: z.string().min(10, 'Telefone inválido.'),
  profession: z.string().min(2, 'Profissão é obrigatória.'),
  pixKey: z.string().min(3, 'Chave PIX é obrigatória.'),
  companyName: z.string().optional(),
});

export class AuthBffController {
  public registerRoutes(app: FastifyInstance): void {
    // 1. Criação de Sessão BFF (Login Seguro)
    app.post(
      '/api/v1/auth/session',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { email } = loginSchema.parse(request.body);

        const mockUserId = '11111111-2222-3333-4444-555555555555';

        const token = app.jwt.sign(
          {
            userId: mockUserId,
            email,
            role: 'FREELANCER_PRO',
            onboardingStatus: 'COMPLETED',
          },
          { expiresIn: '7d' },
        );

        reply.setBffSession(token);

        return reply.status(200).send({
          success: true,
          message: 'Sessão BFF inicializada com sucesso. Cookies seguros emitidos.',
          user: {
            id: mockUserId,
            email,
            role: 'FREELANCER_PRO',
            onboardingStatus: 'COMPLETED',
          },
        });
      },
    );

    // 2. Registro de Novo Usuário (com Onboarding pendente)
    app.post(
      '/api/v1/auth/register',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { name, email } = registerSchema.parse(request.body);

        const newUserId = 'usr_' + Date.now().toString(36);

        const token = app.jwt.sign(
          {
            userId: newUserId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: 'FREELANCER_PRO',
            onboardingStatus: 'TOUR_PENDING',
          },
          { expiresIn: '7d' },
        );

        reply.setBffSession(token);

        return reply.status(201).send({
          success: true,
          message: 'Conta criada com sucesso. Bem-vindo ao AxiomLancer!',
          user: {
            id: newUserId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: 'FREELANCER_PRO',
            onboardingStatus: 'TOUR_PENDING',
          },
        });
      },
    );

    // 3. Conclusão do Tour de Onboarding -> PROFILE_PENDING
    app.put(
      '/api/v1/auth/onboarding/tour',
      {
        preHandler: [
          async (request, reply) => {
            // @ts-expect-error Fastify decorator
            await app.authenticateBff(request, reply);
          },
        ],
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const session = request.userSession;
        if (!session) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const updatedToken = app.jwt.sign(
          {
            ...session,
            onboardingStatus: 'PROFILE_PENDING',
          },
          { expiresIn: '7d' },
        );

        reply.setBffSession(updatedToken);

        return reply.status(200).send({
          success: true,
          message: 'Tour de onboarding concluído. Próxima etapa: Perfil progressivo.',
          onboardingStatus: 'PROFILE_PENDING',
        });
      },
    );

    // 4. Conclusão do Perfil Progressivo -> COMPLETED
    app.put(
      '/api/v1/auth/profile',
      {
        preHandler: [
          async (request, reply) => {
            // @ts-expect-error Fastify decorator
            await app.authenticateBff(request, reply);
          },
        ],
      },
      async (request: FastifyRequest, reply: FastifyReply) => {
        const session = request.userSession;
        if (!session) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const profileData = profileSchema.parse(request.body);

        const updatedToken = app.jwt.sign(
          {
            ...session,
            name: profileData.name || session.name,
            onboardingStatus: 'COMPLETED',
          },
          { expiresIn: '7d' },
        );

        reply.setBffSession(updatedToken);

        return reply.status(200).send({
          success: true,
          message: 'Perfil progressivo salvo com sucesso. Cockpit liberado!',
          user: {
            id: session.userId,
            name: profileData.name || session.name,
            email: session.email,
            role: session.role || 'FREELANCER_PRO',
            onboardingStatus: 'COMPLETED',
            ...profileData,
          },
        });
      },
    );

    // 5. Consulta de Sessão Ativa
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

    // 6. Encerramento de Sessão (Logout Seguro)
    app.post('/api/v1/auth/logout', async (_request: FastifyRequest, reply: FastifyReply) => {
      reply.clearBffSession();
      return reply.status(200).send({
        success: true,
        message: 'Sessão BFF encerrada com sucesso.',
      });
    });
  }
}
