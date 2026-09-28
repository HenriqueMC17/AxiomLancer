import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.spec.ts', 'src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/domain/**', 'src/application/**'],
      exclude: [
        'src/**/*.interface.ts',
        'src/**/*.dto.ts',
        'src/domain/entities/index.ts',
      ],
      thresholds: {
        statements: 95,
        branches: 90,
        functions: 95,
        lines: 95,
      },
    },
  },
  resolve: {
    alias: {
      '@domain': path.resolve(__dirname, './src/domain'),
      '@application': path.resolve(__dirname, './src/application'),
      '@infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@shared': path.resolve(__dirname, './src/shared'),
    },
  },
});
