import 'dotenv/config';
import { buildApp } from './app';

async function bootstrap() {
  const app = await buildApp();
  const port = Number(process.env.PORT) || 3333;
  const host = process.env.HOST || '0.0.0.0';

  try {
    await app.listen({ port, host });
    const accessibleUrl = host === '0.0.0.0' ? `http://localhost:${port}` : `http://${host}:${port}`;
    console.log(`⚡ AxiomLancer Financial Core rodando em ${accessibleUrl} (ou http://127.0.0.1:${port})`);
    console.log(`🔒 Modo Zero Trust BFF ativo com Cookies HttpOnly e SameSite=Strict`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();
