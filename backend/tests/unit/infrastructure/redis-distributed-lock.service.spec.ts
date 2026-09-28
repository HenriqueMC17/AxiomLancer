import { describe, it, expect, vi } from 'vitest';
import { RedisDistributedLockService } from '../../../src/infrastructure/queue/redis-distributed-lock.service';
import { DuplicateExecutionError } from '../../../src/domain/errors/domain.error';
import Redis from 'ioredis';

describe('RedisDistributedLockService (Lua Script & Atomic Mutex)', () => {
  it('deve adquirir o lock com sucesso via comando atômico SET NX PX', async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue('OK'),
      eval: vi.fn().mockResolvedValue(1),
    } as unknown as Redis;

    const lockService = new RedisDistributedLockService(mockRedis);
    const handle = await lockService.acquire('invoice:inv-123', 5000);

    expect(handle.acquired).toBe(true);
    expect(handle.resource).toBe('invoice:inv-123');
    expect(handle.token).toBeDefined();
    expect(mockRedis.set).toHaveBeenCalledWith(
      'lock:invoice:inv-123',
      handle.token,
      'PX',
      5000,
      'NX',
    );
  });

  it('deve indicar falha de aquisição caso o recurso já esteja bloqueado', async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue(null), // Já existe lock ativo
      eval: vi.fn(),
    } as unknown as Redis;

    const lockService = new RedisDistributedLockService(mockRedis);
    const handle = await lockService.acquire('invoice:inv-123', 5000);

    expect(handle.acquired).toBe(false);
  });

  it('deve liberar o lock atomicamente via script Lua apenas se o token for idêntico', async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue('OK'),
      eval: vi.fn().mockResolvedValue(1),
    } as unknown as Redis;

    const lockService = new RedisDistributedLockService(mockRedis);
    const handle = await lockService.acquire('invoice:inv-123', 5000);
    const released = await lockService.release(handle);

    expect(released).toBe(true);
    expect(mockRedis.eval).toHaveBeenCalledWith(
      expect.stringContaining('redis.call("get", KEYS[1]) == ARGV[1]'),
      1,
      'lock:invoice:inv-123',
      handle.token,
    );
  });

  it('deve executar withLock e garantir liberação mesmo em caso de exceção', async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue('OK'),
      eval: vi.fn().mockResolvedValue(1),
    } as unknown as Redis;

    const lockService = new RedisDistributedLockService(mockRedis);

    await expect(
      lockService.withLock('invoice:inv-error', 5000, async () => {
        throw new Error('Falha simulada na operação crítica');
      }),
    ).rejects.toThrow('Falha simulada na operação crítica');

    // O release via script Lua deve ter sido executado no bloco finally
    expect(mockRedis.eval).toHaveBeenCalled();
  });

  it('deve lançar DuplicateExecutionError em withLock se o lock não puder ser adquirido', async () => {
    const mockRedis = {
      set: vi.fn().mockResolvedValue(null),
      eval: vi.fn(),
    } as unknown as Redis;

    const lockService = new RedisDistributedLockService(mockRedis);

    await expect(
      lockService.withLock('invoice:concurrent', 5000, async () => {
        return 'sucesso';
      }),
    ).rejects.toThrow(DuplicateExecutionError);
  });
});
