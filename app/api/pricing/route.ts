import { NextResponse } from "next/server";
import { PricingCalculatorService } from "@/core/services/pricing-calculator.service";
import { pricingCalculationSchema } from "@/core/domain/schemas";
import { withAuth } from "@/app/api/_lib/withAuth";

export const POST = withAuth(async (req) => {
  try {
    const body = await req.json();
    const parsed = pricingCalculationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }
    const d = parsed.data;
    // Mapeia snake_case do schema Zod para camelCase do PricingInput (service)
    const result = PricingCalculatorService.calculate({
      monthlyPersonalExpenses: d.monthly_personal_expenses,
      monthlyBusinessExpenses: d.monthly_business_expenses,
      desiredNetIncome: d.desired_net_income,
      billableHoursPerWeek: d.billable_hours_per_week,
      weeksWorkedPerYear: d.weeks_worked_per_year,
      simplesNacionalType: d.simples_nacional_type,
      annualRevenueRBT12: d.annual_revenue_rbt12,
      payrollRatioFatorR: d.payroll_ratio_fator_r,
      gatewayType: d.gateway_type,
    });
    // FIX: padroniza resposta para { success: true, result } igual ao restante das rotas
    return NextResponse.json({ success: true, result });
  } catch {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
});