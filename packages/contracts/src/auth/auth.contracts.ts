import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('E-mail informado é inválido.'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres.'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export interface UserSessionDTO {
  userId: string;
  email: string;
  role: string;
}

export interface AuthSessionResponseDTO {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}
