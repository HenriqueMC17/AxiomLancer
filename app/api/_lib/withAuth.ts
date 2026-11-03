import { NextResponse } from "next/server";
import { AuthService, SessionPayload } from "@/lib/auth";

export type AuthedContext<TParams = Record<string, any>> = {
  session: SessionPayload;
  params: TParams;
};

/**
 * Higher-Order Function de autenticacao para API routes no Next.js 15 (App Router).
 * - Verifica o cookie axiom_session via AuthService (unico ponto de JWT).
 * - Aplica Zero Trust e rejeita tokens invalidos/inexistentes (HTTP 401).
 * - Resolve assincronamente os params de rotas dinamicas (Next.js 15 Promise params).
 *
 * Uso:
 *   export const GET = withAuth(async (req, { session, params }) => {
 *     // session.userId, session.email e params dinamicos disponiveis
 *   });
 */
export function withAuth<TParams extends Record<string, any> = Record<string, any>>(
  handler: (req: Request, ctx: AuthedContext<TParams>) => Promise<Response>
): (req: Request, routeCtx: { params: Promise<TParams> }) => Promise<Response> {
  return async (req: Request, routeCtx: { params: Promise<TParams> }): Promise<Response> => {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const token = cookieHeader.match(/axiom_session=([^;]+)/)?.[1];

    if (!token) {
      return NextResponse.json({ error: "Nao autorizado" }, { status: 401 });
    }

    const session = await AuthService.verifyToken(token);
    if (!session) {
      return NextResponse.json({ error: "Sessao expirada ou invalida" }, { status: 401 });
    }

    let resolvedParams = {} as TParams;
    if (routeCtx?.params) {
      resolvedParams = (await Promise.resolve(routeCtx.params)) ?? ({} as TParams);
    }

    return handler(req, { session, params: resolvedParams });
  };
}