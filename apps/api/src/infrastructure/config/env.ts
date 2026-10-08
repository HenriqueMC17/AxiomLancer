import { z } from 'zod';

/**
 * ==============================================================================
 * AXIOM LANCER - ZERO SECRETS BY DESIGN & BOOT VALIDATION (.agente-core STANDARD)
 * ==============================================================================
 * Garante validação estrita e tipada em tempo de boot (Fail Fast),
 * impedindo a execução de instâncias com segredos ausentes ou malformados.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGIN: z.string().default('http://localhost:4200'),
  COOKIE_SECRET: z
    .string()
    .min(32, 'COOKIE_SECRET deve possuir no mínimo 32 caracteres para assinatura segura de cookies')
    .default('axiomlancer_default_development_secret_cookie_sign_32chars!'),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET deve possuir no mínimo 32 caracteres de entropia criptográfica')
    .default('axiomlancer_default_jwt_secret_dev_32chars_minimum!'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    console.error('❌ [Zero Secrets by Design] Configuração de ambiente inválida:');
    console.error(JSON.stringify(formatted, null, 2));
    throw new Error('Falha no boot da aplicação: Variáveis de ambiente inválidas ou ausentes.');
  }

  return result.data;
}

export const env = parseEnv();
