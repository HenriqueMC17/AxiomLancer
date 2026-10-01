export interface OutboxEventProps {
  id: string;
  userId: string;
  aggregateType: string;
  aggregateId: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt?: Date;
  processedAt?: Date | null;
}

export class OutboxEvent {
  private readonly props: OutboxEventProps;

  constructor(props: OutboxEventProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      processedAt: props.processedAt ?? null,
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get aggregateType(): string {
    return this.props.aggregateType;
  }

  public get aggregateId(): string {
    return this.props.aggregateId;
  }

  public get eventType(): string {
    return this.props.eventType;
  }

  public get payload(): Record<string, unknown> {
    return this.props.payload;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get processedAt(): Date | null | undefined {
    return this.props.processedAt;
  }

  public isProcessed(): boolean {
    return this.props.processedAt !== null && this.props.processedAt !== undefined;
  }

  public markAsProcessed(processedAt: Date = new Date()): void {
    this.props.processedAt = processedAt;
  }
}
