import { describe, it, expect } from 'vitest';
import { Client } from '../../../src/modules/crm/domain/entities/client.entity';
import { Contract } from '../../../src/modules/crm/domain/entities/contract.entity';
import { Project } from '../../../src/modules/crm/domain/entities/project.entity';
import { CycleEvaluation } from '../../../src/modules/crm/domain/entities/cycle-evaluation.entity';
import { Money } from '../../../src/domain/value-objects/money.vo';

describe('CRM Bounded Context Entities', () => {
  it('deve gerenciar ciclo de vida e pausa de cobrança do Client', () => {
    const client = new Client({
      id: 'client-1',
      userId: 'user-1',
      legalName: 'Fintech Acme Corp',
      email: 'finance@acme.com',
    });

    expect(client.billingPaused).toBe(false);
    expect(client.toneOfVoice).toBe('PROFESSIONAL');

    client.pauseBilling();
    expect(client.billingPaused).toBe(true);

    client.resumeBilling();
    expect(client.billingPaused).toBe(false);

    client.updateToneOfVoice('DIRECT');
    expect(client.toneOfVoice).toBe('DIRECT');
  });

  it('deve gerenciar transições de status do Contract', () => {
    const contract = new Contract({
      id: 'contract-1',
      userId: 'user-1',
      clientId: 'client-1',
      title: 'Contrato de Desenvolvimento Mobile',
      contractValue: Money.from('35000.00'),
      status: 'PENDING_SIGNATURE',
      startDate: new Date('2026-10-01'),
    });

    expect(contract.status).toBe('PENDING_SIGNATURE');
    expect(contract.contractValue.toDatabaseDecimal()).toBe('35000.00');

    contract.sign();
    expect(contract.status).toBe('ACTIVE');
    expect(contract.signedAt).toBeInstanceOf(Date);

    contract.complete();
    expect(contract.status).toBe('COMPLETED');

    expect(() => contract.cancel()).toThrow('Contratos concluídos não podem ser cancelados.');
  });

  it('deve gerenciar ciclo de vida do Project', () => {
    const project = new Project({
      id: 'proj-1',
      userId: 'user-1',
      clientId: 'client-1',
      name: 'Design System Migration',
      budget: Money.from('12000.00'),
      status: 'IN_PROGRESS',
    });

    expect(project.name).toBe('Design System Migration');
    expect(project.budget.toDatabaseDecimal()).toBe('12000.00');
    expect(project.status).toBe('IN_PROGRESS');

    project.complete();
    expect(project.status).toBe('COMPLETED');
  });

  it('deve validar notas de avaliação no CycleEvaluation', () => {
    const evaluation = new CycleEvaluation({
      id: 'eval-1',
      userId: 'user-1',
      clientId: 'client-1',
      score: 9.5,
      feedback: 'Entrega pontual e código limpo.',
      cycleMonth: '2026-10',
    });

    expect(evaluation.score).toBe(9.5);
    expect(evaluation.feedback).toBe('Entrega pontual e código limpo.');

    expect(
      () =>
        new CycleEvaluation({
          id: 'eval-2',
          userId: 'user-1',
          clientId: 'client-1',
          score: 11,
          cycleMonth: '2026-10',
        }),
    ).toThrow('Score de avaliação deve estar entre 0 e 10');
  });
});
