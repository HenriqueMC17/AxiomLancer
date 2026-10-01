import { DeduplicationJournal } from '../entities/deduplication-journal.entity';

export interface LockAcquisitionResult {
  acquired: boolean;
  record: DeduplicationJournal;
  isCompleted: boolean;
  cachedResponse?: Record<string, unknown> | null;
}

export interface IDeduplicationJournalRepository {
  findByKey(idempotencyKey: string): Promise<DeduplicationJournal | null>;
  /**
   * Tenta adquirir atomicamente o bloqueio na tabela DeduplicationJournal.
   * Se já existir e estiver completado, retorna isCompleted=true e cachedResponse.
   * Se já existir e o bloqueio estiver ativo, retorna acquired=false.
   * Se não existir ou o bloqueio expirou, adquire o lock e retorna acquired=true.
   */
  acquireLock(
    idempotencyKey: string,
    eventType: string,
    lockTtlSeconds: number,
  ): Promise<LockAcquisitionResult>;

  save(journal: DeduplicationJournal): Promise<void>;
  update(journal: DeduplicationJournal): Promise<void>;
}
