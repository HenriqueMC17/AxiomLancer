export interface PanicStateResult {
  billing_paused: boolean;
  latencyMs: number;
}

export interface IPanicRepository {
  getStatus(): Promise<boolean>;
  setPanicState(paused: boolean): Promise<PanicStateResult>;
}
