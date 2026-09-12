import { describe, it, expect } from "vitest";
import { copywriting } from "./copywriting";

describe("Copywriting SSOT Verification", () => {
  it("should have valid brand identity and slogans", () => {
    expect(copywriting.brand.name).toBe("AxiomLancer");
    expect(copywriting.brand.slogan).toContain("Elimine o constrangimento");
    expect(copywriting.brand.tagline).toBeDefined();
  });

  it("should contain exactly 4 tailored personas matching the ICP", () => {
    expect(copywriting.personas).toHaveLength(4);
    const personaIds = copywriting.personas.map((p) => p.id);
    expect(personaIds).toEqual(["dev", "designer", "consultant", "agency"]);

    copywriting.personas.forEach((persona) => {
      expect(persona.title).toBeDefined();
      expect(persona.pain).toBeDefined();
      expect(persona.solution).toBeDefined();
      expect(persona.weeklyGain).toMatch(/\+\d+h/);
    });
  });

  it("should contain all 6 core features including Previsio BI and Smart Escrows", () => {
    expect(copywriting.features).toHaveLength(6);
    const featureIds = copywriting.features.map((f) => f.id);
    expect(featureIds).toContain("smart-escrow");
    expect(featureIds).toContain("previsio-bi");
    expect(featureIds).toContain("panic-button-feature");
  });

  it("should configure the two-tier pricing model transparently", () => {
    expect(copywriting.pricing.plans).toHaveLength(2);
    const [soloPlan, agencyPlan] = copywriting.pricing.plans;

    expect(soloPlan.id).toBe("solo");
    expect(soloPlan.priceMonthly).toBe("49,90");
    expect(soloPlan.isPopular).toBe(true);

    expect(agencyPlan.id).toBe("agency");
    expect(agencyPlan.priceMonthly).toBe("129,90");
    expect(agencyPlan.isPopular).toBe(false);

    expect(copywriting.pricing.takeRate.regular.rate).toBe("TAXA 0%");
    expect(copywriting.pricing.takeRate.recovered.rate).toContain("comissão");
  });

  it("should define valid Panic Sandbox stages", () => {
    expect(copywriting.panicSandbox.stages).toHaveLength(3);
    const stageIds = copywriting.panicSandbox.stages.map((s) => s.id);
    expect(stageIds).toEqual(["d-5", "d-0", "d-2"]);
  });
});
