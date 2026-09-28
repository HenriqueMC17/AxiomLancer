export interface DistributedLockHandle {
  resource: string;
  token: string;
  acquired: boolean;
}

export interface IDistributedLockService {
  /**
   * Tenta adquirir atomicamente um lock distribuído para o recurso especificado.
   * Utiliza comando atômico SET key token NX PX ttlMs no Redis.
   */
  acquire(resource: string, ttlMs: number): Promise<DistributedLockHandle>;

  /**
   * Libera o lock atômico estritamente via script Lua se e somente se o token
   * atual for idêntico ao gravado, prevenindo que um processo libere lock expirado de outrem.
   */
  release(handle: DistributedLockHandle): Promise<boolean>;

  /**
   * Executa uma rotina crítica envolvida no lock atômico com liberação garantida (try/finally).
   */
  withLock<T>(resource: string, ttlMs: number, task: () => Promise<T>): Promise<T>;
}
