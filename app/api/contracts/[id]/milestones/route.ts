import { z } from "zod";
import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";
import { MilestoneEscrow } from "@/core/domain/types";

const createMilestoneSchema = z.object({
  title: z.string().min(3, "Titulo deve ter no minimo 3 caracteres"),
  amount: z.number().positive("Valor deve ser positivo"),
  deliverable_url: z.string().url("URL de entrega invalida").optional(),
});

/**
 * GET /api/contracts/[id]/milestones
 * Lista os marcos de entrega em custodia (Smart Escrow) para o contrato.
 */
export const GET = withAuth<{ id: string }>(async (_req, { session, params }) => {
  try {
    const contract = Database.findContract(params.id, session.userId);
    if (!contract) {
      return ApiResponse.error(new Error("Contrato nao encontrado"));
    }

    const milestones = Database.listMilestones(params.id);
    return ApiResponse.ok({ milestones });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/contracts/[id]/milestones
 * Cria um novo marco contratual com custodia atrelada.
 */
export const POST = withAuth<{ id: string }>(async (req, { session, params }) => {
  try {
    const contract = Database.findContract(params.id, session.userId);
    if (!contract) {
      return ApiResponse.error(new Error("Contrato nao encontrado"));
    }

    const body = await req.json();
    const parsed = createMilestoneSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }

    const newMilestone: MilestoneEscrow = {
      id: `ms_${Date.now()}`,
      contract_id: params.id,
      title: parsed.data.title,
      amount: parsed.data.amount,
      status: "LOCKED",
      deliverable_url: parsed.data.deliverable_url,
    };

    const saved = Database.createMilestone(newMilestone);
    return ApiResponse.ok({ milestone: saved }, 201);
  } catch (err) {
    return ApiResponse.error(err);
  }
});