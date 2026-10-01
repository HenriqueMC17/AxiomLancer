import { z } from 'zod';

export const ContractStatusSchema = z.enum([
  'ACTIVE',
  'COMPLETED',
  'CANCELED',
  'PENDING_SIGNATURE',
]);

export type ContractStatus = z.infer<typeof ContractStatusSchema>;

export interface ClientDTO {
  id: string;
  userId: string;
  legalName: string;
  email: string;
  toneOfVoice?: string | null;
  billingPaused?: boolean;
}

export interface ContractDTO {
  id: string;
  userId: string;
  clientId: string;
  title: string;
  description?: string | null;
  contractValue: number;
  status: ContractStatus;
  startDate: string;
  endDate?: string | null;
}
