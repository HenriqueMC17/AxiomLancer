import { z } from "zod";

/**
 * Lead Capture Schema (Fail Fast Validation)
 * Strict validation rules for email and source tracking.
 */
export const LeadCaptureSchema = z.object({
  email: z
    .string({ required_error: "E-mail é obrigatório." })
    .trim()
    .toLowerCase()
    .min(1, { message: "Por favor, insira seu e-mail corporativo." })
    .email({ message: "Endereço de e-mail corporativo inválido." }),
  source: z.string().default("hero_lead_capture"),
  timestamp: z.number().default(() => Date.now()),
});

export type LeadCaptureInput = z.infer<typeof LeadCaptureSchema>;

export type ActionState = {
  success: boolean;
  message?: string;
  errors?: {
    email?: string[];
  };
};

/**
 * Defensive utility against Prototype Pollution when constructing dynamic maps.
 * Creates an object without prototype properties (Object.create(null)).
 */
export function createSafeDictionary<T>(): Record<string, T> {
  return Object.create(null);
}
