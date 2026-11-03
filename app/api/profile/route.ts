import { z } from "zod";
import { Database } from "@/lib/db";
import { withAuth } from "@/app/api/_lib/withAuth";
import { ApiResponse } from "@/lib/api-response";

const UpdateProfileSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  social_name: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  phone: z.string().optional(),
  address_type: z.enum(["PF", "PJ"]).optional(),
  tax_id: z.string().optional(),
  cep: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  github_url: z.string().optional(),
  linkedin_url: z.string().optional(),
  portfolio_url: z.string().optional(),
  instagram_url: z.string().optional(),
});

/**
 * GET /api/profile
 * Retorna o perfil do usuario autenticado (Zero Trust / BOLA Prevention).
 */
export const GET = withAuth(async (_req, { session }) => {
  try {
    const profile = Database.getProfile(session.userId);
    return ApiResponse.ok({ profile });
  } catch (err) {
    return ApiResponse.error(err);
  }
});

/**
 * POST /api/profile
 * Atualiza os dados cadastrais do usuario autenticado isoladamente.
 */
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return ApiResponse.error(parsed.error);
    }
    const updated = Database.updateProfile(session.userId, parsed.data);
    return ApiResponse.ok({ ok: true, profile: updated });
  } catch (err) {
    return ApiResponse.error(err);
  }
});
