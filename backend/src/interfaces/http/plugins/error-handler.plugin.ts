import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import {
  DomainError,
  DuplicateExecutionError,
  EntityNotFoundError,
} from '../../../domain/errors/domain.error';

export function registerErrorHandler(app: FastifyInstance): void {
  app.setErrorHandler((error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) => {
    // 1. Erros de validação Zod (Fail Fast na borda)
    if (error instanceof ZodError) {
      return reply.status(400).send({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Falha na validação de entrada de dados (Fail Fast).',
        issues: error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    // 2. Erros de concorrência ou bloqueio de idempotência (Anti-Spam)
    if (error instanceof DuplicateExecutionError) {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        code: error.code,
        message: error.message,
      });
    }

    // 3. Entidade não encontrada
    if (error instanceof EntityNotFoundError) {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        code: error.code,
        message: error.message,
      });
    }

    // 4. Erros de regras de negócio do Domínio
    if (error instanceof DomainError) {
      return reply.status(422).send({
        statusCode: 422,
        error: 'Unprocessable Entity',
        code: error.code,
        message: error.message,
      });
    }

    // 5. Erros não mapeados de infraestrutura / servidor
    request.log.error(error);
    return reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'Ocorreu um erro interno no processamento financeiro. A transação foi preservada.',
    });
  });
}
