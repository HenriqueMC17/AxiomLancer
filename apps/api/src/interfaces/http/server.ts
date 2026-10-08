import 'dotenv/config';
import { buildApp } from './app';
import { env } from '../../infrastructure/config/env';
import { prisma } from '../../infrastructure/database/prisma.client';

/**
 * ==============================================================================
 * AXIOM LANCER - SERVER BOOTSTRAP & GRACEFUL SHUTDOWN (.agente-core STANDARD)
 * ==============================================================================
 */

async function bootstrap() {
  const app = await buildApp();
  const port = env.PORT;
  const host = env.HOST;

  try {
    await app.listen({ port, host });
    const accessibleUrl = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`⚡ AxiomLancer Financial Core rodando em ${accessibleUrl} (ou http://127.0.0.1:${port})`);
    console.log(`🔒 Modo Zero Trust BFF ativo com Cookies HttpOnly e SameSite=Strict`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful Shutdown: SIGTERM / SIGINT handling
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  for (const signal of signals) {
    process.on(signal, async () => {
      console.log(`\n🛑 Sinal ${signal} recebido. Drenando conexões e finalizando graceful shutdown...`);
      try {
        await app.close();
        await prisma.$disconnect();
        console.log('✓ Servidor HTTP encerrado e pool de conexões Prisma desconectado com sucesso.');
        process.exit(0);
      } catch (err) {
        console.error('❌ Falha ao finalizar processos durante graceful shutdown:', err);
        process.exit(1);
      }
    });
  }
}

bootstrap();
