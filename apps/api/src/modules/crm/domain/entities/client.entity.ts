export interface ClientProps {
  id: string;
  userId: string;
  legalName: string;
  email: string;
  toneOfVoice?: string | null;
  billingPaused?: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class Client {
  private readonly props: ClientProps;

  constructor(props: ClientProps) {
    this.props = {
      ...props,
      toneOfVoice: props.toneOfVoice ?? 'PROFESSIONAL',
      billingPaused: props.billingPaused ?? false,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
    };
  }

  public get id(): string {
    return this.props.id;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get legalName(): string {
    return this.props.legalName;
  }

  public get email(): string {
    return this.props.email;
  }

  public get toneOfVoice(): string | null | undefined {
    return this.props.toneOfVoice;
  }

  public get billingPaused(): boolean {
    return !!this.props.billingPaused;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }

  public pauseBilling(): void {
    this.props.billingPaused = true;
    this.props.updatedAt = new Date();
  }

  public resumeBilling(): void {
    this.props.billingPaused = false;
    this.props.updatedAt = new Date();
  }

  public updateToneOfVoice(tone: string): void {
    this.props.toneOfVoice = tone;
    this.props.updatedAt = new Date();
  }
}
