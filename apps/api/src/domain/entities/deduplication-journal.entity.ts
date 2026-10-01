import { IdempotencyKeyVO } from '../value-objects/idempotency-key.vo';

export type DeduplicationStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface DeduplicationJournalProps {
  id: string;
  idempotencyKey: IdempotencyKeyVO;
  eventType: string;
  status: DeduplicationStatus;
  lockedUntil: Date;
  responsePayload?: Record<string, unknown> | null;
  errorMessage?: string | null;
  executionCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class DeduplicationJournal {
  private readonly props: DeduplicationJournalProps;

  constructor(props: DeduplicationJournalProps) {
    this.props = {
      ...props,
      executionCount: props.executionCount ?? 1,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get idempotencyKey(): IdempotencyKeyVO {
    return this.props.idempotencyKey;
  }

  public get eventType(): string {
    return this.props.eventType;
  }

  public get status(): DeduplicationStatus {
    return this.props.status;
  }

  public get lockedUntil(): Date {
    return this.props.lockedUntil;
  }

  public get responsePayload(): Record<string, unknown> | null | undefined {
    return this.props.responsePayload;
  }

  public get errorMessage(): string | null | undefined {
    return this.props.errorMessage;
  }

  public get executionCount(): number {
    return this.props.executionCount!;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt!;
  }

  public isLocked(now: Date = new Date()): boolean {
    return this.props.status === 'PROCESSING' && this.props.lockedUntil.getTime() > now.getTime();
  }

  public isCompleted(): boolean {
    return this.props.status === 'COMPLETED';
  }

  public isFailed(): boolean {
    return this.props.status === 'FAILED';
  }

  public markAsCompleted(payload?: Record<string, unknown>, now: Date = new Date()): void {
    this.props.status = 'COMPLETED';
    this.props.responsePayload = payload || null;
    this.props.updatedAt = now;
  }

  public markAsFailed(errorMessage: string, now: Date = new Date()): void {
    this.props.status = 'FAILED';
    this.props.errorMessage = errorMessage;
    this.props.updatedAt = now;
  }

  public renewLock(lockedUntil: Date, now: Date = new Date()): void {
    this.props.status = 'PROCESSING';
    this.props.lockedUntil = lockedUntil;
    this.props.executionCount = (this.props.executionCount || 1) + 1;
    this.props.updatedAt = now;
  }
}
