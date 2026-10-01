export interface CalculateTaxesInputDTO {
  grossAmount: string; // Ex: "15000.00"
  taxRatePercent?: string; // Ex: "6.0" (6%)
  taxComponents?: Array<{
    name: string;
    ratePercent: string;
  }>;
}

export interface CalculateTaxesOutputDTO {
  grossAmount: string;
  taxAmount: string;
  netAmount: string;
  effectiveTaxRatePercent: string;
  effectiveTaxRateDecimal: string;
  breakdown: {
    components: Array<{
      name: string;
      ratePercent: string;
      amount: string;
    }>;
  };
}
