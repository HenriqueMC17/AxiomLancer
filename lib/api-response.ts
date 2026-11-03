import { NextResponse } from "next/server";
import { AppError } from "@/core/errors/app-error";
import { ZodError } from "zod";

export class ApiResponse {
  public static ok<T>(data: T, status: number = 200) {
    return NextResponse.json(data, { status });
  }

  public static error(err: unknown) {
    if (err instanceof AppError) {
      return NextResponse.json(err.toEnvelope(), { status: err.statusCode });
    }

    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "SCHEMA_VALIDATION_ERROR",
          message: "Os dados de entrada nao atendem aos requisitos do contrato da API.",
          context: {
            input_received: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
            expected: "Valores estritamente validados pelo schema Zod correspondente.",
            suggestion: "Corrija os campos apontados na lista de inconsistencias antes de reenviar.",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 400 }
      );
    }

    const detail = err instanceof Error ? err.message : "Erro desconhecido";
    return NextResponse.json(
      {
        error: "INTERNAL_SERVER_ERROR",
        message: "Ocorreu uma falha inesperada durante o processamento da requisicao.",
        context: {
          input_received: null,
          expected: "Execucao idempotente e integra no cluster de backend.",
          suggestion: "Consulte os logs corporativos de auditoria utilizando o timestamp informado.",
          detail: process.env.NODE_ENV !== "production" ? detail : undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
