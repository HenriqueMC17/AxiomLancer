/**
 * Envelope Universal de Erros - Lei L3 (@agente-core Constituicao Suprema)
 * "Falhe rapido, com contexto rico, nunca em silencio."
 */

export interface ErrorContext {
  input_received?: unknown;
  expected?: string;
  suggestion?: string;
  [key: string]: unknown;
}

export interface ApiErrorEnvelope {
  error: string;
  message: string;
  context: ErrorContext;
  timestamp: string;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly context: ErrorContext;

  constructor(
    code: string,
    message: string,
    statusCode: number = 400,
    context: ErrorContext = {}
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.context = context;
  }

  public toEnvelope(): ApiErrorEnvelope {
    return {
      error: this.code,
      message: this.message,
      context: this.context,
      timestamp: new Date().toISOString(),
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context: ErrorContext = {}) {
    super("VALIDATION_ERROR", message, 400, context);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, identifier: string | number) {
    super(
      "NOT_FOUND_ERROR",
      `${resource} identificado por '${identifier}' nao foi encontrado no sistema.`,
      404,
      {
        input_received: identifier,
        expected: `Um ID existente de ${resource}.`,
        suggestion: `Confira se o registro existe na base de dados antes de executar esta acao.`,
      }
    );
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Credenciais invalidas ou sessao expirada.", context: ErrorContext = {}) {
    super("AUTHENTICATION_ERROR", message, 401, {
      expected: "Cookie de sessao JWT HttpOnly valido.",
      suggestion: "Autentique-se atraves da tela de login para obter novo token.",
      ...context,
    });
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Acesso nao autorizado ao recurso solicitado.", context: ErrorContext = {}) {
    super("FORBIDDEN_ERROR", message, 403, {
      expected: "Permissao de proprietario do recurso para o usuario autenticado.",
      suggestion: "Verifique se voce possui direitos de acesso sobre o identificador fornecido.",
      ...context,
    });
    this.name = "ForbiddenError";
  }
}

export class BusinessRuleViolationError extends AppError {
  constructor(code: string, message: string, context: ErrorContext = {}) {
    super(code, message, 422, context);
    this.name = "BusinessRuleViolationError";
  }
}