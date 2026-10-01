import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import {
  IDistributedLockService,
  DistributedLockHandle,
} from '../../application/ports/distributed-lock-service.interface';
import { DuplicateExecutionError } from '../../domain/errors/domain.error';

// Script Lua para liberação atômica segura (CAS de liberação)
// Evita a clássica anomalia distribuída de deletar o lock de outro processo caso o TTL tenha expirado
const LUA_RELEASE_LOCK = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;

export class RedisDistributedLockService implements IDistributedLockService {
  constructor(private readonly redisClient: Redis) {}

  public async acquire(resource: string, ttlMs: number): Promise<DistributedLockHandle> {
    const lockKey = `lock:${resource}`;
    const token = randomUUID();

    // Comando atômico SET key token NX (se não existir) PX (expiração em ms)
    const result = await this.redisClient.set(lockKey, token, 'PX', ttlMs, 'NX');

    const acquired = result === 'OK';

    return {
      resource,
      token,
      acquired,
    };
  }

  public async release(handle: DistributedLockHandle): Promise<boolean> {
    if (!handle.acquired) {
      return false;
    }

    const lockKey = `lock:${handle.resource}`;
    // Execução atômica do script Lua no servidor Redis
    const result = await this.redisClient.eval(
      LUA_RELEASE_LOCK,
      1,
      lockKey,
      handle.token,
    );

    return result === 1;
  }

  public async withLock<T>(resource: string, ttlMs: number, task: () => Promise<T>): Promise<T> {
    const handle = await this.acquire(resource, ttlMs);

    if (!handle.acquired) {
      throw new DuplicateExecutionError(
        resource,
        `Concorrência distribuída bloqueada via Redis Lock para o recurso '${resource}'.`,
      );
    }

    try {
      return await task();
    } finally {
      await this.release(handle);
    }
  }
}
