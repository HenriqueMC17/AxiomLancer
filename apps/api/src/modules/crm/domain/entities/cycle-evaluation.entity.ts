export interface CycleEvaluationProps {
  id: string;
  userId: string;
  clientId: string;
  score: number;
  feedback?: string | null;
  cycleMonth: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class CycleEvaluation {
  private readonly props: CycleEvaluationProps;

  constructor(props: CycleEvaluationProps) {
    if (props.score < 0 || props.score > 10) {
      throw new Error(`Score de avaliação deve estar entre 0 e 10. Recebido: ${props.score}`);
    }
    this.props = {
      ...props,
      feedback: props.feedback ?? null,
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

  public get clientId(): string {
    return this.props.clientId;
  }

  public get score(): number {
    return this.props.score;
  }

  public get feedback(): string | null | undefined {
    return this.props.feedback;
  }

  public get cycleMonth(): string {
    return this.props.cycleMonth;
  }

  public get createdAt(): Date {
    return this.props.createdAt!;
  }

  public get updatedAt(): Date | null | undefined {
    return this.props.updatedAt;
  }
}
