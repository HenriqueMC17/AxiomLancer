import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
  DashboardHeaderComponent,
  KpiSummaryComponent,
  CashflowProjectionComponent,
  PanicControlComponent,
  TaxVaultComponent,
  InvoicesTableComponent,
  LedgerAuditTableComponent,
  InvoiceModalComponent,
  ExpenseModalComponent,
} from './components';

describe('Dashboard Feature Components', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardHeaderComponent,
        KpiSummaryComponent,
        CashflowProjectionComponent,
        PanicControlComponent,
        TaxVaultComponent,
        InvoicesTableComponent,
        LedgerAuditTableComponent,
        InvoiceModalComponent,
        ExpenseModalComponent,
      ],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();
  });

  it('should emit openCreateInvoice and openCreateExpense from DashboardHeaderComponent', () => {
    const fixture = TestBed.createComponent(DashboardHeaderComponent);
    const comp = fixture.componentInstance;
    let invoiceEmitted = false;
    let expenseEmitted = false;

    comp.openCreateInvoice.subscribe(() => (invoiceEmitted = true));
    comp.openCreateExpense.subscribe(() => (expenseEmitted = true));

    comp.openCreateInvoice.emit();
    comp.openCreateExpense.emit();

    expect(invoiceEmitted).toBe(true);
    expect(expenseEmitted).toBe(true);
  });

  it('should render KPI metrics in KpiSummaryComponent', () => {
    const fixture = TestBed.createComponent(KpiSummaryComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('RECEITA LIQUIDADA');
    expect(compiled.textContent).toContain('CONTAS A RECEBER');
    expect(compiled.textContent).toContain('DESPESAS (OPEX)');
    expect(compiled.textContent).toContain('COFRE TRIBUTÁRIO');
  });

  it('should render health score and projection in CashflowProjectionComponent', () => {
    const fixture = TestBed.createComponent(CashflowProjectionComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Score de Saúde Financeira');
    expect(compiled.textContent).toContain('Projeção Preditiva de Fluxo de Caixa');
  });

  it('should emit submitInvoice from InvoiceModalComponent', () => {
    const fixture = TestBed.createComponent(InvoiceModalComponent);
    const comp = fixture.componentInstance;
    let submittedData: any = null;

    comp.submitInvoice.subscribe((data) => (submittedData = data));
    comp.form.clientName = 'Test Client Corp';
    comp.onSubmit();

    expect(submittedData).toBeTruthy();
    expect(submittedData.clientName).toBe('Test Client Corp');
  });

  it('should emit submitExpense from ExpenseModalComponent', () => {
    const fixture = TestBed.createComponent(ExpenseModalComponent);
    const comp = fixture.componentInstance;
    let submittedData: any = null;

    comp.submitExpense.subscribe((data) => (submittedData = data));
    comp.form.description = 'Cloud Server Billing';
    comp.form.amount = 1200;
    comp.onSubmit();

    expect(submittedData).toBeTruthy();
    expect(submittedData.description).toBe('Cloud Server Billing');
    expect(submittedData.amount).toBe(1200);
  });
});
